import * as React from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import { getAcademicRequestsByActivityId, updateActivityAll, } from '~/store/modules/activity/actions';
import * as _ from 'lodash';
import formatActivityModel from '~/utils/formatActivityModel';
import momentToMinutes from '~/utils/momentToMinutes';
const CloneActivity = ({ open, activity, refetchActivity, schedules, onClose, }) => {
    const [itemSelected, setItemSelected] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [academicRequests, setAcademicRequests] = React.useState([]);
    const dispatch = useDispatch();
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    React.useEffect(() => {
        if (activity) {
            getAcademicRequestsByActivityId(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]).then((data) => setAcademicRequests(data));
        }
    }, [activity]);
    const handleClose = () => {
        setItemSelected(null);
        onClose();
    };
    const handleSave = () => {
        var _a, _b, _c;
        setLoading(true);
        let activityToSave = _.cloneDeep(activity);
        const lastActivity = (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected.activities) === null || _a === void 0 ? void 0 : _a[((_b = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected.activities) === null || _b === void 0 ? void 0 : _b.length) - 1];
        const hasActivities = (_c = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected.activities) === null || _c === void 0 ? void 0 : _c.length;
        const durationMoment = moment(activityToSave === null || activityToSave === void 0 ? void 0 : activityToSave[`${PREFIX}duracao`], 'HH:mm');
        const duration = momentToMinutes(durationMoment);
        const endTime = moment(lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity[`${PREFIX}fim`], 'HH:mm')
            .add(duration, 'm')
            .format('HH:mm');
        activityToSave = formatActivityModel(Object.assign(Object.assign({}, activityToSave), { [`${PREFIX}inicio`]: hasActivities ? lastActivity === null || lastActivity === void 0 ? void 0 : lastActivity[`${PREFIX}fim`] : activityToSave[`${PREFIX}inicio`], [`${PREFIX}duracao`]: activityToSave === null || activityToSave === void 0 ? void 0 : activityToSave[`${PREFIX}duracao`], [`${PREFIX}fim`]: hasActivities ? endTime : activityToSave[`${PREFIX}inicio`], programId: activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}programa_value`], teamId: activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}turma_value`], [`${PREFIX}RequisicaoAcademica_Atividade`]: academicRequests }), moment.utc(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}data`]), {
            isModel: false,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        });
        dispatch(updateActivityAll(Object.assign(Object.assign({}, activityToSave), { scheduleId: itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}cronogramadediaid`] }), {
            onSuccess: () => {
                refetchActivity();
                setLoading(false);
                handleClose();
            },
            onError: (err) => {
                setLoading(false);
            },
        }));
    };
    const scheduleOptions = React.useMemo(() => schedules === null || schedules === void 0 ? void 0 : schedules.sort((a, b) => moment.utc(a === null || a === void 0 ? void 0 : a[`${PREFIX}data`]).diff(moment.utc(b === null || b === void 0 ? void 0 : b[`${PREFIX}data`]))), [schedules]);
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'sm' },
        React.createElement(DialogTitle, null,
            "Para qual dia a atividade ser\u00E1 clonada?",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
                React.createElement(Autocomplete, { fullWidth: true, options: scheduleOptions, noOptionsText: 'Sem opções', value: itemSelected, getOptionLabel: (option) => moment.utc(option === null || option === void 0 ? void 0 : option[`${PREFIX}data`]).format('DD/MM/YYYY') || '', onChange: (event, newValue) => setItemSelected(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Dia de aula' }))) }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: handleSave, variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default CloneActivity;
//# sourceMappingURL=index.js.map