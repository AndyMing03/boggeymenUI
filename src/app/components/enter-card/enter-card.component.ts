import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerService } from '../../services/players.service';
import { TrimDecimalPipe } from '../../pipes/trim-decimal.pipe';
import { Course } from '../../services/courses.service';
import { Spinner } from '../shared/spinner/spinner.component';

type HandicapCategory = 'category1' | 'category2' | 'category3' | 'category4' | 'category5';

interface AdjustmentRange {
  min: number;
  max: number;
  adjustment: number;
}

@Component({
  selector: 'app-enter-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimDecimalPipe, Spinner],
  templateUrl: './enter-card.component.html',
  styleUrls: ['./enter-card.component.css'],
})
export class EnterCard implements OnInit {
  @Input() players: Player[] = [];
  @Input() courses: Course[] = [];

  @ViewChildren('scoreInput') scoreInputs!: QueryList<ElementRef>;

  selectedCourse: any;
  selectedPlayer: any;

  playerHistory: any;

  isLoading: boolean = false;

  player: any = {
    scores: [],
  };

  totalPoints: number = 0;

  handicapAdjustmentTable: Record<HandicapCategory, AdjustmentRange[]> = {
    category1: [
      { min: 45, max: Infinity, adjustment: -3 },
      { min: 42, max: 44, adjustment: -1.5 },
      { min: 39, max: 41, adjustment: -0.8 },
      { min: 36, max: 38, adjustment: -0.4 },
      { min: 33, max: 35, adjustment: -0.2 },
      { min: 30, max: 32, adjustment: 0 },
      { min: 27, max: 29, adjustment: 0.1 },
      { min: 24, max: 26, adjustment: 0.4 },
      { min: 0, max: 23, adjustment: 0.7 },
    ],
    category2: [
      { min: 45, max: Infinity, adjustment: -3.5 },
      { min: 42, max: 44, adjustment: -2 },
      { min: 39, max: 41, adjustment: -1.2 },
      { min: 36, max: 38, adjustment: -0.6 },
      { min: 33, max: 35, adjustment: -0.4 },
      { min: 30, max: 32, adjustment: 0 },
      { min: 27, max: 29, adjustment: 0.1 },
      { min: 24, max: 26, adjustment: 0.3 },
      { min: 0, max: 23, adjustment: 0.6 },
    ],
    category3: [
      { min: 45, max: Infinity, adjustment: -4.5 },
      { min: 42, max: 44, adjustment: -2.6 },
      { min: 39, max: 41, adjustment: -1.5 },
      { min: 36, max: 38, adjustment: -1 },
      { min: 33, max: 35, adjustment: -0.5 },
      { min: 30, max: 32, adjustment: 0 },
      { min: 27, max: 29, adjustment: 0.2 },
      { min: 24, max: 26, adjustment: 0.4 },
      { min: 0, max: 23, adjustment: 0.8 },
    ],
    category4: [
      { min: 45, max: Infinity, adjustment: -5.5 },
      { min: 42, max: 44, adjustment: -4.5 },
      { min: 39, max: 41, adjustment: -2.5 },
      { min: 36, max: 38, adjustment: -1.5 },
      { min: 33, max: 35, adjustment: -1 },
      { min: 30, max: 32, adjustment: 0 },
      { min: 27, max: 29, adjustment: 0.2 },
      { min: 24, max: 26, adjustment: 0.4 },
      { min: 0, max: 23, adjustment: 1 },
    ],
    category5: [
      { min: 45, max: Infinity, adjustment: -6 },
      { min: 42, max: 44, adjustment: -5 },
      { min: 39, max: 41, adjustment: -4 },
      { min: 36, max: 38, adjustment: -3 },
      { min: 33, max: 35, adjustment: -2 },
      { min: 30, max: 32, adjustment: 0 },
      { min: 27, max: 29, adjustment: 0.1 },
      { min: 24, max: 26, adjustment: 0.5 },
      { min: 0, max: 23, adjustment: 1.2 },
    ],
  };

  adjustment: number = 0;

  constructor(private playerService: PlayerService) {}
  ngOnInit(): void {
    console.log('We have courses - ', this.courses);
  }

  onCourseSelect(course: Course) {
    this.selectedCourse = course;
  }

  onPlayerSelect(player: Player) {
    this.selectedPlayer = player;
    this.player.scores = [];
    this.isLoading = true;
    this.playerService.getPlayerHistory(player.id).subscribe((data) => {
      this.playerHistory = data;
      this.isLoading = false;
    });
  }

  submitPlayerScore(): void {
    const newHcp = parseFloat((+this.selectedPlayer.handicap + +this.adjustment).toFixed(1));
    this.isLoading = true;
    this.playerService.updateHandicap(this.selectedPlayer.id, newHcp, 'General round').subscribe({
      next: () => {
        console.log('Handicap updated successfully');

        // Reset course and scores
        this.selectedCourse = null;
        this.player.scores = [];

        // Fetch updated player history
        this.playerService.getPlayerHistory(this.selectedPlayer.id).subscribe({
          next: (data) => {
            this.playerHistory = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to fetch player history', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Failed to update handicap', err);
        this.isLoading = false;
      },
    });
  }

  getPlayerStablefordScore(player: any) {
    player = {
      ...player,
      hcp: this.selectedPlayer?.handicap ?? 0,
    };
    const stablefordPoints = [0, 1, 2, 3, 4, 5, 6]; // Points for scores relative to par
    let totalPoints = 0;

    Object.values(this.selectedCourse.holes).forEach((hole, index) => {
      const holeTyped = hole as any; // Cast the hole to type Hole
      const score = player.scores[index];

      // If the score is 0, skip this hole
      if (score === 0 || score === '' || !score) {
        return; // Continue to the next hole
      }

      // Calculate handicap strokes for the hole
      // const handicapAllowance =
      //   Math.floor(player.hcp / 18) + (player.hcp % 18 >= holeTyped.si ? 1 : 0);

      let handicapAllowance = 0;

      if (player.hcp > 0) {
        // Normal handicapper: receives strokes on hardest holes (SI 1, 2, ...)
        handicapAllowance = Math.floor(player.hcp / 18) + (player.hcp % 18 >= holeTyped.si ? 1 : 0);
      } else if (player.hcp < 0) {
        // Plus handicapper: gives strokes on easiest holes (SI 18, 17, ...)
        const absHcp = Math.abs(player.hcp);
        handicapAllowance = -Math.floor(absHcp / 18) - (absHcp % 18 >= 19 - holeTyped.si ? 1 : 0);
      }

      // Calculate net score and relative to par
      const netScore = score - handicapAllowance;
      const relativeToPar = holeTyped.par - netScore;

      // Determine Stableford points based on relativeToPar
      let points = 0;
      if (relativeToPar >= -2 && relativeToPar <= 4) {
        points = stablefordPoints[relativeToPar + 2]; // Map relativeToPar to stablefordPoints
      }
      totalPoints += points;
    });

    this.totalPoints = totalPoints;
    return totalPoints;
  }

  calculateNewHcp(): number {
    console.log(Math.round(this.selectedPlayer.handicap));
    let category: HandicapCategory;

    if (
      Math.round(this.selectedPlayer.handicap) >= 1 &&
      Math.round(this.selectedPlayer.handicap) <= 9
    )
      category = 'category1';
    else if (
      Math.round(this.selectedPlayer.handicap) >= 10 &&
      Math.round(this.selectedPlayer.handicap) <= 14
    )
      category = 'category2';
    else if (
      Math.round(this.selectedPlayer.handicap) >= 15 &&
      Math.round(this.selectedPlayer.handicap) <= 19
    )
      category = 'category3';
    else if (
      Math.round(this.selectedPlayer.handicap) >= 20 &&
      Math.round(this.selectedPlayer.handicap) <= 25
    )
      category = 'category4';
    else category = 'category5';

    console.log(category);

    const entry = this.handicapAdjustmentTable[category].find(
      (range) => this.totalPoints >= range.min && this.totalPoints <= range.max
    );

    this.adjustment = entry?.adjustment ?? 0;
    return entry?.adjustment ?? 0;
  }

  onScoreInput(index: number) {
    const value = this.player.scores[index];
    if (value !== null && value !== undefined && value.toString().length > 0) {
      const inputsArray = this.scoreInputs.toArray();
      const nextInput = inputsArray[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }
}
