import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appServerConfig } from './app/app.server.config';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, appServerConfig, context);

export default bootstrap;
