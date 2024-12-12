import * as React from 'react';
import { App } from '~/components';
import ConflictManagementPage from './ConflictManagementPage';
const ConflictManagment = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ConflictManagementPage, { context: context })));
};
export default ConflictManagment;
//# sourceMappingURL=index.js.map