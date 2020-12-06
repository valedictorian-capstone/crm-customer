import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CommentCM, CommentVM } from '@view-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(protected readonly httpClient: HttpClient) { }

  public readonly findAll = (id: string): Observable<CommentVM[]> => {
    return this.httpClient.get<CommentVM[]>(`${environment.apiEndpont}${environment.api.basic.comment.getById}product/${id}`);
  }
  public readonly findById = (id: string): Observable<CommentVM> => {
    return this.httpClient.get<CommentVM>(`${environment.apiEndpont}${environment.api.basic.comment.getById}${id}`);
  }
  public readonly insert = (data: CommentCM): Observable<CommentVM> => {
    return this.httpClient.post<CommentVM>(`${environment.apiEndpont}${environment.api.basic.comment.main}`, data);
  }

}
