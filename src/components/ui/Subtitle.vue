<template>
  <div :class="class_">
    <q-chip
      style="width: 100%; font-size: 0.7rem; margin-top: 0px; margin-bottom: 0px"
      :color="color || 'primary'"
      class="shadow-1 q-mx-none"
      text-color="white"
      :label="text"
      :icon="icon"
      square
    >
      <q-tooltip class="bg-secondary" transition-show="flip-right" transition-hide="flip-left" v-if="text_tooltip">
        {{ text_tooltip }}
      </q-tooltip>
      <div style="flex: 1"></div>
      <q-btn
        v-if="typeof button == 'function'"
        @click="handleEditClick"
        icon="app_registration"
        class="q-ml-sm botone"
        size="sm"
        dense
        flat
      >
        <q-tooltip class="bg-secondary" transition-show="flip-right" transition-hide="flip-left"> Salto</q-tooltip>
      </q-btn>
    </q-chip>
  </div>
</template>
<script setup>

const props = defineProps({
  text_tooltip: String,
  col_grow: Boolean,
  button: Function,
  class_: String,
  color: String,
  text: String,
  icon: String,
});
const emit = defineEmits(['edit']);
const handleEditClick = () => {
  emit('edit', props.button());
};
</script>
