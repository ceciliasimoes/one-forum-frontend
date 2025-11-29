import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Topic } from '../../core/models/topics';
import { environment } from '../../../environments/environment';
import { TopicQueryEntity } from './model/topic-query-entity.model';
import { Pageable } from './model/pageable.model';
import { StatusFlag } from './model/status-flag.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  
  private authService = inject(AuthService)
  private httpClient: HttpClient;
  private apiUrl = environment.api + "/topics";
  private loggedUserId = this.authService.getUserId(); // TODO: change to retrieve data from AuthService

  authorFilter = signal<"all" | "user">("all");
  listSort = signal<"date" | "moreLiked">("date");
  categoryId = signal<number | null>(null);
  searchBarInput = signal<string>("");
  pageable = signal<Pageable>({
    page: 0,
    size: 10,
    sort: ["createdAt", "desc"]
  })

  topicQueryEntity = computed<TopicQueryEntity>(() => {
    return {
      authorId: this.authorFilter() === "user" ? this.loggedUserId : null,
      searchInput: this.searchBarInput(),
      categoryId: this.categoryId() != null ? this.categoryId() : null,
      moreLiked: this.listSort() === "moreLiked" ? true : false,
      pageable: this.pageable()
    }
  })

  responseStatusFlag = signal(StatusFlag.OK);

  topicListRes = signal<{list: Topic[], totalPages: number, totalElements: number, itensPerPage: number}>({
    list: [],
    totalPages: 0,
    totalElements: 0,
    itensPerPage: 10
  })
  
  topicList: WritableSignal<Topic[]> = signal([]);

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;

    effect(() => {
      this.getAllTopics(this.topicQueryEntity(), this.pageable())
        .subscribe({
          next: res => {
            if (res.body) {
              this.responseStatusFlag.set(StatusFlag.OK);
              this.topicListRes.set({
                list: res.body.content,
                totalPages: res.body.totalPages,
                totalElements: res.body.totalElements,
                itensPerPage: res.body.pageable.pageSize
              });
            }
          },
          error: err => {
            this.responseStatusFlag.set(StatusFlag.ERROR);
            this.topicListRes.set({
                list: err.body.content,
                totalPages: err.body.totalPages,
                totalElements: err.body.totalElements,
                itensPerPage: err.body.pageable.size
              });
          }
        })
    })
  }

  updateAuthorFilter(value: "all" | "user") {
    this.authorFilter.set(value);
  }
  updateListSort(value: "date" | "moreLiked") {
    this.listSort.set(value);
  }
  updateCategory(categoryId: number | null) {
    this.categoryId.set(categoryId);
  }
  updateSearchBarInput(value: string) {
    this.searchBarInput.set(value);
  }
  updatePageable(
    page: number = this.pageable().page,
    size: number = this.pageable().size
  ) {
    this.pageable.set({
      page: page,
      size: size,
      sort: this.pageable().sort
    })
  }

  getAllTopics(params: TopicQueryEntity, pageable: Pageable) {
    this.responseStatusFlag.set(StatusFlag.LOADING);
    
    let queryParams = new URLSearchParams();

    if (this.listSort() === "moreLiked") {
      pageable.sort = [];
    }
    else {
      pageable.sort = ["createdAt", "desc"]
    }

    queryParams.append("authorId", params.authorId ? params.authorId.toString() : "");
    queryParams.append("categoryId", params.categoryId ? params.categoryId.toString() : "");
    queryParams.append("title", params.searchInput);
    queryParams.append("moreLiked", params.moreLiked.toString());
    queryParams.append("page", pageable.page.toString())
    queryParams.append("size", pageable.size.toString())
    queryParams.append("sort", pageable.sort.toString())

    return this.httpClient
      .get<{
        content: Topic[],
        totalElements: number,
        totalPages: number,
        pageable: {
          pageSize: number
        }
      }>(`${this.apiUrl}?${queryParams.toString()}`, {observe: 'response'})
  }
}