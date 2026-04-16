<script setup lang="ts">
defineOptions({ name: 'ArcadeCopyCode' })

interface ArcadeCopyCodeProps {
  label: string
  body?: string
  icon?: string
  value?: string
}

const props = withDefaults(defineProps<ArcadeCopyCodeProps>(), {
  body: undefined,
  icon: undefined,
  value: undefined
})

const emit = defineEmits<{ copy: [] }>()

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

function resolveIcon(name: string): string {
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${name}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
}

const iconSvg = computed(() => props.icon ? resolveIcon(props.icon) : '')
const copyIconSvg = computed(() => resolveIcon('copy'))
const checkIconSvg = computed(() => resolveIcon('check'))

const copyValue = computed(() => props.value ?? props.body ?? props.label)

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(copyValue.value)
    isCopied.value = true
    emit('copy')
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { isCopied.value = false }, 1500)
  } catch {
    isCopied.value = false
  }
}

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<template>
  <button
    class="arcade-copy-code"
    :class="{ 'arcade-copy-code--success': isCopied }"
    :aria-label="isCopied ? 'Copied' : `Copy ${copyValue}`"
    @click="handleCopy"
  >
    <span v-if="icon && iconSvg" class="arcade-copy-code__icon" v-html="iconSvg" />

    <div class="arcade-copy-code__content">
      <p class="arcade-copy-code__label">{{ label }}</p>
      <p v-if="body" class="arcade-copy-code__body">{{ body }}</p>
    </div>

    <span v-if="isCopied" class="arcade-copy-code__trailing arcade-copy-code__trailing--success" v-html="checkIconSvg" />
    <span v-else class="arcade-copy-code__trailing" v-html="copyIconSvg" />
  </button>
</template>

<style scoped>
.arcade-copy-code {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  padding: 0.5em 0;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: var(--arcade-radius-medium);
  -webkit-tap-highlight-color: transparent;
}

.arcade-copy-code:active {
  background: var(--arcade-bg-subtle);
}

.arcade-copy-code__icon {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-standard);
}

.arcade-copy-code__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-copy-code__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.0625em;
}

.arcade-copy-code__label {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: 0;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-copy-code__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.4375em;
  line-height: 1.43;
  letter-spacing: -0.0025em;
  margin: 0;
  color: var(--arcade-text-subtle);
}

.arcade-copy-code__trailing {
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arcade-icon-standard);
}

.arcade-copy-code__trailing :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-copy-code__trailing--success {
  color: var(--arcade-brand);
}
</style>
