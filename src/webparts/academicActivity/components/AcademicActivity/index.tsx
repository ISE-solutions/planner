import * as React from 'react';
import AcademicActivityPage from './AcademicActivityPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface IAcademicActivityProps {
  context: WebPartContext;
}

const AcademicActivity: React.FC<IAcademicActivityProps> = ({ context }) => {
  return (
    <App context={context}>
      <AcademicActivityPage context={context} />
    </App>
  );
};

export default AcademicActivity;
