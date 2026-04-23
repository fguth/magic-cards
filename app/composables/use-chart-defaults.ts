import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip,
  type Plugin,
  type ScriptableContext,
} from 'chart.js'

let registered = false

export function useChartDefaults() {
  if (registered) return
  if (typeof window === 'undefined') return

  Chart.register(
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    DoughnutController,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PieController,
    PointElement,
    Tooltip,
  )

  Chart.defaults.animation = false
  Chart.defaults.responsive = true
  Chart.defaults.maintainAspectRatio = false
  Chart.defaults.devicePixelRatio = Math.max(window.devicePixelRatio || 1, 2)
  Chart.defaults.font.family = '"CashSans Regular", Helvetica, Arial, sans-serif'
  Chart.defaults.font.size = 11
  Chart.defaults.color = '#666666'
  Chart.defaults.borderColor = '#e8e8e8'

  if (Chart.defaults.plugins?.legend) {
    Chart.defaults.plugins.legend.display = false
  }
  if (Chart.defaults.plugins?.tooltip) {
    Chart.defaults.plugins.tooltip.enabled = false
  }

  registered = true
}

export const chartPalette = {
  ink: '#111111',
  accent: '#f5b83d',
  accentDeep: '#e59a14',
  accentSoft: '#fde5b4',
  subtle: '#8a8a8a',
  hairline: '#ececec',
  surface: '#f3f2ef',
  card: '#ffffff',
  negative: '#111111',
  positive: '#f5b83d',
  categorical: [
    '#111111',
    '#f5b83d',
    '#e6e4df',
    '#4a4a4a',
    '#d9d6cf',
    '#f9cd6c',
  ],
}

export function formatCompactCurrency(value: number, prefix = '$'): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const scaled = value / 1_000_000
    return `${prefix}${stripTrailingZero(scaled.toFixed(1))}m`
  }
  if (abs >= 1_000) {
    const scaled = value / 1_000
    return `${prefix}${stripTrailingZero(scaled.toFixed(1))}k`
  }
  return `${prefix}${Math.round(value)}`
}

function stripTrailingZero(value: string): string {
  return value.replace(/\.0$/, '')
}

export const chartTypography = {
  fontFamily: '"CashSans Mono Regular", monospace',
  fontSize: 10,
  labelColor: '#9a9a9a',
  valueColor: '#111111',
  gridColor: '#c4c4c4',
  baselineColor: '#c4c4c4',
}

export const chartRadius = 6

export const warmGradientStops = [
  { offset: 0, color: '#f56a3c' },
  { offset: 0.55, color: '#f7a93a' },
  { offset: 1, color: '#fbcf5a' },
] as const

export const coolGradientStops = [
  { offset: 0, color: '#1c1c1c' },
  { offset: 0.5, color: '#3a3a3a' },
  { offset: 1, color: '#6a6a6a' },
] as const

export function createVerticalGradient(
  context: ScriptableContext<'bar' | 'line'>,
  stops: readonly { offset: number; color: string }[],
  direction: 'up' | 'down' = 'up',
): CanvasGradient | string {
  const { chart } = context
  const { ctx, chartArea } = chart
  if (!chartArea) return stops[0].color
  const from = direction === 'up' ? chartArea.bottom : chartArea.top
  const to = direction === 'up' ? chartArea.top : chartArea.bottom
  const gradient = ctx.createLinearGradient(0, from, 0, to)
  stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color))
  return gradient
}

interface DottedGridOptions {
  scaleId?: string
  dotColor?: string
  dotRadius?: number
  dotSpacing?: number
  baselineValue?: number
  baselineColor?: string
}

export function createDottedGridPlugin(options: DottedGridOptions = {}): Plugin {
  const {
    scaleId = 'y',
    dotColor = chartTypography.gridColor,
    dotRadius = 0.6,
    dotSpacing = 6,
    baselineValue = 0,
    baselineColor = chartTypography.baselineColor,
  } = options

  return {
    id: `dotted-grid-${scaleId}`,
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart
      const scale = scales[scaleId]
      if (!chartArea || !scale) return
      const ticks = scale.ticks
      if (!ticks) return

      ctx.save()
      ticks.forEach((tick) => {
        const y = scale.getPixelForValue(tick.value)
        if (tick.value === baselineValue) {
          ctx.setLineDash([])
          ctx.strokeStyle = baselineColor
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(chartArea.left, y)
          ctx.lineTo(chartArea.right, y)
          ctx.stroke()
          return
        }
        ctx.fillStyle = dotColor
        for (let x = chartArea.left; x <= chartArea.right; x += dotSpacing) {
          ctx.beginPath()
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      ctx.restore()
    },
  }
}

interface FloatingYAxisOptions {
  scaleId?: string
  formatter: (value: number) => string
  textColor?: string
  inset?: number
  verticalOffset?: number
  placement?: 'above' | 'overlay'
}

export function createFloatingYAxisPlugin(options: FloatingYAxisOptions): Plugin {
  const {
    scaleId = 'y',
    formatter,
    textColor = chartTypography.labelColor,
    inset = 0,
    verticalOffset = 5,
    placement = 'above',
  } = options

  return {
    id: `floating-y-axis-${scaleId}`,
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea, scales } = chart
      const scale = scales[scaleId]
      if (!chartArea || !scale) return
      const ticks = scale.ticks
      if (!ticks) return

      ctx.save()
      ctx.font = `500 ${chartTypography.fontSize}px ${chartTypography.fontFamily}`
      ctx.fillStyle = textColor
      ctx.textAlign = 'left'
      ctx.textBaseline = placement === 'above' ? 'bottom' : 'middle'

      ticks.forEach((tick) => {
        const y = scale.getPixelForValue(tick.value)
        const text = formatter(Number(tick.value))
        if (!text) return
        const drawY = placement === 'above' ? y - verticalOffset : y
        ctx.fillText(text, chartArea.left + inset, drawY)
      })
      ctx.restore()
    },
  }
}
