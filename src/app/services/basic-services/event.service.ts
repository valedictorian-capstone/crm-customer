import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { EventVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<EventVM[]> => {
    return this.httpClient.get<EventVM[]>(`${environment.apiEndpont}${environment.api.basic.event.main}`);
  }
}
