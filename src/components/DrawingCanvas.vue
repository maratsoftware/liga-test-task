<template>
  <section class="canvas-container" ref="containerRef">
    <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        class="drawing-canvas"
    ></canvas>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useDrawingStore } from '../stores/drawingStore'

const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const store = useDrawingStore()

const canvasWidth = ref(800)
const canvasHeight = ref(600)

let resizeObserver: ResizeObserver | null = null

let touchStartHandler: ((e: TouchEvent) => void) | null = null
let touchMoveHandler: ((e: TouchEvent) => void) | null = null
let touchEndHandler: ((e: TouchEvent) => void) | null = null

function updateCanvasSize() {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const newWidth = Math.floor(rect.width)
  const newHeight = Math.floor(rect.height)

  if (newWidth === canvasWidth.value && newHeight === canvasHeight.value) return

  let imageData: ImageData | null = null
  if (canvasRef.value && store.isContextSet) {
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      imageData = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
    }
  }

  canvasWidth.value = newWidth
  canvasHeight.value = newHeight

  nextTick(() => {
    if (canvasRef.value) {
      const context = canvasRef.value.getContext('2d')
      if (context) {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, newWidth, newHeight)

        if (imageData) {
          context.putImageData(imageData, 0, 0)
        }

        store.setContext(context)
        store.configureContext()
      }
    }
  })
}

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

function getTouchCoordinates(touch: Touch): { x: number, y: number } {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const rect = canvasRef.value.getBoundingClientRect()
  const scaleX = canvasRef.value.width / rect.width
  const scaleY = canvasRef.value.height / rect.height

  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
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
  updateCanvasSize()

  resizeObserver = new ResizeObserver(() => {
    updateCanvasSize()
  })

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }

  if (canvasRef.value) {
    const canvas = canvasRef.value

    touchStartHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        const { x, y } = getTouchCoordinates(touch)
        store.startDrawing(x, y)
      }
    }

    touchMoveHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        const { x, y } = getTouchCoordinates(touch)
        store.draw(x, y)
      }
    }

    touchEndHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault()
      store.stopDrawing()
    }

    canvas.addEventListener('touchstart', touchStartHandler, { passive: false })
    canvas.addEventListener('touchmove', touchMoveHandler, { passive: false })
    canvas.addEventListener('touchend', touchEndHandler, { passive: false })
    canvas.addEventListener('touchcancel', touchEndHandler, { passive: false })
  }
})

onUnmounted(() => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    if (touchStartHandler) canvas.removeEventListener('touchstart', touchStartHandler)
    if (touchMoveHandler) canvas.removeEventListener('touchmove', touchMoveHandler)
    if (touchEndHandler) {
      canvas.removeEventListener('touchend', touchEndHandler)
      canvas.removeEventListener('touchcancel', touchEndHandler)
    }
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  store.setContext(null)
})
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  padding: 50px;
}

.drawing-canvas {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid var(--canvas-border-color);
  border-radius: 4px;
  cursor: crosshair;
  background-color: var(--canvas-background-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  touch-action: none;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .canvas-container {
    padding: 40px;
  }
}

@media (max-width: 768px) {
  .canvas-container {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .canvas-container {
    padding: 20px;
  }
}
</style>
