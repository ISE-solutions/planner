import * as React from 'react';
import ProgramModelPage from './ProgramModelPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface IProgramModel {
  context: WebPartContext;
}

const ProgramModel: React.FC<IProgramModel> = ({ context }) => {
  return (
    <App context={context}>
      <ProgramModelPage context={context} />
    </App>
  );
};

export default ProgramModel;
