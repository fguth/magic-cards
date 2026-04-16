<script setup lang="ts">
defineOptions({ name: 'ArcadeHeaderHeroNumerics' })

interface ArcadeHeaderHeroNumericsProps {
  eyebrow?: string
  amount: string
  subtitle?: string
}

withDefaults(defineProps<ArcadeHeaderHeroNumericsProps>(), {
  eyebrow: undefined,
  subtitle: undefined
})
</script>

<template>
  <div class="arcade-header-hero-numerics">
    <p v-if="eyebrow" class="arcade-header-hero-numerics__eyebrow">{{ eyebrow }}</p>
    <p class="arcade-header-hero-numerics__amount">{{ amount }}</p>
    <p v-if="subtitle" class="arcade-header-hero-numerics__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.arcade-header-hero-numerics {
  display: flex;
  flex-direction: column;
  gap: 0.125em;
  padding: 0 0.5em;
}

.arcade-header-hero-numerics__eyebrow {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1.43;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-hero-numerics__amount {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 1.75em;
  line-height: 1;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-hero-numerics__subtitle {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  margin: 0;
  color: var(--arcade-text-subtle);
}
</style>
