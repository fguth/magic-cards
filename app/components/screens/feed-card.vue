<script setup lang="ts">
defineOptions({ name: 'FeedCard' })

interface FeedCardProps {
  variant?: 'hero' | 'standard' | 'pill'
  radius?: string
  padding?: string
}

const props = withDefaults(defineProps<FeedCardProps>(), {
  variant: 'standard',
  radius: undefined,
  padding: undefined,
})

const { cssVars } = useGlassConfig()
const { isDark } = useArcadeTheme()

const resolvedRadius = computed(() => {
  if (props.radius) return props.radius
  if (props.variant === 'pill') return '999px'
  if (props.variant === 'hero') return '1em'
  return '0.85em'
})

const resolvedPadding = computed(() => {
  if (props.padding) return props.padding
  if (props.variant === 'pill') return '0.28em 0.6em'
  if (props.variant === 'hero') return '0.85em 0.85em 0.95em'
  return '0.7em 0.8em'
})

const mergedStyle = computed(() => ({
  ...cssVars.value,
  '--feed-card-radius': resolvedRadius.value,
  '--feed-card-padding': resolvedPadding.value,
}))
</script>

<template>
  <div
    class="feed-card"
    :class="[
      `feed-card--${variant}`,
      { 'feed-card--dark': isDark },
    ]"
    :style="mergedStyle"
  >
    <div class="feed-card__blur-wrap">
      <div class="feed-card__blur" />
    </div>
    <div class="feed-card__fill" />
    <div class="feed-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.feed-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: var(--feed-card-radius);
  color: #000;
  isolation: isolate;
  box-shadow:
    0 0.125em 0.5em rgba(0, 0, 0, calc(var(--glass-shadow-opacity, 0.08) * 1)),
    0 0.0625em 0.125em rgba(0, 0, 0, calc(var(--glass-shadow-opacity, 0.08) * 0.55)),
    inset 0.015625em 0.015625em 0.0625em var(--glass-inset-highlight, rgba(255, 255, 255, 0.25)),
    inset -0.015625em -0.015625em 0.0625em rgba(255, 255, 255, 0.08);
}

.feed-card--dark {
  color: #fff;
}

.feed-card__blur-wrap {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.feed-card__blur {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  -webkit-backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  background: var(--glass-blur-bg, rgba(255, 255, 255, 0.1));
}

.feed-card__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-fill);
  opacity: var(--glass-fill-opacity, 0.67);
  pointer-events: none;
  z-index: 1;
}

.feed-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 0.03125em solid transparent;
  background: var(--glass-border-gradient) border-box;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0) border-box;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0) border-box;
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
  z-index: 3;
}

.feed-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 80% 30% at 50% 0%,
    var(--glass-highlight, rgba(255, 255, 255, 0.12)) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 3;
}

.feed-card__content {
  position: relative;
  z-index: 2;
  flex: 1 1 auto;
  min-height: 0;
  padding: var(--feed-card-padding);
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.feed-card--pill .feed-card__content {
  flex-direction: row;
  align-items: center;
  gap: 0.35em;
}
</style>
