import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  holes: [
    {
      par: number;
      si: number;
    }
  ];
}

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private apiUrl = 'https://boggeymenapi.onrender.com/courses';
  // private apiUrl = 'http://localhost:3000/courses';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
}
