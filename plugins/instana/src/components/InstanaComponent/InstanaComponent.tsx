import * as React from 'react';
import { Typography, Grid } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { InstanaFetchComponent } from '../instanaFetchComponent';

export const InstanaComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to instana!" subtitle="Free your Dev+Ops teams from the burden of manual observability and application monitoring">
      <HeaderLabel label="Owner" value="IBM CE" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Services belong to application: KTs">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <InstanaFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
