import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportPlanningDemandPage from './ReportPlanningDemandPage';

interface IReport {
  context: WebPartContext;
}

const ReportPlanningDemand: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportPlanningDemandPage context={context} />
    </App>
  );
};

export default ReportPlanningDemand;
