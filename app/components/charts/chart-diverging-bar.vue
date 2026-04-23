<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, ScriptableContext } from 'chart.js'

defineOptions({ name: 'ChartDivergingBar' })

interface DivergingDatum {
  label: string
  inflow: number
  outflow: number
}

interface ChartDivergingBarProps {
  items: DivergingDatum[]
  valuePrefix?: string
}

const props = withDefaults(defineProps<ChartDivergingBarProps>(), {
  valuePrefix: '$',
})

useChartDefaults()

const magnitude = computed(() => {
  const maxIn = Math.max(...props.items.map((item) => item.inflow), 0)
  const maxOut = Math.max(...props.items.map((item) => Math.abs(item.outflow)), 0)
  return Math.max(maxIn, maxOut)
})

const yAxisBound = computed(() => {
  const max = magnitude.value
  if (max <= 0) return 1
  const step = 5000
  return Math.ceil(max / step) * step
})

const data = computed<ChartData<'bar'>>(() => ({
  labels: props.items.map((item) => item.label),
  datasets: [
    {
      label: 'In',
      data: props.items.map((item) => item.inflow),
      backgroundColor: (context: ScriptableContext<'bar'>) =>
        createVerticalGradient(context, warmGradientStops, 'up'),
      borderWidth: 0,
      borderRadius: chartRadius,
      borderSkipped: 'bottom',
      barPercentage: 0.48,
      categoryPercentage: 0.82,
      stack: 'flow',
    },
    {
      label: 'Out',
      data: props.items.map((item) => -Math.abs(item.outflow)),
      backgroundColor: (context: ScriptableContext<'bar'>) =>
        createVerticalGradient(context, coolGradientStops, 'down'),
      borderWidth: 0,
      borderRadius: chartRadius,
      borderSkipped: 'bottom',
      barPercentage: 0.48,
      categoryPercentage: 0.82,
      stack: 'flow',
    },
  ],
}))

const valueLabelsPlugin: Plugin<'bar'> = {
  id: 'diverging-value-labels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'

    const inflowMeta = chart.getDatasetMeta(0)
    const outflowMeta = chart.getDatasetMeta(1)

    inflowMeta?.data?.forEach((bar, index) => {
      const datum = props.items[index]
      if (!datum || datum.inflow <= 0) return
      const anyBar = bar as unknown as { x: number; y: number }
      ctx.textBaseline = 'bottom'
      ctx.fillText(
        formatCompactCurrency(datum.inflow, props.valuePrefix),
        anyBar.x,
        anyBar.y - 6,
      )
    })

    outflowMeta?.data?.forEach((bar, index) => {
      const datum = props.items[index]
      if (!datum || datum.outflow <= 0) return
      const withProps = (bar as unknown as {
        getProps: (keys: string[]) => Record<string, number>
      }).getProps(['x', 'y', 'base'])
      const barBottom = Math.max(withProps.y, withProps.base)
      ctx.textBaseline = 'top'
      ctx.fillText(
        `-${formatCompactCurrency(datum.outflow, props.valuePrefix)}`,
        withProps.x,
        barBottom + 6,
      )
    })

    ctx.restore()
  },
}

const dottedGrid = createDottedGridPlugin()

const floatingYAxis = createFloatingYAxisPlugin({
  formatter: (value) => {
    if (Number.isNaN(value)) return ''
    if (value === 0) return `${props.valuePrefix}0`
    if (value < 0) return `-${formatCompactCurrency(Math.abs(value), props.valuePrefix)}`
    return formatCompactCurrency(value, props.valuePrefix)
  },
})

const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 18, right: 6, bottom: 18, left: 6 } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: {
        color: chartTypography.labelColor,
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize },
        padding: 8,
      },
    },
    y: {
      stacked: true,
      min: -yAxisBound.value,
      max: yAxisBound.value,
      display: false,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: { display: false, stepSize: 5000 },
    },
  },
}))

</script>

<template>
  <div class="chart-diverging">
    <div class="chart-diverging__canvas">
      <ClientOnly>
        <Bar :data="data" :options="options" :plugins="[dottedGrid, floatingYAxis, valueLabelsPlugin]" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.chart-diverging {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.chart-diverging__canvas {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}
</style>
