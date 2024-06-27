import { BuildingType } from './buildingType.js';
import { CommercialZone } from './zones/commercial.js';
import { ResidentialZone } from './zones/residential.js';
import { IndustrialZone } from './zones/industrial.js';
import { Road } from './transportation/road.js';
import { PowerPlant } from './power/powerPlant.js';
import { PowerLine } from './power/powerLine.js';

/**
 * Creates a new building object
 * @param {string} type The building type
 */
export function buildingConstructor(type) {
  switch (type) {
    case BuildingType.residential: 
      return ResidentialZone;
    case BuildingType.commercial: 
      return CommercialZone;
    case BuildingType.industrial: 
      return IndustrialZone;
    case BuildingType.road: 
      return Road;
    case BuildingType.powerPlant:
      return PowerPlant;
    case BuildingType.powerLine:
      return PowerLine;
    default:
      console.error(`${type} is not a recognized building type.`);
  }
  return    (ResidentialZone);
}