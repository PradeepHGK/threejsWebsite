// import *  as THREE from "three";
// import * as THREE from './node_modules/three/src/Three.js';
// const THREE = require("three");

// const { Vector3 } = require("three");

// import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.101.1/examples/js/controls/OrbitControls.js';

var fov = 75;

//Creating New Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a75ff);

//Adding Perspective Camera
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(-50, 60, -100);
camera.rotation.set(100, 0, 0);
// camera.lookAt( scene.position );
//Add a renderer to show the scene items
const renderer = new THREE.WebGL1Renderer({
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Add a Primitive Geomentry

//Add Floor
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);

plane.rotation.x = 0;
// scene.add( plane );

const geomentry = new THREE.BoxGeometry(0.3, 0.2, 0.2);
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cone = new THREE.Mesh(geomentry, coneMaterial);

// scene.add(cone);

const light = new THREE.AmbientLight(0xfffffff);
const pointLight = new THREE.PointLight(0xffffff);
// scene.add(pointLight);
// scene.add(light);

var ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);

//Particle
var particle = new THREE.Object3D();

// Add Grid
// const grid = new THREE.GridHelper(200, 100);
// scene.add(grid);

//Orbit Controls

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Instantiate a loader
const loader = new THREE.GLTFLoader();
loader.load(
  "models/cafe/scene.gltf",
  (gltf) => {
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.scale.set(30, 30, 30);
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

const loaderCharacter = new THREE.GLTFLoader();
loaderCharacter.load(
  "models/disney_infinity_vanellope_von_schweetz/scene.gltf",
  (gltf) => {
    gltf.scene.rotation.y = 180;
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
    gltf.scene.rotation.y = 380;
    // gltf.scene.scale.set(230, 400, 500);
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

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

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
  var delta = 30;
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: //Left Arrow
        camera.position.x += camera.position.x;
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

function animate() {
  requestAnimationFrame(animate);

  cone.rotation.x += 0.001;
  cone.rotation.y += 0.001;
  cone.rotation.z += 0.001;

  // controls.autoRotate = true;
  // controls.enableDamping = true;
  controls.update();
  // controls.damping = true;

  renderer.render(scene, camera);
}
animate();

function disableRightClick() {
  document.onclick = (event) => {
    if (event.button == 2) {
      return false;
    }
  };
}

document.body.onload = disableRightClick();
