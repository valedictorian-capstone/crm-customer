import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ProductVM } from '@view-models';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (): Observable<ProductVM[]> => {
    return this.httpClient.get<ProductVM[]>(`${environment.apiEndpont}${environment.api.basic.product.main}`);
  }
  public readonly findById = (id: string): Observable<ProductVM> => {
    return this.httpClient.get<ProductVM>(`${environment.apiEndpont}${environment.api.basic.product.getById}${id}`);
  }
}
