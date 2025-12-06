import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, TopicCreateRequest, TopicEditRequest, UpdateTopicRequest } from '../models/topics';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private http: HttpClient) {}

  private api = environment.apiBaseUrl + '/topics';

  getTopics(page = 0, size = 10): Observable<{ content: Topic[] }> {
    return this.http.get<{ content: Topic[] }>(`${this.api}?page=${page}&size=${size}`);
  }

  getTopicById(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.api}/${id}`);
  }

  createTopic(data: TopicCreateRequest): Observable<Topic> {
    return this.http.post<Topic>(this.api, data);
  }

  editTopic(id: number, data: TopicEditRequest): Observable<Topic> {
    return this.http.put<Topic>(`${this.api}/${id}`, data);
  }

  updateTopic(id: number, dto: UpdateTopicRequest): Observable<Topic> {
    return this.http.put<Topic>(`${this.api}/${id}/update`, dto);
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  toggleLike(id: number): Observable<void> {
    return this.http.post<void>(`${this.api}/${id}/toggle-like`, {});
  }

  getTopicsByUser(userId: number, page = 0, size = 10): Observable<{ content: Topic[] }> {
    return this.http.get<{ content: Topic[] }>(
      `${this.api}/user/${userId}?page=${page}&size=${size}`
    );
  }

  getAllFiltered(params: {
    authorId?: number;
    moreLiked?: boolean;
    page?: number;
    size?: number;
  }): Observable<{ content: Topic[] }> {
    const query = new URLSearchParams();

    if (params.authorId !== undefined) query.append('authorId', String(params.authorId));
    if (params.moreLiked !== undefined) query.append('moreLiked', String(params.moreLiked));

    query.append('page', String(params.page ?? 0));
    query.append('size', String(params.size ?? 10));

    return this.http.get<{ content: Topic[] }>(`${this.api}/filter?${query.toString()}`);
  }
}
