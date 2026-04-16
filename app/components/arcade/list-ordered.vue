<script setup lang="ts">
defineOptions({ name: 'ArcadeListOrdered' })

interface ListOrderedItem {
  label: string
  body?: string
}

interface ArcadeListOrderedProps {
  items?: ListOrderedItem[]
  type?: 'standard' | 'subtle'
}

withDefaults(defineProps<ArcadeListOrderedProps>(), {
  items: () => [],
  type: 'standard'
})
</script>

<template>
  <div class="arcade-list-ordered">
    <div v-for="(item, i) in items" :key="i" class="arcade-list-ordered__row">
      <span
        class="arcade-list-ordered__indicator"
        :class="`arcade-list-ordered__indicator--${type}`"
      >
        <span class="arcade-list-ordered__digit">{{ i + 1 }}</span>
      </span>
      <div class="arcade-list-ordered__text">
        <p
          class="arcade-list-ordered__label"
          :class="{ 'arcade-list-ordered__label--emphasized': item.body }"
        >{{ item.label }}</p>
        <p v-if="item.body" class="arcade-list-ordered__body">{{ item.body }}</p>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.arcade-list-ordered {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
}

.arcade-list-ordered__row {
  display: flex;
  align-items: flex-start;
  gap: 0.25em;
}

.arcade-list-ordered__indicator {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arcade-list-ordered__indicator--standard {
  border-radius: var(--arcade-radius-pill);
  background: var(--arcade-icon-standard);
}

.arcade-list-ordered__digit {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.4375em;
  line-height: 1;
  letter-spacing: 0.00109rem;
  text-align: center;
}

.arcade-list-ordered__indicator--standard .arcade-list-ordered__digit {
  color: var(--arcade-text-inverse);
}

.arcade-list-ordered__indicator--subtle .arcade-list-ordered__digit {
  color: var(--arcade-text-standard);
}

.arcade-list-ordered__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.arcade-list-ordered__label {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-list-ordered__label--emphasized {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  letter-spacing: 0;
}

.arcade-list-ordered__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.0025rem;
  margin: 0;
  color: var(--arcade-text-subtle);
}
</style>
