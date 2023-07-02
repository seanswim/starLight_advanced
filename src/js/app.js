import * as THREE from 'three';
import fragmentShader from '../shaders/earth/fragment.glsl?raw'
import vertexShader from '../shaders/earth/vertex.glsl?raw'
import pointsVertexShader from '../shaders/earthPoints/vertex.glsl?raw'
import pointsFragmentShader from '../shaders/earthPoints/fragment.glsl?raw'
import glowVertexShader from '../shaders/earthGlow/vertex.glsl?raw'
import glowFragmentShader from '../shaders/earthGlow/fragment.glsl?raw' 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function () {
  const clock = new THREE.Clock()
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x000000, 1)
  
  const container = document.querySelector('#container')
  container.appendChild(renderer.domElement);
  
  const canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  
  renderer.setSize(canvasSize.width, canvasSize.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  const textureLoader = new THREE.TextureLoader()
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    canvasSize.width / canvasSize.height,
    0.1,
    100,
  );
    
  const controls = new OrbitControls(camera, renderer.domElement)

  const createEarthGlow = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uZoom: {value: 1}
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      side: THREE.BackSide,
      transparent: true,
    })
    const geometry = new THREE.SphereGeometry(1.1, 40, 40)
    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  const createEarthPoints = () => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {
          value: textureLoader.load('assets/earthmap.png')
        },
        uTime: {
          value: 0,
        }
      },
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
    const geometry = new THREE.IcosahedronGeometry(1, 40, 40)
    geometry.rotateY(-Math.PI)

    const mesh = new THREE.Points(geometry, material)
    return mesh
  }
  
  const createEarth = () => {
    const material = new THREE.ShaderMaterial({ 
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: { value: textureLoader.load('assets/earthmap.png')}
      },
      transparent: true,
      side: THREE.DoubleSide,
    })
    const geometry = new THREE.SphereGeometry(1, 30, 30)
    const mesh = new THREE.Mesh(geometry, material)
    
    return mesh;
  }
  
  const create = () => {
    const earth = createEarth()
    const earthGlow = createEarthGlow()
    const earthPoints = createEarthPoints()

    scene.add(earth, earthPoints, earthGlow)
    
    return {
      earth: earth,
      earthGlow: earthGlow,
      earthPoints: earthPoints,
    }
  }
  
  const resize = () => {
    canvasSize.width = window.innerWidth
    canvasSize.height = window.innerHeight
    
    camera.aspect = canvasSize.width / canvasSize.height
    camera.updateProjectionMatrix()
    
    renderer.setSize(canvasSize.width, canvasSize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  const addEvent = () => {
    window.addEventListener('resize', resize)
  }
  
  const draw = (obj) => {
    const { earth, earthPoints, earthGlow } = obj

    earth.rotation.x += 0.005;
    earth.rotation.y += 0.005;
    earthPoints.rotation.x += 0.005;
    earthPoints.rotation.y += 0.005;


    controls.update()
    renderer.render(scene, camera)

    earthGlow.material.uniforms.uZoom.value = controls.target.distanceTo(controls.object.position)
    earthPoints.material.uniforms.uTime.value = clock.getElapsedTime();

    requestAnimationFrame(() => {
      draw(obj)
    })
  }
  
  const initialize = () => {
    addEvent()
    const obj = create()
    draw(obj)
    resize()
  }
  
  camera.position.set(0,0,2.5)
  
  initialize()
}