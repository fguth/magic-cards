<script setup lang="ts">
defineOptions({ name: 'ChartsPage' })

useHead({ title: 'Charts — Financial Visualizations' })

const categoryLabels = ['Groceries', 'Dining', 'Shopping', 'Transport', 'Utilities', 'Other']
const categoryValues = [1681, 1066, 738, 328, 205, 123]

const daysInMonth = 30
const dailyLabels = Array.from({ length: daysInMonth }, (_, index) => String(index + 1))

const spendingDays = 20
const spendingLabels = Array.from({ length: spendingDays }, (_, index) => String(index + 1))
const dailySpending = [
  1200, 3400, 820, 4800, 2100, 6500, 1800, 3200, 900, 5600,
  2400, 1500, 4100, 7200, 2800, 3600, 1100, 5200, 2900, 3800,
]

const dailyRevenue = [
  310, 210, 120, 300, 450, 350, 280, 420, 550, 610,
  490, 350, 280, 440, 610, 800, 920, 760, 580, 500,
  620, 760, 810, 690, 540, 470, 620, 810, 1100, 730,
]

const revenueHighlights = [
  { index: 0, label: '$310' },
  { index: 2, label: '$120' },
  { index: 4, label: '$450' },
  { index: 9, label: '$610' },
  { index: 12, label: '$280' },
  { index: 16, label: '$920' },
  { index: 19, label: '$500' },
  { index: 22, label: '$810' },
  { index: 25, label: '$470' },
  { index: 28, label: '$1,100' },
  { index: 29, label: '$730' },
]

const bankFlows = [
  { label: 'Chase', inflow: 12400, outflow: 8700 },
  { label: 'BofA', inflow: 5200, outflow: 6100 },
  { label: 'Wells', inflow: 6300, outflow: 3400 },
  { label: 'Ally', inflow: 8900, outflow: 2800 },
  { label: 'Cash', inflow: 3100, outflow: 5600 },
]

const totalSpending = categoryValues.reduce((sum, value) => sum + value, 0)
const totalRevenue = dailyRevenue.reduce((sum, value) => sum + value, 0)
const dailyAverage = Math.round(dailySpending.reduce((sum, value) => sum + value, 0) / spendingDays)

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`
}
</script>

<template>
  <main class="charts-page">
    <div class="charts-page__grid">
      <ChartCard
        title="Category Spending"
        :subtitle="`Total ${formatCurrency(totalSpending)}`"
      >
        <ChartPie :labels="categoryLabels" :values="categoryValues" />
      </ChartCard>

      <ChartCard
        title="Daily Spending"
        :subtitle="`Avg ${formatCurrency(dailyAverage)} per day`"
      >
        <ChartBar
          :labels="spendingLabels"
          :values="dailySpending"
          value-prefix="$"
        />
      </ChartCard>

      <ChartCard
        title="Daily Revenue"
        :subtitle="`Total ${formatCurrency(totalRevenue)}`"
      >
        <ChartLine
          :labels="dailyLabels"
          :values="dailyRevenue"
          :point-labels="revenueHighlights"
          value-prefix="$"
        />
      </ChartCard>

      <ChartCard title="Bank Accounts" subtitle="Inflows vs outflows">
        <ChartDivergingBar :items="bankFlows" value-prefix="$" />
        <template #footer-start>
          <ChartLegend
            :items="[
              { label: 'In', color: '#f7a93a' },
              { label: 'Out', color: '#1c1c1c' },
            ]"
          />
        </template>
      </ChartCard>
    </div>
  </main>
</template>

<style scoped>
.charts-page {
  min-height: 100vh;
  padding: 3rem 2rem 6rem;
  background: #f3f2ef;
  color: #111111;
  font-size: 32px;
}

.charts-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 18.75rem);
  gap: 1rem;
  justify-content: center;
  max-width: calc(18.75rem * 2 + 1rem);
  margin: 0 auto;
}
</style>
