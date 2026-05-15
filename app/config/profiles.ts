import type { Component } from 'vue'
import PlaceholderScreen from '~/components/screens/placeholder-screen.vue'
import FeedScreen from '~/components/screens/feed-screen.vue'

export interface PageDef {
  id: string
  label: string
  component: Component
  props?: Record<string, unknown>
}

export interface ProfileDef {
  id: string
  label: string
  accent: string
  feed: FeedData
  pages: [PageDef, PageDef, PageDef]
}

export type DeltaTone = 'positive' | 'negative' | 'neutral'

export interface FeedHero {
  amount: string
  period: string
  note?: string
}

interface FeedCardBase {
  id: string
}

export interface FeedStatCard extends FeedCardBase {
  kind: 'stat'
  label: string
  value: string
  delta?: string
  deltaTone?: DeltaTone
  note?: string
}

export interface FeedInsightCard extends FeedCardBase {
  kind: 'insight'
  label: string
  body: string
}

export interface FeedTrendCard extends FeedCardBase {
  kind: 'trend'
  label: string
  value: string
  delta?: string
  deltaTone?: DeltaTone
  labels: Array<string | number>
  values: number[]
}

export interface FeedAllocationCard extends FeedCardBase {
  kind: 'allocation'
  label: string
  slices: Array<{ name: string; percent: number }>
}

export type FeedCardPayload =
  | FeedStatCard
  | FeedInsightCard
  | FeedTrendCard
  | FeedAllocationCard

export interface FeedData {
  greetingPrimary: string
  greetingSecondary: string
  greetingEmoji?: string
  balanceLabel: string
  balanceCurrency: string
  balanceAmount: string
  hero: FeedHero
  cards: FeedCardPayload[]
}

const personalFeed: FeedData = {
  greetingPrimary: 'Bom dia, Jorge.',
  greetingSecondary: 'Eu estou de olho no seu caixa.',
  balanceLabel: 'Saldo livre',
  balanceCurrency: 'R$',
  balanceAmount: '12.840,75',
  hero: {
    amount: '4.180',
    period: 'caixa livre nesta semana',
    note: 'Eu já considerei Pix agendados, cartão e contas fixas. Esse é o valor que sobra para decidir com calma.',
  },
  cards: [
    {
      id: 'weekly-cash-flow',
      kind: 'trend',
      label: 'Caixa previsto',
      value: 'R$ 4,1 mil',
      delta: '+R$ 620',
      deltaTone: 'positive',
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      values: [2840, 3060, 3520, 3310, 3860, 4010, 4180],
    },
    {
      id: 'client-inflows',
      kind: 'stat',
      label: 'Entradas de clientes',
      value: 'R$ 7.920',
      delta: '+16%',
      deltaTone: 'positive',
      note: 'Eu identifiquei 5 recebimentos recorrentes. Dois vieram antes do padrão.',
    },
    {
      id: 'pix-outflow',
      kind: 'stat',
      label: 'Pix e saídas',
      value: 'R$ 2.140',
      delta: '-11%',
      deltaTone: 'positive',
      note: 'As saídas pequenas desaceleraram. Isso melhora sua margem da semana.',
    },
    {
      id: 'tax-reserve',
      kind: 'stat',
      label: 'Reserva de impostos',
      value: 'R$ 1.380',
      delta: 'em dia',
      deltaTone: 'neutral',
      note: 'Eu manteria esse valor separado antes de qualquer retirada pessoal.',
    },
    {
      id: 'spending-mix',
      kind: 'allocation',
      label: 'Uso do dinheiro',
      slices: [
        { name: 'Operação', percent: 34 },
        { name: 'Pessoal', percent: 28 },
        { name: 'Reserva', percent: 18 },
      ],
    },
    {
      id: 'withdrawal-insight',
      kind: 'insight',
      label: 'Minha leitura',
      body: 'Eu deixaria a retirada em até R$ 2.500 agora. Acima disso, abril fica sensível se um cliente atrasar.',
    },
  ],
}

const businessFeed: FeedData = {
  greetingPrimary: 'Bom dia, Jorge.',
  greetingSecondary: 'Eu acompanhei a Raio Eletrecidade agora há pouco.',
  balanceLabel: 'Caixa disponível',
  balanceCurrency: 'R$',
  balanceAmount: '87.420,18',
  hero: {
    amount: '18.760',
    period: 'vendas confirmadas hoje',
    note: 'Eu vi Tap to Pay, Pix e boletos entrando no prazo. O caixa cobre 23 dias de operação.',
  },
  cards: [
    {
      id: 'sales-trend',
      kind: 'trend',
      label: 'Vendas da semana',
      value: 'R$ 64,8 mil',
      delta: '+14%',
      deltaTone: 'positive',
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      values: [41, 39, 52, 57, 62, 66, 65],
    },
    {
      id: 'tap-to-pay-sales',
      kind: 'stat',
      label: 'Tap to Pay',
      value: 'R$ 6.480',
      delta: '+31%',
      deltaTone: 'positive',
      note: 'Eu contei 25 cobranças aprovadas. A taxa de aprovação está acima da média.',
    },
    {
      id: 'pix-inflow',
      kind: 'stat',
      label: 'Pix recebidos',
      value: 'R$ 8.930',
      delta: '+18%',
      deltaTone: 'positive',
      note: 'O pico foi entre 10h e 12h. Eu já marquei a parte de impostos nessas entradas.',
    },
    {
      id: 'accounts-payable',
      kind: 'stat',
      label: 'Contas a pagar',
      value: 'R$ 11.240',
      delta: '2 amanhã',
      deltaTone: 'neutral',
      note: 'Cabe no caixa atual. Eu pagaria fornecedores antes de antecipar recebíveis.',
    },
    {
      id: 'inflow-mix',
      kind: 'allocation',
      label: 'Origem das entradas',
      slices: [
        { name: 'Cartão', percent: 42 },
        { name: 'Pix', percent: 37 },
        { name: 'Boleto', percent: 16 },
      ],
    },
    {
      id: 'health-score',
      kind: 'stat',
      label: 'Score financeiro',
      value: '86/100',
      delta: '+4 pts',
      deltaTone: 'positive',
      note: 'Receita, margem e pontualidade estão fortes. O ponto de atenção é concentração em 3 clientes.',
    },
    {
      id: 'payment-insight',
      kind: 'insight',
      label: 'Minha sugestão',
      body: 'Eu anteciparia só R$ 4,2 mil do cartão se o fornecedor pedir prazo menor. Hoje, o caixa aguenta.',
    },
  ],
}

function buildPages(
  profileId: string,
  profileLabel: string,
  feed: FeedData,
  leftLabel: string,
  rightLabel: string,
): [PageDef, PageDef, PageDef] {
  return [
    {
      id: 'spend',
      label: leftLabel,
      component: PlaceholderScreen,
      props: { label: leftLabel },
    },
    {
      id: 'home',
      label: profileLabel,
      component: FeedScreen,
      props: { feed, profileId },
    },
    {
      id: 'activity',
      label: rightLabel,
      component: PlaceholderScreen,
      props: { label: rightLabel },
    },
  ]
}

export const profiles: ProfileDef[] = [
  {
    id: 'business',
    label: 'Raio Eletrecidade Ltda.',
    accent: '#0a84ff',
    feed: businessFeed,
    pages: buildPages('business', 'Raio Eletrecidade Ltda.', businessFeed, 'Vendas', 'Pagamentos'),
  },
  {
    id: 'personal',
    label: 'Jorge',
    accent: '#00c896',
    feed: personalFeed,
    pages: buildPages('personal', 'Jorge', personalFeed, 'Movimento', 'Atividade'),
  },
]

export const defaultProfileId = 'personal'

export const defaultProfileIndex = Math.max(
  profiles.findIndex(p => p.id === defaultProfileId),
  0,
)
