import { isPlatformServer } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
} from '@angular/core';

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

const DEMO_INSTALL_STATE_KEY = makeStateKey<DemoInstallConnection>(
  'demo-install-connection',
);

@Injectable({ providedIn: 'root' })
export class DemoInstallService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState, { optional: true });
  private connectionPromise: Promise<DemoInstallConnection> | undefined;

  async getConnection(): Promise<DemoInstallConnection> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const transferred = this.readTransferredConnection();
    if (transferred) {
      this.connectionPromise = Promise.resolve(transferred);
      return this.connectionPromise;
    }

    this.connectionPromise = this.fetchConnection().then((connection) => {
      this.storeTransferredConnection(connection);
      return connection;
    });
    return this.connectionPromise;
  }

  private readTransferredConnection(): DemoInstallConnection | null {
    if (!this.transferState?.hasKey(DEMO_INSTALL_STATE_KEY)) {
      return null;
    }

    const connection = this.transferState.get(DEMO_INSTALL_STATE_KEY, null);
    if (!isPlatformServer(this.platformId)) {
      this.transferState.remove(DEMO_INSTALL_STATE_KEY);
    }

    return connection;
  }

  private storeTransferredConnection(connection: DemoInstallConnection): void {
    if (isPlatformServer(this.platformId) && this.transferState) {
      this.transferState.set(DEMO_INSTALL_STATE_KEY, connection);
    }
  }

  private async fetchConnection(): Promise<DemoInstallConnection> {
    try {
      const response = await fetch(DEMO_INSTALL_ENDPOINT, {
        headers: { accept: 'application/json' },
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
    } catch (error) {
      // Clear the memoized promise so a later call can retry after a failure.
      this.connectionPromise = undefined;
      throw error;
    }
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
