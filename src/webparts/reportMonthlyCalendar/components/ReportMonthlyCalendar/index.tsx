import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportMonthlyCalendarPage from './ReportMonthlyCalendarPage';

interface IReport {
  context: WebPartContext;
}

const ReportMonthlyCalendar: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportMonthlyCalendarPage context={context} />
    </App>
  );
};

export default ReportMonthlyCalendar;
