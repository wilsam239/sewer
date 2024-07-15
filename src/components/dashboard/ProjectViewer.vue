<script setup lang="ts">
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Ref, computed, onMounted, onUnmounted, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GeneratorDialog from './GeneratorDialog.vue';
import SongList from './SongList.vue';
import { SnackbarService } from 'src/services/snackbar.service';
import { GitlabService, Pipeline } from 'src/services/gitlab.service';

import { Project } from '@openstapps/gitlab-api';
import PipelineList from './PipelineList.vue';
import { filter, Subject } from 'rxjs';

const gitlab = GitlabService;
const route = useRoute();
const router = useRouter();
const project: Ref<Project | undefined> = ref(undefined);

const pipelines: Ref<Pipeline[]> = ref([]);

const loading = ref(true);

const statusMap = {
  'In Progress': ['created', 'waiting_for_resource', 'preparing', 'pending', 'scheduled', 'running'],
  Complete: ['success', 'failed', 'canceled', 'skipped', 'manual'],
};
const statuses = [
  'created',
  'waiting_for_resource',
  'preparing',
  'pending',
  'scheduled',
  'running',
  'success',
  'failed',
  'canceled',
  'skipped',
  'manual',
];
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
        // songs.forEach((s, i) => {
        //   s.status = statuses[i % statuses.length];
        // });
        pipelines.value = songs;
        gitlab.loading = false;
      })
    )
    .subscribe();
}

function checkRoute(updateLoading = false) {
  console.log('Route id: ' + route.params['id']);
  if (updateLoading) {
    gitlab.loading = true;
  }
  if (route.params['id'] !== 'all') {
    fetchProject(parseInt(route.params['id'] as string, 10));
  } else if (route.params['id'] !== undefined) {
    project.value = undefined;
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
const pendingPipelines = computed(() => pipelines.value.filter((p) => statusMap['In Progress'].includes(p.status)));
const completedPipelines = computed(() => pipelines.value.filter((p) => statusMap['Complete'].includes(p.status)));

const refreshSubject = new Subject<string>();

const refreshSubscription = refreshSubject.subscribe(() => checkRoute());
const interval = setInterval(() => refreshSubject.next(''), 10000);

watch(
  route,
  (r) => {
    gitlab.loading = true;
    checkRoute();
  },
  {}
);

onMounted(() => {
  checkRoute(true);
});

onUnmounted(() => {
  refreshSubscription.unsubscribe();
  clearInterval(interval);
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
  <div id="project-header" class="q-ml-lg q-mr-lg q-mt-lg row content-center items-center justify-between">
    <div id="project-title" class="row content-center items-center">
      <q-avatar
        rounded
        class="q-mr-md"
        :style="{
          backgroundColor: gitlab.generateColor(project?.name ?? 'all'),
        }">
        {{ (project?.name[0] ?? 'a').toUpperCase() }}
      </q-avatar>
      <div class="text-h5 text-weight-bold">
        {{ project?.name ?? 'All Projects' }}
      </div>
    </div>
    <!-- <div id="project-actions" class="row content-center items-center">
      <q-btn outline class="q-mr-lg">
        <q-icon name="far fa-plus" class="q-mr-sm" size="xs"></q-icon>
        New Pipeline
      </q-btn>
      <q-btn outline>
        <q-icon name="fas fa-tag" class="q-mr-sm" size="xs"></q-icon>
        New Release
      </q-btn>
    </div> -->
  </div>
  <div class="full-width column q-pa-lg" id="all-status-container">
    <q-card flat bordered class="status-card q-mb-lg">
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="far fa-circle-play" size="lg"> </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>In Progress</q-item-label>
          <!-- <q-item-label caption>Subhead</q-item-label> -->
        </q-item-section>
      </q-item>
      <PipelineList :pipelines="pendingPipelines" :mini="false" :project="project"></PipelineList>
    </q-card>

    <q-card flat bordered class="status-card">
      <q-item>
        <q-item-section avatar>
          <q-avatar icon="far fa-circle-stop" size="lg"> </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Completed</q-item-label>
          <!-- <q-item-label caption>Subhead</q-item-label> -->
        </q-item-section>
      </q-item>
      <q-item>
        <PipelineList :pipelines="completedPipelines" :mini="false" :project="project"></PipelineList>
      </q-item>
    </q-card>
  </div>
</template>
