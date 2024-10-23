import { Injectable } from '@angular/core';

import { FIELD_RADIUS, INIT_MAP, TERRAIN_TYPES } from '../shared/const';
import { CellData, Coordinates } from '../shared/type';


@Injectable({
  providedIn: 'root',
})
export class StateService {
  private nextId = 0;
  private mapCells: Map<number, CellData> = new Map();
  private coordinateIndex: Map<number, Map<number, number>> = new Map();

  constructor() {
    this.initializeField(FIELD_RADIUS);
  }

  private initializeField(radius: number): void {
    const size = radius * 2 + 1;

    for (let y = 0; y < size; y++) {
      const skipStart = Math.max(0, radius - y);
      const skipEnd = Math.max(0, y - radius);

      for (let x = 0; x < size; x++) {
        if (x < skipStart || x >= size - skipEnd) continue;
        const coordinates = { x: x - radius, y: y - radius };
        const initCell = INIT_MAP.get(coordinates.x)?.get(coordinates.y);
        this.addCell(coordinates, { terrain: initCell?.terrain || TERRAIN_TYPES.Mountain });
      }
    }
  }


  private addCell(coordinates: Coordinates, data: Omit<CellData, 'coordinates'>): number {
    const id = this.nextId++;
    const cellData: CellData = {
      coordinates,
      ...data
    };
    this.mapCells.set(id, cellData);
    let rowMap = this.coordinateIndex.get(coordinates.y);

    if (!rowMap) {
      rowMap = new Map<number, number>();
      this.coordinateIndex.set(coordinates.y, rowMap);
    }

    rowMap.set(coordinates.x, id);
    return id;
  }

  public getCellByCoordinates(x: number, y: number): CellData | undefined {
    const rowMap = this.coordinateIndex.get(y);
    if (!rowMap) return undefined;
    const id = rowMap.get(x);
    if (id === undefined) return undefined;
    return this.mapCells.get(id);
  }

  public getAllCells(): CellData[] {
    return Array.from(this.mapCells.values());
  }

}
