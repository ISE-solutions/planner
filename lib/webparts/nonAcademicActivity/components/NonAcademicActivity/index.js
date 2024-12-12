import * as React from 'react';
import NonAcademicActivityPage from './NonAcademicActivityPage';
import { App } from '~/components';
const NonAcademicActivity = ({ context, }) => {
    return (React.createElement(App, { context: context },
        React.createElement(NonAcademicActivityPage, { context: context })));
};
export default NonAcademicActivity;
//# sourceMappingURL=index.js.map