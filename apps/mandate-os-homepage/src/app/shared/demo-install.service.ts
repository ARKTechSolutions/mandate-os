import { Injectable } from '@angular/core';

export type DemoInstallConnection = {
  baseUrl: string;
  bearerToken: string;
  mandate: {
    id: string;
    name: string;
    description: string;
  };
};

type DemoInstallPayload = {
  data?: Partial<DemoInstallConnection>;
};

// This is only the discovery endpoint. The runtime URL, bearer token, and
// mandate id are supplied by the control-plane API response, never bundled
// into the public homepage's JavaScript.
const DEMO_INSTALL_ENDPOINT =
  'https://api.getmandateos.com/api/public/demo-install';

@Injectable({ providedIn: 'root' })
export class DemoInstallService {
  async getConnection(): Promise<DemoInstallConnection> {
    const response = await fetch(DEMO_INSTALL_ENDPOINT, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(
        `Demo configuration request failed with ${response.status}.`,
      );
    }

    const payload = (await response.json()) as DemoInstallPayload;
    if (!isDemoInstallConnection(payload.data)) {
      throw new Error('Demo configuration response was incomplete.');
    }

    return payload.data;
  }
}

function isDemoInstallConnection(
  value: Partial<DemoInstallConnection> | undefined,
): value is DemoInstallConnection {
  return Boolean(
    value &&
    isNonEmptyString(value.baseUrl) &&
    isNonEmptyString(value.bearerToken) &&
    value.mandate &&
    isNonEmptyString(value.mandate.id) &&
    isNonEmptyString(value.mandate.name) &&
    isNonEmptyString(value.mandate.description),
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
