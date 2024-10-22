<template>
  <div class="conten">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/ui/Header';
</script>
<style>
@import '@/assets/styles/_style.scss';
@import '@/assets/styles/quasar-variables.scss';

.conten {
  height: 100vh;
  overflow: hidden;
}
</style>
