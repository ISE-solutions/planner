import * as React from 'react';
import ProgramPage from './ProgramPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface IProgram {
  context: WebPartContext;
}

const Program: React.FC<IProgram> = ({ context }) => {
  return (
    <App context={context}>
      <ProgramPage context={context} />
    </App>
  );
};

export default Program;
