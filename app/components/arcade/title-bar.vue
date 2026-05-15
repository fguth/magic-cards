<script setup lang="ts">
defineOptions({ name: 'ArcadeTitleBar' })

import type { GlassTheme } from '@/composables/use-glass-config'

interface ArcadeTitleBarProps {
  type?: 'parent' | 'child'
  variant?: 'default' | 'transparent'
  title?: string
  showTitle?: boolean
  actions?: string[]
  theme?: GlassTheme
}

const props = withDefaults(defineProps<ArcadeTitleBarProps>(), {
  type: 'parent',
  variant: 'default',
  title: undefined,
  showTitle: true,
  actions: () => [],
  theme: undefined
})

const emit = defineEmits<{
  back: []
  close: []
  action: [icon: string]
}>()

const { isDark: isSharedDark } = useArcadeTheme()
const { cssVars: globalCssVars, cssVarsFor } = useGlassConfig()

const isDark = computed(() => props.theme ? props.theme === 'dark' : isSharedDark.value)
const cssVars = computed(() => props.theme ? cssVarsFor(props.theme) : globalCssVars.value)

const navIconModules = import.meta.glob(
  '@/assets/icons/navigation/*.svg',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

function getNavIcon(name: string): string {
  const match = Object.entries(navIconModules).find(([key]) => key.endsWith(`/${name}.svg`))
  return match ? match[1] : ''
}

const leadingIconName = computed(() => props.type === 'child' ? 'back' : 'close')

function onLeadingClick() {
  if (props.type === 'child') emit('back')
  else emit('close')
}

const hasActions = computed(() => props.actions.length > 0)
const hasSingleAction = computed(() => props.actions.length === 1)
const hasMultipleActions = computed(() => props.actions.length > 1)
const singleAction = computed(() => props.actions.length === 1 ? props.actions[0] ?? '' : '')

function onSingleActionClick() {
  if (!singleAction.value) return
  emit('action', singleAction.value)
}
</script>

<template>
  <div
    class="arcade-title-bar"
    :class="[
      `arcade-title-bar--${variant}`,
      { 'arcade-title-bar--dark': isDark }
    ]"
  >
    <div v-if="variant === 'default'" class="arcade-title-bar__bg" />

    <div class="arcade-title-bar__content">
      <slot name="leading">
        <ButtonGlass
          :icon="leadingIconName"
          :theme="theme"
          :aria-label="type === 'child' ? 'Back' : 'Close'"
          @click="onLeadingClick"
        />
      </slot>

      <span
        v-if="showTitle && title"
        class="arcade-title-bar__title"
      >
        {{ title }}
      </span>

      <slot name="trailing">
        <ButtonGlass
          v-if="hasSingleAction"
          :icon="singleAction"
          :theme="theme"
          :aria-label="singleAction"
          @click="onSingleActionClick"
        />

        <div v-else-if="hasMultipleActions" class="arcade-title-bar__actions" :style="cssVars">
          <div class="arcade-title-bar__actions-blur-wrap">
            <div class="arcade-title-bar__actions-blur" />
          </div>
          <div class="arcade-title-bar__actions-fill" />
          <div class="arcade-title-bar__actions-inner">
            <button
              v-for="action in actions"
              :key="action"
              class="arcade-title-bar__action-btn"
              :aria-label="action"
              @click="emit('action', action)"
            >
              <span class="arcade-title-bar__action-icon" v-html="getNavIcon(action)" />
            </button>
          </div>
        </div>

        <div v-else class="arcade-title-bar__spacer" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.arcade-title-bar {
  position: relative;
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  pointer-events: auto;
}

.arcade-title-bar__bg {
  position: absolute;
  inset: 0 0 -0.25em 0;
  opacity: 0.88;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(to bottom, #fff 3.846%, transparent);
}

.arcade-title-bar--dark .arcade-title-bar__bg {
  background: linear-gradient(to bottom, #000 3.846%, transparent);
}

.arcade-title-bar__content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3125em 0.5em;
}

.arcade-title-bar__title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
  pointer-events: none;
  color: #000;
}

.arcade-title-bar--dark .arcade-title-bar__title {
  color: #fff;
}

.arcade-title-bar__actions {
  position: relative;
  height: 1.375em;
  border-radius: 999px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background: var(--glass-blur-bg, rgba(0, 0, 0, 0.08));
  backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  -webkit-backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  box-shadow:
    0 0 1.25em rgba(0, 0, 0, 0.04),
    inset 0.015625rem 0.015625rem 0.0625rem var(--glass-inset-highlight, rgba(255, 255, 255, 0.15)),
    inset -0.015625rem -0.015625rem 0.0625rem rgba(255, 255, 255, 0.08);
}

.arcade-title-bar__actions-blur-wrap {
  position: absolute;
  inset: -0.8125em;
  border-radius: 999px;
  overflow: hidden;
  pointer-events: none;
}

.arcade-title-bar__actions-blur {
  position: absolute;
  inset: 0.9375em 0.8125em 0.6875em 0.8125em;
  border-radius: 999px;
  background: var(--glass-blur-bg, rgba(0, 0, 0, 0.08));
  filter: blur(0.625rem);
  mix-blend-mode: hard-light;
}

.arcade-title-bar__actions-fill {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  opacity: var(--glass-fill-opacity, 0.67);
  pointer-events: none;
  background: var(--glass-fill);
}

.arcade-title-bar__actions::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
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

.arcade-title-bar__actions::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background:
    radial-gradient(
      ellipse 45% 80% at 6% 50%,
      var(--glass-highlight, rgba(255, 255, 255, 0.07)) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 45% 80% at 94% 50%,
      var(--glass-highlight, rgba(255, 255, 255, 0.07)) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 60% 50% at 50% 0%,
      var(--glass-highlight, rgba(255, 255, 255, 0.07)) 0%,
      transparent 60%
    );
  pointer-events: none;
  z-index: 3;
}

.arcade-title-bar__actions-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.375em;
  padding: 0.125em;
}

.arcade-title-bar__action-btn {
  width: 1.125em;
  height: 1.125em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: 50%;
  transition: opacity 0.15s ease;
  color: #000;
}

.arcade-title-bar--dark .arcade-title-bar__action-btn {
  color: #fff;
}

.arcade-title-bar__action-btn:active {
  opacity: 0.6;
}

.arcade-title-bar__action-icon {
  width: 0.75em;
  height: 0.75em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-title-bar__action-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-title-bar__action-icon :deep(svg path) {
  fill: currentColor;
}

.arcade-title-bar__spacer {
  width: 1.375em;
  height: 1.375em;
  flex-shrink: 0;
}
</style>
