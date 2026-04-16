<script setup lang="ts">
import type { AnimationItem } from 'lottie-web'
import loaderLight from '@/assets/lottie/Loader_lightModeStandard.json'
import loaderDark from '@/assets/lottie/Loader_darkModeStandard.json'
import confirmLight from '@/assets/lottie/Loader_lightModeStandard_confirm.json'
import confirmDark from '@/assets/lottie/Loader_darkModeStandard_confirm.json'

defineOptions({ name: 'ArcadeProgressCircular' })

interface ArcadeProgressCircularProps {
  state?: 'loading' | 'confirm'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<ArcadeProgressCircularProps>(), {
  state: 'loading',
  size: 'medium'
})

const emit = defineEmits<{ complete: [] }>()

const { isDark } = useArcadeTheme()
const loadingEl = ref<HTMLElement>()
const confirmEl = ref<HTMLElement>()
let lottie: typeof import('lottie-web').default | null = null
let loadingAnim: AnimationItem | null = null
let confirmAnim: AnimationItem | null = null

async function ensureLottie() {
  if (!lottie) {
    const mod = await import('lottie-web')
    lottie = mod.default
  }
  return lottie
}

function cloneData(data: object) {
  return JSON.parse(JSON.stringify(data))
}

async function initLoader() {
  if (!loadingEl.value) return
  const lib = await ensureLottie()

  if (loadingAnim) { loadingAnim.destroy(); loadingAnim = null }

  loadingAnim = lib.loadAnimation({
    container: loadingEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: cloneData(isDark.value ? loaderDark : loaderLight)
  })
}

async function initConfirm() {
  if (!confirmEl.value) return
  const lib = await ensureLottie()

  if (confirmAnim) { confirmAnim.destroy(); confirmAnim = null }

  confirmAnim = lib.loadAnimation({
    container: confirmEl.value,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData: cloneData(isDark.value ? confirmDark : confirmLight)
  })

  confirmAnim.addEventListener('complete', () => emit('complete'))
}

watch(() => props.state, (next) => {
  if (next === 'confirm') {
    initConfirm()
    setTimeout(() => { loadingAnim?.stop() }, 300)
  } else {
    if (confirmAnim) { confirmAnim.destroy(); confirmAnim = null }
    initLoader()
  }
})

watch(isDark, () => {
  if (props.state === 'loading') initLoader()
  else initConfirm()
})

onMounted(initLoader)

onUnmounted(() => {
  if (loadingAnim) { loadingAnim.destroy(); loadingAnim = null }
  if (confirmAnim) { confirmAnim.destroy(); confirmAnim = null }
})
</script>

<template>
  <span
    class="arcade-progress-circular"
    :class="`arcade-progress-circular--${size}`"
    role="progressbar"
  >
    <span
      ref="loadingEl"
      class="arcade-progress-circular__layer"
      :class="{ 'arcade-progress-circular__layer--active': state === 'loading' }"
    />
    <span
      ref="confirmEl"
      class="arcade-progress-circular__layer arcade-progress-circular__layer--confirm"
      :class="{ 'arcade-progress-circular__layer--active': state === 'confirm' }"
    />
  </span>
</template>

<style scoped>
.arcade-progress-circular {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.arcade-progress-circular--small {
  width: 0.5em;
  height: 0.5em;
}

.arcade-progress-circular--medium {
  width: 0.75em;
  height: 0.75em;
}

.arcade-progress-circular--large {
  width: 1.25em;
  height: 1.25em;
}

.arcade-progress-circular__layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.6);
  transition:
    opacity 0.25s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.arcade-progress-circular__layer--active {
  opacity: 1;
  transform: scale(1);
}

.arcade-progress-circular__layer--confirm {
  transform: scale(0.684);
}

.arcade-progress-circular__layer--confirm.arcade-progress-circular__layer--active {
  transform: scale(1.14);
}

.arcade-progress-circular :deep(svg) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
