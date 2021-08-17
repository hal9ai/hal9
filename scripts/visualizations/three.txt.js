/**
  output: [ html ]
  params: [ x, y, z, category ]
  deps:
    - https://cdnjs.cloudflare.com/ajax/libs/three.js/r126/three.min.js
    - https://cdnjs.cloudflare.com/ajax/libs/d3/6.2.0/d3.min.js
    - https://threejs.org/examples/js/controls/OrbitControls.js
**/

// Create an empty scene
var scene = new THREE.Scene();
var width = html.offsetWidth;
var height = html.offsetHeight;

var camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setClearColor(hal9.isDark() ? "#212121" : "#FFF");
renderer.setSize(width, height);
html.appendChild( renderer.domElement );

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

var categories = {};
data.forEach(x => categories[x[category]] = true);

var createMaterial = function(color) {
  var material = new THREE.MeshLambertMaterial();
  material.color.setStyle(color);
  return material;
}

var materialScale =  d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, Object.keys(categories).length + 1).map(x => createMaterial(x)));

var cubes = []
var min = new THREE.Vector3(x ? data[0][x] : 0, y ? data[0][y] : 0, z ? data[0][z] : 0);
var max = new THREE.Vector3(min.x, min.y, min.z);

for (var i = 0; i < data.length; i++) {
  var material = materialScale(data[i][category]);
  var cube = new THREE.Mesh( geometry, material );

  cube.position.x = data[i][x] ? parseFloat(data[i][x]) : 0;
  cube.position.y = data[i][y] ? parseFloat(data[i][y]) : 0;
  cube.position.z = data[i][z] ? parseFloat(data[i][z]) : 0;

  min.x = cube.position.x <= min.x ? cube.position.x : min.x;
  min.y = cube.position.y <= min.y ? cube.position.y : min.y;
  min.z = cube.position.z <= min.z ? cube.position.z : min.z;

  max.x = cube.position.x >= max.x ? cube.position.x : max.x;
  max.y = cube.position.y >= max.y ? cube.position.y : max.y;
  max.z = cube.position.z >= max.z ? cube.position.z : max.z;

  cubes.push(cube);
  scene.add(cube);
}

var controls = new THREE.OrbitControls(camera, renderer.domElement);

// look at data
var vector = new THREE.Vector3(min.x + (max.x - min.x) / 2, min.y + (max.y - min.y) / 2, min.z + (max.z - min.z) / 2);
camera.position.x = vector.x;
camera.position.y = vector.y;
camera.position.z = vector.z - (Math.max(max.x - min.x, max.y - min.y));

controls.target.x = vector.x;
controls.target.y = vector.y;
controls.target.z = vector.z;

controls.update();

var ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff, 1, 10000);
light.position.set(vector.x - min.x, vector.y + max.y, -100 + vector.z);
scene.add( light );

// Render Loop
var render = function () {
  requestAnimationFrame(render);

  for (var i = 0; i < cubes.length; i++) {
    cubes[i].rotation.x += 0.005;
    cubes[i].rotation.y += 0.005;
  }

  controls.update();

  // Render the scene
  renderer.render(scene, camera);
};

render();

// Consider: http://bl.ocks.org/phil-pedruco/9852362
