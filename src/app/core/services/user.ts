import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, UserEditRequest } from "../models/user";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiBaseUrl}/users`;

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    editUser(id: number, data: UserEditRequest): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
    }
}