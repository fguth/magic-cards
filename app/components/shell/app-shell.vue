<script setup lang="ts">
defineOptions({ name: 'AppShell' })
</script>

<template>
  <div class="app-shell">
    <ProfileSwitcher class="app-shell__switcher" />
    <AppTopNav class="app-shell__nav" />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
}

.app-shell__switcher {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.app-shell__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
}

.app-shell__nav :deep(> *) {
  pointer-events: auto;
}
</style>
