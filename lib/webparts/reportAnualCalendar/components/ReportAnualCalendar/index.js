import * as React from 'react';
import { App } from '~/components';
import ReportAnualCalendarPage from './ReportAnualCalendarPage';
const ReportAnualCalendar = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportAnualCalendarPage, { context: context })));
};
export default ReportAnualCalendar;
//# sourceMappingURL=index.js.map