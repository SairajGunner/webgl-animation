import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

const gui = new dat.GUI();
const debugOptions = {};

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Resizing
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // This is to prevent distortion when user changes screen size
});

// Fullscreen Control - Need changes for Safari
window.addEventListener('dblclick', () => {
    document.fullscreenElement ? document.exitFullscreen() : document.querySelector('.webgl').requestFullscreen();
});

// Asset Loaders
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

// Create Scene
const scene = new THREE.Scene();

// Create Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.shadow.camera.far = 15;
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('intensity');
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('lightX');
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('lightY');
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('lightZ');

// Loading Textures
const environmentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = environmentMap;
            child.material.envMapIntensity = debugOptions.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}
debugOptions.envMapIntensity = 5;
gui.add(debugOptions, 'envMapIntensity').min(0).max(10).step(0.001).name('envMapIntensity').onChange(updateAllMaterials);

// Create Objects
// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     gltf.scene.rotation.y = Math.PI / 2;
//     scene.add(gltf.scene);

//     updateAllMaterials();
//     gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).name('helmetRotation');
// }, undefined, (e) => {
//     console.error(e);
// });
gltfLoader.load('/models/Hamburger/hamburger.glb', (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.y = Math.PI / 2;
    scene.add(gltf.scene);
    updateAllMaterials();
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).name('helmetRotation');
}, undefined, (e) => {
    console.error(e);
});


// Create Camera and add to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
controls.update();

camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('.webgl'),
    antialias: true
});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Pixel ratio greater than 2 can cause performance issues
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
});
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01);

const clock = new THREE.Clock();
let previousTime = 0;

// Animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();
