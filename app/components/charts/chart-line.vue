<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, Scale } from 'chart.js'

defineOptions({ name: 'ChartLine' })

type PointLabelPosition =
  | 'left'
  | 'left-top'
  | 'top'
  | 'right-top'
  | 'right'
  | 'right-bottom'
  | 'bottom'
  | 'left-bottom'

type ChartScaleMode = 'normal' | 'exponential'

interface PointLabel {
  index: number
  label?: string
  position?: PointLabelPosition
}

interface ChartPoint {
  x: number
  y: number
  cp1x?: number
  cp1y?: number
  cp2x?: number
  cp2y?: number
}

interface LabelBox {
  left: number
  right: number
  top: number
  bottom: number
}

interface ChartLineProps {
  labels: Array<string | number>
  values: number[]
  valuePrefix?: string
  pointLabels?: PointLabel[]
  labelEvery?: number
  guideLineCount?: number
  scaleMode?: ChartScaleMode
  color?: string
}

const props = withDefaults(defineProps<ChartLineProps>(), {
  valuePrefix: '$',
  pointLabels: () => [],
  labelEvery: 7,
  guideLineCount: 8,
  scaleMode: 'normal',
})

useChartDefaults()

const maxHorizontalDataPoints = 30
const everyOtherLabelMinPoints = 16
const everyThirdLabelMinPoints = 25
const minDottedGuides = 4
const maxDottedGuides = 10

const lineColor = computed(() => props.color ?? chartPalette.positive)

const chartValues = computed(() => props.values.slice(0, maxHorizontalDataPoints))
const chartLabels = computed(() =>
  chartValues.value.map((_, index) => String(props.labels[index] ?? '')),
)

function remToPx(value: number) {
  if (typeof window === 'undefined') return value * 16

  const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  return value * (Number.isFinite(rootSize) ? rootSize : 16)
}

const guideLineCount = computed(() =>
  clampChartGuideLineCount(props.guideLineCount, minDottedGuides, maxDottedGuides),
)
const axisDomain = computed(() =>
  createChartAxisDomain(chartValues.value, {
    scaleMode: props.scaleMode,
    guideLineCount: guideLineCount.value,
    minGuideLineCount: minDottedGuides,
    maxGuideLineCount: maxDottedGuides,
    includeZero: true,
  }),
)
const plotPadding = computed(() => ({
  left: remToPx(1),
  right: remToPx(0.25),
}))
const axisLabelSectionHeight = computed(() => remToPx(0.5))
const axisLabelBaselineGap = 5

const transformedValues = computed(() =>
  chartValues.value.map((value) => transformChartValue(value, axisDomain.value.scaleMode)),
)

function formatAxisTickValue(value: number) {
  if (Math.abs(value) < 0.000001) return `${props.valuePrefix}0`
  if (value < 0) return `-${formatCompactCurrency(Math.abs(value), props.valuePrefix)}`
  return formatCompactCurrency(value, props.valuePrefix)
}

const guideRows = computed(() => {
  const domain = axisDomain.value
  if (domain.stepSize <= 0) return []

  const tickCount = Math.round((domain.max - domain.min) / domain.stepSize)
  return Array.from({ length: tickCount + 1 }, (_, index) => {
    const rawValue = domain.min + domain.stepSize * index
    const transformedValue = Math.abs(rawValue) < 0.000001 ? 0 : rawValue
    return {
      transformedValue,
      label: formatAxisTickValue(inverseTransformChartValue(transformedValue, domain.scaleMode)),
    }
  }).filter((row) => row.transformedValue !== 0)
})

const lastIndex = computed(() => chartValues.value.length - 1)

const labelPositions: Array<{ position: PointLabelPosition; x: number; y: number }> = [
  { position: 'left', x: -1, y: 0 },
  { position: 'left-top', x: -1, y: -1 },
  { position: 'top', x: 0, y: -1 },
  { position: 'right-top', x: 1, y: -1 },
  { position: 'right', x: 1, y: 0 },
  { position: 'right-bottom', x: 1, y: 1 },
  { position: 'bottom', x: 0, y: 1 },
  { position: 'left-bottom', x: -1, y: 1 },
]

function shouldShowBaselineLabel(index: number, total: number) {
  return shouldShowChartBaselineLabel(index, total, props.labelEvery)
}

function shouldShowPointValueLabel(index: number, total: number) {
  if (total === 0) return false
  if (total < everyOtherLabelMinPoints) return true

  const last = total - 1
  if (index === 0 || index === last) return true
  const labelStep = total >= everyThirdLabelMinPoints ? 3 : 2
  return index % labelStep === 0
}

const data = computed<ChartData<'line'>>(() => {
  const color = lineColor.value

  return {
    labels: chartLabels.value,
    datasets: [
      {
        data: transformedValues.value,
        borderColor: color,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        pointRadius: 3.25,
        pointHoverRadius: 0,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.75,
        tension: 0.4,
        fill: false,
        cubicInterpolationMode: 'monotone',
        spanGaps: true,
      },
    ],
  }
})

const pointLabelsPlugin: Plugin<'line'> = {
  id: 'line-point-labels',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart
    const meta = chart.getDatasetMeta(0)
    const scale = scales.y
    if (!meta?.data || !chartArea || !scale) return

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    const labelMap = new Map<number, PointLabel>()
    props.pointLabels.forEach((item) => {
      if (item.index >= 0 && item.index < chartValues.value.length) labelMap.set(item.index, item)
    })

    const pointIndices = chartValues.value.map((_, index) => index)
    const labelIndices = pointIndices.filter((index) =>
      shouldShowPointValueLabel(index, chartValues.value.length),
    )
    const drawnBoxes: LabelBox[] = []

    const addReservedLabelBox = (text: string, x: number, y: number) => {
      const width = ctx.measureText(text).width
      drawnBoxes.push({
        left: x - 3,
        right: x + width + 3,
        top: y - 3,
        bottom: y + chartTypography.fontSize + 3,
      })
    }

    const guideLabelX = 0
    guideRows.value.forEach((row) => {
      addReservedLabelBox(row.label, guideLabelX, scale.getPixelForValue(row.transformedValue) - 5)
    })
    addReservedLabelBox(`${props.valuePrefix}0`, guideLabelX, scale.getPixelForValue(0) - 5)

    const getPoint = (pointIndex: number): ChartPoint | undefined => {
      const point = meta.data[pointIndex] as unknown as {
        getProps?: (keys: string[], final?: boolean) => Record<string, number>
        x: number
        y: number
      } | undefined
      if (!point) return undefined
      const props = point.getProps?.(['x', 'y', 'cp1x', 'cp1y', 'cp2x', 'cp2y'], true) ?? point
      if (typeof props.x !== 'number' || typeof props.y !== 'number') return undefined
      return {
        x: props.x,
        y: props.y,
        cp1x: props.cp1x,
        cp1y: props.cp1y,
        cp2x: props.cp2x,
        cp2y: props.cp2y,
      }
    }

    const cubicPoint = (start: ChartPoint, end: ChartPoint, t: number): ChartPoint => {
      const cp1 = {
        x: Number.isFinite(start.cp2x) ? start.cp2x as number : start.x,
        y: Number.isFinite(start.cp2y) ? start.cp2y as number : start.y,
      }
      const cp2 = {
        x: Number.isFinite(end.cp1x) ? end.cp1x as number : end.x,
        y: Number.isFinite(end.cp1y) ? end.cp1y as number : end.y,
      }
      const oneMinusT = 1 - t
      return {
        x: oneMinusT ** 3 * start.x
          + 3 * oneMinusT ** 2 * t * cp1.x
          + 3 * oneMinusT * t ** 2 * cp2.x
          + t ** 3 * end.x,
        y: oneMinusT ** 3 * start.y
          + 3 * oneMinusT ** 2 * t * cp1.y
          + 3 * oneMinusT * t ** 2 * cp2.y
          + t ** 3 * end.y,
      }
    }

    const curveSegments = (start: ChartPoint, end: ChartPoint) => {
      const samples = 10
      const curvePoints = Array.from({ length: samples + 1 }, (_, sampleIndex) =>
        cubicPoint(start, end, sampleIndex / samples),
      )
      return curvePoints.slice(1).map((point, index) => ({
        start: curvePoints[index] ?? start,
        end: point,
      }))
    }

    const points = pointIndices.map((index) => getPoint(index))
    const lineSegments = points.slice(1).flatMap((point, index) => {
      const previousPoint = points[index]
      if (!previousPoint || !point) return []
      return curveSegments(previousPoint, point)
    })

    const intersects = (box: LabelBox, other: LabelBox) =>
      box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top

    const intersectionArea = (box: LabelBox, other: LabelBox) => {
      if (!intersects(box, other)) return 0
      return (Math.min(box.right, other.right) - Math.max(box.left, other.left))
        * (Math.min(box.bottom, other.bottom) - Math.max(box.top, other.top))
    }

    const normalize = (x: number, y: number) => {
      const length = Math.hypot(x, y)
      if (length <= 0.001) return { x: 0, y: -1 }
      return { x: x / length, y: y / length }
    }

    const expandBox = (box: LabelBox, amount: number): LabelBox => ({
      left: box.left - amount,
      right: box.right + amount,
      top: box.top - amount,
      bottom: box.bottom + amount,
    })

    const pointInsideBox = (point: ChartPoint, box: LabelBox) =>
      point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom

    const cross = (a: ChartPoint, b: ChartPoint, c: ChartPoint) =>
      (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

    const isOnSegment = (a: ChartPoint, b: ChartPoint, c: ChartPoint) =>
      c.x >= Math.min(a.x, b.x) - 0.001
      && c.x <= Math.max(a.x, b.x) + 0.001
      && c.y >= Math.min(a.y, b.y) - 0.001
      && c.y <= Math.max(a.y, b.y) + 0.001

    const segmentsIntersect = (a: ChartPoint, b: ChartPoint, c: ChartPoint, d: ChartPoint) => {
      const abC = cross(a, b, c)
      const abD = cross(a, b, d)
      const cdA = cross(c, d, a)
      const cdB = cross(c, d, b)

      if (Math.abs(abC) <= 0.001 && isOnSegment(a, b, c)) return true
      if (Math.abs(abD) <= 0.001 && isOnSegment(a, b, d)) return true
      if (Math.abs(cdA) <= 0.001 && isOnSegment(c, d, a)) return true
      if (Math.abs(cdB) <= 0.001 && isOnSegment(c, d, b)) return true

      return Math.sign(abC) !== Math.sign(abD) && Math.sign(cdA) !== Math.sign(cdB)
    }

    const segmentIntersectsBox = (segment: { start: ChartPoint; end: ChartPoint }, box: LabelBox) => {
      if (pointInsideBox(segment.start, box) || pointInsideBox(segment.end, box)) return true

      const topLeft = { x: box.left, y: box.top }
      const topRight = { x: box.right, y: box.top }
      const bottomRight = { x: box.right, y: box.bottom }
      const bottomLeft = { x: box.left, y: box.bottom }
      return segmentsIntersect(segment.start, segment.end, topLeft, topRight)
        || segmentsIntersect(segment.start, segment.end, topRight, bottomRight)
        || segmentsIntersect(segment.start, segment.end, bottomRight, bottomLeft)
        || segmentsIntersect(segment.start, segment.end, bottomLeft, topLeft)
    }

    const labelBoxForPosition = (
      point: ChartPoint,
      width: number,
      height: number,
      clearance: number,
      position: { x: number; y: number },
    ): LabelBox => {
      const boxWidth = width + 6
      const boxHeight = height + 6
      const left = position.x < 0
        ? point.x - clearance - boxWidth
        : position.x > 0
          ? point.x + clearance
          : point.x - boxWidth / 2
      const top = position.y < 0
        ? point.y - clearance - boxHeight
        : position.y > 0
          ? point.y + clearance
          : point.y - boxHeight / 2

      return {
        left,
        right: left + boxWidth,
        top,
        bottom: top + boxHeight,
      }
    }

    labelIndices.forEach((index) => {
      const value = chartValues.value[index]
      if (typeof value !== 'number') return
      const point = points[index]
      if (!point) return
      const custom = labelMap.get(index)
      const text = custom?.label ?? formatCompactCurrency(value, props.valuePrefix)
      const width = ctx.measureText(text).width
      const height = chartTypography.fontSize

      const prevPoint = points[Math.max(index - 1, 0)] ?? point
      const nextPoint = points[Math.min(index + 1, lastIndex.value)] ?? point
      const tangent = normalize(nextPoint.x - prevPoint.x, nextPoint.y - prevPoint.y)
      const preferredPosition = custom?.position
      const orderedPositions = preferredPosition
        ? [
            labelPositions.find((position) => position.position === preferredPosition),
            ...labelPositions.filter((position) => position.position !== preferredPosition),
          ].filter((position): position is typeof labelPositions[number] => Boolean(position))
        : labelPositions

      const clearances = [4, 6, 8, 11, 15, 20, 28]
      const candidates = clearances.flatMap((clearance) =>
        orderedPositions.map((position, priority) => {
          const direction = normalize(position.x, position.y)
          const box = labelBoxForPosition(point, width, height, clearance, position)
          const lineBox = expandBox(box, 2)
          const lineOverlap = lineSegments.some((segment) => segmentIntersectsBox(segment, lineBox))
          if (lineOverlap) return undefined

          const boundaryPenalty =
            Math.max(chartArea.left - box.left, 0)
            + Math.max(box.right - chartArea.right, 0)
            + Math.max(chartArea.top - box.top, 0)
            + Math.max(box.bottom - chartArea.bottom, 0)
          const collisionPenalty = drawnBoxes.reduce((sum, drawn) => sum + intersectionArea(box, drawn), 0)
          const tangentPenalty = Math.abs(direction.x * tangent.x + direction.y * tangent.y) * 6

          return {
            box,
            x: box.left + 3,
            y: box.top + 3,
            boundaryPenalty,
            collisionPenalty,
            score: boundaryPenalty * 24 + collisionPenalty * 10 + tangentPenalty + clearance * 0.08 + priority * 0.01,
          }
        }).filter((candidate): candidate is {
          box: LabelBox
          x: number
          y: number
          boundaryPenalty: number
          collisionPenalty: number
          score: number
        } => Boolean(candidate)),
      ).sort((a, b) => a.score - b.score)

      const winner = candidates.find((candidate) =>
        candidate.boundaryPenalty === 0 && candidate.collisionPenalty === 0,
      ) ?? candidates.find((candidate) =>
        candidate.boundaryPenalty === 0,
      ) ?? candidates[0]
      if (!winner) return
      const box = winner.box

      drawnBoxes.push(box)
      ctx.fillText(text, winner.x, winner.y)
    })

    ctx.restore()
  },
}

const dottedGrid = createDottedGridPlugin<'line'>({
  xOrigin: 'canvas',
  xEndOrigin: 'canvas',
})

const floatingYAxis = createFloatingYAxisPlugin<'line'>({
  xOrigin: 'canvas',
  formatter: (value) => {
    if (Number.isNaN(value)) return ''
    const domain = axisDomain.value
    return formatAxisTickValue(inverseTransformChartValue(value, domain.scaleMode))
  },
})

function fitXAxisLabelSection(axis: Scale) {
  axis.height = Math.max(axis.height, axisLabelSectionHeight.value)
}

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  events: [],
  layout: { padding: { top: 26, right: plotPadding.value.right, bottom: 0, left: plotPadding.value.left } },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: {
      display: true,
      afterFit: fitXAxisLabelSection,
      offset: false,
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
  <div class="chart-line">
    <div class="chart-line__canvas">
      <ClientOnly>
        <Line
          :data="data"
          :options="options"
          :plugins="[dottedGrid, floatingYAxis, pointLabelsPlugin]"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.chart-line {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.chart-line__canvas {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  pointer-events: none;
}
</style>
