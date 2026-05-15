<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, Scale } from 'chart.js'

defineOptions({ name: 'ChartDivergingBar' })

type DivergingLabel = string | string[]

interface DivergingDatum {
  label: DivergingLabel
  inflow: number
  outflow: number
  inflowLabel?: string
  outflowLabel?: string
}

interface PositionedBarValue {
  x: number
  y: number
}

interface ChartDivergingBarProps {
  items: DivergingDatum[]
  valuePrefix?: string
  inflowColor?: string
  outflowColor?: string
}

const props = withDefaults(defineProps<ChartDivergingBarProps>(), {
  valuePrefix: '$',
})

useChartDefaults()

const inflowColor = computed(() => props.inflowColor ?? chartPalette.yellow)
const outflowColor = computed(() => props.outflowColor ?? chartPalette.negative)

const axisLabelFontSize = 9
const maxHorizontalDataPoints = 30
const minDottedGuides = 4
const maxDottedGuides = 10
const totalDottedGuides = Math.min(maxDottedGuides, Math.max(minDottedGuides, 8))
const guideLinesPerDirection = totalDottedGuides / 2

const chartItems = computed(() => {
  const items = props.items.slice(0, maxHorizontalDataPoints)
  return items.length > 0
    ? items
    : [{ label: '', inflow: 0, outflow: 0, inflowLabel: '0', outflowLabel: '0' }]
})

const magnitude = computed(() => {
  const maxIn = Math.max(...chartItems.value.map((item) => item.inflow), 0)
  const maxOut = Math.max(...chartItems.value.map((item) => Math.abs(item.outflow)), 0)
  return Math.max(maxIn, maxOut)
})

const yAxisBound = computed(() => {
  const max = magnitude.value
  if (max <= 0) return guideLinesPerDirection
  const dataGuideIntervals = Math.max(guideLinesPerDirection - 1, 1)
  return (max / dataGuideIntervals) * guideLinesPerDirection
})

const yAxisStep = computed(() => yAxisBound.value / guideLinesPerDirection)

function fixedBarWidth(count: number) {
  if (count <= 4) return 48
  if (count <= 8) return 32
  if (count <= 12) return 24
  if (count <= 16) return 16
  return 8
}

const barThickness = computed(() => fixedBarWidth(chartItems.value.length))
const usesCenteredCluster = computed(() => shouldUseCenteredBarCluster(chartItems.value.length))
const centeredClusterPositions = computed(() =>
  getCenteredBarClusterPositions(chartItems.value.length, barThickness.value),
)
const plotPadding = computed(() => ({
  left: remToPx(1) + (usesCenteredCluster.value ? 0 : barThickness.value / 2),
  right: remToPx(0.25) + (usesCenteredCluster.value ? 0 : barThickness.value / 2),
}))
const axisLabelSectionHeight = computed(() => remToPx(0.5))
const axisLabelBaselineGap = 5
const valueLabelGap = 6

function remToPx(value: number) {
  if (typeof window === 'undefined') return value * 16

  const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return value * (Number.isFinite(rootSize) ? rootSize : 16)
}

function clampLabelX(ctx: CanvasRenderingContext2D, text: string, x: number, chartArea: { left: number; right: number }) {
  const halfWidth = ctx.measureText(text).width / 2
  return Math.min(Math.max(x, chartArea.left + halfWidth), chartArea.right - halfWidth)
}

function centeredClusterIndexForTick(value: string | number) {
  const numericValue = Number(value)
  return centeredClusterPositions.value.findIndex((position) => Math.abs(position - numericValue) < 0.001)
}

function positionedValue(value: number, index: number): number | PositionedBarValue {
  if (!usesCenteredCluster.value) return value

  return {
    x: centeredClusterPositions.value[index] ?? 0,
    y: value,
  }
}

const data = computed<ChartData<'bar'>>(() => {
  return {
    labels: chartItems.value.map((item) => item.label),
    datasets: [
      {
        label: 'In',
        data: chartItems.value.map((item, index) => positionedValue(item.inflow, index)),
        backgroundColor: inflowColor.value,
        borderWidth: 0,
        borderRadius: chartRadius,
        borderSkipped: 'bottom',
        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        clip: false,
        stack: 'flow',
      },
      {
        label: 'Out',
        data: chartItems.value.map((item, index) => positionedValue(item.outflow > 0 ? -Math.abs(item.outflow) : 0, index)),
        backgroundColor: outflowColor.value,
        borderWidth: 0,
        borderRadius: chartRadius,
        borderSkipped: 'bottom',
        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        clip: false,
        stack: 'flow',
      },
    ],
  }
})

const valueLabelsPlugin: Plugin<'bar'> = {
  id: 'diverging-value-labels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y
    if (!chartArea || !yScale) return
    const labelBounds = { left: 0, right: chart.width }

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'

    const inflowMeta = chart.getDatasetMeta(0)
    const outflowMeta = chart.getDatasetMeta(1)

    inflowMeta?.data?.forEach((bar, index) => {
      const datum = chartItems.value[index]
      if (!datum || (datum.inflow <= 0 && !datum.inflowLabel)) return
      const { x, y, base } = (bar as unknown as {
        getProps: (keys: string[], final?: boolean) => Record<string, number>
      }).getProps(['x', 'y', 'base'], true)
      if (typeof x !== 'number' || typeof y !== 'number' || typeof base !== 'number') return
      const label = datum.inflowLabel ?? formatCompactCurrency(datum.inflow, props.valuePrefix)
      const baseline = yScale.getPixelForValue(0)
      const barTop = datum.inflow > 0 ? Math.min(y, base) : baseline
      ctx.textBaseline = 'bottom'
      ctx.fillText(
        label,
        clampLabelX(ctx, label, x, labelBounds),
        Math.max(barTop - valueLabelGap, chartArea.top + chartTypography.fontSize),
      )
    })

    outflowMeta?.data?.forEach((bar, index) => {
      const datum = chartItems.value[index]
      if (!datum || (datum.outflow <= 0 && !datum.outflowLabel)) return
      const withProps = (bar as unknown as {
        getProps: (keys: string[], final?: boolean) => Record<string, number>
      }).getProps(['x', 'y', 'base'], true)
      const { x, y, base } = withProps
      if (typeof x !== 'number' || typeof y !== 'number' || typeof base !== 'number') return
      const label = datum.outflowLabel ?? `-${formatCompactCurrency(datum.outflow, props.valuePrefix)}`
      const baseline = yScale.getPixelForValue(0)
      const barBottom = datum.outflow > 0 ? Math.max(y, base) : baseline
      ctx.textBaseline = 'top'
      ctx.fillText(
        label,
        clampLabelX(ctx, label, x, labelBounds),
        Math.min(barBottom + valueLabelGap, chartArea.bottom - chartTypography.fontSize),
      )
    })

    ctx.restore()
  },
}

const dottedGrid = createDottedGridPlugin({
  xOrigin: 'canvas',
  xEndOrigin: 'canvas',
})

const floatingYAxis = createFloatingYAxisPlugin({
  xOrigin: 'canvas',
  formatter: (value) => {
    if (Number.isNaN(value)) return ''
    if (value === 0) return `${props.valuePrefix}0`
    if (value < 0) return `-${formatCompactCurrency(Math.abs(value), props.valuePrefix)}`
    return formatCompactCurrency(value, props.valuePrefix)
  },
})

const centeredCluster = createCenteredBarClusterPlugin({
  isEnabled: () => usesCenteredCluster.value,
  getBarWidth: () => barThickness.value,
  getPositions: () => centeredClusterPositions.value,
})

function fitXAxisLabelSection(axis: Scale) {
  axis.height = Math.max(axis.height, axisLabelSectionHeight.value)
}

function shouldShowBaselineLabel(index: number, total: number) {
  return shouldShowChartBaselineLabel(index, total)
}

const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  events: [],
  layout: { padding: { top: 18, right: plotPadding.value.right, bottom: 0, left: plotPadding.value.left } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: usesCenteredCluster.value ? {
      type: 'linear',
      display: true,
      stacked: true,
      min: -1,
      max: 1,
      offset: false,
      afterBuildTicks(axis: Scale) {
        ;(axis as Scale & { ticks: Array<{ value: number }> }).ticks = centeredClusterPositions.value.map((value) => ({ value }))
      },
      afterFit: fitXAxisLabelSection,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: {
        display: true,
        align: 'center',
        color: chartTypography.labelColor,
        font: { family: chartTypography.fontFamily, size: axisLabelFontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(value) {
          const index = centeredClusterIndexForTick(value)
          if (index < 0) return ''
          if (!shouldShowBaselineLabel(index, chartItems.value.length)) return ''
          return chartItems.value[index]?.label ?? ''
        },
      },
    } : {
      display: true,
      stacked: true,
      offset: false,
      afterFit: fitXAxisLabelSection,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: {
        display: true,
        align: 'center',
        color: chartTypography.labelColor,
        font: { family: chartTypography.fontFamily, size: axisLabelFontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(_, index) {
          const total = chartItems.value.length
          if (!shouldShowBaselineLabel(index, total)) return ''
          return chartItems.value[index]?.label ?? ''
        },
      },
    },
    y: {
      stacked: true,
      min: -yAxisBound.value,
      max: yAxisBound.value,
      display: false,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: { display: false, stepSize: yAxisStep.value },
    },
  },
}))

</script>

<template>
  <div class="chart-diverging">
    <div class="chart-diverging__canvas">
      <ClientOnly>
        <Bar :data="data" :options="options" :plugins="[centeredCluster, dottedGrid, floatingYAxis, valueLabelsPlugin]" />
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
  pointer-events: none;
}
</style>
