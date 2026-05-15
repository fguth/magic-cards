<script setup lang="ts">
defineOptions({ name: 'AppTopNav' })

const GRID_BUTTON_TAP_DELAY_MS = 200
const GRID_BUTTON_REAPPEAR_DELAY_MS = 260

const {
  isGridView,
  enterGridView,
  gridMotionPhase,
  activeProfileChatMode,
  closeActiveChatMode,
} = useAppNavigation()

const canShowOnExit = ref(false)

watch(gridMotionPhase, (phase) => {
  if (phase === 'exiting') {
    canShowOnExit.value = false
    window.setTimeout(() => {
      if (gridMotionPhase.value === 'exiting' || gridMotionPhase.value === 'idle') {
        canShowOnExit.value = true
      }
    }, GRID_BUTTON_REAPPEAR_DELAY_MS)
  } else if (phase === 'idle') {
    canShowOnExit.value = true
  } else {
    canShowOnExit.value = false
  }
}, { immediate: true })

const gridPhaseAllowsButton = computed(() => {
  if (gridMotionPhase.value === 'idle') return true
  return gridMotionPhase.value === 'exiting' && canShowOnExit.value
})

const leadingButtonKey = computed(() => {
  if (isGridView.value) return 'none'
  if (!gridPhaseAllowsButton.value) return 'none'
  return activeProfileChatMode.value ? 'back' : 'grid'
})

let gridTapTimer: ReturnType<typeof setTimeout> | null = null

function handleGridTap() {
  if (gridTapTimer) return
  gridTapTimer = setTimeout(() => {
    gridTapTimer = null
    enterGridView()
  }, GRID_BUTTON_TAP_DELAY_MS)
}

function handleBackTap() {
  closeActiveChatMode()
}

onBeforeUnmount(() => {
  if (gridTapTimer) clearTimeout(gridTapTimer)
})
</script>

<template>
  <header class="app-top-nav">
    <TitleBar variant="transparent" :show-title="false">
      <template #leading>
        <Transition name="app-top-nav__grid-fade" mode="out-in">
          <ButtonGlass
            v-if="leadingButtonKey === 'grid'"
            key="grid"
            class="app-top-nav__grid-button"
            icon="grid-view"
            aria-label="Abrir visão em grade"
            @click="handleGridTap"
          />
          <ButtonGlass
            v-else-if="leadingButtonKey === 'back'"
            key="back"
            class="app-top-nav__grid-button"
            icon="back"
            aria-label="Fechar conversa"
            @click="handleBackTap"
          />
        </Transition>
      </template>
    </TitleBar>
  </header>
</template>

<style scoped>
.app-top-nav {
  position: relative;
  width: 100%;
}

.app-top-nav__grid-fade-enter-active,
.app-top-nav__grid-fade-leave-active {
  transition:
    opacity 140ms var(--arcade-ease-out),
    transform 180ms var(--arcade-spring-smooth);
}

.app-top-nav__grid-fade-enter-from,
.app-top-nav__grid-fade-leave-to {
  opacity: 0;
  transform: scale(0.88);
}

.app-top-nav :deep(.arcade-title-bar__content) {
  padding: 0.3125em 0.5em;
  padding-top: calc(max(1.9375em, env(safe-area-inset-top, 0)) + 0.3125em);
}
</style>
