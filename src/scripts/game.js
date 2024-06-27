import * as THREE from 'three';
import { AssetManager } from './assets/assetManager.js';
import { CameraManager } from './camera.js';
import { InputManager } from './input.js';
import { City } from './sim/city.js';
import { SimObject } from './sim/simObject.js';
import { GameUI } from './ui.js';
import { WindowGlobal } from './windowGlobal.js'
import { RefObject } from 'react';

/** 
 * Manager for the Three.js scene. Handles rendering of a `City` object
 */
export class Game {
  /**
   * @type {City}
   */
  city;
  /**
   * Object that currently hs focus
   * @type {SimObject | null}
   */
  focusedObject = null;
  /**
   * Class for managing user input
   * @type {InputManager}
   */
  inputManager;
  /**
   * Object that is currently selected
   * @type {SimObject | null}
   */
  selectedObject = null;

  /**
   * phantom window object for refactoring
   * @type {WindowGlobal} window
   */
  #window;

  /**
    * @type {RefObject<HTMLDivElement>} gameWindowRef
    */
  #gameWindowRef;
  
  /**
   * @constructor
   *    @param {City} city
   *    @param {WindowGlobal} aWindow
   *    @param {RefObject<HTMLDivElement>} aGameWindowRef
   */
  constructor(city, aWindow, aGameWindowRef) {
    this.city = city;
    this.#window = aWindow;
    this.#gameWindowRef = aGameWindowRef;

    this.#window.ui.showLoadingText();

    const gameWindow = aGameWindowRef.current;
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true
    });
    this.scene = new THREE.Scene();

    this.inputManager = new InputManager(this.#gameWindowRef);
    this.cameraManager = new CameraManager(this.#window);

    // Configure the renderer
    let viewSize = this.#window.ui.viewSize;
    this.renderer.setSize(viewSize.width, viewSize.height);

    if(true) {

    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Add the renderer to the DOM
    gameWindow.appendChild(this.renderer.domElement);

    // Variables for object selection
    this.raycaster = new THREE.Raycaster();

    /**
     * Global instance of the asset manager
     */
    this.#window.assetManager = new AssetManager(() => {
      this.#window.ui.hideLoadingText();

      this.city = new City(this.#window, 16);
      this.initialize(this.city);
      this.start();

      // setInterval(this.simulate.bind(this), 1000);
    });

    // window.addEventListener('resize', this.onResize.bind(this), false);
    }
    else
    {
      if(false)
      {
        // Code swiped from https://dev.to/omher/how-to-start-using-react-and-threejs-in-a-few-minutes-2h6g
        const gameWindow = aGameWindowRef.current;
        const viewSize = {width: parseInt(gameWindow.dataset.width ?? 0), height: parseInt(gameWindow.dataset.height ?? 0)};
  
        var camera = new THREE.PerspectiveCamera(75, viewSize.width / viewSize.height, 0.1, 1000);
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer();
  
        renderer.setSize(viewSize.width, viewSize.height);
      }
      var scene = this.scene;
      var renderer = this.renderer;
      var camera = new THREE.PerspectiveCamera(75, viewSize.width / viewSize.height, 0.1, 1000);

      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      aGameWindowRef.current?.appendChild( renderer.domElement );

      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      camera.position.z = 5;
      var animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
      this.#window.ui.hideLoadingText();
    }
  }

  /**
   * Initalizes the scene, clearing all existing assets
   * @param {City} city
   */
  initialize(city) {
    this.scene.clear();
    this.scene.add(city);
    this.#setupLights();
    this.#setupGrid(city);
  }

  /**
   * @param {City} city
   */
  #setupGrid(city) {
    // Add the grid
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      map: this.#window.assetManager.textures.grid,
      transparent: true,
      opacity: 0.2
    });
    gridMaterial.map.repeat = new THREE.Vector2(city.size, city.size);
    gridMaterial.map.wrapS = THREE.RepeatWrapping;
    gridMaterial.map.wrapT = THREE.RepeatWrapping;

    const grid = new THREE.Mesh(
      new THREE.BoxGeometry(city.size, 0.1, city.size),
      gridMaterial
    );
    grid.position.set(city.size / 2 - 0.5, -0.04, city.size / 2 - 0.5);
    this.scene.add(grid);
  }

  /**
   * Setup the lights for the scene
   */
  #setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 2)
    sun.position.set(-10, 20, 0);
    sun.castShadow = true;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 50;
    sun.shadow.normalBias = 0.01;
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }
  
  /**
   * Starts the renderer
   */
  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this));
  }

  /**
   * Stops the renderer
   */
  stop() {
    this.renderer.setAnimationLoop(null);
  }

  /**
   * Render the contents of the scene
   */
  draw() {
    this.city.draw();
    this.updateFocusedObject();

    if (this.focusedObject && this.inputManager.isLeftMouseDown) {
      this.useTool();
    }

    this.renderer.render(this.scene, this.cameraManager.camera);
  }

  /**
   * Moves the simulation forward by one step
   */
  simulate() {
    if (this.#window.ui.isPaused) return;

    // Update the city data model first, then update the scene
    this.city.simulate(1);

    this.#window.ui.updateTitleBar(this);
    this.#window.ui.updateInfoPanel(this.selectedObject);
  }

  /**
   * Uses the currently active tool
   */
  useTool() {
    const { x, y } = this.focusedObject;

    switch (this.#window.ui.activeToolId) {
      case 'select':
        this.updateSelectedObject();
        this.#window.ui.updateInfoPanel(this.selectedObject);
        break;
      case 'bulldoze':
        this.city.bulldoze(x, y);
        break;
      default:
        this.city.placeBuilding(x, y, this.#window.ui.activeToolId);
    }
  }

  /**
   * @param {string} aToolId
   */
  toolSelected(aToolId)
  {
    this.#window.ui.activeToolId = aToolId;
  }

  /**
   * Sets the currently selected object and highlights it
   */
  updateSelectedObject() {
    this.selectedObject?.setSelected(false);
    this.selectedObject = this.focusedObject;
    this.selectedObject?.setSelected(true);
  }

  /**
   * Sets the object that is currently highlighted
   */
  updateFocusedObject() {  
    this.focusedObject?.setFocused(false);
    const newObject = this.#raycast();
    if (newObject !== this.focusedObject) {
      this.focusedObject = newObject;
    }
    this.focusedObject?.setFocused(true);
  }

  /**
   * Gets the mesh currently under the the mouse cursor. If there is nothing under
   * the the mouse cursor, returns null
   * @param {MouseEvent} event Mouse event
   * @returns {THREE.Mesh | null}
   */
  #raycast() {
    var divBoundingRect = this.#gameWindowRef.current?.getBoundingClientRect();
    var coords = {
      x:  ((this.inputManager.mouse.x - divBoundingRect.x) / this.renderer.domElement.clientWidth) * 2 - 1,
      y: -((this.inputManager.mouse.y - divBoundingRect.y) / this.renderer.domElement.clientHeight) * 2 + 1
    };

    this.raycaster.setFromCamera(coords, this.cameraManager.camera);

    let intersections = this.raycaster.intersectObjects(this.city.root.children, true);
    if (intersections.length > 0) {
      // The SimObject attached to the mesh is stored in the user data
      const selectedObject = intersections[0].object.userData;
      return selectedObject;
    } else {
      return null;
    }
  }

  /**
   * Resizes the renderer to fit the current game window
   */
  onResize() {
    const viewSize = this.#window.ui.viewSize;

    this.cameraManager.resize(viewSize.width, viewSize.height);
    this.renderer.setSize(viewSize.width, viewSize.height);
  }
}
