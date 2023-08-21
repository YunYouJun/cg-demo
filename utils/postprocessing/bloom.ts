import * as THREE from 'three'

import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

export function initBloom(container: HTMLElement) {
  let camera: THREE.PerspectiveCamera
  let stats = new Stats()
  let composer: EffectComposer
  let renderer: THREE.WebGLRenderer
  let mixer: THREE.AnimationMixer
  let clock: THREE.Clock

  const params = {
    threshold: 0,
    strength: 1,
    radius: 0,
    exposure: 1,
  }

  init()

  function init() {
    stats = new Stats()
    container.appendChild(stats.dom)

    clock = new THREE.Clock()

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ReinhardToneMapping
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100)
    camera.position.set(-5, 2.5, -3.5)
    scene.add(camera)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI * 0.5
    controls.minDistance = 3
    controls.maxDistance = 8

    scene.add(new THREE.AmbientLight(0xCCCCCC))

    const pointLight = new THREE.PointLight(0xFFFFFF, 100)
    camera.add(pointLight)

    const renderScene = new RenderPass(scene, camera)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.threshold
    bloomPass.strength = params.strength
    bloomPass.radius = params.radius

    const outputPass = new OutputPass()

    composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)
    composer.addPass(outputPass)

    const url = 'https://threejs.org/examples/models/gltf/PrimaryIonDrive.glb'
    new GLTFLoader().load(url, (gltf) => {
      const model = gltf.scene

      scene.add(model)

      mixer = new THREE.AnimationMixer(model)
      const clip = gltf.animations[0]
      mixer.clipAction(clip.optimize()).play()

      animate()
    })

    const gui = new GUI()

    const bloomFolder = gui.addFolder('bloom')

    bloomFolder.add(params, 'threshold', 0.0, 1.0).onChange((value: number) => {
      bloomPass.threshold = Number(value)
    })

    bloomFolder.add(params, 'strength', 0.0, 3.0).onChange((value: number) => {
      bloomPass.strength = Number(value)
    })

    gui.add(params, 'radius', 0.0, 1.0).step(0.01).onChange((value: number) => {
      bloomPass.radius = Number(value)
    })

    const toneMappingFolder = gui.addFolder('tone mapping')

    toneMappingFolder.add(params, 'exposure', 0.1, 2).onChange((value: number) => {
      renderer.toneMappingExposure = value ** 4.0
    })

    window.addEventListener('resize', onWindowResize)
  }

  function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
    composer.setSize(width, height)
  }

  function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()

    mixer.update(delta)

    stats.update()

    composer.render()
  }
}
