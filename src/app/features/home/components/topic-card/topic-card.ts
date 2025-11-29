import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Topic } from '../../../../core/models/topics';

@Component({
  selector: 'app-topic-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './topic-card.html',
  styleUrl: './topic-card.css',
})
export class TopicCard {
  router = inject(Router);

  NUM_OF_CATEGORIES_TO_BE_SHOWN = 5;
  
  topic: InputSignal<Topic> = input.required();

  categoriesShown = computed(() => 
    this.topic().categories.length > this.NUM_OF_CATEGORIES_TO_BE_SHOWN ?
      this.topic().categories.slice(0, this.NUM_OF_CATEGORIES_TO_BE_SHOWN) :
      this.topic().categories);
  
  categoriesHidden = computed(() => 
    this.topic().categories.length > this.NUM_OF_CATEGORIES_TO_BE_SHOWN ?
      this.topic().categories.slice(this.NUM_OF_CATEGORIES_TO_BE_SHOWN, this.topic().categories.length) : null);
  
  categoriesHiddenString = computed(() => 
    this.categoriesHidden() != null ?
      this.categoriesHidden()!.reduce((acc, category,) => acc + category.name + ", ", "") : "");

  createdAt = computed(() => new Date(this.topic().createdAt))

  redirectTo() {
    this.router.navigate(['/topics', this.topic().id]);
  }

}
