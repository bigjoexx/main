import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/controls/OrbitControls.js';

export default function init() {
  const canvas = document.getElementById('threejsCanvas');
const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaFactor = 2.2;

// Ambient light
const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0.5, 4.5, 6);
const controls = new OrbitControls(camera, renderer.domElement);

let mixer; // Declare the mixer globally

const loader = new GLTFLoader();
loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Create an AnimationMixer and connect it to the model
        mixer = new THREE.AnimationMixer(model);

        const animationNames = ['sus stangaAction.001', 'sus dreaptaAction.001', 'jos stangaAction.001', 'jos dreaptaAction.001'];
        const actions = {};

        // Create an object of actions from the animation names
        animationNames.forEach((name) => {
            const clip = THREE.AnimationClip.findByName(gltf.animations, name);
            if (clip) {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.timeScale = 3; // Modify this to control animation speed. >1 is faster, <1 is slower.
                actions[name] = action;
              console.log("Initialized action:", name);
            } else {
                console.warn(`Animation "${name}" not found!`);
            }
        });

      // Log the duration of each animation clip
for (let name in actions) {
    console.log(`Duration of ${name}:`, actions[name].getClip().duration);
}

        window.addEventListener('sliderUpdated', function(e) {
    const sliderValue = e.detail.percentage;
    console.log("Received slider value:", sliderValue);

    let actionToPlay;

    if (sliderValue === 20) {
        actionToPlay = 'sus stangaAction.001';
    } else if (sliderValue === 47) {
        actionToPlay = 'sus dreaptaAction.001';
    } else if (sliderValue === 74) {
        actionToPlay = 'jos stangaAction.001';
    } else if (sliderValue === 100) {
        actionToPlay = 'jos dreaptaAction.001';
    }

    if (actionToPlay) {
        console.log("Attempting to play:", actionToPlay);
        actions[actionToPlay].reset().play();
        console.log(`${actionToPlay} triggered.`);
    }
});


        // Nodes to scale
        const nodesToScale = ['Text003', 'Marketing001', 'Fulfillment001', 'Text002'];

        model.traverse((node) => {
            if (nodesToScale.includes(node.name)) {
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

    // Update the mixer on each frame
    if (mixer) {
        mixer.update(0.01); // Update with a fixed time delta
        console.log("Mixer updated"); 
    }

    renderer.render(scene, camera);
}
animate();

// Handle window resize
function onResize() {
    const parent = canvas.parentElement;
    const computedStyle = getComputedStyle(parent);

    const width = parseInt(computedStyle.width, 10);
    const height = parseInt(computedStyle.height, 10);

    // Update the camera's aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Directly set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Update the renderer's size
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', onResize);

// Initial sizing
onResize();
}
