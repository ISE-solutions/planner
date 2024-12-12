import * as React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@material-ui/core';
import { TitleSubtable } from './styles';
import { Autocomplete } from '@material-ui/lab';
import ContentEditable from 'react-contenteditable';
import { Controller } from 'react-hook-form';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EDeliveryType, EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
export const TableEnvolvedPeople = ({ envolvedPeople, functionOptions, persons, baseKey, setValue, control, }) => {
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Pessoas Envolvidas"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Fun\u00E7\u00E3o"),
                    React.createElement(TableCell, null, "Pessoa"))),
            React.createElement(TableBody, null, envolvedPeople === null || envolvedPeople === void 0 ? void 0 : envolvedPeople.map((env, i) => (React.createElement(TableRow, { key: env.id },
                React.createElement(TableCell, { style: { width: '50%' }, component: 'th', scope: 'row' },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.function`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: functionOptions, onChange: (event, newValue) => setValue(`${baseKey}.${i}.function`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'function', label: '' }))) })) })),
                React.createElement(TableCell, { style: { width: '50%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.person`, defaultValue: {}, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: persons, onChange: (event, newValue) => setValue(`${baseKey}.${i}.person`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'function', label: '' }))) })) })))))))));
};
export const TableFantasyName = ({ fantasyName, baseKey, setValue, control, useOptions, }) => {
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Nome Fantasia"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Nome (PT)"),
                    React.createElement(TableCell, null, "Nome (EN)"),
                    React.createElement(TableCell, null, "Nome (ES)"),
                    React.createElement(TableCell, null, "Uso"))),
            React.createElement(TableBody, null, fantasyName === null || fantasyName === void 0 ? void 0 : fantasyName.map((na, i) => (React.createElement(TableRow, { key: na === null || na === void 0 ? void 0 : na.id },
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.name`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.nameEn`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.nameEs`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.use`, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: useOptions, onChange: (event, newValue) => setValue(`${baseKey}.${i}.use`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'modality', label: '' }))) })) })))))))));
};
export const TableClassroom = ({ baseKey, control }) => {
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Aula"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Tema"),
                    React.createElement(TableCell, null, "Descri\u00E7\u00E3o/Objetivo"))),
            React.createElement(TableBody, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, { style: { width: '50%' } },
                        React.createElement(Controller, { control: control, name: `${baseKey}.theme`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                    React.createElement(TableCell, { style: { width: '50%' } },
                        React.createElement(Controller, { control: control, name: `${baseKey}.description`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })))))));
};
export const TableDocuments = ({ documents, baseKey, setValue, control }) => {
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Documentos"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Nome"),
                    React.createElement(TableCell, null, "Fonte"),
                    React.createElement(TableCell, null, "Link"),
                    React.createElement(TableCell, null, "Momento Entrega"))),
            React.createElement(TableBody, null, documents === null || documents === void 0 ? void 0 : documents.map((na, i) => (React.createElement(TableRow, { key: na === null || na === void 0 ? void 0 : na.id },
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.name`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.font`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.link`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '25%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.delivery`, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', options: Object.keys(EDeliveryType), onChange: (event, newValue) => setValue(`${baseKey}.${i}.delivery`, newValue), getOptionLabel: (option) => EDeliveryType[option], value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'delivery', label: '' }))) })) })))))))));
};
export const TableRequestAcademic = ({ academicRequests, baseKey, setValue, control, }) => {
    const { tag, person, finiteInfiniteResource } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const { finiteInfiniteResources } = finiteInfiniteResource;
    const equipmentsOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EQUIPAMENTO_OUTROS);
    }), [tags]);
    const finiteResources = React.useMemo(() => finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO), [finiteInfiniteResources]);
    const infiniteResources = React.useMemo(() => finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO), [finiteInfiniteResources]);
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Requisi\u00E7\u00E3o acad\u00EAmica"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Descri\u00E7\u00E3o"),
                    React.createElement(TableCell, null, "Momento Entrega"),
                    React.createElement(TableCell, null, "Data de Entrega"),
                    React.createElement(TableCell, null, "Prazo de Entrega"),
                    React.createElement(TableCell, null, "Link"),
                    React.createElement(TableCell, null, "Equipamentos"),
                    React.createElement(TableCell, null, "Recursos Finitos"),
                    React.createElement(TableCell, null, "Recursos Infinitos"),
                    React.createElement(TableCell, null, "Outros"))),
            React.createElement(TableBody, null, academicRequests === null || academicRequests === void 0 ? void 0 : academicRequests.map((na, i) => (React.createElement(TableRow, { key: na === null || na === void 0 ? void 0 : na.id },
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.description`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.delivery`, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', options: Object.keys(EDeliveryType), onChange: (event, newValue) => setValue(`${baseKey}.${i}.delivery`, newValue), getOptionLabel: (option) => EDeliveryType[option], value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'delivery', label: '' }))) })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.deliveryDate`, render: ({ field }) => (React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: '', value: field.value, onChange: (newValue) => setValue(`${baseKey}.${i}.deliveryDate`, newValue) })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.deadline`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.link`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.equipments`, render: ({ field }) => (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: equipmentsOptions, onChange: (event, newValue) => setValue(`${baseKey}.${i}.equipments`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.finiteResource`, render: ({ field }) => (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: finiteResources, onChange: (event, newValue) => setValue(`${baseKey}.${i}.finiteResource`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.infiniteResource`, render: ({ field }) => (React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: infiniteResources, onChange: (event, newValue) => setValue(`${baseKey}.${i}.infiniteResource`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '' }))) })) })),
                React.createElement(TableCell, null,
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.other`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })))))))));
};
export const TableParticipants = ({ participants, baseKey, setValue, control, useOptions, }) => {
    return (React.createElement(Box, { margin: 1 },
        React.createElement(TitleSubtable, { gutterBottom: true, variant: 'h6' }, "Participantes"),
        React.createElement(Table, { size: 'small', "aria-label": 'purchases' },
            React.createElement(TableHead, null,
                React.createElement(TableRow, null,
                    React.createElement(TableCell, null, "Data Limite de Preenchimento"),
                    React.createElement(TableCell, null, "Quantidade Prevista"),
                    React.createElement(TableCell, null, "Uso"))),
            React.createElement(TableBody, null, participants === null || participants === void 0 ? void 0 : participants.map((na, i) => (React.createElement(TableRow, { key: na === null || na === void 0 ? void 0 : na.id },
                React.createElement(TableCell, { style: { width: '33%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.date`, render: ({ field }) => (React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: '', value: field.value, onChange: (newValue) => setValue(`${baseKey}.${i}.date`, newValue) })) })),
                React.createElement(TableCell, { style: { width: '33%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.quantity`, render: ({ field }) => (React.createElement(ContentEditable, { html: (field.value && field.value.toString()) || '', onChange: field.onChange })) })),
                React.createElement(TableCell, { style: { width: '33%' } },
                    React.createElement(Controller, { control: control, name: `${baseKey}.${i}.use`, render: ({ field }) => (React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: useOptions, onChange: (event, newValue) => setValue(`${baseKey}.${i}.use`, newValue), getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: field === null || field === void 0 ? void 0 : field.value, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: `${baseKey}.${i}.use`, label: '' }))) })) })))))))));
};
//# sourceMappingURL=utils.js.map