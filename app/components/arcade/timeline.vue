<script setup lang="ts">
defineOptions({ name: 'ArcadeTimeline' })
</script>

<template>
  <div class="arcade-timeline">
    <slot />
  </div>
</template>

<style scoped>
.arcade-timeline {
  display: flex;
  flex-direction: column;
  padding: 0 var(--arcade-spacing-small);
}
</style>
