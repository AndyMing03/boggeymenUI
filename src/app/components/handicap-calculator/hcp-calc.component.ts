import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Define the type for a hole on the course
export interface Hole {
  si: number; // Stroke index
  par: number; // Par value for the hole
}

// Define the type for the course
export interface Course {
  [hole: string]: Hole;
}

// Define the type for the player
export interface Player {
  hcp: number; // Handicap
  scores: number[]; // Array of scores
}

@Component({
  selector: 'app-hcp-calc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hcp-calc.component.html',
  styleUrls: ['./hcp-calc.component.css'],
})
export class HandicapCalculator implements OnInit {
  course: any = {
    one: { si: 9, par: 4 },
    two: { si: 8, par: 3 },
    three: { si: 7, par: 4 },
    four: { si: 6, par: 3 },
    five: { si: 5, par: 4 },
    six: { si: 4, par: 4 },
    seven: { si: 3, par: 5 },
    eight: { si: 2, par: 4 },
    nine: { si: 1, par: 4 },
    ten: { si: 18, par: 3 },
    eleven: { si: 17, par: 3 },
    twelve: { si: 16, par: 5 },
    thirteen: { si: 15, par: 4 },
    fourteen: { si: 14, par: 4 },
    fifteen: { si: 13, par: 4 },
    sixteen: { si: 12, par: 3 },
    seventeen: { si: 11, par: 4 },
    eighteen: { si: 10, par: 5 },
  };

  players: any = [
    {
      playerName: 'Marty',
      hcp: 18,
      scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      playerName: 'Ryan',
      hcp: 10,
      scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      playerName: 'Conor McL',
      hcp: 12,
      scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      playerName: 'Gav S',
      hcp: -3,
      scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  player1: any = {
    hcp: 0,
    scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // scores: [4,5,4,4,6,6,6,5,5,6,5,4,5,6,4,4,5,6]
    // scores: [4,3,4,3,4,4,5,4,4,3,3,5,4,4,4,3,4,5] //even
  };

  playersPlacing: any = [];
  courseArray: any;

  ngOnInit(): void {
    this.courseArray = Object.values(this.course);
  }

  getPlayerStablefordScore(player: any) {
    console.log();
    const stablefordPoints = [0, 1, 2, 3, 4, 5, 6]; // Points for scores relative to par
    let totalPoints = 0;

    Object.values(this.course).forEach((hole, index) => {
      const holeTyped = hole as Hole; // Cast the hole to type Hole
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

    this.playersPlacing = this.findOrInsertAndSort(player.playerName, totalPoints);
    return totalPoints;
  }

  findOrInsertAndSort(name: any, score: any) {
    // Search for the player by name
    const playerIndex = this.playersPlacing.findIndex((player: any) => player.playerName === name);

    if (playerIndex !== -1) {
      // Player exists, update their score
      this.playersPlacing[playerIndex].score = score;
      console.log(`Updated player: ${name} with score: ${score}`);
    } else {
      // Player does not exist, insert new player
      this.playersPlacing.push({ playerName: name, score: score });
      console.log(`Added new player: ${name} with score: ${score}`);
    }

    // Sort the array by score in descending order (highest to lowest)
    this.playersPlacing.sort((a: any, b: any) => b.score - a.score);

    return this.playersPlacing;
  }
}
