import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferAttribute } from 'three';

const canvas = document.querySelector('.webgl');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    document.fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen();
});

// Create Scene
const scene = new THREE.Scene();

// Create Object
// const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
// scene.add(mesh);

// // Create Own Geometry
// const geometry = new THREE.Geometry();
// for (let i = 0; i < 50; i++) {
//     for (let j = 0; j < 3; j++) {
//         geometry.vertices.push(new THREE.Vector3(
//             (Math.random() - 0.5) * 4,
//             (Math.random() - 0.5) * 4,
//             (Math.random() - 0.5) * 4
//         ));
//     }
//     const startVertex = i * 3;
//     geometry.faces.push(new THREE.Face3(startVertex, startVertex + 1, startVertex + 2));
// }
// // geometry.vertices.push(new THREE.Vector3(0, 0, 0));
// // geometry.vertices.push(new THREE.Vector3(1, 0, 0));
// // geometry.vertices.push(new THREE.Vector3(0, 1, 0));
// // const face = new THREE.Face3(0, 1, 2);
// // geometry.faces.push(face);
// scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })));

// // Create Own Buffer Geometry
// // Step 1 - Setup the vertices in a Float32Array
// const positionsArray = new Float32Array([
//     0, 0, 0,
//     0, 1, 0,
//     1, 0, 0
// ]);
// // Create a BufferAttribute
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// // Create an instance of BufferGeometry and set the 'position' attribute
// const geometry = new THREE.BufferGeometry().setAttribute('position', positionsAttribute);
// // Add the geometry as an Object3D to the scene
// scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })));

// Create Multiple Triangles Using BufferGeometry
const geometry = new THREE.BufferGeometry();
const positionsArray = new Float32Array(50 * 3 * 3);
for (let i = 0; i < positionsArray.length; i++) {
    positionsArray[i] = ((Math.random() - 0.5) * 4);
}
const positionsAttribute = new BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

scene.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })));

// Create Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Add Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

// Create Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);

// Animation
const tick = () => {
    // Write transformation
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call RequestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();