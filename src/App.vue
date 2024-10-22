<template>
  <div class="conten">
    <router-view />
  </div>
</template>

<script setup></script>
<style>
@import '@/assets/styles/_style.scss';
@import '@/assets/styles/quasar-variables.scss';

.conten {
  height: 100vh;
  overflow: hidden;
}
</style>
