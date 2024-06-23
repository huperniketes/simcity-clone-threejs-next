
import {RefObject} from 'react';

const playIconUrl = '/icons/play-color.png';
const pauseIconUrl = '/icons/pause-color.png';

const fixedRenderViewSize = false;

export class GameUI {
  /**
   * Currently selected tool
   * @type {string}
   */
  activeToolId = 'select';
  /**
   * @type {HTMLElement | null }
   */
  selectedControl = document.getElementById('button-select');
  /**
   * True if the game is currently paused
   * @type {boolean}
   */
  isPaused = false;

  /**
   * @type {RefObject<HTMLDivElement>}
   */
  gameWindowRef;

  /**
   * @constructor
   *   @param {RefObject<HTMLDivElement>} aGameWindow
   */
  constructor(aGameWindow)
  {
    this.gameWindowRef = aGameWindow;
  }

  get gameWindow() {
    return document.getElementById('render-target');
  }

  showLoadingText() {
    document.getElementById('loading').style.visibility = 'visible';
  }

  hideLoadingText() {
    document.getElementById('loading').style.visibility = 'hidden';
  }
  
  /**
   * 
   * @param {*} event 
   */
  onToolSelected(event) {
    // Deselect previously selected button and selected this one
    if (this.selectedControl) {
      this.selectedControl.classList.remove('selected');
    }
    this.selectedControl = event.target;
    this.selectedControl.classList.add('selected');

    this.activeToolId = this.selectedControl.getAttribute('data-type');
  }

  /**
   * Toggles the pause state of the game
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      document.getElementById('pause-button-icon').src = playIconUrl;
      document.getElementById('paused-text').style.visibility = 'visible';
    } else {
      document.getElementById('pause-button-icon').src = pauseIconUrl;
      document.getElementById('paused-text').style.visibility = 'hidden';
    }
  }

  /**
   * Updates the values in the title bar
   * @param {Game} game 
   */
  updateTitleBar(game) {
    document.getElementById('city-name').innerHTML = game.city.name;
    document.getElementById('population-counter').innerHTML = game.city.population;

    const date = new Date('1/1/2023');
    date.setDate(date.getDate() + game.city.simTime);
    document.getElementById('sim-time').innerHTML = date.toLocaleDateString();
  }

  /**
   * Updates the info panel with the information in the object
   * @param {SimObject} object 
   */
  updateInfoPanel(object) {
    const infoElement = document.getElementById('info-panel')
    if (object) {
      infoElement.style.visibility = 'visible';
      infoElement.innerHTML = object.toHTML();
    } else {
      infoElement.style.visibility = 'hidden';
      infoElement.innerHTML = '';
    }
  }

  /**
   * @typedef {Object} ViewSize
   * @property {number} width
   * @property {number} height
   */

  /**
   * @type {ViewSize}
   */
  get viewSize() {
    let viewSize;

    if(fixedRenderViewSize)
      viewSize = {width: this.gameWindowRef.current.clientWidth, height: this.gameWindowRef.current.clientHeight};
    else
      viewSize = {width: this.gameWindowRef.current.clientWidth, height: window.innerHeight};
    return  (viewSize);
  }

  /**
   * @type {number}
   */
  get aspect() {
    let viewSize = this.viewSize;

    return  (viewSize.width / viewSize.height);
  }
}
