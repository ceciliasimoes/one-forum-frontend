import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { TopicListService } from '../../../../core/services/topic-list.service';

@Component({
  selector: 'app-search-bar',
  imports: [
    MatFormFieldModule, 
    FormsModule,
    MatInputModule
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  topicListService = inject(TopicListService);
  
  searchFieldValue = "";
  placeholder = input("");

  initUrlCheckSubscription?: Subscription;

  ngOnInit() {
    this.initUrlCheckSubscription = this.topicListService.homeFilters$.subscribe(filters => {
      this.searchFieldValue = filters.search ?? "";
    })
  }

  ngOnDestroy() {
    this.initUrlCheckSubscription?.unsubscribe();
  }

  enterPressed() {
    if (this.searchFieldValue === '') {
      this.topicListService.setHomeFilters({search: undefined});
      return
    }
    this.topicListService.setHomeFilters({search: this.searchFieldValue})
  }
}
