import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Application, Graphics } from 'pixi.js';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private app!: Application;
  private resizeObserver!: ResizeObserver;
  private hexagon!: Graphics;

  async ngOnInit() {
    await this.initPixiApp();
    this.createGameObjects();
    this.startGameLoop();
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.onWindowResize);
  }

  private async initPixiApp() {
    this.app = new Application();
    await this.app.init({
      canvas: this.canvasRef.nativeElement,
      resizeTo: this.canvasRef.nativeElement,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      backgroundColor: 0xAAAAAA
    });
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvasRef.nativeElement);
    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    this.onResize();
  };

  private onResize() {
    if (this.app && this.app.renderer) {
      const parent = this.canvasRef.nativeElement.parentElement;
      if (parent) {
        this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
      }
      this.updateGameObjectsPositions();
    }
  }

  private createGameObjects() {
    const graphics = new Graphics();
    this.hexagon = this.createHexagon(graphics, 100, 0x00FF00);
    this.app.stage.addChild(graphics);
    this.updateGameObjectsPositions();
  }

  private createHexagon(graphics: Graphics, size: number, color: number): Graphics {
    const points: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      points.push(x, y);
    }
    graphics.poly(points);
    graphics.fill(color);
    graphics.stroke({ width: 2, color: 0xFFFFFF });

    return graphics;
  }

  private startGameLoop() {
    this.app.ticker.add(() => {
      // Здесь можно добавить анимацию или другую логику, выполняемую каждый кадр
    });
  }

  private updateGameObjectsPositions() {
    if (this.hexagon && this.app.screen) {
      this.hexagon.x = this.app.screen.width / 2;
      this.hexagon.y = this.app.screen.height / 2;
    }
  }
}
