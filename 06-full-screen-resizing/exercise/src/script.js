import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

// Create Scene
const scene = new THREE.Scene();

// Create Object and add to the scene
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(mesh);

// Create Camera and add to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
controls.update();

camera.position.z = 3;

scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Pixel ratio greater than 2 can cause performance issues

// Animation
const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();