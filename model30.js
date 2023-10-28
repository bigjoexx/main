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
    const animations = ['sus stangaAction.001', 'sus dreaptaAction.001', 'jos stangaAction.001', 'jos dreaptaAction.001'];
    const actions = [];

    loader.load(
        'https://dl.dropboxusercontent.com/scl/fi/f03zdcafvxp8k62r17v6f/Puzzle-jigsaw-smallblend-2.glb?rlkey=b67cvu8bteqtduzes8wq8jbem',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            mixer = new THREE.AnimationMixer(model);
            animations.forEach(name => {
                const clip = THREE.AnimationClip.findByName(gltf.animations, name);
                const action = mixer.clipAction(clip);
                actions.push(action);
            });

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

    window.addEventListener('sliderUpdated', (e) => {
        const value = e.detail.percentage;
        const index = values.indexOf(value);
        if(index !== -1) {
            actions[index].play();
        }
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
