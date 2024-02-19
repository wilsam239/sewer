<script setup lang="ts">
import { QDialog, QStepper } from 'quasar';
import { mergeMap, tap } from 'rxjs';

import { SnackbarService } from 'src/services/snackbar.service';
import { Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{ project?: number }>();

const router = useRouter();

const dialog: Ref<QDialog | null> = ref(null);

watch(
  () => props.project,
  (id) => {
    //TODO
  }
);

function reset() {
  //TODO
}
</script>
<template>
  <q-dialog @hide="reset()" ref="dialog">
    <q-card>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title>Configure New Release </q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section> TODO </q-card-section>
    </q-card>
  </q-dialog>
</template>
