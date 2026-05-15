<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

defineOptions({ name: 'ChartPie' })

interface ChartPieProps {
  labels: string[]
  values: number[]
  valueLocale?: string
  valuePrefix?: string
  colors?: string[]
  layout?: 'split' | 'bottom-left'
  sliceSpacing?: number
}

const props = withDefaults(defineProps<ChartPieProps>(), {
  valueLocale: 'en-US',
  valuePrefix: '$',
  layout: 'split',
  sliceSpacing: 0,
})

useChartDefaults()

const defaultSliceColors = chartPalette.categorical
const sliceColors = computed<readonly string[]>(() => props.colors?.length ? props.colors : defaultSliceColors)

const total = computed(() => props.values.reduce((sum, value) => sum + value, 0))

function getSliceColor(index: number) {
  return sliceColors.value[index % sliceColors.value.length] ?? chartPalette.accent
}

const data = computed<ChartData<'doughnut'>>(() => {
  const colors = sliceColors.value

  return {
    labels: props.labels,
    datasets: [
      {
        data: props.values,
        backgroundColor: props.values.map((_, index) => colors[index % colors.length] ?? chartPalette.accent),
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: chartRadius,
        hoverOffset: 0,
        spacing: props.sliceSpacing,
      },
    ],
  }
})

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  events: [],
  cutout: '52%',
  layout: { padding: 0 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

const items = computed(() =>
  props.labels
    .map((label, index) => {
      const value = props.values[index] ?? 0

      return {
        label,
        value,
        percent: total.value > 0 ? Math.round((value / total.value) * 100) : 0,
        color: getSliceColor(index),
      }
    })
    .sort((a, b) => b.value - a.value),
)

function formatDollar(value: number) {
  return `${props.valuePrefix}${value.toLocaleString(props.valueLocale)}`
}
</script>

<template>
  <div class="chart-pie" :class="`chart-pie--${props.layout}`">
    <div class="chart-pie__canvas">
      <ClientOnly>
        <Doughnut :data="data" :options="options" />
      </ClientOnly>
    </div>
    <ul class="chart-pie__legend">
      <li v-for="item in items" :key="item.label" class="chart-pie__item">
        <span class="chart-pie__swatch" :style="{ background: item.color }" />
        <span class="chart-pie__label">{{ item.label }}</span>
        <span class="chart-pie__value">{{ formatDollar(item.value) }}</span>
        <span class="chart-pie__percent">{{ item.percent }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chart-pie {
  --chart-pie-gap: 0.5rem;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--chart-pie-gap);
  width: 100%;
  height: 100%;
  align-items: center;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 0;
}

.chart-pie__canvas {
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  justify-self: stretch;
  min-height: 0;
  margin: 0;
  padding: 0;
  line-height: 0;
  overflow: hidden;
  pointer-events: none;
}

.chart-pie__canvas :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.chart-pie__legend {
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
  width: 100%;
  min-width: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chart-pie__item {
  display: grid;
  grid-template-columns: var(--chart-legend-swatch-size, 0.375rem) minmax(0, 1fr) max-content max-content;
  align-items: center;
  column-gap: 0.1875rem;
  font-family: var(--arcade-font-regular);
  font-size: var(--chart-outer-legend-size, 0.5rem);
  line-height: 1.1;
  color: #111111;
}

.chart-pie__swatch {
  width: var(--chart-legend-swatch-size, 0.375rem);
  height: var(--chart-legend-swatch-size, 0.375rem);
  border-radius: 0;
}

.chart-pie__label {
  color: #111111;
  overflow-wrap: anywhere;
}

.chart-pie__value {
  color: #111111;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.chart-pie__percent {
  color: #9a9a9a;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.chart-pie--split .chart-pie__item {
  grid-template-columns: var(--chart-legend-swatch-size, 0.375rem) minmax(0, 1fr) 2.875rem 1.25rem;
}

.chart-pie--bottom-left {
  --chart-pie-gap: 0.375rem;

  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
  row-gap: var(--chart-pie-gap);
  align-items: stretch;
}

.chart-pie--bottom-left .chart-pie__canvas {
  width: min(10.5rem, 78%);
  align-self: center;
  justify-self: center;
}

.chart-pie--bottom-left .chart-pie__legend {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.375rem;
  width: 100%;
  align-self: end;
  justify-self: start;
}

.chart-pie--bottom-left .chart-pie__item {
  grid-template-columns: max-content max-content;
  grid-template-areas:
    "swatch ."
    "label label"
    "value percent";
  align-items: start;
  column-gap: 0.1875rem;
  row-gap: 0.03125rem;
}

.chart-pie--bottom-left .chart-pie__swatch {
  grid-area: swatch;
  margin: 0.0625rem 0 0.15625rem;
}

.chart-pie--bottom-left .chart-pie__label {
  grid-area: label;
}

.chart-pie--bottom-left .chart-pie__value {
  grid-area: value;
  text-align: left;
}

.chart-pie--bottom-left .chart-pie__percent {
  grid-area: percent;
  text-align: left;
}
</style>
