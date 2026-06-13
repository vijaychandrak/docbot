import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadedFile } from '../models/file.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = '/api/files';

  constructor(private http: HttpClient) { }


  /**
   * Upload a file to the server with userId
   * @param file - The file to upload
   * @returns Observable of the uploaded file response
   */
  uploadFile(file: File): Observable<HttpEvent<UploadedFile>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadedFile>(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Get uploaded files for the current user
   * @returns Observable array of uploaded files
   */
  getUploadedFiles(): Observable<UploadedFile[]> {
    return this.http.get<UploadedFile[]>(`${this.apiUrl}/me`);
  }

  /**
   * Get a specific file by ID
   * @param fileId - The ID of the file
   * @returns Observable of the file
   */
  getFileById(fileId: string): Observable<UploadedFile> {
    return this.http.get<UploadedFile>(`${this.apiUrl}/${fileId}`);
  }

  /**
   * Delete a file
   * @param fileId - The ID of the file to delete
   * @returns Observable of the delete response
   */
  deleteFile(fileId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${fileId}`);
  }
}
