<script setup lang="ts">
defineOptions({ name: 'ArcadeCard' })

interface ArcadeCardProps {
  headline?: string
  body?: string
  ctaLabel?: string
  variant?: 'default' | 'section'
  backgroundImage?: string
}

withDefaults(defineProps<ArcadeCardProps>(), {
  headline: undefined,
  body: undefined,
  ctaLabel: undefined,
  variant: 'default',
  backgroundImage: undefined
})

defineEmits<{ cta: [] }>()
</script>

<template>
  <div
    class="arcade-card"
    :class="[`arcade-card--${variant}`]"
    :style="backgroundImage ? {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    } : undefined"
  >
    <div v-if="$slots.image" class="arcade-card__image">
      <slot name="image" />
    </div>

    <div class="arcade-card__content">
      <slot name="headline">
        <h3 v-if="headline" class="arcade-card__headline">{{ headline }}</h3>
      </slot>
      <slot name="body">
        <p v-if="body" class="arcade-card__body">{{ body }}</p>
      </slot>
      <button
        v-if="ctaLabel"
        class="arcade-card__cta"
        @click="$emit('cta')"
      >
        {{ ctaLabel }}
      </button>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.arcade-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--arcade-radius-large);
  overflow: hidden;
  width: 100%;
  background: var(--arcade-bg-app);
  border: 0.03125rem solid var(--arcade-border-subtle);
}

.arcade-card--section {
  border-radius: var(--arcade-radius-medium);
}

.arcade-card__image {
  width: 100%;
  min-height: 6.125em;
  overflow: hidden;
  position: relative;
}

.arcade-card__image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.arcade-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
}

.arcade-card__headline {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 1em;
  line-height: 1;
  letter-spacing: -0.025rem;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-card--section .arcade-card__headline {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.75em;
  line-height: 1;
  letter-spacing: -0.00563rem;
}

.arcade-card__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-card__cta {
  align-self: flex-start;
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1.14;
  letter-spacing: 0.00109rem;
  padding: 0.5em 1.15em;
  border-radius: var(--arcade-radius-pill);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--arcade-duration-fast) var(--arcade-ease-default);
  background: var(--arcade-bg-subtle);
  color: var(--arcade-text-standard);
  -webkit-tap-highlight-color: transparent;
}

.arcade-card__cta:active {
  opacity: 0.7;
}
</style>
