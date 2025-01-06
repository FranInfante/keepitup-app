import { WorkoutExercise } from "./workoutexercise";

export interface Workout {
    id: number;
    userId?: number; 
    name: string;
    date: string;
    workoutExercises: WorkoutExercise[];
    
  }