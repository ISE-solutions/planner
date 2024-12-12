import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportFollowSchedulePage from './ReportFollowSchedulePage';

interface IReport {
  context: WebPartContext;
}

const ReportPlanningDemand: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportFollowSchedulePage context={context} />
    </App>
  );
};

export default ReportPlanningDemand;
