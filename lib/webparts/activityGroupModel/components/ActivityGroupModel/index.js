import * as React from 'react';
import { App } from '~/components';
import ActivityGroupModelPage from './ActivityGroupModelPage';
const ActivityGroupModel = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ActivityGroupModelPage, { context: context })));
};
export default ActivityGroupModel;
//# sourceMappingURL=index.js.map