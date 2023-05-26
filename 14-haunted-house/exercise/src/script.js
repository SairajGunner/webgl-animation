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

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg');
const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg');

grassAmbientOcclusionTexture.repeat.set(8, 8);
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassAmbientOcclusionTexture.wrapS = grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.wrapS = grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapS = grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const windowColorTexture = textureLoader.load('/textures/window/color.png');
const windowHeightTexture = textureLoader.load('/textures/window/height.png');
const windowNormalTexture = textureLoader.load('/textures/window/normal.png');

// create scene
const scene = new THREE.Scene();

// add fog
const fog = new THREE.Fog(0x262837, 0, 15);
scene.fog = fog;

// create objects
const house = new THREE.Group();
house.name = 'house';
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial(
        {
            map: bricksColorTexture,
            aoMap: bricksAmbientOcclusionTexture,
            normalMap: bricksNormalTexture,
            roughnessMap: bricksRoughnessTexture
        }));
walls.geometry.setAttribute('uv2', new THREE.Float64BufferAttribute(walls.geometry.attributes.uv.array, 2));
walls.position.y += walls.geometry.parameters.height / 2;
house.add(walls);

const roof = new THREE.Mesh(new THREE.ConeBufferGeometry(walls.geometry.parameters.width * Math.PI / 3.5, 1, 4), new THREE.MeshStandardMaterial({ color: 0xb35f45 }));
roof.position.y += walls.geometry.parameters.height + (roof.geometry.parameters.height / 2);
roof.rotation.y += Math.PI / 4
house.add(roof);

const door = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial(
        {
            map: doorColorTexture,
            transparent: true,
            alphaMap: doorAlphaTexture,
            aoMapIntensity: doorAmbientOcclusionTexture,
            displacementMap: doorHeightTexture,
            displacementScale: 0.1,
            normalMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughnessMap: doorRoughnessTexture
        }));
door.position.z = walls.geometry.parameters.width / 2 + 0.01;
door.position.y = door.geometry.parameters.height / 2 - 0.1;
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
house.add(door);

const windowGeometry = new THREE.PlaneBufferGeometry(1, 1);
const windowMaterial = new THREE.MeshStandardMaterial({
    map: windowColorTexture,
    normalMap: windowNormalTexture,
    displacementMap: windowHeightTexture
});
const windowRight = new THREE.Mesh(windowGeometry, windowMaterial);
windowRight.position.x = walls.geometry.parameters.width / 2 + 0.01;
windowRight.position.y = walls.geometry.parameters.height / 2;
windowRight.rotation.y = Math.PI / 2;
house.add(windowRight);

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });

[{
    position: {
        x: 0.8,
        y: 0.2,
        z: 2.2
    },
    scale: 0.5
}, {
    position: {
        x: 1.4,
        y: 0.1,
        z: 2.1
    },
    scale: 0.25
}, {
    position: {
        x: -0.8,
        y: 0.1,
        z: 2.1
    },
    scale: 0.4
}, {
    position: {
        x: -1,
        y: 0.05,
        z: 2.6
    },
    scale: 0.15
}].forEach(bushParams => {
    const bush = new THREE.Mesh(bushGeometry, bushMaterial);
    bush.name = 'bush';
    bush.position.set(bushParams.position.x, bushParams.position.y, bushParams.position.z);
    bush.scale.set(bushParams.scale, bushParams.scale, bushParams.scale);
    house.add(bush);
});

const graveGroup = new THREE.Group();
graveGroup.name = 'graveGroup';
scene.add(graveGroup);
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.x = Math.sin(angle) * radius;
    grave.position.y = (grave.geometry.parameters.height / 2) - 0.1;
    grave.position.z = Math.cos(angle) * radius;

    grave.rotation.y = grave.rotation.z = (Math.random() - 0.5) * 0.4;
    graveGroup.add(grave);
}

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial(
        {
            map: grassColorTexture,
            aoMap: grassAmbientOcclusionTexture,
            normalMap: grassNormalTexture,
            roughnessMap: grassRoughnessTexture
        }));
floor.geometry.setAttribute('uv2', new THREE.Float64BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.receiveShadow = true;
floor.position.y = 0;
floor.rotation.x = -Math.PI * 0.5;

scene.add(floor);

const partyWall = new THREE.Group();
scene.add(partyWall);

const partyWallPosition = Object.freeze({
    frontLeft: 1,
    frontRight: 2,
    left: 3,
    right: 4,
    back: 5
});

const positionPartyWall = (currentPartyWall, position) => {
    switch (position) {
        case partyWallPosition.frontLeft:
            currentPartyWall.position.x = walls.position.x - (floor.geometry.parameters.width / 2) + (currentPartyWall.geometry.parameters.width / 2);
            currentPartyWall.position.y = floor.position.y + currentPartyWall.geometry.parameters.height / 2;
            currentPartyWall.position.z = floor.position.z + (floor.geometry.parameters.height / 2) + currentPartyWall.geometry.parameters.depth / 2;
            return currentPartyWall;

        case partyWallPosition.frontRight:
            currentPartyWall.position.x = walls.position.x + (floor.geometry.parameters.width / 2) - (currentPartyWall.geometry.parameters.width / 2);
            currentPartyWall.position.y = floor.position.y + currentPartyWall.geometry.parameters.height / 2;
            currentPartyWall.position.z = floor.position.z + (floor.geometry.parameters.height / 2) + currentPartyWall.geometry.parameters.depth / 2;
            return currentPartyWall;

        case partyWallPosition.left:
            currentPartyWall.rotation.y += Math.PI / 2;
            currentPartyWall.position.x = walls.position.x - (floor.geometry.parameters.width / 2);
            currentPartyWall.position.y = floor.position.y + currentPartyWall.geometry.parameters.height / 2;
            currentPartyWall.position.z = floor.position.z;
            return currentPartyWall;

        case partyWallPosition.right:
            currentPartyWall.rotation.y += Math.PI / 2;
            currentPartyWall.position.x = walls.position.x + (floor.geometry.parameters.width / 2);
            currentPartyWall.position.y = floor.position.y + currentPartyWall.geometry.parameters.height / 2;
            currentPartyWall.position.z = floor.position.z;
            return currentPartyWall;
            
        case partyWallPosition.back:
            currentPartyWall.position.x = walls.position.x;
            currentPartyWall.position.y = floor.position.y + currentPartyWall.geometry.parameters.height / 2;
            currentPartyWall.position.z = floor.position.z - (floor.geometry.parameters.height / 2);
            return currentPartyWall;

        default:
            break;
    }
}

[partyWallPosition.frontLeft, partyWallPosition.frontRight, partyWallPosition.left, partyWallPosition.right, partyWallPosition.back].forEach(position => {
    const currentPartyWall = new THREE.Mesh(
        new THREE.BoxBufferGeometry(
            position === partyWallPosition.frontLeft || position === partyWallPosition.frontRight ? (floor.geometry.parameters.width / 2) - 1 : floor.geometry.parameters.width + 1, 1, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xff00ff }));
    positionPartyWall(currentPartyWall, position);
    partyWall.add(currentPartyWall);
});

// add lighting
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('ambient light intensity');
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.01).name('moon light intensity');
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001).name('moon light x');
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001).name('moon light y');
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001).name('moon light z');
scene.add(moonLight);

const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.5, 3.5);
house.add(doorLight);

// ghosts
const ghost1 = new THREE.PointLight(0xff00ff, 2, 3);
const ghost2 = new THREE.PointLight(0x00ffff, 2, 3);
const ghost3 = new THREE.PointLight(0xffff00, 2, 3);

scene.add(ghost1, ghost2, ghost3);

// create camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = camera.position.y = camera.position.z = 5;
scene.add(camera);

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2 - Math.PI / 16;
controls.update();

// create renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0x262837);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
doorLight.shadow.mapSize.width = doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;
[ghost1, ghost2, ghost3].forEach(ghost => {
    ghost.castShadow = true;
    ghost.shadow.mapSize.width = ghost.shadow.mapSize.height = 256;
    ghost.shadow.camera.far = 7;
});
walls.castShadow = true;
scene.children.find(child => child.name === 'house').children.forEach(child => child.name === 'bush' ? child.castShadow = true : false);
scene.children.find(child => child.name === 'graveGroup').children.forEach(child => child.castShadow = true);
floor.receiveShadow = true;


// animate
const clock = new THREE.Clock();

const tick = () => {
    // add transformations
    const elapsedTime = clock.getElapsedTime();

    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = - elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = - elapsedTime * 0.18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2);

    controls.update();

    // render
    renderer.render(scene, camera);

    // call requestAnimationFrame
    window.requestAnimationFrame(tick);
}

tick();