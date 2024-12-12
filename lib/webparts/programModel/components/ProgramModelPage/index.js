import * as React from 'react';
import ProgramModelPage from './ProgramModelPage';
import { App } from '~/components';
const ProgramModel = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ProgramModelPage, { context: context })));
};
export default ProgramModel;
//# sourceMappingURL=index.js.map