<script setup lang="ts">
defineOptions({ name: 'ArcadeButtonIcon' })

interface ArcadeButtonIconProps {
  icon: string
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<ArcadeButtonIconProps>(), {
  disabled: false,
  ariaLabel: undefined
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const { isDark } = useArcadeTheme()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const iconSvg = computed(() => {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit('click', event)
}
</script>

<template>
  <button
    class="arcade-btn-icon"
    :class="{
      'arcade-btn-icon--dark': isDark,
      'arcade-btn-icon--disabled': disabled
    }"
    :disabled="disabled"
    :aria-label="ariaLabel ?? icon"
    @click="handleClick"
  >
    <span class="arcade-btn-icon__glyph" v-html="iconSvg" />
  </button>
</template>

<style scoped>
.arcade-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  padding: 0;
  border: none;
  border-radius: var(--arcade-radius-pill);
  background: transparent;
  color: var(--arcade-icon-standard);
  cursor: pointer;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
  outline: none;
  flex-shrink: 0;
}

.arcade-btn-icon:focus-visible {
  outline: 0.0625rem solid var(--arcade-brand);
  outline-offset: 0.0625rem;
}

.arcade-btn-icon:active:not(:disabled) {
  background: rgba(0, 0, 0, 0.06);
}

.arcade-btn-icon--dark:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
}

.arcade-btn-icon--disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}

.arcade-btn-icon__glyph {
  width: 0.75em;
  height: 0.75em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-btn-icon__glyph :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
