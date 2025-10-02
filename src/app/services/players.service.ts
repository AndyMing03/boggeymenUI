import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  handicap: number;
  year_joined: number;
  // Add other fields as needed
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'https://boggeymenapi.onrender.com/players';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }
}
