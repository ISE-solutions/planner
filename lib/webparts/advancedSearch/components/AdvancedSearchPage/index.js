import * as React from 'react';
import { App } from '~/components';
import AdvancedSearchPage from './AdvancedSearchPage';
const AdvancedSearch = ({ context }) => {
    return (React.createElement(App, { context: context },
        React.createElement(AdvancedSearchPage, { context: context })));
};
export default AdvancedSearch;
//# sourceMappingURL=index.js.map