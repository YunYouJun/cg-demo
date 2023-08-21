import type { Point } from 'pixi.js'
import '@pixi/math-extras'

// dot
export function getAngleRadian(a: Point, b: Point) {
  const dot = a.dot(b)
  const det = a.cross(b)

  return Math.atan2(det, dot)
}
