import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";

@Component({
  selector: "app-download",
  imports: [CommonModule, RouterModule],
  templateUrl: "./download.html",
  styleUrl: "./download.scss",
})
export class Download implements OnInit {

  private fileService = inject(FileService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  fileInfo: any = null;
  downloadError: string | null = null;
  token: string | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token) {
      this.loadFileInfo(this.token);
    }
  }

  loadFileInfo(token: string): void {
    this.fileService.getFileByToken(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (file: any) => {
          console.log('Fichier reçu:', file);
          this.fileInfo = file;
          this.downloadError = null;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('Erreur:', err);
          this.downloadError = 'Fichier introuvable ou lien expiré';
          this.cdr.detectChanges();
        }
      });
  }

  onDownload(): void {
    if (!this.fileInfo) return;
    this.fileService.getDownloadUrl(this.fileInfo.token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (url: string) => {
          window.open(url, '_blank');
        },
        error: (err: any) => {
          console.log('Erreur URL pré-signée:', err);
        }
      });
  }
}