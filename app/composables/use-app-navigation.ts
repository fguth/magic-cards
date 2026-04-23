import { profiles, defaultProfileIndex } from '~/config/profiles'

export type ViewMode = 'pages' | 'grid'
export type GridMotionPhase = 'idle' | 'entering' | 'exiting'

const GRID_MOTION_SETTLE_MS = 820

let gridMotionTimer: ReturnType<typeof setTimeout> | null = null

export function useAppNavigation() {
  const activeProfileIndex = useState<number>('app-nav/active-profile', () => defaultProfileIndex)
  const activePageIndex = useState<number>('app-nav/active-page', () => 1)
  const viewMode = useState<ViewMode>('app-nav/view-mode', () => 'pages')
  const gridMotionPhase = useState<GridMotionPhase>('app-nav/grid-motion-phase', () => 'idle')
  const gridMotionSourceIndex = useState<number | null>('app-nav/grid-motion-source', () => defaultProfileIndex)
  const gridMotionTargetIndex = useState<number | null>('app-nav/grid-motion-target', () => null)
  const chatModeByProfile = useState<Record<string, boolean>>('app-nav/chat-mode', () => ({}))

  const profileCount = computed(() => profiles.length)
  const activeProfile = computed(() => profiles[activeProfileIndex.value])
  const activePage = computed(() => activeProfile.value?.pages[activePageIndex.value])
  const isGridView = computed(() => viewMode.value === 'grid')

  function isChatModeActive(profileId: string) {
    return Boolean(chatModeByProfile.value[profileId])
  }

  const activeProfileChatMode = computed(() => {
    const profile = activeProfile.value
    if (!profile) return false
    if (viewMode.value === 'grid') return false
    return Boolean(chatModeByProfile.value[profile.id])
  })

  function setChatMode(profileId: string, value: boolean) {
    if (Boolean(chatModeByProfile.value[profileId]) === value) return
    chatModeByProfile.value = { ...chatModeByProfile.value, [profileId]: value }
  }

  function closeActiveChatMode() {
    const profile = activeProfile.value
    if (!profile) return
    setChatMode(profile.id, false)
  }

  function clearGridMotionReset() {
    if (!gridMotionTimer) return
    clearTimeout(gridMotionTimer)
    gridMotionTimer = null
  }

  function scheduleGridMotionReset() {
    clearGridMotionReset()
    gridMotionTimer = setTimeout(() => {
      gridMotionPhase.value = 'idle'
      gridMotionSourceIndex.value = activeProfileIndex.value
      gridMotionTargetIndex.value = null
      gridMotionTimer = null
    }, GRID_MOTION_SETTLE_MS)
  }

  function enterGridView() {
    if (viewMode.value === 'grid' && gridMotionPhase.value !== 'exiting') return
    gridMotionSourceIndex.value = activeProfileIndex.value
    gridMotionTargetIndex.value = activeProfileIndex.value
    viewMode.value = 'grid'
    gridMotionPhase.value = 'entering'
    scheduleGridMotionReset()
  }

  function exitGridView(profileIndex?: number) {
    const nextProfileIndex = profileIndex == null
      ? activeProfileIndex.value
      : clamp(profileIndex, 0, profiles.length - 1)
    gridMotionSourceIndex.value = activeProfileIndex.value
    gridMotionTargetIndex.value = nextProfileIndex
    activeProfileIndex.value = nextProfileIndex
    activePageIndex.value = 1
    viewMode.value = 'pages'
    gridMotionPhase.value = 'exiting'
    scheduleGridMotionReset()
  }

  function toggleGridView() {
    if (viewMode.value === 'pages') enterGridView()
    else exitGridView()
  }

  function setActiveProfile(i: number) {
    activeProfileIndex.value = clamp(i, 0, profiles.length - 1)
  }

  function setActivePage(i: number) {
    activePageIndex.value = clamp(i, 0, 2)
  }

  function nextPage() {
    setActivePage(activePageIndex.value + 1)
  }

  function previousPage() {
    setActivePage(activePageIndex.value - 1)
  }

  return {
    profiles,
    profileCount,
    activeProfileIndex,
    activePageIndex,
    activeProfile,
    activePage,
    viewMode,
    isGridView,
    gridMotionPhase,
    gridMotionSourceIndex,
    gridMotionTargetIndex,
    chatModeByProfile,
    activeProfileChatMode,
    isChatModeActive,
    setChatMode,
    closeActiveChatMode,
    enterGridView,
    exitGridView,
    toggleGridView,
    setActiveProfile,
    setActivePage,
    nextPage,
    previousPage,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
