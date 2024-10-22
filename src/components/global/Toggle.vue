<template>
  <q-toggle
    style="border-radius: 10px; box-shadow: 0 8px 15px rgba(0, 0, 0, 1); margin: 10px; padding: 4px"
    indeterminate-icon="radio_button_unchecked"
    :disable="useLoader.loader"
    indeterminate-value="maybe"
    unchecked-icon="clear"
    checked-icon="check"
    keep-color
    focusable
    dense
    push
  />
</template>
<script setup>
import { useModuleLoader } from '@/store';
const useLoader = useModuleLoader();
</script>
