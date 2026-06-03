import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FileService {

  private apiUrl = `${environment.apiUrl}/api/files`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File, metadata: { name: string; size: number; expirationDate?: string }): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    return this.http.post(this.apiUrl, formData);
  }

  getFileByToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${token}`);
  }

  getDownloadUrl(token: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/${token}/download-url`, { responseType: 'text' });
  }

  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}