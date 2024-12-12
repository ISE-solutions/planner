import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ConflictManagementPage from './ConflictManagementPage';

interface IConflictManagmentProps {
  context: WebPartContext;
}

const ConflictManagment: React.FC<IConflictManagmentProps> = ({ context }) => {
  return (
    <App context={context}>
      <ConflictManagementPage context={context} />
    </App>
  );
};

export default ConflictManagment;
