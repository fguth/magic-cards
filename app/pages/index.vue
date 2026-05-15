<script setup lang="ts">
defineOptions({ name: 'IndexPage' })

const { isDark, theme, toggleTheme } = useArcadeTheme()
const { isGridView, gridMotionPhase } = useAppNavigation()
</script>

<template>
  <main
    class="page-root"
    :class="{
      'page-root--dark': isDark,
      'page-root--grid': isGridView,
      'page-root--exiting-grid': gridMotionPhase === 'exiting',
    }"
  >
    <div class="controls-panel">
      <button
        class="theme-toggle"
        type="button"
        :aria-label="`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`"
        @click="toggleTheme"
      >
        {{ theme === 'dark' ? 'Claro' : 'Escuro' }}
      </button>
    </div>

    <div class="page-stage" :class="{ 'page-stage--grid': isGridView }">
      <div class="device-frame" :class="{ 'device-frame--grid': isGridView }">
        <div class="device-screen" :class="{ 'device-screen--dark': isDark }">
          <AppShell />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-root {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
  background: linear-gradient(180deg, #f7f7f7 0%, #ebebeb 100%);
  transition: background-color 0.3s ease;
  --stage-gap: 1.5rem;
  --shell-morph-duration-active: var(--shell-duration-morph);
  --shell-morph-ease-active: var(--arcade-spring-smooth);
  --shell-transform-duration-active: calc(var(--shell-morph-duration-active) + 40ms);
}

.page-root--dark {
  background: linear-gradient(180deg, #1c1c1e 0%, #000 100%);
}

.page-root--exiting-grid {
  --shell-morph-duration-active: 620ms;
  --shell-morph-ease-active: cubic-bezier(0.18, 0.72, 0, 1);
  --shell-transform-duration-active: 680ms;
}

.controls-panel {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  min-width: 4.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.375rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(1.25rem) saturate(1.4);
  -webkit-backdrop-filter: blur(1.25rem) saturate(1.4);
  box-shadow: 0 0.03125rem 0.09375rem rgba(0, 0, 0, 0.08),
              inset 0 0 0 0.03125rem rgba(255, 255, 255, 0.5);
  z-index: 20;
}

.theme-toggle {
  padding: 0.1875rem 0.375rem;
  border: none;
  border-radius: 0.1875rem;
  background: none;
  color: #555;
  cursor: pointer;
  font-family: var(--arcade-font-medium);
  font-size: 0.325rem;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #222;
}

.theme-toggle:focus-visible {
  outline: 0.03125rem solid #333;
  outline-offset: 0.0625rem;
}

.page-stage {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--stage-gap);
  perspective: 180rem;
  transition: transform var(--shell-morph-duration-active) var(--shell-morph-ease-active);
}

.page-stage--grid {
  transform: scale(0.985);
}

.device-frame {
  position: relative;
  container-type: inline-size;
  box-sizing: content-box;
  width: min(
    12.1875rem,
    calc((100dvh - (var(--stage-gap) * 2) - 0.56rem) * 390 / 852),
    max(0px, calc(100vw - (var(--stage-gap) * 2) - 0.56rem))
  );
  aspect-ratio: 390 / 852;
  padding: 0.28rem;
  border-radius: 1.65rem;
  background: linear-gradient(160deg, #161616 0%, #2b2b2b 35%, #0f0f0f 100%);
  box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.18), 0 0.125rem 0.5rem rgba(0, 0, 0, 0.12);
  transform-origin: center center;
  transition:
    transform var(--shell-morph-duration-active) var(--shell-morph-ease-active),
    box-shadow var(--shell-morph-duration-active) var(--arcade-ease-out);
}

.device-frame--grid {
  transform: translateY(-0.08rem) rotateX(0.35deg);
  box-shadow: 0 1.4rem 3.25rem rgba(0, 0, 0, 0.2), 0 0.18rem 0.75rem rgba(0, 0, 0, 0.12);
}

.device-frame::before {
  content: '';
  position: absolute;
  top: 0.625rem;
  left: 50%;
  width: 32%;
  height: .95rem;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #050505;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  z-index: 3;
}

.device-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.device-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1.38rem;
  background: var(--arcade-bg-subtle);
  isolation: isolate;
  font-size: calc(100cqi / 12.1875);
  transform-origin: center center;
  transition:
    background-color 0.3s ease,
    transform var(--shell-morph-duration-active) var(--shell-morph-ease-active);
}

.device-screen--dark {
  background: var(--arcade-bg-app);
}

.page-root--grid .device-screen {
  transform: scale(0.998);
}

.device-screen::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.35em;
  width: 30%;
  height: 0.12em;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 3;
  transition: background-color 0.3s ease;
}

.device-screen--dark::after {
  background: rgba(255, 255, 255, 0.82);
}

@media (max-width: 768px) {
  .page-root {
    --stage-gap: 0px;
  }

  .controls-panel {
    display: none;
  }

  .device-frame {
    width: 100%;
    height: 100dvh;
    aspect-ratio: unset;
    padding: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
  }

  .device-frame::before,
  .device-frame::after {
    display: none;
  }

  .device-screen {
    border-radius: 0;
  }

  .device-screen::after {
    display: none;
  }
}
</style>
