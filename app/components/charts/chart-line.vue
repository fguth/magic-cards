<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions, Plugin, ScriptableContext } from 'chart.js'

defineOptions({ name: 'ChartLine' })

interface PointLabel {
  index: number
  label?: string
}

interface ChartLineProps {
  labels: Array<string | number>
  values: number[]
  valuePrefix?: string
  pointLabels?: PointLabel[]
  labelEvery?: number
}

const props = withDefaults(defineProps<ChartLineProps>(), {
  valuePrefix: '$',
  pointLabels: () => [],
  labelEvery: 7,
})

useChartDefaults()

const maxValue = computed(() => Math.max(...props.values, 0))

const yAxisMax = computed(() => {
  const max = maxValue.value
  if (max <= 0) return 1
  const step = 300
  return Math.ceil(max / step) * step
})

const labeledIndices = computed(() => {
  if (props.pointLabels.length > 0) return new Set(props.pointLabels.map((item) => item.index))
  return new Set<number>()
})

const lastIndex = computed(() => props.values.length - 1)

const useSparseData = computed(() => props.pointLabels.length > 0)

const plottedData = computed<(number | null)[]>(() => {
  if (!useSparseData.value) return props.values
  return props.values.map((value, index) =>
    labeledIndices.value.has(index) || index === lastIndex.value ? value : null,
  )
})

function interpolateGradientColor(value: number): string {
  const max = maxValue.value || 1
  const ratio = Math.min(Math.max(value / max, 0), 1)
  const stops = warmGradientStops
  for (let i = 1; i < stops.length; i += 1) {
    const a = stops[i - 1]
    const b = stops[i]
    if (ratio <= b.offset) {
      const local = (ratio - a.offset) / (b.offset - a.offset)
      return mixHex(a.color, b.color, local)
    }
  }
  return stops[stops.length - 1].color
}

function mixHex(hexA: string, hexB: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
  const [ar, ag, ab] = parse(hexA)
  const [br, bg, bb] = parse(hexB)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const b = Math.round(ab + (bb - ab) * t)
  return `rgb(${r}, ${g}, ${b})`
}

const data = computed<ChartData<'line'>>(() => ({
  labels: props.labels.map(String),
  datasets: [
    {
      data: plottedData.value as number[],
      borderColor: (context: ScriptableContext<'line'>) =>
        createVerticalGradient(context, warmGradientStops, 'up'),
      backgroundColor: 'transparent',
      borderWidth: 5,
      borderCapStyle: 'round',
      borderJoinStyle: 'round',
      pointRadius: props.values.map((_, index) =>
        labeledIndices.value.has(index) || index === lastIndex.value ? 4.5 : 0,
      ),
      pointHoverRadius: 0,
      pointBackgroundColor: props.values.map((value) => interpolateGradientColor(value)),
      pointBorderColor: '#ffffff',
      pointBorderWidth: props.values.map((_, index) =>
        labeledIndices.value.has(index) || index === lastIndex.value ? 1.5 : 0,
      ),
      tension: 0.4,
      fill: false,
      cubicInterpolationMode: 'monotone',
      spanGaps: true,
    },
  ],
}))

const pointLabelsPlugin: Plugin<'line'> = {
  id: 'line-point-labels',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)
    if (!meta?.data) return

    ctx.save()
    ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
    ctx.fillStyle = chartTypography.valueColor
    ctx.textAlign = 'center'

    const labelMap = new Map<number, string | undefined>()
    props.pointLabels.forEach((item) => labelMap.set(item.index, item.label))

    const plottedIndices = props.values
      .map((_, index) => index)
      .filter((index) => labeledIndices.value.has(index) || index === lastIndex.value)

    plottedIndices.forEach((index, position) => {
      const value = props.values[index]
      if (typeof value !== 'number') return
      const point = meta.data[index]
      if (!point) return
      const custom = labelMap.get(index)
      const text = custom ?? `${props.valuePrefix}${Math.round(value).toLocaleString('en-US')}`
      const anyPoint = point as unknown as { x: number; y: number }

      const prevIndex = plottedIndices[position - 1]
      const nextIndex = plottedIndices[position + 1]
      const prev = prevIndex !== undefined ? props.values[prevIndex] : undefined
      const next = nextIndex !== undefined ? props.values[nextIndex] : undefined
      const isPeak = (prev === undefined || value >= prev) && (next === undefined || value >= next)

      const textAlign = index === 0 ? 'left' : index === lastIndex.value ? 'right' : 'center'
      ctx.textAlign = textAlign
      const offsetX = index === 0 ? 6 : index === lastIndex.value ? -6 : 0

      if (isPeak) {
        ctx.textBaseline = 'bottom'
        ctx.fillText(text, anyPoint.x + offsetX, anyPoint.y - 10)
      } else {
        ctx.textBaseline = 'top'
        ctx.fillText(text, anyPoint.x + offsetX, anyPoint.y + 10)
      }
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

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 26, right: 6, bottom: 12, left: 6 } },
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
          const last = total - 1
          if (index === 0) return String(props.labels[index])
          if (index === last) return String(props.labels[index])
          if (index % props.labelEvery === 0 && last - index >= 2) return String(props.labels[index])
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
      ticks: { display: false, stepSize: 300 },
    },
  },
}))
</script>

<template>
  <div class="chart-line">
    <div class="chart-line__canvas">
      <ClientOnly>
        <Line :data="data" :options="options" :plugins="[dottedGrid, floatingYAxis, pointLabelsPlugin]" />
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
}
</style>
