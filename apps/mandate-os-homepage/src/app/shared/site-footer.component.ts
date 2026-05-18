import { Component } from '@angular/core';
import { MANDATE_OS_CONTENT } from '../mandate-os-content';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  protected readonly content = MANDATE_OS_CONTENT;
  protected readonly year = new Date().getFullYear();
}
