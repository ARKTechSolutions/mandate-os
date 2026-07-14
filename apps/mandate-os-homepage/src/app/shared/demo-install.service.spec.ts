import { DemoInstallService } from './demo-install.service';

describe('DemoInstallService', () => {
  const originalFetch = globalThis.fetch;

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
              id: 'local-directory-create',
              decision: 'allowed',
              description: 'Create a local directory.',
              commands: {
                macOsLinux: 'mkdir .mandateos-demo',
                windowsPowerShell: 'mkdir .mandateos-demo',
              },
            },
          ],
        },
      }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(new DemoInstallService().getConnection()).resolves.toEqual({
      baseUrl: 'https://api.example/demo',
      bearerToken: 'demo.public-token',
      mandate: {
        id: 'mdt_demo',
        name: 'Demo mandate',
        description: 'A safe demo policy.',
      },
      tests: [
        {
          id: 'local-directory-create',
          decision: 'allowed',
          description: 'Create a local directory.',
          commands: {
            macOsLinux: 'mkdir .mandateos-demo',
            windowsPowerShell: 'mkdir .mandateos-demo',
          },
        },
      ],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.getmandateos.com/api/public/demo-install',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('rejects an incomplete response instead of returning placeholder values', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { baseUrl: 'https://api.example/demo' } }),
    }) as unknown as typeof fetch;

    await expect(new DemoInstallService().getConnection()).rejects.toThrow(
      'Demo configuration response was incomplete.',
    );
  });
});
