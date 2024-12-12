import * as React from 'react';
import { App } from '~/components';
import ReportSessionsPage from './ReportSessionsPage';
const ReportSessions = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportSessionsPage, { context: context })));
};
export default ReportSessions;
//# sourceMappingURL=index.js.map