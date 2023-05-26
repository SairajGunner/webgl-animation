import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

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

// Mouse Events
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});
window.addEventListener('click', () => {
    if (witness)
        console.log('clicked a sphere');
});

// Create Scene
const scene = new THREE.Scene();

// Create Object and add to the scene
const object1 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
object1.position.setX(-2);
const object2 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
const object3 = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
object3.position.setX(2);
scene.add(object1, object2, object3);

// Create Raycaster
const raycaster = new THREE.Raycaster();

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

const clock = new THREE.Clock();
let witness = null;     // this object will tell us if there was an object under our ray caster

// Animation
const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

    raycaster.setFromCamera(mouse, camera);

    // const raycasterOrigin = new THREE.Vector3(-3, 0, 0);
    // const raycasterDirection = new THREE.Vector3(10, 0, 0);
    // raycasterDirection.normalize();
    // raycaster.set(raycasterOrigin, raycasterDirection);

    const objectsToTest = [object1, object2, object3];

    const intersects = raycaster.intersectObjects(objectsToTest);

    for (let object of objectsToTest) {
        object.material.color.set(0xff0000);
    }

    if (intersects.length > 0) {
        for (let intersect of intersects) {
            intersect.object.material.color.set(0x0000ff);
        }
    }

    if (intersects.length) {
        if (!witness)
            console.log('mouse entered');
        witness = intersects[0];
    } else {
        if (witness)
            console.log('mouse left')
        witness = null;
    }

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();
