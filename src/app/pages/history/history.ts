import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FileService } from "../../core/service/file.service";
import { AuthService } from "../../core/service/auth.service";

@Component({
  selector: "app-history",
  imports: [CommonModule, RouterLink],
  templateUrl: "./history.html",
  styleUrl: "./history.scss",
})
export class History implements OnInit {

  private fileService = inject(FileService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  files: any[] = [];
  loadError: string | null = null;
  activeFilter: string = 'tous';
  isSidebarOpen: boolean = false;

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
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.loadError = 'Erreur lors du chargement des fichiers';
          this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.loadError = 'Erreur lors de la suppression';
          this.cdr.detectChanges();
          console.error(err);
        }
      });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  get filteredFiles(): any[] {
    const now = new Date();
    if (this.activeFilter === 'actifs') {
      return this.files.filter(f => new Date(f.expirationDate) > now);
    } else if (this.activeFilter === 'expirés') {
      return this.files.filter(f => new Date(f.expirationDate) <= now);
    }
    return this.files;
  }

  isExpired(file: any): boolean {
    return new Date(file.expirationDate) <= new Date();
  }
}