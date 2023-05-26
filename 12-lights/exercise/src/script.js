import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

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

// create scene
const scene = new THREE.Scene();

// axes helper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

const pointLight = new THREE.PointLight(0xff9fff, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotlight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1);
spotlight.position.set(0, 2, 3);
spotlight.target.position.x = -0.75;
scene.add(spotlight.target);    // important to add the target if we want the transformations to work
scene.add(spotlight);

// lighting helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
scene.add(hemisphereLightHelper);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
scene.add(directionalLightHelper);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);
window.requestAnimationFrame(() => {
    spotlightHelper.update();
});

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);
window.requestAnimationFrame(() => {
    rectAreaLightHelper.position.copy(rectAreaLight.position);
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion);
    rectAreaLightHelper.update();
});

// create objects
const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.7;
material.roughness = 0.4;
gui.add(material, 'metalness').min(0).max(1).step(0.01);
gui.add(material, 'roughness').min(0).max(1).step(0.01);

const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(0.75, 0.75, 0.75), material);

const sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const torus = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.position.y = -0.65;
plane.rotation.x = -Math.PI * 0.5;

scene.add(cube, sphere, torus, plane);

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

// animate
const clock = new THREE.Clock();

const tick = () => {
    // add transformations
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.x = cube.rotation.y = elapsedTime * Math.PI * 0.125;
    torus.rotation.x = cube.rotation.y = elapsedTime * Math.PI * 0.125;
    controls.update();

    // render
    renderer.render(scene, camera);

    // call requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();