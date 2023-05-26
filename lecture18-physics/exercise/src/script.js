import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es';

const gui = new dat.GUI();
const debugObject = {};

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        });
}
gui.add(debugObject, 'createSphere');

debugObject.createBox = () => {
    createBox(
        Math.random() * 0.5, {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
        z: (Math.random() - 0.5) * 3
    }, {
        x: (Math.random() - 0.5) * Math.PI,
        y: (Math.random() - 0.5) * Math.PI,
        z: (Math.random() - 0.5) * Math.PI
    });
}
gui.add(debugObject, 'createBox');

debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        // remove body
        object.body.removeEventListener('collide', playHitSound);
        world.removeBody(object.body);

        // remove mesh
        scene.remove(object.mesh);
    }
}
gui.add(debugObject, 'reset');

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
// window.addEventListener('dblclick', () => {
//     document.fullscreenElement ? document.exitFullscreen() : document.querySelector('.webgl').requestFullscreen();
// });

// Audio
const hitSound = new Audio('/sounds/hit.mp3');

const playHitSound = (collision) => {
    hitSound.currentTime = 0;
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    impactStrength > 7 ?
        hitSound.volume = 1 : impactStrength > 3 && impactStrength < 7 ?
            hitSound.volume = 0.5 : hitSound.volume = 0;
    hitSound.play();
}

// Textures
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);

// Create Scene
const scene = new THREE.Scene();

// Create Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(3, 3, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Create Object and add to the scene

// const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.4 }));
// sphere.castShadow = true;
// scene.add(sphere);   // This part of the code added in the common function to create the 3D Sphere and the Physics sphere

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(50, 50), new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.4 }));
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Create Camera and add to the scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
controls.update();

camera.position.x = -5;
camera.position.y = 5;
camera.position.z = 5;
scene.add(camera);

// Physics
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -9.8, 0);
world.allowSleep = true;

// const concreteMaterial = new CANNON.Material('concrete');
// const plasticMaterial = new CANNON.Material('plastic');
const defaultMaterial = new CANNON.Material('default');

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//     concreteMaterial,
//     plasticMaterial,
//     {
//         friction: 0.1,
//         restitution: 0.7
//     });
// world.addContactMaterial(concretePlasticContactMaterial);

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.5,
        restitution: 0.7
    });
world.addContactMaterial(defaultContactMaterial);

world.defaultContactMaterial = defaultContactMaterial;

// Sphere will be added in the common method to make the sphere in the 3d and physics worlds together

// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     // material: defaultMaterial,
//     shape: sphereShape
// });
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new Vec3(0, 0, 0));
// world.addBody(sphereBody);

const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
});

const createSphere = (radius, position) => {
    // 3d scene
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.scale.set(radius, radius, radius);
    sphere.castShadow = true;
    sphere.position.copy(position);
    scene.add(sphere);

    // physics world
    const sphereBody = new CANNON.Body(
        {
            shape: new CANNON.Sphere(radius),
            mass: 1,
            material: defaultMaterial
        });
    sphereBody.position.copy(position);
    sphereBody.sleepSpeedLimit = 0.01;
    sphereBody.addEventListener('collide', playHitSound);
    world.addBody(sphereBody);

    objectsToUpdate.push({ mesh: sphere, body: sphereBody });
}

createSphere(0.5, { x: 0, y: 3, z: 0 });

const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    envMap: environmentMapTexture,
    metalness: 0.9,
    roughness: 0.1
});

const createBox = (scale, position, rotation) => {
    // 3d scene
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.scale.set(scale, scale, scale);
    box.position.copy(position);
    box.castShadow = true;
    box.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), rotation.x);
    box.quaternion.setFromAxisAngle(new THREE.Vector3(0, -1, 0), rotation.y);
    box.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, -1), rotation.z);

    scene.add(box);

    // physics world
    const boxBodyShape = new CANNON.Box(new CANNON.Vec3(scale / 2, scale / 2, scale / 2));
    const boxBody = new CANNON.Body({ shape: boxBodyShape, mass: 1, material: defaultMaterial });
    boxBody.position.copy(position);
    boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), rotation.x);
    boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), rotation.y);
    boxBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, -1), rotation.z);

    boxBody.addEventListener('collide', playHitSound);

    world.addBody(boxBody);

    objectsToUpdate.push({ mesh: box, body: boxBody });
}

createBox(0.5, { x: 3, y: 3, z: 0 }, { x: Math.PI / 4, y: 0, z: Math.PI / 3 });

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
// floorBody.material = defaultMaterial;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

// Create Renderer and render the scene
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('.webgl') });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Pixel ratio greater than 2 can cause performance issues

const clock = new THREE.Clock();
const oldTime = 0;

// Animation
const tick = () => {
    const elapsedTiime = clock.getElapsedTime();
    const deltaTime = elapsedTiime - oldTime;

    // update physics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    }

    world.step(1 / 60, deltaTime, 3);

    // update 3D world
    // sphere.position.copy(sphereBody.position);
    controls.update();

    // Render
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.render(scene, camera);

    // Call method in requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();
