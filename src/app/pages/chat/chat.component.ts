import { Component } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  userInput = '';
  messages: { user: string; bot: string | null }[] = [];

  pdfUrl: SafeResourceUrl | null = null;
  isUploading = false;
  lectureName: string | null = null;

  // GPA & CGPA Calculator
  showGpaCalc = false;
  gpaInputs: { grade: string; credit: number }[] = [{ grade: '', credit: 0 }];
  gpaResult: number | null = null;
  cgpaResult: number | null = null;
  finishedCredits = 0;
  previousGpa = 0;

  constructor(private chatService: ChatService, private sanitizer: DomSanitizer) {}

  sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.messages.push({ user: message, bot: null });
    this.userInput = '';

    this.chatService.sendMessage(message).subscribe({
      next: (res) => {
        this.messages[this.messages.length - 1].bot = res.reply;
      },
      error: () => {
        this.messages[this.messages.length - 1].bot = 'Error: Unable to get response.';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];

      const lectureName = prompt('Enter a lecture name:');
      if (!lectureName) {
        alert('Lecture name is required.');
        return;
      }

      this.lectureName = lectureName;
      this.showGpaCalc = false; // Hide GPA calc when uploading

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('lecture_name', lectureName);

      this.isUploading = true;

      this.chatService.uploadPdf(formData).subscribe({
        next: () => {
          const unsafeUrl = URL.createObjectURL(selectedFile);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
          alert(`📄 PDF uploaded successfully!`);
          this.isUploading = false;
        },
        error: () => {
          alert('❌ Failed to upload PDF.');
          this.isUploading = false;
        }
      });
    }
  }

  closePdf() {
    this.pdfUrl = null;
    this.lectureName = '';
  }

  openPdf(message: string) {
    const match = message.match(/\/pdfs\/[^\s]+/);
    if (!match) {
      alert('❌ No valid PDF link found in message.');
      return;
    }

    const fullUrl = 'http://localhost:5000' + match[0];
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  // ===== GPA & CGPA Calculator Logic =====

  toggleGpaCalc() {
    if (this.pdfUrl){
      window.alert("Close Pdf first")
      return; // Don't open if PDF is displayed
    }  
    this.showGpaCalc = !this.showGpaCalc;
    this.gpaResult = null;
    this.cgpaResult = null;
  }

  closeGpaCalc() {
    this.showGpaCalc = false;
    this.gpaResult = null;
    this.cgpaResult = null;
  }

  addGpaRow() {
    this.gpaInputs.push({ grade: '', credit: 0 });
  }

  removeGpaRow(input: { grade: string; credit: number }) {
    this.gpaInputs = this.gpaInputs.filter(i => i !== input);
  }

  calculateGpa() {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const entry of this.gpaInputs) {
      const grade = entry.grade.trim().toUpperCase();
      const credit = entry.credit;

      if (!grade || isNaN(credit) || credit <= 0) continue;

      const points = this.getGradePoints(grade);
      if (points === null) continue;

      totalPoints += points * credit;
      totalCredits += credit;
    }

    this.gpaResult = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : null;

    // Calculate CGPA
    const finished = this.finishedCredits;
    const prevGpa = this.previousGpa;

    if (!isNaN(finished) && finished > 0 && !isNaN(prevGpa) && this.gpaResult !== null) {
      const prevPoints = prevGpa * finished;
      const currentPoints = this.gpaResult * totalCredits;
      const totalCumulativeCredits = finished + totalCredits;

      this.cgpaResult = totalCumulativeCredits > 0
        ? parseFloat(((prevPoints + currentPoints) / totalCumulativeCredits).toFixed(2))
        : null;
    } else {
      this.cgpaResult = null;
    }
  }

  getGradePoints(grade: string): number | null {
    switch (grade) {
      case 'A+': return 4.0;
      case 'A': return 4.0;
      case 'A-': return 3.7;
      case 'B+': return 3.3;
      case 'B': return 3.0;
      case 'B-': return 2.7;
      case 'C+': return 2.3;
      case 'C': return 2.0;
      case 'C-': return 1.7;
      case 'D+': return 1.3;
      case 'D': return 1.0;
      case 'F': return 0.0;
      default: return null;
    }
  }
}
