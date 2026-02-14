<template>
  <aside class="toolbar">
    <ToolButton
        title="Кисть"
        :active="store.currentTool === 'brush'"
        @click="selectTool('brush')"
    >
      <PaintBrush />
    </ToolButton>

    <ToolButton
        title="Ластик"
        :active="store.currentTool === 'eraser'"
        @click="selectTool('eraser')"
    >
      <Eraser />
    </ToolButton>
  </aside>
</template>

<script setup lang="ts">
import { useDrawingStore } from '../stores/drawingStore'
import type { Tool } from "../types";
import Eraser from "../assets/icons/Eraser.vue";
import PaintBrush from "../assets/icons/PaintBrush.vue";
import ToolButton from "./ToolButton.vue";

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
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  background-color: var(--secondary-color);
  border-right: 1px solid var(--tertiary-color);
}

@media (max-width: 1024px) {
  .toolbar {
    flex-direction: row;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--tertiary-color);
  }
}
</style>
