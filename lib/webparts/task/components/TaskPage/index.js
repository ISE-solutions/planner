import * as React from 'react';
import { App } from '~/components';
import TaskPage from './TaskPage';
const Task = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(TaskPage, { context: context })));
};
export default Task;
//# sourceMappingURL=index.js.map