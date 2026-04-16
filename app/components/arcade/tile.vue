<script setup lang="ts">
defineOptions({ name: 'ArcadeTile' })

interface ArcadeTileProps {
  headline?: string
  body?: string
}

withDefaults(defineProps<ArcadeTileProps>(), {
  headline: undefined,
  body: undefined
})
</script>

<template>
  <div class="arcade-tile">
    <div v-if="headline || body" class="arcade-tile__header">
      <h3 v-if="headline" class="arcade-tile__headline">{{ headline }}</h3>
      <p v-if="body" class="arcade-tile__body">{{ body }}</p>
    </div>

    <div class="arcade-tile__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.arcade-tile {
  display: flex;
  flex-direction: column;
  border-radius: var(--arcade-radius-medium);
  overflow: hidden;
  width: 100%;
  background: var(--arcade-bg-app);
  border: 0.03125rem solid var(--arcade-border-subtle);
}

.arcade-tile__header {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  padding: 1em 0.75em 0;
}

.arcade-tile__headline {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 1em;
  line-height: 1;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-tile__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--arcade-text-subtle);
}

.arcade-tile__content {
  display: flex;
  flex-direction: column;
}
</style>
