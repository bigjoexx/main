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
const loader = new GLTFLoader();

const values = [20, 47, 74, 100];

loader.load(
    'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        // Handle 'sus stangaAction.001' animation
        const susStangaClip = THREE.AnimationClip.findByName(gltf.animations, 'sus stangaAction.001');
        const susStangaAction = mixer.clipAction(susStangaClip);
        susStangaAction.setLoop(THREE.LoopOnce, 1);
        susStangaAction.clampWhenFinished = true;

        // Handle 'sus dreaptaAction.001' animation
        const susDreaptaClip = THREE.AnimationClip.findByName(gltf.animations, 'sus dreaptaAction.001');
        const susDreaptaAction = mixer.clipAction(susDreaptaClip);
        susDreaptaAction.setLoop(THREE.LoopOnce, 1);
        susDreaptaAction.clampWhenFinished = true;

        // Handle 'sus stangaAction.001' animation
        const josStangaClip = THREE.AnimationClip.findByName(gltf.animations, 'jos stangaAction.001');
        const josStangaAction = mixer.clipAction(josStangaClip);
        josStangaAction.setLoop(THREE.LoopOnce, 1);
        josStangaAction.clampWhenFinished = true;

        // Handle 'sus dreaptaAction.001' animation
        const josDreaptaClip = THREE.AnimationClip.findByName(gltf.animations, 'jos dreaptaAction.001');
        const josDreaptaAction = mixer.clipAction(josDreaptaClip);
        josDreaptaAction.setLoop(THREE.LoopOnce, 1);
        josDreaptaAction.clampWhenFinished = true;

        const nodesToScale = ['Text003', 'Marketing001', 'Fulfillment001', 'Text002'];
        model.traverse((node) => {
            if (nodesToScale.includes(node.name)) {
                node.scale.y = 0.1;
            }
        });

        console.log("Model loaded successfully!");

        // Attach the event listener to the mixer
        mixer.addEventListener('finished', (event) => {
            if (event.action === susStangaAction || event.action === susDreaptaAction) {
                event.action.stop(); 
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

    if (newSliderValue < currentSliderValue) {
        if (newSliderValue === 20) {
            susStangaAction.reset().play().setDirection(-1);
        } else if (newSliderValue === 47) {
            susDreaptaAction.reset().play().setDirection(-1);
        } else if (newSliderValue === 47) {
            josStangaAction.reset().play().setDirection(-1);
        } else if (newSliderValue === 47) {
            josDreaptaAction.reset().play().setDirection(-1);

    } else {
        if (newSliderValue === 20) {
            susStangaAction.reset().play().setDirection(1);
        } else if (newSliderValue === 47) {
            susDreaptaAction.reset().play().setDirection(1);
        } else if (newSliderValue === 47) {
            josStangaAction.reset().play().setDirection(1);
        } else if (newSliderValue === 47) {
            josDreaptaAction.reset().play().setDirection(1);
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
