<script setup>
  import { RouterView } from 'vue-router'
  import NavBar from './components/Navbar.vue'
</script>

<template>
  <NavBar />
  <div class="container mx-auto">
    <RouterView />
  </div>
</template>

<style scoped>

</style>
