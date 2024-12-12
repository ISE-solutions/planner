import * as React from 'react';
import { App } from '~/components';
import ReportPage from './ReportPage';
const Report = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportPage, { context: context })));
};
export default Report;
//# sourceMappingURL=index.js.map