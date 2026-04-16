<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonDefaultGroup' })

interface ArcadeButtonDefaultGroupProps {
  orientation?: 'vertical' | 'horizontal'
}

withDefaults(defineProps<ArcadeButtonDefaultGroupProps>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div
    class="arcade-btn-group"
    :class="`arcade-btn-group--${orientation}`"
  >
    <slot />
  </div>
</template>

<style scoped>
.arcade-btn-group {
  display: flex;
  gap: 0.25em;
}

.arcade-btn-group--vertical {
  flex-direction: column;
}

.arcade-btn-group--horizontal {
  flex-direction: row;
}

.arcade-btn-group--horizontal :slotted(*) {
  flex: 1;
}
</style>
