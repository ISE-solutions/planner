import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportAcademicSessionByMonthPage from './ReportAcademicSessionByMonthPage';

interface IReport {
  context: WebPartContext;
}

const ReportAcademicSessionByMonth: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportAcademicSessionByMonthPage context={context} />
    </App>
  );
};

export default ReportAcademicSessionByMonth;
