import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-pagination',
  imports: [
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  viewportService = inject(ViewportScroller);
  homeService = inject(HomeService);

  updatePage(event: PageEvent) {
    this.homeService.updatePageable(event.pageIndex, event.pageSize);
  }
}
