import './style.css';
import * as THREE from 'three';

// Create Scene
const scene = new THREE.Scene();

// Create Object and add to scene
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
scene.add(mesh);

const sizes = {
    width: 800,
    height: 600
}

// Create Camera and add to scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);