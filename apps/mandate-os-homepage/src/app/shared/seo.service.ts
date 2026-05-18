import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://getmandateos.com';
const DEFAULT_OG_IMAGE = '/og-homepage.png';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setMeta(input: SeoInput): void {
    const canonicalPath = input.path === '/' ? '' : input.path.replace(/\/$/, '');
    const canonical = `${SITE_ORIGIN}${canonicalPath || '/'}`;
    const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE;
    const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_ORIGIN}${ogImage}`;

    this.title.setTitle(input.title);
    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({ property: 'og:title', content: input.title });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: ogImageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: input.title });
    this.meta.updateTag({ name: 'twitter:description', content: input.description });
    this.meta.updateTag({ name: 'twitter:image', content: ogImageUrl });

    this.setCanonical(canonical);
  }

  private setCanonical(href: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
