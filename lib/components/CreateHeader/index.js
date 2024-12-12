import * as React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import styles from './CreateHeader.module.scss';
const CreateHeader = ({ title, action }) => {
    return (React.createElement(Paper, { elevation: 3, className: styles.wrapperHeader },
        React.createElement(Grid, { container: true, justify: 'space-between' },
            React.createElement(Grid, { item: true, sm: 8, md: 8, lg: 8, xl: 8 },
                React.createElement(Typography, { variant: 'h6' }, title)),
            React.createElement(Grid, { item: true, sm: 4, md: 4, lg: 4, xl: 4, className: styles.wrapperAction }, action))));
};
export default CreateHeader;
//# sourceMappingURL=index.js.map