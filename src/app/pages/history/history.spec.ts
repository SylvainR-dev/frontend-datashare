import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { History } from "./history";
import { FileService } from "../../core/service/file.service";
import { of, throwError } from "rxjs";
import { vi } from "vitest";

describe("History", () => {
  let component: History;
  let fixture: ComponentFixture<History>;
  let fileServiceMock: any;

  beforeEach(async () => {
    fileServiceMock = {
      getFiles: vi.fn(),
      deleteFile: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [History, RouterModule],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
  });

  // Test 1 — le composant est créé
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test 2 — charge les fichiers au démarrage
  it("should load files on init", async () => {
    fileServiceMock.getFiles.mockReturnValue(of([
      { id: 1, name: "fichier1.pdf", size: 1024 },
      { id: 2, name: "fichier2.pdf", size: 2048 }
    ]));

    await fixture.whenStable();

    expect(component.files.length).toBe(2);
    expect(component.files[0].name).toBe("fichier1.pdf");
    expect(component.loadError).toBeNull();
  });

  // Test 3 — gère l'erreur de chargement
  it("should set loadError on failed load", async () => {
    fileServiceMock.getFiles.mockReturnValue(
      throwError(() => new Error("Erreur serveur"))
    );

    await fixture.whenStable();

    expect(component.loadError).toBe("Erreur lors du chargement des fichiers");
    expect(component.files.length).toBe(0);
  });

  // Test 4 — supprime un fichier
  it("should remove file from list on delete", async () => {
    fileServiceMock.getFiles.mockReturnValue(of([
      { id: 1, name: "fichier1.pdf" },
      { id: 2, name: "fichier2.pdf" }
    ]));
    fileServiceMock.deleteFile.mockReturnValue(of(null));

    await fixture.whenStable();
    component.deleteFile(1);

    expect(component.files.length).toBe(1);
    expect(component.files[0].id).toBe(2);
  });

  // Test 5 — gère l'erreur de suppression
  it("should set loadError on failed delete", async () => {
    fileServiceMock.getFiles.mockReturnValue(of([
      { id: 1, name: "fichier1.pdf" }
    ]));
    fileServiceMock.deleteFile.mockReturnValue(
      throwError(() => new Error("Erreur suppression"))
    );

    await fixture.whenStable();
    component.deleteFile(1);

    expect(component.loadError).toBe("Erreur lors de la suppression");
  });
});