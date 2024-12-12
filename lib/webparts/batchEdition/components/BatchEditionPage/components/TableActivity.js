import * as React from 'react';
import { Box, Checkbox, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { PREFIX } from '~/config/database';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, } from '@material-ui/icons';
import { TYPE_ACTIVITY_LABEL } from '~/config/enums';
const TableActivity = ({ control, setValue, values, planningActivities, temperatureOptions, areaOptions, courseOptions, spaces, }) => {
    const activitiesOptions = React.useMemo(() => {
        return planningActivities === null || planningActivities === void 0 ? void 0 : planningActivities.map((ac) => (Object.assign(Object.assign({}, ac), { value: ac === null || ac === void 0 ? void 0 : ac[`${PREFIX}nome`] })));
    }, [planningActivities]);
    const columns = React.useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Dia',
            filterVariant: 'date-range',
            size: 170,
            enableColumnFilter: false,
        },
        {
            accessorKey: 'typeLabel',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.typeLabel`, defaultValue: {}, render: ({ field }) => React.createElement(React.Fragment, null, field.value) }));
            },
            header: 'Tipo atividade',
            size: 170,
            enableColumnFilter: true,
        },
        {
            accessorKey: 'name',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.nameObj`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: activitiesOptions, onChange: (event, newValue) => {
                            setValue(`activities.${row.index}.nameObj`, newValue);
                            setValue(`activities.${row.index}.name`, newValue.value);
                            setValue(`activities.${row.index}.type`, newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}tipo`]);
                            setValue(`activities.${row.index}.${PREFIX}tipo`, newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}tipo`]);
                            setValue(`activities.${row.index}.typeLabel`, TYPE_ACTIVITY_LABEL === null || TYPE_ACTIVITY_LABEL === void 0 ? void 0 : TYPE_ACTIVITY_LABEL[newValue[`${PREFIX}tipo`]]);
                        }, getOptionSelected: (option, value) => option.value === value, getOptionLabel: (option) => option.value || '', value: field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'name', label: 'Nome da Atividade' }))) })) }));
            },
            header: 'Nome da Atividade',
            size: 270,
        },
        {
            accessorKey: 'startTimeString',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.startTime`, render: ({ field }) => (React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, cancelLabel: 'Cancelar', invalidDateMessage: 'Formato inv\u00E1lido', label: '', value: field.value, onChange: (newValue) => {
                            var _a, _b;
                            setValue(`activities.${row.index}.startTime`, newValue);
                            const dur = (_a = values === null || values === void 0 ? void 0 : values[row.index]) === null || _a === void 0 ? void 0 : _a.duration;
                            if (dur) {
                                const duration = dur.hour() * 60 + dur.minute();
                                setValue(`activities.${row.index}.endTime`, (_b = newValue === null || newValue === void 0 ? void 0 : newValue.clone()) === null || _b === void 0 ? void 0 : _b.add(duration, 'minutes'));
                            }
                        } })) }));
            },
            size: 160,
            header: 'Início',
        },
        {
            accessorKey: 'durationString',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.duration`, defaultValue: {}, render: ({ field }) => (React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, cancelLabel: 'Cancelar', invalidDateMessage: 'Formato inv\u00E1lido', label: '', value: field.value, onChange: (newValue) => {
                            var _a;
                            setValue(`activities.${row.index}.duration`, newValue);
                            const stTime = (_a = values === null || values === void 0 ? void 0 : values[row.index]) === null || _a === void 0 ? void 0 : _a.startTime;
                            if (stTime) {
                                const duration = (newValue === null || newValue === void 0 ? void 0 : newValue.hour()) * 60 + (newValue === null || newValue === void 0 ? void 0 : newValue.minute());
                                setValue(`activities.${row.index}.endTime`, stTime.clone().add(duration, 'minutes'));
                            }
                        } })) }));
            },
            header: 'Duração',
            size: 160,
        },
        {
            accessorKey: 'endTimeString',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.endTime`, defaultValue: {}, render: ({ field }) => (React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, disabled: true, cancelLabel: 'Cancelar', invalidDateMessage: 'Formato inv\u00E1lido', label: '', value: field.value, onChange: (newValue) => setValue(`activities.${row.index}.endTime`, newValue) })) }));
            },
            header: 'Fim',
            size: 160,
        },
        {
            accessorKey: 'theme',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.theme`, defaultValue: {}, render: ({ field }) => (React.createElement(TextField, { type: 'text', fullWidth: true, value: field.value, onChange: field.onChange })) }));
            },
            header: 'Tema',
            size: 300,
        },
        {
            accessorKey: 'description',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.description`, defaultValue: {}, render: ({ field }) => (React.createElement(TextField, { type: 'text', fullWidth: true, value: field.value, onChange: field.onChange })) }));
            },
            header: 'Descrição/Objetivo',
            size: 300,
        },
        {
            accessorKey: 'quantity',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.quantity`, defaultValue: {}, render: ({ field }) => (React.createElement(TextField, { type: 'number', fullWidth: true, value: field.value, onChange: field.onChange })) }));
            },
            filterVariant: 'range',
            filterFn: 'between',
            header: 'Quantidade de sessões',
            size: 200,
        },
        {
            accessorKey: 'area.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.area`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: areaOptions, onChange: (event, newValue) => setValue(`activities.${row.index}.area`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Área acadêmica',
            size: 270,
        },
        {
            accessorKey: 'course.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.course`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: courseOptions, onChange: (event, newValue) => setValue(`activities.${row.index}.course`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Curso',
            size: 270,
        },
        {
            accessorKey: 'spacesString',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.spaces`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { multiple: true, disableCloseOnSelect: true, noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: spaces, onChange: (event, newValue) => setValue(`activities.${row.index}.spaces`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderOption: (option, { selected }) => (React.createElement(React.Fragment, null,
                            React.createElement(Checkbox, { icon: React.createElement(CheckBoxOutlineBlankIcon, { fontSize: 'small' }), checkedIcon: React.createElement(CheckBoxIcon, { fontSize: 'small' }), style: { marginRight: 8 }, checked: selected }),
                            option.label)), value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            enableColumnFilter: false,
            header: 'Espaço',
            size: 270,
        },
        {
            accessorKey: 'temperature.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.${row.index}.temperature`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: temperatureOptions, onChange: (event, newValue) => setValue(`activities.${row.index}.temperature`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) }));
            },
            header: 'Temperatura/Status',
            size: 270,
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
        React.createElement(MaterialReactTable, { table: table })));
};
export default TableActivity;
//# sourceMappingURL=TableActivity.js.map