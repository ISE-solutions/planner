import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportCalendarByPersonPage from './ReportCalendarByPersonPage';

interface IReport {
  context: WebPartContext;
}

const ReportCalendarByPerson: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportCalendarByPersonPage context={context} />
    </App>
  );
};

export default ReportCalendarByPerson;
