import * as React from 'react';
import BatchEditionPage from './BatchEditionPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface IBatchEdition {
  context: WebPartContext;
}

const BatchEdition: React.FC<IBatchEdition> = ({ context }) => {
  return (
    <App context={context}>
      <BatchEditionPage context={context} />
    </App>
  );
};

export default BatchEdition;
