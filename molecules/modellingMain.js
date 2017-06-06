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




//      --------------------------------------
//      |    creation of global variables    |
//      --------------------------------------

const canvas = $("#canvas").get(0);
const $canvas = $("#canvas");
let canvasWidth = 720;                                                          // 16:9 ratio
let canvasHeight = 405;
const bgColour = "#ccffff";   // make sure to match with html window colour & css stylings

var scene, camera, mainLight, ambientLight, controls, mouse, raycaster, renderer;
var sphereGeometry, cylinderGeometry, wireMaterial;
var whiteMaterial, greyMaterial, blackMaterial, redMaterial, blooMaterial, greenMaterial, darkRedMaterial,
    darkVioletMaterial, cyanMaterial, orangeMaterial, yellowMaterial, peachMaterial, violetMaterial,
    darkGreenMaterial, darkOrangeMaterial, pinkMaterial;

const atomSize = 150;
const connectionSize = Math.floor(atomSize / 2);

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
















var bondLengths = [
{
    name: "hydrogen",
    hydrogen:   [74],     // bond lengths should be in the form [single, double, triple]
    fluorine:   [92],
    chlorine:   [127],
    bromine:    [141],
    iodine:     [161],
    oxygen:     [96],
    silicon:    [148],
    carbon:     [109],
    nitrogen:   [101],
    phosphorus: [142],
    sulfur:     [134]
},
{
    name: "oxygen",
    hydrogen:   [96],
    phosphorus: [160],
    oxygen:     [148, 121],
    sulfur:     [151],
    fluorine:   [142],
    chlorine:   [164],
    bromine:    [172],
    iodine:     [194],
    silicon:    [161],
    carbon:     [143, 123, 113],
    nitrogen:   [144, 120, 106]
    
},
{
    name: "silicon",
    hydrogen:   [148],
    silicon:    [234],
    oxygen:     [161],
    sulfur:     [210],
    fluorine:   [156],
    chlorine:   [204],
    bromine:    [216],
    iodine:     [240],
    carbon:     [186],
    phosphorus: [227]
},
{
    name: "carbon",
    hydrogen:   [109],
    carbon:     [154, 134, 121],
    silicon:    [186],
    nitrogen:   [147, 127, 115],
    oxygen:     [143, 123, 113],
    phosphorus: [187],
    sulfur:     [181],
    fluorine:   [133],
    chlorine:   [177],
    bromine:    [194],
    iodine:     [213]
},
{
    name: "nitrogen",
    hydrogen:   [101],
    nitrogen:   [146, 122, 110],
    phosphorus: [177],
    oxygen:     [144, 120, 106],
    fluorine:   [139],
    chlorine:   [191],
    bromine:    [214],
    iodine:     [222],
    carbon:     [147, 127, 115]
},
{
    name: "phosphorus",
    hydrogen:   [142],
    silicon:    [227],
    phosphorus: [221],
    fluorine:   [156],
    chlorine:   [204],
    bromine:    [222],
    iodine:     [246],
    oxygen:     [160],
    carbon:     [187],
    nitrogen:   [177]
},
{
    name: "sulfur",
    hydrogen: [134],
    sulfur:   [204],
    fluorine: [158],
    chlorine: [201],
    bromine:  [225],
    iodine:   [234],
    oxygen:   [151],
    silicon:  [210],
    carbon:   [181]
},
{
    name: "fluorine",
    fluorine:  [143],
    chlorine:  [166],
    bromine:   [178],
    iodine:    [187],
    hydrogen:  [92],
    oxygen:    [142],
    silicon:   [156],
    carbon:    [133],
    nitrogen:  [139],
    phosphorus:[156],
    sulfur:    [158]
},
{
    name: "chlorine",
    chlorine:  [199],
    bromine:   [214],
    iodine:    [243],
    hydrogen:  [127],
    oxygen:    [164],
    silicon:   [204],
    carbon:    [177],
    nitrogen:  [191],
    phosphorus:[204],
    sulfur:    [201],
    fluorine:  [166]
},
{
    name: "bromine",
    bromine:   [228],
    iodine:    [248],
    hydrogen:  [141],
    oxygen:    [172],
    silicon:   [216],
    carbon:    [194],
    nitrogen:  [214],
    phosphorus:[222],
    sulfur:    [225],
    fluorine:  [178],
    chlorine:  [214]
},
{
    name: "iodine",
    iodine:    [266],
    hydrogen:  [161],
    oxygen:    [194],
    silicon:   [240],
    carbon:    [213],
    nitrogen:  [222],
    phosphorus:[246],
    sulfur:    [234],
    fluorine:  [187],
    chlorine:  [243],
    bromine:   [248]
}
];




const periodicTable = [];

function PrdcElmt(name, bonds, bondLength, radius) {
    this.name = name;
    this.possibleBonds = bonds;
    this.bondLength = bondLength; // TODO replace with object
    this.atomicRadius = radius; //in amu
}

createTable: {      // i made this a labelled block so i can fold it up in the IDE; this stuff takes up a lot of space
    //note: bond length not yet accounted for, radius in progress (pm)
    //for radius, referring to http://periodictable.com/Properties/A/AtomicRadius.v.html
    //finished first column for radius as of 5:08 may 31
    
    // elements 1-10
    periodicTable.push(new PrdcElmt("hydrogen",     1, null, 53));
    periodicTable.push(new PrdcElmt("helium",       0, null, 31));
    periodicTable.push(new PrdcElmt("lithium",      1, null, 167));
    periodicTable.push(new PrdcElmt("beryllium",    2, null, 112));
    periodicTable.push(new PrdcElmt("boron",        3, null, 87));
    periodicTable.push(new PrdcElmt("carbon",       4, null, 67));
    periodicTable.push(new PrdcElmt("nitrogen",     3, null, 56));
    periodicTable.push(new PrdcElmt("oxygen",       2, null, 48));
    periodicTable.push(new PrdcElmt("fluorine",     1, null, 42));
    periodicTable.push(new PrdcElmt("neon",         0, null, 38));
    
    //elements 11-20
    periodicTable.push(new PrdcElmt("sodium",       1, null, 227));
    periodicTable.push(new PrdcElmt("magnesium",    2, null, 145));
    periodicTable.push(new PrdcElmt("aluminium",    3, null, 118));
    periodicTable.push(new PrdcElmt("silicon",      4, null, 111));
    periodicTable.push(new PrdcElmt("phosphorus",   3, null, 98));
    periodicTable.push(new PrdcElmt("sulfur",       2, null, 88));
    periodicTable.push(new PrdcElmt("chlorine",     1, null, 79));
    periodicTable.push(new PrdcElmt("argon",        1, null, 71));
    periodicTable.push(new PrdcElmt("potassium",    1, null, 243));
    periodicTable.push(new PrdcElmt("calcium",      2, null, 194));
    
    // //elements 21-39
    // periodicTable.push(new PrdcElmt("scandium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("titanium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("vanadium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("chromium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("manganese", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iron", 2, null, 5));
    // periodicTable.push(new PrdcElmt("cobalt", 2, null, 5));
    // periodicTable.push(new PrdcElmt("nickel", 2, null, 5));
    // periodicTable.push(new PrdcElmt("copper", 2, null, 5));
    
    
    //elements 30-40
    periodicTable.push(new PrdcElmt("zinc",         2, null, 142));
    periodicTable.push(new PrdcElmt("gallium",      3, null, 136));
    periodicTable.push(new PrdcElmt("germanium",    4, null, 125));
    periodicTable.push(new PrdcElmt("arsenic",      3, null, 114));
    periodicTable.push(new PrdcElmt("selenium",     2, null, 103));
    periodicTable.push(new PrdcElmt("bromine",      1, null, 94));
    periodicTable.push(new PrdcElmt("krypton",      0, null, 88));
    periodicTable.push(new PrdcElmt("rubidium",     1, null, 265));
    periodicTable.push(new PrdcElmt("strontium",    2, null, 219));
    
    //elements 39-47
    // periodicTable.push(new PrdcElmt("yttrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("zirconium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("niobium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("molybdenum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("technetium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("ruthenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhodium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("palladium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("silver", 2, null, 5));
    
    //element 48-56
    periodicTable.push(new PrdcElmt("cadmium",      2, null, 161));
    periodicTable.push(new PrdcElmt("indium",       3, null, 156));
    periodicTable.push(new PrdcElmt("tin",          4, null, 145));
    periodicTable.push(new PrdcElmt("antimony",     3, null, 133));
    periodicTable.push(new PrdcElmt("tellurium",    2, null, 123));
    periodicTable.push(new PrdcElmt("iodine",       1, null, 115));
    periodicTable.push(new PrdcElmt("xenon",        0, null, 108));
    periodicTable.push(new PrdcElmt("caesium",      1, null, 300));
    periodicTable.push(new PrdcElmt("barium",       2, null, 253));
    
    // //elements 57-71
    // periodicTable.push(new PrdcElmt("lanthanum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("cerium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("praseodymium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("neodymium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("promethium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("samarium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("europium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("gadolinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("terbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("dysprosium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("holmium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("erbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("thulium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("ytterbium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("lutetium", 2, null, 5));
    
    // //elements 72-79
    // periodicTable.push(new PrdcElmt("hafnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tantalum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tungsten", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("osmium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iridium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("platinum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("gold", 2, null, 5));
    
    //elements 80-88
    periodicTable.push(new PrdcElmt("mercury",     2, null, 171));
    periodicTable.push(new PrdcElmt("thallium",    3, null, 156));
    periodicTable.push(new PrdcElmt("lead",        4, null, 154));
    periodicTable.push(new PrdcElmt("bismuth",     3, null, 143));
    periodicTable.push(new PrdcElmt("polonium",    2, null, 135));
    periodicTable.push(new PrdcElmt("astatine",    1, null, 127));
    periodicTable.push(new PrdcElmt("radon",       0, null, 120));
    
    // bottom row -> molecules by collision
    // periodicTable.push(new PrdcElmt("francium", 1, null, 5));
    // periodicTable.push(new PrdcElmt("radium", 2, null, 5));
    
    // //elements 89-103
    // periodicTable.push(new PrdcElmt("actinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("thorium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("protactinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("uranium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("neptunium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("plutonium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("americium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("curium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("berkelium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("californium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("einsteinium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("fermium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("mendelevium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("nobelium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("lawrencium", 2, null, 5));
    
    // //elements 104-111
    // periodicTable.push(new PrdcElmt("rutherfordum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("dubnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("seaborgium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("bohrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("hassium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("meitnerium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("darmstadtium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("roentgenium", 2, null, 5));
}

function putBondsInTable() {
    for (let item of periodicTable) {
        for (let lengths of bondLengths) {
            if (lengths.name == item.name) {
                item.bondLength = lengths;
            }
        }
    }
}

function getMaxBonds(atom, bondingTo) {
    for (let item of bondLengths){
        if (item.name == atom){
            if (item[bondingTo]) {                  // check if the second element exists in the object of the first element
                return item[bondingTo].length;      // if so, return the max number of bonds it can make to that element
            }
            else {
                console.error("error: there is no data on " + atom + " bonding to " + bondingTo);
                return false;
            }
        }
    }
    console.error("nah bwuh das cwusti. theh's no data on " + atom);
    return false;
}
















//      ---------------------
//      |    constructor    |
//      ---------------------

function Atom(x, y, z, element) {
    this.mesh;                      // the sphere
    this.parentConnection = null;   // cylinder to connect to parent atom (array of cylinders if end of chain)
    this.childConnections = [];     // the cylinder(s) that connect to children atoms
    this.x = x;
    this.y = y;
    this.z = z;
    this.element = element;
    this.radius = 0;                // radius of nucleus
    this.possibleBonds = 1;         // maximum number of bonds the atom can make
    this.colour = blackMaterial;    // colour of model
    this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
    this.nextInChain = [];          // same as currentBonds, except without the parent atom
    this.parentAtom = null;         // if null, then is base; if object, part of chain; if array, end of a chain

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
        this.parentConnection = new THREE.CylinderGeometry(connectionSize, connectionSize, 20, 32);
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
















//      -----------------------
//      |    functionality    |
//      -----------------------

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

    // data
    putBondsInTable();




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
	blooMaterial = new THREE.MeshLambertMaterial({color: 0x1010dd});
	redMaterial = new THREE.MeshLambertMaterial({color: 0xff2222});
	greenMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	darkRedMaterial = new THREE.MeshLambertMaterial({color: 0x851515});
    darkVioletMaterial = new THREE.MeshLambertMaterial({color: 0x6C08B2});
    cyanMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});
    orangeMaterial = new THREE.MeshLambertMaterial({color: 0xffa500});
    yellowMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    peachMaterial = new THREE.MeshLambertMaterial({color: 0xffb7ae});
    violetMaterial = new THREE.MeshLambertMaterial({color: 0x9859C4});
    darkGreenMaterial = new THREE.MeshLambertMaterial({color: 0x008000});
    darkOrangeMaterial = new THREE.MeshLambertMaterial({color: 0xbf7e00});
    pinkMaterial = new THREE.MeshLambertMaterial({color: 0xff90ce});




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
















//      -----------------
//      |    buttons    |
//      -----------------

function connectAtoms() {
    for (let item of atomArray) {
        // item.connectToAll();
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
















//      -----------------
//      |    startup    |
//      -----------------

$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#addAtom").on("click", newAtom);
    $("#remoovAtom").on("click", remoovAtom);
    $("#restart").on("click", reset);   // different names because to the user, the PROCESS is restarting, but to us the PROGRAM is NOT restarting
    $(document).keypress(function(event) {
        if (event.which == 13) {
            // atomArray[1].moov(0, 100, 0);
            atomArray[1].connectToParent();
        }
    });

    // run at start
    resizeCanvas();                                                             // resize canvas on start
    initialise();
    animate();
});