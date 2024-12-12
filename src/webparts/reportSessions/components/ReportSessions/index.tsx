import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportSessionsPage from './ReportSessionsPage';

interface IReport {
  context: WebPartContext;
}

const ReportSessions: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportSessionsPage context={context} />
    </App>
  );
};

export default ReportSessions;
