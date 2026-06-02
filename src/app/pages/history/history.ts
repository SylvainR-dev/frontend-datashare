import { Component, OnInit, DestroyRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";

@Component({
  selector: "app-history",
  imports: [CommonModule],
  templateUrl: "./history.html",
  styleUrl: "./history.scss",
})
export class History implements OnInit {

  private fileService = inject(FileService);
  private destroyRef = inject(DestroyRef);

  files: any[] = [];
  loadError: string | null = null;

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.fileService.getFiles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (files: any[]) => {
          this.files = files;
          this.loadError = null;
        },
        error: (err: any) => {
          this.loadError = 'Erreur lors du chargement des fichiers';
          console.error(err);
        }
      });
  }

  deleteFile(id: number): void {
    this.fileService.deleteFile(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.files = this.files.filter(f => f.id !== id);
        },
        error: (err: any) => {
          this.loadError = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
  }
}