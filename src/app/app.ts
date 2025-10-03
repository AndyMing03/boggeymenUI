import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HandicapCalculator } from './components/handicap-calculator/hcp-calc.component';
import { Welcome } from './components/welcome/welcome.component';
import { Player, PlayerService } from './services/players.service';
import { EnterCard } from './components/enter-card/enter-card.component';
import { Course, CoursesService } from './services/courses.service';
import { Spinner } from './components/shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HandicapCalculator, Welcome, EnterCard, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('boggeymenUI');

  players: Player[] = [];
  courses: Course[] = [];
  isLoading: boolean = false;
  constructor(private playerService: PlayerService, private courseService: CoursesService) {}
  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
      this.isLoading = true;
    });

    this.courseService.getCourses().subscribe((data) => {
      this.courses = data;
    });
  }
}
