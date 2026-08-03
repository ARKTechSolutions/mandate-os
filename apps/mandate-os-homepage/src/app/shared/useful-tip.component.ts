import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-useful-tip',
  standalone: true,
  templateUrl: './useful-tip.component.html',
  styleUrl: './useful-tip.component.scss',
})
export class UsefulTipComponent {
  @Input() label = 'Useful tip';
  @Input({ required: true }) body!: string;
}
