<script setup lang="ts">
defineOptions({ name: 'ArcadeSegmentedControl' })

interface SegmentItem {
  id: string
  label: string
}

interface ArcadeSegmentedControlProps {
  segments: SegmentItem[]
  modelValue?: string
}

const props = withDefaults(defineProps<ArcadeSegmentedControlProps>(), {
  modelValue: undefined
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { isDark } = useArcadeTheme()

const activeId = computed(() => props.modelValue ?? props.segments[0]?.id)
</script>

<template>
  <div
    class="arcade-segmented"
    :class="{ 'arcade-segmented--dark': isDark }"
  >
    <button
      v-for="segment in segments"
      :key="segment.id"
      class="arcade-segmented__segment"
      :class="{ 'arcade-segmented__segment--active': activeId === segment.id }"
      @click="emit('update:modelValue', segment.id)"
    >
      <span class="arcade-segmented__label">{{ segment.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.arcade-segmented {
  display: flex;
  align-items: stretch;
  height: 1.1875em;
  border-radius: var(--arcade-radius-pill);
  background: var(--arcade-bg-subtle);
  padding: 0.09375em;
}

.arcade-segmented__segment {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: calc(var(--arcade-radius-pill) - 0.09375rem);
  cursor: pointer;
  padding: 0 0.5em;
  transition: background-color var(--arcade-duration-normal) var(--arcade-ease-default),
              box-shadow var(--arcade-duration-normal) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  color: var(--arcade-text-standard);
}

.arcade-segmented__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1;
  letter-spacing: 0.00109rem;
}

.arcade-segmented__segment--active {
  background: var(--arcade-bg-app);
  box-shadow: 0 0.03125rem 0.09375rem rgba(0, 0, 0, 0.08);
}

.arcade-segmented--dark .arcade-segmented__segment--active {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0.03125rem 0.09375rem rgba(0, 0, 0, 0.2);
}

.arcade-segmented__segment:active:not(.arcade-segmented__segment--active) {
  opacity: 0.6;
}
</style>
