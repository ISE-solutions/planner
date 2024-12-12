import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
const TableSchedule = ({ control, values, setValue, handleScheduleDateChange, modalityDayOptions, moduleOptions, temperatureOptions, persons, functionOptions, }) => {
    const handlePeopleChange = (field, value, original, rowIndex) => {
        setValue(`schedules.${rowIndex}.peopleRender.${field}`, value);
        setValue(`schedules.${original.parentIndex}.people[${original.idx}].${field}`, value);
    };
    const columns = React.useMemo(() => [
        {
            accessorKey: 'dateString',
            Cell: ({ cell }) => {
                const { row } = cell;
                if (row.original.blocked) {
                    return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.date`, defaultValue: '', render: ({ field }) => {
                            var _a, _b;
                            return (React.createElement(React.Fragment, null, (_b = (_a = field === null || field === void 0 ? void 0 : field.value) === null || _a === void 0 ? void 0 : _a.clone()) === null || _b === void 0 ? void 0 : _b.format('DD/MM/YYYY')));
                        } }));
                }
                return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.date`, render: ({ field }) => {
                        return (React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, disabled: row.original.blocked, variant: 'inline', format: 'DD/MM/YYYY', label: '', value: field.value, onChange: (newValue) => handleScheduleDateChange(newValue, row.original.id) }));
                    } }));
            },
            header: 'Data',
            size: 170,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'module.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                if (row.original.blocked) {
                    return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.module.label`, defaultValue: '', render: ({ field }) => React.createElement(React.Fragment, null, field.value) }));
                }
                return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.module`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, disabled: row.original.blocked, options: moduleOptions, onChange: (event, newValue) => setValue(`schedules.${row.index}.module`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Módulo',
            size: 270,
        },
        {
            accessorKey: 'modality.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                if (row.original.blocked) {
                    return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.modality.label`, defaultValue: '', render: ({ field }) => React.createElement(React.Fragment, null, field.value) }));
                }
                return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.modality`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, disabled: row.original.blocked, options: modalityDayOptions, onChange: (event, newValue) => setValue(`schedules.${row.index}.modality`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Modalidade',
            size: 270,
        },
        {
            accessorKey: 'link',
            Cell: ({ cell }) => {
                const { row } = cell;
                if (row.original.blocked) {
                    return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.link`, defaultValue: '', render: ({ field }) => React.createElement(React.Fragment, null, field.value) }));
                }
                return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.link`, render: ({ field }) => (React.createElement(TextField, { type: 'url', fullWidth: true, disabled: row.original.blocked, value: field.value, onChange: field.onChange })) }));
            },
            size: 200,
            header: 'Link',
        },
        {
            accessorKey: 'temperature.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                if (row.original.blocked) {
                    return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.temperature.label`, defaultValue: '', render: ({ field }) => React.createElement(React.Fragment, null, field.value) }));
                }
                return (React.createElement(Controller, { control: control, name: `schedules.${row.index}.temperature`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, disabled: row.original.blocked, options: temperatureOptions, onChange: (event, newValue) => setValue(`schedules.${row.index}.temperature`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Temperatura/Status',
            size: 270,
        },
        {
            accessorKey: 'peopleRender.function.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.people[${row.original.idx}].function`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: functionOptions, onChange: (event, newValue) => handlePeopleChange('function', newValue, row.original, row.index), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.peopleRender) === null || _b === void 0 ? void 0 : _b.function, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'function', label: '' }))) }));
                    } }));
            },
            size: 270,
            header: 'Função',
        },
        {
            accessorKey: 'peopleRender.person.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `schedules.${row.original.parentIndex}.people[${row.original.idx}].person`, defaultValue: {}, render: () => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: persons, onChange: (event, newValue) => handlePeopleChange('person', newValue, row.original, row.index), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: row.original.peopleRender.person, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'person', label: '' }))) })) }));
            },
            header: 'Pessoa',
        },
    ], []);
    const table = useMaterialReactTable({
        columns,
        data: values,
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
        React.createElement(MaterialReactTable, { table: table }),
        ' '));
};
export default TableSchedule;
//# sourceMappingURL=TableSchedule.js.map