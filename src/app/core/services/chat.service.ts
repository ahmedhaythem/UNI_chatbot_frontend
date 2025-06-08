import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatUrl = 'http://localhost:5000/chat';
  private uploadUrl = 'http://localhost:5000/upload-pdf';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.chatUrl, { message });
  }

  uploadPdf(formData: FormData): Observable<any> {
    return this.http.post('http://localhost:5000/upload-pdf', formData);
  }

  
}
