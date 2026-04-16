<script setup lang="ts">
defineOptions({ name: 'ArcadeInputChipGrid' })
</script>

<template>
  <div class="arcade-input-chip-grid" role="group">
    <slot />
  </div>
</template>

<style scoped>
.arcade-input-chip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

.arcade-input-chip-grid :deep(.arcade-input-chip) {
  width: 100%;
  min-width: 0;
}
</style>
