import * as React from 'react';
import AcademicActivityPage from './AcademicActivityPage';
import { App } from '~/components';
const AcademicActivity = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(AcademicActivityPage, { context: context })));
};
export default AcademicActivity;
//# sourceMappingURL=index.js.map