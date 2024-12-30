import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interfaces/toast';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastState = new BehaviorSubject<Toast[]>([]);

  toastState$ = this.toastState.asObservable();
  private toastId = 0;

  constructor(private translate: TranslateService) {}


  showToast(bodyKey: string, type: 'success' | 'danger' | 'info', duration: number = 3000) {

    const translatedBody = this.translate.instant(bodyKey);

    const newToast: Toast = {
      id: this.toastId++,
      show: false, // Start with `false` for initial state
      body: translatedBody,
      type,
    };
    this.toasts.push(newToast);
    this.toastState.next([...this.toasts]);
  
    // Delay setting `show` to true for the enter transition
    setTimeout(() => {
      newToast.show = true;
      this.toastState.next([...this.toasts]);
    }, 10); // Slight delay to ensure the initial state is applied
  
    // Fade out and remove after duration
    setTimeout(() => {
      newToast.show = false; // Trigger exit transition
      this.toastState.next([...this.toasts]);
  
      setTimeout(() => this.removeToast(newToast.id), 300); // Match CSS duration
    }, duration);
  }

  removeToast(toastId: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    this.toastState.next([...this.toasts]);
  }
}
