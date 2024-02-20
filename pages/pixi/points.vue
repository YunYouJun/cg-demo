<script lang="ts" setup>
import * as PIXI from 'pixi.js'
import { isClient } from '@vueuse/core'

definePageMeta({
  layout: 'fullscreen',
})

async function init(canvas: HTMLCanvasElement) {
  const app = new PIXI.Application({
    view: canvas,
    // resolution: window.devicePixelRatio || 1,
    resizeTo: window,
  })

  // eslint-disable-next-line no-console
  console.log('100000 points benchmark start...')

  const graphics = new PIXI.Graphics()
  app.stage.addChild(graphics)

  // 随机绘制 10w 个点
  const pointSize = 1

  function animate() {
    graphics.clear()
    const startTime = performance.now()
    for (let i = 0; i < 100000; i++) {
      const randomColor = Math.random() * 0xFFFFFF
      graphics.beginFill(randomColor)
      graphics.drawCircle(Math.random() * app.screen.width, Math.random() * app.screen.height, pointSize)
    }
    const endTime = performance.now()
    // eslint-disable-next-line no-console
    console.log('drawCircle 100000 time:', `${endTime - startTime}ms`)
  }

  setInterval(animate, 1000)
}

const pixiCanvasRef = ref<HTMLCanvasElement>()
onMounted(() => {
  if (!isClient)
    return
  if (!pixiCanvasRef.value)
    return
  init(pixiCanvasRef.value)
})
</script>

<template>
  <div>
    <canvas id="pixi" ref="pixiCanvasRef" m-auto shadow width="800" height="600" />
  </div>
</template>
