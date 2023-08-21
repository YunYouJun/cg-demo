<script lang="ts" setup>
import { initBloom } from '~/utils/postprocessing/bloom'

const containerRef = ref<HTMLElement>()

onMounted(() => {
  if (!containerRef.value)
    return
  initBloom(containerRef.value)
})
</script>

<template>
  <div>
    Bloom
    <div id="container" ref="containerRef" />
  </div>
</template>

<style>
#container {
  position: absolute;
  inset: 0;
  width: 100%;
}
</style>
