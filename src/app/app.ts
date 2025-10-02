import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HandicapCalculator } from './components/handicap-calculator/hcp-calc.component';
import { Welcome } from './components/welcome/welcome.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HandicapCalculator, Welcome],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('boggeymenUI');
}
