import { Component } from '@angular/core';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  bg: string = ASSET_URLS.backgroudnd;
  target: string = ASSET_URLS.target;
  tools: string = ASSET_URLS.tools;
  weight: string = ASSET_URLS.weight;
  logworkouts: string = ASSET_URLS.logworkouts;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;
}
