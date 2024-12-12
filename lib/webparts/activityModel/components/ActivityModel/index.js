import * as React from 'react';
import { App } from '~/components';
import ActivityModelPage from './ActivityModelPage';
const ActivityModel = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ActivityModelPage, { context: context })));
};
export default ActivityModel;
//# sourceMappingURL=index.js.map