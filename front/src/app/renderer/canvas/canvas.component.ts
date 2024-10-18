import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, fromEvent, map, Subject, takeUntil, throttleTime, withLatestFrom } from 'rxjs';

import { Application, Container, Graphics } from 'pixi.js';

import { StateService } from '../../logic/state.service';
import { BASE_PX_SIZE, COLORS, COLORS_GRAYSCALE, SCALE_LIMITS } from '../../shared/const';
import { getRandomEnumValue } from '../../shared/utils';

interface Point {
  x: number;
  y: number;
}

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
  private fieldCellsContainer!: Container;
  private resizeObserver!: ResizeObserver;

  private destroy$ = new Subject<void>();
  private globalOffset$ = new BehaviorSubject<Point>({ x: 0, y: 0 });
  private temporaryOffset$ = new BehaviorSubject<Point>({ x: 0, y: 0 });

  private isDragging = false;
  private lastMouseCoordinates: Point = { x: 0, y: 0 };

  constructor(
    private stateService: StateService,
    private ngZone: NgZone
  ) { }

  public async ngOnInit() {
    await this.initPixiApp();
    this.initGameObjects();
    this.setupPanning();
    this.setupZooming();
    this.startGameLoop();
  }

  public ngAfterViewInit() {
    this.setupResizeObserver();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private initGameObjects() {
    this.fieldCellsContainer = new Container();
    this.app.stage.addChild(this.fieldCellsContainer);
    this.drawField();
    this.updateGameObjectsPositions();
  }

  private setupPanning() {
    const canvas = this.canvasRef.nativeElement;

    fromEvent<MouseEvent>(canvas, 'mousedown')
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.onMouseDown.bind(this));

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(this.destroy$),
        map(e => ({ x: e.clientX, y: e.clientY })),
        withLatestFrom(this.temporaryOffset$)
      )
      .subscribe(([currentCoordinates, tempOffset]) => {
        if (this.isDragging) {
          const dx = currentCoordinates.x - this.lastMouseCoordinates.x;
          const dy = currentCoordinates.y - this.lastMouseCoordinates.y;
          this.temporaryOffset$.next({
            x: tempOffset.x + dx,
            y: tempOffset.y + dy
          });
          this.lastMouseCoordinates = currentCoordinates;
        }
      });

    fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.globalOffset$, this.temporaryOffset$)
      )
      .subscribe(([_, globalOffset, tempOffset]) => {
        this.isDragging = false;
        this.globalOffset$.next({
          x: globalOffset.x + tempOffset.x,
          y: globalOffset.y + tempOffset.y
        });
        this.temporaryOffset$.next({ x: 0, y: 0 });
      });
  }

  private setupZooming() {
    const canvas = this.canvasRef.nativeElement;

    fromEvent<WheelEvent>(canvas, 'wheel')
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(5)
      )
      .subscribe(this.onWheel.bind(this));
  }

  private onWheel(event: WheelEvent) {
    event.preventDefault();
    const scaleChange = event.deltaY > 0 ? -1 : 1;
    this.zoom(scaleChange, event.clientX, event.clientY);
  }

  private zoom(scaleChange: number, mouseX: number, mouseY: number) {
    const oldScale = this.stateService.scale;
    this.stateService.scale += scaleChange;
    this.stateService.scale = Math.max(SCALE_LIMITS.MIN, Math.min(SCALE_LIMITS.MAX, this.stateService.scale));

    const globalOffset = this.globalOffset$.getValue();
    const containerPos = {
      x: this.fieldCellsContainer.x,
      y: this.fieldCellsContainer.y
    };

    const mousePositionInContainer = {
      x: mouseX - containerPos.x,
      y: mouseY - containerPos.y
    };

    const newContainerPos = {
      x: mouseX - mousePositionInContainer.x * (this.stateService.scale / oldScale),
      y: mouseY - mousePositionInContainer.y * (this.stateService.scale / oldScale)
    };

    const newGlobalOffset = {
      x: newContainerPos.x - this.app.screen.width / 2,
      y: newContainerPos.y - this.app.screen.height / 2
    };

    this.globalOffset$.next(newGlobalOffset);


    this.drawField();
  }

  private onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.lastMouseCoordinates = { x: event.clientX, y: event.clientY };
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

  private startGameLoop() {
    this.ngZone.runOutsideAngular(() => {
      this.app.ticker.add(() => {
        const globalOffset = this.globalOffset$.getValue();
        const tempOffset = this.temporaryOffset$.getValue();
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;
        this.fieldCellsContainer.x = centerX + globalOffset.x + tempOffset.x;
        this.fieldCellsContainer.y = centerY + globalOffset.y + tempOffset.y;
      });
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
    return graphics;
  }

  private updateGameObjectsPositions() {
    if (this.fieldCellsContainer && this.app.screen) {
      const centerX = this.app.screen.width / 2;
      const centerY = this.app.screen.height / 2;
      const globalOffset = this.globalOffset$.getValue();
      this.fieldCellsContainer.x = centerX + globalOffset.x;
      this.fieldCellsContainer.y = centerY + globalOffset.y;
    }
  }

}
