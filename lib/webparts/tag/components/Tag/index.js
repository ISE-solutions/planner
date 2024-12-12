import * as React from 'react';
import { App } from '~/components';
import TagPage from './TagPage';
const Tag = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(TagPage, { context: context })));
};
export default Tag;
//# sourceMappingURL=index.js.map