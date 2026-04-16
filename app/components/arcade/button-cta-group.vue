<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonCtaGroup' })

interface ArcadeButtonCtaGroupProps {
  orientation?: 'vertical' | 'horizontal'
  disclaimer?: string
  hairline?: boolean
  homeIndicator?: boolean
}

withDefaults(defineProps<ArcadeButtonCtaGroupProps>(), {
  orientation: 'vertical',
  disclaimer: undefined,
  hairline: false,
  homeIndicator: false,
})

const { isDark } = useArcadeTheme()
</script>

<template>
  <div
    class="arcade-cta-group"
    :class="[
      `arcade-cta-group--${orientation}`,
      {
        '--dark': isDark,
        'arcade-cta-group--hairline': hairline,
        'arcade-cta-group--home-indicator': homeIndicator,
      },
    ]"
  >
    <p v-if="disclaimer" class="arcade-cta-group__disclaimer">
      {{ disclaimer }}
    </p>
    <div class="arcade-cta-group__buttons">
      <slot />
    </div>
    <div v-if="homeIndicator" class="arcade-cta-group__indicator" />
  </div>
</template>

<style scoped>
.arcade-cta-group {
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  gap: 0.25em;
}

.arcade-cta-group--home-indicator {
  padding-bottom: 0;
}

.arcade-cta-group--hairline {
  border-top: 0.03125rem solid var(--arcade-border-subtle);
}

.arcade-cta-group__disclaimer {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.375em;
  line-height: 1.4;
  text-align: center;
  opacity: 0.5;
  margin: 0 0 0.25em;
  color: var(--arcade-text-standard);
}

.arcade-cta-group__buttons {
  display: flex;
  gap: 0.25em;
}

.arcade-cta-group--vertical .arcade-cta-group__buttons {
  flex-direction: column;
}

.arcade-cta-group--horizontal .arcade-cta-group__buttons {
  flex-direction: row;
}

.arcade-cta-group__indicator {
  position: relative;
  height: 1em;
}

.arcade-cta-group__indicator::before {
  content: '';
  position: absolute;
  top: 0.625em;
  left: 50%;
  transform: translateX(-50%);
  width: 4.1875em;
  height: 0.15625em;
  border-radius: var(--arcade-radius-pill);
  background: rgba(0, 0, 0, 0.2);
}

.--dark .arcade-cta-group__indicator::before {
  background: rgba(255, 255, 255, 0.3);
}
</style>
