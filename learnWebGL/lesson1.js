/* global $ mat4 */

var canvas;

var gl;
function initGL(cnv) {

    // attempt to get the canvas context
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
    catch(e) {
        // nothing, just report the error
    }

    // alert user if WebGL doesn't work
    if (!gl) {
        alert("sorry. the program will not work. your browser does not support webGL");
    }
}








function getShader(gl, id) {
    var shaderScript = $(id).get(0);

    // end function if scripts are not defined
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {      // if text
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    // creates the shaders
    var shader;
    if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
        return null;    // end if type is not correct
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}








var shaderProgram;

function initShaders() {

    // get the shaders from the scripts on the HTML
    var fragmentShader = getShader(gl, "#shader-fs");
    var vertexShader = getShader(gl, "#shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}








// create model-view matrix and projection matrix
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {      // move the matrices from js to WebGL
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}








// buffers for each shape
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

function initBuffers() {

    // triangle
    triangleVertexPositionBuffer = gl.createBuffer();               // create buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);   // tells WebGL which buffer we're currently working on
    var vertices = [                                                // the 3 points on the triangle (x, y, z)
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);     // fill the current buffer with the vertices
    triangleVertexPositionBuffer.numItems = 3;                                      // 3 points (personally, id prefer to set this to vertices.length / 3)
    triangleVertexPositionBuffer.itemSize = 3;                                      // 3 coordinates (x, y, z) each

    // -------------------------------------------------------------

    // square
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
         1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
         1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.numItems = 4;    // 4 points (personally, id prefer to set this to vertices.length / 3)
    squareVertexPositionBuffer.itemSize = 3;    // 3 coordinates each
}








function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);         // tells WebGL the size of the viewpoirt
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);            // clear the canvas

    /* to make things that are further away look smaller (to make perspetive work), we tell it
            - that our (vertical) field of view is 45°
            - the width-to-height ratio of our canvas
            - that we don’t want to see things that are closer than 0.1 units to our viewpoint
            - that we don’t want to see things that are further away than 100 units. */
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);    // our starting view is in the centre




    /*  ------------------
        |    triangle    |
        ------------------  */
    
    // to draw the triangle, start by moving the view 1.5 units to the left and 7 units away from the viewer
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

    // we're currently working with the triangle's buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

    // idek
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // take into account our current model-view matrix (where the view is, relative to the start)
    setMatrixUniforms();

    // draw the array of vertices (that we gave you earlier) as triangles, starting with item 0 in the array and going up to the numItems^th element”.
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    /*  ----------------
        |    square    |
        ----------------  */

    // remember that the triangle was drawn 1.5 units to the left, so we have to go double that to the right to get to [1.5, 0.0, -7.0]
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);

    // we're working with the square's buffer now
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

    // ?
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // we moved again, so we have to reset the current model-view matrix again
    setMatrixUniforms();

    // a triangle strip is a bunch of triangles. think of it as using triangles to approximate a square
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}








function webGLStart() {
    canvas = $("#canvas1").get(0);
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

$("body").ready(function() {
    webGLStart();
});