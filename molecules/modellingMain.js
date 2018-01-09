/*
                                                                                                          88
                                                                                                          88
                                                                                                          88
       document : modellingMain.js, for molecules in shasta-projects    ,adPPYYba,  88       88   ,adPPYb,88  8b,dPPYba,   ,adPPYba,  8b       d8
     created on : thursday, may 18, 2017, 09:09 am                      ""     `Y8  88       88  a8"    `Y88  88P'   "Y8  a8P,,,,,88  `8b     d8'
         author : audrey bongalon, helen so, christopher lim            ,adPPPPP88  88       88  8b      :88  88          8PP"""""""   `8b   d8'
    description : main javascript file for the modelling program        88,    ,88  "8a,   ,a88  "8a,   ,d88  88          "8b,   ,aa    `8b,d8'
                                                                        `"8bbdP"Y8   `"YbbdP'Y8   `"8bbdP"Y8  88           `"Ybbd8"'      Y88'
                                                                                                                                          d8'
                                                                                                                                         d8'
      88                       88                                                   88                       88             
      88                       88                                                   88                       ""             
      88                       88                                                   88                                      
      88,dPPYba,    ,adPPYba,  88   ,adPPYba,  8b,dPPYba,                ,adPPYba,  88,dPPYba,   8b,dPPYba,  88   ,adPPYba,  
      88P"    "8a  a8P,,,,,88  88  a8P,,,,,88  88P"   `"8a              a8"     ""  88P"    "8a  88P"   "Y8  88   I8(    ""  
      88       88  8PP"""""""  88  8PP"""""""  88       88              8b          88       88  88          88    `"Y8ba,   
      88       88  "8b,   ,aa  88  "8b,   ,aa  88       88              "8a,   ,aa  88       88  88          88   aa    )8I  
      88       88   `"Ybbd8"'  88   `"Ybbd8"'  88       88               `"Ybbd8"'  88       88  88          88   `"YbbdP"'

*/

/* global $ THREE */




//      --------------------------------
//      |    chemistry-related data    |
//      --------------------------------

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
}];




const periodicTable = [];

function PrdcElmt(symbol, name, textGeometry, bonds, bondLength, radius, electrons, colour, hlColour) {
    this.symbol = symbol;
    this.name = name;
    this.textGeometry = textGeometry;
    this.possibleBonds = bonds;
    this.bondLength = bondLength;
    this.atomicRadius = radius;
    this.valenceElectrons = electrons;
    this.colour = colour;
    this.highlightColour = hlColour;
}

function createTable() {
    // note: bond length not yet accounted for, radius in progress
    // radius data is in picometres (pm)
    // radius data from http://periodictable.com/Properties/A/AtomicRadius.v.html
    // finished first column for radius as of 5:08 may 31
    
    // elements 1-10
    periodicTable.push(new PrdcElmt("H",  "hydrogen",     null, 1, null, 53,   1, whiteMaterial,     whiteAltMaterial));
    periodicTable.push(new PrdcElmt("He", "helium",       null, 0, null, 31,   2, cyanMaterial,      cyanAltMaterial));
    periodicTable.push(new PrdcElmt("Li", "lithium",      null, 1, null, 167,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Be", "beryllium",    null, 2, null, 112,  2, darkGreenMaterial, darkGreenAltMaterial));
    periodicTable.push(new PrdcElmt("B",  "boron",        null, 3, null, 87,   3, peachMaterial,     peachAltMaterial));
    periodicTable.push(new PrdcElmt("C",  "carbon",       null, 4, null, 67,   4, blackMaterial,     blackAltMaterial));
    periodicTable.push(new PrdcElmt("N",  "nitrogen",     null, 3, null, 56,   5, blooMaterial,      blooAltMaterial));
    periodicTable.push(new PrdcElmt("O",  "oxygen",       null, 2, null, 48,   6, redMaterial,       redAltMaterial));
    periodicTable.push(new PrdcElmt("F",  "fluorine",     null, 1, null, 42,   7, greenMaterial,     greenAltMaterial));
    periodicTable.push(new PrdcElmt("Ne", "neon",         null, 0, null, 38,   8, cyanMaterial,      cyanAltMaterial));
    
    // elements 11-20
    periodicTable.push(new PrdcElmt("Na", "sodium",       null, 1, null, 227,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Mg", "magnesium",    null, 2, null, 145,  2, darkGreenMaterial, darkGreenAltMaterial));
    periodicTable.push(new PrdcElmt("Al", "aluminium",    null, 3, null, 118,  3, pinkMaterial,      pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Si", "silicon",      null, 4, null, 111,  4, pinkMaterial,      pinkAltMaterial));
    periodicTable.push(new PrdcElmt("P",  "phosphorus",   null, 3, null, 98,   5, orangeMaterial,    orangeAltMaterial));
    periodicTable.push(new PrdcElmt("S",  "sulfur",       null, 2, null, 88,   6, yellowMaterial,    yellowAltMaterial));
    periodicTable.push(new PrdcElmt("Cl", "chlorine",     null, 1, null, 79,   7, greenMaterial,     greenAltMaterial));
    periodicTable.push(new PrdcElmt("Ar", "argon",        null, 1, null, 71,   8, cyanMaterial,      cyanAltMaterial));
    periodicTable.push(new PrdcElmt("K",  "potassium",    null, 1, null, 243,  1, violetMaterial,    violetAltMaterial));
    periodicTable.push(new PrdcElmt("Ca", "calcium",      null, 2, null, 194,  2, darkGreenMaterial, darkGreenAltMaterial));
    
    // elements 21-39
    // periodicTable.push(new PrdcElmt("scandium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("titanium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("vanadium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("chromium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("manganese", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iron", 2, null, 5));
    // periodicTable.push(new PrdcElmt("cobalt", 2, null, 5));
    // periodicTable.push(new PrdcElmt("nickel", 2, null, 5));
    // periodicTable.push(new PrdcElmt("copper", 2, null, 5));
    
    
    // elements 30-40
    periodicTable.push(new PrdcElmt("Zn", "zinc",         null, 2, null, 142,  2, peachMaterial, peachAltMaterial));
    periodicTable.push(new PrdcElmt("Ga", "gallium",      null, 3, null, 136,  3, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Ge", "germanium",    null, 4, null, 125,  4, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("As", "arsenic",      null, 3, null, 114,  5, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Se", "selenium",     null, 2, null, 103,  6, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Br", "bromine",      null, 1, null, 94,   7, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Kr", "krypton",      null, 0, null, 88,   8, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Rb", "rubidium",     null, 1, null, 265,  1, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sr", "strontium",    null, 2, null, 219,  2, pinkMaterial,  pinkAltMaterial));
    
    // elements 39-47
    // periodicTable.push(new PrdcElmt("yttrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("zirconium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("niobium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("molybdenum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("technetium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("ruthenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhodium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("palladium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("silver", 2, null, 5));
    
    // element 48-56
    periodicTable.push(new PrdcElmt("Cd", "cadmium",      null, 2, null, 161, 2, peachMaterial,      peachAltMaterial));
    periodicTable.push(new PrdcElmt("In", "indium",       null, 3, null, 156, 3, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sn", "tin",          null, 4, null, 145, 4, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Sb", "antimony",     null, 3, null, 133, 5, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Te", "tellurium",    null, 2, null, 123, 6, pinkMaterial,       pinkAltMaterial));
    periodicTable.push(new PrdcElmt("I",  "iodine",       null, 1, null, 115, 7, darkVioletMaterial, darkVioletAltMaterial));
    periodicTable.push(new PrdcElmt("Xe", "xenon",        null, 0, null, 108, 8, cyanMaterial,       cyanAltMaterial));
    periodicTable.push(new PrdcElmt("Cs", "caesium",      null, 1, null, 300, 1, violetMaterial,     violetAltMaterial));
    periodicTable.push(new PrdcElmt("Ba", "barium",       null, 2, null, 253, 2, darkGreenMaterial,  darkGreenAltMaterial));
    
    // elements 57-71
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
    
    // elements 72-79
    // periodicTable.push(new PrdcElmt("hafnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tantalum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("tungsten", 2, null, 5));
    // periodicTable.push(new PrdcElmt("rhenium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("osmium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("iridium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("platinum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("gold", 2, null, 5));
    
    // elements 80-88
    periodicTable.push(new PrdcElmt("Hg", "mercury",     null, 2, null, 171, 2, peachMaterial, peachAltMaterial));
    periodicTable.push(new PrdcElmt("Tl", "thallium",    null, 3, null, 156, 3, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Pb", "lead",        null, 4, null, 154, 4, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Bi", "bismuth",     null, 3, null, 143, 5, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Po", "polonium",    null, 2, null, 135, 6, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("At", "astatine",    null, 1, null, 127, 7, pinkMaterial,  pinkAltMaterial));
    periodicTable.push(new PrdcElmt("Rn", "radon",       null, 0, null, 120, 8, pinkMaterial,  pinkAltMaterial));
    
    // bottom row -> molecules by collision
    // periodicTable.push(new PrdcElmt("francium", 1, null, 5));
    // periodicTable.push(new PrdcElmt("radium", 2, null, 5));
    
    // elements 89-103
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
    
    // elements 104-111
    // periodicTable.push(new PrdcElmt("rutherfordum", 2, null, 5));
    // periodicTable.push(new PrdcElmt("dubnium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("seaborgium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("bohrium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("hassium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("meitnerium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("darmstadtium", 2, null, 5));
    // periodicTable.push(new PrdcElmt("roentgenium", 2, null, 5));
}

function getBondLength(element, bondingTo, type) {      // type is an integer representing a single, double, or triple bond
    for (let item of bondLengths) {
        if (item.name == element) {
            if (item[bondingTo]) {                      // check if the second element exists in the object of the first element
                if (item[bondingTo][type - 1]) {        // check if that many bonds exist
                    return item[bondingTo][type - 1];   // return the length
                }
                else {
                    console.error("there is no data on those elements sharing that many bonds");
                    return false;
                }
            }
            else {
                console.error("there is no data on " + element + " bonding to " + bondingTo);
                return false;
            }
        }
    }
    console.error("there is no data on " + element + " bonding to " + bondingTo);
    return false;
}

function getMaxBonds(element, bondingTo) {
    for (let item of bondLengths) {
        if (item.name == element) {
            if (item[bondingTo]) {                  // check if the second element exists in the object of the first element
                return item[bondingTo].length;      // if so, return the max number of bonds it can make to that element
            }
            else {
                console.error("there is no data on " + element + " bonding to " + bondingTo);
                return false;
            }
        }
    }
    console.error("nah bwuh das cwusti. theh's no data on " + element);
    return false;
}

function getCarbonAtomicRadius() {
    for (let item of periodicTable) {
        if (item.name == "carbon") {
            return item.atomicRadius;   // returns 67
        }
    }
    console.error("carbon's atomic radius could not be found in the periodic table data");
}

function getCarbonSingleBondLength() {
    for (let item of bondLengths) {
        if (item.name == "carbon") {
            return item.carbon[0];      // returns 154
        }
    }
    console.error("the bond length of a carbon-carbon single bond could not be found in the bondLengths array");
}

function scaleToThreeUnits(pm) {
/*
                            ratio notes

          x (Three.js units)         carbon radius (Three.js units)
        ----------------------  =  ----------------------------------
            x (picometres)             carbon radius (picometres)


            x (return this)         150
         ---------------------  =  -----
          pm (function input)       67?     TODO check this value for scientific accuracy
*/

    return pm * (defaultAtomRadius / getCarbonAtomicRadius());
}
















//      --------------------------------------
//      |    creation of global variables    |
//      --------------------------------------

const canvas = $("#canvas").get(0);
const $canvas = $("#canvas");
let canvasWidth = 720;                                                          // 16:9 ratio
let canvasHeight = 405;
const bgColour = "#ccffff";   // make sure to match with html window colour & css stylings

var currentModel = "ball and stick";

var scene, camera, mainLight, ambientLight, controls, mouse, raycaster, renderer, fontLoader;
var sphereGeometry, cylinderGeometry, lewisDotConnexionGeo, skeletalMaterial, textMaterial, wireMaterial, axisHelper;

var whiteMaterial, greyMaterial, blackMaterial, redMaterial, blooMaterial, greenMaterial, darkRedMaterial,
    darkVioletMaterial, cyanMaterial, orangeMaterial, yellowMaterial, peachMaterial, violetMaterial,
    darkGreenMaterial, darkOrangeMaterial, pinkMaterial;
var whiteAltMaterial, greyAltMaterial, blackAltMaterial, redAltMaterial, blooAltMaterial, greenAltMaterial, darkRedAltMaterial,
    darkVioletAltMaterial, cyanAltMaterial, orangeAltMaterial, yellowAltMaterial, peachAltMaterial, violetAltMaterial,
    darkGreenAltMaterial, darkOrangeAltMaterial, pinkAltMaterial;
var highlightedAtom, highlightedAtomParentObject;

const defaultAtomRadius = 150;  // in Three.js units
const defaultConnectionRadius = defaultAtomRadius / 3;  // thickness of connection
const connectionLength = getCarbonSingleBondLength();   // placeholder TODO scale to carbon radius

let atomArray = [];         // will store all the atoms
let atomMeshArray = [];
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

    // resize #below-canvas so that its contents line up
    $("#below-canvas").css({width: canvasWidth + "px"});

    // resize within Three.js
    if (camera) {                                       // this if-statement is a hacky way of preventing this from running on the
        camera.aspect = canvasWidth / canvasHeight;     // function call from $(document).ready, since camera isn't defined at that
        camera.updateProjectionMatrix();                // point. we could have just done something like "var initialised = false",
        renderer.setSize(canvasWidth, canvasHeight);    // but i didn't want to waste memory                        -audrey
    }
}
















//      ------------------------------------------------
//      |    constructor and atom-related functions    |
//      ------------------------------------------------

function Atom() {
    this.mesh;                      // the sphere
    this.parentConnection;          // cylinder to connect to parent atom (array of cylinders if end of chain)
    this.lewisDotConnexion;         // it's actually a semicolon text geometry mesh
    this.childConnections = [];     // the cylinder(s) that connect to children atoms
    this.skeletalLine;
    this.symbolMesh;
    this.symbolMeshOffset =        {x: 0, y: 0};       // placeholder values
    this.lewisDotConnexionOffset = {x: 0, y: 0};       // ditto
    this.swingAngle = 0;    // in degrees
    this.rotateAngle = 0;   // likewise
    // this.angleX = 0;
    // this.angleY = 0;
    // this.angleZ = 0;
    this.element = "carbon";        // TODO does this need to be initialised?
    this.radius = 0;                // radius of nucleus, is terms of scale to default (carbon)
    this.possibleBonds = 1;         // maximum number of bonds the atom can make
    this.colour = blackMaterial;    // colour of model
    this.highlightColour = blackAltMaterial;
    this.currentBonds = [];         // atoms this is currently bonded to (use this.currentBonds.length)
    this.nextInChain = [];          // same as currentBonds, except without the parent atom
    this.parentAtom;                // if undefined, then is base; if object, part of chain
    this.distanceToParent;          // in Three.js units
    this.typeOfBondToParent = 1;    // integer from 1 to 3, representing a single, double, or triple bond

    this.setElementData = function(newElement) {
        this.element = newElement;

        getDataFromPrdcTbl: {
            for (let item of periodicTable) {
                if (item.name == newElement) {
                    // set possible bonds data
                    this.possibleBonds = item.possibleBonds;
    
                    // set radius data and resize
                    this.radius = item.atomicRadius / getCarbonAtomicRadius();
    
                    // set colour data and change colour
                    this.colour = item.colour;
                    this.highlightColour = item.highlightColour;
    
                    break getDataFromPrdcTbl;     // dont waste time looping through all elements
                }
            }
            // this will only run if newElement isnt in periodicTable
            console.error("tried to set element to \"" + newElement + "\", which is not defined in the program");
        }

        setDistToParent: {
            if (this.parentAtom) {      // if not the base atom (i.e. has a parent atom)
                this.distanceToParent = scaleToThreeUnits(getBondLength(this.element, this.parentAtom.element, this.typeOfBondToParent));
            }
        }

        if (this.symbolMesh && currentModel =="lewis dot") {
            scene.remove(this.symbolMesh);
        }
        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
        if (currentModel == "lewis dot") {
            scene.remove(this.symbolMesh);
        }
    };

    this.applyElementData = function() {
        this.mesh.scale.set(this.radius, this.radius, this.radius);     // radius
        this.resizeParentConnection();                                  // bond length
        changeColour(this.mesh, this.colour);                           // colour
        // if (currentModel == "lewis dot") {
        //     scene.add(this.symbolMesh);
        // }
    };

    this.createCarbonPlaceholder = function() {
        setData: {
            this.element = "carbon";
            this.radius = 1;                    // defaults
            this.parentConnection = null;

            for (let item of periodicTable) {   // gets the data from periodicTable
                if (item.name == "carbon") {
                    this.possibleBonds = item.possibleBonds;
                    this.colour = item.colour;
                    this.highlightColour = item.highlightColour;
                    break setData;              // dont waste time looping through all elements
                }
            }
        }

        this.mesh = new THREE.Mesh(sphereGeometry, this.colour);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(0, 0, 0);

        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
        this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);


        if (currentModel == "ball and stick") {
            scene.add(this.mesh);
        }
        else if (currentModel == "lewis dot") {
            scene.add(this.symbolMesh);
        }
    };

    this.createNew = function() {
        this.setElementData("carbon");

        // ball and stick
        this.mesh = new THREE.Mesh(sphereGeometry, this.colour);
        this.mesh.scale.set(this.radius, this.radius, this.radius);
        this.mesh.position.set(this.parentAtom.mesh.position.x + this.distanceToParent, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z);

        this.spawnParentConnection();
        this.applyElementData();

        // lewis dot
        setTxtGeo: {
            for (let item of periodicTable) {
                if (item.name == this.element) {
                    this.symbolMesh = new THREE.Mesh(item.textGeometry, textMaterial);
                    let boundingBox = new THREE.Box3().setFromObject(this.symbolMesh);
                    // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
                    this.symbolMeshOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

                    break setTxtGeo;    // dont waste time looping through unnecessary items
                }
            }
        }
        this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);

        if (currentModel == "ball and stick") {
            scene.add(this.mesh);
        }
        else if (currentModel == "lewis dot") {
            scene.add(this.symbolMesh);
        }
    };

    this.moov = function(xDir, yDir, zDir) {
        this.mesh.translateX(xDir);
        this.mesh.translateY(yDir);
        this.mesh.translateZ(zDir);
    };

    this.reposition = function() {   // repositions atom based on swingInputData and rotateInputData
        if (this.parentAtom) {
            const x = this.parentAtom.mesh.position.x + (this.distanceToParent      * Math.cos(THREE.Math.degToRad(swingInputData)));
            const y = this.parentAtom.mesh.position.y + (this.distanceToParent      * Math.sin(THREE.Math.degToRad(swingInputData))  * Math.cos(THREE.Math.degToRad(rotateInputData)));
            const z = this.parentAtom.mesh.position.z + (this.distanceToParent * -1 * Math.sin(THREE.Math.degToRad(rotateInputData)) * Math.sin(THREE.Math.degToRad(swingInputData)));
            // note that we use -sin for z because from 0-360, the atom starts in the centre, moves back, then fowards, then back to centre

            this.mesh.position.set(x, y, z);
            this.symbolMesh.position.set(this.mesh.position.x - this.symbolMeshOffset.x, this.mesh.position.y - this.symbolMeshOffset.y, this.mesh.position.z);
        }
        else {
            alert("the base atom cannot be repositioned.");
            console.error("the base atom cannot be repositioned.");
        }
    };

    this.spawnParentConnection = function() {
        if (this.parentAtom) {

            //      ------------------------
            //      |    ball and stick    |
            //      ------------------------

            this.parentConnection = new THREE.Mesh(cylinderGeometry, this.colour);
    
            // cylinder position
            const midpoint = getMidpoint([this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
                                         [this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z]);
            this.parentConnection.position.set(midpoint[0], midpoint[1], midpoint[2]);     // "position" will be halfway in between

            // cylinder rotation
            this.parentConnection.lookAt(this.parentAtom.mesh.position);




            //      ------------------
            //      |    skeletal    |
            //      ------------------

            if (this.element == "carbon" && this.parentAtom.element == "carbon") {          // only draw lines between carbon atoms
                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));
                lineGeometry.vertices.push(new THREE.Vector3(this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z));
                this.skeletalLine = new THREE.Line(lineGeometry, skeletalMaterial);
            }




            //      -------------------
            //      |    lewis dot    |
            //      -------------------

            // create mesh
            this.lewisDotConnexion = new THREE.Mesh(lewisDotConnexionGeo, textMaterial);

            // text needs to be centred, so calculate offset from centre
            let boundingBox = new THREE.Box3().setFromObject(this.lewisDotConnexion);
            // console.log(boundingBox.min, boundingBox.max, boundingBox.getSize());   // useful dimensions of text mesh
            this.lewisDotConnexionOffset = {x: boundingBox.getSize().x / 2, y: boundingBox.getSize().y / 2};

            // set position
            this.lewisDotConnexion.position.set(midpoint[0] - this.lewisDotConnexionOffset.x,
                                                midpoint[1] - this.lewisDotConnexionOffset.y,
                                                midpoint[2]);

            // set rotation (on initialise, the geometry is rotated by 90 degrees)
            this.lewisDotConnexion.lookAt({x: this.parentAtom.mesh.position.x,
                                           y: this.parentAtom.mesh.position.y - this.lewisDotConnexionOffset.y,
                                           z: this.parentAtom.mesh.position.z});




            // this.parentConnection.bondLength = getMidpoint([], []);
            if (currentModel == "ball and stick") {
                scene.add(this.parentConnection);
            }
            else if (currentModel == "skeletal") {
                scene.add(this.skeletalLine);
            }
            else if (currentModel == "lewis dot") {
                scene.add(this.lewisDotConnexion);
            }
        }
    };
    this.moovParentConnection = function() {
        if (this.parentAtom) {

            //      ------------------------
            //      |    ball and stick    |
            //      ------------------------
    
            // cylinder position
            const midpoint = getMidpoint([this.mesh.position.x, this.mesh.position.y, this.mesh.position.z],
                                         [this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z]);
            this.parentConnection.position.set(midpoint[0], midpoint[1], midpoint[2]);     // "position" will be halfway in between

            // cylinder rotation
            this.parentConnection.lookAt(this.parentAtom.mesh.position);




            //      ------------------
            //      |    skeletal    |
            //      ------------------

            // if there's a line (i.e. both atoms are carbon), remove and replace
            if (this.skeletalLine) {
                scene.remove(this.skeletalLine);
                const lineGeometry = new THREE.Geometry();
                lineGeometry.vertices.push(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));
                lineGeometry.vertices.push(new THREE.Vector3(this.parentAtom.mesh.position.x, this.parentAtom.mesh.position.y, this.parentAtom.mesh.position.z));
                this.skeletalLine = new THREE.Line(lineGeometry, skeletalMaterial);
                if (currentModel == "skeletal") {
                    scene.add(this.skeletalLine);
                }
            }




            //      -------------------
            //      |    lewis dot    |
            //      -------------------

            this.lewisDotConnexion.position.set(midpoint[0] - this.lewisDotConnexionOffset.x,
                                                midpoint[1] - this.lewisDotConnexionOffset.y,
                                                midpoint[2]);

            // rotation
            this.lewisDotConnexion.lookAt({x: this.parentAtom.mesh.position.x,
                                           y: this.parentAtom.mesh.position.y - this.lewisDotConnexionOffset.y,
                                           z: this.parentAtom.mesh.position.z});
        }
    };
    this.resizeParentConnection = function() {
        // TODO
    };

    this.connectToChildren = function () {
        // loop
    };
    this.connectToAll = function() {
        // clear array; this function might be used after repositioning,
        this.connections = [];
        // TODO remove from scene

        this.spawnParentConnection();     // so the old cylinders will need to go
        this.connectToChildren();
    };

    this.drawBallAndStick = function() {
        scene.add(this.mesh);

        // add connection, if applicable
        if (this.parentAtom) {
            scene.add(this.parentConnection);
        }
    };
    this.drawSkeletal = function() {
        if (this.parentAtom && this.skeletalLine) {
            scene.add(this.skeletalLine);
        }
    };
    this.drawLewisDot = function() {
        scene.add(this.symbolMesh);

        // add connection, if applicable
        if (this.parentAtom) {
            scene.add(this.lewisDotConnexion);
        }
    };

    this.clearBallAndStick = function() {
        scene.remove(this.mesh);

        // remove connection, if applicable
        if (this.parentAtom) {
            scene.remove(this.parentConnection);
        }
    };
    this.clearSkeletal = function() {
        scene.remove(this.skeletalLine);
    };
    this.clearLewisDot = function() {
        scene.remove(this.symbolMesh);

        // remove connection, if applicable
        if (this.parentAtom) {
            scene.remove(this.lewisDotConnexion);
        }
    };
}




function changeColour(mesh, material) {
    mesh.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
        mesh.geometry.uvsNeedUpdate = true;
        mesh.needsUpdate = true;
    });
}




function highlightSelectedAtom() {
    // create ray
	raycaster.setFromCamera(mouse, camera);

    // this is an array that stores all of the things the ray touches, from front (closest to camera) to back
    // const intersects = raycaster.intersectObjects(atomMeshArray);   // (used to be scene.children)
    const everything = raycaster.intersectObjects(scene.children);

    console.log(everything[0]);

    // exclude axes from array (by creating a new array)
    const intersects = [];
    for (let item of everything) {
        if (item.isMesh) {
            intersects.push(item);
        }
    }
    console.log(intersects);

    if (intersects.length > 0) {                                // if the ray touches anything
        if (highlightedAtom != intersects[0].object) {          //      if it's touching anything new
            if (highlightedAtom) {                              //      and the old thing was an atom
                changeColour(highlightedAtom, highlightedAtomParentObject.colour);   //      unhighlight the old atom
            }

            highlightedAtom = intersects[0].object;             // then update data to store the new highlighted atom
            for (let item of atomArray) {
                if (item.mesh == highlightedAtom) {
                    highlightedAtomParentObject = item;
                }
            }
            // console.log(highlightedAtom)
            changeColour(highlightedAtom, highlightedAtomParentObject.highlightColour);       // and change its colour
        }
    }
    else {                                                      // if the ray doesn't touch anything
        if (highlightedAtom) {                                  //      if the old thing was an atom
            changeColour(highlightedAtom, highlightedAtomParentObject.colour);       //      unhighlight it
        }
        highlightedAtom = null;                                 // tell the data the ray isn't touching anything
    }
}




function getMidpoint(arr1, arr2) {
    // both arrays should have coordinates in the form [x, y, z]
    const x = (arr1[0] + arr2[0]) / 2;
    const y = (arr1[1] + arr2[1]) / 2;
    const z = (arr1[2] + arr2[2]) / 2;

    // return array of averages
    return ([x, y, z]);
}
















//      -----------------------
//      |    functionality    |
//      -----------------------

function onMouseMove(event) {
    const canvasPosition = renderer.domElement.getBoundingClientRect();

    // position inside the canvas
    const mouseX = event.clientX - canvasPosition.left;
    const mouseY = event.clientY - canvasPosition.top;
    
    // divide my the position so it represents the fraction of the canvas it takes up
    // then multiply by 2 (because the canvas width and height both go from -1 to 1)
    // mouse y needs to be inverted because down is positive
    // add/subtract 1 to centre it since (0,0) is in the middle of the canvas
    mouse.x =  2 * (mouseX / canvasWidth)  - 1;
    mouse.y = -2 * (mouseY / canvasHeight) + 1;
}




function drawAxes() {
    const blueMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});
    const greenMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});
    const redMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

    const xLineGeometry = new THREE.Geometry();
    xLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    xLineGeometry.vertices.push(new THREE.Vector3(500, 0, 0));

    const yLineGeometry = new THREE.Geometry();
    yLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    yLineGeometry.vertices.push(new THREE.Vector3(0, 500, 0));

    const zLineGeometry = new THREE.Geometry();
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    zLineGeometry.vertices.push(new THREE.Vector3(0, 0, 500));

    const xAxis = new THREE.Line(xLineGeometry, blueMaterial);
    const yAxis = new THREE.Line(yLineGeometry, greenMaterial);
    const zAxis = new THREE.Line(zLineGeometry, redMaterial);

    scene.add(xAxis);
    scene.add(yAxis);
    scene.add(zAxis);
}




function initialise() {
    // put bond lengths in periodic table
    for (let item of periodicTable) {
        for (let lengths of bondLengths) {
            if (lengths.name == item.name) {
                item.bondLength = lengths;
            }
        }
    }




    // create a Three.js scene
	scene = new THREE.Scene();

    // create renderer
	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize(canvasWidth, canvasHeight);

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

    // controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    mouse = new THREE.Vector2();
    mouse.x = -1;   // these lines prevent the ray starting at (0, 0), which would make the
    mouse.y = 1;    // base atom highlighted on startup. btw, (-1, 1) is the top-left corner
    raycaster = new THREE.Raycaster();

    // axis helper (dev tool)
    axisHelper = new THREE.AxisHelper(200);




    // materials (mainly colours)
             wireMaterial = new THREE.MeshBasicMaterial(  {color: 0x66ff66, wireframe: true});
         skeletalMaterial = new THREE.LineBasicMaterial(  {color: 0x000000, linewidth: 100});       // doesn't work on windows
            whiteMaterial = new THREE.MeshLambertMaterial({color: 0xbbbbbb});
             greyMaterial = new THREE.MeshLambertMaterial({color: 0x888888});
            blackMaterial = new THREE.MeshPhongMaterial(  {color: 0x222222});
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

         whiteAltMaterial = new THREE.MeshLambertMaterial({color: 0xfffdee});
          greyAltMaterial = new THREE.MeshLambertMaterial({color: 0x6f6d6d});
         blackAltMaterial = new THREE.MeshPhongMaterial(  {color: 0x404040});
          blooAltMaterial = new THREE.MeshLambertMaterial({color: 0x5858ff});
           redAltMaterial = new THREE.MeshLambertMaterial({color: 0xff8080});
         greenAltMaterial = new THREE.MeshLambertMaterial({color: 0x8dff8d});
       darkRedAltMaterial = new THREE.MeshLambertMaterial({color: 0xab5555});
    darkVioletAltMaterial = new THREE.MeshLambertMaterial({color: 0x80559f});
          cyanAltMaterial = new THREE.MeshLambertMaterial({color: 0x8dffff});
        orangeAltMaterial = new THREE.MeshLambertMaterial({color: 0xffd994});
        yellowAltMaterial = new THREE.MeshLambertMaterial({color: 0xffffa0});
         peachAltMaterial = new THREE.MeshLambertMaterial({color: 0xffcfc9});
        violetAltMaterial = new THREE.MeshLambertMaterial({color: 0xbc9dd2});
     darkGreenAltMaterial = new THREE.MeshLambertMaterial({color: 0x5f9a5f});
    darkOrangeAltMaterial = new THREE.MeshLambertMaterial({color: 0xdfba74});
          pinkAltMaterial = new THREE.MeshLambertMaterial({color: 0xf9c6e2});

    // create periodic table
    createTable();

    // load fonts
    fontLoader = new THREE.FontLoader();
    textMaterial = new THREE.MeshLambertMaterial({color: 0x000000});

    fontLoader.load("../libraries/fonts/homizio.json", function(font) {

        // (this anonymous callback runs once the json file is loaded)

        // puts text geometries into periodicTable
        for (let item of periodicTable) {
            item.textGeometry = new THREE.TextGeometry(item.symbol, {
                font: font,
                size: (defaultAtomRadius * 2) * ( 3/4 ),
                height: 0,
                curveSegments: 12,
                bevelThickness: 2,
                bevelSize: 5,
                bevelEnabled: true
            });
        }

        // creates the text geometry for the lewis dot connections (it's actually a semicolon text geometry)
        lewisDotConnexionGeo = new THREE.TextGeometry(":", {    // set ":" to "P" for dev use (easier to see direction)
            font: font,
            size: (defaultAtomRadius * 2) * ( 3/4 ),
            height: 0,
            curveSegments: 12,
            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true
        });
        lewisDotConnexionGeo.rotateY(THREE.Math.degToRad(90));

        //  ------------------------------------------------------------------------------------------------------------------
        //  |    stuff below this box is meant to run *after* the text geometries have loaded and put into pedriodicTable    |
        //  ------------------------------------------------------------------------------------------------------------------

        // construct and create the first atom, push it into atomArray
        currentAtom = new Atom();
        currentAtom.createCarbonPlaceholder();
        atomArray = [currentAtom];
        atomMeshArray = [currentAtom.mesh];
    });




	sphereGeometry = new THREE.SphereGeometry(defaultAtomRadius, 32, 32);
	cylinderGeometry = new THREE.CylinderGeometry(defaultConnectionRadius, defaultConnectionRadius, connectionLength, 32);
	cylinderGeometry.rotateX(THREE.Math.degToRad(90));
	// the lookAt function points the positive-z direction of an object towards a point, so we change the geometry so that
	// the positive-z side of the cone is one of the flat sides

    // axes
    drawAxes();




	canvas.appendChild(renderer.domElement);
}




function animate() {
    // highlight the atom the mouse hovers over
    // highlightSelectedAtom();

    // if on lewis dot model, make sure all text faces user (this looks kinda funny)
    // for (let item of atomArray) {
    //     item.symbolMesh.lookAt(camera.position);
    // }

    // update Three.js tools
	controls.update();
	renderer.render(scene, camera);

    // recursive loop
    window.requestAnimationFrame(animate);
}




function switchModel(type) {
    // don't run if model isn't changing
    if (type == currentModel) {
        console.log(type + " is already the current model");
        return;
    }




    // remove old model from scene
    if (currentModel === "ball and stick") {
        for (let item of atomArray) {
            item.clearBallAndStick();
        }
    }
    else if (currentModel == "skeletal") {
        for (let item of atomArray) {
            item.clearSkeletal();
        }
    }
    else if (currentModel == "lewis dot") {
        for (let item of atomArray) {
            item.clearLewisDot();
        }
    }




    // draw in new model and set it as the current one
    currentModel = type;
    if (type == "ball and stick") {
        for (let item of atomArray) {
            item.drawBallAndStick();
        }
    }
    else if (type == "skeletal") {
        for (let item of atomArray) {
            item.drawSkeletal();
        }
    }
    else if (type == "lewis dot") {
        for (let item of atomArray) {
            item.drawLewisDot();
        }
    }
}


















//      -----------------
//      |    startup    |
//      -----------------

var swingInputData = 0, rotateInputData = 0;

$(document).ready(function() {
    // event listeners
    $(window).resize(resizeCanvas);
    $("#addAtom").on("click", function() {
        if (currentAtom.currentBonds.length < currentAtom.possibleBonds) {
            atomArray.push(new Atom());                                             // construct the new atom
    
            previousAtom = currentAtom;                                             // new previousAtom is the old currentAtom
            currentAtom = atomArray[atomArray.length - 1];                          // new currentAtom is last (newest) in array
    
            atomMeshArray.push(currentAtom.mesh);
    
            previousAtom.currentBonds.push(currentAtom);
            currentAtom.currentBonds.push(previousAtom);
            currentAtom.parentAtom = previousAtom;
    
            currentAtom.createNew();                                                // create the new atom
    
    
    
    
            // reset input values
            $("#dropdown").val("carbon");
        }
        else {
            alert("This atom cannot bond to any more additional atoms.");
        }
    });
    $("#remoovAtom").on("click", function() {
        alert("remoov");
    });
    $("#restart").on("click", function() {
        // default to ball-and-stick model
        currentModel = "ball and stick";
    
        // clear data
        atomArray = [];
        atomMeshArray = [];
        while (scene.children.length > 0) {         // properly clear scene
            scene.remove(scene.children[0]);        // don't just clear array, because we have no idea what else Three.js needs to clear
        }
    
        // reset lights and base atom
        drawAxes();
        scene.add(mainLight);
        scene.add(ambientLight);
        currentAtom = new Atom();
        currentAtom.createCarbonPlaceholder();
        atomArray.push(currentAtom);
        atomMeshArray.push(currentAtom.mesh);
    
        // reset camera
        controls.reset();
    
        // reset input values
        $("#dropdown").val("carbon");
    });

    $("#ballAndStick").on("click", function() {
        switchModel("ball and stick");
    });
    $("#skeletal").on("click", function() {
        switchModel("skeletal");
    });
    $("#lewisDot").on("click", function() {
        switchModel("lewis dot");
    });

    $("#dropdown").on("change", function() {
        const element = $("#dropdown option:selected").val();
        currentAtom.setElementData(element);
        currentAtom.applyElementData();
        if (currentAtom.parentAtom) {   // prevents the alert from showing when the base atom is changed
            currentAtom.reposition();
        }
        currentAtom.moovParentConnection();
        currentAtom.symbolMesh.position.set(currentAtom.mesh.position.x - currentAtom.symbolMeshOffset.x, currentAtom.mesh.position.y - currentAtom.symbolMeshOffset.y, currentAtom.mesh.position.z);
    });

    // TODO fix inputs
    $("#swingSlider").on("input change", function() {
        // gets value from slider
        swingInputData = $(this).val();

        // set placeholder and value on corresponding input box
        $("#swingInput").attr("placeholder", swingInputData);
        $("#swingInput").val(swingInputData);

        // apply change to the selected atom
        currentAtom.reposition();
        currentAtom.moovParentConnection();
    });
    $("#swingInput").on("input change", function() {
        // gets the value from input box
        swingInputData = $(this).val();

        // check to make sure value is within bounds
        const max = $(this).attr("max");
        const min = $(this).attr("min");
        if (swingInputData > max) {
            swingInputData = max;
            // console.log("nht")   // TODO fix overflow error
        }
        else if (swingInputData < min) {
            swingInputData = min;
        }

        // set value on slider and update the element to visually moov the slider
        $("#swingSlider").val(swingInputData);
        $("#swingSlider").trigger("change");

        // apply change to the selected atom
        currentAtom.reposition();
        currentAtom.moovParentConnection();
    });
    $("#rotateSlider").on("input change", function() {
        // gets value from slider
        rotateInputData = $(this).val();

        // set placeholder and value on corresponding input box
        $("#rotateInput").attr("placeholder", rotateInputData);
        $("#rotateInput").val(rotateInputData);

        // apply change to the selected atom
        currentAtom.reposition();
        currentAtom.moovParentConnection();
    });
    $("#rotateInput").on("input change", function() {
        // gets the value from input box
        rotateInputData = $(this).val();

       // check to make sure value is within bounds
        const max = $(this).attr("max");
        const min = $(this).attr("min");
        if (rotateInputData > max) {
            rotateInputData = max;
        }
        else if (rotateInputData < min) {
            rotateInputData = min;
        }

        // set value on slider and update the element to visually moov the slider
        $("rotateSlider").val(rotateInputData);
        $("#rotateSlider").trigger("change");

        // apply change to the selected atom
        currentAtom.reposition();
        currentAtom.moovParentConnection();
    });

    $canvas.on("mousemove", onMouseMove);
    $(window).on("keydown", function(event) {
        if (event.which == 187) {        // =
            currentAtom.lewisDotConnexion.add(axisHelper);
        }
        else if (event.which == 65) {    // a
            console.log("hi");
        }
    });

    // run at start
    resizeCanvas();     // canvas must be sized on start
    initialise();
    animate();
});