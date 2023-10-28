import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.3/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/controls/OrbitControls.js';

export default function init() {

var scene, camera, renderer, controls;

    document.addEventListener("DOMContentLoaded", function() {
        init();
        animate();
    });

    function init() {
        // Create Scene
        scene = new THREE.Scene();

        // Set the background to transparent
        scene.background = null;

        // Create Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 12;
        camera.position.y = 0.5;

        // Create Renderer
        var renderCanvas = document.getElementById('myCanvas');
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Ambient Light
        var ambient = new THREE.HemisphericLight(0xffffff, 0x080820, 1.5);
        scene.add(ambient);

        // OrbitControls for better interactivity
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // Load GLTF Model
        var loader = new THREE.GLTFLoader();
        loader.load("https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem", function(gltf) {
            scene.add(gltf.scene);

            // Adjust scaling of specific nodes (you might need to adjust these based on the structure of your GLTF)
            gltf.scene.traverse(function(node) {
                if (node.name === "Text.003" || node.name === "Marketing.001" || node.name === "Fulfillment.001" || node.name === "Text.002") {
                    node.scale.y = 0.1;
                }
            });

            console.log("Model loaded successfully!");
        });

        // Handle Window Resize
        window.addEventListener("resize", onWindowResize, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
