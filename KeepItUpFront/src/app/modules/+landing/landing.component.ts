import { Component } from '@angular/core';
import { ASSET_URLS } from '../../shared/constants';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  
  bg: string = ASSET_URLS.backgroudnd;
  target: string = ASSET_URLS.target;
  tools: string = ASSET_URLS.tools;


}
