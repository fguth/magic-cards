<script setup lang="ts">
import type { PageDef } from '~/config/profiles'

defineOptions({ name: 'PageFrame' })

interface Props {
  page: PageDef
}

const props = defineProps<Props>()
</script>

<template>
  <section class="page-frame" :data-page-id="props.page.id">
    <component :is="props.page.component" v-bind="props.page.props ?? {}" />
  </section>
</template>

<style scoped>
.page-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
  box-sizing: border-box;
}
</style>
