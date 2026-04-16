<script setup lang="ts">
defineOptions({ name: 'ArcadeFilterBar' })

interface FilterItem {
  id: string
  label: string
  type?: 'default' | 'dropdown'
}

interface ArcadeFilterBarProps {
  filters?: FilterItem[]
  modelValue?: string
}

const props = withDefaults(defineProps<ArcadeFilterBarProps>(), {
  filters: () => [],
  modelValue: undefined
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="arcade-filter-bar">
    <button
      v-for="filter in filters"
      :key="filter.id"
      class="arcade-filter-bar__chip"
      :class="{
        'arcade-filter-bar__chip--selected': modelValue === filter.id,
        'arcade-filter-bar__chip--dropdown': filter.type === 'dropdown'
      }"
      @click="emit('update:modelValue', filter.id)"
    >
      <span class="arcade-filter-bar__label">{{ filter.label }}</span>
      <svg
        v-if="filter.type === 'dropdown'"
        class="arcade-filter-bar__chevron"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.arcade-filter-bar {
  display: flex;
  gap: 0.25em;
  padding: 0 0.5em;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.arcade-filter-bar::-webkit-scrollbar {
  display: none;
}

.arcade-filter-bar__chip {
  flex-shrink: 0;
  height: 1.25em;
  padding: 0 0.5em;
  border: 0.03125rem solid var(--arcade-border-subtle);
  border-radius: var(--arcade-radius-pill);
  background: transparent;
  color: var(--arcade-text-standard);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.125em;
  white-space: nowrap;
  cursor: pointer;
  scroll-snap-align: start;
  transition: var(--arcade-transition-color),
              border-color var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
}

.arcade-filter-bar__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1;
  letter-spacing: 0.00109rem;
}

.arcade-filter-bar__chevron {
  width: 0.375em;
  height: 0.375em;
}

.arcade-filter-bar__chip--selected {
  background: var(--arcade-bg-inverse);
  color: var(--arcade-text-inverse);
  border-color: transparent;
}

.arcade-filter-bar__chip:active {
  opacity: 0.7;
}
</style>
