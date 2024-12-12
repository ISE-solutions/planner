import * as React from 'react';
import { App } from '~/components';
import ReportScheduleTeacherPage from './ReportScheduleTeacherPage';
const ReportAnualCalendar = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportScheduleTeacherPage, { context: context })));
};
export default ReportAnualCalendar;
//# sourceMappingURL=index.js.map