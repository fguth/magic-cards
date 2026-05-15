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
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: 0.5rem;
  font-family: var(--arcade-font-regular);
  font-size: var(--chart-outer-legend-size, 0.5rem);
  line-height: 1;
  color: #111111;
}

.chart-legend__item {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0.25rem;
}

.chart-legend__swatch {
  width: var(--chart-legend-swatch-size, 0.375rem);
  height: var(--chart-legend-swatch-size, 0.375rem);
  border-radius: 0;
  flex-shrink: 0;
}

.chart-legend__label {
  white-space: nowrap;
}
</style>
