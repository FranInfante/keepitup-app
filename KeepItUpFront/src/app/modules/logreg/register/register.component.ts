import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { LOCATIONS, TOAST_MSGS } from '../../../shared/constants';
import { User } from '../../../shared/interfaces/users';
import { ToastService } from '../../../shared/service/toast.service';
import { UserService } from './../../../shared/service/user.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { BackToMenuComponent } from '../../../shared/components/back-to-menu/back-to-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { VerifyCodeModalComponent } from '../../../shared/components/verify-code-modal/verify-code-modal.component';
import { LanguageService } from '../../../shared/service/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    NgIf,
    BackToMenuComponent,
    TranslateModule,
    VerifyCodeModalComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild(VerifyCodeModalComponent) verifyModal!: VerifyCodeModalComponent;

  userForm!: FormGroup;
  formvalid = false;
  subscriptions: SubscriptionLike[] = [];
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private languageService: LanguageService
  ) {
    this.languageService.initializeLanguage();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      const user: User = {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        email: this.userForm.value.email,
        usersInfo: this.userForm.value.usersInfo,
      };

      this.loadingService.setLoading(true);
      this.subscriptions.push(
        this.userService.createUser(user).subscribe({
          next: (response) => {
            this.toastService.showToast(TOAST_MSGS.emailsent, 'success');
            this.verifyModal.open();
          },
          error: (error: HttpErrorResponse) => {
            this.loadingService.setLoading(false);

            if (error.status === 409) {
              this.toastService.showToast(TOAST_MSGS.alreadyexists, 'danger');
            }
          },
          complete: () => {
            this.loadingService.setLoading(false);
          },
        })
      );
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onCodeVerified(): void {
    this.toastService.showToast(TOAST_MSGS.register, 'success');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
      },
    };
    this.router.navigate([LOCATIONS.login], navigationExtras);
    this.userForm.reset();
  }
}
