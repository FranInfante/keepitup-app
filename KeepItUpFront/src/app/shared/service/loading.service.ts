import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})  
export class LoadingService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  setLoading(isLoading: boolean): void {
    setTimeout(() => {
      this._isLoading.next(isLoading);
    });
  }
}