import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import testVertexShader from './shaders/test/vertex.glsl';
import testFragmentShader from './shaders/test/fragment.glsl';

const gui = new dat.GUI();

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
const textureLoader = new THREE.TextureLoader();

// Create Scene
const scene = new THREE.Scene();

// Create Lights

// Loading Textures
const flagTexture = textureLoader.load('/textures/flags/France.jpg');

// Create Objects
const geometry = new THREE.PlaneBufferGeometry(1.5, 1, 32, 32);
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 2) },
        uTime: { value: 0 },
        uTexture: { value: flagTexture }
    }
});

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random();
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

scene.add(new THREE.Mesh(geometry, material));

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX');
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY');

// Create Camera and add to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
controls.update();

camera.position.x = 1;
camera.position.y = 0;
camera.position.z = 1;
scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Pixel ratio greater than 2 can cause performance issues
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const clock = new THREE.Clock();
let previousTime = 0;

// Animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update Material
    material.uniforms.uTime.value = elapsedTime;

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();
