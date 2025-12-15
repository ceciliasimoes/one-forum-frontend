import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { HomeTopicListQueryEntity, TopicListQueryEntity } from '../models/topic-query-entity.model';
import { HttpClient } from '@angular/common/http';
import { Topic } from '../models/topics';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicListService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly loggedUserId = this.authService.currentUser;
  private readonly apiUrl = environment.apiBaseUrl + "/topics";

  private readonly homeFiltersState = new BehaviorSubject<HomeTopicListQueryEntity>({});
  readonly homeFilters$ = this.homeFiltersState.asObservable();

  readonly homeReqResults$ = this.homeFilters$.pipe(
    debounceTime(300),
    switchMap(filters => {
      const queryParams = new URLSearchParams();

      queryParams.append("authorId", filters.mine ? this.loggedUserId()?.id.toString() || '' : '');
      queryParams.append("categoryId", filters.category?.toString() || "");
      queryParams.append("title", filters.search || "");
      queryParams.append("moreLiked", filters.moreLiked?.toString() || "");
      queryParams.append("page", filters.page?.toString() || "0");
      queryParams.append("size", filters.size?.toString() || "10");
      queryParams.append("sort", filters.moreLiked ? "" : filters.sort?.toString() || "createdAt,desc");

      return this.http.get<{
        content: Topic[];
        totalElements: number;
        totalPages: number;
        pageable: {
          pageNumber: number;
          pageSize: number;
        };
      }>(`${this.apiUrl}?${queryParams.toString()}`);
    }),
  );

  getCurrentHomeFilterCategoryId() {
    return this.homeFilters$.subscribe(data => data.category);
  }

  setHomeFilters(filters: HomeTopicListQueryEntity): void {
    if (filters.page == null) {
      filters.page = 0;
    }

    this.homeFiltersState.next({
      ...this.homeFiltersState.getValue(),
      ...filters
    });

    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  refreshHomeResults(): void {
    this.homeFiltersState.next(this.homeFiltersState.getValue());
  }

  fetchTopics(filters: TopicListQueryEntity) {
    const queryParams = new URLSearchParams();

    queryParams.append("authorId", filters.authorId ? filters.authorId.toString() || '' : '');
    queryParams.append("categoryId", filters.category?.toString() || "");
    queryParams.append("title", filters.search || "");
    queryParams.append("moreLiked", filters.moreLiked?.toString() || "");
    queryParams.append("page", filters.page?.toString() || "0");
    queryParams.append("size", filters.size?.toString() || "10");
    queryParams.append("sort", filters.moreLiked ? "" : filters.sort?.toString() || "createdAt,desc");

    return this.http.get<{
      content: Topic[];
      totalElements: number;
      totalPages: number;
      pageable: {
        pageNumber: number;
        pageSize: number;
      };
    }>(`${this.apiUrl}?${queryParams.toString()}`);
  }
}
