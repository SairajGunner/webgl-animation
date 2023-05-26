// Part 1 - Create Scene
const scene = new THREE.Scene();


// Part 2 - Create Object (red cube) and add to the scene
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh); // this is important - tendency to forget

const sizes = {
    width: 800,
    height: 600
}


// Part 3 - Create Camera and add to the scene
// Perspective camera is one of the types of cameras that can be used, but is more presferred as it is more logical than any other
// Perspective Camera needs two input parameters - 'field of view' & 'aspect ratio'
// field of view (fov) - signifies the horizontal coverage of the camera in degrees (in our case 75 degrees)
// aspect ratio - it is the (width / height) ratio of the renderer (it can be the whole viewport but in our case it is fixed to 800 / 600)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);


// Part 4 - Create Renderer and render scene as viewed from the camera
// There are multiple types of renderers available but the WebGLRenderer is preferred
// We need to pass a canvas element to the renderer and hence we need to create that in the HTML

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
// We have instructed the camera on the aspect ratio of the renderer, but we need to mention that to the renderer while we are creating it.
renderer.setSize(sizes.width, sizes.height);
// What we will see now is an 800 * 600 black box because our camera and our object are at the same point and hence we are having the camera inside the object
// We can move the camera along the x, y or z axes. In this case we have moved it by z (camera.position.z = 3)
renderer.render(scene, camera);
