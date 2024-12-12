import * as React from 'react';
import { App } from '~/components';
import FiniteResourcePage from './FiniteResourcePage';
const FiniteResource = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(FiniteResourcePage, { context: context })));
};
export default FiniteResource;
//# sourceMappingURL=index.js.map