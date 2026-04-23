<script setup lang="ts">
import type { ProfileDef } from '~/config/profiles'

defineOptions({ name: 'PageDeck' })

interface Props {
  profile: ProfileDef
  profileIndex: number
}

const props = defineProps<Props>()

const PAGE_COUNT = 3
const SWIPE_COMMIT_RATIO = 0.18
const SWIPE_DIRECTION_THRESHOLD = 8

const { activeProfileIndex, activePageIndex, isGridView, setActivePage } = useAppNavigation()

const isInteractive = computed(
  () => !isGridView.value && activeProfileIndex.value === props.profileIndex,
)

const deckEl = ref<HTMLElement | null>(null)
const dragOffset = ref(0)
const isDragging = ref(false)

const transformStyle = computed(() => {
  const scale = isGridView.value ? 0.965 : 1
  const base = `translateX(calc(-1 * ${activePageIndex.value} * (100% / ${PAGE_COUNT}))) scale(${scale})`
  if (!isDragging.value || dragOffset.value === 0) {
    return { transform: base }
  }
  return {
    transform: `translateX(calc(-1 * ${activePageIndex.value} * (100% / ${PAGE_COUNT}) + ${dragOffset.value}px)) scale(1)`,
    transition: 'none',
  }
})

const pageWidthStyle = computed(() => ({
  width: `calc(100% / ${PAGE_COUNT})`,
}))

let activePointerId: number | null = null
let startX = 0
let startY = 0
let directionLocked: 'horizontal' | 'vertical' | null = null

function onPointerDown(event: PointerEvent) {
  if (!isInteractive.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  activePointerId = event.pointerId
  startX = event.clientX
  startY = event.clientY
  directionLocked = null
  isDragging.value = false
  dragOffset.value = 0
}

function onPointerMove(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY

  if (!directionLocked) {
    if (Math.abs(deltaX) < SWIPE_DIRECTION_THRESHOLD && Math.abs(deltaY) < SWIPE_DIRECTION_THRESHOLD) return
    directionLocked = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    if (directionLocked === 'horizontal') {
      isDragging.value = true
      try {
        deckEl.value?.setPointerCapture(event.pointerId)
      } catch {}
    }
  }

  if (directionLocked !== 'horizontal') return
  const width = deckEl.value?.clientWidth ?? 1
  const atLeftEdge = activePageIndex.value === 0 && deltaX > 0
  const atRightEdge = activePageIndex.value === PAGE_COUNT - 1 && deltaX < 0
  const resistance = atLeftEdge || atRightEdge ? 0.35 : 1
  dragOffset.value = Math.max(-width, Math.min(width, deltaX * resistance))
}

function onPointerUp(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return
  if (directionLocked === 'horizontal') {
    const width = deckEl.value?.clientWidth ?? 1
    const ratio = dragOffset.value / width
    if (ratio <= -SWIPE_COMMIT_RATIO) setActivePage(activePageIndex.value + 1)
    else if (ratio >= SWIPE_COMMIT_RATIO) setActivePage(activePageIndex.value - 1)
    try {
      deckEl.value?.releasePointerCapture(event.pointerId)
    } catch {}
  }
  activePointerId = null
  directionLocked = null
  isDragging.value = false
  dragOffset.value = 0
}
</script>

<template>
  <div
    ref="deckEl"
    class="page-deck"
    :class="{ 'page-deck--idle': !isInteractive }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="page-deck__rail" :style="transformStyle">
      <PageFrame
        v-for="(page, index) in props.profile.pages"
        :key="page.id"
        :page="page"
        :style="pageWidthStyle"
        class="page-deck__frame"
        :data-page-index="index"
      />
    </div>
  </div>
</template>

<style scoped>
.page-deck {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: pan-y;
}

.page-deck--idle {
  pointer-events: none;
}

.page-deck__rail {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  width: calc(100% * 3);
  transform-origin: center center;
  transition:
    transform var(--shell-duration-swipe) var(--shell-ease-swipe),
    opacity 220ms var(--arcade-ease-out),
    filter 220ms var(--arcade-ease-out);
  will-change: transform, opacity, filter;
}

.page-deck__frame {
  flex: 0 0 auto;
  height: 100%;
}
</style>
