<script setup lang="ts">
defineOptions({ name: 'ArcadeHeaderSection' })

interface ArcadeHeaderSectionProps {
  title: string
  actionLabel?: string
}

withDefaults(defineProps<ArcadeHeaderSectionProps>(), {
  actionLabel: undefined
})

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="arcade-header-section">
    <p class="arcade-header-section__title">{{ title }}</p>
    <button
      v-if="actionLabel"
      class="arcade-header-section__action"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.arcade-header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5em;
}

.arcade-header-section__title {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.625em;
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-section__action {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1.43;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: var(--arcade-text-standard);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.arcade-header-section__action:active {
  opacity: 0.7;
}
</style>
