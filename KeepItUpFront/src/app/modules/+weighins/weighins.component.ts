import { Component, OnInit } from '@angular/core';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WeighIn } from '../../shared/interfaces/weighin';
import { WeighInsService } from '../../shared/service/weighins.service';
import { User } from '../../shared/interfaces/users';
import { SubscriptionLike } from 'rxjs';
import { UserService } from '../../shared/service/user.service';
import { LoadingService } from '../../shared/service/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-weighins',
  standalone: true,
  imports: [BackToMenuComponent, CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './weighins.component.html',
  styleUrl: './weighins.component.css',
})
export class WeighInsComponent implements OnInit {
  weightForm!: FormGroup;
  previousLogs: WeighIn[] = [];
  totalWeightChange: string = '0.0 kg';
  userId: number = 0;
  user: User | null = null;
  subscriptions: SubscriptionLike[] = [];
  showForm: boolean = false;
  showDeleteModal: boolean = false;
  logToDeleteId?: number;

  constructor(
    private fb: FormBuilder,
    private weighInsService: WeighInsService,
    private userService: UserService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.initializeForm();
    this.subscriptions.push(
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          if (user && user.id) {
            this.loadingService.setLoading(true);
            this.userId = user.id;
            this.loadLogs();
          }
        },
        error: () => {
          console.error('Failed to fetch current user');
          this.loadingService.setLoading(false);
        },
      })
    );
  }

  initializeForm(): void {
    this.weightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1)]],
      date: [formatDate(new Date(), 'yyyy-MM-dd', 'en')],
    });
  }

  logWeight(): void {
    if (this.weightForm.valid) {
      const newLog: WeighIn = {
        ...this.weightForm.value,
        userId: this.userId,
      };
      this.loadingService.setLoading(true);
      this.weighInsService.addWeighIn(newLog).subscribe({
        next: (loggedWeighIn) => {
          this.showForm = !this.showForm;
          this.previousLogs.push(loggedWeighIn);
          this.previousLogs.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.calculateWeightChange();
          this.weightForm.reset({
            weight: '',
            date: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
          });
        },
        error: (error) => {
          console.error('Error logging weight:', error);
        },
        complete: () => {
          this.loadingService.setLoading(false);
        },
      });
    }
  }

  loadLogs(): void {
    this.loadingService.setLoading(true);
    this.weighInsService.getWeighIns(this.userId).subscribe({
      next: (logs) => {
        this.previousLogs = logs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.calculateWeightChange();
      },
      error: (error) => {
        console.error('Error fetching logs:', error);
      },
      complete: () => {
        this.loadingService.setLoading(false);
      },
    });
  }

  calculateWeightChange(): void {
    if (this.previousLogs.length > 1) {
      const initialWeight = this.previousLogs[0].weight;
      const latestWeight =
        this.previousLogs[this.previousLogs.length - 1].weight;
      const change = initialWeight - latestWeight;
      this.totalWeightChange = `${change > 0 ? '+' : ''}${change.toFixed(
        1
      )} kg`;
    } else {
      this.totalWeightChange = '0.0 kg';
    }
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  showDeleteConfirmation(id?: number): void {
    if (id === undefined) {
      console.error('Invalid log id:', id);
      return;
    }
    this.logToDeleteId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.logToDeleteId = undefined;
  }

  confirmDelete(): void {
    if (this.logToDeleteId === undefined) {
      console.error('No log selected for deletion');
      return;
    }
    this.loadingService.setLoading(true);
    this.weighInsService.deleteWeighIn(this.logToDeleteId).subscribe({
      next: () => {
        this.previousLogs = this.previousLogs.filter(
          (log) => log.id !== this.logToDeleteId
        );
        this.calculateWeightChange();
        this.cancelDelete();
      },
      error: (error) => {
        console.error('Error deleting log:', error);
      },
      complete: () => {
        this.loadingService.setLoading(false);
      },
    });
  }
}
