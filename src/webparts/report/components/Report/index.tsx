import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportPage from './ReportPage';

interface IReport {
  context: WebPartContext;
}

const Report: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportPage context={context} />
    </App>
  );
};

export default Report;
