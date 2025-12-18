import { Component, effect, input, InputSignal, output } from '@angular/core';
import { TopicListCard } from '../topic-list-card/topic-list-card';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FiltersCard } from "../filters-card/filters-card";
import { StatusFlag } from '../../../../core/models/status-flag.model';
import { Topic } from '../../../../core/models/topics';
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { SkeletonTopicCard } from '../../../../shared/components/skeleton-topic-card/skeleton-topic-card';


@Component({
  selector: 'app-topic-list',
  imports: [
    TopicListCard,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FiltersCard,
    MatPaginatorModule,
    SkeletonTopicCard,
],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
})
export class TopicList {
  protected readonly StatusFlagEnum = StatusFlag;

  isLogged = input(false);

  topics: InputSignal<Topic[]> = input.required();
  statusFlag: InputSignal<StatusFlag> = input<StatusFlag>(StatusFlag.OK);

  emptyTopicsMessage = input("Não foram encontrados tópicos...");

  totalElements: InputSignal<number> = input.required();
  pageIndex = input(0);
  pageSize = input(10);

  activeSort = input<"date" | "moreLiked">("date");
  activeAuthorFilter = input<"all" | "user">("all");

  authorFilterChange = output<string>();
  sortListChange = output<string>();
  paginationChange = output<PageEvent>();

  filtersCard = input(true);
  topActions = input(true);
  ownerFilterSwitch = input(true);
  sortSwitch = input(true);

  updateAuthorFilter(newValue: "all" | "user") {
    this.authorFilterChange.emit(newValue);
  }
  
  updateSortList(newValue: "date" | "moreLiked") {
    this.sortListChange.emit(newValue);
  }

  updatePage(newValue: PageEvent) {
    this.paginationChange.emit(newValue);
  }
}