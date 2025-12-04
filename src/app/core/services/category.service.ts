import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../../features/home/model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    private readonly httpClient: HttpClient;

    private readonly endpoint = environment.api + "/categories";

    constructor(httpClient: HttpClient) {
      this.httpClient = httpClient;
    }

    getAllCategories(): Observable<Category[]> {
      return this.httpClient.get<Category[]>(`${this.endpoint}`);
    }
}
