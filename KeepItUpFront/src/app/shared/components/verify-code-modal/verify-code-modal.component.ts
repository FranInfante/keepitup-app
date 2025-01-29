import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from '../lang-modal/lang-modal.component';
import { LanguageService } from '../../service/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-code-modal',
  standalone: true,
  imports: [TranslateModule,CommonModule, ReactiveFormsModule],
  templateUrl: './verify-code-modal.component.html',
  styleUrl: './verify-code-modal.component.css',
})
export class VerifyCodeModalComponent {
  @Input() email!: string;
  @Output() codeVerified = new EventEmitter<void>();
  verifyForm: FormGroup;
  errorMessage: string = '';
  isOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  verifyCode() {
    if (this.verifyForm.valid) {
      const { code } = this.verifyForm.value;
      this.userService.verifyCode({ email: this.email, code }).subscribe({
        next: () => {
          this.codeVerified.emit();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Invalid code or email. Please try again.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        },
      });
    }
  }

  open() {
    this.isOpen = true; // Show the modal
  }

  close() {
    this.isOpen = false; // Hide the modal
  }
}
