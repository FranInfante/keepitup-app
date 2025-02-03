import { Workout } from "./workout";

export interface NewPlan {
  name: string;
  userId: number;
  workouts: Workout[];
}
