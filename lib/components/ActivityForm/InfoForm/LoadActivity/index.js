import * as React from 'react';
import { Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import { getActivities } from '~/store/modules/activity/actions';
import { Autocomplete } from '@material-ui/lab';
import { useConfirmation } from '~/hooks';
const LoadActivity = ({ open, currentActivity, onClose, onLoadActivity, }) => {
    const [optionChip, setOptionChip] = React.useState(TYPE_ACTIVITY.ACADEMICA);
    const [loading, setLoading] = React.useState(false);
    const [activities, setActivities] = React.useState([]);
    const [activitySelected, setActivitySelected] = React.useState({});
    const { confirmation } = useConfirmation();
    React.useEffect(() => {
        handleFetchActivities();
    }, []);
    const handleFetchActivities = () => {
        setLoading(true);
        getActivities({
            active: 'Ativo',
            typeApplication: EActivityTypeApplication.PLANEJAMENTO,
        }).then((activityData) => {
            setLoading(false);
            setActivities(activityData);
        });
    };
    const handleClose = () => {
        setActivitySelected({});
        onClose();
    };
    const handleNext = () => {
        if ((currentActivity === null || currentActivity === void 0 ? void 0 : currentActivity[`${PREFIX}tipo`]) !== (activitySelected === null || activitySelected === void 0 ? void 0 : activitySelected[`${PREFIX}tipo`])) {
            confirmation.openConfirmation({
                onConfirm: () => {
                    onLoadActivity(activitySelected);
                    handleClose();
                },
                title: 'Confirmação',
                description: 'Você está alterando o tipo de atividade, tem certeza de realizar essa ação',
            });
        }
        else {
            onLoadActivity(activitySelected);
            handleClose();
        }
    };
    const options = [
        { value: TYPE_ACTIVITY.ACADEMICA, label: 'Acadêmica' },
        { value: TYPE_ACTIVITY.NON_ACADEMICA, label: 'Não Acadêmica' },
        { value: TYPE_ACTIVITY.INTERNAL, label: 'Interna' },
    ];
    const activityOptions = React.useMemo(() => activities.filter((act) => (act === null || act === void 0 ? void 0 : act[`${PREFIX}tipo`]) === optionChip), [activities, optionChip]);
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Busca de atividade",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', padding: '2rem', style: { gap: '1rem' } },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro")),
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, options === null || options === void 0 ? void 0 : options.map((opt) => (React.createElement(Chip, { color: opt.value === optionChip ? 'primary' : 'default', onClick: () => setOptionChip(opt.value), label: opt.label }))))),
                React.createElement(Autocomplete, { fullWidth: true, options: activityOptions || [], noOptionsText: 'Sem opções', value: activitySelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setActivitySelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Atividade', InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                                loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                                params.InputProps.endAdornment)) }) }))) }),
                React.createElement(Box, { display: 'flex', width: '100%', marginTop: '2rem', padding: '0 4rem', justifyContent: 'center' },
                    React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Avan\u00E7ar"))))));
};
export default LoadActivity;
//# sourceMappingURL=index.js.map