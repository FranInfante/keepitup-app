import { Injectable } from '@angular/core';
import { Workout } from '../interfaces/workout';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WORKOUT_ROUTES } from '../routes/workouts-routes';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  constructor(private http: HttpClient) {}

  getWorkouts(userId: number): Observable<Workout[]> {
    return this.http.get<Workout[]>(WORKOUT_ROUTES.list(userId));
  }

  addWorkout(workout: Workout): Observable<Workout> {
    return this.http.post<Workout>(WORKOUT_ROUTES.create(), workout);
  }

  deleteWorkout(workoutId: number): Observable<void> {
    return this.http.delete<void>(WORKOUT_ROUTES.delete(workoutId));
  }

  getUniqueWorkoutNames(userId: number): Observable<string[]> {
    return this.http.get<string[]>(WORKOUT_ROUTES.uniquenamesbyid(userId));
  }
}
