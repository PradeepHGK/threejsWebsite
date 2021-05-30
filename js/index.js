import *  as THREE from "three";

var fov = 75;

//Creating New Scene 
const scene  = new THREE.Scene();

//Adding Perspective Camera
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/ window.innerHeight, 0.1, 1000);

//Add a renderer to show the scene items
const renderer = new THREE.WebGL1Renderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//Add a Primitive Geomentry
const geomentry = new THREE.RingGeometry();
const coneMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00 });
const cone = new THREE.Mesh(geomentry, coneMaterial);

scene.add(cone);
camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate(); 