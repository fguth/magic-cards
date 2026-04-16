<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonDropdown' })

interface ArcadeButtonDropdownProps {
  label: string
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeButtonDropdownProps>(), {
  icon: undefined,
  disabled: false,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { isDark } = useArcadeTheme()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const icons16 = import.meta.glob('@/assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const iconSvg = computed(() => {
  if (!props.icon) return ''
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})

const chevronSvg = computed(() => {
  const match = Object.entries(icons16).find(([key]) => key.endsWith('/subtle-expand.svg'))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit('click', event)
}
</script>

<template>
  <button
    class="arcade-dropdown"
    :class="{
      '--dark': isDark,
      'arcade-dropdown--disabled': disabled,
    }"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="icon && iconSvg" class="arcade-dropdown__icon" v-html="iconSvg" />
    <span class="arcade-dropdown__label">{{ label }}</span>
    <span class="arcade-dropdown__chevron" v-html="chevronSvg" />
  </button>
</template>

<style scoped>
.arcade-dropdown {
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
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
  outline: none;
  background: rgba(0, 0, 0, 0.08);
  color: var(--arcade-text-standard);
}

.arcade-dropdown:focus-visible {
  outline: 0.0625rem solid currentColor;
  outline-offset: 0.0625rem;
}

.arcade-dropdown:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.16);
}

.arcade-dropdown--disabled {
  cursor: default;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.25);
}

.arcade-dropdown.--dark {
  background: rgba(255, 255, 255, 0.12);
}

.arcade-dropdown.--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.arcade-dropdown.--dark.arcade-dropdown--disabled {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.25);
}

.arcade-dropdown__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-dropdown__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-dropdown__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.01em;
}

.arcade-dropdown__chevron {
  width: 0.25em;
  height: 0.25em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.arcade-dropdown__chevron :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
