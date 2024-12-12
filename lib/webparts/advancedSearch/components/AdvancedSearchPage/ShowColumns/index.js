import * as React from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, SwipeableDrawer, Typography, } from '@material-ui/core';
import { BoxCloseIcon } from '~/components/AddTeam/styles';
import { Close } from '@material-ui/icons';
import * as _ from 'lodash';
const ShowColumns = ({ open, onClose, columns, setColumns, }) => {
    var _a;
    const [localColumn, setLocalColumn] = React.useState([]);
    const [showAllColumns, setShowColumns] = React.useState(false);
    React.useEffect(() => {
        setLocalColumn(_.cloneDeep(columns));
    }, [columns]);
    const handleChangeColumn = (id) => {
        const index = columns.findIndex((e) => e.id === id);
        const newColumns = _.cloneDeep(localColumn);
        newColumns[index].options.display = !newColumns[index].options.display;
        setLocalColumn(newColumns);
    };
    const handleShowHideColumn = () => {
        const newColumn = _.cloneDeep(localColumn);
        const newColumns = newColumn.map((co) => {
            if (co.hideColumn) {
                return co;
            }
            return Object.assign(Object.assign({}, co), { options: Object.assign(Object.assign({}, ((co === null || co === void 0 ? void 0 : co.options) || {})), { display: showAllColumns }) });
        });
        setLocalColumn(newColumns);
        setShowColumns(!showAllColumns);
    };
    const handleApply = () => {
        setColumns(localColumn);
        onClose();
    };
    const columnsGrouped = React.useMemo(() => _.groupBy(localColumn, (e) => e.group), [localColumn]);
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Box, { padding: '2rem', minWidth: '30rem', flexDirection: 'column', maxHeight: '100vh', height: '100%', display: 'flex', style: { gap: '10px' } },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Mostrar colunas"),
                React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleShowHideColumn }, showAllColumns ? 'Selecionar todas' : 'Deselecionar todas')),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', flex: '1 0 auto', overflow: 'auto', maxHeight: 'calc(100vh - 12rem)' }, (_a = Object.keys(columnsGrouped)) === null || _a === void 0 ? void 0 : _a.map((key) => {
                var _a;
                return (React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '10px' } },
                    React.createElement(Typography, null, key),
                    React.createElement(Box, { display: 'flex', flexDirection: 'column' }, (_a = columnsGrouped[key]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e.hideColumn)).map((column, index) => {
                        var _a;
                        return (React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { key: column === null || column === void 0 ? void 0 : column.name, checked: (_a = column === null || column === void 0 ? void 0 : column.options) === null || _a === void 0 ? void 0 : _a.display, 
                                // value={column?.options?.display}
                                onChange: () => handleChangeColumn(column.id), name: column === null || column === void 0 ? void 0 : column.name, color: 'primary' }), label: column === null || column === void 0 ? void 0 : column.label }));
                    }))));
            })),
            React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', style: { gap: '1rem' } },
                React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleApply }, "Aplicar")))));
};
export default ShowColumns;
//# sourceMappingURL=index.js.map