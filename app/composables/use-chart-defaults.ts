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
  Chart.defaults.events = []
  Chart.defaults.devicePixelRatio = Math.max(window.devicePixelRatio || 1, 2)
  Chart.defaults.font.family = chartTypography.fontFamily
  Chart.defaults.font.size = chartTypography.fontSize
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
  yellow: '#FFE84C',
  lemon: '#FFF58A',
  peach: '#FFC98A',
  orange: '#FFAA67',
  coral: '#FF8275',
  rose: '#F4A7A0',
  lavender: '#B6A5F3',
  periwinkle: '#C8BBFF',
  blue: '#9BC7FB',
  green: '#A6E8BB',
  beige: '#E3DFD7',
  slate: '#565B63',
  ink: '#111111',
  accent: '#FFE84C',
  accentDeep: '#FFAA67',
  accentSoft: '#E3DFD7',
  subtle: '#8a8a8a',
  hairline: '#ececec',
  surface: '#f3f2ef',
  card: '#ffffff',
  negative: '#FF8275',
  positive: '#FFAA67',
  categorical: [
    '#FFE84C',
    '#FFF58A',
    '#FFC98A',
    '#FFAA67',
    '#FF8275',
    '#F4A7A0',
    '#B6A5F3',
    '#C8BBFF',
    '#9BC7FB',
    '#A6E8BB',
    '#E3DFD7',
    '#565B63',
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
  fontFamily: '"Aeonik Regular", Helvetica, Arial, sans-serif',
  fontSize: 11,
  labelFontSizeRem: '0.6875rem',
  titleFontSizeRem: '0.8125rem',
  outerLegendFontSizeRem: '0.5rem',
  labelColor: '#9a9a9a',
  valueColor: '#111111',
  gridColor: '#c4c4c4',
  baselineColor: '#c4c4c4',
}

export const chartRadius = 0

export const centeredBarClusterMaxItems = 8
export const centeredBarClusterGapRatio = 2

export type ChartScaleMode = 'normal' | 'exponential'

type LegacyChartScaleMode = ChartScaleMode | 'linear' | 'sqrt' | 'cbrt' | 'log'

interface ChartAxisDomainOptions {
  scaleMode?: LegacyChartScaleMode
  guideLineCount?: number
  minGuideLineCount?: number
  maxGuideLineCount?: number
  includeZero?: boolean
}

export interface ChartAxisDomain {
  min: number
  max: number
  stepSize: number
  guideLineCount: number
  positiveGuideLineCount: number
  negativeGuideLineCount: number
  scaleMode: ChartScaleMode
}

const chartNiceStepMultipliers = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]

export function normalizeChartScaleMode(mode?: LegacyChartScaleMode): ChartScaleMode {
  if (mode === 'exponential' || mode === 'sqrt' || mode === 'cbrt' || mode === 'log') {
    return 'exponential'
  }
  return 'normal'
}

export function clampChartGuideLineCount(value: number, min = 4, max = 10) {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function shouldShowChartBaselineLabel(index: number, total: number, labelEvery = 1) {
  if (total <= 0) return false

  const safeLabelEvery = Number.isFinite(labelEvery)
    ? Math.max(1, Math.round(labelEvery))
    : 1
  if (total >= 25) return index % 3 === 0
  if (total >= 16) return index % 2 === 0

  return index % safeLabelEvery === 0
}

export function shouldUseCenteredBarCluster(count: number) {
  return count > 0 && count <= centeredBarClusterMaxItems
}

export function getCenteredBarClusterPositions(
  count: number,
  barWidth: number,
  gapRatio = centeredBarClusterGapRatio,
) {
  if (count <= 0) return []

  const centerStep = barWidth * (gapRatio + 1)
  const start = -((count - 1) * centerStep) / 2

  return Array.from({ length: count }, (_, index) => start + index * centerStep)
}

interface CenteredBarClusterPluginOptions {
  isEnabled: () => boolean
  getBarWidth: () => number
  getPositions: () => number[]
}

function chartPaddingSide(
  padding: number | false | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>> | undefined,
  side: 'left' | 'right',
) {
  if (typeof padding === 'number') return padding
  if (!padding || padding === false) return 0

  return Number(padding[side] ?? 0)
}

export function createCenteredBarClusterPlugin(
  options: CenteredBarClusterPluginOptions,
): Plugin<'bar'> {
  return {
    id: 'centered-bar-cluster',
    beforeLayout(chart) {
      if (!options.isEnabled()) return

      const positions = options.getPositions()
      if (positions.length === 0) return

      const scales = chart.options.scales as Record<string, { min?: number; max?: number }> | undefined
      const xScaleOptions = scales?.x
      if (!xScaleOptions) return

      const barWidth = options.getBarWidth()
      const padding = chart.options.layout?.padding
      const plotWidth = Math.max(
        1,
        chart.width - chartPaddingSide(padding, 'left') - chartPaddingSide(padding, 'right'),
      )
      const clusterMin = Math.min(...positions) - barWidth / 2
      const clusterMax = Math.max(...positions) + barWidth / 2
      const clusterWidth = clusterMax - clusterMin
      const domainWidth = Math.max(plotWidth, clusterWidth + barWidth * 2)

      xScaleOptions.min = -domainWidth / 2
      xScaleOptions.max = domainWidth / 2
    },
  }
}

export function getNiceChartStepAtOrAbove(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1

  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude
  const multiplier = chartNiceStepMultipliers.find((item) => normalized <= item) ?? 10

  return multiplier * magnitude
}

export function transformChartValue(value: number, scaleMode: LegacyChartScaleMode = 'normal') {
  const finiteValue = Number.isFinite(value) ? value : 0
  if (normalizeChartScaleMode(scaleMode) === 'normal') return finiteValue

  return Math.sign(finiteValue) * Math.log1p(Math.abs(finiteValue))
}

export function inverseTransformChartValue(value: number, scaleMode: LegacyChartScaleMode = 'normal') {
  const finiteValue = Number.isFinite(value) ? value : 0
  if (normalizeChartScaleMode(scaleMode) === 'normal') return finiteValue

  return Math.sign(finiteValue) * Math.expm1(Math.abs(finiteValue))
}

export function createChartAxisDomain(values: number[], options: ChartAxisDomainOptions = {}): ChartAxisDomain {
  const {
    scaleMode: requestedScaleMode = 'normal',
    guideLineCount: requestedGuideLineCount = 8,
    minGuideLineCount = 4,
    maxGuideLineCount = 10,
    includeZero = true,
  } = options
  const scaleMode = normalizeChartScaleMode(requestedScaleMode)
  const guideLineCount = clampChartGuideLineCount(
    requestedGuideLineCount,
    minGuideLineCount,
    maxGuideLineCount,
  )
  const finiteValues = values.filter((value) => Number.isFinite(value))
  const domainValues = includeZero ? [...finiteValues, 0] : finiteValues
  const safeDomainValues = domainValues.length > 0 ? domainValues : [0]
  const rawMin = Math.min(...safeDomainValues)
  const rawMax = Math.max(...safeDomainValues)
  const transformedMin = transformChartValue(rawMin, scaleMode)
  const transformedMax = transformChartValue(rawMax, scaleMode)
  const hasPositive = transformedMax > 0
  const hasNegative = transformedMin < 0

  if (!hasPositive && !hasNegative) {
    return {
      min: 0,
      max: 1,
      stepSize: 1 / guideLineCount,
      guideLineCount,
      positiveGuideLineCount: guideLineCount,
      negativeGuideLineCount: 0,
      scaleMode,
    }
  }

  let positiveGuideLineCount = hasPositive ? guideLineCount : 0
  let negativeGuideLineCount = hasNegative ? guideLineCount : 0

  if (hasPositive && hasNegative) {
    positiveGuideLineCount = Math.max(2, Math.ceil(guideLineCount / 2))
    negativeGuideLineCount = Math.max(2, guideLineCount - positiveGuideLineCount)
  }

  const positiveStep = hasPositive
    ? transformedMax / Math.max(positiveGuideLineCount - 1, 1)
    : 0
  const negativeStep = hasNegative
    ? Math.abs(transformedMin) / Math.max(negativeGuideLineCount - 1, 1)
    : 0
  const stepSize = Math.max(positiveStep, negativeStep, Number.EPSILON)

  return {
    min: hasNegative ? -stepSize * negativeGuideLineCount : 0,
    max: hasPositive ? stepSize * positiveGuideLineCount : 0,
    stepSize,
    guideLineCount: positiveGuideLineCount + negativeGuideLineCount,
    positiveGuideLineCount,
    negativeGuideLineCount,
    scaleMode,
  }
}

interface DottedGridOptions {
  scaleId?: string
  dotColor?: string
  dotRadius?: number
  dotSpacing?: number
  baselineValue?: number
  baselineColor?: string
  xOrigin?: 'chart-area' | 'canvas'
  xEndOrigin?: 'chart-area' | 'canvas'
}

export function createDottedGridPlugin<TType extends 'bar' | 'line' = 'bar'>(
  options: DottedGridOptions = {},
): Plugin<TType> {
  const {
    scaleId = 'y',
    dotColor = chartTypography.gridColor,
    dotRadius = 0.6,
    dotSpacing = 6,
    baselineValue = 0,
    baselineColor = chartTypography.baselineColor,
    xOrigin = 'chart-area',
    xEndOrigin = 'chart-area',
  } = options

  return {
    id: `dotted-grid-${scaleId}`,
    beforeDraw(chart) {
      const { ctx, chartArea, scales } = chart
      const scale = scales[scaleId]
      if (!chartArea || !scale) return
      const ticks = scale.ticks
      if (!ticks) return

      ctx.save()
      const startX = xOrigin === 'canvas' ? 0 : chartArea.left
      const endX = xEndOrigin === 'canvas' ? chart.width : chartArea.right
      ticks.forEach((tick) => {
        const tickValue = Number(tick.value)
        const y = scale.getPixelForValue(tickValue)
        if (Math.abs(tickValue - baselineValue) < 0.000001) {
          ctx.setLineDash([])
          ctx.strokeStyle = baselineColor
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(startX, y)
          ctx.lineTo(endX, y)
          ctx.stroke()
          return
        }
        ctx.fillStyle = dotColor
        for (let x = startX; x <= endX; x += dotSpacing) {
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
  xOrigin?: 'chart-area' | 'canvas'
}

export function createFloatingYAxisPlugin<TType extends 'bar' | 'line' = 'bar'>(
  options: FloatingYAxisOptions,
): Plugin<TType> {
  const {
    scaleId = 'y',
    formatter,
    textColor = chartTypography.labelColor,
    inset = 0,
    verticalOffset = 5,
    placement = 'above',
    xOrigin = 'chart-area',
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

      const x = xOrigin === 'canvas' ? inset : chartArea.left + inset
      ticks.forEach((tick) => {
        const y = scale.getPixelForValue(tick.value)
        const text = formatter(Number(tick.value))
        if (!text) return
        const drawY = placement === 'above' ? y - verticalOffset : y
        ctx.fillText(text, x, drawY)
      })
      ctx.restore()
    },
  }
}
