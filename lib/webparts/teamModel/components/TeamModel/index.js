import * as React from 'react';
import { App } from '~/components';
import TeamModelPage from './TeamModelPage';
const TeamModel = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(TeamModelPage, { context: context })));
};
export default TeamModel;
//# sourceMappingURL=index.js.map