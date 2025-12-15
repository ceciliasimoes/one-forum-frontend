import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryService } from '../../../../core/services/category.service';
import { TopicService } from '../../../../core/services/topics.service';
import { TopicDialog } from '../../../../shared/components/topic-dialog/topic-dialog';
import { SearchBar } from '../../components/search-bar/search-bar';
import { TopicList } from '../../components/topic-list/topic-list';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusFlag } from '../../../../core/models/status-flag.model';
import { Topic } from '../../../../core/models/topics';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { TopicListService } from '../../../../core/services/topic-list.service';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatIcon,
    SearchBar,
    TopicList,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly authService = inject(AuthService);
  private readonly dialogService = inject(MatDialog);
  private readonly topicService = inject(TopicService);
  private readonly categoryService = inject(CategoryService);
  private readonly topicListService = inject(TopicListService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly StatusFlag = StatusFlag;


  private readonly loggedUserId = computed(() => this.authService.currentUser()?.id);

  isLogged = toSignal(this.authService.isLogged$);
  topics: WritableSignal<Topic[]> = signal([]);
  totalElements = signal(0);
  pageIndex = signal(0);
  pageSize = signal(0);
  statusFlag = signal(StatusFlag.LOADING);
  activeAuthorFilter = signal<"all" | "user">("all");
  activeSort = signal<"date" | "moreLiked">("date");

  private queryParamsSubscription?: Subscription;
  private initFirstReqSubscription?: Subscription;
  private initUrlCheckSubscription?: Subscription;

  openCreateTopicDialog(): void {
    const dialogRef = this.dialogService.open(TopicDialog, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.topicService.createTopic({
        content: result.content,
        categories: result.categories,
        title: result.title
      }).subscribe({
        complete: () => {
          this.topicListService.refreshHomeResults();
          this.categoryService.reloadCategories();
        }
      });
    });
  }

  ngOnInit() {
    const currentParams = this.route.snapshot.queryParams;

    let mine = currentParams['mine'];

    if (mine && !this.isLogged()) {
      this.router.navigate([], {
          queryParams: {mine: undefined},
          queryParamsHandling: "merge",
          replaceUrl: true
        },
      )

      mine = undefined;
    }

    this.topicListService.setHomeFilters({
      search: currentParams['search'] || undefined,
      category: +currentParams['category'] || undefined,
      moreLiked: currentParams['moreLiked'] === 'true' ? true : undefined,
      mine: mine === 'true' ? true : undefined,
      page: +currentParams['page'] || 0,
      size: +currentParams['size'] || 10,
      sort: currentParams['sort'] || undefined
    })

    this.initFirstReqSubscription = this.topicListService.homeReqResults$.subscribe({
      next: data => {
        const totalPages = data.totalPages;
        const safePage = Math.max(0, Math.min(data.pageable.pageNumber, totalPages - 1));
        const safeSize = Math.min(data.pageable.pageSize, 50);

        const currentParams = this.route.snapshot.queryParams;

        if (
          +currentParams['page'] !== safePage ||
          +currentParams['size'] !== safeSize
        ) {
          this.router.navigate([], {
              queryParams: {page: safePage, size: safeSize},
              queryParamsHandling: "merge",
              replaceUrl: true
            },  
          )
          this.topicListService.setHomeFilters({
            page: safePage,
            size: safeSize
          })
        }

        this.topics.set(data.content || []);
        this.totalElements.set(data.totalElements || 0);
        this.pageIndex.set(data.pageable.pageNumber);
        this.pageSize.set(data.pageable.pageSize);
        this.statusFlag.set(StatusFlag.OK);
      },
      error: () => this.statusFlag.set(StatusFlag.ERROR)
    })
    this.initUrlCheckSubscription = this.topicListService.homeFilters$.subscribe(filters => {
      this.activeAuthorFilter.set(filters.mine ? 'user' : "all");
      this.activeSort.set(filters.moreLiked ? 'moreLiked' : 'date');
    })
  }

  ngOnDestroy() {
    this.initFirstReqSubscription?.unsubscribe();
    this.initUrlCheckSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  handleAuthorFilterChange(newValue: string) {
    this.activeAuthorFilter.set(newValue as 'user' | "all");
    this.topicListService.setHomeFilters({
      mine: newValue === "user" || undefined
    })
  }

  handleSortListChange(newValue: string) {
    this.activeSort.set(newValue as 'moreLiked' | "date");
    this.topicListService.setHomeFilters({
      moreLiked: newValue === "moreLiked" || undefined  
    })
  }

  handlePaginationChange(pageEvent: PageEvent) {
    this.topicListService.setHomeFilters({
      page: pageEvent.pageIndex,
      size: pageEvent.pageSize
    })
  }

}
