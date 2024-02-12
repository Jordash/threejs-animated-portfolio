import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Create Main Scene
const scene = new THREE.Scene();

//Create a Perspective Camera (Mimics human vision)
// Arg 1: Field of view in degrees. Amount of world that is visible out of 360 deg.
// Arg 2: Aspect ratio (calculated from users browser window.
// Arg 3: View frustum (controls which elements are visible relative to the camera. Using 0.1, 1000 allows you to see nearly everything)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//Add Renderer to render graphics to the scene (pass in the DOM element to render)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

//Set Renderer Pixel Ratio to the device's Pixel Ratio
renderer.setPixelRatio(window.devicePixelRatio);

//Set Scene Size to Screen Size
renderer.setSize(window.innerWidth, window.innerHeight);

//Move camera along Z-axis and X-axis for better perspective to see shapes
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

//Add an object to the screen
const torusTexture = new THREE.TextureLoader().load("images/bg-Blue.jpg");
//1. TorusGeometry is built-in geometry of a donut shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//2. Give the geometry a material color and/or texture
const material = new THREE.MeshBasicMaterial({ map: torusTexture });
//3. Create a mesh by combining the geometry with the material
const torus = new THREE.Mesh(geometry, material);

//Now add the Torus to the scene
scene.add(torus);

//Add a PointLight (like a lightbulb) to illuminate a specific portion of the scene
//Color is written in a Hexidecimal Literal (0xffffff)
const pointLight = new THREE.PointLight(0xffffff);

//Position light (away from center) by position X,Y,Z values
pointLight.position.set(5, 5, 5);

//Create an Ambient light to illuminate everything in the scene equally
const ambientLight = new THREE.AmbientLight(0xffffff);

//Add both lights to scene
scene.add(pointLight, ambientLight);

//Use Helpers
/* 
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper); 
*/

//Add Orbit Controls. Pass in the camera and renderer DOM element
/* 
const controls = new OrbitControls(camera, renderer.domElement);
*/

//Create randomly generated objects (stars)
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //create random values using an array with 3 values and mapping them to a random number generated between 1 and 100 by randFloatSpread()
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//Now set the amount of stars by creating array of size 200, and calling the addStar() function for each array element
Array(200).fill().forEach(addStar);

//Load jpg image for scene background. Optional callback function for adding a loader icon
const spaceTexture = new THREE.TextureLoader().load(
  "images/space-wallpaper.jpg"
);
scene.background = spaceTexture;

//Create Avatar Cube
//1. Load the texture
const cubeTexture = new THREE.TextureLoader().load("images/JH-BW-yard.jpg");
//2. Create the mesh mapping the texture to the cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: cubeTexture })
);
scene.add(cube);

//Create Moon
const moonTexture = new THREE.TextureLoader().load(
  "images/texture_planet_3d_model.jpg"
);
const normalTexture = new THREE.TextureLoader().load(
  "images/crystal-world-normalmap.jpg"
);
//Assign texture to the moon shape
//Assign Normal Map to produce texture
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

cube.position.z = -5;
cube.position.x = 2;

//Create a function that moves the camera whenever the user scrolls
function moveCamera() {
  //first calculate where the user is currently, and get the distance to the top of the web page
  const t = document.body.getBoundingClientRect().top;
  //now change properties when this function runs
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  //Now move the camera. Top value will always be negative, so multiply it by a negative number to get a positive
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

//Recursive function to repeatedly call render method
function animate() {
  requestAnimationFrame(animate);
  /* The number of callbacks is usually 60 times per second, but will generally match the display refresh rate in most web browsers as per W3C recommendation. The callback rate may be reduced to a lower rate when running in background tabs or in hidden iframe s in order to improve performance and battery life. */

  //Change Torus shape properties
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  // torus.scale.y += 0.001;

  moon.rotation.x += 0.005;
  //controls.update(); //Update the view changes from mouse in the UI
  renderer.render(scene, camera);
}
//Call animate() function
animate();
