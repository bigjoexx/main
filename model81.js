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

    let positiveTimeScale = 3;
let negativeTimeScale = -3;

// Function to set time scale based on breakpoints
const setTimeScaleBasedOnBreakpoints = () => {
    if (window.innerWidth <= 768) { // Example breakpoint for mobile
        positiveTimeScale = 6;
        negativeTimeScale = -6;
    } else if (window.innerWidth <= 991) { // Example breakpoint for tablet
        positiveTimeScale = 5;
        negativeTimeScale = -5;
    } else if (window.innerWidth <= 1258) { 
        positiveTimeScale = 4;
        negativeTimeScale = -4;
    }else { // Default for desktop
        positiveTimeScale = 3;
        negativeTimeScale = -3;
    }
};

setTimeScaleBasedOnBreakpoints();

    let mixer;
    const actions = [];  // Declare the actions array at the top

    const loader = new GLTFLoader();
    const values = [20, 47, 74, 100];
    const reverseValues = [0, 20, 47, 74];

    loader.load(
        'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            mixer = new THREE.AnimationMixer(model);

            const createAndPushAction = (animationName) => {
                const action = mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, animationName));
                action.setLoop(THREE.LoopOnce, 1);
                action.clampWhenFinished = true;
                action.timeScale = positiveTimeScale;
                actions.push(action);
                return action;
            };

            // Assign action values within the callback:
            let susStangaAction = createAndPushAction('sus stangaAction.001');
            let susDreaptaAction = createAndPushAction('sus dreaptaAction.001');
            let josStangaAction = createAndPushAction('jos stangaAction.001');
            let josDreaptaAction = createAndPushAction('jos dreaptaAction.001');

        const nodesToScale = ['Text003', 'Marketing001', 'Fulfillment001', 'Text002'];
        model.traverse((node) => {
            if (nodesToScale.includes(node.name)) {
                node.scale.y = 0.1;
            }
        });

        console.log("Model loaded successfully!");

        mixer.addEventListener('finished', (event) => {
    if (event.action.timeScale === positiveTimeScale) { // If the animation was playing forward
        event.action.paused = true; // Pause the action
        event.action.time = event.action._clip.duration; // Set it to the last frame
        event.action._updateTime(0); // Update the action time
    } else if (event.action.timeScale === negativeTimeScale) { // If the animation was playing in reverse
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

let lastSliderValue = 0;

window.addEventListener('sliderUpdated', (e) => {
    console.log("Received sliderUpdated event with value:", e.detail.percentage);
    
    const currentValue = parseInt(e.detail.percentage);

    // Determine direction of slider movement
    const isMovingForward = currentValue > lastSliderValue;

    let actionIndex = -1;

    if (isMovingForward) {
        actionIndex = values.indexOf(currentValue);
        if (actionIndex !== -1) {
            actions[actionIndex].paused = false;  // Ensure the animation isn't paused
            actions[actionIndex].timeScale = positiveTimeScale;   // Play forward
            actions[actionIndex].reset().play();
        }
    } else {
        // Determine which action to reverse based on the new reverseValues array
        actionIndex = reverseValues.indexOf(currentValue);
        if (actionIndex !== -1) {
            actions[actionIndex].paused = false;  // Ensure the animation isn't paused
            actions[actionIndex].timeScale = negativeTimeScale;  // Play backward
            actions[actionIndex].play();
        }
    }

    // Update the last slider value
    lastSliderValue = currentValue;
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
    setTimeScaleBasedOnBreakpoints();
    onResize();
}
