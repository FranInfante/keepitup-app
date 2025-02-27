import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WORKOUT_LOG_ROUTES } from '../routes/workout-log-routes';

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogService {
  constructor(private http: HttpClient) {}

  getAllWorkoutLogs(): Observable<any[]> {
    return this.http.get<any[]>(WORKOUT_LOG_ROUTES.list());
  }

  createWorkoutLog(workoutLog: any): Observable<any> {
    return this.http.post<any>(WORKOUT_LOG_ROUTES.create(), workoutLog);
  }

  updateWorkoutLog(workoutLogId: number, workoutLog: any): Observable<any> {
    return this.http.put<any>(
      WORKOUT_LOG_ROUTES.update(workoutLogId),
      workoutLog
    );
  }

  deleteWorkoutLog(workoutLogId: number): Observable<void> {
    return this.http.delete<void>(WORKOUT_LOG_ROUTES.delete(workoutLogId));
  }

  getWorkoutLogByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(WORKOUT_LOG_ROUTES.byUser(userId));
  }

  getWorkoutLogById(workoutLogId: number): Observable<any> {
    return this.http.get<any>(WORKOUT_LOG_ROUTES.getById(workoutLogId));
  }

  addWorkoutLogExercise(workoutLogExercise: any): Observable<any> {
    return this.http.post<any>(
      WORKOUT_LOG_ROUTES.createExercise(),
      workoutLogExercise
    );
  }

  updateWorkoutLogExercise(
    exerciseId: number,
    workoutLogExercise: any
  ): Observable<any> {
    return this.http.put<any>(
      WORKOUT_LOG_ROUTES.updateExercise(exerciseId),
      workoutLogExercise
    );
  }

  deleteWorkoutLogExercise(
    workoutLogId: number,
    exerciseId: number
  ): Observable<void> {
    return this.http.delete<void>(
      WORKOUT_LOG_ROUTES.deleteExercise(workoutLogId, exerciseId)
    );
  }

  getWorkoutLogByUserIdAndIsEditing(userId: number, workoutId: number, isEditing: boolean, gymId?: number): Observable<any> {
    const requestBody: any = { userId, workoutId, isEditing };
    if (gymId !== undefined) {
      requestBody.gymId = gymId;
    }
    
    return this.http.post<any>(
      WORKOUT_LOG_ROUTES.findbyuserandisediting(),
      requestBody
    );
  }

  getExerciseById(exerciseId: number): Observable<any> {
    return this.http.get<any>(WORKOUT_LOG_ROUTES.exerciseById(exerciseId));
  }

  deleteWorkoutLogSet(
    workoutLogId: number,
    exerciseId: number,
    setNumber: number
  ): Observable<void> {
    return this.http.delete<void>(
      WORKOUT_LOG_ROUTES.deleteSet(workoutLogId, exerciseId, setNumber)
    );
  }

  updateWorkoutExerciseOrder(
    workoutLogId: number,
    exercises: { id: number; exerciseOrder: number }[]
  ): Observable<void> {
    return this.http.patch<void>(
      WORKOUT_LOG_ROUTES.reorderWorkoutLogExercises(workoutLogId),
      exercises
    );
  }

  getLastCompletedWorkoutLog(
    userId: number,
    workoutId: number,
    gymId: number | null
  ): Observable<any> {
    return this.http.get<void>(
      WORKOUT_LOG_ROUTES.getLastCompleted(userId, workoutId, gymId)
    );
  }

  updateGymId(workoutLogId: number, gymId: number): Observable<void> {
    return this.http.patch<void>(
      WORKOUT_LOG_ROUTES.updateGymId(workoutLogId),
      gymId,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
