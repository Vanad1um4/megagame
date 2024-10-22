import { Injectable } from '@angular/core';

import { FIELD_RADIUS, INIT_MAP, TERRAIN_TYPES } from '../shared/const';
import { TerrainCell } from '../shared/type';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  public field: Map<[number, number], TerrainCell> = new Map();

  constructor() {
    this.field = this.generateInitialField(FIELD_RADIUS);
  }

  private generateInitialField(radius: number): Map<[number, number], TerrainCell> {
    const field = new Map<[number, number], TerrainCell>();
    const size = radius * 2 + 1;

    for (let y = 0; y < size; y++) {
      const skipStart = Math.max(0, radius - y);
      const skipEnd = Math.max(0, y - radius);

      for (let x = 0; x < size; x++) {
        if (x < skipStart) continue;
        if (x >= size - skipEnd) continue;

        const coordinates: [number, number] = [x - radius, y - radius];
        const initCell = INIT_MAP.get(coordinates);

        if (initCell) {
          field.set(coordinates, initCell);
        } else {
          field.set(coordinates, { terrain: TERRAIN_TYPES.Mountain });
        }
      }
    }

    return field;
  }

}
