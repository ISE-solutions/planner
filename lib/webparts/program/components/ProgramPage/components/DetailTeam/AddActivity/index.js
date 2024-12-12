import * as React from 'react';
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import { getActivities, updateActivityAll, } from '~/store/modules/activity/actions';
import { Autocomplete } from '@material-ui/lab';
import * as _ from 'lodash';
import formatActivityModel from '~/utils/formatActivityModel';
import * as moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
const AddActivity = ({ open, date, schedule, programId, teamId, refetchActivity, onClose, }) => {
    const [optionChip, setOptionChip] = React.useState(TYPE_ACTIVITY.ACADEMICA);
    const [loading, setLoading] = React.useState(false);
    const [activities, setActivities] = React.useState([]);
    const [activitySelected, setActivitySelected] = React.useState({});
    const dispatch = useDispatch();
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
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
    const handleSave = () => {
        if (!activitySelected) {
            return;
        }
        setLoading(true);
        let activityToSave = _.cloneDeep(activitySelected);
        activityToSave = formatActivityModel(Object.assign(Object.assign({}, activityToSave), { [`${PREFIX}inicio`]: date.format('HH:mm'), programId,
            teamId }), moment.utc(date.format('YYYY-MM-DDTHH:mm:ssZ')), {
            isModel: false,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        });
        dispatch(updateActivityAll(Object.assign(Object.assign({}, activityToSave), { scheduleId: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}cronogramadediaid`] }), {
            onSuccess: () => {
                refetchActivity();
                setLoading(false);
                setActivitySelected({});
                handleClose();
            },
            onError: (err, actv) => {
                setLoading(false);
                setActivitySelected(actv);
            },
        }));
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
                React.createElement(Autocomplete, { fullWidth: true, options: activityOptions || [], noOptionsText: 'Sem opções', value: activitySelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setActivitySelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Atividade' }))) }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: handleSave, disabled: !Object.keys(activitySelected).length, variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default AddActivity;
//# sourceMappingURL=index.js.map