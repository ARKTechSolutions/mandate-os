import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component').then((m) => m.HomePageComponent),
    data: {
      title: 'MandateOS',
      description: 'Guardrails, approvals, and receipts for agent action',
    },
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./pages/docs/docs-layout.component').then((m) => m.DocsLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/docs/docs-index.component').then((m) => m.DocsIndexComponent),
      },
      {
        path: 'install',
        loadComponent: () =>
          import('./pages/docs/install/install-page.component').then((m) => m.InstallPageComponent),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./pages/docs/security/security-page.component').then((m) => m.SecurityPageComponent),
      },
      {
        path: 'evidence',
        loadComponent: () =>
          import('./pages/docs/evidence/evidence-page.component').then((m) => m.EvidencePageComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./pages/docs/faq/faq-page.component').then((m) => m.FaqPageComponent),
      },
      {
        path: 'integrations',
        loadComponent: () =>
          import('./pages/docs/integrations/integrations-index.component').then(
            (m) => m.IntegrationsIndexComponent,
          ),
      },
      {
        path: 'integrations/codex',
        loadComponent: () =>
          import('./pages/docs/integrations/host-page.component').then((m) => m.HostPageComponent),
        data: { host: 'codex' },
      },
      {
        path: 'integrations/cursor',
        loadComponent: () =>
          import('./pages/docs/integrations/host-page.component').then((m) => m.HostPageComponent),
        data: { host: 'cursor' },
      },
      {
        path: 'integrations/claude-code',
        loadComponent: () =>
          import('./pages/docs/integrations/host-page.component').then((m) => m.HostPageComponent),
        data: { host: 'claude-code' },
      },
      {
        path: 'integrations/openclaw',
        loadComponent: () =>
          import('./pages/docs/integrations/host-page.component').then((m) => m.HostPageComponent),
        data: { host: 'openclaw' },
      },
      {
        path: 'integrations/github',
        loadComponent: () =>
          import('./pages/docs/integrations/host-page.component').then((m) => m.HostPageComponent),
        data: { host: 'github', planned: true },
      },
    ],
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import('./pages/pricing/pricing-placeholder.component').then((m) => m.PricingPlaceholderComponent),
  },
  { path: '**', redirectTo: '' },
];
