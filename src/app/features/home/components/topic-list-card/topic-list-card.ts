import { Component, computed, DestroyRef, inject, input, InputSignal, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Topic } from '../../../../core/models/topics';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-topic-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatTooltipModule],
  templateUrl: './topic-list-card.html',
  styleUrl: './topic-list-card.css',
})
export class TopicListCard {
  router = inject(Router);
  breakpointObserver = inject(BreakpointObserver);
  destroyRef = inject(DestroyRef);

  isHandheld = signal(false);

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

  ngOnInit() {
    this.breakpointObserver.observe(
      [Breakpoints.XSmall, Breakpoints.Small]
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => {
      if (data.matches) {
        this.isHandheld.set(true);
        console.log(this.isHandheld())
        return;
      }
      this.isHandheld.set(false);
      console.log(this.isHandheld())
    })
  }

  redirectTo() {
    this.router.navigate(['/topics', this.topic().id]);
  }

}
