import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic, TopicCreateRequest, TopicEditRequest } from '../models/topics';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/topics`;

  getTopics(page = 0, size = 10): Observable<{ content: Topic[] }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<{ content: Topic[] }>(this.apiUrl, { params });
  }

  getTopicById(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/${id}`);
  }

  getTopicsByUser(userId: number, page = 0, size = 10): Observable<{ content: Topic[] }> {
    const params = { page: page.toString(), size: size.toString() };
    return this.http.get<{ content: Topic[] }>(`${this.apiUrl}/user/${userId}`, { params });
  }

  getAllFiltered(params: {
    authorId?: number;
    moreLiked?: boolean;
    page?: number;
    size?: number;
  }): Observable<{ content: Topic[] }> {
    const queryParams: Record<string, string> = {
      page: String(params.page ?? 0),
      size: String(params.size ?? 10),
    };

    if (params.authorId !== undefined) {
      queryParams['authorId'] = String(params.authorId);
    }
    if (params.moreLiked !== undefined) {
      queryParams['moreLiked'] = String(params.moreLiked);
    }

    return this.http.get<{ content: Topic[] }>(`${this.apiUrl}/filter`, { params: queryParams });
  }

  toggleLike(id: number): Observable<{ topicId: number; likeCount: number }> {
    return this.http.get<{ topicId: number; likeCount: number }>(`${this.apiUrl}/${id}/like`);
  }

  createTopic(data: TopicCreateRequest): Observable<Topic> {
    return this.http.post<Topic>(this.apiUrl, data);
  }

  editTopic(id: number, data: TopicEditRequest): Observable<Topic> {
    return this.http.put<Topic>(`${this.apiUrl}/${id}`, data);
  }

  deleteTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
