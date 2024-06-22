import { Building } from '../building.js';
import { BuildingType } from '../buildingType.js';
import { WindowGlobal } from '../../../windowGlobal.js'

export class PowerPlant extends Building {

  /**
   * Available units of power (kW)
   */
  powerCapacity = 100;

  /**
   * Consumed units of power
   */
  powerConsumed = 0;

  /**
   * @type {WindowGlobal}
   */
  #window;

  /**
   * @constructor
   *    @param {WindowGlobal} aWindow
   */
  constructor(aWindow, x, y) {
    super(aWindow, x, y);
    this.#window = aWindow;
    this.type = BuildingType.powerPlant;
  }

  /**
   * Gets the amount of power available
   */
  get powerAvailable() {
    // Power plant must have road access in order to provide power
    if (this.roadAccess.value) {
      return this.powerCapacity - this.powerConsumed;
    } else {
      return 0;
    }
  }

  refreshView() {
    let mesh = this.#window.assetManager.getModel(this.type, this);
    this.setMesh(mesh);
  }

  /**
   * Returns an HTML representation of this object
   * @returns {string}
   */
  toHTML() {
    let html = super.toHTML();
    html += `
      <div class="info-heading">Power</div>
      <span class="info-label">Power Capacity (kW)</span>
      <span class="info-value">${this.powerCapacity}</span>
      <br>
      <span class="info-label">Power Consumed (kW)</span>
      <span class="info-value">${this.powerConsumed}</span>
      <br>
      <span class="info-label">Power Available (kW)</span>
      <span class="info-value">${this.powerAvailable}</span>
      <br>
    `;
    return html;
  }
}