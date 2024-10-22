<template>
  <q-btn color="primary" class="button" icon-right="cached" :disable="useLoader.loader" dense size="10px" />
</template>
<script setup>
import { useModuleLoader } from '@/store';
const useLoader = useModuleLoader();
</script>
