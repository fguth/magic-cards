<script setup lang="ts">
defineOptions({ name: 'ChartCard' })

interface ChartCardProps {
  title: string
  subtitle?: string
}

withDefaults(defineProps<ChartCardProps>(), {
  subtitle: undefined,
})
</script>

<template>
  <section class="chart-card">
    <header class="chart-card__header">
      <div class="chart-card__titles">
        <h3 class="chart-card__title">{{ title }}</h3>
        <span v-if="subtitle" class="chart-card__subtitle">{{ subtitle }}</span>
      </div>
    </header>

    <div class="chart-card__canvas">
      <slot />
    </div>

    <footer class="chart-card__footer">
      <div class="chart-card__footer-start">
        <slot name="footer-start" />
      </div>
      <span class="chart-card__footer-mark">cash.app</span>
    </footer>
  </section>
</template>

<style scoped>
.chart-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 18.75rem;
  height: 18.75rem;
  padding: 0.75rem 0.875rem 0.75rem;
  margin: 0;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: 0.875rem;
  color: #111111;
  overflow: hidden;
}

.chart-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.chart-card__titles {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  min-width: 0;
  gap: 0.1875rem 0.1875rem;
  flex: 1 1 auto;
}

.chart-card__title {
  font-family: var(--arcade-font-medium);
  font-size: 0.8125rem;
  line-height: 1.2;
  letter-spacing: -0.015rem;
  color: #111111;
  margin: 0;
}

.chart-card__subtitle {
  font-family: var(--arcade-font-regular);
  font-size: 0.8125rem;
  line-height: 1.2;
  letter-spacing: -0.015rem;
  color: #8a8a8a;
  font-weight: 400;
}

.chart-card__canvas {
  flex: 1 1 0;
  position: relative;
  min-height: 0;
  display: flex;
}

.chart-card__canvas > :deep(*) {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
}

.chart-card__footer {
  margin-top: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: 'CashSans Mono Regular', monospace;
  font-size: 0.3125rem;
  line-height: 1;
  letter-spacing: 0.01rem;
  color: #b4b4b4;
}

.chart-card__footer-start {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 0 1 auto;
}

.chart-card__footer-start:empty {
  display: none;
}

.chart-card__footer-mark {
  margin-left: auto;
  color: #b4b4b4;
  text-align: right;
}
</style>
