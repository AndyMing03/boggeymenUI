import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerService } from '../../services/players.service';
import { TrimDecimalPipe } from '../../pipes/trim-decimal.pipe';
import { Spinner } from '../shared/spinner/spinner.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, FormsModule, TrimDecimalPipe, Spinner],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class Welcome implements OnInit {
  @Input() players: Player[] = [];
  @Input() isLoading: boolean = false;
  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {}
}
