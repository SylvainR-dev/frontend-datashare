import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Download } from "./download";
import { FileService } from "../../core/service/file.service";
import { ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";
import { vi } from "vitest";

describe("Download", () => {
  let component: Download;
  let fixture: ComponentFixture<Download>;
  let fileServiceMock: any;

  beforeEach(async () => {
    fileServiceMock = {
      getFileByToken: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Download],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'mon-token-unique'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Download);
    component = fixture.componentInstance;
  });

  // Test 1 — le composant est créé
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test 2 — charge les infos du fichier au démarrage
  it("should load file info on init", async () => {
    fileServiceMock.getFileByToken.mockReturnValue(of({
      name: "test.pdf",
      size: 1024,
      token: "mon-token-unique"
    }));

    await fixture.whenStable();

    expect(component.fileInfo).toBeTruthy();
    expect(component.fileInfo.name).toBe("test.pdf");
    expect(component.downloadError).toBeNull();
  });

  // Test 3 — gère l'erreur si token invalide
  it("should set downloadError on invalid token", async () => {
    fileServiceMock.getFileByToken.mockReturnValue(
      throwError(() => new Error("Token invalide"))
    );

    await fixture.whenStable();

    expect(component.downloadError).toBe("Fichier introuvable ou lien expiré");
    expect(component.fileInfo).toBeNull();
  });

  // Test 4 — token récupéré depuis l'URL
  it("should get token from route params", async () => {
    fileServiceMock.getFileByToken.mockReturnValue(of({}));
    await fixture.whenStable();
    expect(component.token).toBe("mon-token-unique");
  });
});