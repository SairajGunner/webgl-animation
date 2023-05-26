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
//#endregion

//#region Create Scene
const scene = new THREE.Scene();
//#endregion

//#region Create Objects
const galaxyParameters = {};
galaxyParameters.count = 100000;
galaxyParameters.size = 0.01;
galaxyParameters.radius = 10;
galaxyParameters.branches = 3;
galaxyParameters.spin = 1;
galaxyParameters.randomness = 0.2;
galaxyParameters.randomnessPower = 3;
galaxyParameters.insideColor = 0xff6030;
galaxyParameters.outsideColor = 0x1b3984;

let geometry = null;
let material = null;
let galaxy = null;

const generateGalaxy = () => {
    if (galaxy) {
        geometry.dispose();
        material.dispose();
        scene.remove(galaxy);
    }
    geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial({
        size: galaxyParameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    const positions = new Float32Array(galaxyParameters.count * 3);
    const colors = new Float32Array(galaxyParameters.count * 3);

    const insideColor = new THREE.Color(galaxyParameters.insideColor);
    const outsideColor = new THREE.Color(galaxyParameters.outsideColor);

    for (let i = 0; i < galaxyParameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * galaxyParameters.radius;

        const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.radius;
        const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.radius;
        const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParameters.radius;

        const branchAngle = (i % galaxyParameters.branches) / galaxyParameters.branches * Math.PI * 2;
        const spinAngle = radius * galaxyParameters.spin;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / galaxyParameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
}

generateGalaxy();

//#region Create Debug Tweaks
gui.add(galaxyParameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
gui.add(galaxyParameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(galaxyParameters, 'outsideColor').onFinishChange(generateGalaxy);
//#endregion

//#endregion

//#region Create Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.y = 10;
camera.position.z = 10;
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
    controls.update();

    // render scene
    renderer.render(scene, camera);

    // request animation frame
    window.requestAnimationFrame(tick);
};
tick();
//#endregion