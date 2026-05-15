<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, Scale } from 'chart.js'
import ChartLine from './chart-line.vue'

defineOptions({ name: 'ChartBar' })

type ChartScaleMode = 'normal' | 'exponential'

interface PointLabel {
  index: number
  label?: string
}

interface PositionedBarValue {
  x: number
  y: number
}

interface ChartBarProps {
  labels: Array<string | number>
  values: number[]
  valuePrefix?: string
  valueLabels?: string[]
  labelEvery?: number
  color?: string
  scaleMode?: ChartScaleMode
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  valuePrefix: '$',
  valueLabels: () => [],
  labelEvery: 3,
  scaleMode: 'normal',
})

useChartDefaults()

const maxBarDataPoints = 24
const maxHorizontalDataPoints = 30
const minDottedGuides = 4
const maxDottedGuides = 10

const barColor = computed(() => props.color ?? chartPalette.positive)

const chartValues = computed(() => {
  const values = props.values.slice(0, maxHorizontalDataPoints)
  return values.length > 0 ? values : [0]
})

const chartLabels = computed(() =>
  chartValues.value.map((_, index) => String(props.labels[index] ?? '')),
)

const chartValueLabels = computed(() => props.valueLabels.slice(0, chartValues.value.length))
const shouldRenderAsLine = computed(() => chartValues.value.length > maxBarDataPoints)

const maxMagnitude = computed(() => Math.max(...chartValues.value.map((value) => Math.abs(value)), 0))

const guideLineCount = computed(() => {
  const target = maxMagnitude.value > 0
    ? Math.ceil(Math.log10(maxMagnitude.value + 1) * 2)
    : minDottedGuides
  return clampChartGuideLineCount(target, minDottedGuides, maxDottedGuides)
})

const axisDomain = computed(() =>
  createChartAxisDomain(chartValues.value, {
    scaleMode: props.scaleMode,
    guideLineCount: guideLineCount.value,
    minGuideLineCount: minDottedGuides,
    maxGuideLineCount: maxDottedGuides,
    includeZero: true,
  }),
)

const transformedValues = computed(() =>
  chartValues.value.map((value) => transformChartValue(value, axisDomain.value.scaleMode)),
)

function fixedBarWidth(count: number) {
  if (count <= 4) return 48
  if (count <= 8) return 32
  if (count <= 12) return 24
  if (count <= 16) return 16
  return 8
}

function remToPx(value: number) {
  if (typeof window === 'undefined') return value * 16

  const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return value * (Number.isFinite(rootSize) ? rootSize : 16)
}

const barThickness = computed(() => fixedBarWidth(chartValues.value.length))
const usesCenteredCluster = computed(() => shouldUseCenteredBarCluster(chartValues.value.length))
const centeredClusterPositions = computed(() =>
  getCenteredBarClusterPositions(chartValues.value.length, barThickness.value),
)
const plotPadding = computed(() => ({
  left: remToPx(1) + (usesCenteredCluster.value ? 0 : barThickness.value / 2),
  right: remToPx(0.25) + (usesCenteredCluster.value ? 0 : barThickness.value / 2),
}))
const axisLabelSectionHeight = computed(() => remToPx(0.5))
const axisLabelBaselineGap = 5
const valueLabelGap = 6

function formatAxisTickValue(value: number) {
  if (Math.abs(value) < 0.000001) return `${props.valuePrefix}0`
  if (value < 0) return `-${formatCompactCurrency(Math.abs(value), props.valuePrefix)}`
  return formatCompactCurrency(value, props.valuePrefix)
}

function clampLabelX(ctx: CanvasRenderingContext2D, text: string, x: number, chartArea: { left: number; right: number }) {
  const halfWidth = ctx.measureText(text).width / 2
  return Math.min(Math.max(x, chartArea.left + halfWidth), chartArea.right - halfWidth)
}

function minValueIndex(values: number[]) {
  return values.reduce((bestIndex, value, index) => value < values[bestIndex] ? index : bestIndex, 0)
}

function maxValueIndex(values: number[]) {
  return values.reduce((bestIndex, value, index) => value > values[bestIndex] ? index : bestIndex, 0)
}

function shouldShowBaselineLabel(index: number, total: number) {
  return shouldShowChartBaselineLabel(index, total, props.labelEvery)
}

function centeredClusterIndexForTick(value: string | number) {
  const numericValue = Number(value)
  return centeredClusterPositions.value.findIndex((position) => Math.abs(position - numericValue) < 0.001)
}

const linePointLabels = computed<PointLabel[]>(() => {
  if (!shouldRenderAsLine.value) return []

  const values = chartValues.value
  if (values.length === 0) return []

  const indices = [
    0,
    values.length - 1,
    minValueIndex(values),
    maxValueIndex(values),
  ]

  return [...new Set(indices)].map((index) => {
    const value = values[index] ?? 0
    return {
      index,
      label: chartValueLabels.value[index] ?? formatCompactCurrency(value, props.valuePrefix),
    }
  })
})

const barDataValues = computed<Array<number | PositionedBarValue>>(() => {
  if (!usesCenteredCluster.value) return transformedValues.value

  return transformedValues.value.map((value, index) => ({
    x: centeredClusterPositions.value[index] ?? 0,
    y: value,
  }))
})

const data = computed<ChartData<'bar'>>(() => {
  const color = barColor.value

  return {
    labels: chartLabels.value,
    datasets: [
      {
        data: barDataValues.value,
        backgroundColor: color,
        borderWidth: 0,
        borderRadius: chartRadius,
        borderSkipped: 'bottom',
        barThickness: barThickness.value,
        maxBarThickness: barThickness.value,
        clip: false,
      },
    ],
  }
})

const valueLabelsPlugin: Plugin<'bar'> = {
  id: 'bar-value-labels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, data: chartData } = chart
    const meta = chart.getDatasetMeta(0)
    if (!meta?.data || !chartArea) return
    const values = chartData.datasets[0]?.data as number[] | undefined
    if (!values) return
    const labelBounds = { left: 0, right: chart.width }

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'

    meta.data.forEach((bar, index) => {
      if (values[index] === undefined || values[index] === null) return
      const rawValue = chartValues.value[index]
      if (typeof rawValue !== 'number') return
      const { x, y, base } = (bar as unknown as {
        getProps: (keys: string[], final?: boolean) => Record<string, number>
      }).getProps(['x', 'y', 'base'], true)
      if (typeof x !== 'number' || typeof y !== 'number' || typeof base !== 'number') return
      const label = chartValueLabels.value[index] ?? formatCompactCurrency(rawValue, props.valuePrefix)
      const barTop = Math.min(y, base)
      const barBottom = Math.max(y, base)
      const labelX = clampLabelX(ctx, label, x, labelBounds)
      const labelY = rawValue < 0
        ? Math.min(barBottom + valueLabelGap, chartArea.bottom - chartTypography.fontSize)
        : Math.max(barTop - valueLabelGap, chartArea.top + chartTypography.fontSize)
      ctx.textBaseline = rawValue < 0 ? 'top' : 'bottom'
      ctx.fillText(label, labelX, labelY)
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
    const domain = axisDomain.value
    return formatAxisTickValue(inverseTransformChartValue(value, domain.scaleMode))
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

const options = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  events: [],
  layout: { padding: { top: 20, right: plotPadding.value.right, bottom: 0, left: plotPadding.value.left } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: usesCenteredCluster.value ? {
      type: 'linear',
      display: true,
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
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(value) {
          const index = centeredClusterIndexForTick(value)
          if (index < 0) return ''
          if (shouldShowBaselineLabel(index, chartLabels.value.length)) return chartLabels.value[index]
          return ''
        },
      },
    } : {
      display: true,
      offset: false,
      afterFit: fitXAxisLabelSection,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: {
        display: true,
        align: 'center',
        color: chartTypography.labelColor,
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(_, index) {
          const total = chartLabels.value.length
          if (total === 0) return ''
          if (shouldShowBaselineLabel(index, total)) return chartLabels.value[index]
          return ''
        },
      },
    },
    y: {
      beginAtZero: true,
      min: axisDomain.value.min,
      max: axisDomain.value.max,
      display: false,
      grid: { display: false, drawTicks: false },
      border: { display: false },
      ticks: { display: false, stepSize: axisDomain.value.stepSize },
    },
  },
}))
</script>

<template>
  <ChartLine
    v-if="shouldRenderAsLine"
    :labels="chartLabels"
    :values="chartValues"
    :value-prefix="valuePrefix"
    :point-labels="linePointLabels"
    :label-every="labelEvery"
    :guide-line-count="guideLineCount"
    :color="color"
    :scale-mode="scaleMode"
  />

  <div v-else class="chart-bar">
    <div class="chart-bar__canvas">
      <ClientOnly>
        <Bar :data="data" :options="options" :plugins="[centeredCluster, dottedGrid, floatingYAxis, valueLabelsPlugin]" />
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
  pointer-events: none;
}
</style>
