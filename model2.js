// Imports
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';

export default function init() {

   // Canvas
  const canvas = document.getElementById('threejsCanvas');

  // Scene
  const scene = new THREE.Scene();

  // Camera 
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;  

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    'https://drive.google.com/uc?export=view&id=1C8AF7TVJG1DDLTFmt9PdtaaoziB4VF5C',
    (gltf) => {
      scene.add(gltf.scene);
    }
  );

  // Animate
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  
}
