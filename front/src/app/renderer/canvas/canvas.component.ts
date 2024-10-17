import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Application, Graphics, Container } from 'pixi.js';

import { StateService } from '../../logic/state.service';
import { BASE_PX_SIZE, COLORS, COLORS_GRAYSCALE } from '../../shared/const';
import { getRandomEnumValue } from '../../shared/utils';

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
  private fieldCellsContainer!: Container;

  constructor(
    private stateService: StateService,
  ) {
  }

  public async ngOnInit() {
    await this.initPixiApp();
    this.initGameObjects();
    this.startGameLoop();
  }

  public ngAfterViewInit() {
    this.setupResizeObserver();
  }

  public ngOnDestroy() {
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
      backgroundColor: COLORS_GRAYSCALE.Gray8,
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

  private initGameObjects() {
    this.fieldCellsContainer = new Container();
    this.app.stage.addChild(this.fieldCellsContainer);
    this.drawField();
    this.updateGameObjectsPositions();
  }

  private drawField() {
    this.fieldCellsContainer.removeChildren();
    const hexSize = BASE_PX_SIZE ** this.stateService.scale;
    const horizontalSpacing = hexSize * Math.sqrt(3);
    const verticalSpacing = hexSize * 1.5;

    this.stateService.field.forEach((cellData, [x, y]) => {
      const hexagon = this.createHexagon(hexSize, cellData.color);
      hexagon.x = x * horizontalSpacing + y * horizontalSpacing / 2;
      hexagon.y = y * verticalSpacing;
      this.fieldCellsContainer.addChild(hexagon);
    });
  }

  private createHexagon(size: number, color: string): Graphics {
    const graphics = new Graphics();
    const points: number[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 2 * Math.PI) / 6;
      const x = size * Math.sin(angle);
      const y = size * Math.cos(angle);
      points.push(x, y);
    }
    graphics.poly(points);
    graphics.fill(getRandomEnumValue(COLORS));
    // graphics.stroke({ width: 2, color: getRandomEnumValue(COLORS) }); // Добавляем обводку

    return graphics;
  }

  private startGameLoop() {
    this.app.ticker.add(() => {
      console.log('tick');
    });
  }

  private updateGameObjectsPositions() {
    if (this.fieldCellsContainer && this.app.screen) {
      this.fieldCellsContainer.x = this.app.screen.width / 2;
      this.fieldCellsContainer.y = this.app.screen.height / 2;

      // Масштабирование поля
      // const scale = this.stateService.scale / 100; // Предполагаем, что scale в StateService - это процент
      // this.hexContainer.scale.set(scale);
    }
  }
}
