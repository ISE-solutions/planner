import * as React from 'react';
import { App } from '~/components';
import TimeReportPage from './TimeReportPage';
const TimeReport = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(TimeReportPage, { context: context })));
};
export default TimeReport;
//# sourceMappingURL=index.js.map