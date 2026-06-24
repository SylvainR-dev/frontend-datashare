import { Component, DestroyRef, inject, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
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
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('fileInput') fileInputRef!: ElementRef;

  isLoggedIn = this.authService.isLoggedIn();

  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;
  downloadToken: string | null = null;
  expirationDays: number = 1;
  isUploading: boolean = false;

  private readonly FORBIDDEN_EXTENSIONS = ['.exe', '.bat', '.sh', '.cmd', '.msi', '.vbs', '.ps1'];

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadError = null;

      // Vérification de l'extension dès la sélection
      const fileName = this.selectedFile.name.toLowerCase();
      const isForbidden = this.FORBIDDEN_EXTENSIONS.some(ext => fileName.endsWith(ext));
      if (isForbidden) {
        this.uploadError = 'Ce fichier n\'est pas autorisé (.exe, .bat, .sh et autres extensions dangereuses sont interdites)';
        this.selectedFile = null;
      }
    }
  }

  onExpirationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.expirationDays = parseInt(select.value);
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
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 400 && err.error) {
            this.uploadError = 'Ce fichier n\'est pas autorisé';
          } else {
            this.uploadError = 'Erreur lors de l\'upload';
          }
          this.isUploading = false;
          this.cdr.detectChanges();
          console.error(err);
        }
      });
  }

  onCopyLink(): void {
    const link = `http://localhost:4200/download/${this.downloadToken}`;
    navigator.clipboard.writeText(link);
  }
}