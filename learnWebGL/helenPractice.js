/* global $ THREE */

var canvas = $("#canvas").get(0);
var $canvas = $("#canvas");
var canvasWidth = 720;                                                          // 16:9 ratio
var canvasHeight = 405;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
canvas.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
var solidMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);

var cube = new THREE.Mesh(geometry, solidMaterial);
scene.add(cube);

var controls = new THREE.OrbitControls(camera);

camera.position.z = 5;

function render() {
	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
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
// switch(keycode){
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