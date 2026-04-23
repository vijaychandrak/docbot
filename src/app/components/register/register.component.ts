import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    errorMessage = '';
    isLoading = false;

    constructor(private authService: AuthService, private router: Router) { }

    register(): void {
        if (!this.username.trim() || !this.email.trim() || !this.password.trim()) {
            this.errorMessage = 'Please fill in all fields';
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        if (this.password.length < 6) {
            this.errorMessage = 'Password must be at least 6 characters';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const request: RegisterRequest = {
            username: this.username,
            email: this.email,
            password: this.password
        };

        this.authService.register(request).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
