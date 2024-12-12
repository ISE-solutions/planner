import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportCriticalDaysPage from './ReportCriticalDaysPage';

interface IReport {
  context: WebPartContext;
}

const ReportCriticalDays: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportCriticalDaysPage context={context} />
    </App>
  );
};

export default ReportCriticalDays;
