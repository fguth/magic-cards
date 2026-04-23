<script setup lang="ts">
defineOptions({ name: 'PlaceholderScreen' })

interface Props {
  label: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="placeholder-screen">
    <div class="placeholder-screen__halo" />
    <div class="placeholder-screen__content">
      <h1 class="placeholder-screen__title">{{ props.label }}</h1>
    </div>
  </div>
</template>

<style scoped>
.placeholder-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--arcade-bg-subtle, #f2f2f2);
  color: var(--arcade-text-standard, #000);
  display: flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
}

.placeholder-screen__halo {
  position: absolute;
  inset: -20%;
  background: radial-gradient(circle at 50% 35%, var(--profile-accent, #888888) 0%, transparent 55%);
  opacity: calc(0.4 * var(--profile-halo-visibility, 1));
  filter: blur(2em);
  z-index: 0;
}

.placeholder-screen__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  z-index: 1;
  padding: 0 1.5em;
  text-align: center;
}

.placeholder-screen__title {
  font-family: var(--arcade-font-medium, inherit);
  font-size: calc(14cqi * var(--card-title-scale, 1));
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1;
  white-space: nowrap;
}
</style>
