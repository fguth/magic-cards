<script setup lang="ts">
defineOptions({ name: 'ArcadeSheet' })

interface ArcadeSheetProps {
  visible?: boolean
  title?: string
  showHandle?: boolean
  showClose?: boolean
}

withDefaults(defineProps<ArcadeSheetProps>(), {
  visible: false,
  title: undefined,
  showHandle: true,
  showClose: false
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="arcade-sheet-backdrop">
      <div
        v-if="visible"
        class="arcade-sheet-backdrop"
        @click.self="$emit('close')"
      />
    </Transition>

    <Transition name="arcade-sheet">
      <div
        v-if="visible"
        class="arcade-sheet"
        role="dialog"
        aria-modal="true"
      >
        <div v-if="showHandle" class="arcade-sheet__handle-area">
          <div class="arcade-sheet__handle" />
        </div>

        <div v-if="title || showClose" class="arcade-sheet__header">
          <span class="arcade-sheet__title">{{ title }}</span>
          <button
            v-if="showClose"
            class="arcade-sheet__close"
            aria-label="Close"
            @click="$emit('close')"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div class="arcade-sheet__content">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.arcade-sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}

.arcade-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--arcade-bg-app);
  border-radius: var(--arcade-radius-medium) var(--arcade-radius-medium) 0 0;
  overflow: hidden;
}

.arcade-sheet__handle-area {
  display: flex;
  justify-content: center;
  padding-top: 0.25em;
  flex-shrink: 0;
}

.arcade-sheet__handle {
  width: 1.25em;
  height: 0.125em;
  border-radius: var(--arcade-radius-pill);
  background: var(--arcade-border-subtle);
}

.arcade-sheet__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  flex-shrink: 0;
}

.arcade-sheet__title {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  color: var(--arcade-text-standard);
}

.arcade-sheet__close {
  position: absolute;
  top: 50%;
  right: 0.5em;
  transform: translateY(-50%);
  width: 0.75em;
  height: 0.75em;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--arcade-icon-standard);
  -webkit-tap-highlight-color: transparent;
}

.arcade-sheet__close svg {
  width: 100%;
  height: 100%;
}

.arcade-sheet__content {
  flex: 1;
  overflow-y: auto;
  padding: 0 0.5em 0.5em;
}

.arcade-sheet-backdrop-enter-active,
.arcade-sheet-backdrop-leave-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-sheet-backdrop-enter-from,
.arcade-sheet-backdrop-leave-to {
  opacity: 0;
}

.arcade-sheet-enter-active {
  transition: transform var(--arcade-duration-slow) var(--arcade-spring-smooth);
}

.arcade-sheet-leave-active {
  transition: transform var(--arcade-duration-normal) ease-in;
}

.arcade-sheet-enter-from,
.arcade-sheet-leave-to {
  transform: translateY(100%);
}
</style>
