import *  as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import * as CANNON from 'cannon-es'
// import { BODY_TYPES } from "objects/Body";

let t = 0;
var isButtonClicked = false;
const day = new THREE.Color(0xB8F4FF);
const duskdawn = new THREE.Color(0x00000);

//HTML canvas to Render
var canvas = document.getElementById("webgl");
var mixer; //GLTF Animation Mixer to play 


//Creating World using cannon
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})

const timeStep = 1 / 60 // seconds
let lastCallTime

//#region  Scene
//Creating New Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF5DE9A);
// scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

// const texture = new THREE.TextureLoader().load( "images/skybox/skybox2.jpg" );
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );

// scene.background = texture;
//#endregion

//#region  Camera
//Adding Perspective Camera
var fov = 50; //Camera FOV
var camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
console.log("CameraPosition: ", camera.position)
// camera.maxDistance = 1500;
// camera.minDistance = 10;
camera.position.set(-2, 20, 200);
// camera.rotation.set(100, 0, 0);

//#endregion

var axes = new THREE.AxesHelper(30);
scene.add(axes);

//#region  Renderer
//WEBGL Renderer
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
// scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
//#endregion



var Cube = new CANNON.Box(new CANNON.Vec3(100, 20, 100));
var CubeMat = new CANNON.Material();
var CubeRigidbody = new CANNON.Body({ isTrigger: true, mass: 20, material: CubeMat, type: CANNON.BODY_TYPES.DYNAMIC, fixedRotation: true, position: new CANNON.Vec3(0, 50, 0) })
CubeRigidbody.addShape(Cube);
world.addBody(CubeRigidbody);


var Plane = new CANNON.Plane();
var PlaneMat = new CANNON.Material({friction: 10, restitution: 20});
var PlaneRigidBody = new CANNON.Body({mass: 0, material: PlaneMat})
PlaneRigidBody.addShape(Plane);
world.addBody(PlaneRigidBody)

const Cannongeometry = new THREE.BoxBufferGeometry(100, 100,10)
const Cannonmaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
var Cannonmesh = new THREE.Mesh(Cannongeometry, Cannonmaterial)
scene.add(Cannonmesh)


// var threePlane = new THREE.Plane(new THREE.Vector3(50, 50, 50));
// const threeplanematerial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
// var threeplanemesh = new THREE.Mesh(threePlane, threeplanematerial)
// scene.add(threeplanemesh)


// function SetWorldStep() {
//   const time = performance.now() / 1000 // seconds
//   if (!lastCallTime) {
//     world.step(timeStep)
//   } else {
//     const dt = time - lastCallTime
//     world.step(timeStep, dt)
//   }
//   lastCallTime = time
// }

// var firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
// firstPersonControls.movementSpeed = 150;
// firstPersonControls.heightMin = 150;
// firstPersonControls.heightMax = 200;
// firstPersonControls.lookSpeed = 0;

// firstPersonControls.mouseDragOn = false;
// firstPersonControls.constrainVertical = true;
// firstPersonControls.autoForward = true;







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
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0.5, 0);
// controls.enableDamping = true;
// controls.screenSpacePanning = false;
// controls.minDistance = 80;
// controls.maxDistance = 500;
// controls.maxPolarAngle = Math.PI / 2;
// controls.update();
// controls.touches = {
//   ONE: THREE.TOUCH.ROTATE,
//   TWO: THREE.TOUCH.DOLLY_PAN,
// };

// controls.keys = {
//   LEFT: "ArrowLeft", //left arrow
//   UP: "ArrowUp", // up arrow
//   RIGHT: "ArrowRight", // right arrow
//   BOTTOM: "ArrowDown", // down arrow
// };


//#endregion

//#region  Add 3D Objects
//Load 3D Objects
// Instantiate a loader
// const cafe = new GLTFLoader();
// cafe.load(
//   "models/cafe/scene.gltf",
//   (gltf) => {
//     gltf.scene.position.set(0, 0, 0);
//     gltf.scene.scale.set(30, 30, 30);
//     // scene.add(gltf.scene);

//     gltf.animations; // Array<THREE.AnimationClip>
//     gltf.scene; // THREE.Group
//     gltf.scenes; // Array<THREE.Group>
//     gltf.cameras; // Array<THREE.Camera>
//     gltf.asset; // Object
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   }
// );

// const loaderCharacter = new GLTFLoader();
// loaderCharacter.load(
//   "models/disney_infinity_vanellope_von_schweetz/scene.gltf",
//   (gltf) => {
//     gltf.scene.rotation.y = 180;
//     gltf.scene.position.x = 100;
//     gltf.scene.scale.set(40, 40, 40);
//     scene.add(gltf.scene);

//     gltf.animations; // Array<THREE.AnimationClip>
//     gltf.scene; // THREE.Group
//     gltf.scenes; // Array<THREE.Group>
//     gltf.cameras; // Array<THREE.Camera>
//     gltf.asset; // Object
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   }
// );

// const loaderCar = new GLTFLoader();
// loaderCar.load(
//   "models/car/scene.gltf",
//   (gltf) => {
//     gltf.scene.rotation.y = 45;
//     gltf.scene.position.x = 100;
//     gltf.scene.scale.set(230, 400, 500);
//     // scene.add(gltf.scene);

//     gltf.animations; // Array<THREE.AnimationClip>
//     gltf.scene; // THREE.Group
//     gltf.scenes; // Array<THREE.Group>
//     gltf.cameras; // Array<THREE.Camera>
//     gltf.asset; // Object
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   }
// );

// const starWarLab = new GLTFLoader();
// starWarLab.load(
//   "models/StarWars/scene.gltf",
//   (gltf) => {
//     gltf.scene.position.z = 200;
//     gltf.scene.position.x = 200;
//     gltf.scene.scale.set(20, 50, 50);
//     // scene.add(gltf.scene);

//     gltf.animations; // Array<THREE.AnimationClip>
//     gltf.scene; // THREE.Group
//     gltf.scenes; // Array<THREE.Group>
//     gltf.cameras; // Array<THREE.Camera>
//     gltf.asset; // Object
//   },
//   function (xhr) {
//     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//   }
// );

const city = new GLTFLoader();
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



var ParentObject = new THREE.Object3D();

var robotObject = null;
var droneRobot = new GLTFLoader();
console.log(droneRobot);
droneRobot.load("https://hmwebassets.s3.amazonaws.com/Wetransfer/bluster_drone/scene.gltf", function (gltf) {
  
ParentObject.attach(gltf.scene);
  console.log("callback", gltf);
  // gltf.scene.position.x = 0;
  // gltf.scene.position.y = 10;
  // gltf.scene.position.z = 0;
  
  gltf.scene.scale.set(.02, .02, .02);
  console.log("dronePosition: ", gltf.scene.position, gltf.scene.scale, gltf.asset);
  
  // gltf.scene.children[0].children[0].children[0].visible = false;
  console.log(gltf.scene.children[0].children[0].children[0].name);
  
  
  scene.add(gltf.scene);
  robotObject = gltf;
  console.log("rootObject: ", robotObject);
  mixer = new THREE.AnimationMixer(gltf.scene);
  var firstClip = gltf.animations[0];
  // var clipAction = mixer.clipAction(firstClip);
  // firstClip.tracks.forEach((t)=> t.trim(7, 12));
  // clipAction.setLoop(THREE.LoopRepeat);
  // clipAction.play();
  gltf.animations.forEach((clip) => {
    
    console.log("DroneAnimationClip: ", clip);
    // clip.tracks.forEach((tracks) => tracks.trim(7, 10));
    var action = mixer.clipAction(clip);
    action.loop = THREE.LoopPingPong;
    action.play();
    // action.setloop(THREE.LoopRepeat);
  });
},
function (xhr) {
  console.log("DroneRobot_Loading: ", (xhr.loaded / xhr.total) * 100 + "% loaded");
  ParentObject.position.x = 0
  ParentObject.position.y = 15;
  ParentObject.position.z = 0;

}, (err) => {
  console.log(err);
});




//Add New Smart House
var smartHome = new GLTFLoader();
smartHome.load('https://hmwebassets.s3.amazonaws.com/Wetransfer/stylized_house/scene.gltf', (smarthome) => {

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


var flycontrols = new FlyControls(camera, renderer.domElement);
flycontrols.movementSpeed = 120;
flycontrols.rollSpeed = 0.1;
flycontrols.dragToLook = true;

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


// document.getElementById("changecolor").addEventListener("click", ChangeColors);
// function ChangeColors(params) {
//   isButtonClicked = true;
// }

//#region  Update Method
function animate() {
  // cone.rotation.x += 0.001;
  // cone.rotation.y += 0.001;
  // cone.rotation.z += 0.001;

  // controls.autoRotate = true;
  // controls.enableDamping = true;
  // controls.damping = true;
  // controls.update();

  //Movement

  //Animation
  // renderer.clear();
  if (mixer) mixer.update(delta);
  // console.log("cameraPosition: ",camera.position);
  requestAnimationFrame(animate);

  // SetWorldStep();  

  const time = performance.now() / 1000 // seconds
  if (!lastCallTime) {
    world.step(timeStep)
  } else {
    const dt = time - lastCallTime
    world.step(timeStep, dt)
  }
  lastCallTime = time


  Cannonmesh.position.copy(CubeRigidbody.position)
  Cannonmesh.quaternion.copy(CubeRigidbody.quaternion)

  if (true) {
    t += 0.01;
    var timeDelay = Math.sin(t);
    // console.log("time: ", time);
    scene.background.copy(day).lerp(duskdawn, 0.6 * (timeDelay + .2));
  }


  delta = clock.getDelta();
  if (robotObject !== null) {
    // robotObject.scene.position.set(camera.position.x, camera.position.y, (camera.position.z - 40))
    // robotObject.scene.rotation.x = camera.rotation.x; //(, camera.rotation.y, camera.rotation.z);
    // robotObject.scene.rotation.y = camera.rotation.y;
    // robotObject.scene.rotation.z = camera.rotation.z;
  }
  flycontrols.update(delta);
  // firstPersonControls.update(delta);
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




// document.addEventListener("keydown", setupKeyControls, false);
var cameraMoveSpeed = 6;
function setupKeyControls() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: //Left Arrow
        robotObject.po
        // camera.position.x += camera.position.x * delta * cameraMoveSpeed;
        camera.updateProjectionMatrix();
        // cube.rotation.x += 0.1;
        console.log("LEFtARROW")
        break;
      case 38: //Up  //right
        // camera.position.z -= camera.position.z * delta * cameraMoveSpeed;
        camera.updateProjectionMatrix();
        // cube.rotation.z -= 0.1;
        break;
      case 39: //right
        // camera.position.x -= camera.position.x * delta * cameraMoveSpeed;
        camera.updateProjectionMatrix();
        // cube.rotation.x -= 0.1;
        break;
      case 40: //down
        // camera.position.z += camera.position.z * delta * cameraMoveSpeed;
        camera.updateProjectionMatrix();
        // cube.rotation.z += 0.1;
        break;
    }
  };
}