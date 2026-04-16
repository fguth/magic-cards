<script setup lang="ts">
defineOptions({ name: 'ArcadeRadio' })

interface ArcadeRadioProps {
  modelValue?: boolean
  disabled?: boolean
  presentational?: boolean
}

const props = withDefaults(defineProps<ArcadeRadioProps>(), {
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
    class="arcade-radio"
    :class="{
      'arcade-radio--checked': modelValue,
      'arcade-radio--disabled': disabled,
      'arcade-radio--presentational': presentational
    }"
    :type="presentational ? undefined : 'button'"
    :role="presentational ? undefined : 'radio'"
    :aria-checked="presentational ? undefined : modelValue"
    :aria-disabled="presentational ? undefined : disabled"
    :aria-hidden="presentational ? true : undefined"
    :disabled="presentational ? undefined : disabled"
    @click="onRootClick"
  >
    <span class="arcade-radio__visual">
      <span v-if="modelValue" class="arcade-radio__dot" />
    </span>
  </component>
</template>

<style scoped>
.arcade-radio {
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

.arcade-radio::before {
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

.arcade-radio:active:not(:disabled)::before,
.arcade-radio:focus-visible:not(:disabled)::before {
  opacity: 1;
}

.arcade-radio__visual {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--arcade-radius-circle);
  border: 0.03125rem solid var(--arcade-border-standard);
  background: transparent;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default),
    border-color var(--arcade-duration-fast) var(--arcade-ease-default);
}

.arcade-radio--checked .arcade-radio__visual {
  background: var(--arcade-bg-inverse);
  border-color: var(--arcade-bg-inverse);
}

.arcade-radio__dot {
  width: 0.25rem;
  height: 0.25rem;
  border-radius: var(--arcade-radius-circle);
  background: var(--arcade-icon-inverse);
}

.arcade-radio--disabled {
  cursor: default;
  pointer-events: none;
}

.arcade-radio--disabled::before {
  opacity: 0;
}

.arcade-radio--disabled:not(.arcade-radio--checked) .arcade-radio__visual {
  background: var(--arcade-bg-subtle);
  border-color: var(--arcade-border-subtle);
}

.arcade-radio--disabled.arcade-radio--checked .arcade-radio__visual {
  background: var(--arcade-bg-extra-prominent);
  border-color: var(--arcade-bg-extra-prominent);
}

.arcade-radio--disabled.arcade-radio--checked .arcade-radio__dot {
  background: var(--arcade-icon-inverse);
}

.arcade-radio--presentational {
  cursor: inherit;
  pointer-events: none;
}

.arcade-radio--presentational::before {
  display: none;
}
</style>
