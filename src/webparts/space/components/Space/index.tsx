import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import SpacePage from './SpacePage';

const Space: React.FC<{ context: WebPartContext }> = ({ context }) => {
  return (
    <App context={context}>
      <SpacePage context={context} />
    </App>
  );
};

export default Space;
