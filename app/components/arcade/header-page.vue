<script setup lang="ts">
defineOptions({ name: 'ArcadeHeaderPage' })

interface ArcadeHeaderPageProps {
  title: string
  subtitle?: string
}

withDefaults(defineProps<ArcadeHeaderPageProps>(), {
  subtitle: undefined
})
</script>

<template>
  <div class="arcade-header-page">
    <h1 class="arcade-header-page__title">{{ title }}</h1>
    <p v-if="subtitle" class="arcade-header-page__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.arcade-header-page {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  padding: 0 0.5em;
}

.arcade-header-page__title {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 1.25em;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-page__subtitle {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  margin: 0;
  color: var(--arcade-text-subtle);
}
</style>
