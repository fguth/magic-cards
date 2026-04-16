<script setup lang="ts">
defineOptions({ name: 'ArcadeDimmer' })

interface ArcadeDimmerProps {
  visible?: boolean
  opacity?: number
}

const props = withDefaults(defineProps<ArcadeDimmerProps>(), {
  visible: false,
  opacity: 0.5
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Transition name="arcade-dimmer">
    <div
      v-if="visible"
      class="arcade-dimmer"
      :style="{ '--dimmer-opacity': props.opacity }"
      @click="$emit('click', $event)"
    />
  </Transition>
</template>

<style scoped>
.arcade-dimmer {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, var(--dimmer-opacity, 0.5));
  pointer-events: auto;
}

.arcade-dimmer-enter-active,
.arcade-dimmer-leave-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-dimmer-enter-from,
.arcade-dimmer-leave-to {
  opacity: 0;
}
</style>
