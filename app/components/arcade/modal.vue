<script setup lang="ts">
defineOptions({ name: 'ArcadeModal' })

interface ArcadeModalProps {
  visible?: boolean
  title?: string
  showClose?: boolean
}

withDefaults(defineProps<ArcadeModalProps>(), {
  visible: false,
  title: undefined,
  showClose: true
})

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="arcade-modal-backdrop">
      <div
        v-if="visible"
        class="arcade-modal-backdrop"
        @click.self="$emit('close')"
      >
        <Transition name="arcade-modal" appear>
          <div
            v-if="visible"
            class="arcade-modal"
            role="dialog"
            aria-modal="true"
          >
            <div v-if="title || showClose" class="arcade-modal__header">
              <span class="arcade-modal__title">{{ title }}</span>
              <button
                v-if="showClose"
                class="arcade-modal__close"
                aria-label="Close"
                @click="$emit('close')"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>

            <div class="arcade-modal__content">
              <slot />
            </div>

            <div v-if="$slots.footer" class="arcade-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.arcade-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.arcade-modal {
  position: relative;
  width: 100%;
  max-width: 11.25em;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: var(--arcade-bg-app);
  border-radius: var(--arcade-radius-medium);
  overflow: hidden;
}

.arcade-modal__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  flex-shrink: 0;
}

.arcade-modal__title {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  color: var(--arcade-text-standard);
}

.arcade-modal__close {
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

.arcade-modal__close svg {
  width: 100%;
  height: 100%;
}

.arcade-modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5em;
}

.arcade-modal__footer {
  flex-shrink: 0;
  padding: 0.5em;
}

.arcade-modal-backdrop-enter-active,
.arcade-modal-backdrop-leave-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-modal-backdrop-enter-from,
.arcade-modal-backdrop-leave-to {
  opacity: 0;
}

.arcade-modal-enter-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-spring-smooth),
              transform var(--arcade-duration-normal) var(--arcade-spring-smooth);
}

.arcade-modal-leave-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-ease-default),
              transform var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-modal-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.arcade-modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
