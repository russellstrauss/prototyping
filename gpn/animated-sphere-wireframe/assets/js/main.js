var renderer, scene, camera, mesh;

function initaite() {
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
    var geometry = new THREE.SphereGeometry(100, 10, 7);
    var material = new THREE.MeshBasicMaterial({
        color: 0xccd7e1,
        wireframe: true, 
        wireframe_linewidth: 1000
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-100, 100, 0);
    scene.add(mesh);
    //mesh.position = new THREE.Vector3(0, 0, 100);
    var light = new THREE.SpotLight(0xFF0000);
    light.position.set(50, 50, 150);
    scene.add(light);

    renderer.render(scene, camera);
    canvas.addEventListener('mousemove', move);
}

function move(e) {

    mesh.rotation.x += 1;
    mesh.rotation.y -= 1;
    renderer.render(scene, camera);
}

$(document).ready(function(){ 
    initaite();
});