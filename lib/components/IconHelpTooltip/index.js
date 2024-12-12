import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
const IconHelpTooltip = ({ title }) => (React.createElement(Tooltip, { title: title, arrow: true },
    React.createElement(InfoOutlined, { style: { fontSize: '20px' }, color: 'primary' })));
export default IconHelpTooltip;
//# sourceMappingURL=index.js.map