<template>
  <div class="main">
    <canvas class="webgl"></canvas>

    <section class="section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { onMounted } from 'vue'

/**
 * Base
 */
// Canvas
onMounted(() => {
  const canvas = document.querySelector('canvas.webgl')

  // Scene
  const scene = new THREE.Scene()

  /**
   * Objects
   */
  let earth: THREE.Group<THREE.Object3DEventMap> | null = null
  // Instantiate a loader
  // Texture
  const loader = new GLTFLoader()

  // Load a glTF resource
  loader.load(
    // resource URL
    '/src/assets/model/earth.glb',
    // called when the resource is loaded
    function (gltf) {
      earth = gltf.scene
      console.log(gltf)
      gltf.scene.position.set(2.1, 0, 0)
      scene.add(gltf.scene)

      let scrollY = window.scrollY
      gsap.to(gltf.scene.position, {
        duration: 1.0,
        x: `${Math.cos(scrollY / 227) * 2.1}`, // 2.1
        y: `-${scrollY / 186}`, //'-=4'
        z: `-${Math.sin(scrollY / 85) * 1.5 + 2.0}`
      })

      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // called when loading has errors
    function () {
      console.log('An error happened')
    }
  )

  /**
   * Lights
   */
  const light = new THREE.AmbientLight(0x404040, 1.5) // 柔和的白光
  scene.add(light)

  const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
  directionalLight.position.set(1, 1, 0)
  scene.add(directionalLight)

  /**
   * Particles
   */
  // Geometry
  const objectsDistance = 4
  const particlesCount = 200
  const positions = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  const particlesGeometry = new THREE.BufferGeometry()
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
  })

  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  /**
   * Camera
   */
  // Group
  const cameraGroup = new THREE.Group()
  scene.add(cameraGroup)

  // Base camera
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 6
  cameraGroup.add(camera)

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /**
   * Scroll
   */
  let scrollY = window.scrollY

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    console.log(scrollY)
    gsap.to(earth!.position, {
      duration: 1.0,
      x: `${Math.cos(scrollY / 227) * 2.1}`, // 2.1
      y: `-${scrollY / 186}`, //'-=4'
      z: `-${Math.sin(scrollY / 85) * 1.5 + 2.0}`
    })

    // const newSection = Math.round(scrollY / sizes.height)

    // if (newSection != currentSection && earth) {
    //   currentSection = newSection

    //   gsap.to(
    //     earth.position,
    //     {
    //       duration: 1.5,
    //       ease: 'power2.inOut',
    //       x: '+=0',
    //       y: scrollY,  //'-=4'
    //       z: '+=0'
    //     }
    //   )
    // }
  })

  /**
   * Cursor
   */
  const cursor = { x: 0, y: 0 }

  window.addEventListener('mousemove', event => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
    // console.log(cursor.x, cursor.y);
  })

  /**
   * Animate
   */
  const clock = new THREE.Clock()
  let previousTime = 0

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = (-scrollY / sizes.height) * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    if (earth) {
      earth.rotation.x += deltaTime * 0.1
      earth.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
})
</script>

<style scoped>
.main {
  background: #1e1a20;
}

.webgl {
  @apply fixed top-0 left-0 outline-none h-screen w-screen;
}

.section {
  @apply flex items-center h-screen relative;
  font-family: 'Cabin', sans-serif;
  color: #ffeded;
  text-transform: uppercase;
  font-size: 7vmin;
  padding-left: 10%;
  padding-right: 10%;
}

section:nth-child(odd) {
  justify-content: flex-end;
}
</style>