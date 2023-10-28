import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/controls/OrbitControls.js';

export default function init() {
  const canvas = document.getElementById('threejsCanvas');
  const scene = new THREE.Scene();
  
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.gammaFactor = 2.2; // Use gamma correction for better color accuracy

  let camera;

  // Environment map for reflections
  const envMap = new THREE.CubeTextureLoader()
    .setPath('path_to_your_environment_map/') // Replace with the path to your cube environment map
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']); // Replace with your environment map filenames
  scene.background = envMap;

  const loader = new GLTFLoader();
  loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
    (gltf) => {
      scene.add(gltf.scene);
      
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.envMap = envMap; // Assign environment map to materials
        }
      });

      if (gltf.cameras && gltf.cameras.length > 0) {
        camera = gltf.cameras[0];
      } else {
        camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);
      }

      const controls = new OrbitControls(camera, renderer.domElement);
    }
  );

  const animate = () => {
    requestAnimationFrame(animate);
    if (camera) {
      renderer.render(scene, camera);
    }
  }
  animate();
}
