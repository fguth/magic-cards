<script setup lang="ts">
defineOptions({ name: 'ArcadeToast' })

interface ArcadeToastProps {
  headline: string
  body?: string
  icon?: string
  buttonLabel?: string
  visible?: boolean
  autoDismiss?: boolean
  dismissDuration?: number
}

const props = withDefaults(defineProps<ArcadeToastProps>(), {
  body: undefined,
  icon: undefined,
  buttonLabel: undefined,
  visible: true,
  autoDismiss: true,
  dismissDuration: undefined
})

const emit = defineEmits<{
  dismiss: []
  action: []
}>()

const { isDark } = useArcadeTheme()

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const iconSvg = computed(() => props.icon ? resolveIcon(props.icon) : '')

const defaultDuration = computed(() => props.buttonLabel ? 5000 : 3000)
const duration = computed(() => props.dismissDuration ?? defaultDuration.value)

const isShowing = ref(false)
const isLeaving = ref(false)
let dismissTimer: ReturnType<typeof setTimeout> | null = null

function startDismissTimer() {
  clearDismissTimer()
  if (!props.autoDismiss) return
  dismissTimer = setTimeout(() => {
    dismiss()
  }, duration.value)
}

function clearDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

function dismiss() {
  isLeaving.value = true
  setTimeout(() => {
    isShowing.value = false
    isLeaving.value = false
    emit('dismiss')
  }, 200)
}

function handleAction() {
  emit('action')
  dismiss()
}

watch(() => props.visible, (val) => {
  if (val) {
    isLeaving.value = false
    isShowing.value = true
    nextTick(() => startDismissTimer())
  } else {
    clearDismissTimer()
    if (isShowing.value) dismiss()
  }
}, { immediate: true })

onUnmounted(() => clearDismissTimer())
</script>

<template>
  <Transition name="arcade-toast">
    <div
      v-if="isShowing && !isLeaving"
      class="arcade-toast-container"
      :class="{ 'arcade-toast-container--dark': isDark }"
      role="status"
      aria-live="polite"
    >
      <div class="arcade-toast">
        <span v-if="icon && iconSvg" class="arcade-toast__icon" v-html="iconSvg" />

        <div class="arcade-toast__text">
          <p class="arcade-toast__headline">{{ headline }}</p>
          <p v-if="body" class="arcade-toast__body">{{ body }}</p>
        </div>

        <button
          v-if="buttonLabel"
          class="arcade-toast__button"
          @click="handleAction"
        >
          {{ buttonLabel }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.arcade-toast-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 0.25em;
  pointer-events: none;
}

.arcade-toast {
  display: flex;
  align-items: center;
  gap: 0.25em;
  min-height: 1.75em;
  padding: 0.25em 0.5em;
  border-radius: var(--arcade-radius-small);
  pointer-events: auto;
  background: var(--arcade-bg-inverse);
}

.arcade-toast-container--dark .arcade-toast {
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(0.625rem);
  -webkit-backdrop-filter: blur(0.625rem);
}

.arcade-toast__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.arcade-toast__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-toast__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.0625em;
  padding: 0.25em 0;
}

.arcade-toast__headline {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  color: #fff;
  margin: 0;
}

.arcade-toast__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.43;
  letter-spacing: -0.0025em;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.arcade-toast__button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375em 0.5em;
  border: none;
  border-radius: var(--arcade-radius-xsmall);
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: background-color var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  color: #fff;
}

.arcade-toast__button:active {
  background: rgba(255, 255, 255, 0.25);
}

.arcade-toast-enter-active {
  transition: opacity var(--arcade-duration-normal) var(--arcade-ease-default),
              transform var(--arcade-duration-normal) var(--arcade-ease-default);
}

.arcade-toast-leave-active {
  transition: opacity var(--arcade-duration-normal) ease-in,
              transform var(--arcade-duration-normal) ease-in;
}

.arcade-toast-enter-from {
  opacity: 0;
  transform: translateY(0.25em);
}

.arcade-toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.arcade-toast-leave-from {
  opacity: 1;
  transform: scale(1);
}

.arcade-toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
