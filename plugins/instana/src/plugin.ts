import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const instanaPlugin = createPlugin({
  id: 'instana',
  routes: {
    root: rootRouteRef,
  },
});

export const InstanaPage = instanaPlugin.provide(
  createRoutableExtension({
    name: 'InstanaPage',
    component: () =>
      import('./components/InstanaComponent').then(m => m.InstanaComponent),
    mountPoint: rootRouteRef,
  }),
);
