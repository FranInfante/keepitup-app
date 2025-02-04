import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../../shared/service/user.service';
import { ToastService } from '../../../../../shared/service/toast.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LOCATIONS, TOAST_MSGS } from '../../../../../shared/constants';
import { BackToMenuComponent } from '../../../../../shared/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterLink,
    BackToMenuComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isSubmitting: boolean = false;
  message: string | null = null;
  error: string | null = null;
  token: string | null = null;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || this.token === null) {
      return;
    }

    const { password, confirmPassword } = this.resetPasswordForm.value;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.isSubmitting = true;
    this.message = null;
    this.error = null;

    this.userService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.toastService.showToast(
          TOAST_MSGS.successfulresetpassword,
          'success'
        );
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.showToast(TOAST_MSGS.failedreseting, 'danger');
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
