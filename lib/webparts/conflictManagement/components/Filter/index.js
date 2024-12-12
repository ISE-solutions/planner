import { Box, Button, Chip, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, TextField, Tooltip, Typography, } from '@material-ui/core';
import * as _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import * as React from 'react';
import { IconHelpTooltip } from '~/components';
import { PREFIX } from '~/config/database';
import { DateCalendarStyled, Title, WrapperDatePicker } from './styles';
import { EFatherTag } from '~/config/enums';
import { Datepicker } from '@mobiscroll/react';
import * as moment from 'moment';
import { Replay } from '@material-ui/icons';
import { AVAILABILITY } from '../constants';
const Filter = ({ values, persons, spaces, tags, errors, loading, setFieldValue, handleFilter, }) => {
    const [resourceSelected, setResourceSelected] = React.useState([]);
    const dataOptions = () => {
        switch (values.typeResource) {
            case 'Pessoa':
                return persons;
            case 'Espaço':
                return spaces;
            default:
                return [];
        }
    };
    const handleAddFilter = () => {
        var _a, _b;
        if (!Object.keys(resourceSelected).length) {
            return;
        }
        switch (values.typeResource) {
            case 'Pessoa':
                if ((_a = values === null || values === void 0 ? void 0 : values.people) === null || _a === void 0 ? void 0 : _a.some((pe) => (pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}pessoaid`]) ===
                    (resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}pessoaid`]))) {
                    setResourceSelected([]);
                    return;
                }
                const newPeople = [...values.people];
                newPeople.push(resourceSelected);
                setFieldValue('people', newPeople);
                break;
            case 'Espaço':
                if ((_b = values === null || values === void 0 ? void 0 : values.spaces) === null || _b === void 0 ? void 0 : _b.some((pe) => (pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}espacoid`]) ===
                    (resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}espacoid`]))) {
                    setResourceSelected([]);
                    return;
                }
                const newSpace = _.cloneDeep(values.spaces);
                newSpace.push(resourceSelected);
                setFieldValue('spaces', newSpace);
                break;
        }
        setResourceSelected([]);
    };
    const handleRemove = (item) => {
        var _a, _b;
        switch (values.typeResource) {
            case 'Pessoa':
                const newPeople = (_a = values.people) === null || _a === void 0 ? void 0 : _a.filter((e) => e.id !== item.id);
                setFieldValue('people', newPeople);
                break;
            case 'Espaço':
                const newSpace = (_b = values.spaces) === null || _b === void 0 ? void 0 : _b.filter((e) => e.id !== item.id);
                setFieldValue('spaces', newSpace);
                break;
        }
    };
    const handleChangeTypeResource = (event) => {
        setFieldValue('typeResource', event.target.value);
        setFieldValue('people', []);
        setFieldValue('spaces', []);
        setFieldValue('tagsFilter', []);
        setResourceSelected([]);
    };
    const handleChangeDate = (ev) => {
        const value = ev.value;
        setFieldValue('startDate', moment(value[0]).utc());
        setFieldValue('endDate', moment(value[1]).utc());
    };
    const handleChangeDatePicker = (newValue) => {
        setFieldValue('startDate', newValue);
        setFieldValue('endDate', newValue);
    };
    const spaceFilterOptions = React.useMemo(() => tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_ESPACO));
    }), [tags]);
    const peopleFilterOptions = React.useMemo(() => tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO));
    }), [tags]);
    return (React.createElement(Box, { display: 'flex', maxHeight: '81vh', overflow: 'auto', paddingRight: '10px', flexDirection: 'column', style: { gap: '1rem' } },
        React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
            React.createElement(Title, null, "Filtro"),
            React.createElement(Tooltip, { title: 'Atualizar' },
                React.createElement(IconButton, { onClick: handleFilter },
                    React.createElement(Replay, null)))),
        React.createElement(WrapperDatePicker, { display: 'flex', flexDirection: 'column' },
            React.createElement(Typography, null, "Per\u00EDodo"),
            React.createElement(Datepicker, { touchUi: true, pages: 2, maxRange: 60, firstDay: 0, theme: 'ios', value: [values.startDate, values.endDate], onChange: handleChangeDate, returnFormat: 'moment', themeVariant: 'light', labelStyle: 'inline', inputStyle: 'outline', controls: ['calendar'], select: 'range', display: 'anchored', placeholder: 'Per\u00EDodo' })),
        React.createElement(Box, null,
            React.createElement(DateCalendarStyled, { value: values.startDate, onChange: (value) => handleChangeDatePicker(value) })),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '10px', borderRadius: '10px', border: '1px solid #0063a5', style: { gap: '1rem' } },
            React.createElement(FormControl, { component: 'fieldset' },
                React.createElement(FormLabel, { component: 'legend' }, "Recurso"),
                React.createElement(RadioGroup, { "aria-label": 'resource', name: 'resource', value: values.typeResource, onChange: handleChangeTypeResource },
                    React.createElement(FormControlLabel, { value: 'Pessoa', control: React.createElement(Radio, null), label: 'Pessoa' }),
                    React.createElement(FormControlLabel, { value: 'Espa\u00E7o', control: React.createElement(Radio, null), label: 'Espa\u00E7o' }))),
            React.createElement(FormControl, { component: 'fieldset' },
                React.createElement(FormLabel, { component: 'legend' }, "Disponibilidade"),
                React.createElement(RadioGroup, { "aria-label": 'availability', name: 'availability', value: values.availability, onChange: (ev) => setFieldValue('availability', ev.target.value) },
                    React.createElement(FormControlLabel, { value: '', control: React.createElement(Radio, null), label: 'Todos' }),
                    React.createElement(FormControlLabel, { value: AVAILABILITY.CONFLITO, control: React.createElement(Radio, null), label: 'Apenas conflito' }),
                    React.createElement(FormControlLabel, { value: AVAILABILITY.PARCIALMENTE_LIVRE, control: React.createElement(Radio, null), label: 'Parcialmente livre' }),
                    React.createElement(FormControlLabel, { value: AVAILABILITY.TOTALMENTE_LIVRE, control: React.createElement(Radio, null), label: 'Totalmente livre' }))),
            React.createElement(Autocomplete, { fullWidth: true, multiple: true, options: (values.typeResource === 'Pessoa'
                    ? peopleFilterOptions
                    : spaceFilterOptions) || [], noOptionsText: 'Sem opções', value: values.tagsFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setFieldValue('tagsFilter', newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Etiqueta' }))) }),
            React.createElement(Autocomplete, { fullWidth: true, options: dataOptions() || [], noOptionsText: 'Sem opções', value: resourceSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => setResourceSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '5px' } },
                        values.typeResource,
                        React.createElement(IconHelpTooltip, { title: 'Digite pelo menos 3 caracteres para realizar a busca.' })) }))) }),
            React.createElement(Button, { variant: 'contained', onClick: handleAddFilter, color: 'secondary' }, "Adicionar")),
        React.createElement(Button, { variant: 'contained', onClick: handleFilter, color: 'primary' }, loading ? (React.createElement(CircularProgress, { style: { color: '#fff' }, size: 20 })) : ('Filtrar')),
        React.createElement(Divider, null),
        React.createElement(Box, { display: 'flex', flexWrap: 'wrap', style: { gap: '10px' } }, [...(values.people || []), ...(values.spaces || [])].map((item) => (React.createElement(Chip, { label: item.title, onDelete: () => handleRemove(item) }))))));
};
export default Filter;
//# sourceMappingURL=index.js.map