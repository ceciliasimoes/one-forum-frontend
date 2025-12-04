import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { CategoryService } from '../../../../core/services/category.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipSelectionChange, MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { Category } from '../../model/category.model';
import { HomeService } from '../../home.service';

@Component({
  selector: 'app-filters-card',
  imports: [MatCardModule, MatIconModule, MatProgressSpinnerModule, MatChipsModule, MatButtonModule, MatFormFieldModule],
  templateUrl: './filters-card.html',
  styleUrl: './filters-card.css',
})
export class FiltersCard {
  private readonly categoryService = inject(CategoryService);
  private readonly homeService = inject(HomeService);

  isGettingCategories = signal(false);
  allCategories = signal<Category[]>([])

  selectedCategory: number | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isGettingCategories.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: categoriesList => {
        this.allCategories.set(categoriesList);
        this.isGettingCategories.set(false);
      },
      error: err => {
        this.isGettingCategories.set(false);
      }
    });
  }

  selectFilter(event: MatChipSelectionChange, categoryId: number) {
    if (event.selected) {
      console.log("selecionado: " + categoryId);
      this.homeService.updateCategory(categoryId);
      return;
    }
    console.log("desselecionado: " + categoryId);
    this.homeService.updateCategory(null);
  }
}
