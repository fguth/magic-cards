<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

defineOptions({ name: 'ChartPie' })

interface ChartPieProps {
  labels: string[]
  values: number[]
}

const props = defineProps<ChartPieProps>()

useChartDefaults()

const sliceColors = ['#1c1c1c', '#f56a3c', '#f7a93a', '#fbcf5a', '#d9d6cf', '#efede8']

const total = computed(() => props.values.reduce((sum, value) => sum + value, 0))

const data = computed<ChartData<'doughnut'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.labels.map((_, index) => sliceColors[index % sliceColors.length]),
      borderColor: '#ffffff',
      borderWidth: 3,
      borderRadius: chartRadius,
      hoverOffset: 0,
      spacing: 0,
    },
  ],
}))

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '58%',
  layout: { padding: 6 },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
}

const items = computed(() =>
  props.labels.map((label, index) => ({
    label,
    value: props.values[index] ?? 0,
    percent: total.value > 0 ? Math.round(((props.values[index] ?? 0) / total.value) * 100) : 0,
    color: sliceColors[index % sliceColors.length],
  })),
)

function formatDollar(value: number) {
  return `$${value.toLocaleString('en-US')}`
}
</script>

<template>
  <div class="chart-pie">
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  align-items: center;
  min-width: 0;
  min-height: 0;
}

.chart-pie__canvas {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.chart-pie__legend {
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chart-pie__item {
  display: grid;
  grid-template-columns: 0.5rem minmax(0, 1fr) 1.75rem 0.875rem;
  align-items: center;
  gap: 0.375rem;
  font-family: 'CashSans Mono Regular', monospace;
  font-size: 0.375rem;
  line-height: 1.1;
  color: #111111;
}

.chart-pie__swatch {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
}

.chart-pie__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #111111;
  font-family: var(--arcade-font-regular);
}

.chart-pie__value {
  color: #111111;
  text-align: right;
}

.chart-pie__percent {
  color: #9a9a9a;
  text-align: right;
}
</style>
