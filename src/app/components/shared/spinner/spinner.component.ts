import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class Spinner implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() text: string = `You've teed' off!`;

  constructor() {}
  ngOnInit(): void {}
}
