import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { instanaPlugin, InstanaPage } from '../src/plugin';

createDevApp()
  .registerPlugin(instanaPlugin)
  .addPage({
    element: <InstanaPage />,
    title: 'Root Page',
    path: '/instana'
  })
  .render();
