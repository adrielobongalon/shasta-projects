/*
       document : learnThree1.js, for learnWebGL in shasta-projects
     created on : tuesday, may 23, 2017, 02:43 pm
         author : adrielo (audrey) bongalon
    description : js page for learning Three.js


                                        88
                                        88
                                        88
      ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
      ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
      88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
      `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                        d8'
                                                                       d8'
*/

/* global $ THREE */




var scene, camera, renderer;
var geometry, material, mesh;
var cnvW, cnvH;     // canvas width and canvas height

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 9000;
	// AIzaSyD6QXWQUqP8Co3St5b1FKnLLsAQnZs-6f0
    // camera = new THREE.OrthographicCamera(-(window.innerWidth / 2), window.innerWidth / 2, window.innerHeight / 2, -(window.innerHeight / 2), 1, 10000);




	geometry = new THREE.BoxGeometry(200, 200, 200);
	material = new THREE.MeshBasicMaterial({color: 0xcc0066, wireframe: true});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);




	renderer = new THREE.WebGLRenderer();
	cnvW = $("#canvas").width();
	cnvH = $("#canvas").height();
	renderer.setSize(cnvW, cnvH);

	$("#canvas").get(0).appendChild(renderer.domElement);
}




function animate() {
	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	mesh.rotation.z += 0.03;

	renderer.render(scene, camera);
}




$(document).ready(function() {
    // event listeners
    $(window).resize(function() {
        cnvW = $("#canvas").width();
    	cnvH = $("#canvas").height();
    	camera.aspect = cnvW / cnvH;
        camera.updateProjectionMatrix();
    	renderer.setSize(cnvW, cnvH);
    });

    // run at start
    init();
    animate();
});