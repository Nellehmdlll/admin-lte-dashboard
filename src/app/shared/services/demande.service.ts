import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../models/demande.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private apiUrl = 'api/demandes'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  getDemande(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.apiUrl}/${id}`);
  }

  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(this.apiUrl, demande);
  }

  updateDemande(demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/${demande.id}`, demande);
  }
}
