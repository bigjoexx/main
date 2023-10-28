import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/controls/OrbitControls.js';

export default function init() {
  const canvas = document.getElementById('threejsCanvas');
  const scene = new THREE.Scene();
  
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.gammaFactor = 2.2;

  // Ambient light
  const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  scene.add(ambientLight);

  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 0.5, 12);
  const controls = new OrbitControls(camera, renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      
      // Set the y scaling for specific nodes
      const nodesToScale = ['Text.003', 'Marketing.001', 'Fulfillment.001', 'Text.002'];
      nodesToScale.forEach(name => {
        const node = model.getObjectByName(name);
        if (node) {
          node.scale.y = 0.1;
        }
      });

      console.log("Model loaded successfully!");
    },
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
