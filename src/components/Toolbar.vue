<template>
  <div class="toolbar">
    <button
        @click="selectTool('brush')"
        :class="{ active: store.currentTool === 'brush' }"
        class="tool-button brush"
    >
      Кисть
    </button>
    <button
        @click="selectTool('eraser')"
        :class="{ active: store.currentTool === 'eraser' }"
        class="tool-button eraser"
    >
      Ластик
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDrawingStore } from '../stores/drawingStore'
import type { Tool } from "../types";

const store = useDrawingStore()

function selectTool(tool: Tool) {
  store.setTool(tool)
  store.configureContext()
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 10px;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  background-color: var(--secondary-color);
  border-right: 1px solid var(--tertiary-color);
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--button-text-color);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  border: 0;
}

.tool-button:hover {
  background-color: var(--tertiary-color);
}

.tool-button.active {
  background-color: var(--button-color);
  color: var(--button-text-color);
}
</style>
