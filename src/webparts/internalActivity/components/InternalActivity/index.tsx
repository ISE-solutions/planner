import * as React from 'react';
import InternalActivityPage from './InternalActivityPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface IInternalActivityProps {
  context: WebPartContext;
}

const InternalActivity: React.FC<IInternalActivityProps> = ({ context }) => {
  return (
    <App context={context}>
      <InternalActivityPage context={context} />
    </App>
  );
};

export default InternalActivity;
