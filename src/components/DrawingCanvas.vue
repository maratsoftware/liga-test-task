<template>
  <div class="canvas-container">
    <canvas
        ref="canvasRef"
        v-bind:width="width"
        v-bind:height="height"
        v-on:mousedown="handleMouseDown"
        v-on:mousemove="handleMouseMove"
        v-on:mouseup="handleMouseUp"
        v-on:mouseleave="handleMouseLeave"
        class="drawing-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useDrawingStore } from '../stores/drawingStore'
import type { Canvas } from "../types";

const props = defineProps<Canvas>();

const canvasRef = ref<HTMLCanvasElement | null>(null)
const store = useDrawingStore()

function getCanvasCoordinates(event: MouseEvent | Touch): { x: number, y: number } {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  }
}

function handleMouseDown(event: MouseEvent) {
  event.preventDefault()
  const { x, y } = getCanvasCoordinates(event)
  store.startDrawing(x, y)
}

function handleMouseMove(event: MouseEvent) {
  event.preventDefault()
  const { x, y } = getCanvasCoordinates(event)
  store.draw(x, y)
}

function handleMouseUp() {
  store.stopDrawing()
}

function handleMouseLeave() {
  store.stopDrawing()
}

watch(() => store.currentTool, () => {
  store.configureContext()
}, { deep: true })

onMounted(() => {
  if (canvasRef.value) {
    const context = canvasRef.value.getContext('2d')
    store.setContext(context)
    store.configureContext()

    if (context) {
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, props.width, props.height)
    }
  }
})

onUnmounted(() => {
  store.setContext(null)
})
</script>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.drawing-canvas {
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: crosshair;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: auto;
  touch-action: none;
}
</style>