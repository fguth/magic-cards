<script setup lang="ts">
defineOptions({ name: 'ArcadeInputField' })

interface ArcadeInputFieldProps {
  modelValue?: string
  label?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  leadingIcon?: string
  trailingIcon?: string
  helperIcon?: string
}

const props = withDefaults(defineProps<ArcadeInputFieldProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  helperText: undefined,
  errorText: undefined,
  disabled: false,
  type: 'text',
  leadingIcon: undefined,
  trailingIcon: undefined,
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

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const icons16 = import.meta.glob('@/assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string | undefined, size: '16' | '24'): string {
  if (!name) return ''
  const icons = size === '16' ? icons16 : icons24
  const match = Object.entries(icons).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const leadingIconSvg = computed(() => resolveIcon(props.leadingIcon, '24'))
const trailingIconSvg = computed(() => resolveIcon(props.trailingIcon, '24'))
const helperIconSvg = computed(() => resolveIcon(props.helperIcon, '16'))

const errorIconSvg = computed(() => resolveIcon('alert-fill', '24'))

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
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
    class="arcade-input-field"
    :class="{
      'arcade-input-field--error': errorText,
      'arcade-input-field--focused': isFocused,
      'arcade-input-field--pressed': isPressed && !isFocused,
      'arcade-input-field--filled': hasValue && !isFocused && !errorText,
      'arcade-input-field--disabled': disabled,
    }"
  >
    <label v-if="label" class="arcade-input-field__label">{{ label }}</label>
    <div
      class="arcade-input-field__container"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <span
        v-if="leadingIcon && leadingIconSvg"
        class="arcade-input-field__leading-icon"
        v-html="leadingIconSvg"
      />
      <input
        class="arcade-input-field__input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <span
        v-if="errorText && errorIconSvg"
        class="arcade-input-field__trailing-icon arcade-input-field__trailing-icon--error"
        v-html="errorIconSvg"
      />
      <span
        v-else-if="trailingIcon && trailingIconSvg"
        class="arcade-input-field__trailing-icon"
        v-html="trailingIconSvg"
      />
      <slot v-else name="trailing" />
    </div>
    <span v-if="errorText" class="arcade-input-field__helper arcade-input-field__helper--error">
      {{ errorText }}
    </span>
    <span v-else-if="helperText" class="arcade-input-field__helper">
      <span
        v-if="helperIcon && helperIconSvg"
        class="arcade-input-field__helper-icon"
        v-html="helperIconSvg"
      />
      {{ helperText }}
    </span>
  </div>
</template>

<style scoped>
.arcade-input-field {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}

.arcade-input-field__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--arcade-text-standard);
}

.arcade-input-field__container {
  display: flex;
  align-items: center;
  gap: 0.25em;
  padding: 0.375em 0.5em;
  border: 0.03125em solid var(--arcade-border-subtle);
  border-radius: var(--arcade-radius-small);
  background: transparent;
  transition: border-color var(--arcade-duration-fast) var(--arcade-ease-default),
    background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  box-sizing: border-box;
  min-height: 1.5em;
  cursor: text;
}

.arcade-input-field--pressed .arcade-input-field__container {
  background: var(--arcade-bg-standard);
}

.arcade-input-field--focused .arcade-input-field__container {
  border-color: var(--arcade-text-standard);
  border-width: 0.0625em;
  padding: 0.34375em 0.46875em;
}

.arcade-input-field--error .arcade-input-field__container {
  border-color: var(--arcade-border-danger);
  border-width: 0.0625em;
  padding: 0.34375em 0.46875em;
}

.arcade-input-field__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--arcade-text-standard);
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  outline: none;
  padding: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.arcade-input-field__input::placeholder {
  color: var(--arcade-text-placeholder);
}

.arcade-input-field__leading-icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-subtle);
}

.arcade-input-field__leading-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-field__trailing-icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-subtle);
}

.arcade-input-field__trailing-icon--error {
  color: var(--arcade-icon-danger);
}

.arcade-input-field__trailing-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-field__helper {
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

.arcade-input-field__helper--error {
  color: var(--arcade-text-danger);
}

.arcade-input-field__helper-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.arcade-input-field__helper-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-field--disabled {
  pointer-events: none;
}

.arcade-input-field--disabled .arcade-input-field__label {
  color: var(--arcade-text-disabled);
}

.arcade-input-field--disabled .arcade-input-field__container {
  background: var(--arcade-bg-subtle);
  border-color: var(--arcade-border-subtle);
}

.arcade-input-field--disabled .arcade-input-field__input {
  color: var(--arcade-text-disabled);
}

.arcade-input-field--disabled .arcade-input-field__input::placeholder {
  color: var(--arcade-text-disabled);
}

.arcade-input-field--disabled .arcade-input-field__leading-icon,
.arcade-input-field--disabled .arcade-input-field__trailing-icon {
  color: var(--arcade-icon-disabled);
}

.arcade-input-field--disabled .arcade-input-field__helper {
  color: var(--arcade-text-disabled);
}
</style>
