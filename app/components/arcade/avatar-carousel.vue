<script setup lang="ts">
defineOptions({ name: 'ArcadeAvatarCarousel' })

interface AvatarItem {
  url?: string
  fallback?: string
  name?: string
}

interface ArcadeAvatarCarouselProps {
  avatars?: AvatarItem[]
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<ArcadeAvatarCarouselProps>(), {
  avatars: () => [],
  size: 'medium'
})

const emit = defineEmits<{ select: [index: number] }>()

const sizeMap = { small: '1.25em', medium: '1.5em', large: '2em' } as const

const avatarSize = computed(() => sizeMap[props.size])

function getInitial(item: AvatarItem): string {
  if (item.fallback) return item.fallback
  if (item.name) return item.name.charAt(0).toUpperCase()
  return '?'
}
</script>

<template>
  <div class="arcade-avatar-carousel">
    <button
      v-for="(avatar, index) in avatars"
      :key="index"
      class="arcade-avatar-carousel__item"
      :style="{ width: avatarSize, height: avatarSize }"
      @click="emit('select', index)"
    >
      <img
        v-if="avatar.url"
        :src="avatar.url"
        :alt="avatar.name ?? ''"
        class="arcade-avatar-carousel__image"
      >
      <span v-else class="arcade-avatar-carousel__fallback">
        {{ getInitial(avatar) }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.arcade-avatar-carousel {
  display: flex;
  gap: 0.25em;
  padding: 0 0.5em;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.arcade-avatar-carousel::-webkit-scrollbar {
  display: none;
}

.arcade-avatar-carousel__item {
  flex-shrink: 0;
  border-radius: var(--arcade-radius-circle);
  overflow: hidden;
  border: none;
  padding: 0;
  background: var(--arcade-bg-subtle);
  cursor: pointer;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--arcade-duration-fast) var(--arcade-ease-default);
  -webkit-tap-highlight-color: transparent;
}

.arcade-avatar-carousel__item:active {
  transform: scale(0.92);
}

.arcade-avatar-carousel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.arcade-avatar-carousel__fallback {
  font-family: var(--arcade-font-medium);
  font-weight: 500;
  font-size: 0.5em;
  line-height: 1;
  color: var(--arcade-text-standard);
  user-select: none;
}
</style>
