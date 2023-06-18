import * as THREE from 'three';

window.addEventListener('load', () => {
  init()
})

const init = () => {

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  document.body.appendChild(renderer.domElement);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    1,
    500,
  );
  
  camera.position.z = 5

  const render = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', handleResize)
}