import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// set constants
const canvas = document.querySelector('.webgl');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// event listeners
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

// add debug ui
const gui = new dat.GUI();

// load assets
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
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

// create scene
const scene = new THREE.Scene();

// axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.bottom = -2;

directionalLight.shadow.radius = 7;

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

pointLight.shadow.mapSize.width = pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;

// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
// rectAreaLight.position.set(-1.5, 0, 1.5);
// rectAreaLight.lookAt(new THREE.Vector3());
// scene.add(rectAreaLight);

const spotlight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotlight.castShadow = true;
spotlight.position.set(0, 2, 2);
scene.add(spotlight);
scene.add(spotlight.target);    // important to add the target if we want the transformations to work

spotlight.shadow.mapSize.width = spotlight.shadow.mapSize.height = 1024;
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
scene.add(spotlightCameraHelper);
spotlightCameraHelper.visible = false;

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
// scene.add(hemisphereLightHelper);
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
// scene.add(directionalLightHelper);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// scene.add(rectAreaLightHelper);
// window.requestAnimationFrame(() => {
//     rectAreaLightHelper.position.copy(rectAreaLight.position);
//     rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
//     rectAreaLightHelper.update();
// });

// create objects
const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.7;
material.roughness = 0.4;
gui.add(material, 'metalness').min(0).max(1).step(0.01);
gui.add(material, 'roughness').min(0).max(1).step(0.01);


const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

// const plane = new THREE.Mesh(                // Baking Example
//     new THREE.PlaneBufferGeometry(5, 5),
//     new THREE.MeshBasicMaterial({
//         map: bakedShadow
//     })
// );
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
);
plane.receiveShadow = true;
plane.position.y = -0.5;
plane.rotation.x = -Math.PI * 0.5;

const sphereShadow = new THREE.Mesh(new THREE.PlaneBufferGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow
}));
sphereShadow.rotation.x = - Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphere, sphereShadow, plane);

// create camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

// create renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// animate
const clock = new THREE.Clock();

const tick = () => {
    // add transformations
    const elapsedTime = clock.getElapsedTime();

    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    controls.update();

    // render
    renderer.render(scene, camera);

    // call requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();