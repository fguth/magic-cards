<script setup lang="ts">
defineOptions({ name: 'ArcadeTimelineRow' })

interface ArcadeTimelineRowProps {
  label: string
  body?: string
  icon?: string
  active?: boolean
  last?: boolean
}

const props = withDefaults(defineProps<ArcadeTimelineRowProps>(), {
  body: undefined,
  icon: undefined,
  active: false,
  last: false
})

const icons24 = import.meta.glob(
  '@/assets/icons/24/*.svg',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

function resolveIcon(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const iconSvg = computed(() => props.icon ? resolveIcon(props.icon) : '')
</script>

<template>
  <div
    class="arcade-timeline-row"
    :class="{
      'arcade-timeline-row--active': active,
      'arcade-timeline-row--last': last
    }"
  >
    <div class="arcade-timeline-row__left">
      <span v-if="icon && iconSvg" class="arcade-timeline-row__icon" v-html="iconSvg" />
      <span v-else class="arcade-timeline-row__dot" />
      <div v-if="!last" class="arcade-timeline-row__connector" />
    </div>
    <div class="arcade-timeline-row__right">
      <p class="arcade-timeline-row__label">{{ label }}</p>
      <p v-if="body" class="arcade-timeline-row__body">{{ body }}</p>
    </div>
  </div>
</template>

<style scoped>
.arcade-timeline-row {
  display: flex;
  flex-direction: row;
  gap: 0.5em;
  min-height: 2em;
  opacity: 0.5;
}

.arcade-timeline-row--active {
  opacity: 1;
}

.arcade-timeline-row__left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.arcade-timeline-row__dot {
  width: 0.25em;
  height: 0.25em;
  border-radius: var(--arcade-radius-circle);
  background: var(--arcade-icon-subtle);
  flex-shrink: 0;
  margin-top: 0.125em;
}

.arcade-timeline-row--active .arcade-timeline-row__dot {
  background: var(--arcade-icon-standard);
}

.arcade-timeline-row__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-subtle);
}

.arcade-timeline-row__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-timeline-row--active .arcade-timeline-row__icon {
  color: var(--arcade-icon-standard);
}

.arcade-timeline-row__connector {
  flex: 1;
  width: 0.03125rem;
  background: var(--arcade-border-subtle);
  margin: 0.125em 0;
}

.arcade-timeline-row__right {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding-bottom: 0.5em;
}

.arcade-timeline-row__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-timeline-row__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.43;
  margin: 0;
  color: var(--arcade-text-subtle);
}
</style>
