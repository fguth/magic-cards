<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonDefault' })

interface ArcadeButtonDefaultProps {
  label: string
  icon?: string
  prominence?: 'standard' | 'prominent' | 'subtle'
  destructive?: boolean
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<ArcadeButtonDefaultProps>(), {
  icon: undefined,
  prominence: 'standard',
  destructive: false,
  disabled: false,
  loading: false,
  fullWidth: false
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
    class="arcade-btn"
    :class="[
      `arcade-btn--${prominence}`,
      {
        'arcade-btn--dark': isDark,
        'arcade-btn--destructive': destructive,
        'arcade-btn--disabled': disabled,
        'arcade-btn--loading': loading,
        'arcade-btn--full': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="arcade-btn__spinner" />
    <template v-else>
      <span v-if="icon && iconSvg" class="arcade-btn__icon" v-html="iconSvg" />
      <span class="arcade-btn__label">{{ label }}</span>
    </template>
  </button>
</template>

<style scoped>
.arcade-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  height: 1.375em;
  padding: 0 0.75em;
  border: none;
  border-radius: var(--arcade-radius-pill);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--arcade-transition-color);
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.arcade-btn--full {
  width: 100%;
}

.arcade-btn:focus-visible {
  outline: 0.0625rem solid currentColor;
  outline-offset: 0.0625rem;
}

.arcade-btn--disabled {
  cursor: default;
  pointer-events: none;
}

.arcade-btn--loading {
  cursor: default;
}

.arcade-btn__icon {
  width: 0.625em;
  height: 0.625em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-btn__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-btn__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.arcade-btn__spinner {
  width: 0.5em;
  height: 0.5em;
  border-radius: var(--arcade-radius-circle);
  border: 0.0625em solid transparent;
  animation: arcade-btn-spin 0.7s linear infinite;
}

@keyframes arcade-btn-spin {
  to { transform: rotate(360deg); }
}

.arcade-btn--standard {
  background: rgba(0, 0, 0, 0.08);
  color: var(--arcade-text-standard);
}
.arcade-btn--standard:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.16);
}
.arcade-btn--standard.arcade-btn--disabled {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}
.arcade-btn--standard .arcade-btn__spinner {
  border-top-color: var(--arcade-text-standard);
}

.arcade-btn--standard.arcade-btn--dark {
  background: rgba(255, 255, 255, 0.12);
}
.arcade-btn--standard.arcade-btn--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}
.arcade-btn--standard.arcade-btn--dark.arcade-btn--disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-btn--prominent {
  background: var(--arcade-bg-inverse);
  color: var(--arcade-text-inverse);
}
.arcade-btn--prominent:active:not(:disabled) {
  background: #333;
}
.arcade-btn--prominent.arcade-btn--disabled {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}
.arcade-btn--prominent .arcade-btn__spinner {
  border-top-color: var(--arcade-text-inverse);
}

.arcade-btn--prominent.arcade-btn--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
}
.arcade-btn--prominent.arcade-btn--dark.arcade-btn--disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-btn--subtle {
  background: transparent;
  padding: 0;
  height: auto;
  color: var(--arcade-text-standard);
}
.arcade-btn--subtle .arcade-btn__label {
  text-decoration: underline;
  text-underline-offset: 0.125em;
}
.arcade-btn--subtle:active:not(:disabled) { color: rgba(0, 0, 0, 0.5); }
.arcade-btn--subtle.arcade-btn--disabled { color: rgba(0, 0, 0, 0.25); }

.arcade-btn--subtle.arcade-btn--dark:active:not(:disabled) { color: rgba(255, 255, 255, 0.5); }
.arcade-btn--subtle.arcade-btn--dark.arcade-btn--disabled { color: rgba(255, 255, 255, 0.25); }

.arcade-btn--destructive.arcade-btn--standard {
  background: rgba(204, 0, 0, 0.1);
  color: var(--arcade-text-danger);
}
.arcade-btn--destructive.arcade-btn--standard.arcade-btn--dark {
  background: rgba(204, 0, 0, 0.2);
  color: #ff6666;
}
.arcade-btn--destructive.arcade-btn--prominent,
.arcade-btn--destructive.arcade-btn--prominent.arcade-btn--dark {
  background: var(--arcade-bg-danger);
  color: #fff;
}
.arcade-btn--destructive.arcade-btn--subtle {
  color: var(--arcade-text-danger);
}
.arcade-btn--destructive.arcade-btn--subtle.arcade-btn--dark {
  color: #ff6666;
}
</style>
