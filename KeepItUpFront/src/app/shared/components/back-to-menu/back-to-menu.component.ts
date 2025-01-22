import { Router } from '@angular/router';
import { LOCATIONS } from '../../constants';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-back-to-menu',
  standalone: true,
  imports: [],
  templateUrl: './back-to-menu.component.html',
  styleUrl: './back-to-menu.component.css',
})
export class BackToMenuComponent {
  @Input() navigationPath: string = '';

  constructor(private router: Router) {}

  goToPath() {
    if (this.navigationPath) {
      this.router.navigate([this.navigationPath]); // Navigate if a path is provided
    } 
  }
}
