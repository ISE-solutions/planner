import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import TimeReportPage from './TimeReportPage';

interface ITimeReport {
  context: WebPartContext;
}

const TimeReport: React.FC<ITimeReport> = ({ context }) => {
  return (
    <App context={context}>
      <TimeReportPage context={context} />
    </App>
  );
};

export default TimeReport;
