import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateComment } from '../models/comments';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient) {
    this.baseUrl = `${environment.apiBaseUrl}/topics`;
  }

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

  delete(topicId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${topicId}/comments/${id}`);
  }
}
