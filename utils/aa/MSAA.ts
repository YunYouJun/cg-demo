import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

/**
 * @see https://threejs.org/examples/#webgl2_multisampled_renderbuffers
 * @see https://github.com/mrdoob/three.js/blob/master/examples/webgl2_multisampled_renderbuffers.html
 * @param container
 */
export function initMSAA(container: HTMLElement) {
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let group: THREE.Group

  let composer1: EffectComposer
  let composer2: EffectComposer

  const params = {
    animate: true,
  }

  init()

  function init() {
    if (WebGL.isWebGL2Available() === false) {
      document.body.appendChild(WebGL.getWebGL2ErrorMessage())
      return
    }

    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 10, 2000)
    camera.position.z = 500

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFFFFFF)
    scene.fog = new THREE.Fog(0xCCCCCC, 100, 1500)

    //

    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x222222, 5)
    hemiLight.position.set(1, 1, 1)
    scene.add(hemiLight)

    //

    group = new THREE.Group()

    const geometry = new THREE.SphereGeometry(10, 64, 40)
    const material = new THREE.MeshLambertMaterial({
      color: 0xEE0808,
      polygonOffset: true,
      polygonOffsetFactor: 1, // positive value pushes polygon further away
      polygonOffsetUnits: 1,

    })
    const material2 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })

    for (let i = 0; i < 50; i++) {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = Math.random() * 600 - 300
      mesh.position.y = Math.random() * 600 - 300
      mesh.position.z = Math.random() * 600 - 300
      mesh.rotation.x = Math.random()
      mesh.rotation.z = Math.random()
      mesh.scale.setScalar(Math.random() * 5 + 5)
      group.add(mesh)

      const mesh2 = new THREE.Mesh(geometry, material2)
      mesh2.position.copy(mesh.position)
      mesh2.rotation.copy(mesh.rotation)
      mesh2.scale.copy(mesh.scale)
      group.add(mesh2)
    }

    scene.add(group)

    //

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.autoClear = false
    container.appendChild(renderer.domElement)

    //

    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, { samples: 4 })

    const renderPass = new RenderPass(scene, camera)
    const outputPass = new OutputPass()

    //

    composer1 = new EffectComposer(renderer)
    composer1.addPass(renderPass)
    composer1.addPass(outputPass)

    //

    composer2 = new EffectComposer(renderer, renderTarget)
    composer2.addPass(renderPass)
    composer2.addPass(outputPass)

    //

    const gui = new GUI()
    gui.add(params, 'animate')

    //

    window.addEventListener('resize', onWindowResize)

    animate()
  }

  function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.offsetWidth, container.offsetHeight)
    composer1.setSize(container.offsetWidth, container.offsetHeight)
    composer2.setSize(container.offsetWidth, container.offsetHeight)
  }

  function animate() {
    requestAnimationFrame(animate)

    const halfWidth = container.offsetWidth / 2

    if (params.animate)

      group.rotation.y += 0.002

    renderer.setScissorTest(true)

    renderer.setScissor(0, 0, halfWidth - 1, container.offsetHeight)
    composer1.render()

    renderer.setScissor(halfWidth, 0, halfWidth, container.offsetHeight)
    composer2.render()

    renderer.setScissorTest(false)
  }
}
