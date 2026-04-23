<script setup lang="ts">
import type { FeedData, FeedCardPayload } from '~/config/profiles'

defineOptions({ name: 'FeedScreen' })

interface Props {
  feed: FeedData
  profileId?: string
}

const props = defineProps<Props>()

const CHAT_PROMPT = 'What do you need me to do?'

const { isChatModeActive } = useAppNavigation()
const isChatActive = computed(() => (props.profileId ? isChatModeActive(props.profileId) : false))

const scrollEl = ref<HTMLElement | null>(null)

watch(isChatActive, (active) => {
  if (!active) return
  const el = scrollEl.value
  if (!el) return
  el.scrollTo({ top: 0, behavior: 'smooth' })
})

const isBalanceHidden = ref(true)

function toggleBalance() {
  isBalanceHidden.value = !isBalanceHidden.value
}

const maskedBalance = computed(() => '•'.repeat(7))

function isStat(card: FeedCardPayload): card is Extract<FeedCardPayload, { kind: 'stat' }> {
  return card.kind === 'stat'
}
function isInsight(card: FeedCardPayload): card is Extract<FeedCardPayload, { kind: 'insight' }> {
  return card.kind === 'insight'
}
function isTrend(card: FeedCardPayload): card is Extract<FeedCardPayload, { kind: 'trend' }> {
  return card.kind === 'trend'
}
function isAllocation(card: FeedCardPayload): card is Extract<FeedCardPayload, { kind: 'allocation' }> {
  return card.kind === 'allocation'
}

function sparklinePath(values: number[]) {
  if (values.length === 0) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 100
  const height = 32
  const step = values.length > 1 ? width / (values.length - 1) : width
  return values
    .map((value, index) => {
      const x = index * step
      const y = height - ((value - min) / range) * height
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

function sparklineLastPoint(values: number[]) {
  if (values.length === 0) return { x: 0, y: 0 }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 100
  const height = 32
  const step = values.length > 1 ? width / (values.length - 1) : width
  const index = values.length - 1
  return {
    x: index * step,
    y: height - ((values[index] - min) / range) * height,
  }
}
</script>

<template>
  <div
    class="feed-screen"
    :class="{ 'feed-screen--chat': isChatActive }"
  >
    <div class="feed-screen__halo" />

    <div ref="scrollEl" class="feed-screen__scroll">
      <header class="feed-screen__header">
        <h1 class="feed-screen__greeting">
          <span class="feed-screen__greeting-primary">{{ props.feed.greetingPrimary }}</span>
          <span class="feed-screen__greeting-stack">
            <span class="feed-screen__greeting-secondary feed-screen__greeting-secondary--idle">
              {{ props.feed.greetingSecondary }}
              <span v-if="props.feed.greetingEmoji" class="feed-screen__greeting-emoji" aria-hidden="true">
                {{ props.feed.greetingEmoji }}
              </span>
            </span>
            <span class="feed-screen__greeting-secondary feed-screen__greeting-secondary--chat">
              {{ CHAT_PROMPT }}
            </span>
          </span>
        </h1>
      </header>

      <button
        type="button"
        class="feed-screen__balance-button"
        :aria-label="isBalanceHidden ? 'Show total balance' : 'Hide total balance'"
        @click="toggleBalance"
      >
        <FeedCard variant="pill" class="feed-screen__balance-card">
          <span class="feed-screen__balance-label">{{ props.feed.balanceLabel }}:</span>
          <span class="feed-screen__balance-value">
            <span class="feed-screen__balance-currency">{{ props.feed.balanceCurrency }}</span>
            <span v-if="isBalanceHidden" class="feed-screen__balance-mask">{{ maskedBalance }}</span>
            <span v-else class="feed-screen__balance-amount">{{ props.feed.balanceAmount }}</span>
          </span>
          <span class="feed-screen__balance-eye" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                v-if="isBalanceHidden"
                d="M8 4.5C4.8 4.5 2.2 6.4 1 8c1.2 1.6 3.8 3.5 7 3.5s5.8-1.9 7-3.5c-1.2-1.6-3.8-3.5-7-3.5Zm0 6a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
                fill="currentColor"
              />
              <path
                v-else
                d="m2 2 12 12M5.5 5.5C3.6 6.4 2 7.7 1 8c1.2 1.6 3.8 3.5 7 3.5 1.1 0 2.1-.2 3-.6M10.5 10.5c1.9-.9 3.5-2.2 4.5-2.5-1.2-1.6-3.8-3.5-7-3.5-.6 0-1.2.06-1.75.17M9.4 9.4a2 2 0 0 1-2.8-2.8"
                stroke="currentColor"
                stroke-width="1.1"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </FeedCard>
      </button>

      <FeedCard variant="hero" class="feed-screen__hero">
        <div class="feed-screen__hero-amount">
          <span class="feed-screen__hero-currency">$</span>
          <span class="feed-screen__hero-number">{{ props.feed.hero.amount }}</span>
        </div>
        <p class="feed-screen__hero-period">({{ props.feed.hero.period }})</p>
        <p v-if="props.feed.hero.note" class="feed-screen__hero-note">
          - {{ props.feed.hero.note }}
        </p>
      </FeedCard>

      <div class="feed-screen__cards">
        <FeedCard
          v-for="card in props.feed.cards"
          :key="card.id"
          class="feed-screen__card"
        >
          <template v-if="isStat(card)">
            <div class="feed-stat">
              <span class="feed-stat__label">{{ card.label }}</span>
              <div class="feed-stat__body">
                <span class="feed-stat__value">{{ card.value }}</span>
                <span
                  v-if="card.delta"
                  class="feed-stat__delta"
                  :class="`feed-stat__delta--${card.deltaTone ?? 'neutral'}`"
                >
                  {{ card.delta }}
                </span>
              </div>
              <p v-if="card.note" class="feed-stat__note">{{ card.note }}</p>
            </div>
          </template>

          <template v-else-if="isInsight(card)">
            <div class="feed-insight">
              <span class="feed-insight__label">{{ card.label }}</span>
              <p class="feed-insight__body">{{ card.body }}</p>
            </div>
          </template>

          <template v-else-if="isTrend(card)">
            <div class="feed-trend">
              <div class="feed-trend__header">
                <span class="feed-trend__label">{{ card.label }}</span>
                <span class="feed-trend__value">{{ card.value }}</span>
                <span
                  v-if="card.delta"
                  class="feed-trend__delta"
                  :class="`feed-trend__delta--${card.deltaTone ?? 'neutral'}`"
                >
                  {{ card.delta }}
                </span>
              </div>
              <svg
                class="feed-trend__chart"
                viewBox="0 0 100 32"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  class="feed-trend__chart-line"
                  :d="sparklinePath(card.values)"
                  fill="none"
                  vector-effect="non-scaling-stroke"
                />
                <circle
                  class="feed-trend__chart-dot"
                  :cx="sparklineLastPoint(card.values).x"
                  :cy="sparklineLastPoint(card.values).y"
                  r="1.6"
                />
              </svg>
            </div>
          </template>

          <template v-else-if="isAllocation(card)">
            <div class="feed-allocation">
              <span class="feed-allocation__label">{{ card.label }}</span>
              <ul class="feed-allocation__list">
                <li
                  v-for="(slice, index) in card.slices"
                  :key="slice.name"
                  class="feed-allocation__row"
                >
                  <span class="feed-allocation__rank">{{ index + 1 }}</span>
                  <span class="feed-allocation__name">{{ slice.name }}</span>
                  <span class="feed-allocation__bar" aria-hidden="true">
                    <span
                      class="feed-allocation__bar-fill"
                      :style="{ width: `${slice.percent}%` }"
                    />
                  </span>
                  <span class="feed-allocation__percent">{{ slice.percent }}%</span>
                </li>
              </ul>
            </div>
          </template>
        </FeedCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--arcade-bg-subtle, #f0f0f0);
  color: var(--arcade-text-standard, #000);
  isolation: isolate;
  --feed-chat-duration: var(--shell-duration-morph, 440ms);
  --feed-chat-ease: var(--arcade-spring-smooth);
}

.feed-screen__halo {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle at 50% 0%, var(--profile-accent, #888888) 0%, transparent 55%);
  opacity: calc(0.22 * var(--profile-halo-visibility, 1));
  filter: blur(1.6em);
  pointer-events: none;
  z-index: 0;
}

.feed-screen__scroll {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 4rem 0.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  scrollbar-width: none;
  transition: padding-bottom var(--feed-chat-duration) var(--feed-chat-ease);
}

.feed-screen__scroll::-webkit-scrollbar {
  display: none;
}

.feed-screen--chat .feed-screen__scroll {
  overflow-y: hidden;
  padding-bottom: 3rem;
}

.feed-screen__header {
  padding: 0 0.25em;
}

.feed-screen__greeting {
  margin: 0;
  font-family: var(--arcade-font-medium, inherit);
  font-weight: 500;
  font-size: 0.78em;
  line-height: 1.12;
  letter-spacing: -0.025em;
  display: flex;
  flex-direction: column;
  gap: 0.04em;
  max-width: 92%;
}

.feed-screen__greeting-primary {
  color: var(--arcade-text-standard, #000);
}

.feed-screen__greeting-stack {
  position: relative;
  display: block;
  min-height: 0;
}

.feed-screen__greeting-secondary {
  color: var(--arcade-text-subtle, #888);
  display: inline;
  transition: opacity 220ms var(--arcade-ease-out);
}

.feed-screen__greeting-secondary--chat {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.feed-screen--chat .feed-screen__greeting-secondary--idle {
  opacity: 0;
}

.feed-screen--chat .feed-screen__greeting-secondary--chat {
  opacity: 1;
}

.feed-screen__greeting-emoji {
  display: inline-block;
  margin-left: 0.15em;
  font-size: 0.85em;
  vertical-align: 0.02em;
}

.feed-screen__balance-button {
  align-self: flex-start;
  margin: 0.4em 0.2em 0.25em;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;
  font: inherit;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 220ms var(--arcade-ease-out),
    transform var(--feed-chat-duration) var(--feed-chat-ease);
  will-change: opacity, transform;
}

.feed-screen--chat .feed-screen__balance-button {
  opacity: 0;
  transform: translateY(-0.25em);
  pointer-events: none;
}

.feed-screen__balance-button:focus-visible {
  outline: 0.03em solid var(--arcade-text-standard, #000);
  outline-offset: 0.1em;
  border-radius: 999px;
}

.feed-screen__balance-card {
  font-size: 0.34em;
}

.feed-screen__balance-label {
  font-family: var(--arcade-font-regular, inherit);
  color: var(--arcade-text-subtle, #666);
  letter-spacing: -0.01em;
}

.feed-screen__balance-value {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  font-family: var(--arcade-font-medium, inherit);
  color: var(--arcade-text-subtle, #666);
  letter-spacing: 0.02em;
}

.feed-screen__balance-currency {
  font-family: var(--arcade-font-regular, inherit);
}

.feed-screen__balance-mask {
  letter-spacing: 0.15em;
  line-height: 1;
}

.feed-screen__balance-amount {
  letter-spacing: 0.02em;
}

.feed-screen__balance-eye {
  display: inline-flex;
  width: 1em;
  height: 1em;
  margin-left: 0.1em;
  color: var(--arcade-text-subtle, #666);
}

.feed-screen__balance-eye svg {
  width: 100%;
  height: 100%;
}

.feed-screen__hero {
  margin-top: 0.75rem;
  aspect-ratio: 1 / 1;
  width: 100%;
  flex: 0 0 auto;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 240ms var(--arcade-ease-out),
    transform var(--feed-chat-duration) var(--feed-chat-ease);
  will-change: transform, opacity;
}

.feed-screen--chat .feed-screen__hero {
  opacity: 0;
  transform: translateY(140%);
  pointer-events: none;
}

.feed-screen__hero-amount {
  display: flex;
  align-items: flex-start;
  gap: 0.02em;
  font-family: var(--arcade-font-regular, inherit);
  color: var(--arcade-text-standard, #000);
  letter-spacing: -0.035em;
  line-height: 0.92;
}

.feed-screen__hero-currency {
  font-size: 1.8em;
  padding-top: 0.08em;
}

.feed-screen__hero-number {
  font-size: 2.3em;
  font-weight: 400;
}

.feed-screen__hero-period {
  margin: 0.2em 0 0;
  font-family: var(--arcade-font-regular, inherit);
  font-size: 0.38em;
  color: var(--arcade-text-subtle, #888);
  letter-spacing: -0.01em;
}

.feed-screen__hero-note {
  margin: auto 0 0;
  padding-top: 0.8em;
  font-family: var(--arcade-font-regular, inherit);
  font-size: 0.36em;
  line-height: 1.4;
  color: var(--arcade-text-subtle, #888);
  letter-spacing: -0.008em;
}

.feed-screen__cards {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.feed-screen__card {
  aspect-ratio: 1 / 1;
  width: 100%;
  flex: 0 0 auto;
  display: flex;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 240ms var(--arcade-ease-out),
    transform var(--feed-chat-duration) var(--feed-chat-ease);
  transition-delay: calc(var(--card-exit-delay, 0ms) * var(--card-exit-direction, 0));
  will-change: transform, opacity;
}

.feed-screen--chat .feed-screen__card {
  --card-exit-direction: 1;
  opacity: 0;
  transform: translateY(140%);
  pointer-events: none;
}

.feed-screen__card:nth-child(1) { --card-exit-delay: 0ms; }
.feed-screen__card:nth-child(2) { --card-exit-delay: 40ms; }
.feed-screen__card:nth-child(3) { --card-exit-delay: 80ms; }
.feed-screen__card:nth-child(4) { --card-exit-delay: 120ms; }
.feed-screen__card:nth-child(n+5) { --card-exit-delay: 160ms; }

.feed-screen__card > :deep(.feed-card__content) {
  width: 100%;
  justify-content: center;
  overflow: hidden;
}

.feed-stat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.4em;
  font-size: 0.5em;
  height: 100%;
}

.feed-stat__label {
  font-family: var(--arcade-font-medium, inherit);
  color: var(--arcade-text-subtle, #888);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72em;
}

.feed-stat__body {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
}

.feed-stat__value {
  font-family: var(--arcade-font-medium, inherit);
  font-size: 2.4em;
  letter-spacing: -0.03em;
  color: var(--arcade-text-standard, #000);
  line-height: 1;
}

.feed-stat__delta {
  font-family: var(--arcade-font-mono-medium, monospace);
  font-size: 0.9em;
  letter-spacing: 0;
  line-height: 1;
}

.feed-stat__delta--positive {
  color: var(--arcade-text-success, #00792c);
}

.feed-stat__delta--negative {
  color: var(--arcade-text-danger, #d3040e);
}

.feed-stat__delta--neutral {
  color: var(--arcade-text-subtle, #666);
}

.feed-stat__note {
  margin: 0.15em 0 0;
  color: var(--arcade-text-subtle, #888);
  font-size: 0.92em;
  line-height: 1.35;
  letter-spacing: -0.006em;
}

.feed-insight {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.6em;
  font-size: 0.5em;
  height: 100%;
}

.feed-insight__label {
  font-family: var(--arcade-font-medium, inherit);
  color: var(--arcade-text-subtle, #888);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72em;
}

.feed-insight__body {
  margin: 0;
  font-family: var(--arcade-font-regular, inherit);
  color: var(--arcade-text-standard, #000);
  font-size: 1.15em;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.feed-trend {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  font-size: 0.5em;
  height: 100%;
  min-height: 0;
}

.feed-trend__header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  column-gap: 0.5em;
  row-gap: 0.35em;
}

.feed-trend__label {
  grid-column: 1 / -1;
  font-family: var(--arcade-font-medium, inherit);
  color: var(--arcade-text-subtle, #888);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72em;
  white-space: nowrap;
}

.feed-trend__value {
  grid-column: 1;
  font-family: var(--arcade-font-medium, inherit);
  font-size: 1.8em;
  letter-spacing: -0.025em;
  color: var(--arcade-text-standard, #000);
  line-height: 1;
  white-space: nowrap;
}

.feed-trend__delta {
  grid-column: 2;
  justify-self: end;
  font-family: var(--arcade-font-mono-medium, monospace);
  font-size: 0.8em;
  white-space: nowrap;
}

.feed-trend__delta--positive {
  color: var(--arcade-text-success, #00792c);
}

.feed-trend__delta--negative {
  color: var(--arcade-text-danger, #d3040e);
}

.feed-trend__delta--neutral {
  color: var(--arcade-text-subtle, #666);
}

.feed-trend__chart {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  display: block;
  overflow: hidden;
}

.feed-trend__chart-line {
  stroke: var(--arcade-text-standard, #000);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.feed-trend__chart-dot {
  fill: var(--arcade-text-standard, #000);
}

.feed-allocation {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.55em;
  font-size: 0.5em;
  height: 100%;
}

.feed-allocation__label {
  font-family: var(--arcade-font-medium, inherit);
  color: var(--arcade-text-subtle, #888);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72em;
}

.feed-allocation__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.feed-allocation__row {
  display: grid;
  grid-template-columns: 0.9em 1fr 2.2em 1.1em;
  align-items: center;
  gap: 0.4em;
  font-family: var(--arcade-font-regular, inherit);
  font-size: 1em;
  color: var(--arcade-text-standard, #000);
  letter-spacing: -0.006em;
}

.feed-allocation__rank {
  font-family: var(--arcade-font-mono-medium, monospace);
  color: var(--arcade-text-subtle, #888);
  font-size: 0.85em;
}

.feed-allocation__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feed-allocation__bar {
  position: relative;
  width: 100%;
  height: 0.22em;
  border-radius: 999px;
  background: var(--arcade-data-portion-empty, rgba(0, 0, 0, 0.08));
  overflow: hidden;
}

.feed-allocation__bar-fill {
  display: block;
  height: 100%;
  background: var(--arcade-text-standard, #000);
  border-radius: inherit;
}

.feed-allocation__percent {
  font-family: var(--arcade-font-mono-medium, monospace);
  color: var(--arcade-text-subtle, #666);
  text-align: right;
  font-size: 0.9em;
}
</style>
