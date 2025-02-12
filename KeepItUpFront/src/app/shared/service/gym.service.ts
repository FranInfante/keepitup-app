import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GYM_ROUTES } from '../routes/gym-routes';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  constructor(private http: HttpClient) {}

  createGym(gym: { userId: number; name: string }): Observable<any> {
    return this.http.post(GYM_ROUTES.create(), gym);
  }

  getUserGyms(userId: number): Observable<any[]> {
    return this.http.get<any[]>(GYM_ROUTES.byUser(userId));
  }

  deleteGym(gymId: number): Observable<any> {
    return this.http.delete(GYM_ROUTES.delete(gymId));
  }
}
