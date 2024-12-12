import * as React from 'react';
import { Box, Button, CircularProgress, IconButton, SwipeableDrawer, Typography, } from '@material-ui/core';
import { GROUP_FILTER } from '../constants';
import { Query, Builder, Utils as QbUtils, } from '@react-awesome-query-builder/material';
import { Close } from '@material-ui/icons';
import { useConfirmation } from '~/hooks';
import { BoxBuilder } from '~/components/BoxBuilder';
export var InputTypes;
(function (InputTypes) {
    InputTypes[InputTypes["AUTOCOMPLETE"] = 0] = "AUTOCOMPLETE";
    InputTypes[InputTypes["TEXT"] = 1] = "TEXT";
    InputTypes[InputTypes["DATE"] = 2] = "DATE";
    InputTypes[InputTypes["DATETIME"] = 3] = "DATETIME";
    InputTypes[InputTypes["NUMBER"] = 4] = "NUMBER";
})(InputTypes || (InputTypes = {}));
const Filter = ({ formik, group, open, loading, onClose, queryQB, configQB, clearFilter, setQuery, setGroup, }) => {
    const { confirmation } = useConfirmation();
    const renderBuilder = React.useCallback((props) => (React.createElement("div", { className: 'query-builder-container', style: { padding: '10px' } },
        React.createElement("div", { className: 'query-builder qb-lite' },
            React.createElement(Builder, Object.assign({}, props))))), []);
    const handleSetGroup = (newValue) => {
        const sqlFilter = QbUtils.sqlFormat(queryQB.tree, configQB);
        if (sqlFilter) {
            confirmation.openConfirmation({
                title: 'Alteração de agrupador',
                description: 'Você pode perder seu filtro, deseja realmente alterar?',
                yesLabel: 'Sim',
                noLabel: 'Não',
                onConfirm: () => {
                    setGroup(newValue);
                    clearFilter();
                },
            });
        }
        else {
            setGroup(newValue);
            clearFilter();
        }
    };
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '1rem', minWidth: '85vw', height: '100vh' },
            React.createElement(Box, { position: 'absolute', right: '10px', top: '10px' },
                React.createElement(IconButton, { onClick: onClose },
                    React.createElement(Close, null))),
            React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', marginBottom: '1rem', style: { gap: '10px' } },
                React.createElement(Box, { display: 'flex', maxWidth: '15rem', width: '100%', borderRadius: '10px', padding: '10px', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'body1', color: 'primary', style: { fontWeight: 'bold' } }, "Agrupador"),
                    React.createElement(Button, { fullWidth: true, variant: group === GROUP_FILTER.PROGRAM ? 'contained' : 'outlined', color: 'primary', onClick: () => handleSetGroup(GROUP_FILTER.PROGRAM) }, "Programa"),
                    React.createElement(Button, { fullWidth: true, variant: group === GROUP_FILTER.TURMA ? 'contained' : 'outlined', color: 'primary', onClick: () => handleSetGroup(GROUP_FILTER.TURMA) }, "Turma"),
                    React.createElement(Button, { fullWidth: true, variant: group === GROUP_FILTER.DIA ? 'contained' : 'outlined', color: 'primary', onClick: () => handleSetGroup(GROUP_FILTER.DIA) }, "Dia"),
                    React.createElement(Button, { fullWidth: true, variant: group === GROUP_FILTER.ATIVIDADE ? 'contained' : 'outlined', color: 'primary', onClick: () => handleSetGroup(GROUP_FILTER.ATIVIDADE) }, "Atividade")),
                React.createElement(Box, { display: 'flex', width: '100%', height: '100%', flexDirection: 'column', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'body1', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro(s)"),
                    React.createElement(BoxBuilder, { overflow: 'auto' },
                        React.createElement(Query, Object.assign({}, configQB, { value: queryQB.tree, renderBuilder: renderBuilder, onChange: (immutableTree, config) => {
                                setQuery((prevState) => (Object.assign(Object.assign({}, prevState), { tree: immutableTree, config: config })));
                            } }))))),
            React.createElement(Box, { width: '100%', display: 'flex', marginBottom: '2rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                React.createElement(Button, { onClick: () => formik.handleReset({}), color: 'primary' }, "Limpar"),
                React.createElement(Button, { onClick: () => formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Pesquisar'))))));
};
export default Filter;
//# sourceMappingURL=index.js.map