import { Component, OnInit } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
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
  uploadProgress = 0;
  showDeleteModal = false;
  fileToDeleteId: string | null = null;
  expandedFileIds: string[] = [];

  constructor(private fileService: FileService) { }

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
    this.uploadProgress = 0;

    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * (event.loaded / (event.total ?? 1)));
          this.uploadProgress = percentDone;
          this.uploadMessage = `Uploading... ${percentDone}%`;
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as any;
          this.files.unshift(response);
          this.uploadMessage = 'File uploaded successfully!';
          this.selectedFile = null;
          this.isUploading = false;
          this.uploadProgress = 0;
          setTimeout(() => this.uploadMessage = '', 3000);
        }
      },
      error: (error) => {
        this.uploadMessage = 'Error uploading file: ' + (error.error?.message || error.message);
        this.isUploading = false;
        this.uploadProgress = 0;
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
   * Open delete confirmation modal
   */
  openDeleteModal(fileId: string): void {
    this.fileToDeleteId = fileId;
    this.showDeleteModal = true;
  }

  /**
   * Close delete confirmation modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.fileToDeleteId = null;
  }

  /**
   * Confirm the file deletion
   */
  confirmDelete(): void {
    if (!this.fileToDeleteId) {
      return;
    }

    this.fileService.deleteFile(this.fileToDeleteId).subscribe({
      next: () => {
        this.files = this.files.filter(f => f.id !== this.fileToDeleteId);
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error deleting file:', error);
        this.closeDeleteModal();
      }
    });
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getDisplayFileName(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex <= 0) {
      return fileName;
    }
    return fileName.substring(0, lastDotIndex);
  }

  getTruncatedFileName(fileName: string, maxLength: number = 18): string {
    if (!fileName || fileName.length <= maxLength) {
      return fileName;
    }
    return fileName.substring(0, maxLength).trimEnd() + '...';
  }

  isFileExpanded(fileId: string): boolean {
    return this.expandedFileIds.includes(fileId);
  }

  toggleExpandedFile(fileId: string): void {
    if (this.isFileExpanded(fileId)) {
      this.expandedFileIds = this.expandedFileIds.filter((id) => id !== fileId);
      return;
    }

    this.expandedFileIds.push(fileId);
  }

  getMobileFileName(file: UploadedFile): string {
    if (this.isFileExpanded(file.id)) {
      return file.fileName;
    }

    return this.getTruncatedFileName(file.fileName, 18);
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
