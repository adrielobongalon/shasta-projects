/*
       document : threeData.js, for molecules in shasta-projects
     created on : thursday, february 08, 2018, 14:50 pm
         author : audrey bongalon
    description : stores THREE.js-related data
                  originally from main.js (formerly modellingMain.js)


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

/* global THREE chemistryData canvasData */




const threeData = {
    // scene, renderer, and camera. make sure to update with init() at start
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({alpha: true, antialias: true}),
    camera: new THREE.PerspectiveCamera(10, canvasData.width / canvasData.height, 1000, 100000),

    // lighting
    mainLight: new THREE.DirectionalLight(0x888888),
    ambientLight: new THREE.AmbientLight(0xcccccc),

    // controls
    controls: null,
    mouse: {
        vector: new THREE.Vector2(),
        x: -1,   // these lines prevent the ray starting at (0, 0), which would make the
        y:  1    // base atom highlighted on startup. btw, (-1, 1) is the top-left corner
    },
    raycaster: new THREE.Raycaster(),

    // axis helper (dev tool)
    axisHelper: new THREE.AxisHelper(500),

    // materials (mainly colours)
    wireMaterial:           new THREE.MeshBasicMaterial(  {color: 0x66ff66, wireframe: true}),
    skeletalMaterial:       new THREE.LineBasicMaterial(  {color: 0x000000, linewidth: 100}),       // linewidth doesn't work on windows
    textMaterial:           new THREE.MeshLambertMaterial({color: 0x000000}),

    whiteMaterial:          new THREE.MeshLambertMaterial({color: 0xbbbbbb}),
    greyMaterial:           new THREE.MeshLambertMaterial({color: 0x888888}),
    blackMaterial:          new THREE.MeshPhongMaterial(  {color: 0x222222}),
    blooMaterial:           new THREE.MeshLambertMaterial({color: 0x1010dd}),
    redMaterial:            new THREE.MeshLambertMaterial({color: 0xff2222}),
    greenMaterial:          new THREE.MeshLambertMaterial({color: 0x00ff00}),
    darkRedMaterial:        new THREE.MeshLambertMaterial({color: 0x851515}),
    darkVioletMaterial:     new THREE.MeshLambertMaterial({color: 0x6C08B2}),
    cyanMaterial:           new THREE.MeshLambertMaterial({color: 0x00ffff}),
    orangeMaterial:         new THREE.MeshLambertMaterial({color: 0xffa500}),
    yellowMaterial:         new THREE.MeshLambertMaterial({color: 0xffff00}),
    peachMaterial:          new THREE.MeshLambertMaterial({color: 0xffb7ae}),
    violetMaterial:         new THREE.MeshLambertMaterial({color: 0x9859C4}),
    darkGreenMaterial:      new THREE.MeshLambertMaterial({color: 0x008000}),
    darkOrangeMaterial:     new THREE.MeshLambertMaterial({color: 0xbf7e00}),
    pinkMaterial:           new THREE.MeshLambertMaterial({color: 0xff90ce}),

    whiteAltMaterial:       new THREE.MeshLambertMaterial({color: 0xfffdee}),
    greyAltMaterial:        new THREE.MeshLambertMaterial({color: 0x6f6d6d}),
    blackAltMaterial:       new THREE.MeshPhongMaterial(  {color: 0x404040}),
    blooAltMaterial:        new THREE.MeshLambertMaterial({color: 0x5858ff}),
    redAltMaterial:         new THREE.MeshLambertMaterial({color: 0xff8080}),
    greenAltMaterial:       new THREE.MeshLambertMaterial({color: 0x8dff8d}),
    darkRedAltMaterial:     new THREE.MeshLambertMaterial({color: 0xab5555}),
    darkVioletAltMaterial:  new THREE.MeshLambertMaterial({color: 0x80559f}),
    cyanAltMaterial:        new THREE.MeshLambertMaterial({color: 0x8dffff}),
    orangeAltMaterial:      new THREE.MeshLambertMaterial({color: 0xffd994}),
    yellowAltMaterial:      new THREE.MeshLambertMaterial({color: 0xffffa0}),
    peachAltMaterial:       new THREE.MeshLambertMaterial({color: 0xffcfc9}),
    violetAltMaterial:      new THREE.MeshLambertMaterial({color: 0xbc9dd2}),
    darkGreenAltMaterial:   new THREE.MeshLambertMaterial({color: 0x5f9a5f}),
    darkOrangeAltMaterial:  new THREE.MeshLambertMaterial({color: 0xdfba74}),
    pinkAltMaterial:        new THREE.MeshLambertMaterial({color: 0xf9c6e2}),

    // font loader
    fontLoader: new THREE.FontLoader(),
    textGeometries: [],
    
    init() {
        // scale renderer to proper ratio
    	this.renderer.setSize(canvasData.width, canvasData.height);

        this.cylinderGeometry.rotateX(THREE.Math.degToRad(90));
    	// the lookAt function points the positive-z direction of an object towards a point, so we change the geometry so that
    	// the positive-z side of the cone is one of the flat sides
    },
    setUpScene() {
    	this.camera.position.z = 9001;   // IT's OVER 9000!

    	// set light positions and add them to the scene
        this.mainLight.position.set(0, 300, 500).normalize();
        this.ambientLight.position.set(0, 200, -500).normalize();
        this.addLights();
    },




    addLights() {
        this.scene.add(this.mainLight);
        this.scene.add(this.ambientLight);
    },
    addSceneAxis() {
        this.scene.add(this.axisHelper);
    },
    updateCameraRatio(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    },
    updateTools() {
        this.controls.update();
    	this.renderer.render(this.scene, this.camera);
    },
    clearScene() {
        while (this.scene.children.length > 0) {        // properly clear scene
            this.scene.remove(this.scene.children[0]);  // don't just clear array, because we have no idea what else Three.js needs to clear
        }
    },
    updateMaterial(mesh, material) {
        mesh.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
            mesh.geometry.uvsNeedUpdate = true;
            mesh.needsUpdate = true;
        });
    },




    getMidpoint(arr1, arr2) {
        // both arrays should have coordinates in the form [x, y, z]
        const x = (arr1[0] + arr2[0]) / 2;
        const y = (arr1[1] + arr2[1]) / 2;
        const z = (arr1[2] + arr2[2]) / 2;
    
        // return array of averages
        return ([x, y, z]);
    }
};

// outside the main object because properties are based on each other
threeData.controls = new THREE.OrbitControls(threeData.camera, threeData.renderer.domElement);
















const constants = {
    defaultAtomRadius: null,
    defaultConnectionRadius: null,
    connectionLength: null
};

// outside main object because properties are based on each other
constants.defaultAtomRadius = 150,  // in Three.js units
constants.defaultConnectionRadius = constants.defaultAtomRadius / 3,  // thickness of connection, 50




// outside main object because parameters are based on properties in the constants object
threeData.sphereGeometry = new THREE.SphereGeometry(constants.defaultAtomRadius, 32, 32);
threeData.cylinderGeometry = new THREE.CylinderGeometry(constants.defaultConnectionRadius, constants.defaultConnectionRadius, constants.connectionLength, 32);
threeData.scaleToThreeUnits = function scaleToThreeUnits(pm) {
    /*
                                ratio notes
    
              x (Three.js units)         carbon radius (Three.js units)
            ----------------------  =  ----------------------------------
                x (picometres)             carbon radius (picometres)
    
    
                x (return this)         150
             ---------------------  =  -----
              pm (function input)       67?     TODO check this value for scientific accuracy
    */
    // console.log(defaultAtomRadius);
    return pm * (constants.defaultAtomRadius / chemistryData.getCarbonAtomicRadius());
};

// down here because it requires the scaling function
threeData.connectionLength = threeData.scaleToThreeUnits(chemistryData.getCarbonSingleBondLength()); // placeholder TODO scale to carbon radius