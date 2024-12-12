import { Box, Button, Checkbox, Chip, CircularProgress, FormControlLabel, Grid, IconButton, Popover, TextField, Typography, } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import * as React from 'react';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser } from '~/hooks';
import { getTeams } from '~/store/modules/team/actions';
const LoadModel = ({ context, isModel, values, errors, setFieldValue, handleNext, }) => {
    const [optionChip, setOptionChip] = React.useState('Todos');
    const [loading, setLoading] = React.useState(false);
    const [showLoadDate, setShowLoadDate] = React.useState(false);
    const [personFilter, setPersonFilter] = React.useState();
    const [teams, setTeams] = React.useState([]);
    const [localFilter, setLocalFilter] = React.useState({
        modality: {},
        yearConclusion: '',
        initials: '',
    });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [filter, setFilter] = React.useState({
        model: true,
        filterTeam: true,
        top: TOP_QUANTITY,
        active: 'Ativo',
        published: 'Sim',
        searchQuery: '',
    });
    const { currentUser, tags, persons } = useLoggedUser();
    React.useEffect(() => {
        handleFetchTeams();
    }, [filter]);
    const handleFetchTeams = () => {
        setLoading(true);
        getTeams(filter).then((teamData) => {
            setLoading(false);
            setTeams(teamData);
        });
    };
    const handleOption = (opt) => {
        setOptionChip(opt);
        switch (opt) {
            case EGroups.PLANEJAMENTO:
            case EGroups.ADMISSOES:
                setFilter(Object.assign(Object.assign({}, filter), { group: opt, createdBy: '' }));
                break;
            case 'Meus Modelos':
                setFilter(Object.assign(Object.assign({}, filter), { group: '', createdBy: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`] }));
                break;
            default:
            case 'Todos':
                setFilter(Object.assign(Object.assign({}, filter), { group: '', createdBy: '' }));
                break;
        }
    };
    const handleFilter = () => {
        var _a;
        setFilter(Object.assign(Object.assign({}, filter), { modality: (_a = localFilter.modality) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], yearConclusion: localFilter.yearConclusion, initials: localFilter.initials }));
        handleClose();
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChangePerson = (person) => {
        setPersonFilter(person);
        setFilter(Object.assign(Object.assign({}, filter), { group: '', createdBy: person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`] }));
    };
    const handleChangeModel = (newValue) => {
        const schedule = newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}CronogramadeDia_Turma`].find((c) => !(c === null || c === void 0 ? void 0 : c[`${PREFIX}excluido`]) && (c === null || c === void 0 ? void 0 : c[`${PREFIX}ativo`]));
        const date = moment.utc(schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`]);
        if (date.format('YYYY') !== '2006') {
            setShowLoadDate(true);
        }
        else {
            setShowLoadDate(false);
        }
        setFieldValue('loadDate', false);
        setFieldValue('model', newValue);
    };
    const options = [
        EGroups.PLANEJAMENTO,
        EGroups.ADMISSOES,
        'Meus Modelos',
        'Criado Por',
        'Todos',
    ];
    const open = Boolean(anchorEl);
    const modalityOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_TURMA);
        })) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })));
    }, [tags]);
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', style: { gap: '1rem' } },
        React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro"),
                React.createElement(IconButton, { onClick: handleClick },
                    React.createElement(FilterList, null)),
                React.createElement(Popover, { id: open ? 'filter-popover' : undefined, open: open, anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'center',
                    }, transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    } },
                    React.createElement(Box, { padding: '10px' },
                        React.createElement(Grid, { container: true, spacing: 2 },
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (modalityOptions === null || modalityOptions === void 0 ? void 0 : modalityOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: localFilter.modality, onChange: (event, newValue) => {
                                        setLocalFilter(Object.assign(Object.assign({}, localFilter), { modality: newValue }));
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modalidade' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, type: 'number', onChange: (event) => setLocalFilter(Object.assign(Object.assign({}, localFilter), { yearConclusion: event.target.value })), value: localFilter.yearConclusion, label: 'Ano de Conclus\u00E3o' })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, onChange: (event) => setLocalFilter(Object.assign(Object.assign({}, localFilter), { initials: event.target.value })), value: localFilter.initials, label: 'Sigla' }))),
                        React.createElement(Box, { display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                            React.createElement(Button, { onClick: () => setLocalFilter({
                                    modality: {},
                                    yearConclusion: '',
                                    initials: '',
                                }), variant: 'outlined' }, "Limpar"),
                            React.createElement(Button, { onClick: handleFilter, variant: 'contained', color: 'primary' }, "Aplicar"))))),
            React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, options === null || options === void 0 ? void 0 : options.map((opt) => (React.createElement(Chip, { color: opt === optionChip ? 'primary' : 'default', onClick: () => handleOption(opt), label: opt })))),
            optionChip === 'Criado Por' && (React.createElement(Autocomplete, { fullWidth: true, options: persons || [], noOptionsText: 'Sem opções', value: personFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => handleChangePerson(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa' }))) }))),
        React.createElement(Autocomplete, { fullWidth: true, options: teams || [], noOptionsText: 'Sem opções', value: values.model, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}titulo`]) || '', onChange: (event, newValue) => handleChangeModel(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modelo', 
                // onChange={(event) =>
                //   setFilter({ ...filter, searchQuery: event.target.value })
                // }
                error: !!errors.model, 
                // @ts-ignore
                helperText: errors.model, InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                        loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                        params.InputProps.endAdornment)) }) }))) }),
        showLoadDate && (React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.loadDate, onChange: (event) => setFieldValue('loadDate', event.target.checked), name: 'loadDate', color: 'primary' }), label: 'Manter datas?' })),
        !isModel && (React.createElement(React.Fragment, null,
            React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, autoFocus: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data de In\u00EDcio', error: !!errors.startDate, 
                // @ts-ignore
                helperText: errors.startDate, value: values.startDate, onChange: (value) => {
                    setFieldValue('startDate', value);
                } }),
            React.createElement(TextField, { fullWidth: true, label: 'Ano de Conclus\u00E3o*', type: 'number', name: 'yearConclusion', error: !!errors.yearConclusion, helperText: errors.yearConclusion, onChange: (event) => parseInt(event.target.value) < 9999 &&
                    setFieldValue('yearConclusion', parseInt(event.target.value)), value: values.yearConclusion }),
            React.createElement(TextField, { fullWidth: true, label: 'Sigla*', type: 'text', name: 'sigla', error: !!errors.sigla, helperText: errors.sigla, onChange: (event) => setFieldValue('sigla', event.target.value), value: values.sigla }))),
        React.createElement(Box, { display: 'flex', width: '100%', marginTop: '1rem', padding: '0 4rem', justifyContent: 'center' },
            React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Avan\u00E7ar"))));
};
export default LoadModel;
//# sourceMappingURL=index.js.map