import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';

// Create Scene
const scene = new THREE.Scene();

// Create Object and add to the scene
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(mesh);

const sizes = {
    width: 800,
    height: 600
}

scene.add(new THREE.AxesHelper(2))

// Create Camera and add to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);

// let time = Date.now();
// const clock = new THREE.Clock();

for (let i = 0; i < 20; i++) {
    gsap.to(mesh.position, { delay: i + 1, duration: 1, x: i % 2 === 0 ? 0 : 2, y: i % 2 === 0 ? 0 : 2 });
}

// Animation
const tick = () => {
    // Time
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;

    // const elapsedTime = clock.getElapsedTime();


    // Update Object
    // mesh.rotation.x += 0.0005 * deltaTime;
    // mesh.rotation.y += 0.0005 * deltaTime;
    // mesh.rotation.z += 0.0005 * deltaTime;

    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);

    camera.lookAt(mesh.position);

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();