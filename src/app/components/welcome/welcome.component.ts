import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerService } from '../../services/players.service';
import { TrimDecimalPipe } from '../../pipes/trim-decimal.pipe';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimDecimalPipe],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class Welcome implements OnInit {
  players: Player[] = [];
  constructor(private playerService: PlayerService) {}
  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;
    });
  }
}
