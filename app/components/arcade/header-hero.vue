<script setup lang="ts">
defineOptions({ name: 'ArcadeHeaderHero' })

interface ArcadeHeaderHeroProps {
  title: string
  body?: string
  size?: 'large' | 'small'
}

withDefaults(defineProps<ArcadeHeaderHeroProps>(), {
  body: undefined,
  size: 'large'
})
</script>

<template>
  <div class="arcade-header-hero">
    <h1
      class="arcade-header-hero__title"
      :class="`arcade-header-hero__title--${size}`"
    >
      {{ title }}
    </h1>
    <p v-if="body" class="arcade-header-hero__body">{{ body }}</p>
  </div>
</template>

<style scoped>
.arcade-header-hero {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0 0.5em;
}

.arcade-header-hero__title {
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-hero__title--large {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 1.25em;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.arcade-header-hero__title--small {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 1em;
  line-height: 1;
  letter-spacing: -0.025em;
}

.arcade-header-hero__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--arcade-text-standard);
}
</style>
