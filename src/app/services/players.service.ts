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
  private playerHistoryUrl = 'https://boggeymenapi.onrender.com/players/history/';
  private updatePlayerHandicapUrl = 'https://boggeymenapi.onrender.com/players/:id/handicap';

  //   private apiUrl = 'http://localhost:3000/players';
  //   private playerHistoryUrl = 'http://localhost:3000/players/history/';
  //   private updatePlayerHandicapUrl = 'http://localhost:3000/players/:id/handicap';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getPlayerHistory(id: number): Observable<Player[]> {
    return this.http.get<Player[]>(this.playerHistoryUrl + id);
  }

  updateHandicap(id: number, newHandicap: number, reason: string): Observable<any> {
    const body = {
      newHandicap,
      reason,
    };

    const url = this.updatePlayerHandicapUrl.replace(':id', id.toString());
    return this.http.patch(url, body);
  }
}
