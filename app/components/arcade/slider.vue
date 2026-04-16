<script setup lang="ts">
defineOptions({ name: 'ArcadeSlider' })

interface ArcadeSliderProps {
  modelValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeSliderProps>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const { isDark } = useArcadeTheme()

const fillPercent = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

function handleInput(event: Event) {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div
    class="arcade-slider"
    :class="{
      'arcade-slider--dark': isDark,
      'arcade-slider--disabled': disabled
    }"
  >
    <input
      type="range"
      class="arcade-slider__input"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :style="{ '--fill': `${fillPercent}%` }"
      @input="handleInput"
    >
  </div>
</template>

<style scoped>
.arcade-slider {
  display: flex;
  align-items: center;
  height: 1.375em;
  width: 100%;
}

.arcade-slider--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.arcade-slider__input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.125em;
  border-radius: var(--arcade-radius-pill);
  background: linear-gradient(
    to right,
    var(--arcade-icon-standard) 0%,
    var(--arcade-icon-standard) var(--fill, 0%),
    var(--arcade-border-subtle) var(--fill, 0%),
    var(--arcade-border-subtle) 100%
  );
  outline: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.arcade-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0.75em;
  height: 0.75em;
  border-radius: var(--arcade-radius-circle);
  background: var(--arcade-icon-standard);
  border: none;
  box-shadow: 0 0.0625em 0.1875em rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform var(--arcade-duration-fast) var(--arcade-ease-default);
}

.arcade-slider--dark .arcade-slider__input::-webkit-slider-thumb {
  box-shadow: 0 0.0625em 0.1875em rgba(0, 0, 0, 0.4);
}

.arcade-slider__input::-webkit-slider-thumb:active {
  transform: scale(1.15);
}

.arcade-slider__input::-moz-range-thumb {
  width: 0.75em;
  height: 0.75em;
  border-radius: var(--arcade-radius-circle);
  background: var(--arcade-icon-standard);
  border: none;
  box-shadow: 0 0.0625em 0.1875em rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.arcade-slider--dark .arcade-slider__input::-moz-range-thumb {
  box-shadow: 0 0.0625em 0.1875em rgba(0, 0, 0, 0.4);
}

.arcade-slider__input::-moz-range-track {
  height: 0.125em;
  border-radius: var(--arcade-radius-pill);
  background: transparent;
  border: none;
}
</style>
