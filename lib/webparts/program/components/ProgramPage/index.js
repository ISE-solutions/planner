import * as React from 'react';
import ProgramPage from './ProgramPage';
import { App } from '~/components';
const Program = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ProgramPage, { context: context })));
};
export default Program;
//# sourceMappingURL=index.js.map