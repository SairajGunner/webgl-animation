import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//#region Set Constants and Initiaize Debug UI
const canvas = document.querySelector('.webgl');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI();
//#endregion

//#region  Event Listeners
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
//#endregion

//#region Load Assets
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('started loading assets');
}
loadingManager.onProgress = () => {
    console.log('asset loading in progress');
}
loadingManager.onLoad = () => {
    console.log('assets have been loaded');
}
loadingManager.onError = (e) => {
    console.error('failed to load assets. check details below -');
    console.error(e);
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const particleTexture = textureLoader.load('/textures/particles/2.png');
//#endregion

//#region Create Scene
const scene = new THREE.Scene();
//#endregion

//#region Create Objects

// const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
// cube.material.side = 2;
// scene.add(cube);

//#region Using pre-defined geometry
// const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
//#endregion

//#region Using Custom Geometry
const geometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//#endregion

const material = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    // color: 0xff88cc,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.01,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});
const particles = new THREE.Points(geometry, material);
scene.add(particles);
//#endregion

//#region Create Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);
//#endregion

//#region Set Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();
//#endregion

//#region Create Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//#endregion

//#region Animation
const tick = () => {
    // transform objects
    particles.rotation.y += Math.PI / 2048;
    controls.update();

    // render scene
    renderer.render(scene, camera);

    // request animation frame
    window.requestAnimationFrame(tick);
}
tick();
//#endregion