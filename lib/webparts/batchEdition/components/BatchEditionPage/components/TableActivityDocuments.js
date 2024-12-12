import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { EDeliveryType } from '~/config/enums';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
const TableActivityDocuments = ({ values, control, setValue }) => {
    const handleDocumentChange = (field, value, id, keyId) => {
        const indexActivity = values.findIndex((sc) => sc.id === id);
        const indexName = values[indexActivity].documents.findIndex((sc) => sc.keyId === keyId);
        setValue(`activities.${indexActivity}.documents.${indexName}.${field}`, value);
    };
    const columns = React.useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Dia',
            size: 170,
        },
        {
            accessorKey: 'activityName',
            header: 'Nome Atividade',
            size: 270,
        },
        {
            accessorKey: 'startTimeString',
            size: 160,
            header: 'Início',
        },
        {
            accessorKey: 'theme',
            header: 'Tema',
            size: 300,
        },
        {
            accessorKey: 'typeLabel',
            header: 'Tipo atividade',
            filterVariant: 'text',
            size: 170,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'name',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `name`, defaultValue: {}, render: ({ field }) => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.doc) === null || _b === void 0 ? void 0 : _b.name, onChange: (event) => handleDocumentChange('name', event.target.value, row.original.id, row.original.doc.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Nome',
        },
        {
            accessorKey: 'doc.fonte',
            size: 270,
            header: 'Fonte',
        },
        {
            accessorKey: 'link',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `link`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.doc) === null || _b === void 0 ? void 0 : _b.link, onChange: (event) => handleDocumentChange('link', event.target.value, row.original.id, row.original.doc.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Link',
        },
        {
            accessorKey: 'delivery',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `doc.delivery`, defaultValue: '', render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: Object.keys(EDeliveryType), onChange: (event, newValue) => handleDocumentChange('delivery', newValue, row.original.id, row.original.doc.keyId), getOptionLabel: (option) => EDeliveryType[option], value: row.original.doc.delivery, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'delivery', label: '' }))) })) }));
            },
            size: 300,
            header: 'Momento entrega',
        },
    ], []);
    const rows = React.useMemo(() => {
        const result = [];
        values.forEach((act) => {
            act.documents.forEach((dc) => {
                result.push(Object.assign(Object.assign({}, act), { doc: dc, activityName: act.name, startTimeString: act.startTime.format('HH:mm'), spacesString: act.spaces.map((sp) => sp.label).join('; ') }));
            });
        });
        return result;
    }, values);
    const table = useMaterialReactTable({
        columns,
        data: rows,
        enableColumnPinning: true,
        enableRowPinning: true,
        enableStickyHeader: true,
        layoutMode: 'grid-no-grow',
        localization: MRT_Localization_PT_BR,
        rowPinningDisplayMode: 'top-and-bottom',
        muiTableContainerProps: { sx: { height: 'calc(100vh - 25rem)' } },
        initialState: {
            columnPinning: { left: ['mrt-row-actions'], right: [] },
        },
    });
    return (React.createElement(Box, { overflow: 'auto' },
        React.createElement(MaterialReactTable, { table: table })));
};
export default TableActivityDocuments;
//# sourceMappingURL=TableActivityDocuments.js.map