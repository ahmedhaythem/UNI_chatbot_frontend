import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private apiUrl = 'http://localhost:5000/login';

  constructor(private http: HttpClient, private router: Router) {}

  // Login method with role validation
  login(username: string, password: string, role: 'student' | 'teacher') {
    return this.http.post<any>(this.apiUrl, { username, password, role });
  }

  // Set the role in localStorage
  setRole(role: 'student' | 'teacher') {
    localStorage.setItem('userRole', role);  // Save role in localStorage
  }

  // Get the role from localStorage
  getRole(): 'student' | 'teacher' | null {
    return localStorage.getItem('userRole') as 'student' | 'teacher' | null;
  }

  // Clear the role and logout
  logout() {
    localStorage.removeItem('userRole'); // Remove the role from localStorage
    this.router.navigate(['/login']); // Redirect to login
  }
}