<script setup lang="ts">
defineOptions({ name: 'ProfileRail' })

const { profiles: allProfiles, activeProfileIndex, isGridView, gridMotionPhase } = useAppNavigation()
</script>

<template>
  <div
    class="profile-rail"
    :class="{
      'profile-rail--grid': isGridView,
      'profile-rail--exiting': gridMotionPhase === 'exiting',
    }"
  >
    <ProfileContainer
      v-for="(profile, index) in allProfiles"
      :key="profile.id"
      :profile="profile"
      :profile-index="index"
      :offset="index - activeProfileIndex"
    />
  </div>
</template>

<style scoped>
.profile-rail {
  position: absolute;
  inset: 0;
  perspective: 160em;
  transform-style: preserve-3d;
  transform-origin: center center;
  transform: scale(1) translateY(0);
  filter: saturate(1);
  transition:
    transform var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    filter 240ms var(--arcade-ease-out);
  will-change: transform, filter;
}

.profile-rail--grid {
  transform: scale(0.945) translateY(0.32em);
  filter: saturate(0.98);
}

.profile-rail--exiting {
  transform: scale(1) translateY(0);
  filter: saturate(1);
}
</style>
