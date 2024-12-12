import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportSinteticPage from './ReportSinteticPage';

interface IReport {
  context: WebPartContext;
}

const ReportSintetic: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportSinteticPage context={context} />
    </App>
  );
};

export default ReportSintetic;
