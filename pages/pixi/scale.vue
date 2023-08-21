<script lang="ts" setup>
import * as PIXI from 'pixi.js'
import { createRotate, createScale } from '@/utils/pixi/scale'

definePageMeta({
  layout: 'fullscreen',
})

async function init(canvas: HTMLCanvasElement) {
  const app = new PIXI.Application({
    view: canvas,
    // resolution: window.devicePixelRatio || 1,
    resizeTo: window,
  })
  // @ts-expect-error type
  globalThis.__PIXI_APP__ = app

  // window.addEventListener('resize', () => {
  //   console.log('resize')
  //   app.renderer.resize(window., window.innerHeight)
  // })

  PIXI.Assets.add('flowerTop', 'https://pixijs.com/assets/flowerTop.png')
  PIXI.Assets.add('bunny', 'https://pixijs.com/assets/bunny.png')

  const textures = await PIXI.Assets.load(['flowerTop', 'bunny'])

  const spriteContainer = new PIXI.Container()
  const character = new PIXI.Sprite(textures.flowerTop)
  character.zIndex = 0
  spriteContainer.addChild(character)
  spriteContainer.sortableChildren = true
  spriteContainer.pivot.set(0.5)

  spriteContainer.position.x = app.screen.width / 2
  spriteContainer.position.y = app.screen.height / 2

  character.anchor.set(0.5)

  // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
  character.eventMode = 'static'
  character.cursor = 'pointer'
  character.alpha = 0.5

  let dragTarget: PIXI.Container | null = null

  function onDragStart() {
    spriteContainer.alpha = 1
    dragTarget = spriteContainer

    app.stage.on('pointermove', onDragMove)
  }

  function onDragMove(e: PIXI.FederatedPointerEvent) {
    if (!dragTarget)
      return

    dragTarget.position.x += e.movement.x / app.renderer.resolution
    dragTarget.position.y += e.movement.y / app.renderer.resolution
  }
  character.on('pointerdown', onDragStart)

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove)
      dragTarget.alpha = 0.5
      dragTarget = null
    }
  }

  app.stage.eventMode = 'static'
  app.stage.hitArea = app.screen
  app.stage.on('pointerup', onDragEnd)
  app.stage.on('pointerupoutside', onDragEnd)

  createRotate(spriteContainer, app)
  createScale(spriteContainer, app)
  app.stage.addChild(spriteContainer)
}

const pixiCanvasRef = ref<HTMLCanvasElement>()
onMounted(() => {
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
