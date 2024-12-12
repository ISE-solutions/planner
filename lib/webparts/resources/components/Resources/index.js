import * as React from 'react';
import { App } from '~/components';
import ResourcesPage from './ResourcesPage';
const Resources = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ResourcesPage, { context: context })));
};
export default Resources;
//# sourceMappingURL=index.js.map