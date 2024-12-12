import * as React from 'react';
import { App } from '~/components';
import PersonPage from './PersonPage';
const Person = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(PersonPage, { context: context })));
};
export default Person;
//# sourceMappingURL=index.js.map