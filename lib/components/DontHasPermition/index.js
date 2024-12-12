import { Box, Typography } from '@material-ui/core';
import { Block } from '@material-ui/icons';
import * as React from 'react';
const DontHasPermition = () => {
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center' },
        React.createElement(Typography, { variant: 'h4' }, "Voc\u00EA n\u00E3o possui permiss\u00E3o"),
        React.createElement(Block, { style: { fontSize: '3rem' } }),
        React.createElement(Typography, { variant: 'body1' }, "Procure o administrador da aplica\u00E7\u00E3o")));
};
export default DontHasPermition;
//# sourceMappingURL=index.js.map