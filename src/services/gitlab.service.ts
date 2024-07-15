import { Group, Project } from '@openstapps/gitlab-api';
import { BehaviorSubject, Observable, catchError, forkJoin, from, map, mergeMap, of, tap, throwError } from 'rxjs';
import { SnackbarService } from './snackbar.service';

const SCOPE = ['api'];

interface GitSession {
  client_id: string;
  access_token?: string;
  refresh_token?: string;
  expiry?: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  created_at: number;
}

export interface Pipeline {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
  name: string | null;
}

class Gitlab {
  private snack = SnackbarService;
  private url = 'https://gitlab.correllink.com/api/v4';

  loadingState = new BehaviorSubject(true);
  private userSession: GitSession;

  private actions: Set<string> = new Set();

  private projects: Project[] = [];
  private pipelines: Pipeline[] = [];

  readonly pipelinesUpdated = new BehaviorSubject<Pipeline[]>([]);

  constructor() {
    const autoRefresh = () => {
      if (this.userSession.refresh_token) {
        console.log('Triggering auto token refresh');
        this.refreshToken().subscribe();
      }
    };

    this.userSession = JSON.parse(
      localStorage.getItem('sewer_userSession') ??
        JSON.stringify({
          client_id: '',
        })
    );

    // autoRefresh();

    setInterval(() => {
      autoRefresh();
    }, this.minutesToMilliseconds(20));

    setInterval(() => {
      if (this.isLoggedIn) {
        this.poll();
      }
    }, this.minutesToMilliseconds(1));
  }

  poll() {
    // created, waiting_for_resource, preparing, pending, running, success, failed, canceled, skipped, manual, scheduled
    const queue = this.pipelines.filter((p) => !['success', 'failed', 'canceled', 'skipped'].includes(p.status));

    // queue.forEach((p) => {
    //   this.fetchPipeline(p.id, p.project_id)
    //     .pipe(
    //       tap((resp) => {
    //         let existing = this.pipelines.find((ep) => ep.id === p.id);
    //         existing = resp;
    //       })
    //     )
    //     .subscribe();
    // });

    console.info('Polling for updates...');
    this.fetchPipelines().subscribe();
  }

  minutesToMilliseconds(mins: number) {
    return mins * 60 * 1000;
  }

  clearSession() {
    this.userSession = {
      client_id: this.clientID,
    };

    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   * @param length
   */
  private generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  /**
   * Taken from the api docs
   * https://developer.spotify.com/documentation/web-api/howtos/web-app-profile
   */
  private async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Function to generate a random state value
  private generateState() {
    return Math.random().toString(36).substring(2, 15);
  }
  /**
   * Go to the spotify oauth page to get an exchange code
   */
  async loginNoCode() {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    const state = this.generateState();
    localStorage.setItem('sewer_verifier', verifier);
    const params = new URLSearchParams();
    params.append('client_id', this.clientID);
    params.append('response_type', 'code');
    params.append('redirect_uri', `${location.protocol}//${location.host}/sewer/login`);
    params.append('scope', SCOPE.join(' '));
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);
    params.append('state', state);

    document.location = `https://gitlab.correllink.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * After coming back from spotify oauth page, call the api to login now that we have an exchange code
   * @param code Exchange code from spotify api
   * @returns
   */
  loginWithCode(code: string) {
    const verifier = localStorage.getItem('sewer_verifier');
    const params = new URLSearchParams();
    const state = this.generateState();

    params.append('client_id', this.clientID);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', `${location.protocol}//${location.host}/sewer/login`);
    params.append('code_verifier', verifier!);

    params.append('state', state);
    return this.api('https://gitlab.correllink.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    }).pipe(
      tap((response: TokenResponse) => {
        this.postLogin(response);
      })
      // mergeMap(() => this.fetchMe())
    );
  }

  findProject(id: number) {
    return this.projects.find((p) => p.id === id);
  }

  fetchProject(id: number) {
    const found = this.projects.find((p) => p.id === id);
    if (this.projects.length === 0 || !found) {
      return this.api(`/projects/${id}`).pipe(
        tap((project: Project) => {
          this.projects.push(project);
        })
      );
    } else {
      console.info(`Project ${id} already exists`);
      return of(found);
    }
  }

  fetchProjects() {
    if (this.projects.length === 0) {
      return this.api('/groups').pipe(
        mergeMap((groups: Group[]) => {
          return forkJoin(
            groups.map((p) => {
              return this.api(`/groups/${p.id}/projects?archived=false`);
            })
          );
        }),
        tap((projects: Project[][]) => {
          const flattened = projects.flat();

          flattened.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
          this.projects = flattened;
        }),
        map(() => this.projects)
      );
    } else {
      return of(this.projects);
    }
  }

  fetchProjectPipelines(p: Project) {
    return this.api(`/projects/${p.id}/pipelines`).pipe(
      map((resp: Pipeline[]) => {
        const existing = this.pipelines.filter((p) => `${p.project_id}` === `${p.id}`);

        if (resp.length === 0) {
          console.log(this.pipelines);
          console.info(`Pipeline data unchanged - using existing data for ${p.id}`);
          console.log(existing);
          return existing;
        } else {
          console.info('Pipeline data changed - using new data.');
          const unchanged = existing.filter((p) => !resp.some((r) => r.id === p.id));
          const result = unchanged.concat(resp);

          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

          console.log(result);
          return result;
        }
      })
    );
  }

  fetchPipeline(id: number, project: number): Observable<Pipeline> {
    return this.api(`/projects/${project}/pipelines/${id}`);
  }

  fetchPipelines() {
    return this.fetchProjects().pipe(
      map((projects) => {
        return projects.filter((p) => !p.archived);
      }),
      mergeMap((projects) => {
        return forkJoin(
          projects.map((p) => {
            return this.api(`/projects/${p.id}/pipelines`);
          })
        ).pipe(map((pipelines: Pipeline[][]) => pipelines.flat()));
      }),
      tap((pipelines) => {
        pipelines.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        console.log(pipelines);
        this.pipelines = pipelines;
        this.pipelinesUpdated.next(pipelines);
        console.log(this.pipelines);
      })
    );
  }

  generateColor(name: string): string {
    // Seed for consistent randomness
    let seed = 0;
    for (let i = 0; i < name.length; i++) {
      seed += name.charCodeAt(i);
    }

    // Use HSL color model
    const hue = (seed * 137.5) % 360; // Limit hue to 0-360 degrees
    const saturation = 50; // Fixed saturation
    const lightness = 50; // Fixed lightness

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * (lightness / 100) - 1)) * (saturation / 100);
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness / 100 - c / 2;

    let r = 0,
      g = 0,
      b = 0;
    if (hue >= 0 && hue < 60) {
      r = c;
      g = x;
    } else if (hue >= 60 && hue < 120) {
      r = x;
      g = c;
    } else if (hue >= 120 && hue < 180) {
      g = c;
      b = x;
    } else if (hue >= 180 && hue < 240) {
      g = x;
      b = c;
    } else if (hue >= 240 && hue < 300) {
      r = x;
      b = c;
    } else if (hue >= 300 && hue < 360) {
      r = c;
      b = x;
    }

    // Convert RGB to hexadecimal
    const rgbToHex = (x: number): string => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const hexColor = `#${rgbToHex(r + m)}${rgbToHex(g + m)}${rgbToHex(b + m)}`;
    return hexColor;
  }

  /**
   * Get the users info from the /me endpoint
   */
  /* fetchMe() {
    return this.api('me').pipe(
      tap((me) => {
        this.me = me;
      })
    );
  } */

  /* fetchPlaylists() {
    this.actions.add(ACTIONS.FETCH_PLAYLISTS);
    const items: SpotifyApi.PlaylistObjectSimplified[] = [];
    const getNext = (u = `users/${this.me!.id}/playlists`): Observable<any> => {
      return this.api(u).pipe(
        mergeMap((response: SpotifyApi.ListOfUsersPlaylistsResponse) => {
          items.push(...response.items);
          return response.next ? getNext(response.next) : of(response);
        })
      );
    };

    return getNext().pipe(
      tap(() => {
        this.actions.delete(ACTIONS.FETCH_PLAYLISTS);
      }),
      map(() => {
        return items;
      })
    );
  } */

  /**
   * Fetch a spotify playlist, and if necessary, make a subplaylist out of it so that we can use it for bingo
   * @param id Id of the spotify playlist
   * @returns
   */
  /* fetchPlaylist(id: string): Observable<SpotifyApi.PlaylistObjectFull> {
    return this.api(`playlists/${id}`).pipe(
      tap((playlist) => {
        const fixString = (inputString: string) => {
          let fixedString = inputString;
          let hasReplacements = true;

          while (hasReplacements) {
            const previousString = fixedString;
            fixedString = fixedString
              .replace(/&#x2F;/g, '/')
              .replace(/&#x3A;/g, ':');

            hasReplacements = fixedString !== previousString;
          }

          return fixedString;
        };

        if (playlist.description) {
          playlist.description = fixString(playlist.description);
        }
      })
    );
  } */

  /* fetchPlaylistTracks(playlist: SpotifyApi.PlaylistObjectFull) {
    this.actions.add(ACTIONS.FETCH_TRACKS);
    const getTracks = (items: SpotifyApi.PlaylistTrackObject[]) => {
      return items.filter((i) => i.track).map((i) => i.track!);
    };
    const items: SpotifyApi.TrackObjectFull[] = getTracks(
      playlist.tracks.items
    );
    const getNext = (u = playlist.tracks.next): Observable<any> => {
      if (u) {
        return this.api(u).pipe(
          mergeMap((response: SpotifyApi.PlaylistTrackResponse) => {
            items.push(...getTracks(response.items));
            return response.next ? getNext(response.next) : of(response);
          })
        );
      } else {
        return of('');
      }
    };

    return getNext().pipe(
      tap(() => {
        this.actions.delete(ACTIONS.FETCH_TRACKS);
      }),
      map(() => {
        return items;
      })
    );
  } */

  /* fetchPlaybackState(): Observable<SpotifyApi.CurrentPlaybackResponse> {
    return this.api('me/player').pipe(
      tap((resp) => {
        if (resp && resp.item && resp.item.type == 'track') {
          this.currentPlaybackState.next(resp);
          // console.log(state)
        } else {
          this.currentPlaybackState.next(undefined);
          this.currentTrackId.next('');
        }
      })
    );
  } */

  /* fetchQueue(): Observable<SpotifyApi.UsersQueueResponse> {
    if (this.queue.length > 0) {
      return of({ queue: this.queue } as SpotifyApi.UsersQueueResponse);
    }
    return this.api('me/player/queue');
  } */

  /**
   * The api call that is made to spotify with fetch requests and converted to rxjs
   * @param _url URL to go to, can be just a subsection eg: /playlists or can be a whole url
   *
   * If a subssection, it will be prepended with the spotify api url
   * @param init The request headers, body, and auth
   * @returns
   */
  private api(_url: string, init?: RequestInit, forceNoAuth = false) {
    const url = _url.startsWith('https://') ? _url : this.url + _url;

    let updatedInit: { [key: string]: any } = init ?? ({} as any);
    const headers = updatedInit.headers ?? {};
    if ((!init || !headers.authorization) && this.access_token && !forceNoAuth) {
      updatedInit = {
        ...updatedInit,
        headers: {
          ...headers,
          authorization: `Bearer ${this.access_token}`,
        },
      };
    }
    return from(fetch(url, updatedInit)).pipe(
      mergeMap((response) => {
        return from(response.text()).pipe(
          mergeMap((body) => {
            if (response.status < 400) {
              return of(body);
            } else {
              return throwError(() => JSON.parse(body));
            }
          }),
          map((body) => {
            if (body.length > 0) {
              return JSON.parse(body);
            } else {
              return { items: [] };
            }
          })
        );
      }),
      catchError((err) => {
        if (err) {
          console.error(err);
          this.snack.msgError('API Error', err.message);
        }
        if (!err) {
          return of(err);
        }
        return throwError(() => err);
      })
    );
  }

  logout() {
    this.userSession.access_token = undefined;
    this.userSession.refresh_token = undefined;
    this.userSession.expiry = undefined;
    // console.log(window.location.protocol);
    window.location.href = `${window.location.protocol}//${window.location.host}/sewer/#/login`;
    // this.userSession.user = undefined;
  }

  refreshToken() {
    console.log('Refreshing token');
    const params = new URLSearchParams();
    params.append('client_id', this.clientID);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.refresh_token);

    return this.api(
      'https://gitlab.correllink.com/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
      true
    ).pipe(
      tap((response: TokenResponse) => {
        console.log('Token refreshed!');
        this.postLogin(response);
      }),
      // mergeMap(() => this.fetchMe()),
      catchError((e) => {
        if (e.error_description == 'Refresh token revoked') {
          this.refresh_token = '';
        }
        return of(e);
      })
    );
  }

  /**
   * Actions after login and a successful token response has been returned
   * @param response
   */
  private postLogin(response: TokenResponse) {
    this.access_token = response.access_token;
    this.refresh_token = response.refresh_token;
    this.expiry = response.expires_in;
  }

  /*  get me() {
    return this.userSession.user ?? undefined;
  } */

  /* set me(u: SpotifyApi.UserObjectPrivate | undefined) {
    this.userSession.user = u;
    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  } */

  get clientID() {
    return this.userSession.client_id;
  }

  set clientID(id: string) {
    this.userSession.client_id = id;
    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  }

  get expiry() {
    return this.userSession.expiry ?? 0;
  }
  set expiry(expires_in: number) {
    this.userSession.expiry = Date.now() + expires_in * 1000;
    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  }

  set access_token(at: string) {
    this.userSession.access_token = at;
    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  }
  get access_token() {
    return this.userSession.access_token ?? '';
  }

  set refresh_token(at: string) {
    this.userSession.refresh_token = at;
    localStorage.setItem('sewer_userSession', JSON.stringify(this.userSession));
  }

  get refresh_token() {
    return this.userSession.refresh_token ?? '';
  }

  get isLoggedIn() {
    const loggedIn =
      !!this.userSession.access_token && !!this.userSession.expiry && this.userSession.expiry > Date.now();

    if (!loggedIn && !!this.access_token) {
      this.access_token = '';
    }

    return loggedIn;
  }

  get loading() {
    return this.loadingState.getValue();
  }

  set loading(v: boolean) {
    if (this.actions.size === 0 || v) {
      this.loadingState.next(v);
    } else {
      console.log('Still stuff loading, hold your horses');
    }
  }
}

export const GitlabService = new Gitlab();
