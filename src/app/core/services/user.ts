import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User, UserEditRequest } from "../models/user";

@Injectable({
    providedIn: "root",
})
export class userService{
    constructor(private http:HttpClient) {}

    private api = "http://localhost:8080/users"

    getUser(id: number): Observable<User>{
        return this.http.get<User>(`${this.api}/${id}`)
    }

    editUser(id: number, data: UserEditRequest): Observable<User>{
        return this.http.patch<User>(`${this.api}/${id}`, data)
    }
}