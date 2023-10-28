// Imports
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/controls/OrbitControls.js';

export default function init() {
  // Canvas
  const canvas = document.getElementById('threejsCanvas');

  // Scene
  const scene = new THREE.Scene();

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Declare camera variable outside to make it accessible in the animate function
  let camera;

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/c926uenhdxkpmpwvloltx/Puzzle-jigsaw-from-fusion.glb?rlkey=fsef3jyercxnpbb6ywuxqk5k5',
    (gltf) => {
      scene.add(gltf.scene);

      // Use the camera from GLB if it's available, otherwise, create a new one
      if (gltf.cameras && gltf.cameras.length > 0) {
        camera = gltf.cameras[0];
      } else {
        camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 10;  // Default position if no camera is provided in the GLB
      }

      // Set up controls after the camera has been defined
      const controls = new OrbitControls(camera, renderer.domElement);
    }
  );

  // Animate
  const animate = () => {
    requestAnimationFrame(animate);
    if (camera) {  // Ensure camera is defined before rendering
      renderer.render(scene, camera);
    }
  }
  animate();
}
