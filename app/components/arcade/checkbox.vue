<script setup lang="ts">
defineOptions({ name: 'ArcadeCheckbox' })

interface ArcadeCheckboxProps {
  modelValue?: boolean
  disabled?: boolean
  presentational?: boolean
}

const props = withDefaults(defineProps<ArcadeCheckboxProps>(), {
  modelValue: false,
  disabled: false,
  presentational: false
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const rootTag = computed(() => (props.presentational ? 'span' : 'button'))

function toggle() {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}

function onRootClick() {
  if (props.presentational) return
  toggle()
}
</script>

<template>
  <component
    :is="rootTag"
    class="arcade-checkbox"
    :class="{
      'arcade-checkbox--checked': modelValue,
      'arcade-checkbox--disabled': disabled,
      'arcade-checkbox--presentational': presentational
    }"
    :type="presentational ? undefined : 'button'"
    :role="presentational ? undefined : 'checkbox'"
    :aria-checked="presentational ? undefined : modelValue"
    :aria-disabled="presentational ? undefined : disabled"
    :aria-hidden="presentational ? true : undefined"
    :disabled="presentational ? undefined : disabled"
    @click="onRootClick"
  >
    <span class="arcade-checkbox__visual">
      <svg
        v-if="modelValue"
        class="arcade-checkbox__check"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M6 12.5L10.5 18L18 8"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </component>
</template>

<style scoped>
.arcade-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.arcade-checkbox::before {
  content: '';
  position: absolute;
  z-index: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: color-mix(in srgb, var(--arcade-icon-standard) 12%, transparent);
  opacity: 0;
  transition: opacity var(--arcade-duration-fast) var(--arcade-ease-default);
  pointer-events: none;
}

.arcade-checkbox:active:not(:disabled)::before,
.arcade-checkbox:focus-visible:not(:disabled)::before {
  opacity: 1;
}

.arcade-checkbox__visual {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--arcade-radius-small);
  border: 0.03125rem solid var(--arcade-border-standard);
  background: transparent;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default),
    border-color var(--arcade-duration-fast) var(--arcade-ease-default);
}

.arcade-checkbox--checked .arcade-checkbox__visual {
  background: var(--arcade-bg-inverse);
  border-color: var(--arcade-bg-inverse);
}

.arcade-checkbox__check {
  width: 0.5625rem;
  height: 0.5625rem;
  color: var(--arcade-icon-inverse);
}

.arcade-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.arcade-checkbox--disabled::before {
  opacity: 0;
}

.arcade-checkbox--disabled:not(.arcade-checkbox--checked) .arcade-checkbox__visual {
  background: var(--arcade-bg-subtle);
  border-color: var(--arcade-border-subtle);
}

.arcade-checkbox--disabled.arcade-checkbox--checked .arcade-checkbox__visual {
  background: var(--arcade-bg-extra-prominent);
  border-color: var(--arcade-bg-extra-prominent);
}

.arcade-checkbox--disabled.arcade-checkbox--checked .arcade-checkbox__check {
  color: var(--arcade-icon-inverse);
}

.arcade-checkbox--presentational {
  cursor: inherit;
  pointer-events: none;
}

.arcade-checkbox--presentational::before {
  display: none;
}
</style>
