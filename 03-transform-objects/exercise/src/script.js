import './style.css';
import * as THREE from 'three';

// Create Scene
const scene = new THREE.Scene();

// Create Object and add to scene
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
mesh.position.set(0.7, -0.6, 1); // Positioning the object
mesh.scale.set(2, 0.5, 0.5); // Scaling the object
//Rotation
mesh.rotation.reorder('YXZ');   // toggle comment to see differnce in output
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;
scene.add(mesh);

// Create a group, add cubes in them and apply transformations to the group
const group = new THREE.Group();
scene.add(group);

const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
mesh1.position.setX(-1);
group.add(mesh1);
const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
mesh2.position.setX(0);
group.add(mesh2);
const mesh3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
mesh3.position.setX(-2);
group.add(mesh3);

group.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0);

console.log('distance between the centre of the scene and the object - ', mesh.position.length());

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

const sizes = {
    width: 800,
    height: 600
}

// Create Camera and add to scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.setZ(3);
scene.add(camera);
camera.lookAt(group.position);

console.log('distance between the camera and the object - ', mesh.position.distanceTo(camera.position));

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl')
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);