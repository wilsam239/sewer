<script setup lang="ts">
import { Project } from '@openstapps/gitlab-api';
import { GitlabService, Pipeline } from 'src/services/gitlab.service';
import { onMounted, ref } from 'vue';

interface StatusInfo {
  icon: string;
  title: string;
  colour: string;
}

const gitlab = GitlabService;

const props = defineProps<{
  pipelines: Pipeline[];
  mini: boolean;
  project?: Project;
}>();

const loading = ref(true);
const statusMap: { [key: string]: StatusInfo } = {
  created: {
    icon: 'far fa-edit',
    title: 'Created',
    colour: 'rgba(255, 87, 51, 0.7)',
  },
  waiting_for_resource: {
    icon: 'far fa-hourglass-half',
    title: 'Waiting',
    colour: 'rgba(51, 255, 87, 0.7)',
  },
  preparing: {
    icon: 'far fa-list-alt',
    title: 'Preparing',
    colour: 'rgba(87, 51, 255, 0.7)',
  },
  pending: {
    icon: 'far fa-pause-circle',
    title: 'Pending',
    colour: 'rgba(51, 255, 197, 0.7)',
  },
  scheduled: {
    icon: 'far fa-calendar-alt',
    title: 'Scheduled',
    colour: 'rgba(51, 197, 255, 0.7)',
  },
  running: {
    icon: 'far fa-play-circle',
    title: 'Running',
    colour: 'rgba(255, 51, 197, 0.7)',
  },
  success: {
    icon: 'far fa-check-circle',
    title: 'Success',
    colour: 'rgba(51, 255, 51, 0.7)',
  },
  failed: {
    icon: 'far fa-times-circle',
    title: 'Failed',
    colour: 'rgba(255, 51, 51, 0.7)',
  },
  canceled: {
    icon: 'far fa-times-circle',
    title: 'Canceled',
    colour: 'rgba(216, 216, 216, 0.7)',
  },
  skipped: {
    icon: 'far fa-arrow-circle-right',
    title: 'Skipped',
    colour: 'rgba(153, 153, 153, 0.7)',
  },
  manual: {
    icon: 'far fa-file-alt',
    title: 'Manual',
    colour: 'rgba(255, 165, 0, 0.7)',
  },
};

function getTimeSince(updatedAt: string) {
  const now = new Date();
  const updatedTime = new Date(updatedAt);
  const timeDifference = now.getTime() - updatedTime.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Updated ${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

function getRefIcon(p: Pipeline) {
  const isRefMatch = (ref: string): boolean =>
    /^(v?\d+\.\d+\.\d+)$/.test(ref) && !ref.includes('/');

  return isRefMatch(p.ref) ? 'fas fa-tag' : 'fas fa-code-branch';
}

function getPipelineProject(p: Pipeline) {
  return gitlab.findProject(p.project_id)?.name ?? 'Unknown';
}
onMounted(() => {
  /*
  {
    "id": 497,
    "iid": 23,
    "project_id": 78,
    "sha": "87e06aeb2b4f7e0bebd8779615468993f60fc0a4",
    "ref": "master",
    "status": "success",
    "source": "web",
    "created_at": "2024-02-13T06:21:40.760Z",
    "updated_at": "2024-02-13T06:32:41.655Z",
    "web_url": "https://gitlab.correllink.com/farmlab/dropzone/dropzone-web/-/pipelines/497",
    "name": null
  }
  */
  console.log(props.pipelines.values);
});
</script>
<style lang="scss">
.status-card {
  min-height: 150px;
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

.pipeline-item {
  border-bottom: 1px solid white;
}

.pipeline-ref-label {
  background-color: rgb(40, 43, 45);
  width: fit-content;
  padding: 0 0.25em;
  color: #bfbfc3;
}

.pipeline-status {
  width: 100px;
  border-radius: 2em;
  padding: 0 8px;
  .status-icon {
    margin-right: 4px;
  }
}
</style>
<template>
  <div class="full-width column q-pa-lg">
    <q-list class="pipeline-list" v-if="pipelines.length > 0">
      <q-item
        v-for="song of pipelines"
        v-bind:key="song.id"
        class="pipeline-item"
      >
        <div class="column justify-center q-mr-md pipeline-id">
          <div>#{{ song.id }}</div>
        </div>
        <q-item-section class="q-mr-md">
          <div
            class="pipeline-status row no-wrap justify-start items-center content-center"
            :style="{ backgroundColor: statusMap[song.status].colour }"
          >
            <q-icon
              :name="statusMap[song.status].icon"
              class="status-icon"
              v-if="song.status !== 'running'"
            ></q-icon
            ><q-icon
              name="fas fa-spinner"
              class="fa-spin status-icon"
              v-else
            ></q-icon>
            {{ statusMap[song.status].title }}
          </div>
        </q-item-section>
        <q-item-section v-if="!project">
          <q-item-label class="pipeline-ref-label">
            {{ getPipelineProject(song) }}
          </q-item-label>
          <!-- <span class="song-text-label text-grey-8">
              {{ song.artists.map((a) => a.name).join(', ') }}
            </span> -->
        </q-item-section>
        <q-item-section>
          <q-item-label class="pipeline-ref-label">
            <q-icon class="ref-icon" :name="getRefIcon(song)"></q-icon>
            {{ song.ref }}
          </q-item-label>
          <!-- <span class="song-text-label text-grey-8">
              {{ song.artists.map((a) => a.name).join(', ') }}
            </span> -->
        </q-item-section>
        <q-item-section>
          {{ getTimeSince(song.updated_at) }}
          <!-- <q-item-label class="song-text-label text-grey-8">{{
              song.album.name
            }}</q-item-label> -->
        </q-item-section>

        <q-item-section side class="q-mr-lg">
          <q-btn
            flat
            round
            color="primary"
            icon="fas fa-arrow-up-right-from-square"
            size="sm"
            :href="song.web_url"
            target="_blank"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="row justify-center content-center items-center" v-else>
      No pipelines to show
    </div>
  </div>
</template>
