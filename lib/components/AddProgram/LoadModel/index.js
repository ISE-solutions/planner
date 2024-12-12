import { Box, Button, Chip, CircularProgress, Grid, IconButton, Popover, TextField, Tooltip, Typography, } from '@material-ui/core';
import { FilterList, PlusOne } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as React from 'react';
import AddTag from '~/components/AddTag';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser } from '~/hooks';
import { getPrograms } from '~/store/modules/program/actions';
const LoadModel = ({ context, isModel, values, errors, setFieldValue, handleNext, }) => {
    var _a;
    const [optionChip, setOptionChip] = React.useState('Todos');
    const [personFilter, setPersonFilter] = React.useState();
    const [localFilter, setLocalFilter] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [programs, setPrograms] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const [filter, setFilter] = React.useState({
        model: true,
        filterTeam: true,
        top: TOP_QUANTITY,
        published: 'Sim',
        active: 'Ativo',
        searchQuery: '',
    });
    const { currentUser, tags, persons } = useLoggedUser();
    React.useEffect(() => {
        handleFetchPrograms();
    }, [filter]);
    const handleFetchPrograms = () => {
        setLoading(true);
        getPrograms(filter).then((programData) => {
            setLoading(false);
            setPrograms(programData);
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
    const handleChangePerson = (person) => {
        setPersonFilter(person);
        setFilter(Object.assign(Object.assign({}, filter), { group: '', createdBy: person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`] }));
    };
    const handleFilter = () => {
        var _a, _b, _c, _d;
        setFilter(Object.assign(Object.assign({}, filter), { typeProgram: (_a = localFilter.typeProgram) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], nameProgram: (_b = localFilter.nameProgram) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`], institute: (_c = localFilter.institute) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], company: (_d = localFilter.company) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`] }));
        handleClose();
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCreate = () => { };
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const options = [
        EGroups.PLANEJAMENTO,
        EGroups.ADMISSOES,
        'Meus Modelos',
        'Criado Por',
        'Todos',
    ];
    const open = Boolean(anchorEl);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const typeProgramOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_PROGRAMA);
        })) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })));
    }, [tags]);
    const nameProgramOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NOME_PROGRAMA);
        })) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })));
    }, [tags]);
    const instituteOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.INSTITUTO);
        })) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })));
    }, [tags]);
    const companyOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EMPRESA);
        })) === null || _a === void 0 ? void 0 : _a.map((tag) => (Object.assign(Object.assign({}, tag), { value: tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`], label: (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) || '' })));
    }, [tags]);
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', style: { gap: '1rem' } },
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag }),
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
                    React.createElement(Box, { padding: '10px', minWidth: '25rem' },
                        React.createElement(Grid, { container: true, spacing: 2 },
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (typeProgramOptions === null || typeProgramOptions === void 0 ? void 0 : typeProgramOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: localFilter.typeProgram, onChange: (event, newValue) => {
                                        setLocalFilter(Object.assign(Object.assign({}, localFilter), { typeProgram: newValue }));
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Tipo do Programa' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (nameProgramOptions === null || nameProgramOptions === void 0 ? void 0 : nameProgramOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: localFilter.nameProgram, onChange: (event, newValue) => {
                                        setLocalFilter(Object.assign(Object.assign({}, localFilter), { nameProgram: newValue }));
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Nome do Programa' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (instituteOptions === null || instituteOptions === void 0 ? void 0 : instituteOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: localFilter.institute, onChange: (event, newValue) => {
                                        setLocalFilter(Object.assign(Object.assign({}, localFilter), { institute: newValue }));
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Instituto' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (companyOptions === null || companyOptions === void 0 ? void 0 : companyOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: localFilter.company, onChange: (event, newValue) => {
                                        setLocalFilter(Object.assign(Object.assign({}, localFilter), { company: newValue }));
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Empresa' }))) }))),
                        React.createElement(Box, { display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                            React.createElement(Button, { onClick: () => setLocalFilter({}), variant: 'outlined' }, "Limpar"),
                            React.createElement(Button, { onClick: handleFilter, variant: 'contained', color: 'primary' }, "Aplicar"))))),
            React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, options === null || options === void 0 ? void 0 : options.map((opt) => (React.createElement(Chip, { color: opt === optionChip ? 'primary' : 'default', onClick: () => handleOption(opt), label: opt })))),
            optionChip === 'Criado Por' && (React.createElement(Autocomplete, { fullWidth: true, options: persons || [], noOptionsText: 'Sem opções', value: personFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => handleChangePerson(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa' }))) }))),
        React.createElement(Autocomplete, { fullWidth: true, options: programs || [], noOptionsText: 'Sem opções', value: values.model, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}titulo`]) || '', onChange: (event, newValue) => {
                var _a, _b;
                setFieldValue('model', newValue);
                setFieldValue('items', (_b = (_a = newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}Programa_Turma`]) === null || _a === void 0 ? void 0 : _a.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`])) === null || _b === void 0 ? void 0 : _b.map((te) => ({
                    id: te === null || te === void 0 ? void 0 : te[`${PREFIX}turmaid`],
                    label: te === null || te === void 0 ? void 0 : te[`${PREFIX}nome`],
                    sigla: '',
                    yearConclusion: '',
                })));
            }, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modelo', 
                // onChange={(event) =>
                //   setFilter({ ...filter, searchQuery: event.target.value })
                // }
                error: !!errors.model, 
                // @ts-ignore
                helperText: errors.model, InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                        loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                        params.InputProps.endAdornment)) }) }))) }),
        !isModel && (React.createElement(React.Fragment, null,
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: (nameProgramOptions === null || nameProgramOptions === void 0 ? void 0 : nameProgramOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.nameProgram, onChange: (event, newValue) => {
                        setFieldValue('nameProgram', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Nome do Programa', error: !!errors.nameProgram, helperText: errors.nameProgram }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { onClick: () => handleNewTag(EFatherTag.NOME_PROGRAMA) },
                        React.createElement(PlusOne, null)))),
            React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, autoFocus: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data de In\u00EDcio', error: !!errors.startDate, 
                // @ts-ignore
                helperText: errors.startDate, value: values.startDate, onChange: (value) => {
                    setFieldValue('startDate', value);
                } }))),
        !isModel && (React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', overflow: 'hidden auto', style: { gap: '1rem' }, height: 'calc(100vh - 30rem)' }, (_a = values === null || values === void 0 ? void 0 : values.items) === null || _a === void 0 ? void 0 : _a.map((te, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return (React.createElement(Box, null,
                React.createElement(Box, { display: 'flex', flexDirection: 'column' },
                    React.createElement(Typography, null, te === null || te === void 0 ? void 0 : te.label),
                    React.createElement(Grid, { container: true, spacing: 3 },
                        React.createElement(Grid, { item: true, sm: 6, md: 6, lg: 6 },
                            React.createElement(TextField, { fullWidth: true, label: 'Sigla*', type: 'text', name: `items[${i}].sigla`, inputProps: { maxLength: 50 }, error: !!((_a = errors === null || errors === void 0 ? void 0 : errors.items) === null || _a === void 0 ? void 0 : _a[i].sigla), helperText: (_b = errors === null || errors === void 0 ? void 0 : errors.items) === null || _b === void 0 ? void 0 : _b[i].sigla, onChange: (e) => setFieldValue(`items[${i}].sigla`, e.target.value), value: (_d = (_c = values === null || values === void 0 ? void 0 : values.items) === null || _c === void 0 ? void 0 : _c[i]) === null || _d === void 0 ? void 0 : _d.sigla })),
                        React.createElement(Grid, { item: true, sm: 6, md: 6, lg: 6 },
                            React.createElement(TextField, { fullWidth: true, label: 'Ano de Conclusão*', type: 'number', name: `items[${i}].yearConclusion`, error: !!((_e = errors === null || errors === void 0 ? void 0 : errors.items) === null || _e === void 0 ? void 0 : _e[i].yearConclusion), helperText: (_f = errors === null || errors === void 0 ? void 0 : errors.items) === null || _f === void 0 ? void 0 : _f[i].yearConclusion, onChange: (event) => parseInt(event.target.value) < 9999 &&
                                    setFieldValue(`items[${i}].yearConclusion`, event.target.value), value: (_h = (_g = values === null || values === void 0 ? void 0 : values.items) === null || _g === void 0 ? void 0 : _g[i]) === null || _h === void 0 ? void 0 : _h.yearConclusion }))))));
        }))),
        React.createElement(Box, { display: 'flex', width: '100%', marginTop: '2rem', padding: '0 4rem', justifyContent: 'center' },
            React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Criar"))));
};
export default LoadModel;
//# sourceMappingURL=index.js.map