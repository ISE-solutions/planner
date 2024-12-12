import * as React from 'react';
import { Box, Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, TextField, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EGroups } from '~/config/enums';
import { getSchedules } from '~/store/modules/schedule/actions';
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
    const [infoToLoad, setInfoToLoad] = React.useState({
        info: true,
        activities: true,
        envolvedPeople: true,
        attachments: true,
        observation: true,
    });
    const [filter, setFilter] = React.useState({
        model: true,
        group: 'Não',
        active: 'Ativo',
        published: 'Sim',
        searchQuery: '',
    });
    const { currentUser, tags, persons } = useLoggedUser();
    React.useEffect(() => {
        handleFetchSchedules();
    }, [filter]);
    const handleFetchSchedules = () => {
        setLoading(true);
        getSchedules(filter).then((activityData) => {
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
        onLoadModel(modelSelected, infoToLoad);
        handleClose();
    };
    const options = [
        EGroups.PLANEJAMENTO,
        EGroups.ADMISSOES,
        'Meus Modelos',
        'Criado Por',
        'Todos',
    ];
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Busca modelo de dia de aula",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', style: { gap: '1rem' } },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro")),
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, options === null || options === void 0 ? void 0 : options.map((opt) => (React.createElement(Chip, { color: opt === optionChip ? 'primary' : 'default', onClick: () => handleOption(opt), label: opt })))),
                    optionChip === 'Criado Por' && (React.createElement(Autocomplete, { fullWidth: true, options: persons || [], noOptionsText: 'Sem opções', value: personFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => handleChangePerson(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa' }))) }))),
                React.createElement(Autocomplete, { fullWidth: true, options: models || [], noOptionsText: 'Sem opções', value: modelSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setModelSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modelo', InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                                loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                                params.InputProps.endAdornment)) }) }))) }),
                React.createElement(Box, null,
                    React.createElement(FormControl, { style: { marginTop: '1rem' }, component: 'fieldset' },
                        React.createElement(FormLabel, { component: 'legend' }, "Quais informa\u00E7\u00F5es voc\u00EA deseja sobrescrever?"),
                        React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: infoToLoad.info, onChange: (event) => setInfoToLoad(Object.assign(Object.assign({}, infoToLoad), { info: event.target.checked })), name: 'info', color: 'primary' }), label: 'Informa\u00E7\u00F5es' }),
                        React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: infoToLoad.activities, onChange: (event) => setInfoToLoad(Object.assign(Object.assign({}, infoToLoad), { activities: event.target.checked })), name: 'activities', color: 'primary' }), label: 'Atividades' }),
                        React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: infoToLoad.envolvedPeople, onChange: (event) => setInfoToLoad(Object.assign(Object.assign({}, infoToLoad), { envolvedPeople: event.target.checked })), name: 'envolvedPeople', color: 'primary' }), label: 'Pessoas envolvidas' }),
                        React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: infoToLoad.attachments, onChange: (event) => setInfoToLoad(Object.assign(Object.assign({}, infoToLoad), { attachments: event.target.checked })), name: 'attachments', color: 'primary' }), label: 'Anexos' }),
                        React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: infoToLoad.observation, onChange: (event) => setInfoToLoad(Object.assign(Object.assign({}, infoToLoad), { observation: event.target.checked })), name: 'observation', color: 'primary' }), label: 'Observa\u00E7\u00E3o' }))),
                React.createElement(Box, { display: 'flex', width: '100%', marginTop: '2rem', padding: '0 4rem', justifyContent: 'center' },
                    React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Avan\u00E7ar"))))));
};
export default LoadModel;
//# sourceMappingURL=index.js.map