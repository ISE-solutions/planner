import * as React from 'react';
import { App } from '~/components';
import ReportFollowSchedulePage from './ReportFollowSchedulePage';
const ReportPlanningDemand = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportFollowSchedulePage, { context: context })));
};
export default ReportPlanningDemand;
//# sourceMappingURL=index.js.map