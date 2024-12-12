import * as React from 'react';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller } from 'react-hook-form';
import { MaterialReactTable, useMaterialReactTable, } from 'material-react-table';
import { MRT_Localization_PT_BR } from 'material-react-table/locales/pt-BR';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { useSelector } from 'react-redux';
const TableActivityDocuments = ({ values, functionOptions, persons, control, setValue, }) => {
    const handlePeopleChange = (field, value, id, keyId) => {
        const indexActivity = values.findIndex((sc) => sc.id === id);
        const indexPeople = values[indexActivity].people.findIndex((sc) => sc.keyId === keyId);
        setValue(`activities.${indexActivity}.people.${indexPeople}.${field}`, value);
    };
    const { tag } = useSelector((state) => state);
    const { dictTag } = tag;
    const columns = React.useMemo(() => [
        {
            accessorKey: 'date',
            header: 'Dia',
            size: 170,
        },
        {
            accessorKey: 'name',
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
            accessorKey: 'people.person.label',
            Cell: ({ cell }) => {
                const { row } = cell;
                return (React.createElement(Controller, { control: control, name: `activities.people.person`, defaultValue: {}, render: () => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: persons, onChange: (event, newValue) => {
                            handlePeopleChange('person', newValue, row.original.id, row.original.people.keyId);
                            handlePeopleChange('function', null, row.original.id, row.original.people.keyId);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: row.original.people.person, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'person', label: '' }))) })) }));
            },
            header: 'Pessoa',
        },
        {
            accessorKey: 'people.function.label',
            Cell: ({ cell }) => {
                var _a, _b, _c, _d;
                const { row } = cell;
                const functions = [];
                (_d = (_c = (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b.person) === null || _c === void 0 ? void 0 : _c[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _d === void 0 ? void 0 : _d.forEach((tag) => {
                    var _a;
                    const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                    if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                        functions.push(fullTag);
                    }
                });
                return (React.createElement(Controller, { control: control, name: `schedules.people.function`, defaultValue: {}, render: () => {
                        var _a, _b;
                        return (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', style: { width: '100%' }, filterSelectedOptions: true, options: functions, onChange: (event, newValue) => handlePeopleChange('function', newValue, row.original.id, row.original.people.keyId), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_b = (_a = row.original) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b.function, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'function', label: '' }))) }));
                    } }));
            },
            size: 270,
            header: 'Função',
        },
    ], []);
    const rows = React.useMemo(() => {
        const result = [];
        values.forEach((act) => {
            act.people.forEach((pe) => {
                result.push(Object.assign(Object.assign({}, act), { startTimeString: act.startTime.format('HH:mm'), spacesString: act.spaces.map((sp) => sp.label).join('; '), people: pe }));
            });
        });
        return result;
    }, [values]);
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
//# sourceMappingURL=TableActivityEnvolvedPeople.js.map