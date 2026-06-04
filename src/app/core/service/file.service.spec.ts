import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { FileService } from "./file.service";
import { of, throwError } from "rxjs";
import { vi } from "vitest";

describe("FileService", () => {
  let service: FileService;
  let httpClientMock: any;

  beforeEach(() => {
    httpClientMock = {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        FileService,
        { provide: HttpClient, useValue: httpClientMock }
      ]
    });

    service = TestBed.inject(FileService);
  });

  // Test 1 — le service est créé
  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // Test 2 — uploadFile appelle POST /api/files
  it("should call POST /files on uploadFile", () => {
    const file = new File(["contenu"], "test.pdf", { type: "application/pdf" });
    const metadata = { name: "test.pdf", size: 1024 };
    httpClientMock.post.mockReturnValue(of({ token: "mon-token-unique" }));

    service.uploadFile(file, metadata).subscribe((response: any) => {
      expect(response.token).toBe("mon-token-unique");
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(
      "http://localhost:8080/api/files",
      expect.any(FormData)
    );
  });

  // Test 3 — uploadFile gère les erreurs
  it("should handle error on uploadFile", () => {
    const file = new File(["contenu"], "test.pdf", { type: "application/pdf" });
    const metadata = { name: "test.pdf", size: 1024 };
    httpClientMock.post.mockReturnValue(throwError(() => new Error("Erreur serveur")));

    service.uploadFile(file, metadata).subscribe({
      error: (err: any) => {
        expect(err.message).toBe("Erreur serveur");
      }
    });
  });

  // Test 4 — getFileByToken appelle GET /api/files/{token}
  it("should call GET /files/{token} on getFileByToken", () => {
    httpClientMock.get.mockReturnValue(of({ name: "test.pdf", token: "mon-token" }));

    service.getFileByToken("mon-token").subscribe((response: any) => {
      expect(response.token).toBe("mon-token");
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/files/mon-token"
    );
  });

  // Test 5 — getFiles appelle GET /api/files
  it("should call GET /files on getFiles", () => {
    httpClientMock.get.mockReturnValue(of([
      { id: 1, name: "fichier1.pdf" },
      { id: 2, name: "fichier2.pdf" }
    ]));

    service.getFiles().subscribe((files: any[]) => {
      expect(files.length).toBe(2);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      "http://localhost:8080/api/files"
    );
  });

  // Test 6 — deleteFile appelle DELETE /api/files/{id}
  it("should call DELETE /files/{id} on deleteFile", () => {
    httpClientMock.delete.mockReturnValue(of(null));

    service.deleteFile(1).subscribe();

    expect(httpClientMock.delete).toHaveBeenCalledWith(
      "http://localhost:8080/api/files/1"
    );
  });

  // Test 7 — deleteFile gère les erreurs
  it("should handle error on deleteFile", () => {
    httpClientMock.delete.mockReturnValue(throwError(() => new Error("Erreur suppression")));

    service.deleteFile(1).subscribe({
      error: (err: any) => {
        expect(err.message).toBe("Erreur suppression");
      }
    });
  });
});