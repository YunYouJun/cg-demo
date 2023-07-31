<script lang="ts" setup>
import { initMSAA } from '~/utils/aa/MSAA'

const containerRef = ref<HTMLElement>()

onMounted(() => {
  if (!containerRef.value)
    return
  initMSAA(containerRef.value)
})
</script>

<template>
  <div>
    MSAA
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
