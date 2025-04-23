import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Corrected styleUrl to styleUrls for consistency
})
export class LoginComponent {
  username = '';
  password = '';
  role: 'student' | 'teacher' = 'student';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getRole();  // Check for valid role on component init
  }


  login() {
    // Form validation (simple check)
    if (!this.username || !this.password) {
      this.errorMsg = 'Please enter both username and password.';
      return;
    }

    // Call the login service
    this.authService.login(this.username, this.password, this.role).subscribe({
      next: (res) => {
        if (res.success) {
          this.authService.setRole(this.role); // Save the role in localStorage
          // Navigate to appropriate route based on the role
          if (this.role === 'student') {
            this.router.navigate(['/chat']);
          } else {
            this.router.navigate(['/teacher']);
          }
        } else {
          this.errorMsg = res.message || 'Login failed. Please check your credentials.';
        }
      },
      error: () => {
        this.errorMsg = 'An error occurred while logging in. Please try again later.';
      }
    });
  }
}