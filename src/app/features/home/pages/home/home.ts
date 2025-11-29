import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { TopicList } from "../../components/topic-list/topic-list";
import { AuthService } from '../../../../core/services/auth.service';
import { HomeService } from '../../home.service';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule, 
    MatInputModule, 
    TopicList,
    SearchBar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  authService = inject(AuthService);
  homeService = inject(HomeService);
  
  isUserLogged = signal(false);

  ngOnInit() {
    this.isUserLogged.set(this.authService.isUserAuthenticated());
  }

  createTopicBtnClick() {
    console.log("CreateTopicBtn has been clicked!");
    // TODO: Add create-topic-dialog call
  }
}
