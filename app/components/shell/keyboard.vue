<script setup lang="ts">
import keyboardLight from '@/assets/images/keyboard/keyboard-light.png'
import keyboardDark from '@/assets/images/keyboard/keyboard-dark.png'

defineOptions({ name: 'Keyboard' })

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

const { isDark } = useArcadeTheme()

const keyboardSrc = computed(() => (isDark.value ? keyboardDark : keyboardLight))

const rootEl = ref<HTMLElement | null>(null)

function updateKeyboardHeight() {
  const el = rootEl.value
  if (!el) return
  const container = el.closest('.profile-container') as HTMLElement | null
  if (!container) return
  container.style.setProperty('--keyboard-height', `${el.offsetHeight}px`)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  updateKeyboardHeight()
  const el = rootEl.value
  if (!el) return
  const observer = new ResizeObserver(() => updateKeyboardHeight())
  observer.observe(el)
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <div
    ref="rootEl"
    class="keyboard"
    :class="{
      'keyboard--dark': isDark,
      'keyboard--visible': props.isVisible,
    }"
    aria-hidden="true"
  >
    <img
      class="keyboard__image"
      :src="keyboardSrc"
      alt=""
      draggable="false"
      @load="updateKeyboardHeight"
    >
  </div>
</template>

<style scoped>
.keyboard {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 6;
  pointer-events: none;
  display: block;
  transform: translate3d(0, 100%, 0);
  transition: transform 360ms var(--arcade-spring-smooth, cubic-bezier(0.32, 0.72, 0, 1));
  will-change: transform;
}

.keyboard--visible {
  transform: translate3d(0, 0, 0);
  pointer-events: auto;
}

.keyboard__image {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
