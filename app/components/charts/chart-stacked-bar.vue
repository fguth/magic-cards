<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import type { Chart, ChartData, ChartOptions, Plugin, Scale } from 'chart.js'

defineOptions({ name: 'ChartStackedBar' })

type StackedBarLabel = string | string[] | number
type StackedBarDirection = 'positive' | 'negative'

interface StackedBarCategory {
  key: string
  label: string
  color?: string
  direction?: StackedBarDirection
}

interface StackedBarItem {
  label: StackedBarLabel
  values: Record<string, number>
  positiveLabel?: string
  negativeLabel?: string
}

interface PositionedBarValue {
  x: number
  y: number
}

interface StackTotals {
  positive: number
  negative: number
}

interface ChartStackedBarProps {
  categories: StackedBarCategory[]
  items: StackedBarItem[]
  valuePrefix?: string
  labelEvery?: number
  showSectionValueLabels?: boolean
}

const props = withDefaults(defineProps<ChartStackedBarProps>(), {
  valuePrefix: '$',
  labelEvery: 1,
  showSectionValueLabels: false,
})

useChartDefaults()

const maxStackCategories = 6
const maxBarDataPoints = 24
const maxSectionValueLabelBars = 4
const minDottedGuides = 4
const maxDottedGuides = 10
const valueLabelGap = 6
const sectionValueLabelGap = 4
const axisLabelBaselineGap = 5

const fallbackCategory: StackedBarCategory = {
  key: 'value',
  label: 'Valor',
  color: chartPalette.positive,
  direction: 'positive',
}

const chartCategories = computed(() => {
  const categories = props.categories.slice(0, maxStackCategories)
  const safeCategories = categories.length > 0 ? categories : [fallbackCategory]

  return safeCategories.map((category, index) => ({
    ...category,
    color: category.color ?? chartPalette.categorical[index % chartPalette.categorical.length],
    direction: category.direction ?? 'positive',
  }))
})

const chartItems = computed(() => {
  const items = props.items.slice(0, maxBarDataPoints)
  return items.length > 0 ? items : [{ label: '', values: { value: 0 } }]
})

const chartLabels = computed(() => chartItems.value.map((item) => item.label))
const hasNegativeCategories = computed(() =>
  chartCategories.value.some((category) => category.direction === 'negative'),
)
const canShowSectionValueLabels = computed(() =>
  props.showSectionValueLabels && chartItems.value.length <= maxSectionValueLabelBars,
)

function remToPx(value: number) {
  if (typeof window === 'undefined') return value * 16

  const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return value * (Number.isFinite(rootSize) ? rootSize : 16)
}

function fixedBarWidth(count: number) {
  if (count <= 4) return 48
  if (count <= 8) return 32
  if (count <= 12) return 24
  if (count <= 16) return 16
  return 8
}

function categoryValue(item: StackedBarItem, category: StackedBarCategory) {
  const rawValue = item.values[category.key] ?? 0
  return Number.isFinite(rawValue) ? Math.abs(rawValue) : 0
}

const stackTotals = computed<StackTotals[]>(() =>
  chartItems.value.map((item) => {
    return chartCategories.value.reduce<StackTotals>(
      (totals, category) => {
        const value = categoryValue(item, category)
        if (category.direction === 'negative') {
          totals.negative += value
        } else {
          totals.positive += value
        }
        return totals
      },
      { positive: 0, negative: 0 },
    )
  }),
)

const axisValues = computed(() =>
  stackTotals.value.flatMap((totals) => [totals.positive, -totals.negative]),
)

const maxMagnitude = computed(() =>
  Math.max(...stackTotals.value.map((totals) => Math.max(totals.positive, totals.negative)), 0),
)

const guideLineCount = computed(() => {
  const target = maxMagnitude.value > 0
    ? Math.ceil(Math.log10(maxMagnitude.value + 1) * 2)
    : minDottedGuides
  return clampChartGuideLineCount(target, minDottedGuides, maxDottedGuides)
})

const axisDomain = computed(() =>
  createChartAxisDomain(axisValues.value, {
    guideLineCount: guideLineCount.value,
    minGuideLineCount: minDottedGuides,
    maxGuideLineCount: maxDottedGuides,
    includeZero: true,
  }),
)

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

function formatAxisTickValue(value: number) {
  if (Math.abs(value) < 0.000001) return `${props.valuePrefix}0`
  if (value < 0) return `-${formatCompactCurrency(Math.abs(value), props.valuePrefix)}`
  return formatCompactCurrency(value, props.valuePrefix)
}

function clampLabelX(ctx: CanvasRenderingContext2D, text: string, x: number, chartArea: { left: number; right: number }) {
  const halfWidth = ctx.measureText(text).width / 2
  return Math.min(Math.max(x, chartArea.left + halfWidth), chartArea.right - halfWidth)
}

function shouldShowBaselineLabel(index: number, total: number) {
  return shouldShowChartBaselineLabel(index, total, props.labelEvery)
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

function formatSectionValueLabel(value: number, direction: StackedBarDirection) {
  const label = formatCompactCurrency(value, props.valuePrefix)
  return direction === 'negative' ? `-${label}` : label
}

function drawSectionValueLabels(chart: Chart<'bar'>) {
  const { ctx, chartArea } = chart
  if (!chartArea) return

  ctx.save()
  ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
  ctx.fillStyle = chartTypography.valueColor
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  chart.getSortedVisibleDatasetMetas().forEach((meta) => {
    const category = chartCategories.value[meta.index]
    if (!category) return

    meta.data.forEach((element, index) => {
      const item = chartItems.value[index]
      if (!item) return

      const value = categoryValue(item, category)
      if (value <= 0) return

      const elementProps = (element as unknown as {
        getProps?: (keys: string[], final?: boolean) => Record<string, number>
      }).getProps?.(['x', 'y', 'base', 'width'], true)
      if (!elementProps) return

      const label = formatSectionValueLabel(value, category.direction)
      const textWidth = ctx.measureText(label).width
      const halfWidth = (elementProps.width ?? barThickness.value) / 2
      const x = elementProps.x + halfWidth + sectionValueLabelGap
      const y = (elementProps.y + elementProps.base) / 2
      const clampedX = Math.min(Math.max(x, 0), chart.width - textWidth - 1)
      const clampedY = Math.min(
        Math.max(y, chartArea.top + chartTypography.fontSize / 2),
        chartArea.bottom - chartTypography.fontSize / 2,
      )

      ctx.fillText(label, clampedX, clampedY)
    })
  })

  ctx.restore()
}

const data = computed<ChartData<'bar'>>(() => ({
  labels: chartLabels.value,
  datasets: chartCategories.value.map((category) => ({
    label: category.label,
    data: chartItems.value.map((item, index) => {
      const value = categoryValue(item, category)
      return positionedValue(category.direction === 'negative' ? -value : value, index)
    }),
    backgroundColor: category.color,
    borderWidth: 0,
    borderRadius: chartRadius,
    borderSkipped: false,
    barThickness: barThickness.value,
    maxBarThickness: barThickness.value,
    clip: false,
    stack: 'total',
  })),
}))

const valueLabelsPlugin: Plugin<'bar'> = {
  id: 'stacked-bar-value-labels',
  afterDatasetsDraw(chart) {
    if (canShowSectionValueLabels.value) {
      drawSectionValueLabels(chart)
      return
    }

    const { ctx, chartArea, scales } = chart
    const yScale = scales.y
    if (!chartArea || !yScale) return
    const labelBounds = { left: 0, right: chart.width }

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'

    const getBarX = (index: number) => {
      const metas = chart.getSortedVisibleDatasetMetas()
      for (const meta of metas) {
        const bar = meta.data[index] as unknown as {
          getProps?: (keys: string[], final?: boolean) => Record<string, number>
        } | undefined
        const props = bar?.getProps?.(['x'], true)
        if (typeof props?.x === 'number') return props.x
      }
      return undefined
    }

    stackTotals.value.forEach((totals, index) => {
      const item = chartItems.value[index]
      const x = getBarX(index)
      if (!item || typeof x !== 'number') return

      const shouldDrawPositive =
        totals.positive > 0
        || Boolean(item.positiveLabel)
        || (!hasNegativeCategories.value && totals.negative <= 0)
      const shouldDrawNegative = totals.negative > 0 || Boolean(item.negativeLabel)

      if (shouldDrawPositive) {
        const label = item.positiveLabel ?? formatCompactCurrency(totals.positive, props.valuePrefix)
        const y = yScale.getPixelForValue(totals.positive)
        ctx.textBaseline = 'bottom'
        ctx.fillText(
          label,
          clampLabelX(ctx, label, x, labelBounds),
          Math.max(y - valueLabelGap, chartArea.top + chartTypography.fontSize),
        )
      }

      if (shouldDrawNegative) {
        const label = item.negativeLabel ?? `-${formatCompactCurrency(totals.negative, props.valuePrefix)}`
        const y = yScale.getPixelForValue(-totals.negative)
        ctx.textBaseline = 'top'
        ctx.fillText(
          label,
          clampLabelX(ctx, label, x, labelBounds),
          Math.min(y + valueLabelGap, chartArea.bottom - chartTypography.fontSize),
        )
      }
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
    return formatAxisTickValue(value)
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
  layout: { padding: { top: 22, right: plotPadding.value.right, bottom: 0, left: plotPadding.value.left } },
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
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(value) {
          const index = centeredClusterIndexForTick(value)
          if (index < 0) return ''
          const total = chartLabels.value.length
          if (shouldShowBaselineLabel(index, total)) return chartLabels.value[index]
          return ''
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
        font: { family: chartTypography.fontFamily, size: chartTypography.fontSize, lineHeight: 1 },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
        padding: axisLabelBaselineGap,
        callback(_, index) {
          const total = chartLabels.value.length
          if (shouldShowBaselineLabel(index, total)) return chartLabels.value[index]
          return ''
        },
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
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
  <div class="chart-stacked-bar">
    <div class="chart-stacked-bar__canvas">
      <ClientOnly>
        <Bar :data="data" :options="options" :plugins="[centeredCluster, dottedGrid, floatingYAxis, valueLabelsPlugin]" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.chart-stacked-bar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.chart-stacked-bar__canvas {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  pointer-events: none;
}
</style>
