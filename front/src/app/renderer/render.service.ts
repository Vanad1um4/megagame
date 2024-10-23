import { Injectable } from '@angular/core';

import { Graphics } from 'pixi.js';


@Injectable({
  providedIn: 'root',
})
export class RenderService {

  public scale: number = 6;

  constructor(
  ) {
  }

  public createHexagon(size: number, color: string): Graphics {
    const graphics = new Graphics();
    const points: number[] = [];

    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      const x = size * Math.sin(angle);
      const y = size * Math.cos(angle);
      points.push(x, y);
    }

    graphics.poly(points);
    graphics.fill(color);

    return graphics;
  }

}
