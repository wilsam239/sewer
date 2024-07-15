<script setup lang="ts">
import { Project } from '@openstapps/gitlab-api';
import { useDebounceFn } from '@vueuse/core';
import { tap } from 'rxjs/operators';
import { GitlabService } from 'src/services/gitlab.service';
import { Ref, onMounted, ref } from 'vue';
import NewPipelineDialog from './NewPipelineDialog.vue';
import NewReleaseDialog from './NewReleaseDialog.vue';

// const gitlab = GitlabService;

let allProjects: Project[] = [];
const projects: Ref<Project[]> = ref([]);
const projectFilter = ref('');
const gitlab = GitlabService;

const selectedProject: Ref<number | undefined> = ref(undefined);

const openNewDialog: Ref<'pipeline' | 'release' | undefined> = ref(undefined);

const filterFn = useDebounceFn(() => {
  console.log('Filtering with: ' + projectFilter.value);
  if (!projectFilter.value) {
    projects.value = allProjects;
  }
  projects.value = allProjects.filter((p) => p.name.toLowerCase().includes(projectFilter.value.toLowerCase()));
}, 300);

onMounted(() => {
  gitlab
    .fetchProjects()
    .pipe(
      tap((projectsFound) => {
        allProjects = projectsFound;
        projects.value = projectsFound;
        gitlab.loading = false;
      })
    )
    .subscribe();
});

function createNewPipeline(project?: Project) {
  openNewDialog.value = 'pipeline';
  selectedProject.value = project?.id;
  console.log("Open the dialog, with mode 'pipeline', passing in the playlist id");
}

function createRelease(project?: Project) {
  openNewDialog.value = 'release';
  selectedProject.value = project?.id;
  console.log("Open the dialog, with mode 'release', passing in the playlist id");
}
</script>
<template>
  <q-input square outlined v-model="projectFilter" label="Filter Projects" @update:model-value="filterFn">
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  <q-list bordered class="rounded-borders">
    <q-item clickable v-ripple to="all">
      <q-avatar rounded class="q-mr-md" :style="{ backgroundColor: gitlab.generateColor('all') }"> A </q-avatar>

      <q-item-section>
        <q-item-label lines="1">
          <span class="text-weight-medium">
            <q-tooltip>All Projects</q-tooltip>
            All Projects
          </span>
        </q-item-label>
        <q-item-label lines="1">
          <span class="text-grey-8">
            <q-tooltip>View pipelines for all projects</q-tooltip>
            View pipelines for all projects
          </span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item v-for="project of projects" v-bind:key="project.id" clickable v-ripple :to="'/dashboard/' + project.id">
      <q-avatar rounded class="q-mr-md" :style="{ backgroundColor: gitlab.generateColor(project.name) }">
        {{ project.name[0].toUpperCase() }}
      </q-avatar>

      <q-item-section>
        <q-item-label lines="1">
          <span class="text-weight-medium">
            <q-tooltip>{{ project.name }}</q-tooltip>
            {{ project.name }}
          </span>
        </q-item-label>
        <q-item-label lines="1">
          <span class="text-grey-8">
            <q-tooltip>{{ project.description }}</q-tooltip>
            {{ project.description }}
          </span>
        </q-item-label>
      </q-item-section>

      <!-- <q-item-section side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn
            size="12px"
            flat
            dense
            round
            icon="more_vert"
            v-on:click.prevent
          >
            <q-menu auto-close class="bg-grey-9">
              <q-list>
                <q-item clickable @click="createNewPipeline(project)">
                  <q-item-section avatar>
                    <q-icon name="note_add"></q-icon>
                  </q-item-section>
                  <q-item-section>Run Pipeline</q-item-section>
                </q-item>

                <q-item clickable @click="createRelease(project)">
                  <q-item-section avatar>
                    <q-icon name="project_add"></q-icon>
                  </q-item-section>
                  <q-item-section>Create Release</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section> -->
    </q-item>
  </q-list>

  <q-page-container v-if="openNewDialog === 'pipeline'">
    <NewPipelineDialog :project="selectedProject"></NewPipelineDialog>
  </q-page-container>
  <q-page-container v-else-if="openNewDialog === 'release'">
    <NewReleaseDialog :project="selectedProject"></NewReleaseDialog>
  </q-page-container>
</template>
