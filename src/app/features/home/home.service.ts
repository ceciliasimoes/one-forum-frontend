import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Topic } from '../../core/models/topics';
import { environment } from '../../../environments/environment';
import { TopicQueryEntity } from './model/topic-query-entity.model';
import { Pageable } from './model/pageable.model';
import { Category } from './model/category.model';
import { StatusFlag } from './model/status-flag.model';
import { BehaviorSubject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  
  private httpClient: HttpClient;
  private apiUrl = environment.api + "/topics";
  private loggedUserId = 1;

  authorFilter = signal<"all" | "user">("all");
  listSort = signal<"date" | "moreLiked">("date");
  categoryId = signal<number | null>(null);
  searchBarInput = signal<string>("");
  page = signal<number>(0);
  size = signal<number>(10)
  sort = signal<string[]>(["createdAt", "desc"])

  topicQueryEntity = computed(() => {
    return {
      authorId: this.authorFilter() === "user" ? this.loggedUserId : null,
      searchInput: this.searchBarInput(),
      categoryId: this.categoryId() != null ? this.categoryId() : null,
      moreLiked: this.listSort() === "moreLiked" ? true : false,
      pageable: {
        page: this.page(),
        size: this.size(),
        sort: this.sort()
      }
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
      this.responseStatusFlag.set(StatusFlag.LOADING);
      this.getAllTopics(this.topicQueryEntity(), {page: this.page(), size: this.size(), sort: this.sort()})
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
              console.log(this.topicListRes())
            }
          },
          error: err => {
            console.log("okokokok")
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

  getAllTopics(params: TopicQueryEntity, pageable: Pageable) {
    let queryParams = new URLSearchParams();

    if (this.listSort() === "moreLiked") {
      pageable.sort = [];
    }
    else {
      pageable.sort = ["createdAt", "desc"]
    }

    // queryParams.append("authorId", this.authorFilter() === 'user' ? this.loggedUserId.toString() : "");
    // queryParams.append("categoryId", this.categoryId() ? this.categoryId()!.toString() : "");
    // queryParams.append("title", this.searchBarInput());
    // queryParams.append("moreLiked", this.listSort() === "moreLiked" ? "true" : "false");
    // queryParams.append("page", this.pageable().page.toString())
    // queryParams.append("size", this.pageable().size.toString())
    // queryParams.append("sort", this.pageable().sort.toString())

    queryParams.append("authorId", params.authorId ? params.authorId.toString() : "");
    queryParams.append("categoryId", params.categoryId ? params.categoryId.toString() : "");
    queryParams.append("title", params.searchInput);
    queryParams.append("moreLiked", params.moreLiked.toString());
    queryParams.append("page", pageable.page.toString())
    queryParams.append("size", pageable.size.toString())
    queryParams.append("sort", pageable.sort.toString())

    console.log(queryParams.toString())
    
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

  updatePageable(
    page: number = this.page(),
    size: number = this.size()
  ) {
    this.page.set(page)
    this.size.set(size)
  }

}