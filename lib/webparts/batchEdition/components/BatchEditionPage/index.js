import * as React from 'react';
import BatchEditionPage from './BatchEditionPage';
import { App } from '~/components';
const BatchEdition = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(BatchEditionPage, { context: context })));
};
export default BatchEdition;
//# sourceMappingURL=index.js.map