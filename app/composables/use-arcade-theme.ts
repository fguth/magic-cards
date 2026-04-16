export type ArcadeTheme = 'dark' | 'light'

export function useArcadeTheme() {
  const theme = useState<ArcadeTheme>('glass-theme', () => 'dark')
  const isDark = computed(() => theme.value === 'dark')

  function applyToDocument() {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-arcade-theme', theme.value)
    }
  }

  watch(theme, applyToDocument, { immediate: true })

  function setTheme(t: ArcadeTheme) {
    theme.value = t
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, isDark, setTheme, toggleTheme }
}
