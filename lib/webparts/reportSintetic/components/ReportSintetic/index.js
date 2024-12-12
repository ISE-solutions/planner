import * as React from 'react';
import { App } from '~/components';
import ReportSinteticPage from './ReportSinteticPage';
const ReportSintetic = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ReportSinteticPage, { context: context })));
};
export default ReportSintetic;
//# sourceMappingURL=index.js.map