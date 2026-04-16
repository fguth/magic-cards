<script setup lang="ts">
defineOptions({ name: 'ArcadeToggle' })

interface ArcadeToggleProps {
  modelValue?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeToggleProps>(), {
  modelValue: false,
  disabled: false
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { isDark } = useArcadeTheme()

function toggle() {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    class="arcade-toggle"
    :class="{
      'arcade-toggle--on': modelValue,
      'arcade-toggle--disabled': disabled,
      'arcade-toggle--dark': isDark
    }"
    role="switch"
    :aria-checked="modelValue"
    :aria-disabled="disabled"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="arcade-toggle__track">
      <span class="arcade-toggle__thumb" />
    </span>
  </button>
</template>

<style scoped>
.arcade-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.arcade-toggle:focus-visible .arcade-toggle__track {
  outline: 0.0625rem solid var(--arcade-brand);
  outline-offset: 0.0625rem;
}

.arcade-toggle__track {
  position: relative;
  width: 1.625em;
  height: 1em;
  border-radius: var(--arcade-radius-pill);
  background: rgba(0, 0, 0, 0.15);
  transition: background-color var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-toggle--dark .arcade-toggle__track {
  background: rgba(255, 255, 255, 0.15);
}

.arcade-toggle--on .arcade-toggle__track {
  background: var(--arcade-brand);
}

.arcade-toggle__thumb {
  position: absolute;
  top: 0.0625em;
  left: 0.0625em;
  width: 0.875em;
  height: 0.875em;
  border-radius: var(--arcade-radius-circle);
  background: #fff;
  transition: transform var(--arcade-duration-normal) var(--arcade-ease-default);
  box-shadow: 0 0.0625em 0.125em rgba(0, 0, 0, 0.2);
}

.arcade-toggle--on .arcade-toggle__thumb {
  transform: translateX(0.625em);
}

.arcade-toggle--disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
</style>
