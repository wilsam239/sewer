<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { tap } from 'rxjs';
import { GitlabService } from 'src/services/gitlab.service';

// 4ffa1fff3b5e1ef77c1661abb0036155689f6af7dc575f87657f8b07e979cda4
const clientID = ref('id');
const ss = GitlabService;
const router = useRouter();
const ar = useRoute();

let code;
let loading = ref(true);
onMounted(() => {
  let curURL = window.location.href;
  if (!curURL.includes('sewer/#')) {
    console.info('Fixing URL to have a hash.');
    curURL = curURL.replace('sewer/', 'sewer/#/');

    window.location.href = decodeURIComponent(curURL);
  }

  code = ar.query.code as string;

  if (code) {
    ss.loginWithCode(code).subscribe(() => {
      router.push('/dashboard/all');
    });
  } else {
    if (ss.refresh_token) {
      ss.refreshToken()
        .pipe(
          tap(() => {
            router.push('/dashboard');
            loading.value = false;
          })
        )
        .subscribe();
    }
    loading.value = false;
  }

  clientID.value = ss.clientID;
  // clientSecret.value = ss.clientSecret
  if (ss.isLoggedIn) {
    router.push('/dashboard');
  }
});

watch(clientID, (val) => {
  ss.clientID = val;
});
</script>

<template>
  <q-layout view="hHh lpR fFf" class="column justify-center">
    <q-page-container
      class="fit row wrap justify-center items-start content-start"
    >
      <div class="full-height">
        <q-card
          flat
          bordered
          class="my-card"
          :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
        >
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">GitLab Config</div>
                <!-- <div class="text-subtitle2">by John Doe</div> -->
              </div>

              <!-- <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Remove Card</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Send Feedback</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Share</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div> -->
            </div>
          </q-card-section>

          <q-card-section>
            <q-input
              square
              outlined
              v-model="clientID"
              label="GitLab Client ID"
            />
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat @click="ss.loginNoCode()" :disable="!clientID"
              >Login</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>
