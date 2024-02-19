<script setup lang="ts">
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Ref, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import GeneratorDialog from './GeneratorDialog.vue';
import SongList from './SongList.vue';
import { SnackbarService } from 'src/services/snackbar.service';
import { GitlabService, Pipeline } from 'src/services/gitlab.service';

import { Project } from '@openstapps/gitlab-api';

const gitlab = GitlabService;
const route = useRoute();
const project: Ref<Project | undefined> = ref(undefined);

const pipelines: Ref<Pipeline[]> = ref([]);

const loading = ref(true);

function fetchProject(id: number) {
  gitlab
    .fetchProject(id)
    .pipe(
      tap((pl) => {
        project.value = pl;
      }),
      mergeMap((playlist) => {
        return gitlab.fetchProjectPipelines(playlist);
      }),
      tap((songs) => {
        pipelines.value = songs;
        gitlab.loading = false;
      })
    )
    .subscribe();
}

watch(route, (r) => {
  if (r.params['id'] !== 'all') {
    gitlab.loadingState.next(true);
    fetchProject(parseInt(r.params['id'] as string, 10));
  } else {
    gitlab
      .fetchPipelines()
      .pipe(
        tap((songs) => {
          pipelines.value = songs;
          gitlab.loading = false;
        })
      )
      .subscribe();
  }
});
</script>
<style lang="scss">
.now-playing {
  color: $primary;
}
.song-text-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.song-number {
  width: 14px;
}

#pipeline-description {
  word-break: break-all;
}

body.screen--lg {
  #pipeline-title {
    font-size: 3.5em;
  }
  .pipeline-image {
    width: 250px;
    height: 250px;
    min-width: 250px;
    min-height: 250px;
  }
}
body.screen--md {
  #pipeline-title {
    font-size: 2.5em;
  }
  .pipeline-image {
    width: 200px;
    height: 200px;
    min-width: 200px;
    min-height: 200px;
  }
}
body.screen--sm {
  #pipeline-title {
    font-size: 1.5em;
  }
  .pipeline-image {
    width: 150px;
    height: 150px;
    min-width: 150px;
    min-height: 150px;
  }
}
body.screen--xs {
  #pipeline-title {
    font-size: 1em;
  }
  .pipeline-image {
    width: 100px;
    height: 100px;
    min-width: 100px;
    min-height: 100px;
  }
}

/*
#pipeline-title {
  width: 75%;
}

#pipeline-title,
#pipeline-description {
  max-width: 75%;
} */
</style>
<template>
  <div class="column">
    <div>
      <q-list>
        <q-item
          clickable
          v-for="(song, index) of pipelines"
          v-bind:key="song.id + '_' + index"
        >
          <div class="column justify-center q-mr-md song-number">
            <!-- <div v-if="song.id == currentId">
              <q-spinner></q-spinner>
            </div> -->
            <div>
              {{ song.id }}
            </div>
          </div>
          <q-item-section avatar rounded class="q-mr-md">
            <!-- <q-img
              class="rounded-borders"
              :src="
                song.album.images.reduce((prev, cur) => {
                  return (prev.width ?? 0) < (cur.width ?? 0) ? prev : cur;
                }).url
              "
            /> -->
          </q-item-section>

          <q-item-section>
            <q-item-label class="song-text-label">{{ song.name }}</q-item-label>
            <!-- <span class="song-text-label text-grey-8">
              {{ song.artists.map((a) => a.name).join(', ') }}
            </span> -->
          </q-item-section>
          <q-item-section>
            <!-- <q-item-label class="song-text-label text-grey-8">{{
              song.album.name
            }}</q-item-label> -->
          </q-item-section>

          <q-item-section side class="q-mr-lg">
            <q-item-label lines="1">
              <!-- <span v-bind:class="song.id == currentId ? '' : 'text-grey-8'">
                {{ millisToMinutesAndSeconds(song.duration_ms) }}
              </span> -->
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
