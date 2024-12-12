import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { EDeliveryType } from '~/config/enums';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { KeyboardDatePicker } from '@material-ui/pickers';
const TableActivityRequestAcademic = ({ values, control, setValue, equipmentsOptions, finiteResources, infiniteResources, }) => {
    const handleAcademicRequestChange = (field, value, id, keyId) => {
        const indexActivity = values.findIndex((sc) => sc.id === id);
        const indexName = values[indexActivity].academicRequests.findIndex((sc) => sc.keyId === keyId);
        setValue(`activities.${indexActivity}.academicRequests.${indexName}.${field}`, value);
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
                return (React.createElement(Controller, { control: control, name: `description`, defaultValue: {}, render: ({ field }) => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.description, onChange: (event) => handleAcademicRequestChange('description', event.target.value, row.original.id, row.original.req.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Descrição',
        },
        {
            accessorKey: 'delivery',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `req.delivery`, defaultValue: '', render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: Object.keys(EDeliveryType), onChange: (event, newValue) => handleAcademicRequestChange('delivery', newValue, row.original.id, row.original.req.keyId), getOptionLabel: (option) => EDeliveryType[option], value: row.original.req.delivery, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'delivery', label: '' }))) })) }));
            },
            size: 300,
            header: 'Momento entrega',
        },
        {
            accessorKey: 'delivery',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `req.deliveryDate`, defaultValue: '', render: ({ field }) => (React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: '', value: row.original.req.deliveryDate, onChange: (newValue) => handleAcademicRequestChange('deliveryDate', newValue, row.original.id, row.original.req.keyId) })) }));
            },
            size: 300,
            header: 'Data de entrega',
        },
        {
            accessorKey: 'deadline',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `deadline`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'number', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.deadline, onChange: (event) => handleAcademicRequestChange('deadline', event.target.value, row.original.id, row.original.req.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Prazo entrega',
        },
        {
            accessorKey: 'link',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `link`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'url', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.link, onChange: (event) => handleAcademicRequestChange('link', event.target.value, row.original.id, row.original.req.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Link',
        },
        {
            accessorKey: 'equipments',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `equipments`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: equipmentsOptions || [], onChange: (event, newValue) => handleAcademicRequestChange('equipments', newValue, row.original.id, row.original.req.keyId), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.equipments, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) }));
                    } }));
            },
            size: 270,
            header: 'Equipamentos',
        },
        {
            accessorKey: 'finiteResource',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `finiteResource`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: finiteResources || [], onChange: (event, newValue) => handleAcademicRequestChange('finiteResource', newValue, row.original.id, row.original.req.keyId), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.finiteResource, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) }));
                    } }));
            },
            size: 270,
            header: 'Recursos finito',
        },
        {
            accessorKey: 'infiniteResource',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `infiniteResource`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: infiniteResources || [], onChange: (event, newValue) => handleAcademicRequestChange('infiniteResource', newValue, row.original.id, row.original.req.keyId), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.infiniteResource, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) }));
                    } }));
            },
            size: 270,
            header: 'Recursos infinito',
        },
        {
            accessorKey: 'other',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `other`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(TextField, { type: 'text', fullWidth: true, value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.req) === null || _b === void 0 ? void 0 : _b.other, onChange: (event) => handleAcademicRequestChange('other', event.target.value, row.original.id, row.original.req.keyId) }));
                    } }));
            },
            size: 270,
            header: 'Outro',
        },
    ], []);
    const rows = React.useMemo(() => {
        const result = [];
        values.forEach((act) => {
            act.academicRequests.forEach((req) => {
                result.push(Object.assign(Object.assign({}, act), { req: req, activityName: act.name, startTimeString: act.startTime.format('HH:mm'), spacesString: act.spaces.map((sp) => sp.label).join('; ') }));
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
export default TableActivityRequestAcademic;
//# sourceMappingURL=TableActivityRequestAcademic.js.map