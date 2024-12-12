import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportAnualCalendarPage from './ReportAnualCalendarPage';

interface IReport {
  context: WebPartContext;
}

const ReportAnualCalendar: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportAnualCalendarPage context={context} />
    </App>
  );
};

export default ReportAnualCalendar;
