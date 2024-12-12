import * as React from 'react';
import { App } from '~/components';
import ReportCriticalDaysPage from './ReportCriticalDaysPage';
const ReportCriticalDays = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportCriticalDaysPage, { context: context })));
};
export default ReportCriticalDays;
//# sourceMappingURL=index.js.map