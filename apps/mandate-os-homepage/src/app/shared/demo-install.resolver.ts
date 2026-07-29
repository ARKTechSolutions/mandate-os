import { inject } from '@angular/core';
import { type ResolveFn } from '@angular/router';
import {
  DemoInstallService,
  type DemoInstallConnection,
} from './demo-install.service';

export const demoInstallResolver: ResolveFn<DemoInstallConnection | null> =
  async () => {
    try {
      return await inject(DemoInstallService).getConnection();
    } catch {
      return null;
    }
  };
