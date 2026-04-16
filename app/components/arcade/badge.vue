<script setup lang="ts">
defineOptions({ name: 'ArcadeBadge' })

interface ArcadeBadgeProps {
  count?: number
  variant?: 'number' | 'critical'
  size?: 'small' | 'large'
  stroke?: 'default' | 'keypad' | 'bitcoin'
}

const props = withDefaults(defineProps<ArcadeBadgeProps>(), {
  count: undefined,
  variant: 'number',
  size: 'large',
  stroke: 'default'
})

const { isDark } = useArcadeTheme()

const displayText = computed(() => {
  if (props.variant === 'critical') return '!'
  if (props.count === undefined) return ''
  if (props.count > 99) return '99+'
  return String(props.count)
})
</script>

<template>
  <span
    class="arcade-badge"
    :class="[
      `arcade-badge--${size}`,
      `arcade-badge--${variant}`,
      `arcade-badge--stroke-${stroke}`,
      { 'arcade-badge--dark': isDark }
    ]"
    aria-label="notification badge"
  >
    <span v-if="size === 'large'" class="arcade-badge__text">{{ displayText }}</span>
  </span>
</template>

<style scoped>
.arcade-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--arcade-radius-pill);
  background: var(--arcade-bg-danger);
  box-sizing: border-box;
  flex-shrink: 0;
}

.arcade-badge--small {
  width: 0.1875em;
  height: 0.1875em;
  border: 0.0625em solid;
}

.arcade-badge--large {
  min-width: 0.5em;
  height: 0.5em;
  padding: 0 0.125em;
  border: 0.0625em solid;
}

.arcade-badge__text {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.3125em;
  line-height: 1;
  color: var(--arcade-text-inverse);
}

.arcade-badge--stroke-default {
  border-color: var(--arcade-bg-app);
}

.arcade-badge--stroke-keypad {
  border-color: #1a1a2e;
}

.arcade-badge--stroke-bitcoin {
  border-color: #f7931a;
}
</style>
