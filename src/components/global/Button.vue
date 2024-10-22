<template>
  <q-btn
    :loading="show_loader && useLoader.loader"
    :disable="useLoader.loader"
    icon-right="cached"
    color="primary"
    class="button"
    size="12px"
    no-caps
    dense
  >
    <template v-slot:loading v-if="show_loader">
      <q-spinner-hourglass class="on-left" />
      Cargando...
    </template>
  </q-btn>
</template>

<script setup>
import { useModuleLoader } from '@/store';
const useLoader = useModuleLoader();

defineProps({ show_loader: Boolean });
</script>
