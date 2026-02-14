import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Tool } from "../types";

export const useDrawingStore = defineStore('drawing', () => {
    const currentTool = ref<Tool>('brush');
    const isDrawing = ref(false);
    const lastX = ref(0);
    const lastY = ref(0);
    const ctx = ref<CanvasRenderingContext2D | null>(null);

    const isContextSet = computed(() => ctx.value !== null)

    function setTool(tool: Tool) {
        currentTool.value = tool
    }

    function setContext(context: CanvasRenderingContext2D | null) {
        ctx.value = context
    }

    function startDrawing(x: number, y: number) {
        if (!ctx.value) return

        isDrawing.value = true
        lastX.value = x
        lastY.value = y

        ctx.value.beginPath()
        ctx.value.moveTo(x, y)
    }

    function draw(x: number, y: number) {
        if (!isDrawing.value || !ctx.value) return

        ctx.value.lineTo(x, y)
        ctx.value.stroke()

        lastX.value = x
        lastY.value = y
    }

    function stopDrawing() {
        isDrawing.value = false
        if (ctx.value) {
            ctx.value.closePath()
        }
    }

    function configureContext() {
        if (!ctx.value) return

        ctx.value.lineCap = 'round'
        ctx.value.lineJoin = 'round'

        if (currentTool.value === 'eraser') {
            ctx.value.lineWidth = 45
            ctx.value.strokeStyle = '#ffffff'
            ctx.value.globalCompositeOperation = 'destination-out'
        } else {
            ctx.value.lineWidth = 5
            ctx.value.strokeStyle = '#000000'
            ctx.value.globalCompositeOperation = 'source-over'
        }
    }

    return {
        currentTool,
        isDrawing,
        isContextSet,
        setTool,
        setContext,
        startDrawing,
        draw,
        stopDrawing,
        configureContext
    };
});
