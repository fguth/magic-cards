<script setup lang="ts">
defineOptions({ name: 'ChartCard' })

interface ChartCardProps {
  title: string
  titleSuperscript?: string
  subtitle?: string
}

withDefaults(defineProps<ChartCardProps>(), {
  titleSuperscript: undefined,
  subtitle: undefined,
})
</script>

<template>
  <section class="chart-card">
    <header class="chart-card__header">
      <div class="chart-card__titles">
        <h3 class="chart-card__title">
          {{ title }}
          <sup v-if="titleSuperscript" class="chart-card__title-superscript">{{ titleSuperscript }}</sup>
        </h3>
        <span v-if="subtitle" class="chart-card__subtitle">{{ subtitle }}</span>
      </div>
      <svg
        class="chart-card__logo"
        width="36"
        height="21"
        viewBox="0 0 36 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M32.8684 4.75502C32.7268 4.99414 32.6646 5.38803 32.5886 5.62961C32.321 6.47963 32.0812 7.33784 31.8145 8.18867C31.2344 10.0394 30.3883 11.8139 29.3033 13.4214C26.6473 17.3554 22.5283 19.9587 17.7391 20.2044C17.4601 20.2183 17.1811 20.2257 16.9021 20.2257C14.8074 20.2257 12.7201 19.7909 10.8324 18.8737C5.60791 16.3351 2.60579 10.6839 3.35366 8.9871C3.55167 8.53752 4.05489 8.246 4.54502 8.27466C5.90084 8.35491 6.47197 10.0607 7.09793 11.0139C7.8548 12.1661 8.73195 13.2339 9.85458 14.0479C11.6277 15.3336 13.7715 15.9412 15.9505 15.9412C19.3871 15.9412 22.4571 14.4017 24.515 11.6543C25.9854 9.69054 26.9173 7.33211 27.4394 4.94583C27.5326 4.51836 27.8558 3.79527 27.3862 3.49064C26.7447 3.07382 25.8708 3.5537 25.1557 3.39729C24.5731 3.26954 24.0175 2.81587 23.9717 2.22135C23.9414 1.82336 24.1443 1.43438 24.4315 1.1576C25.1074 0.509026 26.1384 0.342789 27.0311 0.235513C28.5661 0.0504411 30.151 0.0127721 31.6656 0.368994C33.0762 0.700648 34.5531 1.45486 35.463 2.61442C35.7453 2.97392 35.981 3.39483 35.999 3.85178C36.017 4.30872 35.765 4.79843 35.3305 4.93928C34.9263 5.0703 34.4959 4.88196 34.1039 4.71818C33.7848 4.58469 33.1957 4.34639 32.924 4.67559C32.9044 4.69934 32.8864 4.72636 32.8692 4.75502H32.8684Z"
          fill="currentColor"
        />
        <path
          d="M0.00143602 3.60144C-0.0501131 4.76835 1.29589 4.92803 2.47416 4.5579C3.9298 4.10014 5.48282 3.95274 6.99738 4.13453C7.61352 4.20905 8.26811 4.33107 8.83351 4.07557C10.4618 3.3394 9.36864 1.9088 8.45221 1.19637C7.33204 0.325891 5.87067 -0.119584 4.45593 0.027816C2.86364 0.19405 0.776309 1.30037 0.165084 2.89146C0.0619858 3.16088 0.00961825 3.3959 0.00061761 3.60062L0.00143602 3.60144Z"
          fill="currentColor"
        />
      </svg>
    </header>

    <div class="chart-card__canvas">
      <slot />
    </div>

    <footer class="chart-card__footer">
      <div class="chart-card__footer-start">
        <slot name="footer-start" />
      </div>
      <span class="chart-card__footer-mark">www.jota.ai</span>
    </footer>
  </section>
</template>

<style scoped>
.chart-card {
  --chart-card-padding: 1rem;
  --chart-card-section-width: 16.75rem;
  --chart-card-header-height: 1.5rem;
  --chart-card-canvas-height: 13.375rem;
  --chart-card-footer-height: 0.375rem;
  --chart-card-header-gap: 1rem;
  --chart-card-footer-gap: 0.5rem;
  --chart-card-title-size: 0.8125rem;
  --chart-label-size: 0.6875rem;
  --chart-outer-legend-size: 0.375rem;
  --chart-legend-swatch-size: 0.25rem;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 18.75rem;
  height: 18.75rem;
  padding: var(--chart-card-padding);
  margin: 0;
  box-sizing: border-box;
  background: #ffffff;
  border-radius: var(--arcade-radius-large);
  color: #111111;
  overflow: hidden;
}

.chart-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  flex: 0 0 var(--chart-card-header-height);
  width: var(--chart-card-section-width);
  height: var(--chart-card-header-height);
  margin: 0 0 var(--chart-card-header-gap);
  overflow: visible;
}

.chart-card__titles {
  position: relative;
  display: block;
  min-width: 0;
  height: 100%;
  flex: 1 1 auto;
  overflow: visible;
}

.chart-card__title,
.chart-card__subtitle {
  font-family: var(--arcade-font-medium);
  font-size: var(--chart-card-title-size);
  font-weight: 500;
  font-kerning: normal;
  letter-spacing: 0;
  line-height: 0.9;
}

.chart-card__title {
  position: absolute;
  left: 0;
  color: #111111;
  margin: 0;
  white-space: nowrap;
}

.chart-card__title-superscript {
  position: relative;
  top: -0.25rem;
  margin-left: 0;
  font-family: var(--arcade-font-medium);
  font-size: 0.4375rem;
  font-weight: 500;
  line-height: 1;
  vertical-align: baseline;
}

.chart-card__logo {
  display: block;
  flex: 0 0 auto;
  width: 1.3rem;
  height: 0.7583rem;
  margin-top: 0.125rem;
  margin-right: 0.1rem;
  align-self: flex-start;
  color: #111111;
}

.chart-card__subtitle {
  position: absolute;
  top: 0.9rem;
  left: 0;
  color: #8a8a8a;
  white-space: nowrap;
}

.chart-card__canvas {
  flex: 0 0 var(--chart-card-canvas-height);
  position: relative;
  width: var(--chart-card-section-width);
  height: var(--chart-card-canvas-height);
  min-height: 0;
  display: flex;
  margin: 0;
  overflow: hidden;
}

.chart-card__canvas > :deep(*) {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.chart-card__footer {
  flex: 0 0 var(--chart-card-footer-height);
  width: var(--chart-card-section-width);
  height: var(--chart-card-footer-height);
  margin: var(--chart-card-footer-gap) 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-family: var(--arcade-font-regular);
  font-size: var(--chart-outer-legend-size);
  line-height: 1;
  letter-spacing: 0;
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
