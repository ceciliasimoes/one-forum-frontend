import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Topic } from '../../core/models/topics';
import { environment } from '../../../environments/environment';
import { TopicQueryEntity } from './model/topic-query-entity.model';
import { Pageable } from './model/pageable.model';
import { StatusFlag } from './model/status-flag.model';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, shareReplay, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  getCurrentFilterCategoryId() {
    return this.filters$.subscribe(data => data.category)
  }
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private httpClient: HttpClient;
  private apiUrl = environment.apiBaseUrl + "/topics";
  private loggedUserId = computed(() => this.authService.currentUser()?.id); // TODO: change to retrieve data from AuthService

  responseStatusFlag = signal(StatusFlag.OK);

  private filtersSubject = new BehaviorSubject<TopicQueryEntity>({});
  filters$ = this.filtersSubject.asObservable();

  reqResults$ = this.filters$.pipe(
    debounceTime(300),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    switchMap(filters => {
      this.responseStatusFlag.set(StatusFlag.LOADING);
      
      let queryParams = new URLSearchParams();

      queryParams.append("authorId", filters.mine ? this.loggedUserId()?.toString() || '' : '');
      queryParams.append("categoryId", filters.category?.toString() || "");
      queryParams.append("title", filters.search || "");
      queryParams.append("moreLiked", filters.moreLiked?.toString() || "");
      queryParams.append("page", filters.page?.toString() || "0");
      queryParams.append("size", filters.size?.toString() || "10");
      queryParams.append("sort", filters.moreLiked ? "" : filters.sort?.toString() || "createdAt,desc");

      return this.httpClient
        .get<{
          content: Topic[],
          totalElements: number,
          totalPages: number,
          pageable: {
            pageNumber: number,
            pageSize: number
          }
        }>(`${this.apiUrl}?${queryParams.toString()}`)
    }),
    shareReplay(1)
  )

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;

    this.route.queryParams.subscribe(params => {
      this.filtersSubject.next({
        search: params['search'] || '',
        category: +params['category'] || undefined,
        moreLiked: params['moreLiked'] === 'true',
        mine: params['mine'] === 'true',
        page: +params['page'] || 0,
        size: +params['size'] || 10,
        sort: params['sort'] || 'createdAt,desc'
      })
    })
  }

  setFilters(filters: TopicQueryEntity) {
    if (filters.page == null) {
      filters.page = 0;
    }

    this.router.navigate([], {
      queryParams: filters,
      queryParamsHandling: "merge",
      replaceUrl: true,
    })
  }

}