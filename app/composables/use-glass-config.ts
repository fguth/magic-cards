export type GlassTheme = 'dark' | 'light'

export interface GlassConfig {
  backgroundColor: string
  backgroundOpacity: number
  blur: number
  saturation: number
  shadowOpacity: number
  borderOpacity: number
}

export const glassThemeDefaults: Record<GlassTheme, GlassConfig> = {
  dark: {
    backgroundColor: '#252525',
    backgroundOpacity: 0.8,
    blur: 8,
    saturation: 1.4,
    shadowOpacity: 0.1,
    borderOpacity: 0.2
  },
  light: {
    backgroundColor: '#f7f7f7',
    backgroundOpacity: 0.85,
    blur: 8,
    saturation: 1.4,
    shadowOpacity: 0.06,
    borderOpacity: 0.12
  }
}

export const glassConfigDefaults: GlassConfig = glassThemeDefaults.dark

interface GlassThemeVars {
  fill: string
  fillOpacity: number
  overlay: string
  activeBg: string
  activeColor: string
  iconColor: string
  borderGradient: string
  highlight: string
  insetHighlight: string
  blurBg: string
}

const darkVars: GlassThemeVars = {
  fill: [
    'linear-gradient(90deg, rgba(102, 102, 102, 0.03), rgba(102, 102, 102, 0.03))',
    'linear-gradient(90deg, rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.33))',
    'linear-gradient(90deg, rgba(204, 204, 204, 0.3), rgba(204, 204, 204, 0.2))'
  ].join(', '),
  fillOpacity: 0.67,
  overlay: 'transparent',
  activeBg: 'rgba(0, 0, 0, 0.4)',
  activeColor: '#ffffff',
  iconColor: '#959595',
  borderGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.12) 40%, rgba(255, 255, 255, 0.04) 100%)',
  highlight: 'rgba(255, 255, 255, 0.07)',
  insetHighlight: 'rgba(255, 255, 255, 0.15)',
  blurBg: 'rgba(0, 0, 0, 0.1)'
}

const lightVars: GlassThemeVars = {
  fill: [
    'linear-gradient(90deg, rgba(200, 200, 200, 0.03), rgba(200, 200, 200, 0.03))',
    'linear-gradient(90deg, rgba(255, 255, 255, 0.33), rgba(255, 255, 255, 0.33))',
    'linear-gradient(90deg, rgba(240, 240, 240, 0.3), rgba(240, 240, 240, 0.2))'
  ].join(', '),
  fillOpacity: 0.67,
  overlay: 'transparent',
  activeBg: 'rgba(0, 0, 0, 0.12)',
  activeColor: '#000000',
  iconColor: '#666666',
  borderGradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 40%, rgba(255, 255, 255, 0.08) 100%)',
  highlight: 'rgba(255, 255, 255, 0.12)',
  insetHighlight: 'rgba(255, 255, 255, 0.25)',
  blurBg: 'rgba(255, 255, 255, 0.1)'
}

const themeVarSets: Record<GlassTheme, GlassThemeVars> = { dark: darkVars, light: lightVars }

export interface GlassControlDescriptor {
  key: keyof GlassConfig
  label: string
  kind: 'range' | 'color'
  min?: number
  max?: number
  step?: number
}

export const glassControls: GlassControlDescriptor[] = [
  { key: 'backgroundColor', label: 'BG Color', kind: 'color' },
  { key: 'backgroundOpacity', label: 'BG Opacity', kind: 'range', min: 0, max: 1, step: 0.01 },
  { key: 'blur', label: 'Blur', kind: 'range', min: 0, max: 100, step: 1 },
  { key: 'saturation', label: 'Saturation', kind: 'range', min: 0, max: 3, step: 0.05 },
  { key: 'shadowOpacity', label: 'Shadow', kind: 'range', min: 0, max: 1, step: 0.01 },
  { key: 'borderOpacity', label: 'Edge Light', kind: 'range', min: 0, max: 0.3, step: 0.005 }
]

function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

function buildCssVars(c: GlassConfig, t: GlassThemeVars): Record<string, string> {
  const rgb = hexToRgb(c.backgroundColor)
  return {
    '--glass-bg': `rgba(${rgb}, ${c.backgroundOpacity})`,
    '--glass-blur': `${c.blur}px`,
    '--glass-saturation': `${c.saturation}`,
    '--glass-shadow-opacity': `${c.shadowOpacity}`,
    '--glass-border-opacity': `${c.borderOpacity}`,
    '--glass-fill': t.fill,
    '--glass-fill-opacity': `${t.fillOpacity}`,
    '--glass-overlay': t.overlay,
    '--glass-active-bg': t.activeBg,
    '--glass-active-color': t.activeColor,
    '--glass-icon-color': t.iconColor,
    '--glass-border-gradient': t.borderGradient,
    '--glass-highlight': t.highlight,
    '--glass-inset-highlight': t.insetHighlight,
    '--glass-blur-bg': t.blurBg
  }
}

export function useGlassConfig() {
  const theme = useState<GlassTheme>('glass-theme', () => 'light')
  const config = useState<GlassConfig>('glass-config', () => ({ ...glassThemeDefaults[theme.value] }))
  const isConfigSyncedToTheme = useState<boolean>('glass-config-synced', () => true)

  watch(theme, (nextTheme, prevTheme) => {
    if (nextTheme === prevTheme) return
    if (!isConfigSyncedToTheme.value) return
    config.value = { ...glassThemeDefaults[nextTheme] }
  })

  const cssVars = computed(() => buildCssVars(config.value, themeVarSets[theme.value]))

  function cssVarsFor(overrideTheme: GlassTheme): Record<string, string> {
    return buildCssVars(glassThemeDefaults[overrideTheme], themeVarSets[overrideTheme])
  }

  function setTheme(newTheme: GlassTheme): void {
    theme.value = newTheme
    config.value = { ...glassThemeDefaults[newTheme] }
    isConfigSyncedToTheme.value = true
  }

  function update<K extends keyof GlassConfig>(key: K, value: GlassConfig[K]): void {
    config.value = { ...config.value, [key]: value }
    isConfigSyncedToTheme.value = false
  }

  function reset(): void {
    config.value = { ...glassThemeDefaults[theme.value] }
    isConfigSyncedToTheme.value = true
  }

  return { theme, config, cssVars, cssVarsFor, setTheme, update, reset }
}
