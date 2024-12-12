import * as React from 'react';
import InternalActivityPage from './InternalActivityPage';
import { App } from '~/components';
const InternalActivity = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(InternalActivityPage, { context: context })));
};
export default InternalActivity;
//# sourceMappingURL=index.js.map