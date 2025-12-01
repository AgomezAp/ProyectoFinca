import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateMetaTags(tags: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    if (tags.title) {
      this.title.setTitle(tags.title);
      this.meta.updateTag({ property: 'og:title', content: tags.title });
      this.meta.updateTag({ name: 'twitter:title', content: tags.title });
    }

    if (tags.description) {
      this.meta.updateTag({ name: 'description', content: tags.description });
      this.meta.updateTag({ property: 'og:description', content: tags.description });
      this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    }

    if (tags.keywords) {
      this.meta.updateTag({ name: 'keywords', content: tags.keywords });
    }

    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
      this.meta.updateTag({ name: 'twitter:image', content: tags.image });
    }

    if (tags.url) {
      this.meta.updateTag({ property: 'og:url', content: tags.url });
      this.meta.updateTag({ rel: 'canonical', href: tags.url });
    }

    if (tags.type) {
      this.meta.updateTag({ property: 'og:type', content: tags.type });
    }
  }

  updateStructuredData(data: any) {
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);
  }
}
