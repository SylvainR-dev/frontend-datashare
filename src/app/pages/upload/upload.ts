import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";

@Component({
  selector: "app-upload",
  imports: [CommonModule],
  templateUrl: "./upload.html",
  styleUrl: "./upload.scss",
})
export class Upload {

  private fileService = inject(FileService);
  private destroyRef = inject(DestroyRef);

  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;
  downloadToken: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      return;
    }

    const metadata = {
      name: this.selectedFile.name,
      size: this.selectedFile.size
    };

    this.fileService.uploadFile(this.selectedFile, metadata)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.uploadSuccess = true;
          this.downloadToken = response.token;
          this.uploadError = null;
        },
        error: (err) => {
          this.uploadError = 'Erreur lors de l\'upload';
          console.error(err);
        }
      });
  }
}