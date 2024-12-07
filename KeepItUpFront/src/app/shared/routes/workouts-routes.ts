import { environment } from "../../environments/environments";

export const WORKOUTS_API_URL = environment.endpointUrl + 'workouts';

export const BASE = environment.base;

export const WORKOUT_ROUTES = {
    list: (id: number) => `${WORKOUTS_API_URL}/${id}`,
    delete: (id: number) => `${WORKOUTS_API_URL}/${id}`,
    create: () => `${WORKOUTS_API_URL}`,
    uniquenamesbyid:(id: number) => `${WORKOUTS_API_URL}/unique-names/${id}`
  };