import * as React from 'react';
import { App } from '~/components';
import InfiniteResourcePage from './InfiniteResourcePage';
const InfiniteResource = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(InfiniteResourcePage, { context: context })));
};
export default InfiniteResource;
//# sourceMappingURL=index.js.map