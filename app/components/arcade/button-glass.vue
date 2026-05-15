<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonGlass' })

import type { GlassTheme } from '@/composables/use-glass-config'

interface ArcadeButtonGlassProps {
  icon: string
  ariaLabel?: string
  theme?: GlassTheme
}

const props = withDefaults(defineProps<ArcadeButtonGlassProps>(), {
  ariaLabel: undefined,
  theme: undefined
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { cssVars: globalCssVars, cssVarsFor } = useGlassConfig()
const { isDark: isSharedDark } = useArcadeTheme()

const isDark = computed(() => props.theme ? props.theme === 'dark' : isSharedDark.value)

const glassCssVars = computed(() =>
  props.theme ? cssVarsFor(props.theme) : globalCssVars.value
)

const navIconModules = import.meta.glob(
  '@/assets/icons/navigation/*.svg',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

const iconSvg = computed(() => {
  const match = Object.entries(navIconModules).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  return match ? match[1] : ''
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <button
    class="glass-btn"
    :class="{ 'glass-btn--dark': isDark }"
    :style="glassCssVars"
    :aria-label="ariaLabel ?? icon"
    @click="handleClick"
  >
    <div class="glass-btn__blur-wrap">
      <div class="glass-btn__blur" />
    </div>
    <div class="glass-btn__fill" />
    <span class="glass-btn__icon" v-html="iconSvg" />
  </button>
</template>

<style scoped>
.glass-btn {
  position: relative;
  width: 1.375em;
  height: 1.375em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--glass-blur-bg, rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  -webkit-backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  cursor: pointer;
  padding: 0;
  color: #000;
  isolation: isolate;
  box-shadow:
    0 0.125em 0.5em rgba(0, 0, 0, var(--glass-shadow-opacity, 0.45)),
    0 0.0625em 0.125em rgba(0, 0, 0, calc(var(--glass-shadow-opacity, 0.45) * 0.55)),
    inset 0.015625rem 0.015625rem 0.0625rem var(--glass-inset-highlight, rgba(255, 255, 255, 0.15)),
    inset -0.015625rem -0.015625rem 0.0625rem rgba(255, 255, 255, 0.08);
}

.glass-btn--dark {
  color: #fff;
}

.glass-btn:active {
  opacity: 0.7;
}

.glass-btn__blur-wrap {
  position: absolute;
  inset: -0.40625rem;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.glass-btn__blur {
  position: absolute;
  inset: 0.46875rem 0.40625rem 0.34375rem 0.40625rem;
  border-radius: 50%;
  background: var(--glass-blur-bg, rgba(0, 0, 0, 0.1));
  filter: blur(0.625rem);
  mix-blend-mode: hard-light;
}

.glass-btn__fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: var(--glass-fill-opacity, 0.67);
  pointer-events: none;
  background: var(--glass-fill);
  z-index: 1;
}

.glass-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 0.03125rem solid transparent;
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

.glass-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(
      ellipse 80% 40% at 50% 5%,
      var(--glass-highlight, rgba(255, 255, 255, 0.08)) 0%,
      transparent 60%
    );
  pointer-events: none;
  z-index: 3;
}

.glass-btn__icon {
  position: relative;
  z-index: 2;
  width: 0.75em;
  height: 0.75em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-btn__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.glass-btn__icon :deep(svg path) {
  fill: currentColor;
}
</style>
