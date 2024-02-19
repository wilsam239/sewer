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
  projects.value = allProjects.filter((p) =>
    p.name.toLowerCase().includes(projectFilter.value.toLowerCase())
  );
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
  console.log(
    "Open the dialog, with mode 'pipeline', passing in the playlist id"
  );
}

function createRelease(project?: Project) {
  openNewDialog.value = 'release';
  selectedProject.value = project?.id;
  console.log(
    "Open the dialog, with mode 'release', passing in the playlist id"
  );
}

function generateColor(name: string): string {
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
</script>
<template>
  <q-input
    square
    outlined
    v-model="projectFilter"
    label="Filter Projects"
    @update:model-value="filterFn"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
  <q-list bordered class="rounded-borders">
    <q-item clickable v-ripple @click="createNewPipeline()">
      <q-item-section avatar>
        <q-avatar
          rounded
          color="green"
          text-color="white"
          icon="add"
          size="48px"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <span class="text-weight-medium"> Run New Pipeline </span>
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-for="project of projects"
      v-bind:key="project.id"
      clickable
      v-ripple
      :to="'/dashboard/' + project.id"
    >
      <q-avatar
        rounded
        class="q-mr-md"
        :style="{ backgroundColor: generateColor(project.name) }"
      >
        {{ project.name[0] }}
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

      <q-item-section side>
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
                <!-- <q-item clickable>
                  <q-item-section avatar>
                    <q-icon name="preview"></q-icon>
                  </q-item-section>
                  <q-item-section>View</q-item-section>
                </q-item> -->
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
      </q-item-section>
    </q-item>
  </q-list>

  <q-page-container v-if="openNewDialog === 'pipeline'">
    <NewPipelineDialog :project="selectedProject"></NewPipelineDialog>
  </q-page-container>
  <q-page-container v-else-if="openNewDialog === 'release'">
    <NewReleaseDialog :project="selectedProject"></NewReleaseDialog>
  </q-page-container>
</template>