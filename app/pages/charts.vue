<script setup lang="ts">
defineOptions({ name: 'ChartsPage' })

useHead({ title: 'Charts — Jota Abril 2026' })

const chartsViewportWidth = ref(1440)
const chartsRootFontSize = ref(32)

function updateChartsViewportMetrics() {
  if (typeof window === 'undefined') return

  chartsViewportWidth.value = document.documentElement.clientWidth || window.innerWidth
  const rootSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  chartsRootFontSize.value = Number.isFinite(rootSize) ? rootSize : 32
}

onMounted(() => {
  updateChartsViewportMetrics()
  window.addEventListener('resize', updateChartsViewportMetrics, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', updateChartsViewportMetrics)
})

const chartsPageStyle = computed(() => {
  const viewportWidth = chartsViewportWidth.value
  const rootSize = chartsRootFontSize.value
  const cardSize = 18.75 * rootSize
  const gridGap = rootSize
  const inlinePadding = viewportWidth <= 600
    ? rootSize * 0.25
    : viewportWidth <= 920
      ? rootSize * 0.5
      : rootSize * 2
  const availableWidth = Math.max(0, viewportWidth - inlinePadding * 2)
  const twoColumnWidth = cardSize * 2 + gridGap
  const columnCount = availableWidth >= twoColumnWidth ? 2 : 1
  const cardScale = columnCount === 1 ? Math.min(1, availableWidth / cardSize) : 1
  const visualCardWidth = cardSize * cardScale
  const groupsWidth = columnCount === 2 ? twoColumnWidth : visualCardWidth

  return {
    '--charts-page-padding-inline': `${inlinePadding}px`,
    '--charts-grid-gap': `${gridGap}px`,
    '--charts-grid-template': `repeat(${columnCount}, ${visualCardWidth}px)`,
    '--charts-groups-width': `${groupsWidth}px`,
    '--charts-card-visual-width': `${visualCardWidth}px`,
    '--charts-card-scale': `${cardScale}`,
    '--charts-card-flow-offset': `${visualCardWidth - cardSize}px`,
  }
})

const solidColors = {
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
} as const

const datavizColors = {
  categories: [
    solidColors.yellow,
    solidColors.lemon,
    solidColors.peach,
    solidColors.orange,
    solidColors.coral,
    solidColors.rose,
    solidColors.lavender,
    solidColors.periwinkle,
    solidColors.blue,
    solidColors.green,
    solidColors.beige,
    solidColors.slate,
  ],
  primary: solidColors.orange,
  line: solidColors.orange,
  positive: solidColors.yellow,
  negative: solidColors.coral,
  primarySwatch: solidColors.yellow,
  secondarySwatch: solidColors.coral,
  pieSliceSpacing: 0,
}

function categoryColor(index: number) {
  return datavizColors.categories[index % datavizColors.categories.length]
}

const visualPaletteNames = [
  'Amarelo',
  'Limão',
  'Pêssego',
  'Laranja',
  'Coral',
  'Rosa',
  'Lavanda',
  'Pervinca',
  'Azul',
  'Verde',
  'Bege',
  'Slate',
] as const

const visualPalette = datavizColors.categories.map((color, index) => ({
  color,
  label: visualPaletteNames[index] ?? `Cor ${index + 1}`,
}))

const categoryLabels = ['Alimentação', 'Casa', 'Viagem', 'Outros']
const categoryValues = [16200, 21800, 28700, 14360]
const splitCategoryLabels = [...categoryLabels, 'Saúde', 'Educação', 'Lazer']
const splitCategoryValues = [16200, 21800, 28700, 14360, 9300, 7100, 4800]

const revenueLabels = [
  '01/04',
  '02/04',
  '05/04',
  '06/04',
  '07/04',
  '08/04',
  '09/04',
  '10/04',
  '13/04',
  '14/04',
  '15/04',
  '16/04',
  '17/04',
  '19/04',
  '20/04',
]
const dailyRevenue = [
  18400,
  66.1,
  1070,
  22200,
  56.2,
  91,
  125,
  62.1,
  56.1,
  61.8,
  56.3,
  55.6,
  5880,
  2.5,
  57.8,
]
const revenueHighlights = [
  { index: 0, label: '18.4k' },
  { index: 1, label: '66.1' },
  { index: 2, label: '1.07k' },
  { index: 3, label: '22.2k' },
  { index: 4, label: '56.2' },
  { index: 5, label: '91' },
  { index: 6, label: '125' },
  { index: 7, label: '62.1' },
  { index: 9, label: '61.8' },
  { index: 11, label: '55.6' },
  { index: 12, label: '5.88k' },
  { index: 13, label: '2.5' },
  { index: 14, label: '57.8' },
]

const spendingLabels = [
  '01/04',
  '02/04',
  '03/04',
  '04/04',
  '05/04',
  '06/04',
  '07/04',
  '08/04',
  '09/04',
  '10/04',
  '11/04',
  '12/04',
  '13/04',
  '14/04',
  '15/04',
  '16/04',
  '17/04',
  '18/04',
  '19/04',
  '20/04',
  '21/04',
]
const dailySpending = [
  284,
  216,
  150,
  250,
  14700,
  16600,
  59.6,
  14700,
  968,
  2.5,
  526,
  808,
  57.3,
  389,
  1160,
  1220,
  9690,
  883,
  17000,
  1300,
  16.3,
]
const spendingValueLabels = [
  '284',
  '216',
  '150',
  '250',
  '14.7k',
  '16.6k',
  '59.6',
  '14.7k',
  '968',
  '2.5',
  '526',
  '808',
  '57.3',
  '389',
  '1.16k',
  '1.22k',
  '9.69k',
  '883',
  '17k',
  '1.3k',
  '16.3',
]

const bankFlows = [
  { label: 'Principal', inflow: 30300, outflow: 19500, inflowLabel: '30.3k', outflowLabel: '-19.5k' },
  {
    label: 'Cartão',
    inflow: 17000,
    outflow: 28200,
    inflowLabel: '17k',
    outflowLabel: '-28.2k',
  },
  {
    label: 'Reserva',
    inflow: 1070,
    outflow: 16600,
    inflowLabel: '1.07k',
    outflowLabel: '-16.6k',
  },
  {
    label: 'Investimentos',
    inflow: 0,
    outflow: 16000,
    inflowLabel: '0',
    outflowLabel: '-16k',
  },
  {
    label: 'Viagens',
    inflow: 0.22,
    outflow: 634,
    inflowLabel: '0.22',
    outflowLabel: '-634',
  },
  {
    label: 'Impostos',
    inflow: 0,
    outflow: 55.8,
    inflowLabel: '0',
    outflowLabel: '-55.8',
  },
  { label: 'Outros', inflow: 0, outflow: 100, inflowLabel: '0', outflowLabel: '-100' },
]

const chartPeriod = 'Abril 2026'

const accountCashFlowColumns = [
  { key: 'account', label: 'Conta', width: '54%' },
  { key: 'inflow', label: 'Entrada', align: 'right', width: '23%' },
  { key: 'outflow', label: 'Saída', align: 'right', width: '23%', gapBefore: true },
] satisfies TableStressColumn[]

const accountCashFlowRows = [
  { account: 'Principal', inflow: '30.262', outflow: '19.488' },
  { account: 'Cartão', inflow: '16.963', outflow: '28.237' },
  { account: 'Reserva', inflow: '1.074', outflow: '16.640' },
  { account: 'Investimentos', inflow: '0', outflow: '15.959' },
  { account: 'Viagens', inflow: '0', outflow: '634' },
  { account: 'Impostos', inflow: '0', outflow: '56' },
]

const scheduledInflowColumns = [
  { key: 'date', label: 'Data', width: '16%' },
  { key: 'counterparty', label: 'Cliente', width: '24%', gapBefore: 'small' as const },
  { key: 'amount', label: 'Valor', align: 'right', width: '16%', gapBefore: 'small' as const },
  { key: 'category', label: 'Tipo', width: '19%', gapBefore: 'small' as const },
  { key: 'description', label: 'Nota', width: '25%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const scheduledInflowRows = [
  {
    date: '10 Mai 2026',
    counterparty: 'Cliente Alfa',
    amount: '100,00',
    category: 'Venda',
    description: 'Sinal',
  },
  {
    date: '15 Mai 2026',
    counterparty: 'Projeto Beta',
    amount: '100,00',
    category: 'Serviço',
    description: 'Entrega',
  },
  {
    date: '20 Mai 2026',
    counterparty: 'Cliente Davi',
    amount: '1.000,00',
    category: 'Venda',
    description: 'Parcela 2',
  },
  {
    date: '10 Jun 2026',
    counterparty: 'Cliente Alfa',
    amount: '100,00',
    category: 'Venda',
    description: 'Mensal',
  },
]

const singleValueScenario = {
  title: 'Saldo disponível',
  titleSuperscript: '(R$)',
  subtitle: chartPeriod,
  value: '79.037,56',
  note: 'Um dado único não vira tabela: aparece como item grande, direto e sem grade.',
} as const

const pendingPaymentColumns = [
  { key: 'item', label: 'Pendência', width: '34%' },
  { key: 'due', label: 'Vencimento', width: '24%', gapBefore: 'small' as const },
  { key: 'amount', label: 'Valor', align: 'right', width: '20%', gapBefore: 'small' as const },
  { key: 'status', label: 'Status', width: '22%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const pendingPaymentRows = [
  { item: 'Cartão', due: '05 Mai', amount: '15.959', status: 'A vencer' },
  { item: 'Software', due: '08 Mai', amount: '56', status: 'Baixo' },
]

const reviewColumns = [
  { key: 'item', label: 'Item', width: '38%' },
  { key: 'owner', label: 'Responsável', width: '28%', gapBefore: true },
  { key: 'status', label: 'Status', width: '34%', gapBefore: true },
] satisfies TableStressColumn[]

const reviewRows = [
  { item: 'Recebíveis', owner: 'Ana', status: 'Confirmar' },
  { item: 'Boletos', owner: 'Rafa', status: 'OK' },
  { item: 'Impostos', owner: 'Time', status: 'Revisar' },
]

const reconciliationColumns = [
  { key: 'date', label: 'Data', width: '12%' },
  { key: 'source', label: 'Canal', width: '18%', gapBefore: 'small' as const },
  { key: 'expected', label: 'Previsto', align: 'right', width: '18%', gapBefore: 'small' as const },
  { key: 'settled', label: 'Liquidado', align: 'right', width: '20%', gapBefore: 'small' as const },
  { key: 'delta', label: 'Diferença', align: 'right', width: '18%', gapBefore: 'small' as const },
  { key: 'status', label: 'Status', width: '14%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const reconciliationRows = [
  { date: '01', source: 'Pix', expected: '22.000', settled: '22.000', delta: '0', status: 'OK' },
  { date: '02', source: 'Cartão', expected: '18.000', settled: '17.986', delta: '-14', status: 'Taxa' },
  { date: '03', source: 'Boleto', expected: '14.500', settled: '14.500', delta: '0', status: 'OK' },
  { date: '04', source: 'TED', expected: '11.200', settled: '11.200', delta: '0', status: 'OK' },
  { date: '05', source: 'Outros', expected: '6.100', settled: '5.980', delta: '-120', status: 'Revisar' },
]

const maxTransactionColumns = [
  { key: 'date', label: 'Data', width: '16%' },
  { key: 'kind', label: 'Tipo', width: '20%', gapBefore: 'small' as const },
  { key: 'account', label: 'Conta', width: '28%', gapBefore: 'small' as const },
  { key: 'amount', label: 'Valor', align: 'right', width: '20%', gapBefore: 'small' as const },
  { key: 'status', label: 'Status', width: '16%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const maxTransactionRows = [
  { date: '01 Abr', kind: 'Entrada', account: 'Principal', amount: '18.400', status: 'OK' },
  { date: '02 Abr', kind: 'Saída', account: 'Cartão', amount: '-216', status: 'OK' },
  { date: '03 Abr', kind: 'Entrada', account: 'Reserva', amount: '1.070', status: 'OK' },
  { date: '04 Abr', kind: 'Saída', account: 'Cartão', amount: '-250', status: 'OK' },
  { date: '05 Abr', kind: 'Entrada', account: 'Principal', amount: '22.200', status: 'OK' },
  { date: '06 Abr', kind: 'Saída', account: 'Viagens', amount: '-16.600', status: 'OK' },
  { date: '07 Abr', kind: 'Entrada', account: 'Reserva', amount: '56', status: 'OK' },
  { date: '08 Abr', kind: 'Saída', account: 'Impostos', amount: '-56', status: 'OK' },
  { date: '09 Abr', kind: 'Entrada', account: 'Principal', amount: '5.880', status: 'OK' },
  { date: '10 Abr', kind: 'Saída', account: 'Cartão', amount: '-968', status: 'OK' },
]

const longNoteColumns = [
  { key: 'date', label: 'Data', width: '16%' },
  { key: 'item', label: 'Item', width: '28%', gapBefore: 'small' as const },
  { key: 'detail', label: 'Detalhe', width: '36%', gapBefore: 'small' as const },
  { key: 'amount', label: 'Valor', align: 'right', width: '20%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const longNoteRows = [
  { date: '01 Abr', item: 'Assinatura', detail: 'Plano anual renovado com desconto', amount: '1.200' },
  { date: '03 Abr', item: 'Reembolso', detail: 'Viagem aprovada em conferência', amount: '634' },
  { date: '05 Abr', item: 'Bônus', detail: 'Valor fechado para pagamento', amount: '4.800' },
  { date: '08 Abr', item: 'Cartão', detail: 'Ajuste de tarifa do cartão', amount: '-216' },
  { date: '12 Abr', item: 'Contrato', detail: 'Cliente novo aguardando aceite', amount: '9.300' },
  { date: '16 Abr', item: 'Parcela', detail: 'Nota final pendente de emissão', amount: '1.000' },
  { date: '20 Abr', item: 'Serviço', detail: 'Cobrança revisada pela equipe', amount: '710' },
]

const mixedDensityColumns = [
  { key: 'area', label: 'Área', width: '24%' },
  { key: 'owner', label: 'Responsável', width: '26%', gapBefore: true },
  { key: 'nextStep', label: 'Próximo passo', width: '34%', gapBefore: true },
  { key: 'status', label: 'Status', width: '16%', gapBefore: true },
] satisfies TableStressColumn[]

const mixedDensityRows = [
  { area: 'Recebíveis', owner: 'Ana', nextStep: 'Confirmar Pix', status: 'Hoje' },
  { area: 'Cartão', owner: 'Rafa', nextStep: 'Conferir taxa aplicada', status: 'Hoje' },
  { area: 'Boleto', owner: 'Time', nextStep: 'Separar pagamentos com atraso', status: 'Aberto' },
  { area: 'Impostos', owner: 'Nina', nextStep: 'Validar guia final', status: 'Hoje' },
  { area: 'Reserva', owner: 'Leo', nextStep: 'Mover excedente para aplicação', status: 'Amanhã' },
  { area: 'Serviços', owner: 'Bia', nextStep: 'Revisar contrato mensal', status: 'Aberto' },
  { area: 'Viagens', owner: 'Caio', nextStep: 'Fechar reembolso pendente', status: 'Hoje' },
  { area: 'Vendas', owner: 'Mila', nextStep: 'Checar nota antes do repasse', status: 'Aberto' },
]

const detailedReconciliationColumns = [
  { key: 'date', label: 'Data', width: '11%' },
  { key: 'channel', label: 'Canal', width: '15%', gapBefore: 'small' as const },
  { key: 'expected', label: 'Valor previsto', align: 'right', width: '18%', gapBefore: 'small' as const },
  { key: 'settled', label: 'Valor liquidado', align: 'right', width: '18%', gapBefore: 'small' as const },
  { key: 'reason', label: 'Motivo', width: '22%', gapBefore: 'small' as const },
  { key: 'status', label: 'Status', width: '16%', gapBefore: 'small' as const },
] satisfies TableStressColumn[]

const detailedReconciliationRows = [
  { date: '01', channel: 'Pix', expected: '22.000', settled: '22.000', reason: 'Sem diferença', status: 'OK' },
  { date: '02', channel: 'Cartão', expected: '18.000', settled: '17.986', reason: 'Taxa aplicada', status: 'Revisar' },
  { date: '03', channel: 'Boleto', expected: '14.500', settled: '14.500', reason: 'Pago no prazo', status: 'OK' },
  { date: '04', channel: 'TED', expected: '11.200', settled: '11.200', reason: 'Conferido manualmente', status: 'OK' },
  { date: '05', channel: 'Outros', expected: '6.100', settled: '5.980', reason: 'Desconto comercial', status: 'Aberto' },
]

const overLimitTwoLineRows = [
  { date: '01 Abr', item: 'Contrato', detail: 'Nova proposta enviada ao cliente', amount: '9.300' },
  { date: '02 Abr', item: 'Cartão', detail: 'Compra recorrente em análise', amount: '-216' },
  { date: '03 Abr', item: 'Reserva', detail: 'Transferência agendada para amanhã', amount: '1.070' },
  { date: '04 Abr', item: 'Boleto', detail: 'Título compensado com atraso', amount: '14.500' },
  { date: '05 Abr', item: 'Viagem', detail: 'Reembolso aprovado pelo time', amount: '634' },
  { date: '06 Abr', item: 'Serviço', detail: 'Nota revisada antes do envio', amount: '710' },
  { date: '07 Abr', item: 'Impostos', detail: 'Guia aguardando confirmação', amount: '-56' },
  { date: '08 Abr', item: 'Projeto', detail: 'Parcela bloqueada até aceite', amount: '1.000' },
  { date: '09 Abr', item: 'Venda', detail: 'Repasse parcial para conciliar', amount: '5.880' },
  { date: '10 Abr', item: 'Ajuste', detail: 'Diferença pequena em aberto', amount: '-120' },
]

const tableStressScenarios = [
  {
    key: 'table-two-pending',
    title: 'Pendências',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: pendingPaymentColumns,
    rows: pendingPaymentRows,
  },
  {
    key: 'table-review-queue',
    title: 'Revisões abertas',
    subtitle: chartPeriod,
    columns: reviewColumns,
    rows: reviewRows,
  },
  {
    key: 'table-scheduled-inflows',
    title: 'Entradas previstas',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: scheduledInflowColumns,
    rows: scheduledInflowRows,
  },
  {
    key: 'table-reconciliation',
    title: 'Conciliação',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: reconciliationColumns,
    rows: reconciliationRows,
  },
  {
    key: 'table-account-summary',
    title: 'Resumo por conta',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: accountCashFlowColumns,
    rows: accountCashFlowRows,
  },
  {
    key: 'table-max-transactions',
    title: 'Transações recentes',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: maxTransactionColumns,
    rows: maxTransactionRows,
  },
  {
    key: 'table-mixed-density',
    title: 'Fechamento por área',
    subtitle: chartPeriod,
    columns: mixedDensityColumns,
    rows: mixedDensityRows,
    maxRows: 8,
  },
  {
    key: 'table-two-line-content',
    title: 'Lançamentos com detalhe',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: longNoteColumns,
    rows: longNoteRows,
    maxRows: 7,
  },
  {
    key: 'table-two-line-over-limit',
    title: 'Lançamentos revisados',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: longNoteColumns,
    rows: overLimitTwoLineRows,
    maxRows: 7,
  },
  {
    key: 'table-six-column-long-headings',
    title: 'Conciliação detalhada',
    titleSuperscript: '(R$)',
    subtitle: chartPeriod,
    columns: detailedReconciliationColumns,
    rows: detailedReconciliationRows,
    maxRows: 5,
  },
] satisfies TableStressScenario[]

const weeklyCashFlows = [
  { label: 'Semana 1', inflow: 2500, outflow: 1200, inflowLabel: '2.5k', outflowLabel: '-1.2k' },
  { label: 'Semana 2', inflow: 3200, outflow: 1500, inflowLabel: '3.2k', outflowLabel: '-1.5k' },
  { label: 'Semana 3', inflow: 1800, outflow: 1100, inflowLabel: '1.8k', outflowLabel: '-1.1k' },
  { label: 'Semana 4', inflow: 2900, outflow: 1400, inflowLabel: '2.9k', outflowLabel: '-1.4k' },
]

type PieStressLayout = 'split' | 'bottom-left'
type ChartStressScaleMode = 'normal' | 'exponential'
type FlowStressLabel = string | string[]

interface PointStressLabel {
  index: number
  label: string
}

interface PieStressScenario {
  key: string
  title: string
  subtitle: string
  timeframe?: string
  labels: string[]
  values: number[]
  layout?: PieStressLayout
}

interface LineStressScenario {
  key: string
  title: string
  subtitle: string
  timeframe?: string
  labels: Array<string | number>
  values: number[]
  pointLabels: PointStressLabel[]
  labelEvery: number
  guideLineCount?: number
  scaleMode?: ChartStressScaleMode
}

interface BarStressScenario {
  key: string
  title: string
  subtitle: string
  timeframe?: string
  labels: Array<string | number>
  values: number[]
  valueLabels: string[]
  labelEvery: number
  scaleMode?: ChartStressScaleMode
}

interface FlowStressDatum {
  label: FlowStressLabel
  inflow: number
  outflow: number
  inflowLabel: string
  outflowLabel: string
}

interface FlowStressScenario {
  key: string
  title: string
  subtitle: string
  timeframe?: string
  items: FlowStressDatum[]
}

type TableCardAlign = 'left' | 'center' | 'right'

interface TableStressColumn {
  key: string
  label: string
  align?: TableCardAlign
  width?: string
  gapBefore?: boolean | 'small'
}

interface TableStressRow {
  [key: string]: string | number | null | undefined
}

interface TableStressScenario {
  key: string
  title: string
  titleSuperscript?: string
  subtitle: string
  columns: TableStressColumn[]
  rows: TableStressRow[]
  footerLabel?: string
  maxRows?: number
}

type StackedBarDirection = 'positive' | 'negative'

interface StackedBarStressCategory {
  key: string
  label: string
  color: string
  direction?: StackedBarDirection
}

interface StackedBarStressDatum {
  label: FlowStressLabel
  values: Record<string, number>
}

interface StackedBarStressScenario {
  key: string
  title: string
  subtitle: string
  timeframe?: string
  categories: StackedBarStressCategory[]
  items: StackedBarStressDatum[]
  labelEvery?: number
  showSectionValueLabels?: boolean
}

function stripCompactZeros(value: string) {
  return value.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')
}

function compactStressValue(value: number) {
  if (!Number.isFinite(value)) return '0'

  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)

  if (abs === 0) return '0'
  if (abs >= 1_000_000) return `${sign}${stripCompactZeros((abs / 1_000_000).toFixed(2))}m`
  if (abs >= 1_000) return `${sign}${stripCompactZeros((abs / 1_000).toFixed(2))}k`
  if (abs >= 100) return `${sign}${Math.round(abs)}`
  if (abs >= 10) return `${sign}${stripCompactZeros(abs.toFixed(1))}`
  return `${sign}${stripCompactZeros(abs.toFixed(2))}`
}

function makeDayLabels(count: number, month = '04') {
  return Array.from({ length: count }, (_, index) => `${String(index + 1).padStart(2, '0')}/${month}`)
}

function pieLayoutForCount(count: number): PieStressLayout {
  return count <= 4 ? 'bottom-left' : 'split'
}

function scenarioTimeframe(scenario: { timeframe?: string }) {
  return scenario.timeframe ?? chartPeriod
}

function minValueIndex(values: number[]) {
  return values.reduce((bestIndex, value, index) => value < values[bestIndex] ? index : bestIndex, 0)
}

function maxValueIndex(values: number[]) {
  return values.reduce((bestIndex, value, index) => value > values[bestIndex] ? index : bestIndex, 0)
}

function pointLabelsForExtremes(values: number[], extraIndices: number[] = []): PointStressLabel[] {
  if (values.length === 0) return []

  const orderedIndices = [
    0,
    values.length - 1,
    minValueIndex(values),
    maxValueIndex(values),
    ...extraIndices,
  ]
  const uniqueIndices = [...new Set(orderedIndices)]
    .filter((index) => index >= 0 && index < values.length)

  return uniqueIndices.map((index) => ({
    index,
    label: compactStressValue(values[index] ?? 0),
  }))
}

function valueLabelsFor(values: number[]) {
  return values.map((value) => compactStressValue(value))
}

function flowItem(label: FlowStressLabel, inflow: number, outflow: number): FlowStressDatum {
  return {
    label,
    inflow,
    outflow,
    inflowLabel: compactStressValue(inflow),
    outflowLabel: outflow === 0 ? '0' : `-${compactStressValue(outflow)}`,
  }
}

function stackItem(label: FlowStressLabel, values: Record<string, number>): StackedBarStressDatum {
  return { label, values }
}

function stackedLegendItems(categories: StackedBarStressCategory[]) {
  return categories.slice(0, 6).map((category) => ({
    label: category.label,
    color: category.color,
  }))
}

function barWidthRule(pointCount: number) {
  if (pointCount <= 4) return '48px de largura'
  if (pointCount <= 8) return '32px de largura'
  if (pointCount <= 12) return '24px de largura'
  if (pointCount <= 16) return '16px de largura'
  return '8px de largura'
}

function baselineLabelRule(pointCount: number, labelEvery = 1) {
  if (pointCount >= 25) return 'eixo X mostra um Label a cada 3 pontos'
  if (pointCount >= 16) return 'eixo X mostra Labels alternados'
  if (labelEvery <= 1) return 'eixo X mostra todos os Labels'
  return `eixo X mostra um Label a cada ${labelEvery} pontos`
}

function pointLabelRule(pointCount: number) {
  if (pointCount >= 25) return 'Labels de valor aparecem a cada 3 pontos'
  if (pointCount >= 16) return 'Labels de valor aparecem em pontos alternados'
  return 'Labels de valor aparecem em todos os pontos'
}

const commonChartDocs = [
  'Card base: 600px por 600px, padding interno de 32px e raio de 24px.',
  'Em telas menores, o card inteiro reduz por escala proporcional e mantém a proporção quadrada.',
  'Layout da página: grupos usam 2 colunas; quando 2 colunas não cabem, viram 1 coluna.',
  'Área interna base: 536px de largura, header de 48px, canvas de 428px e footer de 12px.',
  'Espaços fixos: 32px entre header e canvas; 16px entre canvas e footer.',
  'Heading: título e subtítulo em Aeonik Medium 26px. Título em #111, y -6px; subtítulo em #8a8a8a, y 24px; superscript 14px.',
  'Labels dos charts: Aeonik Regular 22px. Footer e legendas externas: 12px.',
  'Canvas não tem padding lateral próprio; cada chart define a área de plotagem dentro dele.',
  'Área de plotagem cartesiana: 32px à esquerda e 8px à direita. Data points respeitam essa margem; o desenho pode chegar ao limite do canvas.',
  'Barras de 9+ pontos somam meia barra no cálculo horizontal para não cortar primeira e última barra.',
  'Labels do eixo X: seção mínima de 16px, line-height 100% e distância de 5px acima/abaixo da baseline.',
  'Frequência dos Labels do eixo X: até 15 pontos segue o cenário; de 16 a 24 alterna; de 25 a 30 aparece a cada 3 pontos.',
  'Guias pontilhadas: mínimo de 4, máximo de 10. Guias e baseline ficam atrás; gráficos e Labels ficam na frente.',
  'Escala normal é o padrão. Escala exponencial só entra quando valores muito pequenos e muito grandes precisam aparecer juntos.',
] as const

const chartGroupDocs = {
  pie: [
    'Fatias seguem a ordem dos dados e a progressão oficial da paleta.',
    'Fatias não têm espaçamento entre elas.',
    'Legenda mostra nomes completos, sem abreviar nem truncar.',
    'Até 4 categorias: pizza centralizada no card e legenda embaixo.',
    'Mais de 4 categorias: layout 50/50, pizza à esquerda e lista de legenda à direita.',
    'Categoria única continua com legenda; não esconda o nome só porque não existe comparação.',
    'Valores empatados preservam ordem e fatias iguais; não reordene por tamanho.',
  ],
  line: [
    'Até 30 pontos na horizontal.',
    'Linha sempre laranja, curva e com marcador em todos os pontos.',
    'Labels de valor aparecem em todos os pontos até 15; de 16 a 24 alternam; de 25 a 30 aparecem a cada 3 pontos.',
    'Primeiro e último ponto continuam com Label quando a frequência é reduzida.',
    'Labels de valor usam 8 posições ao redor do ponto: left, left-top, top, right-top, right, right-bottom, bottom e left-bottom.',
    'A posição do Label precisa evitar cruzar a curva, encostar nos guias ou colidir com outros Labels.',
  ],
  bar: [
    'Mínimo de 1 barra e máximo de 30 pontos horizontais.',
    'Até 24 pontos usa barras; de 25 a 30 vira linha.',
    'Larguras: 1-4 = 48px, 5-8 = 32px, 9-12 = 24px, 13-16 = 16px, 17+ = 8px.',
    'Com até 8 barras, o grupo fica centralizado.',
    'No agrupamento central, o espaço entre barras mira 2x a largura da barra.',
    'Labels de valor ficam fora da barra: positivos acima; negativos e zeros junto da base correta.',
    'Barra única não ocupa a largura inteira: fica centralizada com 48px.',
    'Quando valores extremos exigem escala exponencial, mantenha Labels externos e baseline estável.',
  ],
  stacked: [
    'Até 6 categorias visíveis por barra.',
    'Footer mostra até 6 itens de legenda, na mesma ordem dos segmentos.',
    'Cores sempre seguem a sequência oficial da paleta.',
    'Usa as mesmas larguras e o mesmo agrupamento central das barras simples.',
    'Por padrão, mostra o total positivo acima da pilha e o total negativo abaixo da base.',
    'Labels por seção só aparecem quando o chart tem até 4 barras.',
    'Quando ativos, os Labels por seção ficam à direita de cada segmento e substituem os totais.',
    'Categorias positivas sobem da baseline.',
    'Categorias negativas descem da baseline.',
    'Stacks com seis seções são válidos em uma barra e precisam mostrar as seis legendas.',
    'Stacks mistos mantêm positivo e negativo presos no mesmo eixo X.',
  ],
  flow: [
    'Entradas sempre em amarelo; saídas sempre em coral.',
    'Mínimo de 1 conta e máximo de 30 pontos horizontais.',
    'Usa as mesmas larguras e o mesmo agrupamento central das barras simples.',
    'Entradas sobem da baseline; saídas descem da baseline.',
    'Labels de entrada ficam acima da barra; Labels de saída ficam abaixo.',
    'Zeros ficam fora da barra, junto da baseline correta.',
    'Quando só existe entrada ou só saída, o lado vazio mostra zero fora da barra.',
    'Quando um lado domina a escala, o lado pequeno continua visível com Label externo.',
  ],
  auxiliary: [
    'Tabelas e valores usam o mesmo card de 600px, mas não seguem regras de plotagem.',
    'TableCard remove o gap do footer e expande o canvas para 444px para caber os limites de rows.',
    'Um único dado deve virar card de valor grande, não tabela.',
    'Use tabela quando a leitura depende de linhas, datas, status, descrições ou valores exatos por item.',
    'Rows de uma linha: até 10 rows por card. Acima disso, divida, filtre ou pagine.',
    'Rows mistas, com algumas quebras em duas linhas: use até 8 rows.',
    'Rows de duas linhas: limite prático de 7 rows, porque cada row fica mais alta.',
    'Suporta de 2 a 6 colunas; larguras devem ser explícitas ou em frações para evitar disputa entre textos.',
    'Padding vertical da linha: 12px em cima e 12px embaixo no header e no corpo.',
    'Espaço entre grupos de colunas: 16px.',
    'Conteúdo pode quebrar em até 2 linhas; não force terceira linha dentro do card.',
    'Rows não esticam para preencher o canvas; a sobra fica vazia no fim da tabela.',
    'Fonte da tabela: Aeonik Regular 14px; header em Aeonik Medium 14px; line-height 102%.',
    'Clamp de conteúdo: até 2 linhas, sem max-height manual para não cortar glyphs.',
    'Bordas horizontais têm 1px; o último row também mantém a borda inferior.',
    'Valores financeiros usam alinhamento à direita e tabular nums. Textos e status ficam à esquerda.',
  ],
} as const

function pieCaseDescription(scenario: PieStressScenario) {
  const notes: Record<string, string> = {
    'pie-single-category': 'Uma categoria só: pizza centralizada e legenda visível para preservar o nome do dado.',
    'pie-current-four-categories': 'Quatro categorias: último caso do layout compacto, com legenda embaixo.',
    'pie-tiny-vs-large': 'Fatia minúscula vs valor alto: a fatia pode ficar quase invisível, mas a legenda continua completa.',
    'pie-balanced': 'Valores empatados: fatias iguais, ordem original e mesma progressão de cores.',
    'pie-average-case': 'Cinco categorias: primeiro caso que muda para 50/50, dando espaço real para a lista lateral.',
    'pie-current-seven-categories': 'Sete categorias: lista lateral evita truncar nomes e mantém leitura sequencial.',
    'pie-many-categories': 'Doze categorias: força a paleta completa e a legenda inteira, sem abreviar categorias.',
  }

  return notes[scenario.key] ?? `${scenario.labels.length} categorias: mantém a ordem da legenda e a progressão de cores.`
}

function lineCaseDescription(scenario: LineStressScenario) {
  const pointCount = scenario.values.length
  const notes: Record<string, string> = {
    'line-two-point-rise': 'Dois pontos com mínimo à esquerda e máximo à direita: prende Labels nas pontas sem cortar.',
    'line-two-point-fall': 'Dois pontos com máximo à esquerda e mínimo à direita: mesma regra de pontas, só invertendo a direção da curva.',
    'line-tiny-values': 'Zeros e centavos: escala normal, 4 guias e Labels pequenos ainda visíveis.',
    'line-flat-values': 'Tudo empatado: cria respiro no eixo Y para a linha não ficar colada.',
    'line-zig-zag': 'Zig-zag forte: Labels usam posições diferentes para não cruzar a curva.',
    'line-million-outlier': 'Pico milionário: usa escala exponencial para valores baixos continuarem legíveis junto do pico.',
    'line-average-case': 'Caso médio: escala normal, curva estável e Labels só nos pontos principais.',
    'line-current-month': 'Dados atuais misturam centavos e 22.2k: escala exponencial segura a diferença sem esconder pontos baixos.',
    'line-twenty-points': '20 pontos: mantém todos os marcadores, mas alterna Labels para evitar congestionamento.',
    'line-dense-month': '30 pontos: mantém todos os marcadores e mostra Labels a cada 3 pontos.',
  }

  return notes[scenario.key] ?? `${pointCount} pontos: ${pointLabelRule(pointCount)} e ${baselineLabelRule(pointCount, scenario.labelEvery)}.`
}

function barCaseDescription(scenario: BarStressScenario) {
  const pointCount = scenario.values.length
  const notes: Record<string, string> = {
    'bar-dense-month': '30 pontos: passa para line chart porque barras acima de 24 pontos ficam espremidas.',
    'bar-single': 'Um ponto: barra centralizada com 48px, sem inventar espaçamento fake.',
    'bar-two-point-rise': 'Dois pontos, mínimo à esquerda e máximo à direita: usa 48px, grupo centralizado e escala exponencial.',
    'bar-two-point-fall': 'Dois pontos, máximo à esquerda e mínimo à direita: mantém largura, grupo centralizado e só inverte a leitura.',
    'bar-flat-values': 'Valores empatados: escala normal e Labels acima das barras sem deslocar a baseline.',
    'bar-tiny-values': 'Zeros e centavos: Labels ficam fora da barra mesmo quando a altura é mínima.',
    'bar-million-outlier': 'Barra máxima isolada: escala exponencial evita que o resto vire ruído.',
    'bar-ten-days': '10 dias: cai na faixa de 24px e ainda mostra Labels de eixo completos.',
    'bar-average-case': '14 dias: usa 16px e começa a reduzir a densidade dos Labels do eixo.',
    'bar-current-month': '21 pontos: usa 8px e alterna Labels do eixo para manter leitura.',
  }

  return notes[scenario.key] ?? `${pointCount} pontos: usa ${barWidthRule(pointCount)} e ${baselineLabelRule(pointCount, scenario.labelEvery)}.`
}

function stackedCaseDescription(scenario: StackedBarStressScenario) {
  const pointCount = scenario.items.length
  const notes: Record<string, string> = {
    'stack-positive-single': 'Uma barra: segmentos pequenos continuam presentes e a legenda carrega a leitura de categorias.',
    'stack-positive-six-sections': 'Uma barra com seis seções: todos os segmentos aparecem e o footer mostra as 6 legendas.',
    'stack-positive-average': 'Caso médio: quatro semanas, quatro categorias, leitura completa sem compactar demais.',
    'stack-positive-section-labels': 'Quatro barras: mostra o valor de cada seção à direita do segmento e remove o total do topo.',
    'stack-positive-balanced': 'Totais empatados: mantém a ordem das categorias, sem reordenar por valor.',
    'stack-positive-ten-days': '10 dias: usa 24px e ainda deixa o eixo X completo.',
    'stack-positive-dense': '20 dias: usa 8px e reduz os Labels do eixo.',
    'stack-mixed-single': 'Entrada e saída na mesma barra: positivo sobe e negativo desce no mesmo eixo X.',
    'stack-mixed-six-sections': 'Uma barra mista com seis seções: três sobem, três descem e todas entram na legenda.',
    'stack-mixed-average': 'Caso médio misto: eixo zero fica como referência central da comparação.',
    'stack-mixed-section-labels': 'Quatro barras mistas: cada seção positiva ou negativa recebe seu próprio Label à direita.',
    'stack-mixed-out-dominant': 'Saída dominante: domínio negativo cresce sem apagar segmentos positivos pequenos.',
    'stack-mixed-sixteen-days': '16 dias: última faixa antes das barras de 8px, com leitura alternada.',
    'stack-mixed-symmetric': 'Extremos simétricos: preserva a mesma distância acima e abaixo da baseline.',
    'stack-mixed-dense': '20 dias mistos: barras de 8px, positivo e negativo presos no mesmo eixo X.',
  }

  return notes[scenario.key] ?? `${pointCount} barras: usa ${barWidthRule(pointCount)} e ${baselineLabelRule(pointCount, scenario.labelEvery ?? 1)}.`
}

function flowCaseDescription(scenario: FlowStressScenario) {
  const pointCount = scenario.items.length
  const notes: Record<string, string> = {
    'flow-single-in': 'Só entrada: barra positiva sobe e o zero de saída fica fora da barra, abaixo da baseline.',
    'flow-single-out': 'Só saída: barra negativa desce e o zero de entrada fica fora da barra, junto da baseline.',
    'flow-tiny-huge': 'Centavos vs milhão: mantém Labels externos para o valor pequeno não sumir.',
    'flow-symmetric': 'Entradas e saídas iguais: espelha a distância dos dois lados da base.',
    'flow-average-case': 'Caso médio: compara quatro contas, mantém baseline central e escala normal.',
    'flow-weekly': 'Semanas: Labels curtos e legenda simples deixam entrada/saída fáceis de comparar.',
    'flow-in-dominant': 'Entrada dominante: eixo positivo cresce sem esconder saída pequena.',
    'flow-out-dominant': 'Saída dominante: eixo negativo cresce sem apagar entrada pequena.',
    'flow-current-accounts': 'Sete contas atuais: Labels podem quebrar linha, mas não abreviam a legenda.',
    'flow-dense-accounts': '12 contas: usa 24px e mantém Labels, barras positivas e barras negativas presos ao mesmo ponto no eixo.',
  }

  return notes[scenario.key] ?? `${pointCount} contas: usa ${barWidthRule(pointCount)} e ${baselineLabelRule(pointCount)}.`
}

function tableCaseDescription(scenario: TableStressScenario) {
  const rowCount = scenario.rows.length
  const columnCount = scenario.columns.length
  const notes: Record<string, string> = {
    'table-two-pending': 'Mínimo de tabela: 2 rows com status. Melhor que gráfico porque prioridade e vencimento importam mais que forma.',
    'table-review-queue': 'Baixo volume: 3 rows curtas, sem códigos técnicos, para acompanhar responsabilidade e estado.',
    'table-scheduled-inflows': '4 rows e 5 colunas: datas, contraparte e descrição precisam ficar juntos para conferência.',
    'table-reconciliation': '5 rows e 6 colunas: reconciliação pede data, canal, valor esperado, valor liquidado, diferença e status.',
    'table-account-summary': '6 rows e 3 colunas: nomes amigáveis de conta e entradas/saídas exatas são mais importantes que comparação visual.',
    'table-max-transactions': 'Máximo de rows simples: 10 rows com padding vertical de 12px por lado, sem esticar para preencher o card.',
    'table-mixed-density': 'Rows mistas: quando só parte do conteúdo quebra em duas linhas, o card limita em 8 rows.',
    'table-two-line-content': 'Rows de duas linhas: com o mesmo padding de 12px, o limite cai para 7 rows.',
    'table-two-line-over-limit': 'Fonte com 10 itens, mas renderização limitada a 7 rows porque todos os detalhes ocupam duas linhas.',
    'table-six-column-long-headings': 'Seis colunas com headings completos: header pode quebrar em duas linhas, sem abreviar texto.',
  }

  return notes[scenario.key] ?? `${rowCount} rows e ${columnCount} colunas: use tabela quando a leitura depende do detalhe de cada item.`
}

const stackedPositiveCategories = [
  { key: 'pix', label: 'Pix', color: categoryColor(0) },
  { key: 'card', label: 'Cartão', color: categoryColor(1) },
  { key: 'boleto', label: 'Boleto', color: categoryColor(2) },
  { key: 'other', label: 'Outros', color: categoryColor(3) },
] satisfies StackedBarStressCategory[]

const stackedPositiveSixCategories = [
  { key: 'pix', label: 'Pix', color: categoryColor(0) },
  { key: 'card', label: 'Cartão', color: categoryColor(1) },
  { key: 'boleto', label: 'Boleto', color: categoryColor(2) },
  { key: 'ted', label: 'TED', color: categoryColor(3) },
  { key: 'fees', label: 'Juros', color: categoryColor(4) },
  { key: 'other', label: 'Outros', color: categoryColor(5) },
] satisfies StackedBarStressCategory[]

const stackedMixedCategories = [
  { key: 'sales', label: 'Venda', color: categoryColor(0), direction: 'positive' },
  { key: 'services', label: 'Serviços', color: categoryColor(1), direction: 'positive' },
  { key: 'card', label: 'Cartão', color: categoryColor(2), direction: 'negative' },
  { key: 'taxes', label: 'Taxas', color: categoryColor(3), direction: 'negative' },
] satisfies StackedBarStressCategory[]

const stackedMixedSixCategories = [
  { key: 'sales', label: 'Venda', color: categoryColor(0), direction: 'positive' },
  { key: 'services', label: 'Serviços', color: categoryColor(1), direction: 'positive' },
  { key: 'yield', label: 'Juros', color: categoryColor(2), direction: 'positive' },
  { key: 'card', label: 'Cartão', color: categoryColor(3), direction: 'negative' },
  { key: 'taxes', label: 'Taxas', color: categoryColor(4), direction: 'negative' },
  { key: 'refunds', label: 'Estornos', color: categoryColor(5), direction: 'negative' },
] satisfies StackedBarStressCategory[]

const stackedPositiveAverageItems = [
  stackItem('Sem. 1', { pix: 8200, card: 6400, boleto: 3100, other: 1200 }),
  stackItem('Sem. 2', { pix: 9100, card: 7200, boleto: 2800, other: 1500 }),
  stackItem('Sem. 3', { pix: 7800, card: 6900, boleto: 3300, other: 980 }),
  stackItem('Sem. 4', { pix: 9600, card: 7600, boleto: 3600, other: 1700 }),
]

const stackedPositiveSectionLabelItems = [
  stackItem('Sem. 1', { pix: 6800, card: 4300, boleto: 2700, other: 1800 }),
  stackItem('Sem. 2', { pix: 7900, card: 5100, boleto: 3100, other: 2200 }),
  stackItem('Sem. 3', { pix: 6200, card: 4700, boleto: 3400, other: 1600 }),
  stackItem('Sem. 4', { pix: 8600, card: 5600, boleto: 2900, other: 2400 }),
]

const stackedPositiveSixSectionItems = [
  stackItem('Abril', {
    pix: 22000,
    card: 18000,
    boleto: 14500,
    ted: 11200,
    fees: 8400,
    other: 6100,
  }),
]

const stackedMixedAverageItems = [
  stackItem('Sem. 1', { sales: 14200, services: 5200, card: 6800, taxes: 2100 }),
  stackItem('Sem. 2', { sales: 15800, services: 6100, card: 7200, taxes: 2400 }),
  stackItem('Sem. 3', { sales: 13600, services: 5600, card: 6400, taxes: 1900 }),
  stackItem('Sem. 4', { sales: 17100, services: 6800, card: 7900, taxes: 2600 }),
]

const stackedMixedSectionLabelItems = [
  stackItem('Sem. 1', { sales: 11200, services: 4200, card: 5200, taxes: 1600 }),
  stackItem('Sem. 2', { sales: 12600, services: 5100, card: 6100, taxes: 1900 }),
  stackItem('Sem. 3', { sales: 9800, services: 4700, card: 5600, taxes: 1400 }),
  stackItem('Sem. 4', { sales: 13900, services: 5800, card: 6900, taxes: 2300 }),
]

const stackedMixedSixSectionItems = [
  stackItem('Abril', {
    sales: 26000,
    services: 14200,
    yield: 7200,
    card: 16400,
    taxes: 9800,
    refunds: 5200,
  }),
]

const stackedPositiveTenItems = Array.from({ length: 10 }, (_, index) => {
  const day = index + 1

  return stackItem(`${String(day).padStart(2, '0')}/04`, {
    pix: 4200 + index * 360,
    card: day % 3 === 0 ? 8800 : 2600 + index * 180,
    boleto: day % 4 === 0 ? 0.22 : 1400 + index * 120,
    other: day % 5 === 0 ? 7600 : 480 + index * 45,
  })
})

const stackedPositiveDenseItems = Array.from({ length: 20 }, (_, index) => {
  const day = index + 1

  return stackItem(`${String(day).padStart(2, '0')}/04`, {
    pix: index === 0 ? 0.01 : index === 11 ? 1200000 : day % 5 === 0 ? 30300 : 1200 + index * 84,
    card: index === 3 ? 0 : index === 17 ? 79000 : day % 3 === 0 ? 8800 : 320,
    boleto: index === 7 ? 0.22 : index === 19 ? 43000 : day % 4 === 0 ? 120 : 2400,
    other: index === 14 ? 2.5 : day % 6 === 0 ? 16000 : 76,
  })
})

const stackedMixedSymmetricItems = Array.from({ length: 20 }, (_, index) => {
  const day = index + 1
  const total = index === 0
    ? 0.22
    : index === 9
      ? 120000
      : index === 15
        ? 30300
        : day % 5 === 0
          ? 17000
          : 2500 + index * 430
  const positivePrimary = total * (day % 2 === 0 ? 0.7 : 0.42)
  const negativePrimary = total * (day % 3 === 0 ? 0.18 : 0.65)

  return stackItem(`${String(day).padStart(2, '0')}/04`, {
    sales: positivePrimary,
    services: total - positivePrimary,
    card: negativePrimary,
    taxes: total - negativePrimary,
  })
})

const stackedMixedSixteenItems = Array.from({ length: 16 }, (_, index) => {
  const day = index + 1

  return stackItem(`${String(day).padStart(2, '0')}/04`, {
    sales: index === 6 ? 30300 : 5200 + index * 510,
    services: index === 11 ? 0.22 : day % 4 === 0 ? 7100 : 1800 + index * 160,
    card: index === 2 ? 28200 : day % 5 === 0 ? 16600 : 2600 + index * 190,
    taxes: index === 13 ? 2.5 : day % 6 === 0 ? 4800 : 900 + index * 80,
  })
})

const stackedMixedDenseItems = Array.from({ length: 20 }, (_, index) => {
  const day = index + 1

  return stackItem(`${String(day).padStart(2, '0')}/04`, {
    sales: index === 0 ? 0 : index === 9 ? 120000 : day % 4 === 0 ? 30300 : 1300 + index * 210,
    services: index === 5 ? 0.22 : index === 16 ? 92000 : day % 6 === 0 ? 7100 : 480,
    card: index === 2 ? 0.01 : index === 15 ? 160000 : day % 5 === 0 ? 28200 : 950 + index * 115,
    taxes: index === 18 ? 90000 : day % 7 === 0 ? 16600 : index === 12 ? 0 : 55.8,
  })
})

const stackedBarStressScenarios = [
  {
    key: 'stack-positive-single',
    title: 'Receita por canal',
    subtitle: 'Uma barra, 4 partes',
    categories: stackedPositiveCategories,
    items: [
      stackItem('Abril', { pix: 80600, card: 0.22, boleto: 13400, other: 2.5 }),
    ],
    labelEvery: 1,
  },
  {
    key: 'stack-positive-six-sections',
    title: 'Receita por canal',
    subtitle: 'Uma barra, 6 seções',
    categories: stackedPositiveSixCategories,
    items: stackedPositiveSixSectionItems,
    labelEvery: 1,
    showSectionValueLabels: true,
  },
  {
    key: 'stack-positive-average',
    title: 'Receita por canal',
    subtitle: 'Caso médio',
    categories: stackedPositiveCategories,
    items: stackedPositiveAverageItems,
    labelEvery: 1,
  },
  {
    key: 'stack-positive-section-labels',
    title: 'Receita por canal',
    subtitle: 'Valores por seção',
    categories: stackedPositiveCategories,
    items: stackedPositiveSectionLabelItems,
    labelEvery: 1,
    showSectionValueLabels: true,
  },
  {
    key: 'stack-positive-balanced',
    title: 'Receita por canal',
    subtitle: 'Totais empatados',
    categories: stackedPositiveCategories,
    items: [
      stackItem('Sem. 1', { pix: 2500, card: 2500, boleto: 2500, other: 2500 }),
      stackItem('Sem. 2', { pix: 4000, card: 2000, boleto: 3000, other: 1000 }),
      stackItem('Sem. 3', { pix: 1000, card: 3000, boleto: 2000, other: 4000 }),
      stackItem('Sem. 4', { pix: 2000, card: 1000, boleto: 4000, other: 3000 }),
    ],
    labelEvery: 1,
  },
  {
    key: 'stack-positive-ten-days',
    title: 'Receita por canal',
    subtitle: '10 dias, largura média',
    categories: stackedPositiveCategories,
    items: stackedPositiveTenItems,
    labelEvery: 1,
  },
  {
    key: 'stack-positive-dense',
    title: 'Receita por canal',
    subtitle: '20 dias com extremos',
    categories: stackedPositiveCategories,
    items: stackedPositiveDenseItems,
    labelEvery: 3,
  },
  {
    key: 'stack-mixed-single',
    title: 'Resultado por origem',
    subtitle: 'Entrada e saída na mesma barra',
    categories: stackedMixedCategories,
    items: [
      stackItem('Abril', { sales: 120000, services: 0.22, card: 28200, taxes: 2.5 }),
    ],
    labelEvery: 1,
  },
  {
    key: 'stack-mixed-six-sections',
    title: 'Resultado por origem',
    subtitle: 'Uma barra, 6 seções',
    categories: stackedMixedSixCategories,
    items: stackedMixedSixSectionItems,
    labelEvery: 1,
    showSectionValueLabels: true,
  },
  {
    key: 'stack-mixed-average',
    title: 'Resultado por origem',
    subtitle: 'Caso médio',
    categories: stackedMixedCategories,
    items: stackedMixedAverageItems,
    labelEvery: 1,
  },
  {
    key: 'stack-mixed-section-labels',
    title: 'Resultado por origem',
    subtitle: 'Valores por seção',
    categories: stackedMixedCategories,
    items: stackedMixedSectionLabelItems,
    labelEvery: 1,
    showSectionValueLabels: true,
  },
  {
    key: 'stack-mixed-out-dominant',
    title: 'Resultado por origem',
    subtitle: 'Saída domina o eixo',
    categories: stackedMixedCategories,
    items: [
      stackItem('01/04', { sales: 1200, services: 55.8, card: 1200000, taxes: 634 }),
      stackItem('02/04', { sales: 17000, services: 7100, card: 28200, taxes: 16600 }),
      stackItem('03/04', { sales: 0.22, services: 2.5, card: 16000, taxes: 55.8 }),
      stackItem('04/04', { sales: 9300, services: 4800, card: 0.01, taxes: 0 }),
      stackItem('05/04', { sales: 30300, services: 1070, card: 19500, taxes: 100 }),
      stackItem('06/04', { sales: 76, services: 0, card: 920000, taxes: 2.5 }),
      stackItem('07/04', { sales: 18800, services: 6100, card: 16600, taxes: 389 }),
      stackItem('08/04', { sales: 100, services: 1000, card: 0.22, taxes: 808 }),
    ],
    labelEvery: 1,
  },
  {
    key: 'stack-mixed-sixteen-days',
    title: 'Resultado por origem',
    subtitle: '16 dias, Labels alternados',
    categories: stackedMixedCategories,
    items: stackedMixedSixteenItems,
    labelEvery: 1,
  },
  {
    key: 'stack-mixed-symmetric',
    title: 'Resultado por origem',
    subtitle: 'Extremos simétricos',
    categories: stackedMixedCategories,
    items: stackedMixedSymmetricItems,
    labelEvery: 1,
  },
  {
    key: 'stack-mixed-dense',
    title: 'Resultado por origem',
    subtitle: '20 dias mistos',
    categories: stackedMixedCategories,
    items: stackedMixedDenseItems,
    labelEvery: 3,
  },
] satisfies StackedBarStressScenario[]

const lineDenseExtremes = [
  0.22,
  520,
  1070,
  18400,
  56.2,
  91,
  125,
  62.1,
  56.1,
  61000,
  56.3,
  55.6,
  5880,
  2.5,
  57.8,
  320,
  720,
  14700,
  1.15,
  16600,
  640,
  980,
  1200,
  17000,
  0.05,
  1300,
  980,
  31000,
  18.4,
  79000,
]

const lineZigZagExtremes = [32000, 6000, 28200, 900, 22200, 2.5, 17000, 400, 14500, 0.22]
const lineOutlierExtremes = [60, 68, 72, 66, 1250000, 71, 69, 65, 2.5, 70, 76]
const lineTinyExtremes = [0, 0.01, 0.22, 2.5, 0.06, 0.8, 0.03]
const lineFlatExtremes = [1200, 1200, 1200, 1200, 1200, 1200, 1200]
const lineAverageCase = [8400, 9100, 8800, 9700, 10400, 9900, 11200, 10800, 11800, 12100, 11600, 12700, 12300, 13200]
const lineEveryOtherCase = [
  6200,
  7100,
  6800,
  7900,
  8600,
  8200,
  9100,
  9700,
  9400,
  10400,
  11200,
  10800,
  12100,
  17600,
  12800,
  13400,
  13000,
  14200,
  13800,
  15100,
]

const lineStressScenarios = [
  {
    key: 'line-two-point-rise',
    title: 'Faturamento diário',
    subtitle: 'Min esquerda, max direita',
    labels: ['01/04', '30/04'],
    values: [0.22, 30300],
    pointLabels: pointLabelsForExtremes([0.22, 30300]),
    labelEvery: 1,
    guideLineCount: 6,
    scaleMode: 'exponential',
  },
  {
    key: 'line-two-point-fall',
    title: 'Faturamento diário',
    subtitle: 'Max esquerda, min direita',
    labels: ['01/04', '30/04'],
    values: [30300, 0.22],
    pointLabels: pointLabelsForExtremes([30300, 0.22]),
    labelEvery: 1,
    guideLineCount: 6,
    scaleMode: 'exponential',
  },
  {
    key: 'line-tiny-values',
    title: 'Faturamento diário',
    subtitle: 'Zeros e centavos',
    labels: makeDayLabels(lineTinyExtremes.length),
    values: lineTinyExtremes,
    pointLabels: pointLabelsForExtremes(lineTinyExtremes, [1, 3, 6]),
    labelEvery: 1,
    guideLineCount: 4,
    scaleMode: 'normal',
  },
  {
    key: 'line-flat-values',
    title: 'Faturamento diário',
    subtitle: 'Min e max empatados',
    labels: makeDayLabels(lineFlatExtremes.length),
    values: lineFlatExtremes,
    pointLabels: pointLabelsForExtremes(lineFlatExtremes),
    labelEvery: 1,
    guideLineCount: 5,
    scaleMode: 'normal',
  },
  {
    key: 'line-zig-zag',
    title: 'Faturamento diário',
    subtitle: 'Zig-zag alto e baixo',
    labels: makeDayLabels(lineZigZagExtremes.length),
    values: lineZigZagExtremes,
    pointLabels: pointLabelsForExtremes(lineZigZagExtremes, [2, 5, 7]),
    labelEvery: 1,
    guideLineCount: 7,
    scaleMode: 'exponential',
  },
  {
    key: 'line-million-outlier',
    title: 'Faturamento diário',
    subtitle: 'Pico milionário',
    labels: makeDayLabels(lineOutlierExtremes.length),
    values: lineOutlierExtremes,
    pointLabels: pointLabelsForExtremes(lineOutlierExtremes, [4, 8]),
    labelEvery: 2,
    guideLineCount: 6,
    scaleMode: 'exponential',
  },
  {
    key: 'line-average-case',
    title: 'Faturamento diário',
    subtitle: 'Caso médio',
    labels: makeDayLabels(lineAverageCase.length),
    values: lineAverageCase,
    pointLabels: pointLabelsForExtremes(lineAverageCase, [6, 10]),
    labelEvery: 2,
    guideLineCount: 6,
    scaleMode: 'normal',
  },
  {
    key: 'line-current-month',
    title: 'Faturamento diário',
    subtitle: 'Dados atuais, 15 pontos',
    labels: revenueLabels,
    values: dailyRevenue,
    pointLabels: revenueHighlights,
    labelEvery: 2,
    guideLineCount: 8,
    scaleMode: 'exponential',
  },
  {
    key: 'line-twenty-points',
    title: 'Faturamento diário',
    subtitle: '20 pontos, Labels alternados',
    labels: makeDayLabels(lineEveryOtherCase.length),
    values: lineEveryOtherCase,
    pointLabels: pointLabelsForExtremes(lineEveryOtherCase, [8, 13]),
    labelEvery: 2,
    guideLineCount: 6,
    scaleMode: 'normal',
  },
  {
    key: 'line-dense-month',
    title: 'Faturamento diário',
    subtitle: '30 pontos com extremos',
    labels: makeDayLabels(lineDenseExtremes.length),
    values: lineDenseExtremes,
    pointLabels: [],
    labelEvery: 3,
    guideLineCount: 8,
    scaleMode: 'exponential',
  },
] satisfies LineStressScenario[]

const barDenseExtremes = [
  284,
  216,
  0,
  250,
  14700,
  16600,
  59.6,
  14700,
  968,
  2.5,
  526,
  808,
  57.3,
  389,
  1160,
  1220,
  9690,
  883,
  17000,
  1300,
  16.3,
  0.12,
  30300,
  76,
  900,
  120000,
  45,
  1800,
  0.05,
  21000,
]
const barTinyExtremes = [0, 0.01, 0.22, 2.5, 16.3, 0.06, 0.8]
const barOutlierExtremes = [320, 410, 525, 1200000, 389, 216, 150]
const barFlatExtremes = [5000, 5000, 5000, 5000, 5000, 5000]
const barTenDayCase = [520, 860, 1240, 740, 1680, 2120, 980, 1440, 1880, 1160]
const barAverageCase = [720, 860, 640, 980, 1120, 790, 1340, 1180, 940, 1260, 1520, 1080, 890, 1410]

const barLineFallbackScenarios = [
  {
    key: 'bar-dense-month',
    title: 'Gastos diários',
    subtitle: '30 pontos com extremos',
    labels: makeDayLabels(barDenseExtremes.length),
    values: barDenseExtremes,
    valueLabels: valueLabelsFor(barDenseExtremes),
    labelEvery: 5,
    scaleMode: 'exponential',
  },
] satisfies BarStressScenario[]

const barStressScenarios = [
  {
    key: 'bar-single',
    title: 'Gastos diários',
    subtitle: 'Um ponto',
    labels: ['01/04'],
    values: [80600],
    valueLabels: valueLabelsFor([80600]),
    labelEvery: 1,
  },
  {
    key: 'bar-two-point-rise',
    title: 'Gastos diários',
    subtitle: 'Min esquerda, max direita',
    labels: ['01/04', '30/04'],
    values: [0.22, 28200],
    valueLabels: valueLabelsFor([0.22, 28200]),
    labelEvery: 1,
    scaleMode: 'exponential',
  },
  {
    key: 'bar-two-point-fall',
    title: 'Gastos diários',
    subtitle: 'Max esquerda, min direita',
    labels: ['01/04', '30/04'],
    values: [28200, 0.22],
    valueLabels: valueLabelsFor([28200, 0.22]),
    labelEvery: 1,
    scaleMode: 'exponential',
  },
  {
    key: 'bar-flat-values',
    title: 'Gastos diários',
    subtitle: 'Min e max empatados',
    labels: makeDayLabels(barFlatExtremes.length),
    values: barFlatExtremes,
    valueLabels: valueLabelsFor(barFlatExtremes),
    labelEvery: 1,
    scaleMode: 'normal',
  },
  {
    key: 'bar-tiny-values',
    title: 'Gastos diários',
    subtitle: 'Zeros e centavos',
    labels: makeDayLabels(barTinyExtremes.length),
    values: barTinyExtremes,
    valueLabels: valueLabelsFor(barTinyExtremes),
    labelEvery: 1,
    scaleMode: 'normal',
  },
  {
    key: 'bar-million-outlier',
    title: 'Gastos diários',
    subtitle: 'Barra máxima isolada',
    labels: makeDayLabels(barOutlierExtremes.length),
    values: barOutlierExtremes,
    valueLabels: valueLabelsFor(barOutlierExtremes),
    labelEvery: 1,
    scaleMode: 'exponential',
  },
  {
    key: 'bar-ten-days',
    title: 'Gastos diários',
    subtitle: '10 dias, largura média',
    labels: makeDayLabels(barTenDayCase.length),
    values: barTenDayCase,
    valueLabels: valueLabelsFor(barTenDayCase),
    labelEvery: 1,
    scaleMode: 'normal',
  },
  {
    key: 'bar-average-case',
    title: 'Gastos diários',
    subtitle: 'Caso médio',
    labels: makeDayLabels(barAverageCase.length),
    values: barAverageCase,
    valueLabels: valueLabelsFor(barAverageCase),
    labelEvery: 2,
    scaleMode: 'normal',
  },
  {
    key: 'bar-current-month',
    title: 'Gastos diários',
    subtitle: 'Dados atuais, 21 pontos',
    labels: spendingLabels,
    values: dailySpending,
    valueLabels: spendingValueLabels,
    labelEvery: 2,
  },
] satisfies BarStressScenario[]

const pieDisplayScenarios = [
  {
    key: 'pie-single-category',
    title: 'Distribuição de gastos',
    subtitle: 'Uma categoria',
    labels: ['Casa'],
    values: [80600],
    layout: 'bottom-left',
  },
  {
    key: 'pie-current-four-categories',
    title: 'Distribuição de gastos',
    subtitle: '4 categorias atuais',
    labels: categoryLabels,
    values: categoryValues,
  },
  {
    key: 'pie-tiny-vs-large',
    title: 'Distribuição de gastos',
    subtitle: 'Fatia mínima vs máxima',
    labels: ['Alimentação', 'Casa', 'Viagem', 'Outros'],
    values: [0.22, 80600, 134, 12.8],
  },
  {
    key: 'pie-balanced',
    title: 'Distribuição de gastos',
    subtitle: 'Min e max empatados',
    labels: ['Alimentação', 'Casa', 'Viagem', 'Outros'],
    values: [10000, 10000, 10000, 10000],
    layout: 'bottom-left',
  },
  {
    key: 'pie-average-case',
    title: 'Distribuição de gastos',
    subtitle: 'Caso médio',
    labels: ['Casa', 'Alimentação', 'Serviços', 'Transporte', 'Outros'],
    values: [24500, 18600, 11200, 7600, 4200],
  },
  {
    key: 'pie-current-seven-categories',
    title: 'Distribuição de gastos',
    subtitle: '7 categorias atuais',
    labels: splitCategoryLabels,
    values: splitCategoryValues,
  },
  {
    key: 'pie-many-categories',
    title: 'Distribuição de gastos',
    subtitle: '12 categorias',
    labels: [
      'Casa',
      'Viagem',
      'Alimentação',
      'Saúde',
      'Educação',
      'Lazer',
      'Mercado',
      'Transporte',
      'Serviços',
      'Impostos',
      'Assinaturas',
      'Outros',
    ],
    values: [28700, 21800, 16200, 9300, 7100, 4800, 3600, 2400, 990, 76, 2.5, 0.22],
  },
] satisfies PieStressScenario[]

const flowStressScenarios = [
  {
    key: 'flow-single-in',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Apenas entrada',
    items: [
      flowItem('Principal', 30300, 0),
    ],
  },
  {
    key: 'flow-single-out',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Apenas saída',
    items: [
      flowItem('Cartão', 0, 28200),
    ],
  },
  {
    key: 'flow-tiny-huge',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Centavos vs milhão',
    items: [
      flowItem('Viagens', 0.22, 634),
      flowItem('Principal', 1200000, 0.01),
      flowItem('Outros', 2.5, 920000),
    ],
  },
  {
    key: 'flow-symmetric',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Extremos simétricos',
    items: [
      flowItem('Principal', 30300, 30300),
      flowItem('Reserva', 17000, 17000),
      flowItem('Outros', 0.22, 0.22),
    ],
  },
  {
    key: 'flow-average-case',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Caso médio',
    items: [
      flowItem('Principal', 22400, 14800),
      flowItem('Reserva', 12800, 9300),
      flowItem('Viagens', 7600, 5200),
      flowItem('Outros', 2400, 1800),
    ],
  },
  {
    key: 'flow-weekly',
    title: 'Entradas vs Saídas',
    subtitle: 'Caso semanal',
    timeframe: 'Últimas 4 semanas',
    items: weeklyCashFlows,
  },
  {
    key: 'flow-in-dominant',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Entrada domina o eixo',
    items: [
      flowItem('Principal', 120000, 55.8),
      flowItem('Reserva', 30300, 19500),
      flowItem('Viagens', 1070, 634),
      flowItem('Outros', 2.5, 0.22),
    ],
  },
  {
    key: 'flow-out-dominant',
    title: 'Fluxo de caixa por conta',
    subtitle: 'Saída domina o eixo',
    items: [
      flowItem('Principal', 55.8, 120000),
      flowItem('Cartão', 17000, 28200),
      flowItem('Investimentos', 0, 16000),
      flowItem('Outros', 0.22, 2.5),
    ],
  },
  {
    key: 'flow-current-accounts',
    title: 'Fluxo de caixa por conta',
    subtitle: '7 contas atuais',
    items: bankFlows,
  },
  {
    key: 'flow-dense-accounts',
    title: 'Fluxo de caixa por conta',
    subtitle: '12 contas',
    items: [
      flowItem('Principal', 30300, 19500),
      flowItem('Cartão', 17000, 28200),
      flowItem('Reserva', 1070, 16600),
      flowItem('Investimentos', 0, 16000),
      flowItem('Viagens', 0.22, 634),
      flowItem('Impostos', 0, 55.8),
      flowItem('Outros', 0, 100),
      flowItem('Cliente Alfa', 100, 0),
      flowItem('Projeto Beta', 100, 2.5),
      flowItem('Cliente Davi', 1000, 0.22),
      flowItem('Serviços', 7100, 4800),
      flowItem('Vendas', 9300, 0),
    ],
  },
] satisfies FlowStressScenario[]
</script>

<template>
  <main class="charts-page" :style="chartsPageStyle">
    <h1 class="charts-page__title">
      Data Viz
    </h1>

    <div class="charts-page__groups">
      <section class="chart-group chart-group--system">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Specs
          </h2>
          <ul class="chart-group__list chart-group__list--palette-title">
            <li class="chart-group__item">
              Paleta oficial com 12 cores
            </li>
          </ul>
          <ol class="chart-palette" aria-label="Paleta oficial de cores">
            <li
              v-for="item in visualPalette"
              :key="item.color"
              class="chart-palette__item"
            >
              <span class="chart-palette__swatch" :style="{ backgroundColor: item.color }" />
              <span class="chart-palette__meta">
                <span class="chart-palette__name">{{ item.label }}</span>
                <span class="chart-palette__hex">{{ item.color }}</span>
              </span>
            </li>
          </ol>
          <ul class="chart-group__list">
            <li
              v-for="detail in commonChartDocs"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
            <li class="chart-group__item">
              Mais detalhes no
              <a
                class="chart-group__link"
                href="https://www.figma.com/design/yVuyIfuREocvDThv0DWa8i/J-%E2%80%94-Guth?node-id=1876-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Figma
              </a>
            </li>
          </ul>
        </header>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Pizza
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.pie"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div
            v-for="scenario in pieDisplayScenarios"
            :key="`pie-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartPie
                :labels="scenario.labels"
                :values="scenario.values"
                :colors="datavizColors.categories"
                :slice-spacing="datavizColors.pieSliceSpacing"
                :layout="scenario.layout ?? pieLayoutForCount(scenario.labels.length)"
                value-locale="pt-BR"
                value-prefix="R$ "
              />
            </ChartCard>
            <p class="chart-case__note">
              {{ pieCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Linhas
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.line"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div
            v-for="scenario in lineStressScenarios"
            :key="`line-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              title-superscript="(R$)"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartLine
                :labels="scenario.labels"
                :values="scenario.values"
                :point-labels="scenario.pointLabels"
                :color="datavizColors.line"
                :label-every="scenario.labelEvery"
                :guide-line-count="scenario.guideLineCount"
                :scale-mode="scenario.scaleMode"
                value-prefix=""
              />
            </ChartCard>
            <p class="chart-case__note">
              {{ lineCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Barras
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.bar"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div
            v-for="scenario in barStressScenarios"
            :key="`bar-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              title-superscript="(R$)"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartBar
                :labels="scenario.labels"
                :values="scenario.values"
                :value-labels="scenario.valueLabels"
                :color="datavizColors.primary"
                :label-every="scenario.labelEvery"
                :scale-mode="scenario.scaleMode"
                value-prefix=""
              />
            </ChartCard>
            <p class="chart-case__note">
              {{ barCaseDescription(scenario) }}
            </p>
          </div>

          <div
            v-for="scenario in barLineFallbackScenarios"
            :key="`bar-line-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              title-superscript="(R$)"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartBar
                :labels="scenario.labels"
                :values="scenario.values"
                :value-labels="scenario.valueLabels"
                :color="datavizColors.primary"
                :label-every="scenario.labelEvery"
                :scale-mode="scenario.scaleMode"
                value-prefix=""
              />
            </ChartCard>
            <p class="chart-case__note">
              {{ barCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Barras empilhadas
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.stacked"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div
            v-for="scenario in stackedBarStressScenarios"
            :key="`stacked-bar-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              title-superscript="(R$)"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartStackedBar
                :categories="scenario.categories"
                :items="scenario.items"
                :label-every="scenario.labelEvery"
                :show-section-value-labels="scenario.showSectionValueLabels"
                value-prefix=""
              />
              <template #footer-start>
                <ChartLegend :items="stackedLegendItems(scenario.categories)" />
              </template>
            </ChartCard>
            <p class="chart-case__note">
              {{ stackedCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Barras divergentes
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.flow"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div
            v-for="scenario in flowStressScenarios"
            :key="`flow-card-${scenario.key}`"
            class="chart-case"
          >
            <ChartCard
              :title="scenario.title"
              title-superscript="(R$)"
              :subtitle="scenarioTimeframe(scenario)"
            >
              <ChartDivergingBar
                :items="scenario.items"
                :inflow-color="datavizColors.positive"
                :outflow-color="datavizColors.negative"
                value-prefix=""
              />
              <template #footer-start>
                <ChartLegend
                  :items="[
                    { label: 'Entradas', color: datavizColors.primarySwatch },
                    { label: 'Saídas', color: datavizColors.secondarySwatch },
                  ]"
                />
              </template>
            </ChartCard>
            <p class="chart-case__note">
              {{ flowCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>

      <section class="chart-group">
        <header class="chart-group__header">
          <h2 class="chart-group__title">
            Cards auxiliares
          </h2>
          <ul class="chart-group__list">
            <li
              v-for="detail in chartGroupDocs.auxiliary"
              :key="detail"
              class="chart-group__item"
            >
              {{ detail }}
            </li>
          </ul>
        </header>

        <div class="chart-group__grid">
          <div class="chart-case">
            <ValueCard
              :title="singleValueScenario.title"
              :title-superscript="singleValueScenario.titleSuperscript"
              :subtitle="singleValueScenario.subtitle"
              :value="singleValueScenario.value"
            />
            <p class="chart-case__note">
              {{ singleValueScenario.note }}
            </p>
          </div>

          <div
            v-for="scenario in tableStressScenarios"
            :key="`table-card-${scenario.key}`"
            class="chart-case"
          >
            <TableCard
              :title="scenario.title"
              :title-superscript="scenario.titleSuperscript"
              :subtitle="scenario.subtitle"
              :columns="scenario.columns"
              :rows="scenario.rows"
              :footer-label="scenario.footerLabel"
              :max-rows="scenario.maxRows"
            />
            <p class="chart-case__note">
              {{ tableCaseDescription(scenario) }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.charts-page {
  min-height: 100vh;
  padding: 3rem var(--charts-page-padding-inline, 2rem) 6rem;
  background: #F7F6F2;
  color: #111111;
  font-size: 32px;
}

.charts-page__groups {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: var(--charts-groups-width, 38.5rem);
  max-width: 100%;
  margin: 0 auto;
}

.charts-page__title {
  width: var(--charts-groups-width, 38.5rem);
  max-width: 100%;
  margin: 0 auto 2rem;
  font-family: var(--arcade-font-medium);
  font-size: 3.5rem;
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: 0;
  color: #111111;
}

.chart-group {
  display: grid;
  grid-template-columns: var(--charts-grid-template, repeat(2, 18.75rem));
  gap: var(--charts-grid-gap, 1rem);
  align-items: start;
  justify-content: center;
  min-width: 0;
}

.chart-group__header {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0;
}

.chart-group__title {
  margin: 0 0 0.75rem;
  font-family: var(--arcade-font-medium);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: 0;
  color: #111111;
}

.chart-group__list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.3125rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chart-group__item {
  position: relative;
  margin: 0;
  padding-left: 0.625rem;
  font-family: var(--arcade-font-regular);
  font-size: 0.34375rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0;
  color: #565B63;
}

.chart-group__item::before {
  position: absolute;
  top: 0.45em;
  left: 0;
  width: 0.1875rem;
  height: 0.1875rem;
  content: '';
  background: currentColor;
  border-radius: 999px;
}

.chart-group__list--palette-title {
  margin-bottom: 0.25rem;
}

.chart-group__link {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 0.04em;
  text-underline-offset: 0.12em;
}

.chart-palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2.5rem, 1fr));
  gap: 0.25rem;
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
}

.chart-palette__item {
  min-width: 0;
}

.chart-palette__swatch {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border: 0.03125rem solid rgba(17, 17, 17, 0.08);
  border-radius: 0.125rem;
}

.chart-palette__meta {
  display: flex;
  flex-direction: column;
  gap: 0.03125rem;
  margin-top: 0.125rem;
  min-width: 0;
  font-family: var(--arcade-font-regular);
  font-size: 0.34375rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0;
  color: #565B63;
}

.chart-palette__name,
.chart-palette__hex {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-group__grid {
  display: contents;
}

.chart-case {
  width: var(--charts-card-visual-width, 18.75rem);
  min-width: 0;
  overflow: visible;
}

.chart-case > :deep(.chart-card) {
  margin-bottom: var(--charts-card-flow-offset, 0px);
  transform: scale(var(--charts-card-scale, 1));
  transform-origin: top left;
}

.chart-case__note {
  margin: 0.5rem 0 0;
  font-family: var(--arcade-font-regular);
  font-size: 0.34375rem;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0;
  color: #565B63;
}
</style>
