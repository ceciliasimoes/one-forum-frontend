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
  }

  // getTopics() {
  //   this.topicListState.update(topicListState => {
  //     topicListState.loadFlag = true;
  //     topicListState.errorFlag = false;
  //     return topicListState;
  //   });
  //   this.homeService.getAllTopics(this.selectedFilters())
  //     .subscribe({
  //       next: res => {
  //         console.log(res)
  //         this.topicListState.update(topicListState => {
  //           topicListState.loadFlag = false;
  //           topicListState.list = res.body ? res.body.content : [];
  //           return topicListState;
  //         });
  //       },
  //       error: err => {
  //         switch(err) {
  //           case 0:
  //             console.log("oxe");
  //             break;
  //           case 404:
  //             console.log("oxe nem existe isso");
  //             break;
  //           case 403:
  //             console.log("oxe, pode não");
  //             break;
  //           case 400:
  //             console.log("oxe, e agora");
  //             break;
  //           default:
  //             console.log("oxe, ocorreu um erro, contate os adm");
  //             break;
  //         }
  //         this.topicListState.update(topicListState => {
  //           topicListState.loadFlag = false;
  //           topicListState.errorFlag = true;
  //           topicListState.list = [];
  //           return topicListState;
  //         });
  //       }
  //     })
  // }

  // searchBarhandler(value: string) {
  //   console.log(value)
  //   this.selectedFilters.update(filters => {
  //     filters.searchInput = value;
  //     return filters;
  //   })
  //   this.getTopics();
  // }

  // updateListBySort(sort: string) {
  //   switch(sort) {
  //     case "like":
  //       this.selectedFilters.update(filters => {
  //         filters.moreLiked = true;
  //         return filters;
  //       })
  //       break;
  //     default:
  //       this.selectedFilters.update(filters => {
  //         filters.moreLiked = false;
  //         return filters;
  //       })
  //       break;
  //   }
  //   if (this.topicListState().list.length <= 0) {
  //     return;
  //   }
  //   this.getTopics();
  // }

  // updateAuthorFilter(authorFilter: string) {
  //   switch(authorFilter) {
  //     case 'mine':
  //       this.selectedFilters.update(filters => {
  //         filters.authorId = this.authService.getUserId();
  //         return filters;
  //       })
  //       break;
  //     default:
  //       this.selectedFilters.update(filters => {
  //         filters.authorId = null;
  //         return filters;
  //       })
  //       break;
  //   }
  //   this.getTopics();
  // }
}
