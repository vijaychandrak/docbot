import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';
    private tokenKey = 'docbot_auth_token';
    private userKey = 'docbot_auth_user';

    private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: HttpClient, private router: Router) { }

    login(request: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => this.storeAuth(response))
        );
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(response => this.storeAuth(response))
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.loggedIn$.next(false);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUser(): AuthResponse | null {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): boolean {
        return this.hasToken();
    }

    isLoggedIn$(): Observable<boolean> {
        return this.loggedIn$.asObservable();
    }

    private hasToken(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }

    private storeAuth(response: AuthResponse): void {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response));
        this.loggedIn$.next(true);
    }
}
