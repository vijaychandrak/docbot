import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, RouterModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    isSideMenuCollapsed = false;

    constructor(public authService: AuthService, private router: Router) { }

    get isDocAiActive(): boolean {
        return this.router.url.startsWith('/doc-ai') || this.router.url.startsWith('/chat');
    }

    get isChatRoute(): boolean {
        return this.router.url.startsWith('/chat');
    }

    get userInitials(): string {
        const user = this.authService.getUser();
        const firstName = user?.firstName?.trim() ?? '';
        const lastName = user?.lastName?.trim() ?? '';

        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    logout(): void {
        this.authService.logout();
    }

    toggleSideMenu(): void {
        this.isSideMenuCollapsed = !this.isSideMenuCollapsed;
    }
}
