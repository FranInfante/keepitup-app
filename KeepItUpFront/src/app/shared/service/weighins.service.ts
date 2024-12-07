import { HttpClient } from '@angular/common/http';
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
    return this.http.post<WeighIn>(WEIGHIN_ROUTES.create(), weighIn);
  }

  deleteWeighIn(weighInId: number): Observable<void> {
    return this.http.delete<void>(WEIGHIN_ROUTES.delete(weighInId));
  }
  
}
