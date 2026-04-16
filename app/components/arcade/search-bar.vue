<script setup lang="ts">
defineOptions({ name: 'ArcadeSearchBar' })

interface ArcadeSearchBarProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<ArcadeSearchBarProps>(), {
  modelValue: '',
  placeholder: 'Search',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  submit: []
}>()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const searchIcon = computed(() => resolveIcon('search'))

function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function handleClear() {
  emit('update:modelValue', '')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') emit('submit')
}
</script>

<template>
  <div
    class="arcade-search-bar"
    :class="{ 'arcade-search-bar--disabled': disabled }"
  >
    <span class="arcade-search-bar__search-icon" v-html="searchIcon" />

    <input
      class="arcade-search-bar__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
      @focus="emit('focus')"
      @blur="emit('blur')"
      @keydown="handleKeydown"
    >

    <button
      v-if="modelValue"
      class="arcade-search-bar__clear"
      aria-label="Clear"
      tabindex="-1"
      @click="handleClear"
    >
      <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 1.497L10.497 9 18 16.503 16.503 18 9 10.497 1.497 18 0 16.503 7.503 9 0 1.497 1.497 0 9 7.503 16.503 0 18 1.497Z" fill="currentColor"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.arcade-search-bar {
  display: flex;
  align-items: center;
  height: 1.375em;
  border-radius: var(--arcade-radius-xsmall);
  background: var(--arcade-bg-subtle);
  padding: 0 0.5em;
  gap: 0.25em;
}

.arcade-search-bar--disabled {
  opacity: 0.35;
  pointer-events: none;
}

.arcade-search-bar__search-icon {
  width: 0.625em;
  height: 0.625em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  color: var(--arcade-icon-standard);
}

.arcade-search-bar__search-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-search-bar__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  padding: 0;
  margin: 0;
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  color: var(--arcade-text-standard);
}

.arcade-search-bar__input::placeholder {
  color: var(--arcade-text-disabled);
}

.arcade-search-bar__clear {
  flex-shrink: 0;
  width: 0.5em;
  height: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--arcade-icon-standard);
  opacity: 0.4;
  -webkit-tap-highlight-color: transparent;
}

.arcade-search-bar__clear svg {
  width: 100%;
  height: 100%;
}

.arcade-search-bar__clear:active {
  opacity: 0.6;
}
</style>
