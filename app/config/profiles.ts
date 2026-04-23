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
  greetingPrimary: 'Hey, Noor.',
  greetingSecondary: 'Three small wins are waiting for you.',
  greetingEmoji: '✸',
  balanceLabel: 'Available',
  balanceCurrency: '$',
  balanceAmount: '6,812',
  hero: {
    amount: '312',
    period: 'Saved this month',
    note: 'Rent just cleared and your groceries line is trending down for the third week in a row.',
  },
  cards: [
    {
      id: 'savings-progress',
      kind: 'stat',
      label: 'Trip to Kyoto',
      value: '62%',
      delta: '+$180',
      deltaTone: 'positive',
      note: 'Auto-transfer runs again on the 15th.',
    },
    {
      id: 'spend-trend',
      kind: 'trend',
      label: 'Daily spend',
      value: '$38',
      delta: '−18%',
      deltaTone: 'positive',
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      values: [54, 42, 61, 29, 47, 22, 38],
    },
    {
      id: 'top-merchants',
      kind: 'allocation',
      label: 'Where it went',
      slices: [
        { name: 'Groceries', percent: 34 },
        { name: 'Transit', percent: 19 },
        { name: 'Coffee', percent: 12 },
      ],
    },
    {
      id: 'insight-subscription',
      kind: 'insight',
      label: 'Nudge',
      body: 'Two streaming services charged on the same day. Skipping the less-used one frees up $14 a month.',
    },
  ],
}

const business1Feed: FeedData = {
  greetingPrimary: 'Morning, Atlas Studio.',
  greetingSecondary: 'The Q2 pipeline just shifted in your favor.',
  greetingEmoji: '◎',
  balanceLabel: 'Operating cash',
  balanceCurrency: '$',
  balanceAmount: '54,109',
  hero: {
    amount: '21.4k',
    period: 'Projected close this week',
    note: 'Two proposals moved to signature stage overnight. Payroll is fully funded for the next two cycles.',
  },
  cards: [
    {
      id: 'pipeline-trend',
      kind: 'trend',
      label: 'Weighted pipeline',
      value: '$84,600',
      delta: '+9.2%',
      deltaTone: 'positive',
      labels: Array.from({ length: 12 }, (_, i) => `w${i + 1}`),
      values: [48, 52, 55, 59, 63, 66, 70, 72, 74, 78, 81, 85],
    },
    {
      id: 'receivables',
      kind: 'stat',
      label: 'Receivables',
      value: '$12,480',
      delta: '3 overdue',
      deltaTone: 'negative',
      note: 'Longest open invoice is 21 days past due.',
    },
    {
      id: 'revenue-mix',
      kind: 'allocation',
      label: 'Revenue mix',
      slices: [
        { name: 'Retainers', percent: 48 },
        { name: 'Projects', percent: 34 },
        { name: 'Licensing', percent: 12 },
      ],
    },
    {
      id: 'insight-hiring',
      kind: 'insight',
      label: 'Nudge',
      body: 'At the current close rate, you can safely bring on the junior designer you shortlisted last month.',
    },
  ],
}

const business2Feed: FeedData = {
  greetingPrimary: 'Hi, Lumen Coffee.',
  greetingSecondary: 'Your Sunday regulars showed up early today.',
  greetingEmoji: '✻',
  balanceLabel: 'Till + deposits',
  balanceCurrency: '$',
  balanceAmount: '9,476',
  hero: {
    amount: '1.9k',
    period: 'So far today',
    note: 'Pastries are outpacing last Sunday 2:1. Oat milk stock will run low around 3pm at this rate.',
  },
  cards: [
    {
      id: 'hourly-sales',
      kind: 'trend',
      label: 'Tickets by hour',
      value: '184',
      delta: '+27%',
      deltaTone: 'positive',
      labels: ['7a', '9a', '11a', '1p', '3p'],
      values: [18, 42, 58, 36, 30],
    },
    {
      id: 'tips',
      kind: 'stat',
      label: 'Tips pooled',
      value: '$146',
      delta: '+$22',
      deltaTone: 'positive',
      note: 'On pace for the best shift of the month.',
    },
    {
      id: 'menu-mix',
      kind: 'allocation',
      label: 'Top movers',
      slices: [
        { name: 'Iced latte', percent: 38 },
        { name: 'Drip', percent: 22 },
        { name: 'Matcha bun', percent: 17 },
      ],
    },
    {
      id: 'insight-inventory',
      kind: 'insight',
      label: 'Nudge',
      body: 'Reordering oat milk by 2pm keeps you ahead of the evening rush without overstocking for Monday.',
    },
  ],
}

function buildPages(profileId: string, profileLabel: string, feed: FeedData): [PageDef, PageDef, PageDef] {
  return [
    {
      id: 'spend',
      label: 'Spend',
      component: PlaceholderScreen,
      props: { label: 'Spend' },
    },
    {
      id: 'home',
      label: profileLabel,
      component: FeedScreen,
      props: { feed, profileId },
    },
    {
      id: 'activity',
      label: 'Activity',
      component: PlaceholderScreen,
      props: { label: 'Activity' },
    },
  ]
}

export const profiles: ProfileDef[] = [
  {
    id: 'business-1',
    label: 'Atlas Studio',
    accent: '#5856d6',
    feed: business1Feed,
    pages: buildPages('business-1', 'Atlas Studio', business1Feed),
  },
  {
    id: 'personal',
    label: 'Personal',
    accent: '#00c896',
    feed: personalFeed,
    pages: buildPages('personal', 'Personal', personalFeed),
  },
  {
    id: 'business-2',
    label: 'Lumen Coffee',
    accent: '#ff9500',
    feed: business2Feed,
    pages: buildPages('business-2', 'Lumen Coffee', business2Feed),
  },
]

export const defaultProfileId = 'personal'

export const defaultProfileIndex = Math.max(
  profiles.findIndex(p => p.id === defaultProfileId),
  0,
)
