import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HostContent, HOSTS } from '../../../content/integrations.content';
import { SeoService } from '../../../shared/seo.service';

@Component({
  selector: 'host-page',
  standalone: true,
  templateUrl: './host-page.component.html',
  styleUrl: './host-page.component.scss',
})
export class HostPageComponent implements OnInit {
  protected host!: HostContent;
  protected planned = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const hostKey = data['host'] as string;
    this.host = HOSTS[hostKey];
    this.planned = data['planned'] === true || this.host?.planned === true;

    this.seo.setMeta({
      title: `${this.host.name} — MandateOS Integration`,
      description: this.host.summary,
      path: `/docs/integrations/${this.host.slug}`,
    });
  }
}
