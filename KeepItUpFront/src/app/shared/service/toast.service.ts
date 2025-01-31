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


  showToast(bodyKey: string, type: 'success' | 'danger' | 'info', extraText?: string, duration: number = 2000) {

    const translatedBody = this.translate.instant(bodyKey);
    const fullMessage = extraText ? `${translatedBody} ${extraText}` : translatedBody; 


    const newToast: Toast = {
      id: this.toastId++,
      show: false, 
      body: fullMessage,
      type,
    };
    this.toasts.push(newToast);
    this.toastState.next([...this.toasts]);
  
   
    setTimeout(() => {
      newToast.show = true;
      this.toastState.next([...this.toasts]);
    }, 10); 
  
    setTimeout(() => {
      newToast.show = false; 
      this.toastState.next([...this.toasts]);
  
      setTimeout(() => this.removeToast(newToast.id), 300); 
    }, duration);
  }

  removeToast(toastId: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== toastId);
    this.toastState.next([...this.toasts]);
  }
}
