<template>
  <q-toggle
    focusable
    keep-color
    checked-icon="check"
    unchecked-icon="clear"
    indeterminate-value="maybe"
    :disable="useLoader.loader"
    indeterminate-icon="radio_button_unchecked"
  />
</template>
<script setup>
import { useModuleLoader } from '@/store';
const useLoader = useModuleLoader();
</script>
