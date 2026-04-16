<script setup lang="ts">
defineOptions({ name: 'ArcadeHeaderProfile' })

interface ArcadeHeaderProfileProps {
  name: string
  body?: string
  avatarUrl?: string
  avatarFallback?: string
  titleIcon?: string
}

const props = withDefaults(defineProps<ArcadeHeaderProfileProps>(), {
  body: undefined,
  avatarUrl: undefined,
  avatarFallback: undefined,
  titleIcon: undefined
})

const icons24 = import.meta.glob('@/assets/icons/24/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const showAvatar = computed(() => !!props.avatarUrl || !!props.avatarFallback)

const fallbackLetter = computed(() => props.avatarFallback || props.name.charAt(0).toUpperCase())

const iconSvg = computed(() => {
  if (!props.titleIcon) return ''
  const match = Object.entries(icons24).find(([key]) => key.endsWith(`/${props.titleIcon}.svg`))
  if (!match) return ''
  return match[1].replace(/fill="#FF00FF"/g, 'fill="currentColor"')
})
</script>

<template>
  <div class="arcade-header-profile">
    <div v-if="showAvatar" class="arcade-header-profile__avatar">
      <img
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="name"
        class="arcade-header-profile__avatar-img"
      >
      <span v-else class="arcade-header-profile__avatar-fallback">{{ fallbackLetter }}</span>
    </div>
    <div class="arcade-header-profile__content">
      <p class="arcade-header-profile__name">
        {{ name
        }}<span
          v-if="titleIcon && iconSvg"
          class="arcade-header-profile__title-icon"
          v-html="iconSvg"
        />
      </p>
      <p v-if="body" class="arcade-header-profile__body">{{ body }}</p>
    </div>
  </div>
</template>

<style scoped>
.arcade-header-profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
}

.arcade-header-profile__avatar {
  width: 2em;
  height: 2em;
  border-radius: var(--arcade-radius-circle);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--arcade-brand);
  flex-shrink: 0;
}

.arcade-header-profile__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.arcade-header-profile__avatar-fallback {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.75em;
  line-height: 1;
  color: var(--arcade-text-standard);
  user-select: none;
}

.arcade-header-profile__content {
  display: flex;
  flex-direction: column;
  gap: 0.125em;
}

.arcade-header-profile__name {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 1em;
  line-height: 1;
  letter-spacing: -0.015em;
  margin: 0;
  color: var(--arcade-text-standard);
}

.arcade-header-profile__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.75em;
  height: 0.75em;
  margin-left: 0.125em;
  vertical-align: -0.125em;
  color: var(--arcade-icon-brand);
}

.arcade-header-profile__title-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.arcade-header-profile__body {
  font-family: var(--arcade-font-regular);
  font-weight: 400;
  font-size: 0.5em;
  line-height: 1.5;
  letter-spacing: -0.005em;
  margin: 0;
  color: var(--arcade-text-subtle);
}
</style>
