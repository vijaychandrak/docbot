export interface UploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileExtension: string;
  uploadedAt: Date;
  fileSize: number;
}
