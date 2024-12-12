import * as React from 'react';
import { App } from '~/components';
import TrashPage from './TrashPage';
const Trash = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(TrashPage, { context: context })));
};
export default Trash;
//# sourceMappingURL=index.js.map