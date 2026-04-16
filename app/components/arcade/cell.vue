<script setup lang="ts">
defineOptions({ name: 'ArcadeCell' })

interface ArcadeCellProps {
  label: string
  body?: string
  icon?: string
  accessory?: 'push' | 'expand' | 'none'
  showDivider?: boolean
}

const props = withDefaults(defineProps<ArcadeCellProps>(), {
  body: undefined,
  icon: undefined,
  accessory: 'none',
  showDivider: false
})

defineEmits<{ click: [event: MouseEvent] }>()

const { isDark } = useArcadeTheme()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const iconSvg = computed(() => props.icon ? resolveIcon(props.icon) : '')

const accessoryIcon = computed(() => {
  if (props.accessory === 'push') return resolveIcon('push')
  if (props.accessory === 'expand') return resolveIcon('expand')
  return ''
})

const isInteractive = computed(() => props.accessory !== 'none')
</script>

<template>
  <component
    :is="isInteractive ? 'button' : 'div'"
    class="arcade-cell"
    :class="[
      { 'arcade-cell--dark': isDark, 'arcade-cell--interactive': isInteractive }
    ]"
    @click="isInteractive ? $emit('click', $event) : undefined"
  >
    <span v-if="icon && iconSvg" class="arcade-cell__icon" v-html="iconSvg" />

    <div class="arcade-cell__content">
      <p class="arcade-cell__label">{{ label }}</p>
      <p v-if="body" class="arcade-cell__body">{{ body }}</p>
    </div>

    <span v-if="accessoryIcon" class="arcade-cell__accessory" v-html="accessoryIcon" />

    <div v-if="showDivider" class="arcade-cell__divider" />
  </component>
</template>

<style scoped>
.arcade-cell {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  padding: 0.5em;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}

.arcade-cell--interactive {
  cursor: pointer;
}

.arcade-cell--interactive:active {
  opacity: 0.7;
}

.arcade-cell__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-standard);
}

.arcade-cell__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-cell__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.0625em;
}

.arcade-cell__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-cell__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.43;
  letter-spacing: -0.0025em;
  margin: 0;
  color: var(--arcade-text-subtle);
}

.arcade-cell__accessory {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-subtle);
}

.arcade-cell__accessory :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-cell__divider {
  position: absolute;
  bottom: 0;
  left: 0.5em;
  right: 0.5em;
  height: 0.03125rem;
  background: var(--arcade-border-subtle);
}
</style>
