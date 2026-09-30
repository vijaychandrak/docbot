import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { FileService } from '../../services/file.service';
import { UploadedFile } from '../../models/file.model';

@Component({
  selector: 'app-my-files',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-files.component.html'
})
export class MyFilesComponent implements OnInit {
  files: UploadedFile[] = [];
  isLoading = true;
  isUploading = false;
  uploadProgress = 0;
  uploadMessage = '';
  uploadError = false;
  downloadingFileId: string | null = null;
  fileToDelete: UploadedFile | null = null;
  isDeleting = false;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.fileService.getUploadedFiles().subscribe({
      next: (files) => {
        this.files = [...files].sort((left, right) =>
          new Date(right.uploadedAt).getTime() - new Date(left.uploadedAt).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.uploadError = true;
        this.uploadMessage = 'Your files could not be loaded. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.isUploading = true;
    this.uploadError = false;
    this.uploadMessage = `Uploading ${file.name}`;
    this.uploadProgress = 0;

    this.fileService.uploadFile(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total ?? 1));
        } else if (event.type === HttpEventType.Response) {
          const uploadedFile = event.body;
          if (uploadedFile) {
            this.files = [uploadedFile, ...this.files];
          } else {
            this.loadFiles();
          }
          this.isUploading = false;
          this.uploadProgress = 0;
          this.uploadMessage = 'Upload complete';
        }
      },
      error: () => {
        this.isUploading = false;
        this.uploadProgress = 0;
        this.uploadError = true;
        this.uploadMessage = 'Upload failed. Please try again.';
      }
    });
  }

  downloadFile(file: UploadedFile): void {
    this.downloadingFileId = file.id;
    this.uploadMessage = '';
    this.fileService.downloadFile(file.id).subscribe({
      next: (blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.fileName;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        this.downloadingFileId = null;
      },
      error: () => {
        this.downloadingFileId = null;
        this.uploadError = true;
        this.uploadMessage = `Could not download ${file.fileName}. Please try again.`;
      }
    });
  }

  requestDelete(file: UploadedFile): void {
    this.fileToDelete = file;
  }

  cancelDelete(): void {
    if (!this.isDeleting) {
      this.fileToDelete = null;
    }
  }

  confirmDelete(): void {
    const file = this.fileToDelete;
    if (!file || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.fileService.deleteFile(file.id).subscribe({
      next: () => {
        this.files = this.files.filter((item) => item.id !== file.id);
        this.fileToDelete = null;
        this.isDeleting = false;
      },
      error: () => {
        this.fileToDelete = null;
        this.isDeleting = false;
        this.uploadError = true;
        this.uploadMessage = `Could not delete ${file.fileName}. Please try again.`;
      }
    });
  }

  getBaseFileName(fileName: string): string {
    const extensionIndex = fileName.lastIndexOf('.');
    return extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }

  formatShortDate(date: Date): string {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes / 1024;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(size < 10 ? 1 : 0)} ${units[unitIndex]}`;
  }

  @HostListener('document:keydown.escape')
  closeDeleteDialogOnEscape(): void {
    this.cancelDelete();
  }
}