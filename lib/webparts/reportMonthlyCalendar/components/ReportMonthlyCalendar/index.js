import * as React from 'react';
import { App } from '~/components';
import ReportMonthlyCalendarPage from './ReportMonthlyCalendarPage';
const ReportMonthlyCalendar = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportMonthlyCalendarPage, { context: context })));
};
export default ReportMonthlyCalendar;
//# sourceMappingURL=index.js.map