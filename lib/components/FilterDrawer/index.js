import * as React from 'react';
import { Box, Button, IconButton, SwipeableDrawer, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Query, Builder } from '@react-awesome-query-builder/material';
import { BoxBuilder } from '../BoxBuilder';
const FilterDrawer = ({ open, onClose, queryQB, configQB, clearFilter, applyFilter, setQuery, }) => {
    const renderBuilder = React.useCallback((props) => (React.createElement("div", { className: 'query-builder-container', style: { padding: '10px' } },
        React.createElement("div", { className: 'query-builder qb-lite' },
            React.createElement(Builder, Object.assign({}, props))))), []);
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '1rem', width: '60vw', height: '100vh' },
            React.createElement(Box, { position: 'absolute', right: '10px', top: '10px' },
                React.createElement(IconButton, { onClick: onClose },
                    React.createElement(Close, null))),
            React.createElement(Box, { display: 'flex', width: '100%', height: '100%', flexDirection: 'column', marginBottom: '1rem', style: { gap: '10px' } },
                React.createElement(Box, { display: 'flex', width: '100%', height: '100%', flexDirection: 'column', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'body1', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro(s)"),
                    React.createElement(BoxBuilder, { overflow: 'auto' },
                        React.createElement(Query, Object.assign({}, configQB, { value: queryQB.tree, renderBuilder: renderBuilder, onChange: (immutableTree, config) => {
                                setQuery((prevState) => (Object.assign(Object.assign({}, prevState), { tree: immutableTree, config: config })));
                            } }))))),
            React.createElement(Box, { width: '100%', display: 'flex', marginBottom: '2rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                React.createElement(Button, { onClick: clearFilter, color: 'primary' }, "Limpar"),
                React.createElement(Button, { onClick: applyFilter, variant: 'contained', color: 'primary' }, "Aplicar")))));
};
export default FilterDrawer;
//# sourceMappingURL=index.js.map