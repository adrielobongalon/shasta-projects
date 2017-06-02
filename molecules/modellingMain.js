/*
                                                                                                          88
                                                                                                          88
                                                                                                          88
       document : modellingMain.js, for molecules in shasta-projects    ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
     created on : thursday, may 18, 2017, 09:09 am                      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
         author : audrey bongalon                                       ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
    description : main javascript file for the modelling program        88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
                                                                        `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                                                                                          d8'
                                                                                                                                         d8'
      88                       88                                                   88                       88             
      88                       88                                                   88                       ""             
      88                       88                                                   88                                      
      88,dPPYba,    ,adPPYba,  88   ,adPPYba,  8b,dPPYba,                ,adPPYba,  88,dPPYba,   8b,dPPYba,  88   ,adPPYba,  
      88P'    "8a  a8P,,,,,88  88  a8P,,,,,88  88P'   `"8a              a8"     ""  88P'    "8a  88P'   "Y8  88   I8(    ""  
      88       88  8PP"""""""  88  8PP"""""""  88       88              8b          88       88  88          88    `"Y8ba,   
      88       88  "8b,   ,aa  88  "8b,   ,aa  88       88              "8a,   ,aa  88       88  88          88   aa    )8I  
      88       88   `"Ybbd8"'  88   `"Ybbd8"'  88       88               `"Ybbd8"'  88       88  88          88   `"YbbdP"'

*/

/* global $ THREE */




const canvas = $("#canvas").get(0);
const $canvas = $("#canvas");
let canvasWidth = 720;                                                          // 16:9 ratio
let canvasHeight = 405;
const bgColour = "#ffdbe2";   // make sure to match with html window colour & css stylings

let scene, camera, mainLight, ambientLight, controls, renderer;
let sphereGeometry, cylinderGeometry, wireMaterial;
let whiteMaterial, greyMaterial, blackMaterial, redMaterial, blooMaterial;
// let boxGeometry, kyoob;

const atomSize = 150;

let atomArray = [];         // will store all the atoms
let currentAtom, previousAtom;
















//      ----------------
//      |    jQuery    |
//      ----------------

function resizeCanvas() {

    // begin by setting the variables, assuming it isn't too tall
    canvasWidth = Math.floor($canvas.parent().width());
    canvasHeight = Math.floor(canvasWidth * (9 / 16));                          // 16:9 ratio

    const top = $("#above-canvas").height();
    const bottom = $("#below-canvas").height();
    const winht = $(window).height();

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














function drawAxes() {
    const blueMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    const greenMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    const redMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

    const xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(1000, 0, 0));

    const yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yLineGeometry.vertices.push(new THREE.Vector3(0, 1000, 0));

    const zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 1000));

    const xAxis = new THREE.Line(xLineGeometry, blueMaterial);
    const yAxis = new THREE.Line(yLineGeometry, greenMaterial);
    const zAxis = new THREE.Line(zLineGeometry, redMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);
}




function initialise() {
	scene = new THREE.Scene();

    // canvasWidth and canvasHeight should be properly set by now from resizeCanvas()
	camera = new THREE.PerspectiveCamera(10, canvasWidth / canvasHeight, 1000, 100000);
	camera.position.z = 9001;   // IT's OVER 9000!

    // lighting
    mainLight = new THREE.DirectionalLight(0x888888);
    ambientLight = new THREE.AmbientLight(0xcccccc);
    mainLight.position.set(0, 300, 500).normalize();
    ambientLight.position.set(0, 200, -500).normalize();
    scene.add(mainLight);
    scene.add(ambientLight);

    controls = new THREE.OrbitControls(camera);

    drawAxes();




	sphereGeometry = new THREE.SphereGeometry(atomSize, 32, 32);

    // materials (mainly colours)
	wireMaterial = new THREE.MeshBasicMaterial({color: 0x66ff66, wireframe: true});
	whiteMaterial = new THREE.MeshLambertMaterial({color: 0xbbbbbb});
	greyMaterial = new THREE.MeshLambertMaterial({color: 0x888888});
	blackMaterial = new THREE.MeshPhongMaterial({color: 0x222222});
	blooMaterial = new THREE.MeshLambertMaterial({color: 0x4444ff});
	redMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});




    // construct and create the first atom, push it into atomArray
    currentAtom = new Atom(0, 0, 0, "carbon");
    currentAtom.create();
    atomArray = [currentAtom];




	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize(canvasWidth, canvasHeight);

	canvas.appendChild(renderer.domElement);
}




function animate() {
    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // recursive loop
    window.requestAnimationFrame(animate);
}
















$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#addAtom").on("click", newAtom);
    $("#remoovAtom").on("click", remoovAtom);
    $("#restart").on("click", reset);   // different names because to the user, the PROCESS is restarting, but to us the PROGRAM is NOT restarting
    $(document).keypress(function(event) {
        if (event.which == 13) {
            atomArray[1].moov(0, 100, 0);
        }
    });

    // run at start
    resizeCanvas();                                                             // resize canvas on start
    initialise();
    animate();
});

















function connectAtoms() {
    for (let item of atomArray) {
        
    }
}

function newAtom() {
    if (currentAtom.currentBonds.length < currentAtom.possibleBonds) {
        let x = 400;
        let y = 0;
        let z = 0;
        let xPos = currentAtom.x + currentAtom.radius + x;
        let yPos = currentAtom.y + currentAtom.radius + y;
        let zPos = currentAtom.z + currentAtom.radius + z;
    
        atomArray.push(new Atom(xPos, yPos, zPos, "carbon"));                   // construct the new atom

        previousAtom = currentAtom;                                             // new previousAtom is the old currentAtom
        currentAtom = atomArray[atomArray.length - 1];                          // new currentAtom is last (newest) in array

        previousAtom.currentBonds.push(currentAtom);
        currentAtom.currentBonds.push(previousAtom);
        currentAtom.parentAtom = previousAtom;

        currentAtom.create();                                                   // create the new atom
        connectAtoms();
    }
    else {
        alert("Error. This atom cannot bond to any more additional atoms.");
    }
}

function remoovAtom() {
    alert("remoov");
}

function reset() {
    // clear data
    atomArray = [];
    scene.children = [];

    // reset lights and base atom
    drawAxes();
    scene.add(mainLight);
    scene.add(ambientLight);
    currentAtom = new Atom(0, 0, 0, "carbon");
    currentAtom.create();
    atomArray.push(currentAtom);

    // reset camera
    controls.reset();
}
















function Atom(x, y, z, element) {
    this.mesh;                      // the sphere
    this.connections = [];          // the cylinder(s) that connect to other atoms
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.radius = 0;                // radius of nucleus
    this.possibleBonds = 1;         // maximum number of bonds the atom can make
    this.colour = blackMaterial;    // colour of model
    this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
    this.nextInChain = [];          // same as currentBonds, except without the parent atom
    this.parentAtom = null;         // if null, then is base; otherwise, should be set on construction

    this.setElement = function(newElement) {
        this.element = newElement;

        // radius is a function of element? TODO replace with helen's array
        if (newElement == "carbon") {
            this.radius = 1;
            this.possibleBonds = 4;
            this.colour = blackMaterial;
        }
        else {
            console.error("Error: tried to set atom to \"" + newElement + "\", which is not defined in the program");
        }

        // bond angle is a function of element and currentBonds?
        if (true) {
            // angle = ?
        }
        // error was already thrown when setting radius
    };

    this.setPosition = function(xPos, yPos, zPos) {
        this.x = xPos;
        this.y = yPos;
        this.z = zPos;
        this.mesh.position.set(xPos, yPos, zPos);
    };

    this.moov = function(xDir, yDir, zDir) {
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    };

    this.connectToParent = function() {
        
    };
    this.connectToChildren = function () {
        // loop
    };
    this.connectToAll = function() {
        // clear array; this function might be used after repositioning,
        this.connections = [];
        // TODO remove from scene

        this.connectToParent();     // so the old cylinders will need to go
        this.connectToChildren();
    };

    this.create = function() {
        this.setElement("carbon");
        this.mesh = new THREE.Mesh(sphereGeometry, this.colour);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(this.x, this.y, this.z);
        scene.add(this.mesh);
    };
}