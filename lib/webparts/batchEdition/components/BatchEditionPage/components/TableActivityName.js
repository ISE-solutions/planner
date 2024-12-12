import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
const TableActivityName = ({ values, control, setValue, useOptions }) => {
    const handleNameChange = (field, value, id, keyId) => {
        const indexActivity = values.findIndex((sc) => sc.id === id);
        const indexName = values[indexActivity].names.findIndex((sc) => sc.keyId === keyId);
        setValue(`activities.${indexActivity}.names.${indexName}.${field}`, value);
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
            accessorKey: 'spacesString',
            header: 'Espaços',
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
            accessorKey: 'name.name',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.name.name`, defaultValue: {}, render: ({ field }) => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.name, onChange: (event) => handleNameChange('name', event.target.value, row.original.id, row.original.name.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Nome (PT)',
        },
        {
            accessorKey: 'name.nameEn',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.name.nameEn`, defaultValue: {}, render: ({ field }) => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.nameEn, onChange: (event) => handleNameChange('nameEn', event.target.value, row.original.id, row.original.name.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Nome (EN)',
        },
        {
            accessorKey: 'name.nameEs',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.name.nameEs`, defaultValue: {}, render: ({ field }) => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.nameEs, onChange: (event) => handleNameChange('nameEs', event.target.value, row.original.id, row.original.name.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Nome (ES)',
        },
        {
            accessorKey: 'people.name.use',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `people.name.use`, defaultValue: {}, render: () => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: useOptions, onChange: (event, newValue) => handleNameChange('use', newValue, row.original.id, row.original.name.keyId), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: row.original.name.use, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'use', label: '' }))) })) }));
            },
            header: 'Uso',
        },
    ], []);
    const rows = React.useMemo(() => {
        const result = [];
        values.forEach((act) => {
            act.names.forEach((pe) => {
                result.push(Object.assign(Object.assign({}, act), { activityName: act.name, startTimeString: act.startTime.format('HH:mm'), spacesString: act.spaces.map((sp) => sp.label).join('; '), name: pe }));
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
export default TableActivityName;
//# sourceMappingURL=TableActivityName.js.map