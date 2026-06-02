import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Upload } from "./upload";
import { FileService } from "../../core/service/file.service";
import { of, throwError } from "rxjs";
import { vi } from "vitest";

describe("Upload", () => {
  let component: Upload;
  let fixture: ComponentFixture<Upload>;
  let fileServiceMock: any;

  beforeEach(async () => {
    fileServiceMock = {
      uploadFile: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Upload],
      providers: [
        { provide: FileService, useValue: fileServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Upload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Test 1 — le composant est créé
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test 2 — sélection d'un fichier
  it("should set selectedFile on file selection", () => {
    const file = new File(["contenu"], "test.pdf", { type: "application/pdf" });
    const event = { target: { files: [file] } } as any;
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);
  });

  // Test 3 — upload réussi
  it("should set uploadSuccess and downloadToken on successful upload", () => {
    const file = new File(["contenu"], "test.pdf", { type: "application/pdf" });
    component.selectedFile = file;
    fileServiceMock.uploadFile.mockReturnValue(of({ token: "mon-token-unique" }));

    component.onUpload();

    expect(component.uploadSuccess).toBe(true);
    expect(component.downloadToken).toBe("mon-token-unique");
    expect(component.uploadError).toBeNull();
  });

  // Test 4 — upload échoué
  it("should set uploadError on failed upload", () => {
    const file = new File(["contenu"], "test.pdf", { type: "application/pdf" });
    component.selectedFile = file;
    fileServiceMock.uploadFile.mockReturnValue(throwError(() => new Error("Erreur")));

    component.onUpload();

    expect(component.uploadError).toBe("Erreur lors de l'upload");
    expect(component.uploadSuccess).toBe(false);
  });

  // Test 5 — upload sans fichier sélectionné
  it("should not call uploadFile when no file selected", () => {
    component.selectedFile = null;
    component.onUpload();
    expect(fileServiceMock.uploadFile).not.toHaveBeenCalled();
  });
});