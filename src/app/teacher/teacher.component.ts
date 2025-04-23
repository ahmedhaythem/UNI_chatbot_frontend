import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  imports: [FormsModule],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.scss'
})
export class TeacherComponent {
  lectureName = '';
  selectedFile: File | null = null;
  uploadMessage = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadLecture() {
    if (!this.lectureName || !this.selectedFile) {
      this.uploadMessage = '❌ Please provide a lecture name and select a PDF.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('lecture_name', this.lectureName);

    this.http.post('http://localhost:5000/upload-pdf', formData).subscribe({
      next: () => {
        this.uploadMessage = `✅ Lecture '${this.lectureName}' uploaded successfully!`;
        this.lectureName = '';
        this.selectedFile = null;
      },
      error: () => {
        this.uploadMessage = '❌ Upload failed.';
      }
    });
  }
}
