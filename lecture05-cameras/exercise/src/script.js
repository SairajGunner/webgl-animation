import './style.css';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Find Mouse Cursor Position
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = (event.clientX / sizes.width) - 0.5;
    cursor.y = -((event.clientY / sizes.height) - 0.5);
});

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
controls.update();

// const aspectRatio = sizes.width / sizes.height;

// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100);
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
// camera.lookAt(mesh.position);
// camera.lookAt(new THREE.Vector3());
scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);

// let time = Date.now();
const clock = new THREE.Clock();

// for (let i = 0; i < 20; i++) {
//     gsap.to(mesh.position, { delay: i + 1, duration: 1, x: i % 2 === 0 ? 0 : 2, y: i % 2 === 0 ? 0 : 2 });
// }

// Animation
const tick = () => {
    // Time
    // const currentTime = Date.now();
    // const deltaTime = currentTime - time;
    // time = currentTime;

    const elapsedTime = clock.getElapsedTime();

    // Update Object
    // mesh.rotation.x += 0.0005 * deltaTime;
    // mesh.rotation.y = elapsedTime;
    // mesh.rotation.z += 0.0005 * deltaTime;

    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);

    // camera.position.x = cursor.x * 10;
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5;
    // camera.position.y = cursor.y * 10;
    // camera.lookAt(mesh.position);

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();