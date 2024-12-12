import * as React from 'react';
import { App } from '~/components';
import ScheduleModelPage from './ScheduleModelPage';
const ScheduleModel = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(ScheduleModelPage, { context: context })));
};
export default ScheduleModel;
//# sourceMappingURL=index.js.map