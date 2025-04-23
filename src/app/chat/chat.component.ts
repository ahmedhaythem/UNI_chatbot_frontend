import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
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

  openPdf(message: string) {
    // Use regex to extract `/pdfs/...` from the bot message
    const match = message.match(/\/pdfs\/[^\s]+/);
    if (!match) {
      alert('❌ No valid PDF link found in message.');
      return;
    }
  
    const fullUrl = 'http://localhost:5000' + match[0];
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  
}
