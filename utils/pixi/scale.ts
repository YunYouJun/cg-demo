import * as PIXI from 'pixi.js'
import { getAngleRadian } from './utils'

export async function createRotate(container: PIXI.Container, app: PIXI.Application) {
  const bunnyTexture = await PIXI.Texture.fromURL('https://pixijs.io/examples/examples/assets/bunny.png')

  const rotateSprite = new PIXI.Sprite(bunnyTexture)
  container.addChild(rotateSprite)

  rotateSprite.anchor.set(0.5)
  rotateSprite.alpha = 0.5
  rotateSprite.zIndex = 10

  rotateSprite.eventMode = 'static'
  rotateSprite.cursor = 'pointer'

  rotateSprite.position.set(container.width / 2, container.height / 2)

  let lastPos: PIXI.Point | null = null

  function onRotateMove(e: PIXI.FederatedPointerEvent) {
    if (!lastPos)
      return

    const angle = getAngleRadian(lastPos, e.getLocalPosition(container).clone())
    // const rotateAngle = reticfyAngle(Math.round(this.startAngle + angle))
    // const radian = Tiny.deg2radian(rotateAngle)

    container.rotation += angle
  }
  rotateSprite.on('pointerdown', (e) => {
    rotateSprite.alpha = 1

    lastPos = e.getLocalPosition(container).clone()
    app.stage.on('pointermove', onRotateMove)
  })

  function onRotateEnd() {
    rotateSprite.alpha = 0.5
    app.stage.off('pointermove', onRotateMove)
  }
  app.stage.on('pointerup', onRotateEnd)
  app.stage.on('pointerupoutside', onRotateEnd)
}

/**
 *
 * @param container
 * @param app
 */
export async function createScale(container: PIXI.Container, app: PIXI.Application) {
  const scaleSprite = new PIXI.Sprite(PIXI.Texture.WHITE)
  container.addChild(scaleSprite)

  scaleSprite.anchor.set(0.5)
  scaleSprite.alpha = 0.5
  scaleSprite.zIndex = 10

  scaleSprite.eventMode = 'static'
  scaleSprite.cursor = 'pointer'

  scaleSprite.position.set(-container.width / 2, container.height / 2)

  let lastPos: PIXI.Point | null = null

  const scaleSpritePos = scaleSprite.position.clone()

  /**
   * OA'·OA / |OA| = OA' 在 OA 方向上的投影
   * OA = scaleSpritePos
   * OA' = pos
   * @param e
   */
  function onScaleMove(e: PIXI.FederatedPointerEvent) {
    if (!lastPos)
      return

    const pos = e.getLocalPosition(container).clone()
    const ratio = pos.dot(scaleSpritePos) / scaleSpritePos.magnitude()
    const scale = ratio / scaleSpritePos.magnitude()

    if (scale < 0.1)
      return

    container.scale.x *= scale
    container.scale.y *= scale

    lastPos = pos
  }
  scaleSprite.on('pointerdown', (e) => {
    scaleSprite.alpha = 1

    lastPos = e.getLocalPosition(container).clone()
    app.stage.on('pointermove', onScaleMove)
  })

  function onScaleEnd() {
    scaleSprite.alpha = 0.5
    app.stage.off('pointermove', onScaleMove)
  }
  app.stage.on('pointerup', onScaleEnd)
  app.stage.on('pointerupoutside', onScaleEnd)
}
