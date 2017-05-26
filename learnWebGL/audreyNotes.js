/* global THREE panOffset scope*/

/*  ---------------------------------------
    |    the pan controls helen copied    |
    ---------------------------------------  */

// pass in distance in world space to move left
this.panLeft = function() {
	var v = new THREE.Vector3();

	return function panLeft(distance) {
		var te = this.object.matrix.elements;

		// get X column of matrix
		v.set(te[0], te[1], te[2]);
		v.multiplyScalar(-distance);

		panOffset.add(v);
	};
};

// pass in distance in world space to move up
this.panUp = function() {
	var v = new THREE.Vector3();

	return function panUp(distance) {
		var te = this.object.matrix.elements;

		// get Y column of matrix
		v.set(te[4], te[5], te[6]);
		v.multiplyScalar(distance);

		panOffset.add(v);
	};
};

// pass in x,y of change desired in pixel space,
// right and down are positive
this.pan = function(deltaX, deltaY, screenWidth, screenHeight) {
	if (scope.object instanceof THREE.PerspectiveCamera) {

		// perspective
		var position = scope.object.position;
		var offset = position.clone().sub(scope.target);
		var targetDistance = offset.length();

		// half of the fov is center to top of screen
		targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

		// we actually don't use screenWidth, since perspective camera is fixed to screen height
		scope.panLeft(2 * deltaX * targetDistance / screenHeight);
		scope.panUp(2 * deltaY * targetDistance / screenHeight);
	}
	else if (scope.object instanceof THREE.OrthographicCamera) {
		// orthographic
		scope.panLeft(deltaX * (scope.object.right - scope.object.left) / screenWidth);
		scope.panUp(deltaY * (scope.object.top - scope.object.bottom) / screenHeight);
	}
	else {
		// camera neither orthographic or perspective
		console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
	}
};