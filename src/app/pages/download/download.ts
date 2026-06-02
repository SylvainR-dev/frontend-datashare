import { Component, OnInit, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";

@Component({
  selector: "app-download",
  imports: [CommonModule],
  templateUrl: "./download.html",
  styleUrl: "./download.scss",
})
export class Download implements OnInit {

  private fileService = inject(FileService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

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
          this.fileInfo = file;
          this.downloadError = null;
        },
        error: (err: any) => {
          this.downloadError = 'Fichier introuvable ou lien expiré';
          console.error(err);
        }
      });
  }
}