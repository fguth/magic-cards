<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, ScriptableContext } from 'chart.js'

defineOptions({ name: 'ChartBar' })

interface ChartBarProps {
  labels: Array<string | number>
  values: number[]
  valuePrefix?: string
  labelEvery?: number
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  valuePrefix: '$',
  labelEvery: 3,
})

useChartDefaults()

const maxValue = computed(() => Math.max(...props.values, 0))

const yAxisMax = computed(() => {
  const max = maxValue.value
  if (max <= 0) return 1
  const step = 2000
  return Math.ceil(max / step) * step
})

const data = computed<ChartData<'bar'>>(() => ({
  labels: props.labels.map(String),
  datasets: [
    {
      data: props.values,
      backgroundColor: (context: ScriptableContext<'bar'>) =>
        createVerticalGradient(context, warmGradientStops, 'up'),
      borderWidth: 0,
      borderRadius: chartRadius,
      borderSkipped: 'bottom',
      barPercentage: 0.42,
      categoryPercentage: 0.94,
    },
  ],
}))

const valueLabelsPlugin: Plugin<'bar'> = {
  id: 'bar-value-labels',
  afterDatasetsDraw(chart) {
    const { ctx, data: chartData } = chart
    const meta = chart.getDatasetMeta(0)
    if (!meta?.data) return
    const values = chartData.datasets[0]?.data as number[] | undefined
    if (!values) return

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    meta.data.forEach((bar, index) => {
      const value = values[index]
      if (typeof value !== 'number') return
      const { x, y } = bar.tooltipPosition(false)
      ctx.fillText(formatCompactCurrency(value, props.valuePrefix), x, y - 6)
    })

    ctx.restore()
  },
}

const dottedGrid = createDottedGridPlugin()

const floatingYAxis = createFloatingYAxisPlugin({
  formatter: (value) => {
    if (Number.isNaN(value)) return ''
    if (value === 0) return `${props.valuePrefix}0`
    return formatCompactCurrency(value, props.valuePrefix)
  },
})

const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 20, right: 6, bottom: 12, left: 6 } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: {
        color: chartTypography.labelColor,
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: 6,
        callback(_, index) {
          const total = props.labels.length
          if (total === 0) return ''
          if (index % props.labelEvery === 0) return String(props.labels[index])
          return ''
        },
      },
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: yAxisMax.value,
      display: false,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: { display: false, stepSize: 2000 },
    },
  },
}))
</script>

<template>
  <div class="chart-bar">
    <div class="chart-bar__canvas">
      <ClientOnly>
        <Bar :data="data" :options="options" :plugins="[dottedGrid, floatingYAxis, valueLabelsPlugin]" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.chart-bar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.chart-bar__canvas {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
</style>
