import { TestBed } from '@angular/core/testing';
import { DemoInstallService } from './demo-install.service';

describe('DemoInstallService', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('loads the connection values from the demo API response', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          baseUrl: 'https://api.example/demo',
          bearerToken: 'demo.public-token',
          mandate: {
            id: 'mdt_demo',
            name: 'Demo mandate',
            description: 'A safe demo policy.',
          },
          tests: [
            {
              id: 'package-publish-dry-run',
              decision: 'approval',
              description:
                'A dry-run package publish requires human approval before the agent runs it.',
              commands: {
                macOsLinux: 'pnpm publish --dry-run',
                windowsPowerShell: 'pnpm publish --dry-run',
              },
            },
            {
              id: 'destructive-delete',
              decision: 'blocked',
              description:
                'Destructive deletion of .mandateos-blocked is outside the demo safety boundary and is blocked.',
              commands: {
                macOsLinux: 'rm -rf .mandateos-blocked',
                windowsPowerShell:
                  'Remove-Item .mandateos-blocked -Recurse -Force',
              },
            },
          ],
        },
      }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const service = TestBed.inject(DemoInstallService);

    await expect(service.getConnection()).resolves.toEqual({
      baseUrl: 'https://api.example/demo',
      bearerToken: 'demo.public-token',
      mandate: {
        id: 'mdt_demo',
        name: 'Demo mandate',
        description: 'A safe demo policy.',
      },
      tests: [
        {
          id: 'package-publish-dry-run',
          decision: 'approval',
          description:
            'A dry-run package publish requires human approval before the agent runs it.',
          commands: {
            macOsLinux: 'pnpm publish --dry-run',
            windowsPowerShell: 'pnpm publish --dry-run',
          },
        },
        {
          id: 'destructive-delete',
          decision: 'blocked',
          description:
            'Destructive deletion of .mandateos-blocked is outside the demo safety boundary and is blocked.',
          commands: {
            macOsLinux: 'rm -rf .mandateos-blocked',
            windowsPowerShell: 'Remove-Item .mandateos-blocked -Recurse -Force',
          },
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.getmandateos.com/api/public/demo-install',
      expect.objectContaining({
        headers: { accept: 'application/json' },
      }),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await expect(service.getConnection()).resolves.toEqual({
      baseUrl: 'https://api.example/demo',
      bearerToken: 'demo.public-token',
      mandate: {
        id: 'mdt_demo',
        name: 'Demo mandate',
        description: 'A safe demo policy.',
      },
      tests: expect.any(Array),
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects an incomplete response instead of returning placeholder values', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { baseUrl: 'https://api.example/demo' } }),
    }) as unknown as typeof fetch;

    const service = TestBed.inject(DemoInstallService);

    await expect(service.getConnection()).rejects.toThrow(
      'Demo configuration response was incomplete.',
    );
  });
});
