import { MANDATE_OS_CONTENT } from '../mandate-os-content';

export const HOME_CONTENT = {
  brandTagline: MANDATE_OS_CONTENT.brandTagline,
  hero: MANDATE_OS_CONTENT.hero,
  proofStrip: MANDATE_OS_CONTENT.proofStrip,
  heroPanel: MANDATE_OS_CONTENT.heroPanel,
  integrationsSummary: {
    eyebrow: MANDATE_OS_CONTENT.integrations.eyebrow,
    title: MANDATE_OS_CONTENT.integrations.title,
    body: MANDATE_OS_CONTENT.integrations.body,
    statusSummary: MANDATE_OS_CONTENT.integrations.statusSummary,
    items: MANDATE_OS_CONTENT.integrations.items,
  },
  finalCta: {
    ...MANDATE_OS_CONTENT.finalCta,
    primaryHref: '/docs/install',
    secondaryHref: 'https://github.com/ARKTechSolutions/mandate-os',
  },
} as const;
