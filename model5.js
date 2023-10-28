// Imports
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';

export default function init() {
  // Canvas
  const canvas = document.getElementById('threejsCanvas');

  // Scene
  const scene = new THREE.Scene();

  // Add an ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // white color, half intensity
  scene.add(ambientLight);

  // Add a point light above the model
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // white color, full intensity, 100 distance
  pointLight.position.set(0, 5, 10);  // adjust these values if needed
  scene.add(pointLight);

  // Camera 
  let camera;  // Declare camera here so we can use it both outside and inside the loader function

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/c926uenhdxkpmpwvloltx/Puzzle-jigsaw-from-fusion.glb?rlkey=fsef3jyercxnpbb6ywuxqk5k5',
    (gltf) => {
      // Use the camera from GLB if it's available, otherwise, create a new one
      if (gltf.cameras && gltf.cameras.length > 0) {
        camera = gltf.cameras[0];
      } else {
        camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 10;  // Adjusted this value for better visibility
      }

      gltf.scene.position.set(0, 0, 0);  // Reset model's position to the origin
      scene.add(gltf.scene);
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
