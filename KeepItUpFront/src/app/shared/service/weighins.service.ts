import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeighIn } from '../interfaces/weighin';
import { WEIGHIN_ROUTES } from '../routes/weighins-routes';

@Injectable({
  providedIn: 'root'
})
export class WeighInsService {
  

  constructor(private http: HttpClient) {}

  getWeighIns(userId: number): Observable<WeighIn[]> {
    return this.http.get<WeighIn[]>(WEIGHIN_ROUTES.list(userId));
  }

  addWeighIn(weighIn: WeighIn): Observable<WeighIn> {
    const token = localStorage.getItem('authToken'); // Retrieve JWT Token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    });
  
    return this.http.post<WeighIn>(WEIGHIN_ROUTES.create(), weighIn, { headers });
  }
  
  deleteWeighIn(weighInId: number): Observable<void> {
    const token = localStorage.getItem('authToken'); // Retrieve JWT Token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    });
  
    return this.http.delete<void>(WEIGHIN_ROUTES.delete(weighInId), { headers });
  }
  
  
}
