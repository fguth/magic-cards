<script setup lang="ts">
defineOptions({ name: 'ArcadeInputDropdown' })

interface ArcadeInputDropdownOption {
  value: string
  label: string
}

interface ArcadeInputDropdownProps {
  modelValue?: string
  label?: string
  placeholder?: string
  options?: ArcadeInputDropdownOption[]
  helperText?: string
  errorText?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeInputDropdownProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  options: () => [],
  helperText: undefined,
  errorText: undefined,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isOpen = ref(false)
const isPressed = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const hasValue = computed(() => props.modelValue.length > 0)

const displayText = computed(() => {
  if (!props.modelValue) return ''
  const match = props.options.find(o => o.value === props.modelValue)
  return match ? match.label : props.modelValue
})

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon24(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const expandIconSvg = computed(() => resolveIcon24('expand'))

function toggleOpen() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function selectOption(option: ArcadeInputDropdownOption) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function handleMouseDown() {
  if (!props.disabled && !isOpen.value) isPressed.value = true
}

function handleMouseUp() {
  isPressed.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node))
    isOpen.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    ref="rootRef"
    class="arcade-input-dropdown"
    :class="{
      'arcade-input-dropdown--open': isOpen,
      'arcade-input-dropdown--pressed': isPressed && !isOpen,
      'arcade-input-dropdown--filled': hasValue && !isOpen && !errorText,
      'arcade-input-dropdown--error': errorText,
      'arcade-input-dropdown--disabled': disabled,
    }"
  >
    <label v-if="label" class="arcade-input-dropdown__label">{{ label }}</label>
    <button
      type="button"
      class="arcade-input-dropdown__trigger"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleOpen"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <span
        class="arcade-input-dropdown__text"
        :class="{ 'arcade-input-dropdown__text--placeholder': !hasValue }"
      >
        {{ hasValue ? displayText : placeholder }}
      </span>
      <span
        v-if="expandIconSvg"
        class="arcade-input-dropdown__icon"
        v-html="expandIconSvg"
      />
    </button>

    <Transition name="arcade-dropdown">
      <div
        v-if="isOpen && options.length > 0"
        class="arcade-input-dropdown__menu"
        role="listbox"
      >
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="arcade-input-dropdown__option"
          :class="{ 'arcade-input-dropdown__option--selected': opt.value === modelValue }"
          role="option"
          :aria-selected="opt.value === modelValue"
          @click="selectOption(opt)"
        >
          {{ opt.label }}
        </button>
      </div>
    </Transition>

    <span v-if="errorText" class="arcade-input-dropdown__helper arcade-input-dropdown__helper--error">
      {{ errorText }}
    </span>
    <span v-else-if="helperText" class="arcade-input-dropdown__helper">
      {{ helperText }}
    </span>
  </div>
</template>

<style scoped>
.arcade-input-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  position: relative;
}

.arcade-input-dropdown__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--arcade-text-standard);
}

.arcade-input-dropdown__trigger {
  display: flex;
  align-items: center;
  gap: 0.25em;
  padding: 0.375em 0.5em;
  border: 0.03125em solid var(--arcade-border-subtle);
  border-radius: var(--arcade-radius-small);
  background: transparent;
  cursor: pointer;
  transition: border-color var(--arcade-duration-fast) var(--arcade-ease-default),
    background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  box-sizing: border-box;
  min-height: 1.5em;
  width: 100%;
  text-align: left;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.arcade-input-dropdown--pressed .arcade-input-dropdown__trigger {
  background: var(--arcade-bg-standard);
}

.arcade-input-dropdown--open .arcade-input-dropdown__trigger {
  border-color: var(--arcade-text-standard);
  border-width: 0.0625em;
  padding: 0.34375em 0.46875em;
}

.arcade-input-dropdown--error .arcade-input-dropdown__trigger {
  border-color: var(--arcade-border-danger);
  border-width: 0.0625em;
  padding: 0.34375em 0.46875em;
}

.arcade-input-dropdown__text {
  flex: 1;
  min-width: 0;
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  color: var(--arcade-text-standard);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.arcade-input-dropdown__text--placeholder {
  color: var(--arcade-text-placeholder);
}

.arcade-input-dropdown__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-subtle);
}

.arcade-input-dropdown__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-input-dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: 0.125em;
  background: var(--arcade-bg-app);
  border: 0.03125em solid var(--arcade-border-subtle);
  border-radius: var(--arcade-radius-small);
  box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.08),
    0 0.125em 0.375em rgba(0, 0, 0, 0.04);
  overflow: hidden;
  max-height: 10em;
  overflow-y: auto;
}

.arcade-input-dropdown__option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.375em 0.5em;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  color: var(--arcade-text-standard);
  text-align: left;
  outline: none;
  transition: background-color var(--arcade-duration-instant) var(--arcade-ease-default);
}

.arcade-input-dropdown__option:hover,
.arcade-input-dropdown__option:focus-visible {
  background: var(--arcade-bg-subtle);
}

.arcade-input-dropdown__option--selected {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
}

.arcade-input-dropdown__helper {
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

.arcade-input-dropdown__helper--error {
  color: var(--arcade-text-danger);
}

.arcade-input-dropdown--disabled {
  pointer-events: none;
}

.arcade-input-dropdown--disabled .arcade-input-dropdown__label {
  color: var(--arcade-text-disabled);
}

.arcade-input-dropdown--disabled .arcade-input-dropdown__trigger {
  background: var(--arcade-bg-subtle);
  border-color: var(--arcade-border-subtle);
}

.arcade-input-dropdown--disabled .arcade-input-dropdown__text {
  color: var(--arcade-text-disabled);
}

.arcade-input-dropdown--disabled .arcade-input-dropdown__icon {
  color: var(--arcade-icon-disabled);
}

.arcade-input-dropdown--disabled .arcade-input-dropdown__helper {
  color: var(--arcade-text-disabled);
}

.arcade-dropdown-enter-active,
.arcade-dropdown-leave-active {
  transition: opacity var(--arcade-duration-fast) var(--arcade-ease-default),
    transform var(--arcade-duration-fast) var(--arcade-ease-default);
  transform-origin: top center;
}

.arcade-dropdown-enter-from,
.arcade-dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.96) translateY(-0.0625em);
}
</style>
