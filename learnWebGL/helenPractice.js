/* global $ THREE scope panOffset */

var mouse;
var raycaster;
var INTERSECTED;
var canvas = $("#canvas").get(0);
var $canvas = $("#canvas");
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
renderer.setClearColor(0xffffff, 1);
canvas.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var solidMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});

var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var mesh = new THREE.Mesh(sphereGeometry, solidMaterial);
mesh.translateX(2);
scene.add(mesh);

var light1 = new THREE.DirectionalLight(0x888888);
var light2 = new THREE.AmbientLight(0xcccccc);
light1.position.set(0, 1, 5).normalize();
light2.position.set(0, 2, -5).normalize();
scene.add(light1);
scene.add(light2);

var cube = new THREE.Mesh(geometry, solidMaterial);
scene.add(cube);

var controls = new THREE.OrbitControls(camera);


camera.position.z = 5;


function render() {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(render);
}

render();

function resizeCanvas() {

    // begin by setting the variables, assuming it isn't too tall
    canvasWidth = Math.floor($canvas.parent().width());
    canvasHeight = Math.floor(canvasWidth * (9 / 16));                          // 16:9 ratio

    var top = $("#above-canvas").height();
    var bottom = $("#below-canvas").height();
    var winht = $(window).height();

    // if it's too tall, reset the values
    if (top + canvasHeight + bottom > winht) {
        canvasHeight = Math.floor(winht - (top + bottom));                      // set height to max height of canvas
        canvasWidth = Math.floor(canvasHeight * (16 / 9));                      // scale width to 16:9 ratio
    }

    // resize the div
    $canvas.css({width: canvasWidth + "px"});
    $canvas.css({height: canvasHeight + "px"});

    // resize within Three.js
    if (camera) {                                       // this is a hacky way of preventing this from running on function call
        camera.aspect = canvasWidth / canvasHeight;     // from $(document).ready, since camera isn't defined at that point
        camera.updateProjectionMatrix();                // we could have just done something like "var initialised = false",
        renderer.setSize(canvasWidth, canvasHeight);    // but i didn't want to waste memory                        -audrey
    }
}

cube.onclick = function(){
    cube.material.color.setHex(0x66ffff);
};
window.addEventListener("resize", onWindowResize, false);

mouse.x = (event.clientX / $canvas.width()) * 2 - 1;							// why are you dividing by window.innerWidth? the canvas isn't taking up the entire page
mouse.y = (event.clientY / $canvas.height()) * 2 + 1;							// also, clientX isn't defined. i'm presuming this code is supposed to go INSIDE some sort of callback on an
																				// event listener. either way, this line is breaking the code								-audrey
raycaster = new THREE.Raycaster();

var vector = new THREE.Vector3(mouse.x, mouse.y, 1).unproject(camera);
raycaster.set(camera.position, vector.sub(camera.position).normalize());
var intersects = raycaster.intersectObjects(scene.children);
INTERSECTED = intersects[0].object;

var material = new THREE.LineBasicMaterial({color: 0xAAFFAA});

// crosshair size
var x = 0.01, y = 0.01;

var geometry = new THREE.Geometry();

// crosshair
geometry.vertices.push(new THREE.Vector3(0, y, 0));
geometry.vertices.push(new THREE.Vector3(0, -y, 0));
geometry.vertices.push(new THREE.Vector3(0, 0, 0));
geometry.vertices.push(new THREE.Vector3(x, 0, 0));    
geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

var crosshair = new THREE.Line(geometry, material);

// place it in the center
var crosshairPercentX = 50;
var crosshairPercentY = 50;
var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

crosshair.position.x = crosshairPositionX * camera.aspect;
crosshair.position.y = crosshairPositionY;

crosshair.position.z = -0.3;

camera.add(crosshair);
scene.add(camera);

$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#clearCanvas").on("click", function() {
    	alert("clear canvas");
    });

    // run at start
    resizeCanvas();                     // resize canvas on start
});



// document.addEventListener('keydown',onDocumentKeyDown,false);
// function onDocumentKeyDown(event){
// var delta = 200;
// event = event || window.event;
// var keycode = event.keyCode;
// switch (keycode) {
// case 37 : //left arrow 向左箭头
// camera.position.x = camera.position.x - delta;
// camera.updateProjectionMatrix();
// break;
// case 38 : // up arrow 向上箭头
// camera.position.z = camera.position.z - delta;
// camera.updateProjectionMatrix();
// break;
// case 39 : // right arrow 向右箭头
// camera.position.x = camera.position.x + delta;
// camera.updateProjectionMatrix();
// break;
// case 40 : //down arrow向下箭头
// camera.position.z = camera.position.z + delta;
// camera.updateProjectionMatrix();
// break;
// }