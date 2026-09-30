import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    constructor(public authService: AuthService) { }

    get user(): AuthResponse | null {
        return this.authService.getUser();
    }

    get userInitials(): string {
        const user = this.user;
        const firstName = user?.firstName?.trim() ?? '';
        const lastName = user?.lastName?.trim() ?? '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
}