import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GYM_ROUTES } from '../routes/gym-routes';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createGym(gym: { userId: number; name: string }): Observable<any> {
    return this.http.post(GYM_ROUTES.create(), gym, { headers: this.getAuthHeaders() });
  }

  getUserGyms(userId: number): Observable<any[]> {
    return this.http.get<any[]>(GYM_ROUTES.byUser(userId), { headers: this.getAuthHeaders() });
  }

  deleteGym(gymId: number): Observable<any> {
    return this.http.delete(GYM_ROUTES.delete(gymId), { headers: this.getAuthHeaders() });
  }
}
