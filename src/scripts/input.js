import { RefObject } from 'react';

/** 
 * Manages mouse and keyboard input
 */
export class InputManager {
  /**
   * Last mouse position
   * @type {x: number, y: number}
   */
  mouse = { x: 0, y: 0 };
  /**
   * True if left mouse button is currently down
   * @type {boolean}
   */
  isLeftMouseDown = false;
  /**
   * True if the middle mouse button is currently down
   * @type {boolean}
   */
  isMiddleMouseDown = false;
  /**
   * True if the right mouse button is currently down
   * @type {boolean}
   */
  isRightMouseDown = false;

  /**
   * @type {RefObject<HTMLDivElement>}
   */
  #gameWindowRef;

  /**
   * @constructor
   *    @param {RefObject<HTMLDivElement>} aGameWindowRef
   */
  constructor(aGameWindowRef) {
    this.#gameWindowRef = aGameWindowRef;
    this.#gameWindowRef.current.addEventListener('mousedown', this.#onMouseDown.bind(this), false);
    this.#gameWindowRef.current.addEventListener('mouseup', this.#onMouseUp.bind(this), false);
    this.#gameWindowRef.current.addEventListener('mousemove', this.#onMouseMove.bind(this), false);
    this.#gameWindowRef.current.addEventListener('contextmenu', (event) => event.preventDefault(), false);
  }

  /**
   * Event handler for `mousedown` event
   * @param {MouseEvent} event 
   */
  #onMouseDown(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = true;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = true;
    }
    if (event.button === 2) {
      this.isRightMouseDown = true;
    }
  }

  /**
   * Event handler for `mouseup` event
   * @param {MouseEvent} event 
   */
  #onMouseUp(event) {
    if (event.button === 0) {
      this.isLeftMouseDown = false;
    }
    if (event.button === 1) {
      this.isMiddleMouseDown = false;
    }
    if (event.button === 2) {
      this.isRightMouseDown = false;
    }
  }

  /**
   * Event handler for 'mousemove' event
   * @param {MouseEvent} event 
   */
  #onMouseMove(event) {
    this.isLeftMouseDown = (event.buttons & 1) != false;
    this.isRightMouseDown = (event.buttons & 2) != false;
    this.isMiddleMouseDown = (event.buttons & 4) != false;
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }
}