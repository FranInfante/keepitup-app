import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plan } from '../../../../shared/interfaces/plan';
import { Workout } from '../../../../shared/interfaces/workout';
import { PlanService } from '../../../../shared/service/plan.service';

@Component({
  selector: 'app-plan-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './plan-header.component.html',
  styleUrls: ['./plan-header.component.css']
})
export class PlanHeaderComponent {
  @Input() activePlan!: Plan;
  @Input() threeDotsIcon!: string;
  @Input() workouts: Workout[] = [];
  @Output() editModeToggle = new EventEmitter<void>();
  @Output() planDelete = new EventEmitter<void>();
  @Output() planNameUpdated = new EventEmitter<Plan>();

  maxLen = 20;
  specialKeys = ['Backspace', 'Shift', 'Control', 'Alt', 'Delete'];
  navigationalKeys = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
  isDropdownOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  constructor(private planService: PlanService) {}

  toggleEditMode(): void {
    this.editModeToggle.emit();
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
  }
  
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  deletePlan(): void {
    this.planDelete.emit();
  }

  onWorkoutsUpdated(updatedWorkouts: Workout[]): void {
    this.workouts = updatedWorkouts;
  }

  // Function to handle updating the plan name
  updatePlanName(): void {
    const inputElement = document.querySelector('h3') as HTMLElement;
    const newName = inputElement.innerText.trim();

    if (!newName) {
      inputElement.innerText = this.activePlan.name;
      return;
    }

    if (newName !== this.activePlan.name) {
      this.planService.updatePlanName(this.activePlan.id, newName).subscribe({
        next: (updatedPlan) => {
          this.planNameUpdated.emit(updatedPlan);
          this.activePlan.name = updatedPlan.name; 
        }
      });
    }
  }

  onKeyDown(event: KeyboardEvent): boolean {
    const input = event.target as HTMLElement;
    const len = input.innerText.trim().length;
    let hasSelection = false;
    const selection = window.getSelection();
    const key = event.key;

    const isSpecial = this.specialKeys.includes(key);
    const isNavigational = this.navigationalKeys.includes(key);
    
    if (selection) {
      hasSelection = !!selection.toString();
    }

    // Handle Enter key press
    if (key === 'Enter') {
      event.preventDefault(); 
      this.updatePlanName();
      input.blur();
      return false;
    }

    if (len >= this.maxLen && !hasSelection) {
      event.preventDefault();
      return false;
    }

    return true;
  }
}