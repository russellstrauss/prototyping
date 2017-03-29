
var renderer;
var scene;
var camera;
function init() {
	var canvas = document.getElementById('canvas');
	var width = $('#canvas').width();
	var height = $('#canvas').height();
	renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});
	renderer.setClearColor (0xffffff, 1);
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	camera.position.set(0, 0, 150);
	var geometry = new THREE.SphereGeometry(60, 10, 7);
	var material = new THREE.MeshBasicMaterial({
		color: 0xccd7e1,
		wireframe: true, 
		wireframe_linewidth: 1000
	});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(-100, 100, 0);
	scene.add(mesh);
	


	

	var light = new THREE.SpotLight(0xFF0000);
	light.position.set(50, 50, 150);
	scene.add(light);

	renderer.render(scene, camera);
	// add the output of the renderer to the html element
	document.body.appendChild(renderer.domElement);
	// call the render function
	render(geometry);
}
function render(geometry) {
	renderer.render(scene, camera);
	mesh.rotation.x += 0.0005;
	mesh.rotation.y += 0.0002;

	// update geometry with new rotations
	mesh.updateMatrix(); 
	mesh.geometry.applyMatrix( mesh.matrix );
	mesh.matrix.identity();
	mesh.geometry.verticesNeedUpdate = true;
	// normalize
	mesh.position.set( 0, 0, 0 );
	mesh.rotation.set( 0, 0, 0 );
	mesh.scale.set( 1, 1, 1 );


	var circles = [];
	for (var i = 0; i < geometry.vertices.length; i++)
	{
		var vertex = geometry.vertices[i];
		var radius = 5,
		segments = 40,
		lineMaterial = new THREE.LineBasicMaterial({ color: 0xccd7e1 }),
		circleGeometry = new THREE.CircleGeometry(radius, segments);
		circle = new THREE.Line(circleGeometry, lineMaterial);
		circles.push(circle);
		circle.position.x = vertex.x;
		circle.position.y = vertex.y;

		circleGeometry.vertices.shift(); // Remove center vertex
		scene.add(circle);
	}

	requestAnimationFrame(render);
}
// calls the init function when the window is done loading.
window.onload = init;