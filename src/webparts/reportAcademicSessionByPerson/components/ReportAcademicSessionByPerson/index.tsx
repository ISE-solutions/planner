import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportAcademicSessionByPersonPage from './ReportAcademicSessionByPersonPage';

interface IReport {
  context: WebPartContext;
}

const ReportAcademicSessionByPerson: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportAcademicSessionByPersonPage context={context} />
    </App>
  );
};

export default ReportAcademicSessionByPerson;
