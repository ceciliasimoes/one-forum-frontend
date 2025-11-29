import { Component, computed, inject, signal } from '@angular/core';
import { TopicCard } from '../topic-card/topic-card';
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HomeService } from '../../home.service';
import { FiltersCard } from "../filters-card/filters-card";
import { StatusFlag } from '../../model/status-flag.model';
import { Pagination } from '../pagination/pagination';


@Component({
  selector: 'app-topic-list',
  imports: [
    TopicCard,
    MatAnchor,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FiltersCard,
    Pagination
  ],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
})
export class TopicList {
  StatusFlagEnum = StatusFlag;
  homeService = inject(HomeService);
  
  activeSort = signal("date");
  activeAuthorFilter = signal("all");

  statusFlag = computed(() => this.homeService.responseStatusFlag());
  
  updateSortList(value: "date" | "moreLiked") {
    this.activeSort.set(value);
    this.homeService.updateListSort(value);
  }

  updateAuthorFilter(value: "all" | "user") {
    this.activeAuthorFilter.set(value);
    this.homeService.updateAuthorFilter(value);
  }
}
