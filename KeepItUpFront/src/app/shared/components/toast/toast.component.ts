import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../interfaces/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class NgbdToastInline implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(toastId: number) {
    this.toastService.removeToast(toastId);
  }
}
