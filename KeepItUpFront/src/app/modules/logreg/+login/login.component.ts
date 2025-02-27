import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LOCATIONS, MSG, TOAST_MSGS } from '../../../shared/constants';
import { UserService } from '../../../shared/service/user.service';
import { ToastService } from '../../../shared/service/toast.service';
import { NgIf } from '@angular/common';
import { LoadingService } from '../../../shared/service/loading.service';
import { BackToMenuComponent } from '../../../shared/components/back-to-menu/back-to-menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/service/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    BackToMenuComponent,
    TranslateModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginError: string | null = null;
  private subscription: Subscription = new Subscription();
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.languageService.initializeLanguage();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.route.queryParams.subscribe((params) => {
      const username = params['username'];
      const password = params['password'];
      if (username && password) {
        this.loginForm.patchValue({ identifier: username, password: password });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.showToast(TOAST_MSGS.fillallfields, 'danger');
      return;
    }
    this.loadingService.setLoading(true);
    const loginData = this.loginForm.value;

    this.subscription.add(
      this.userService
        .loginUser(loginData.identifier, loginData.password)
        .subscribe({
          next: (user) => {
            if (user) {
              this.userService.setUser(user);
              this.router.navigate([LOCATIONS.menu]);
              this.toastService.showToast(TOAST_MSGS.login, 'success');
            } else {
              this.loadingService.setLoading(false);
              this.loginError = MSG.failedCredentials;
              this.toastService.showToast(MSG.failedCredentials, 'danger');
            }
          },
          error: (error) => {
            console.error(MSG.loginerror, error);
            this.loadingService.setLoading(false);
            const errorMsg =
              error.message === MSG.failedCredentials
                ? MSG.failedCredentials
                : MSG.unknownLoginError;
            this.loginError = errorMsg;
            this.toastService.showToast(errorMsg, 'danger');
          },
          complete: () => {
            this.loadingService.setLoading(false);
          },
        })
    );
  }
}
