<template>
  <main>
    <Toolbar />
    <DrawingCanvas :width="1200" :height="800" />
  </main>
</template>

<script setup lang="ts">
import Toolbar from '../components/Toolbar.vue'
import DrawingCanvas from '../components/DrawingCanvas.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--primary-color);
}

main {
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
}
</style>
