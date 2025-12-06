import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { TopicList } from "../../components/topic-list/topic-list";
import { AuthService } from '../../../../core/services/auth.service';
import { HomeService } from '../../home.service';
import { SearchBar } from '../../components/search-bar/search-bar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule, 
    MatInputModule, 
    TopicList,
    SearchBar,
    AsyncPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService);
  homeService = inject(HomeService);

  ngOnInit() {
  }

  createTopicBtnClick() {
    console.log("CreateTopicBtn has been clicked!");
    // TODO: Add create-topic-dialog call
  }
}
