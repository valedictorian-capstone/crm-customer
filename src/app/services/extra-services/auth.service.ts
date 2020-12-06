import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TokenVM, CustomerVM, LoginGM, DeviceVM, CustomerCM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly triggerValue$ = new Subject<CustomerVM>();
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly login = (data: LoginGM): Observable<TokenVM | { notExist: boolean }> => {
    return this.httpClient.post<TokenVM>(`${environment.apiEndpont}${environment.api.extra.auth.login}`, data);
  }
  public readonly register = (data: CustomerCM): Observable<TokenVM | { notExist: boolean }> => {
    return this.httpClient.post<TokenVM>(`${environment.apiEndpont}${environment.api.extra.auth.register}`, data);
  }
  public readonly auth = (data: DeviceVM): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}`, data);
  }
  public readonly updatePassword = (data: { password: string }): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}/password`, data);
  }
  public readonly updateProfile = (data: CustomerVM): Observable<CustomerVM> => {
    return this.httpClient.put<CustomerVM>(`${environment.apiEndpont}${environment.api.extra.auth.main}/profile`, data);
  }
}
