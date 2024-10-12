import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasComponent } from './renderer/canvas/canvas.component';
import { BottomMenuComponent } from './ui/components/menus/bottom/bottom-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CanvasComponent, BottomMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
