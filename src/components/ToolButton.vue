<template>
  <button
      @click="$emit('click')"
      :class="{ active }"
      class="tool-button"
      :title="title"
      :aria-label="title"
      :aria-pressed="active ? 'true' : 'false'"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  active?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.tool-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--secondary-color);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.4s ease;
  border: none;
}

.tool-button:hover {
  background-color: var(--tertiary-color);
}

.tool-button.active {
  background-color: var(--button-color);
  color: var(--button-text-color);
}
</style>
