import * as THREE from 'three';
import { createCamera } from './camera.js';
import { createAssetInstance } from './assets.js';

export function createScene() {
  const gameWindow = document.getElementById('render-target');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  const renderer = new THREE.WebGLRenderer();
  const camera = createCamera(gameWindow);
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement);
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;
e
  let terrain = [[THREE.Mesh]];
  let buildings = [[THREE.Mesh]];

  let onObjectSelected = undefined;

  function initialize(city) {
    scene.clear();
    terrain = [];
    buildings = [];

    // Load terrain for each tile, initialize buildings array
    for (let x = 0; x < city.size; x++) {
      const column = [];
      for (let y = 0; y < city.size; y++) {
        const terrainId = city.data[x][y].terrainId;
        const mesh = createAssetInstance(terrainId, x, y);
        scene.add(mesh);
        column.push(mesh);
      }
      terrain.push(column);
      buildings.push([...Array(city.size)]);
    }

    setupLights();
  }

  function update(city) {
    for (let x = 0; x < city.size; x++) {
      for (let y = 0; y < city.size; y++) {
        updateTile(city.data[x][y]);
      }
    }
  }

  function updateTile(tile) {
    const { x, y } = tile;

    // If the player removes a building, remove it from the scene
    if (!tile.building && buildings[x][y]) {
      scene.remove(buildings[x][y]);
      buildings[x][y] = undefined;
    }
    // If the data model has changed, update the mesh
    else if (tile.building && tile.building.updated) {
      scene.remove(buildings[x][y]);
      buildings[x][y] = createAssetInstance(tile.building.id, x, y, tile.building);
      scene.add(buildings[x][y]);
    }
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3)
    ];

    lights[1].position.set(0, 1, 0);
    lights[2].position.set(1, 1, 0);
    lights[3].position.set(0, 1, 1);

    scene.add(...lights);
  }

  function draw() {
    renderer.render(scene, camera.camera);
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(event) {
    camera.onMouseDown(event);

    // Compute normalized mouse coordinates
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    // Update raycaster to have ray directed to where mouse was pointing
    raycaster.setFromCamera(mouse, camera.camera);

    // Find any scene objects intersected by the ray
    let intersections = raycaster.intersectObjects(scene.children, false);

    if (intersections.length > 0) {
      // Un-highlight the previously selected object
      if (selectedObject) selectedObject.material.emissive.setHex(0);

      // Highlight the new selected object
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);
      
      // Notify event handler of new selected object
      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject);
      }
    }
  }

  function onMouseUp(event) {
    camera.onMouseUp(event);
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);
  }

  return {
    onObjectSelected,
    initialize,
    update,
    updateTile,
    start,
    stop,
    onMouseDown,
    onMouseUp,
    onMouseMove
  }
}