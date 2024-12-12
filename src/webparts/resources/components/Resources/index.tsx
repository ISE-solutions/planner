import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ResourcesPage from './ResourcesPage';

interface IResources {
  context: WebPartContext;
}

const Resources: React.FC<IResources> = ({ context }) => {
  return (
    <App context={context}>
      <ResourcesPage context={context} />
    </App>
  );
};

export default Resources;
