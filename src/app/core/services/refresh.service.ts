import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginResponse } from "../models/auth";
import { TokenService } from "./token.service";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class RefreshService {
    private readonly apiUrl = `${environment.apiBaseUrl}/auth`;

    constructor(
        private readonly http: HttpClient,
        private readonly tokenService: TokenService
    ) {}

    refresh(refreshToken: string) {
        return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {
            refreshToken,
        });
    }
}
