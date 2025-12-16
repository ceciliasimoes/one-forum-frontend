import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateComment } from '../models/comments';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/topics`;

  create(topicId: number, dto: CreateComment): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}/${topicId}/comments`,
      dto
    );
  }

  getAll(
    topicId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<any>(`${this.baseUrl}/${topicId}/comments`, {
      params,
    });
  }

  getOne(topicId: number, id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${topicId}/comments/${id}`);
  }

  update(
    topicId: number,
    id: number,
    dto: { content: string }
  ): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.baseUrl}/${topicId}/comments/${id}`,
      dto
    );
  }

  delete(topicId: number, id: number): Observable<{status: number}> {
    return this.http.delete(`${this.baseUrl}/${topicId}/comments/${id}`, {observe: 'response'});
  }
}
