<script setup lang="ts">
defineOptions({ name: 'ArcadeInputChip' })

interface ArcadeInputChipProps {
  label: string
  selected?: boolean
  disabled?: boolean
}

withDefaults(defineProps<ArcadeInputChipProps>(), {
  selected: false,
  disabled: false
})

const emit = defineEmits<{ click: [] }>()

function handleClick() {
  emit('click')
}
</script>

<template>
  <button
    class="arcade-input-chip"
    :class="{
      'arcade-input-chip--selected': selected,
      'arcade-input-chip--disabled': disabled
    }"
    type="button"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.arcade-input-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  min-width: 2.625rem;
  padding: 0.625rem 0.75rem;
  border: 0.03125rem solid var(--arcade-border-standard);
  border-radius: var(--arcade-radius-medium);
  background: var(--arcade-bg-app);
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5rem;
  line-height: 0.75rem;
  letter-spacing: 0;
  color: var(--arcade-text-standard);
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default),
    border-color var(--arcade-duration-fast) var(--arcade-ease-default);
}

.arcade-input-chip:focus-visible {
  outline: 0.0625rem solid var(--arcade-brand);
  outline-offset: 0.0625rem;
}

.arcade-input-chip:active:not(:disabled) {
  background: var(--arcade-bg-subtle);
}

.arcade-input-chip--selected {
  border-color: var(--arcade-border-prominent);
  border-width: 0.0625rem;
  padding: 0.59375rem 0.71875rem;
}

.arcade-input-chip--disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}
</style>
