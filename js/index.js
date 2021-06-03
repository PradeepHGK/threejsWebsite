// import *  as THREE from "three";
// import * as THREE from './node_modules/three/src/Three.js';
// const THREE = require("three");


// import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.101.1/examples/js/controls/OrbitControls.js';

//HTML canvas to Render
var canvas = document.getElementById("webgl");
var mixer; //GLTF Animation Mixer to play 

//#region  Scene
//Creating New Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff);
scene.background = new THREE.Color(0xF5DE9A);

// const texture = new THREE.TextureLoader().load( "images/skybox/skybox2.jpg" );
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );

// scene.background = texture;
//#endregion

//#region  Camera
//Adding Perspective Camera
var fov = 50; //Camera FOV
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
console.log("CameraPosition: ", camera.position)
// camera.lookAt( scene.position );
camera.position.set(0, 150, 100);
// camera.rotation.set(100, 0, 0);

//#endregion

var axes = new THREE.AxesHelper(30);
scene.add(axes);

//#region  Renderer
//WEBGL Renderer
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
});
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
// scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
//#endregion

//#region Geomentry
//Add a Primitive Geomentry
//Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshPhongMaterial({ color: 0xF5DE9A, depthWrite: false })
);

floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

//White Plane
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const geomentry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box = new THREE.Mesh(geomentry, coneMaterial);

//GRID for the floor
const grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
// scene.add(grid);

//Time from THREE
var clock = new THREE.Clock();
var delta;
//#endregion

//#region  Lights
//Lights
const light = new THREE.AmbientLight(0xfffffff);
const pointLight = new THREE.PointLight(0x089afc);
pointLight.position.x = 50;
pointLight.position.y = 30;
pointLight.position.z = 0;
pointLight.intensity = 1;
scene.add(pointLight);
// scene.add(light);

var ambientLight = new THREE.AmbientLight(0x999999);
// scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(0, 20, 10);
scene.add(dirLight);
//#endregion

//#region OrbitControls
//Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.screenSpacePanning = false;
controls.minDistance = 80;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;
controls.update();
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
};

controls.keys = {
  LEFT: "ArrowLeft", //left arrow
  UP: "ArrowUp", // up arrow
  RIGHT: "ArrowRight", // right arrow
  BOTTOM: "ArrowDown", // down arrow
};

document.addEventListener("keydown", setupKeyControls, false);
function setupKeyControls() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: //Left Arrow
        camera.position.x = camera.position.x - delta;
        camera.updateProjectionMatrix();
        // cube.rotation.x += 0.1;
        break;
      case 38: //Up  //right
        camera.position.z = camera.position.z - delta;
        camera.updateProjectionMatrix();
        // cube.rotation.z -= 0.1;
        break;
      case 39: //right
        camera.position.x = camera.position.x + delta;
        camera.updateProjectionMatrix();
        // cube.rotation.x -= 0.1;
        break;
      case 40: //down
        camera.position.z = camera.position.z + delta;
        camera.updateProjectionMatrix();
        // cube.rotation.z += 0.1;
        break;
    }
  };
}
//#endregion

//#region  Add 3D Objects
//Load 3D Objects
// Instantiate a loader
const cafe = new THREE.GLTFLoader();
cafe.load(
  "models/cafe/scene.gltf",
  (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(30, 30, 30);
    // scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);

const loaderCharacter = new THREE.GLTFLoader();
loaderCharacter.load(
  "models/disney_infinity_vanellope_von_schweetz/scene.gltf",
  (gltf) => {
    gltf.scene.rotation.y = 180;
    gltf.scene.position.x = 100;
    gltf.scene.scale.set(40, 40, 40);
    scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);

const loaderCar = new THREE.GLTFLoader();
loaderCar.load(
  "models/car/scene.gltf",
  (gltf) => {
    gltf.scene.rotation.y = 45;
    gltf.scene.position.x = 100;
    gltf.scene.scale.set(230, 400, 500);
    // scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);

const starWarLab = new THREE.GLTFLoader();
starWarLab.load(
  "models/StarWars/scene.gltf",
  (gltf) => {
    gltf.scene.position.z = 200;
    gltf.scene.position.x = 200;
    gltf.scene.scale.set(20, 50, 50);
    // scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);

const city = new THREE.GLTFLoader();
city.load(
  "models/city/scene.gltf",
  (gltf) => {
    // gltf.scene.position.z = 100;
    // gltf.scene.position.x = 100;
    // gltf.scene.position.x = 0;
    // gltf.scene.position.y = 0;
    // gltf.scene.position.z = 0;
    // gltf.scene.scale.set(5, 5, 5);
    scene.add(gltf.scene);

    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
  },
  function (xhr) {
    console.log("City Loading: ", (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
);


var droneRobot = new THREE.GLTFLoader();
droneRobot.load("models/Drone/buster_drone/scene.gltf", (gltf) => {

  gltf.scene.position.x = 50;
  gltf.scene.position.y = 20;
  gltf.scene.position.z = 0;

  gltf.scene.scale.set(.2, .2, .2);
  console.log("dronePosition: ", gltf.scene.position, gltf.scene.scale, gltf.asset);

  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);
  var firstClip = gltf.animations[0];
  gltf.animations.forEach((clip) => {

    console.log("DroneAnimationClip: ", clip);
    // mixer.clipAction(clip).play();

  });


  // Play a specific animation
  const clip = THREE.AnimationClip.findByName(gltf.animations, "Turbine_Controller.position");
  const action = mixer.clipAction(firstClip);
  console.log("AnimationAction: ", action);
  if (action !== null) {
    action.setDuration = 2;
    action.play();
    action.loop = THREE.LoopPingPong;
    console.log("animationPlay")
  }

  gltf.animations; // Array<THREE.AnimationClip>
  gltf.scene; // THREE.Group
  gltf.scenes; // Array<THREE.Group>
  gltf.cameras; // Array<THREE.Camera>
  gltf.asset; // Object
})


//Add New Smart House
var smartHome = new THREE.GLTFLoader();
smartHome.load('models/House/stylized_house/scene.gltf', (smarthome) => {

  smarthome.scene.position.x = 500;
  smarthome.scene.position.y = 0;
  smarthome.scene.position.z = -700;
  smarthome.scene.scale.set(20, 20, 20);
  console.log("SHScale: ", smarthome.scene.scale);
  scene.add(smarthome.scene);

  smarthome.animations; // Array<THREE.AnimationClip>
  smarthome.scene; // THREE.Group
  smarthome.scenes; // Array<THREE.Group>
  smarthome.cameras; // Array<THREE.Camera>
  smarthome.asset; // Object
},
  function (xhr) {
    console.log("SmartHome Loading: ", (xhr.loaded / xhr.total) * 100 + "% loaded");
  }
)

//#endregion

//#region  Caching
THREE.Cache.enabled = true;
//#endregion

//#region Resize Window
//Make the window responsive and update on the resizing
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//#endregion

//#region  Update Method
function animate() {
  requestAnimationFrame(animate);

  // cone.rotation.x += 0.001;
  // cone.rotation.y += 0.001;
  // cone.rotation.z += 0.001;

  // controls.autoRotate = true;
  // controls.enableDamping = true;
  // controls.damping = true;
  controls.update();
  delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
animate();
//#endregion

//#region  Prevent Code to copy
//Disable Right click to prevent to get source code
function disableRightClick() {
  document.onclick = (event) => {
    if (event.button == 2) {
      return false;
    }
  };
}

document.body.onload = disableRightClick();
//#endregion
