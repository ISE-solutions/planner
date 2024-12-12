import * as React from 'react';
import { App } from '~/components';
import SpacePage from './SpacePage';
const Space = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(SpacePage, { context: context })));
};
export default Space;
//# sourceMappingURL=index.js.map