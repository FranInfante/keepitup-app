import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { LOCATIONS, TOAST_MSGS } from '../../../shared/constants'
import { User } from '../../../shared/interfaces/users';
import { ToastService } from '../../../shared/service/toast.service';
import { UserService } from './../../../shared/service/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  formvalid = false;
  subscriptions: SubscriptionLike[] = [];
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    })
  }

  createUser(): void {
    if (this.userForm.valid) {
      const user: User = {
        username: this.userForm.value.username,
        password: this.userForm.value.password,
        email: this.userForm.value.email,
        usersInfo: this.userForm.value.usersInfo
      };

      this.subscriptions.push(
        this.userService.createUser(user).subscribe({
          next: (response) => {
            this.toastService.showToast(TOAST_MSGS.register, 'success');
            const navigationExtras: NavigationExtras = {
              queryParams: {
                username: user.username,
                password: user.password
              }
            };
            this.router.navigate([LOCATIONS.login], navigationExtras);
            this.userForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 409) {
              this.toastService.showToast(error.error, 'danger');
            } else {
              this.toastService.showToast(TOAST_MSGS.errorregister, 'danger');
            }
          }
        })
      );
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
