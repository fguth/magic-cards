<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonCompact' })

interface ArcadeButtonCompactProps {
  label: string
  icon?: string
  prominence?: 'standard' | 'prominent'
  destructive?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeButtonCompactProps>(), {
  icon: undefined,
  prominence: 'standard',
  destructive: false,
  disabled: false
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
</script>

<template>
  <button
    class="arcade-btn-compact"
    :class="[
      `arcade-btn-compact--${prominence}`,
      {
        'arcade-btn-compact--dark': isDark,
        'arcade-btn-compact--destructive': destructive,
        'arcade-btn-compact--disabled': disabled
      }
    ]"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span v-if="icon && iconSvg" class="arcade-btn-compact__icon" v-html="iconSvg" />
    <span class="arcade-btn-compact__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.arcade-btn-compact {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.125em;
  height: 1em;
  padding: 0 0.5em;
  border: none;
  border-radius: var(--arcade-radius-pill);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default), opacity var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.arcade-btn-compact--disabled {
  cursor: default;
  pointer-events: none;
}

.arcade-btn-compact__icon {
  width: 0.5em;
  height: 0.5em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-btn-compact__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-btn-compact__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1;
  letter-spacing: 0;
}

.arcade-btn-compact--standard {
  background: rgba(0, 0, 0, 0.08);
  color: var(--arcade-text-standard);
}
.arcade-btn-compact--standard:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.16);
}
.arcade-btn-compact--standard.arcade-btn-compact--disabled {
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.25);
}

.arcade-btn-compact--standard.arcade-btn-compact--dark {
  background: rgba(255, 255, 255, 0.12);
}
.arcade-btn-compact--standard.arcade-btn-compact--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}
.arcade-btn-compact--standard.arcade-btn-compact--dark.arcade-btn-compact--disabled {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-btn-compact--prominent {
  background: var(--arcade-bg-inverse);
  color: var(--arcade-text-inverse);
}
.arcade-btn-compact--prominent:active:not(:disabled) {
  background: #333;
}
.arcade-btn-compact--prominent.arcade-btn-compact--disabled {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}

.arcade-btn-compact--prominent.arcade-btn-compact--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
}
.arcade-btn-compact--prominent.arcade-btn-compact--dark.arcade-btn-compact--disabled {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-btn-compact--destructive.arcade-btn-compact--standard {
  background: rgba(204, 0, 0, 0.1);
  color: var(--arcade-text-danger);
}
.arcade-btn-compact--destructive.arcade-btn-compact--standard.arcade-btn-compact--dark {
  background: rgba(204, 0, 0, 0.2);
  color: #ff6666;
}
.arcade-btn-compact--destructive.arcade-btn-compact--prominent,
.arcade-btn-compact--destructive.arcade-btn-compact--prominent.arcade-btn-compact--dark {
  background: var(--arcade-bg-danger);
  color: #fff;
}
</style>
