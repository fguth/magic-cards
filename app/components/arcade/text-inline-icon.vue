<script setup lang="ts">
defineOptions({ name: 'ArcadeTextInlineIcon' })

interface ArcadeTextInlineIconProps {
  text: string
  icon?: string
  iconPosition?: 'leading' | 'trailing'
  size?: 'medium' | 'small'
  weight?: 'regular' | 'medium'
}

const props = withDefaults(defineProps<ArcadeTextInlineIconProps>(), {
  icon: undefined,
  iconPosition: 'trailing',
  size: 'medium',
  weight: 'regular'
})

const icons16 = import.meta.glob('@/assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const iconSvg = computed(() => {
  if (!props.icon) return ''
  const match = Object.entries(icons16).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})
</script>

<template>
  <span
    class="arcade-text-inline-icon"
    :class="[
      `arcade-text-inline-icon--size-${size}`,
      `arcade-text-inline-icon--weight-${weight}`
    ]"
  >
    <span v-if="icon && iconSvg && iconPosition === 'leading'" class="arcade-text-inline-icon__icon" v-html="iconSvg" />
    <span class="arcade-text-inline-icon__text">{{ text }}</span>
    <span v-if="icon && iconSvg && iconPosition === 'trailing'" class="arcade-text-inline-icon__icon" v-html="iconSvg" />
  </span>
</template>

<style scoped>
.arcade-text-inline-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.0625em;
  color: var(--arcade-text-standard);
}

.arcade-text-inline-icon--size-medium {
  font-size: 0.5em;
}

.arcade-text-inline-icon--size-small {
  font-size: 0.4375em;
}

.arcade-text-inline-icon--weight-regular .arcade-text-inline-icon__text {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
}

.arcade-text-inline-icon--weight-medium .arcade-text-inline-icon__text {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
}

.arcade-text-inline-icon__icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.arcade-text-inline-icon__icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
