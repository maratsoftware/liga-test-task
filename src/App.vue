<template>
  <main>
    <Toolbar />
    <DrawingCanvas :width="1000" :height="700" />
  </main>
</template>

<script setup lang="ts">
import Toolbar from './components/Toolbar.vue'
import DrawingCanvas from './components/DrawingCanvas.vue'
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
  display: grid;
  grid-template-columns: 1fr 7fr;
}
</style>
