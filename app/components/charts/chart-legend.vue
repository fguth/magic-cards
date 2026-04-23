<script setup lang="ts">
defineOptions({ name: 'ChartLegend' })

interface ChartLegendItem {
  label: string
  color: string
}

interface ChartLegendProps {
  items: ChartLegendItem[]
}

defineProps<ChartLegendProps>()
</script>

<template>
  <div class="chart-legend">
    <span v-for="item in items" :key="item.label" class="chart-legend__item">
      <span class="chart-legend__swatch" :style="{ background: item.color }" />
      <span class="chart-legend__label">{{ item.label }}</span>
    </span>
  </div>
</template>

<style scoped>
.chart-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--arcade-font-regular);
  font-size: 0.375rem;
  line-height: 1;
  color: #111111;
}

.chart-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.chart-legend__swatch {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.chart-legend__label {
  white-space: nowrap;
}
</style>
