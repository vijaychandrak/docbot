import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FileService } from '../../services/file.service';
import { UploadedFile } from '../../models/file.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  files: UploadedFile[] = [];
  isUploading = false;
  uploadMessage = '';
  selectedFile: File | null = null;
  dragOver = false;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadUploadedFiles();
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  /**
   * Handle drop event for file drag-and-drop
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  /**
   * Upload the selected file
   */
  uploadFile(): void {
    if (!this.selectedFile) {
      this.uploadMessage = 'Please select a file first';
      return;
    }

    this.isUploading = true;
    this.uploadMessage = 'Uploading...';

    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        this.files.unshift(response);
        this.uploadMessage = 'File uploaded successfully!';
        this.selectedFile = null;
        this.isUploading = false;
        setTimeout(() => this.uploadMessage = '', 3000);
      },
      error: (error) => {
        this.uploadMessage = 'Error uploading file: ' + (error.error?.message || error.message);
        this.isUploading = false;
      }
    });
  }

  /**
   * Load all uploaded files
   */
  loadUploadedFiles(): void {
    this.fileService.getUploadedFiles().subscribe({
      next: (files) => {
        this.files = files;
      },
      error: (error) => {
        console.error('Error loading files:', error);
      }
    });
  }

  /**
   * Delete a file
   */
  deleteFile(fileId: string): void {
    if (confirm('Are you sure you want to delete this file?')) {
      this.fileService.deleteFile(fileId).subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== fileId);
        },
        error: (error) => {
          console.error('Error deleting file:', error);
        }
      });
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  /**
   * Get file size in readable format
   */
  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
