import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../../shared/service/user.service';
import { ToastService } from '../../../../../shared/service/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { BackToMenuComponent } from '../../../../../shared/components/back-to-menu/back-to-menu.component';
import { LOCATIONS, TOAST_MSGS } from '../../../../../shared/constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, TranslateModule, BackToMenuComponent, ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitting: boolean = false;
  message: string | null = null;
  error: string | null = null;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  
    this.isSubmitting = true;
    this.message = null;
    this.error = null;
  
    const { email } = this.forgotPasswordForm.value;
  
    this.userService.requestPasswordReset(email).subscribe({
      next: () => {
        this.toastService.showToast(TOAST_MSGS.successcheckyouremail, 'success');
      },
      error: () => {
        this.toastService.showToast(TOAST_MSGS.failedresetlink, 'danger');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
    
    
  }
  
  
  
}
