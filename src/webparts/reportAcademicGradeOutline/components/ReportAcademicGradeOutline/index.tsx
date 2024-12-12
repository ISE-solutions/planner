import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportAcademicGradeOutlinePage from './ReportAcademicGradeOutlinePage';

interface IReport {
  context: WebPartContext;
}

const ReportAcademicGradeOutline: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportAcademicGradeOutlinePage context={context} />
    </App>
  );
};

export default ReportAcademicGradeOutline;
