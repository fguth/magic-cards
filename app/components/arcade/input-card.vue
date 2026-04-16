<script setup lang="ts">
defineOptions({ name: 'ArcadeInputCard' })

interface ArcadeInputCardProps {
  modelValue?: boolean
  label: string
  body?: string
  selectionType?: 'radio' | 'checkbox'
  icon?: string
  showDivider?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeInputCardProps>(), {
  modelValue: false,
  body: undefined,
  selectionType: 'checkbox',
  icon: undefined,
  showDivider: false,
  disabled: false
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const iconSvg = computed(() => {
  if (!props.icon) return ''
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${props.icon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})

const rowRole = computed(() => (props.selectionType === 'radio' ? 'radio' : 'checkbox'))

function toggle() {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  toggle()
}
</script>

<template>
  <div
    class="arcade-input-card"
    :class="{
      'arcade-input-card--selected': modelValue,
      'arcade-input-card--disabled': disabled
    }"
    :role="rowRole"
    :aria-checked="modelValue"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown="onKeydown"
  >
    <div class="arcade-input-card__content">
      <span v-if="icon && iconSvg" class="arcade-input-card__icon" v-html="iconSvg" />
      <span class="arcade-input-card__text">
        <span class="arcade-input-card__label">{{ label }}</span>
        <span v-if="body" class="arcade-input-card__body">{{ body }}</span>
      </span>
      <span class="arcade-input-card__indicator">
        <ArcadeRadio
          v-if="selectionType === 'radio'"
          presentational
          :model-value="modelValue"
          :disabled="disabled"
        />
        <ArcadeCheckbox
          v-else
          presentational
          :model-value="modelValue"
          :disabled="disabled"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.arcade-input-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0.5625rem 0.5rem;
  border: none;
  border-radius: var(--arcade-radius-medium);
  background: var(--arcade-bg-app);
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px var(--arcade-border-standard);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  transition: box-shadow var(--arcade-duration-fast) var(--arcade-ease-default);
}

.arcade-input-card:focus-visible {
  outline: 0.0625rem solid var(--arcade-brand);
  outline-offset: 0.0625rem;
}

.arcade-input-card:active:not(.arcade-input-card--disabled) {
  background: var(--arcade-bg-subtle);
}

.arcade-input-card--selected {
  box-shadow: inset 0 0 0 2px var(--arcade-border-prominent);
}

.arcade-input-card__content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.arcade-input-card__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.75rem;
  height: 0.75rem;
  color: var(--arcade-icon-standard);
}

.arcade-input-card__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
  text-align: left;
}

.arcade-input-card__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5rem;
  line-height: 0.75rem;
  letter-spacing: 0;
  color: var(--arcade-text-standard);
}

.arcade-input-card__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5rem;
  line-height: 0.75rem;
  letter-spacing: -0.0025rem;
  color: var(--arcade-text-standard);
}

.arcade-input-card__indicator {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}

.arcade-input-card--disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}
</style>
