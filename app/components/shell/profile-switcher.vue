<script setup lang="ts">
defineOptions({ name: 'ProfileSwitcher' })

const { isGridView, enterGridView, exitGridView } = useAppNavigation()

const PINCH_IN_THRESHOLD = 0.82
const PINCH_OUT_THRESHOLD = 1.18
const WHEEL_DELTA_THRESHOLD = 24

const viewportEl = ref<HTMLElement | null>(null)

let initialPinchDistance = 0
let wheelAccumulator = 0
let pinchResolvedThisGesture = false

function pointerDistance(a: Touch, b: Touch) {
  return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 2 && event.touches[0] && event.touches[1]) {
    initialPinchDistance = pointerDistance(event.touches[0], event.touches[1])
    pinchResolvedThisGesture = false
  }
}

function onTouchMove(event: TouchEvent) {
  if (
    event.touches.length !== 2
    || !event.touches[0]
    || !event.touches[1]
    || initialPinchDistance === 0
    || pinchResolvedThisGesture
  ) return

  const current = pointerDistance(event.touches[0], event.touches[1])
  const ratio = current / initialPinchDistance

  if (!isGridView.value && ratio < PINCH_IN_THRESHOLD) {
    enterGridView()
    pinchResolvedThisGesture = true
  } else if (isGridView.value && ratio > PINCH_OUT_THRESHOLD) {
    exitGridView()
    pinchResolvedThisGesture = true
  }
}

function onTouchEnd(event: TouchEvent) {
  if (event.touches.length < 2) {
    initialPinchDistance = 0
    pinchResolvedThisGesture = false
  }
}

function onWheel(event: WheelEvent) {
  if (!event.ctrlKey) return
  event.preventDefault()
  wheelAccumulator += event.deltaY
  if (!isGridView.value && wheelAccumulator > WHEEL_DELTA_THRESHOLD) {
    enterGridView()
    wheelAccumulator = 0
  } else if (isGridView.value && wheelAccumulator < -WHEEL_DELTA_THRESHOLD) {
    exitGridView()
    wheelAccumulator = 0
  }
}

onMounted(() => {
  const el = viewportEl.value
  if (!el) return
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: true })
  el.addEventListener('touchend', onTouchEnd, { passive: true })
  el.addEventListener('touchcancel', onTouchEnd, { passive: true })
  el.addEventListener('wheel', onWheel, { passive: false })
})

onBeforeUnmount(() => {
  const el = viewportEl.value
  if (!el) return
  el.removeEventListener('touchstart', onTouchStart)
  el.removeEventListener('touchmove', onTouchMove)
  el.removeEventListener('touchend', onTouchEnd)
  el.removeEventListener('touchcancel', onTouchEnd)
  el.removeEventListener('wheel', onWheel)
})

watch(isGridView, () => {
  wheelAccumulator = 0
})
</script>

<template>
  <div ref="viewportEl" class="profile-switcher">
    <ProfileRail />
  </div>
</template>

<style scoped>
.profile-switcher {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
  background: var(--arcade-bg-app, #fff);
  perspective: 160em;
  transform-style: preserve-3d;
}
</style>
