<script setup lang="ts">
defineOptions({ name: 'ValueCard' })

interface ValueCardProps {
  title: string
  titleSuperscript?: string
  subtitle?: string
  value: string
}

withDefaults(defineProps<ValueCardProps>(), {
  titleSuperscript: undefined,
  subtitle: undefined,
})
</script>

<template>
  <ChartCard
    class="value-card"
    :title="title"
    :title-superscript="titleSuperscript"
    :subtitle="subtitle"
  >
    <div class="value-card__body">
      <p class="value-card__value">{{ value }}</p>
    </div>
  </ChartCard>
</template>

<style scoped>
.value-card__body {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  padding-bottom: 1.75rem;
  box-sizing: border-box;
}

.value-card__value {
  max-width: 100%;
  margin: 0;
  color: #111111;
  font-family: var(--arcade-font-medium);
  font-size: 2.35rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 0.9;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}
</style>
