<script setup lang="ts">
defineOptions({ name: 'ArcadeListUnordered' })

interface ListUnorderedItem {
  label: string
  value?: string
  body?: string
  icon?: string
}

interface ArcadeListUnorderedProps {
  items?: ListUnorderedItem[]
  prominence?: 'standard' | 'subtle'
  size?: 'compact' | 'large'
}

const props = withDefaults(defineProps<ArcadeListUnorderedProps>(), {
  items: () => [],
  prominence: 'standard',
  size: 'compact'
})

const icons16 = import.meta.glob('@/assets/icons/16/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string): string {
  const icons = props.size === 'large' ? icons24 : icons16
  const match = Object.entries(icons).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}
</script>

<template>
  <div
    class="arcade-list-unordered"
    :class="`arcade-list-unordered--${size}`"
  >
    <div v-for="(item, i) in items" :key="i" class="arcade-list-unordered__row">
      <div class="arcade-list-unordered__content">
        <span
          v-if="item.icon"
          class="arcade-list-unordered__icon"
          v-html="resolveIcon(item.icon)"
        />
        <div class="arcade-list-unordered__text">
          <p
            class="arcade-list-unordered__label"
            :class="`arcade-list-unordered__label--${prominence}`"
          >{{ item.label }}</p>
          <p v-if="item.body" class="arcade-list-unordered__body">{{ item.body }}</p>
        </div>
      </div>
      <p
        v-if="item.value"
        class="arcade-list-unordered__value"
        :class="`arcade-list-unordered__value--${prominence}`"
      >{{ item.value }}</p>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.arcade-list-unordered {
  display: flex;
  flex-direction: column;
  padding: 0.5em;
}

.arcade-list-unordered--compact {
  gap: 0.25em;
}

.arcade-list-unordered--large {
  gap: 0.5em;
}

.arcade-list-unordered__row {
  display: flex;
  align-items: flex-start;
  gap: 0.25em;
}

.arcade-list-unordered__content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.25em;
}

.arcade-list-unordered__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-standard);
}

.arcade-list-unordered--compact .arcade-list-unordered__icon {
  width: 0.5em;
  height: 0.5em;
  margin-top: 0.125em;
}

.arcade-list-unordered--large .arcade-list-unordered__icon {
  width: 0.75em;
  height: 0.75em;
}

.arcade-list-unordered__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-list-unordered__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.arcade-list-unordered__label {
  font-size: 0.5em;
  line-height: 1.5;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-list-unordered__label--standard {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  letter-spacing: 0;
}

.arcade-list-unordered__label--subtle {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  letter-spacing: -0.0025rem;
}

.arcade-list-unordered__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.43;
  letter-spacing: -0.00109rem;
  margin: 0;
  color: var(--arcade-text-subtle);
}

.arcade-list-unordered__value {
  font-size: 0.5em;
  line-height: 1.5;
  margin: 0;
  flex-shrink: 0;
  text-align: right;
  max-width: 33.33%;
  color: var(--arcade-text-standard);
}

.arcade-list-unordered__value--standard {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  letter-spacing: 0;
}

.arcade-list-unordered__value--subtle {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  letter-spacing: -0.0025rem;
}
</style>
