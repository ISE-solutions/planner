import { Box, Button, Checkbox, Chip, CircularProgress, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, } from '@material-ui/core';
import * as _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as React from 'react';
import { IconHelpTooltip } from '~/components';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { useFiniteInfiniteResource } from '~/hooks';
import { Title } from './styles';
import { useSelector } from 'react-redux';
import { EFatherTag } from '~/config/enums';
const FilterResources = ({ values, errors, loading, setFieldValue, handleFilter, }) => {
    const [typeResource, setTypeResource] = React.useState('Pessoa');
    const [resourceSelected, setResourceSelected] = React.useState({});
    const [filterResource, setFilterResource] = React.useState({
        top: TOP_QUANTITY,
        active: 'Ativo',
        searchQuery: '',
    });
    const { space, person, tag } = useSelector((state) => state);
    const { tags } = tag;
    const { spaces } = space;
    const { persons } = person;
    const [{ loading: loadingFiniteResource, refetch: getFiniteResource, resources },] = useFiniteInfiniteResource(filterResource, {
        manual: true,
    });
    React.useEffect(() => {
        switch (typeResource) {
            case 'Recurso Finito':
                getFiniteResource();
                break;
        }
    }, [filterResource]);
    const dataOptions = () => {
        switch (typeResource) {
            case 'Pessoa':
                return persons;
            case 'Espaço':
                return spaces;
            case 'Recurso Finito':
                return resources;
            default:
                return [];
        }
    };
    const handleAddFilter = () => {
        let newFilter = null;
        if (!Object.keys(resourceSelected).length) {
            return;
        }
        switch (typeResource) {
            case 'Pessoa':
                newFilter = {
                    typeResource,
                    value: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}pessoaid`],
                    label: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}nome`],
                };
                const newPeople = [...values.people];
                newPeople.push(newFilter);
                setFieldValue('people', newPeople);
                break;
            case 'Espaço':
                newFilter = {
                    typeResource,
                    value: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}espacoid`],
                    label: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}nome`],
                };
                const newSpace = _.cloneDeep(values.spaces);
                newSpace.push(newFilter);
                setFieldValue('spaces', newSpace);
                break;
            case 'Recurso Finito':
                newFilter = {
                    typeResource,
                    value: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}pessoaid`],
                    label: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}nome`],
                };
                break;
            case 'Recurso Ininito':
                newFilter = {
                    typeResource,
                    value: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}pessoaid`],
                    label: resourceSelected === null || resourceSelected === void 0 ? void 0 : resourceSelected[`${PREFIX}nome`],
                };
                break;
        }
        setResourceSelected({});
    };
    const handleRemove = (item) => {
        var _a, _b, _c;
        switch (item.typeResource) {
            case 'Pessoa':
                const newPeople = (_a = values.people) === null || _a === void 0 ? void 0 : _a.filter((e) => e.value !== item.value);
                setFieldValue('people', newPeople);
                break;
            case 'Espaço':
                const newSpace = (_b = values.spaces) === null || _b === void 0 ? void 0 : _b.filter((e) => e.value !== item.value);
                setFieldValue('spaces', newSpace);
                break;
            case 'Recurso Finito':
                const newFiniteResource = (_c = values.spaces) === null || _c === void 0 ? void 0 : _c.filter((e) => e.value !== item.value);
                setFieldValue('spaces', newSpace);
                break;
        }
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
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
        React.createElement(Title, null, "Filtro"),
        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, autoFocus: true, fullWidth: true, format: 'MM/YYYY', views: ['month', 'year'], variant: 'inline', label: 'In\u00EDcio', error: !!errors.startDate, helperText: errors.startDate, value: values.startDate, onChange: (value) => setFieldValue('startDate', value) }),
        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, format: 'MM/YYYY', views: ['month', 'year'], variant: 'inline', label: 'Fim', error: !!errors.endDate, helperText: errors.endDate, value: values.endDate, onChange: (value) => setFieldValue('endDate', value) }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '10px', borderRadius: '10px', border: '1px solid #0063a5', style: { gap: '1rem' } },
            React.createElement(FormControl, { fullWidth: true },
                React.createElement(InputLabel, { id: 'recurso-label' }, "Recurso"),
                React.createElement(Select, { fullWidth: true, labelId: 'recurso-label', value: typeResource, onChange: (event) => {
                        setTypeResource(event.target.value);
                        setFieldValue('tagsFilter', null);
                        setResourceSelected(null);
                    } },
                    React.createElement(MenuItem, { value: 'Pessoa' }, "Pessoa"),
                    React.createElement(MenuItem, { value: 'Espa\u00E7o' }, "Espa\u00E7o"))),
            React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.onlyConflicts, onChange: (event) => setFieldValue('onlyConflicts', event.target.checked), name: 'onlyConflicts', color: 'primary' }), label: 'Apenas conflitos?' }),
            React.createElement(Autocomplete, { fullWidth: true, 
                // multiple
                options: typeResource === 'Pessoa' ? peopleFilterOptions : spaceFilterOptions, noOptionsText: 'Sem opções', value: values.tagsFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setFieldValue('tagsFilter', newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Etiqueta' }))) }),
            React.createElement(Autocomplete, { fullWidth: true, options: dataOptions() || [], noOptionsText: 'Sem opções', value: resourceSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setResourceSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '5px' } },
                        typeResource,
                        React.createElement(IconHelpTooltip, { title: 'Digite pelo menos 3 caracteres para realizar a busca.' })), onChange: (event) => setFilterResource(Object.assign(Object.assign({}, filterResource), { searchQuery: event.target.value })), InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                            loadingFiniteResource ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                            params.InputProps.endAdornment)) }) }))) }),
            React.createElement(Button, { variant: 'contained', onClick: handleAddFilter, color: 'secondary' }, "Adicionar")),
        React.createElement(Button, { variant: 'contained', onClick: handleFilter, color: 'primary' }, loading ? (React.createElement(CircularProgress, { style: { color: '#fff' }, size: 20 })) : ('Filtrar')),
        React.createElement(Divider, null),
        React.createElement(Box, { display: 'flex', flexWrap: 'wrap', style: { gap: '10px' } }, [...values.people, ...values.spaces].map((item) => (React.createElement(Chip, { label: item.label, onDelete: () => handleRemove(item) }))))));
};
export default FilterResources;
//# sourceMappingURL=index.js.map