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

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 4.5, 6);
    const controls = new OrbitControls(camera, renderer.domElement);

    let mixer;
    let susStangaAction, susDreaptaAction, josStangaAction, josDreaptaAction;
const loader = new GLTFLoader();

const values = [20, 47, 74, 100];

loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        // Assign action values within the callback:
            susStangaAction = mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'sus stangaAction.001'));
            susStangaAction.setLoop(THREE.LoopOnce, 1);
            susStangaAction.clampWhenFinished = true;
            susStangaAction.timeScale = 3;

            susDreaptaAction = mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'sus dreaptaAction.001'));
            susDreaptaAction.setLoop(THREE.LoopOnce, 1);
            susDreaptaAction.clampWhenFinished = true;
            susDreaptaAction.timeScale = 3;

            josStangaAction = mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'jos stangaAction.001'));
            josStangaAction.setLoop(THREE.LoopOnce, 1);
            josStangaAction.clampWhenFinished = true;
            josStangaAction.timeScale = 3;

            josDreaptaAction = mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, 'jos dreaptaAction.001'));
            josDreaptaAction.setLoop(THREE.LoopOnce, 1);
            josDreaptaAction.clampWhenFinished = true;
            josDreaptaAction.timeScale = 3;

        const nodesToScale = ['Text003', 'Marketing001', 'Fulfillment001', 'Text002'];
        model.traverse((node) => {
            if (nodesToScale.includes(node.name)) {
                node.scale.y = 0.1;
            }
        });

        console.log("Model loaded successfully!");

        mixer.addEventListener('finished', (event) => {
    if (event.action.timeScale === 1) { // If the animation was playing forward
        event.action.paused = true; // Pause the action
        event.action.time = event.action._clip.duration; // Set it to the last frame
        event.action._updateTime(0); // Update the action time
    } else if (event.action.timeScale === -1) { // If the animation was playing in reverse
        event.action.paused = true; // Pause the action
        event.action.time = 0; // Set it to the first frame
        event.action._updateTime(0); // Update the action time
    }
});

    },
    undefined,
    (error) => {
        console.error("Error loading model:", error);
    }
);

let currentSliderValue = 0;

window.addEventListener('sliderUpdated', function(e) {
    const newSliderValue = parseInt(e.detail.percentage);
    
    console.log("Current Slider Value:", currentSliderValue);
    console.log("New Slider Value:", newSliderValue);

    let actionToPlay;
    if (newSliderValue < currentSliderValue) { // Slider moved backward
        if (newSliderValue === 74) {
            actionToPlay = josDreaptaAction;
        } else if (newSliderValue === 47) {
            actionToPlay = josStangaAction;
        } else if (newSliderValue === 20) {
            actionToPlay = susDreaptaAction;
        } else if (newSliderValue === 0) {
            actionToPlay = susStangaAction;
        }
        if (actionToPlay) {
            actionToPlay.time = actionToPlay._clip.duration; // Set it to the last frame
            actionToPlay.timeScale = -1; // Play in reverse
            actionToPlay.play();
        }
    } else { // Slider moved forward
        if (newSliderValue === 20) {
            actionToPlay = susStangaAction;
        } else if (newSliderValue === 47) {
            actionToPlay = susDreaptaAction;
        } else if (newSliderValue === 74) {
            actionToPlay = josStangaAction;
        } else if (newSliderValue === 100) {
            actionToPlay = josDreaptaAction;
        }
        if (actionToPlay) {
            actionToPlay.time = 0; // Set it to the first frame
            actionToPlay.timeScale = 1; // Play forward
            actionToPlay.play();
        }
    }

    currentSliderValue = newSliderValue;
});



const animate = () => {
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(0.01);
    }
    renderer.render(scene, camera);
}
animate();

    function onResize() {
        const parent = canvas.parentElement;
        const computedStyle = getComputedStyle(parent);

        const width = parseInt(computedStyle.width, 10);
        const height = parseInt(computedStyle.height, 10);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        canvas.width = width;
        canvas.height = height;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', onResize);
    onResize();
}
