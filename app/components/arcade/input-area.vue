<script setup lang="ts">
defineOptions({ name: 'ArcadeInputArea' })

interface ArcadeInputAreaProps {
  modelValue?: string
  label?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  disabled?: boolean
  rows?: number
  helperIcon?: string
}

const props = withDefaults(defineProps<ArcadeInputAreaProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  helperText: undefined,
  errorText: undefined,
  disabled: false,
  rows: 4,
  helperIcon: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const isFocused = ref(false)
const isPressed = ref(false)
const hasValue = computed(() => props.modelValue.length > 0)

const icons16 = import.meta.glob('@/assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string | undefined): string {
  if (!name) return ''
  const match = Object.entries(icons16).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const helperIconSvg = computed(() => resolveIcon(props.helperIcon))

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true
  isPressed.value = false
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false
  isPressed.value = false
  emit('blur', event)
}

function handleMouseDown() {
  if (!props.disabled && !isFocused.value) isPressed.value = true
}

function handleMouseUp() {
  isPressed.value = false
}
</script>

<template>
  <div
    class="arcade-input-area"
    :class="{
      'arcade-input-area--error': errorText,
      'arcade-input-area--focused': isFocused,
      'arcade-input-area--pressed': isPressed && !isFocused,
      'arcade-input-area--filled': hasValue && !isFocused && !errorText,
      'arcade-input-area--disabled': disabled,
    }"
  >
    <label v-if="label" class="arcade-input-area__label">{{ label }}</label>
    <div
      class="arcade-input-area__container"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <textarea
        class="arcade-input-area__textarea"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
    <span v-if="errorText" class="arcade-input-area__helper arcade-input-area__helper--error">
      {{ errorText }}
    </span>
    <span v-else-if="helperText" class="arcade-input-area__helper">
      <span
        v-if="helperIcon && helperIconSvg"
        class="arcade-input-area__helper-icon"
        v-html="helperIconSvg"
      />
      {{ helperText }}
    </span>
  </div>
</template>

<style scoped>
.arcade-input-area {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.arcade-input-area__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--arcade-text-standard);
}

.arcade-input-area__container {
  display: flex;
  border: 0.03125em solid var(--arcade-border-subtle);
  border-radius: var(--arcade-radius-small);
  background: transparent;
  transition: border-color var(--arcade-duration-fast) var(--arcade-ease-default),
    background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  box-sizing: border-box;
  cursor: text;
}

.arcade-input-area--pressed .arcade-input-area__container {
  background: var(--arcade-bg-standard);
}

.arcade-input-area--focused .arcade-input-area__container {
  border-color: var(--arcade-text-standard);
  border-width: 0.0625em;
  padding: 0;
}

.arcade-input-area--error .arcade-input-area__container {
  border-color: var(--arcade-border-danger);
  border-width: 0.0625em;
  padding: 0;
}

.arcade-input-area__textarea {
  flex: 1;
  min-height: 3.125em;
  padding: 0.375em 0.5em;
  border: none;
  border-radius: inherit;
  background: transparent;
  color: var(--arcade-text-standard);
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
}

.arcade-input-area__textarea::placeholder {
  color: var(--arcade-text-placeholder);
}

.arcade-input-area__helper {
  display: flex;
  align-items: center;
  gap: 0.125em;
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.4286;
  letter-spacing: -0.00109rem;
  color: var(--arcade-text-subtle);
}

.arcade-input-area__helper--error {
  color: var(--arcade-text-danger);
}

.arcade-input-area__helper-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.arcade-input-area__helper-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-area--disabled {
  pointer-events: none;
}

.arcade-input-area--disabled .arcade-input-area__label {
  color: var(--arcade-text-disabled);
}

.arcade-input-area--disabled .arcade-input-area__container {
  background: var(--arcade-bg-subtle);
  border-color: var(--arcade-border-subtle);
}

.arcade-input-area--disabled .arcade-input-area__textarea {
  color: var(--arcade-text-disabled);
}

.arcade-input-area--disabled .arcade-input-area__textarea::placeholder {
  color: var(--arcade-text-disabled);
}

.arcade-input-area--disabled .arcade-input-area__helper {
  color: var(--arcade-text-disabled);
}
</style>
