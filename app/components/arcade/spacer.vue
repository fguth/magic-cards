<script setup lang="ts">
defineOptions({ name: 'ArcadeSpacer' })

interface ArcadeSpacerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
}

withDefaults(defineProps<ArcadeSpacerProps>(), {
  size: 'medium'
})
</script>

<template>
  <div class="arcade-spacer" :class="`arcade-spacer--${size}`" aria-hidden="true" />
</template>

<style scoped>
.arcade-spacer {
  flex-shrink: 0;
  width: 100%;
}

.arcade-spacer--xsmall { height: 0.125em; }
.arcade-spacer--small { height: 0.25em; }
.arcade-spacer--medium { height: 0.5em; }
.arcade-spacer--large { height: 1em; }
.arcade-spacer--xlarge { height: 2em; }
</style>
