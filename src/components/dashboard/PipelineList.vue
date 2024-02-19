<script setup lang="ts">
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Ref, computed, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GeneratorDialog from './GeneratorDialog.vue';
import SongList from './SongList.vue';
import { SnackbarService } from 'src/services/snackbar.service';
import { GitlabService, Pipeline } from 'src/services/gitlab.service';

import { Project } from '@openstapps/gitlab-api';

const gitlab = GitlabService;
const route = useRoute();
const router = useRouter();
const project: Ref<Project | undefined> = ref(undefined);

const pipelines: Ref<Pipeline[]> = ref([]);

const loading = ref(true);

const statusMap = {
  'In Progress': [
    'created',
    'waiting_for_resource',
    'preparing',
    'pending',
    'scheduled',
    'running',
  ],
  Complete: ['success', 'failed', 'canceled', 'skipped', 'manual'],
};

const statusIcon = {
  'In Progress': 'play_circle_outline',
  pending: 'pause_circle_outline',
  running: 'play_circle_outline',
  Complete: 'stop_circle',
};

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

function checkRoute() {
  console.log('Route id: ' + route.params['id']);
  gitlab.loading = true;
  if (route.params['id'] !== 'all') {
    fetchProject(parseInt(route.params['id'] as string, 10));
  } else if (route.params['id'] !== undefined) {
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
}
const pendingPipelines = computed(() =>
  pipelines.value.filter((p) => statusMap['In Progress'].includes(p.status))
);
const completedPipelines = computed(() =>
  pipelines.value.filter((p) => statusMap['Complete'].includes(p.status))
);


watch(
  route,
  (r) => {
    checkRoute();
  },
  {}
);

onMounted(() => {
  checkRoute();
});
</script>
<style lang="scss">
.status-card {
  min-height: 250px;
}
body.screen--lg {
}
body.screen--md {
}
body.screen--sm {
}
body.screen--xs {
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
  <div class="full-width column q-pa-lg" id="all-status-container">
    <q-card flat bordered class="status-card q-mb-lg">
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="play_circle_outline" size="48px"> </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>In Progress</q-item-label>
          <!-- <q-item-label caption>Subhead</q-item-label> -->
        </q-item-section>
      </q-item>
      <q-list class="pipeline-list">
        <q-item clickable v-for="song of pendingPipelines" v-bind:key="song.id">
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
    </q-card>

    <q-card flat bordered class="status-card">
      <q-item>
        <q-item-section avatar>
          <q-avatar
            icon="play_circle_outline"
            size="48px"

          >
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Completed</q-item-label>
          <!-- <q-item-label caption>Subhead</q-item-label> -->
        </q-item-section>
      </q-item>
      <q-list class="pipeline-list">
        <q-item
          clickable
          v-for="song of completedPipelines"
          v-bind:key="song.id"
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
    </q-card>
  </div>
</template>
