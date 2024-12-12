import * as React from 'react';
import { App } from '~/components';
import ReportCalendarByPersonPage from './ReportCalendarByPersonPage';
const ReportCalendarByPerson = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportCalendarByPersonPage, { context: context })));
};
export default ReportCalendarByPerson;
//# sourceMappingURL=index.js.map