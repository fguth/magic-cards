<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonCta' })

interface ArcadeButtonCtaProps {
  label?: string
  icon?: string
  prominence?: 'standard' | 'prominent' | 'subtle'
  destructive?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<ArcadeButtonCtaProps>(), {
  label: undefined,
  icon: undefined,
  prominence: 'prominent',
  destructive: false,
  disabled: false,
  loading: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { isDark } = useArcadeTheme()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const iconSvg = computed(() => {
  if (!props.icon) return ''
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})

const isInteractive = computed(() => !props.disabled && !props.loading)

function handleClick(event: MouseEvent) {
  if (isInteractive.value) emit('click', event)
}
</script>

<template>
  <button
    class="arcade-cta"
    :class="[
      `arcade-cta--${prominence}`,
      {
        '--dark': isDark,
        'arcade-cta--destructive': destructive,
        'arcade-cta--disabled': disabled,
        'arcade-cta--loading': loading,
      },
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="arcade-cta__spinner" />
    <template v-else>
      <span v-if="icon && iconSvg" class="arcade-cta__icon" v-html="iconSvg" />
      <span v-if="label" class="arcade-cta__label">{{ label }}</span>
    </template>
  </button>
</template>

<style scoped>
.arcade-cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  width: 100%;
  min-height: 1.625em;
  padding: 0.25em 0.75em;
  border: none;
  border-radius: var(--arcade-radius-pill);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--arcade-transition-color);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.arcade-cta:focus-visible {
  outline: 0.0625rem solid currentColor;
  outline-offset: 0.0625rem;
}

.arcade-cta--disabled {
  cursor: default;
  pointer-events: none;
}

.arcade-cta--loading {
  cursor: default;
}

.arcade-cta__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-cta__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-cta__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.arcade-cta__spinner {
  width: 0.5em;
  height: 0.5em;
  border-radius: var(--arcade-radius-circle);
  border: 0.0625em solid transparent;
  animation: arcade-cta-spin 0.7s linear infinite;
}

@keyframes arcade-cta-spin {
  to { transform: rotate(360deg); }
}

.arcade-cta--prominent {
  background: var(--arcade-bg-inverse);
  color: var(--arcade-text-inverse);
}
.arcade-cta--prominent:active:not(:disabled) {
  background: #333;
}
.arcade-cta--prominent.arcade-cta--disabled {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}
.arcade-cta--prominent .arcade-cta__spinner {
  border-top-color: var(--arcade-text-inverse);
}

.arcade-cta--prominent.--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
}
.arcade-cta--prominent.--dark.arcade-cta--disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-cta--standard {
  background: rgba(0, 0, 0, 0.08);
  color: var(--arcade-text-standard);
}
.arcade-cta--standard:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.16);
}
.arcade-cta--standard.arcade-cta--disabled {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}
.arcade-cta--standard .arcade-cta__spinner {
  border-top-color: var(--arcade-text-standard);
}

.arcade-cta--standard.--dark {
  background: rgba(255, 255, 255, 0.12);
}
.arcade-cta--standard.--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}
.arcade-cta--standard.--dark.arcade-cta--disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-cta--subtle {
  background: transparent;
  color: var(--arcade-text-standard);
}
.arcade-cta--subtle .arcade-cta__label {
  text-decoration: underline;
  text-underline-offset: 0.125em;
}
.arcade-cta--subtle:active:not(:disabled) {
  color: rgba(0, 0, 0, 0.5);
}
.arcade-cta--subtle.arcade-cta--disabled {
  color: rgba(0, 0, 0, 0.25);
}

.arcade-cta--subtle.--dark:active:not(:disabled) {
  color: rgba(255, 255, 255, 0.5);
}
.arcade-cta--subtle.--dark.arcade-cta--disabled {
  color: rgba(255, 255, 255, 0.25);
}

.arcade-cta--destructive.arcade-cta--prominent {
  background: var(--arcade-bg-danger);
  color: #fff;
}
.arcade-cta--destructive.arcade-cta--prominent .arcade-cta__spinner {
  border-top-color: #fff;
}

.arcade-cta--destructive.arcade-cta--standard {
  background: rgba(204, 0, 0, 0.1);
  color: var(--arcade-text-danger);
}
.arcade-cta--destructive.arcade-cta--standard .arcade-cta__spinner {
  border-top-color: var(--arcade-text-danger);
}
.arcade-cta--destructive.arcade-cta--standard.--dark {
  background: rgba(204, 0, 0, 0.2);
  color: #ff6666;
}
.arcade-cta--destructive.arcade-cta--standard.--dark .arcade-cta__spinner {
  border-top-color: #ff6666;
}

.arcade-cta--destructive.arcade-cta--subtle {
  color: var(--arcade-text-danger);
}
.arcade-cta--destructive.arcade-cta--subtle.--dark {
  color: #ff6666;
}
</style>
