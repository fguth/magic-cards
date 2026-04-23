<script setup lang="ts">
import type { ProfileDef } from '~/config/profiles'

defineOptions({ name: 'ProfileContainer' })

interface Props {
  profile: ProfileDef
  profileIndex: number
  offset: number
}

const props = defineProps<Props>()

const {
  profileCount,
  isGridView,
  exitGridView,
  gridMotionPhase,
  gridMotionSourceIndex,
  gridMotionTargetIndex,
  isChatModeActive,
  setChatMode,
} = useAppNavigation()

const chatInputRef = ref<{
  blurInput: () => void
  getIsEmpty: () => boolean
  clearValue: () => void
} | null>(null)
const isChatActive = computed(() => isChatModeActive(props.profile.id))

function onChatActivate() {
  setChatMode(props.profile.id, true)
}

function onChatBlur(hasValue: boolean) {
  if (!hasValue) setChatMode(props.profile.id, false)
}

function onContainerPointerDownCapture(event: PointerEvent) {
  if (!isChatActive.value) return
  const target = event.target as Element | null
  if (target?.closest('.chat-input')) return
  if (chatInputRef.value?.getIsEmpty()) {
    chatInputRef.value.blurInput()
    setChatMode(props.profile.id, false)
  }
}

watch(isGridView, (grid) => {
  if (grid) chatInputRef.value?.blurInput()
})

const isPressed = ref(false)
const isTransitionSource = computed(() => gridMotionSourceIndex.value === props.profileIndex)
const isTransitionTarget = computed(() => gridMotionTargetIndex.value === props.profileIndex)
const gridDistance = computed(() => Math.abs(gridOffset.value))
const stackOrder = computed(() => getStackOrder())

const gridOffset = computed(() => props.profileIndex - (profileCount.value - 1) / 2)
const exitGridTop = computed(() => getExitGridTop(props.offset))

const containerStyle = computed(() => ({
  '--offset': String(props.offset),
  '--grid-offset': String(gridOffset.value),
  '--grid-stagger': `${Math.round(gridDistance.value * 34)}ms`,
  '--exit-grid-top': exitGridTop.value,
  '--profile-accent': props.profile.accent,
  zIndex: String(stackOrder.value),
}))

const RELEASE_DELAY_MS = 200

function onClick() {
  if (!isGridView.value) return
  window.setTimeout(() => {
    exitGridView(props.profileIndex)
  }, RELEASE_DELAY_MS)
}

function onPointerDown(event: PointerEvent) {
  if (!isGridView.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  isPressed.value = true
}

function clearPressed() {
  isPressed.value = false
}

function getExitGridTop(offset: number) {
  if (offset === 0) return '0%'
  if (offset < 0) return `calc(${offset} * var(--grid-card-height))`
  if (offset === 1) return '100%'
  return `calc(100% + ${(offset - 1)} * var(--grid-card-height))`
}

function getStackOrder() {
  if (gridMotionPhase.value === 'exiting' && isTransitionTarget.value) {
    return profileCount.value + 1
  }
  return props.profileIndex + 1
}
</script>

<template>
  <div
    class="profile-container"
    :class="{
      'profile-container--grid': isGridView,
      'profile-container--pressed': isPressed,
      'profile-container--transition-source': isTransitionSource,
      'profile-container--transition-target': isTransitionTarget,
      'profile-container--entering-grid': gridMotionPhase === 'entering',
      'profile-container--exiting-grid': gridMotionPhase === 'exiting',
    }"
    :style="containerStyle"
    :role="isGridView ? 'button' : undefined"
    :tabindex="isGridView ? 0 : -1"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
    @pointerdown.capture="onContainerPointerDownCapture"
    @pointerdown="onPointerDown"
    @pointerup="clearPressed"
    @pointerleave="clearPressed"
    @pointercancel="clearPressed"
  >
    <PageDeck :profile="props.profile" :profile-index="props.profileIndex" />
    <ChatInput
      ref="chatInputRef"
      :profile-id="props.profile.id"
      :is-active="isChatActive"
      :is-grid-view="isGridView"
      :is-keyboard-open="isChatActive"
      @activate="onChatActivate"
      @blur="onChatBlur"
    />
    <Keyboard :is-visible="isChatActive && !isGridView" />
  </div>
</template>

<style scoped>
@property --card-title-scale {
  syntax: '<number>';
  inherits: true;
  initial-value: 1;
}

.profile-container {
  --grid-card-width: 88%;
  --grid-card-height: 18%;
  --grid-card-stride: 21%;
  --detail-card-stride: 100%;
  --card-title-scale: 1;

  container-type: inline-size;
  position: absolute;
  top: calc(var(--offset) * var(--detail-card-stride));
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--arcade-bg-app, #fff);
  border-radius: 1.38em;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  opacity: 1;
  transform: scale(1);
  transform-origin: center center;
  transform-style: preserve-3d;
  transition:
    top var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    left var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    width var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    height var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    border-radius var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    box-shadow var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    opacity 220ms var(--arcade-ease-out),
    filter 240ms var(--arcade-ease-out),
    --card-title-scale var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    transform var(--shell-transform-duration-active) var(--shell-morph-ease-active);
  will-change: top, left, width, height, transform, opacity, filter;
}

.profile-container--grid {
  --arcade-bg-subtle: var(--grid-card-bg, var(--arcade-bg-app));
  --profile-halo-visibility: 0;

  top: calc(50% - var(--grid-card-height) / 2 + var(--grid-offset) * var(--grid-card-stride));
  left: calc(50% - var(--grid-card-width) / 2);
  width: var(--grid-card-width);
  height: var(--grid-card-height);
  --card-title-scale: 0.64;
  border-radius: 1.16em;
  background: var(--grid-card-bg, var(--arcade-bg-app, #fff));
  box-shadow:
    0 1.2em 2.4em rgba(0, 0, 0, 0.28),
    0 0 0 0.05em rgba(255, 255, 255, 0.06);
  transform: translate3d(0, 0, 0) scale(1);
  cursor: pointer;
}

[data-arcade-theme="dark"] .profile-container--grid {
  --grid-card-bg: #1c1c1e;
  box-shadow:
    0 1.2em 2.4em rgba(0, 0, 0, 0.5),
    0 0 0 0.05em rgba(255, 255, 255, 0.08);
}

.profile-container--entering-grid.profile-container--grid:not(.profile-container--transition-source) {
  transition-delay: var(--grid-stagger);
}

.profile-container--exiting-grid:not(.profile-container--transition-target) {
  --arcade-bg-subtle: var(--grid-card-bg, var(--arcade-bg-app));
  --profile-halo-visibility: 0;

  top: var(--exit-grid-top);
  left: calc(50% - var(--grid-card-width) / 2);
  width: var(--grid-card-width);
  height: var(--grid-card-height);
  --card-title-scale: 0.64;
  border-radius: 1.16em;
  background: var(--grid-card-bg, var(--arcade-bg-app, #fff));
  box-shadow:
    0 1.2em 2.4em rgba(0, 0, 0, 0.28),
    0 0 0 0.05em rgba(255, 255, 255, 0.06);
  opacity: 0;
  filter: blur(0.16em);
}

[data-arcade-theme="dark"] .profile-container--exiting-grid:not(.profile-container--transition-target) {
  --grid-card-bg: #1c1c1e;
}

.profile-container--exiting-grid.profile-container--transition-target {
  --shell-morph-duration-active: 700ms;
  --shell-transform-duration-active: 760ms;
  box-shadow: 0 0.4em 1em rgba(0, 0, 0, 0.12);
}

.profile-container--grid.profile-container--pressed {
  transform: scale(0.97);
  box-shadow:
    0 0.6em 1.2em rgba(0, 0, 0, 0.2),
    0 0 0 0.05em rgba(255, 255, 255, 0.06);
  transition:
    transform 120ms var(--arcade-ease-out),
    box-shadow 120ms var(--arcade-ease-out);
}
</style>
