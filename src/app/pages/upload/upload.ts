import { Component, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";
import { AuthService } from "../../core/service/auth.service";

@Component({
  selector: "app-upload",
  imports: [CommonModule, RouterLink],
  templateUrl: "./upload.html",
  styleUrl: "./upload.scss",
})
export class Upload {

  private fileService = inject(FileService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn();

  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;
  downloadToken: string | null = null;
  expirationDays: number = 1;
  isUploading: boolean = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onExpirationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.expirationDays = parseInt(select.value);
    console.log('Expiration jours:', this.expirationDays);
  }

  onUpload(): void {
    if (!this.selectedFile || this.isUploading) {
      return;
    }

    this.isUploading = true;

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + this.expirationDays);

    const formattedDate = expirationDate.toISOString().slice(0, 19);

    const metadata = {
      name: this.selectedFile.name,
      size: this.selectedFile.size,
      expirationDate: formattedDate
    };

    this.fileService.uploadFile(this.selectedFile, metadata)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.uploadSuccess = true;
          this.downloadToken = response.token;
          this.uploadError = null;
          this.isUploading = false;
        },
        error: (err) => {
          this.uploadError = 'Erreur lors de l\'upload';
          this.isUploading = false;
          console.error(err);
        }
      });
  }

  onCopyLink(): void {
    const link = `http://localhost:4200/download/${this.downloadToken}`;
    navigator.clipboard.writeText(link);
  }
}