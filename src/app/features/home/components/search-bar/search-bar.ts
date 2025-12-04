import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { HomeService } from '../../home.service';

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
  homeService = inject(HomeService);
  searchFieldValue = "";
  searchSubmit = output<string>();
  placeholder = input("");

  
  enterPressed() {
    this.homeService.updateSearchBarInput(this.searchFieldValue)
  }
}
