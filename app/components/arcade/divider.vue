<script setup lang="ts">
defineOptions({ name: 'ArcadeDivider' })

interface ArcadeDividerProps {
  inset?: boolean
}

withDefaults(defineProps<ArcadeDividerProps>(), {
  inset: false
})
</script>

<template>
  <div
    class="arcade-divider"
    :class="{ 'arcade-divider--inset': inset }"
    role="separator"
  />
</template>

<style scoped>
.arcade-divider {
  height: 0.03125rem;
  flex-shrink: 0;
  width: 100%;
  background: var(--arcade-border-subtle);
}

.arcade-divider--inset {
  margin-left: 0.5em;
  margin-right: 0.5em;
  width: auto;
}
</style>
