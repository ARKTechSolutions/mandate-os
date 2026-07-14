import { Injectable } from '@angular/core';

export type DemoInstallTest = {
  id: string;
  decision: 'allowed' | 'approval' | 'blocked';
  description: string;
  commands: {
    macOsLinux: string;
    windowsPowerShell: string;
  };
};

export type DemoInstallConnection = {
  baseUrl: string;
  bearerToken: string;
  mandate: {
    id: string;
    name: string;
    description: string;
  };
  tests: readonly DemoInstallTest[];
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
    isNonEmptyString(value.mandate.description) &&
    Array.isArray(value.tests) &&
    value.tests.length > 0 &&
    value.tests.every(isDemoInstallTest),
  );
}

function isDemoInstallTest(value: unknown): value is DemoInstallTest {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const test = value as Partial<DemoInstallTest>;
  return (
    isNonEmptyString(test.id) &&
    (test.decision === 'allowed' ||
      test.decision === 'approval' ||
      test.decision === 'blocked') &&
    isNonEmptyString(test.description) &&
    Boolean(test.commands) &&
    isNonEmptyString(test.commands?.macOsLinux) &&
    isNonEmptyString(test.commands?.windowsPowerShell)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
