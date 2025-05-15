// file-upload.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'https://api.example.com/upload'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  uploadFiles(files: File[], notes: string, firmName: string): Observable<any> {
    // In a real application, you would create a FormData object and send it to your API
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }
    
    formData.append('notes', notes || '');
    formData.append('firmName', firmName);
    
    return of({
      success: true,
      message: `${files.length} document(s) shared with ${firmName} successfully.`,
      auditTrail: {
        clientName: 'Current Client',
        firmName: firmName,
        documentCount: files.length,
        timestamp: new Date().toISOString()
      }
    }).pipe(delay(1000)); // Simulate 1 second delay for network
  }
}