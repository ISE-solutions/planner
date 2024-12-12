import * as React from 'react';
import { Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Popover, TextField, Typography, } from '@material-ui/core';
import { Close, FilterList } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, EFatherTag, EGroups } from '~/config/enums';
import { getActivities } from '~/store/modules/activity/actions';
import { useLoggedUser } from '~/hooks';
import { Autocomplete } from '@material-ui/lab';
const LoadModel = ({ open, onClose, onLoadModel }) => {
    const [optionChip, setOptionChip] = React.useState('Todos');
    const [personFilter, setPersonFilter] = React.useState();
    const [localFilter, setLocalFilter] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [models, setModels] = React.useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [modelSelected, setModelSelected] = React.useState({});
    const [filter, setFilter] = React.useState({
        model: true,
        filterTeam: true,
        active: 'Ativo',
        published: 'Sim',
        typeApplication: EActivityTypeApplication.MODELO_REFERENCIA,
        searchQuery: '',
    });
    const { currentUser, tags, persons } = useLoggedUser();
    React.useEffect(() => {
        handleFetchActivities();
    }, [filter]);
    const handleFetchActivities = () => {
        setLoading(true);
        getActivities(filter).then((activityData) => {
            setLoading(false);
            setModels(activityData);
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
        var _a;
        setFilter(Object.assign(Object.assign({}, filter), { academicArea: (_a = localFilter.academicArea) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], name: localFilter.name }));
        handleClosePopover();
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorEl(null);
    };
    const handleClose = () => {
        setModelSelected({});
        onClose();
    };
    const handleNext = () => {
        onLoadModel(modelSelected);
        handleClose();
    };
    const options = [
        EGroups.PLANEJAMENTO,
        EGroups.ADMISSOES,
        'Meus Modelos',
        'Criado Por',
        'Todos',
    ];
    const areaOptions = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    });
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Busca modelo de atividade",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', style: { gap: '1rem' } },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro"),
                        React.createElement(IconButton, { onClick: handleClick },
                            React.createElement(FilterList, null)),
                        React.createElement(Popover, { id: open ? 'filter-popover' : undefined, open: Boolean(anchorEl), anchorEl: anchorEl, onClose: handleClosePopover, anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'center',
                            }, transformOrigin: {
                                vertical: 'top',
                                horizontal: 'center',
                            } },
                            React.createElement(Box, { padding: '10px', minWidth: '25rem' },
                                React.createElement(Grid, { container: true, spacing: 2 },
                                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                        React.createElement(Autocomplete, { filterSelectedOptions: true, options: (areaOptions === null || areaOptions === void 0 ? void 0 : areaOptions.filter((e) => e[`${PREFIX}ativo`])) || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: localFilter.academicArea, onChange: (event, newValue) => {
                                                setLocalFilter(Object.assign(Object.assign({}, localFilter), { academicArea: newValue }));
                                            }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: '\u00C1rea Academica' }))) }))),
                                React.createElement(Box, { display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', style: { gap: '10px' } },
                                    React.createElement(Button, { onClick: () => setLocalFilter({}), variant: 'outlined' }, "Limpar"),
                                    React.createElement(Button, { onClick: handleFilter, variant: 'contained', color: 'primary' }, "Aplicar"))))),
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, options === null || options === void 0 ? void 0 : options.map((opt) => (React.createElement(Chip, { color: opt === optionChip ? 'primary' : 'default', onClick: () => handleOption(opt), label: opt })))),
                    optionChip === 'Criado Por' && (React.createElement(Autocomplete, { fullWidth: true, options: persons || [], noOptionsText: 'Sem opções', value: personFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => handleChangePerson(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa' }))) }))),
                React.createElement(Autocomplete, { fullWidth: true, options: models || [], noOptionsText: 'Sem opções', value: modelSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}titulo`]) || '', onChange: (event, newValue) => setModelSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modelo', InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                                loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                                params.InputProps.endAdornment)) }) }))) }),
                React.createElement(Box, { display: 'flex', width: '100%', marginTop: '2rem', padding: '0 4rem', justifyContent: 'center' },
                    React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Avan\u00E7ar"))))));
};
export default LoadModel;
//# sourceMappingURL=index.js.map