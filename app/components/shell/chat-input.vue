<script setup lang="ts">
defineOptions({ name: 'ChatInput' })

interface Props {
  profileId: string
  isActive: boolean
  isGridView: boolean
  isKeyboardOpen?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  isKeyboardOpen: false,
  placeholder: 'What do you need?',
})

const emit = defineEmits<{
  activate: []
  focus: []
  blur: [hasValue: boolean]
  submit: [value: string]
}>()

const { cssVars } = useGlassConfig()
const { isDark } = useArcadeTheme()

const inputEl = ref<HTMLInputElement | null>(null)
const value = ref('')

const hasValue = computed(() => value.value.trim().length > 0)

const navIconModules = import.meta.glob(
  '@/assets/icons/navigation/*.svg',
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>

function getNavIcon(name: string): string {
  const match = Object.entries(navIconModules).find(([key]) => key.endsWith(`/${name}.svg`))
  return match ? match[1] : ''
}

const micIconSvg = computed(() => getNavIcon('microphone'))
const sendIconSvg = computed(() => getNavIcon('send'))

function handleFocus() {
  emit('activate')
  emit('focus')
}

function handleBlur() {
  emit('blur', value.value.trim().length > 0)
}

function handleActivate() {
  emit('activate')
}

function handleInput(event: Event) {
  value.value = (event.target as HTMLInputElement).value
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter') return
  if (!value.value.trim()) return
  emit('submit', value.value)
  value.value = ''
}

function handleSend() {
  if (!value.value.trim()) return
  emit('submit', value.value)
  value.value = ''
}

function handleMic() {
  inputEl.value?.focus()
}

function blurInput() {
  inputEl.value?.blur()
}

onMounted(() => {
  const el = inputEl.value
  if (!el) return
  el.addEventListener('focus', handleFocus)
  el.addEventListener('blur', handleBlur)
})

onBeforeUnmount(() => {
  const el = inputEl.value
  if (!el) return
  el.removeEventListener('focus', handleFocus)
  el.removeEventListener('blur', handleBlur)
})

function getIsEmpty() {
  return value.value.trim().length === 0
}

function clearValue() {
  value.value = ''
}

defineExpose({ blurInput, getIsEmpty, clearValue })
</script>

<template>
  <div
    class="chat-input"
    :class="{
      'chat-input--dark': isDark,
      'chat-input--active': isActive,
      'chat-input--hidden': isGridView,
      'chat-input--has-value': hasValue,
      'chat-input--keyboard-open': isKeyboardOpen && !isGridView,
    }"
    :style="cssVars"
    @pointerdown="handleActivate"
  >
    <div class="chat-input__blur-wrap">
      <div class="chat-input__blur" />
    </div>
    <div class="chat-input__fill" />
    <input
      ref="inputEl"
      v-model="value"
      class="chat-input__field"
      type="text"
      :placeholder="placeholder"
      :tabindex="isGridView ? -1 : 0"
      :aria-label="placeholder"
      @input="handleInput"
      @keydown="handleKeydown"
    >
    <button
      v-if="hasValue"
      class="chat-input__action chat-input__action--send"
      type="button"
      aria-label="Send message"
      :tabindex="isGridView ? -1 : 0"
      @click="handleSend"
    >
      <span class="chat-input__action-icon" v-html="sendIconSvg" />
    </button>
    <button
      v-else
      class="chat-input__action chat-input__action--mic"
      type="button"
      aria-label="Start voice input"
      :tabindex="isGridView ? -1 : 0"
      @click="handleMic"
    >
      <span class="chat-input__action-icon" v-html="micIconSvg" />
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  --chat-input-side: 0.6em;
  --chat-input-bottom: 2em;
  --chat-keyboard-gap: var(--chat-input-side);

  position: absolute;
  left: var(--chat-input-side);
  right: var(--chat-input-side);
  bottom: calc(env(safe-area-inset-bottom, 0) + var(--chat-input-bottom));
  height: 1.625em;
  border-radius: 999px;
  color: #000;
  isolation: isolate;
  z-index: 7;
  transform: translate3d(0, 0, 0);
  opacity: 1;
  box-shadow:
    0 0.125em 0.5em rgba(0, 0, 0, calc(var(--glass-shadow-opacity, 0.08) * 1)),
    0 0.0625em 0.125em rgba(0, 0, 0, calc(var(--glass-shadow-opacity, 0.08) * 0.55)),
    inset 0.015625em 0.015625em 0.0625em var(--glass-inset-highlight, rgba(255, 255, 255, 0.25)),
    inset -0.015625em -0.015625em 0.0625em rgba(255, 255, 255, 0.08);
  transition:
    transform 360ms var(--arcade-spring-smooth, cubic-bezier(0.32, 0.72, 0, 1)),
    opacity 220ms var(--arcade-ease-out);
  will-change: transform, opacity;
}

.chat-input--keyboard-open {
  transform: translate3d(
    0,
    calc(
      -1 * var(--keyboard-height, 9.8em)
      - var(--chat-keyboard-gap, 0.6em)
      + var(--chat-input-bottom, 2em)
    ),
    0
  );
}

.chat-input--dark {
  color: #fff;
}

.chat-input--hidden {
  transform: translate3d(0, 160%, 0);
  opacity: 0;
  pointer-events: none;
}

.chat-input__blur-wrap {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.chat-input__blur {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  -webkit-backdrop-filter: blur(var(--glass-blur, 8px)) saturate(var(--glass-saturation, 1.4));
  background: var(--glass-blur-bg, rgba(255, 255, 255, 0.1));
}

.chat-input__fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--glass-fill);
  opacity: var(--glass-fill-opacity, 0.67);
  pointer-events: none;
  z-index: 1;
}

.chat-input::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 0.03125em solid transparent;
  background: var(--glass-border-gradient) border-box;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0) border-box;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0) border-box;
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
  z-index: 3;
}

.chat-input::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 80% 40% at 50% 0%,
    var(--glass-highlight, rgba(255, 255, 255, 0.12)) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 3;
}

.chat-input__field {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 0 2.6em 0 1.6em;
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--arcade-font-regular, inherit);
  font-size: 0.5em;
  line-height: 1;
  letter-spacing: -0.005em;
  color: inherit;
  caret-color: var(--profile-accent, currentColor);
}

.chat-input__field::placeholder {
  color: currentColor;
  opacity: 0.48;
}

.chat-input__action {
  position: absolute;
  top: 50%;
  right: 0.18em;
  z-index: 4;
  width: 1.25em;
  height: 1.25em;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  color: currentColor;
  transition:
    background-color 160ms var(--arcade-ease-out),
    color 160ms var(--arcade-ease-out),
    transform 160ms var(--arcade-ease-out),
    opacity 140ms var(--arcade-ease-out);
}

.chat-input__action:active {
  opacity: 0.7;
}

.chat-input__action--mic {
  color: currentColor;
  opacity: 0.72;
}

.chat-input__action--mic:hover {
  opacity: 1;
}

.chat-input__action--send {
  background: var(--arcade-text-standard, #000);
  color: var(--arcade-bg-app, #fff);
  animation: chat-input__send-in 180ms var(--arcade-spring-soft, cubic-bezier(0.34, 1.2, 0.64, 1)) both;
}

.chat-input--dark .chat-input__action--send {
  background: var(--arcade-text-standard, #fff);
  color: var(--arcade-bg-app, #000);
}

.chat-input__action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.72em;
  height: 0.72em;
}

.chat-input__action--send .chat-input__action-icon {
  width: 0.64em;
  height: 0.64em;
}

.chat-input__action-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.chat-input__action-icon :deep(svg path) {
  fill: currentColor;
}

@keyframes chat-input__send-in {
  from {
    transform: translateY(-50%) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
}
</style>
