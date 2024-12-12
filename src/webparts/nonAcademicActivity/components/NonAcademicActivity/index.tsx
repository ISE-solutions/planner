import * as React from 'react';
import NonAcademicActivityPage from './NonAcademicActivityPage';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { App } from '~/components';

interface INonAcademicActivityProps {
  context: WebPartContext;
}

const NonAcademicActivity: React.FC<INonAcademicActivityProps> = ({
  context,
}) => {
  return (
    <App context={context}>
      <NonAcademicActivityPage context={context} />
    </App>
  );
};

export default NonAcademicActivity;
