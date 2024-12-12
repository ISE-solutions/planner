import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportWeekPlanGRSAPage from './ReportWeekPlanGRSAPage';

interface IReport {
  context: WebPartContext;
}

const ReportPlanningDemand: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportWeekPlanGRSAPage context={context} />
    </App>
  );
};

export default ReportPlanningDemand;
