import * as React from 'react';
import * as moment from 'moment';
import { Title } from './styles';
import { Box, Button, Divider, Grid, MenuItem, TextField, Typography, } from '@material-ui/core';
import { AccessTime, Delete, Edit } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { useActivity, useConfirmation, useNotification } from '~/hooks';
import { EActivityTypeApplication } from '~/config/enums';
import EditActivityForm from '~/components/EditActivityForm';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import getDurationMoment from '~/utils/getDurationMoment';
import { Eventcalendar, localePtBR, Popup, setOptions, } from '@mobiscroll/react';
import * as _ from 'lodash';
import styles from './Calendar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { batchUpdateActivityAll, } from '~/store/modules/activity/actions';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import formatActivity from '~/utils/formatActivity';
const locale = 'pt-BR';
moment.locale(locale);
setOptions({
    locale: localePtBR,
    theme: 'ios',
    themeVariant: 'light',
});
const Calendar = ({ teamChoosed, context, canEdit, scheduleChoosed, refetchSchedule, refetchTeam, }) => {
    var _a, _b, _c, _d, _e;
    const [visible, setVisible] = React.useState(false);
    const [visibleTooltip, setVisibleTooltip] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [editDrawer, setEditDrawer] = React.useState({
        open: false,
        item: null,
    });
    const [schedulerData, setSchedulerData] = React.useState([]);
    const [cellDuration, setCellDuration] = React.useState(60);
    const [popup, setPopup] = React.useState({ open: false });
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
    const dispatch = useDispatch();
    const [{ activities, getActivity, desactiveActivity, refetch }] = useActivity({
        typeApplication: EActivityTypeApplication.MODELO,
        active: 'Ativo',
        teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
    });
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    React.useEffect(() => {
        setSchedulerData(activities === null || activities === void 0 ? void 0 : activities.map((activity) => (Object.assign(Object.assign({}, activity), { id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`], start: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('YYYY-MM-DD HH:mm:ss'), end: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]).format('YYYY-MM-DD HH:mm:ss') }))));
    }, [activities]);
    const handleDeleteAppointment = (activityId) => {
        let newSchedulerData = [...schedulerData];
        const itemDeleted = newSchedulerData.find((appointment) => appointment.id === activityId);
        newSchedulerData = newSchedulerData === null || newSchedulerData === void 0 ? void 0 : newSchedulerData.filter((appointment) => appointment.id !== activityId);
        desactiveActivity({
            type: 'definitivo',
            data: {
                [`${PREFIX}atividadeid`]: itemDeleted === null || itemDeleted === void 0 ? void 0 : itemDeleted[`${PREFIX}atividadeid`],
            },
        }, {});
        setSchedulerData(newSchedulerData);
        refetch();
    };
    const handleClose = () => {
        refetch();
        refetchSchedule();
        refetchTeam();
        setVisible(false);
    };
    const handleSuccess = (actv) => {
        refetch();
        setEditDrawer(Object.assign(Object.assign({}, editDrawer), { item: actv }));
        setLoading(false);
        notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleEdit = (item, onSuccess) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const spacesToDelete = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.filter((e) => { var _a; return !((_a = item.spaces) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}espacoid`])); });
        const equipmentsToDelete = (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Equipamentos`]) === null || _b === void 0 ? void 0 : _b.filter((e) => { var _a; return !((_a = item.equipments) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])); });
        const finiteInfiniteResourceToDelete = (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _c === void 0 ? void 0 : _c.filter((e) => {
            var _a, _b;
            return !((_a = item.finiteResource) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                e[`${PREFIX}recursofinitoinfinitoid`])) &&
                !((_b = item.infiniteResource) === null || _b === void 0 ? void 0 : _b.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                    e[`${PREFIX}recursofinitoinfinitoid`]));
        });
        const activitiesFromDay = (_e = (_d = schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'))) === null || _d === void 0 ? void 0 : _d.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _e === void 0 ? void 0 : _e.sort((a, b) => a.startTime.unix() - b.startTime.unix());
        const actvIndex = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.findIndex((e) => (e === null || e === void 0 ? void 0 : e.id) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`]));
        let nextActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.slice(actvIndex + 1, activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.length);
        const lastDateTime = moment.utc(item.endDate);
        let nextChanges = (_f = reorderTimeActivities(lastDateTime, nextActivities)) === null || _f === void 0 ? void 0 : _f.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivity(actv, {
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        }))));
        const scheduleEdit = (_g = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _g === void 0 ? void 0 : _g[0];
        const activitiesToEdit = [
            Object.assign(Object.assign({}, item), { [`${PREFIX}inicio`]: item.startTime.format('HH:mm'), [`${PREFIX}fim`]: item.endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: moment
                    .utc(item.startDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: moment
                    .utc(item.endDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'), endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_j = (_h = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j[`${PREFIX}cronogramadediaid`], 
                // activities: nextChanges,
                spacesToDelete: spacesToDelete, finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete, equipmentsToDelete: equipmentsToDelete }),
            ...nextChanges,
        ];
        // dispatch(
        //   updateActivityAll(
        //     {
        //       ...item,
        //       [`${PREFIX}datahorainicio`]: moment
        //         .utc(item.startDate)
        //         .format('YYYY-MM-DDTHH:mm:ss'),
        //       [`${PREFIX}datahorafim`]: moment
        //         .utc(item.endDate)
        //         .format('YYYY-MM-DDTHH:mm:ss'),
        //       teamId: teamChoosed?.[`${PREFIX}turmaid`],
        //       programId: teamChoosed?.[`_${PREFIX}programa_value`],
        //       scheduleId:
        //         item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
        //           `${PREFIX}cronogramadediaid`
        //         ],
        //       startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'),
        //       endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'),
        //       spacesToDelete: spacesToDelete,
        //       equipmentsToDelete: equipmentsToDelete,
        //       finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete,
        //     },
        //     {
        //       onSuccess: () => {
        //         handleSuccess();
        //         onSuccess?.();
        //       },
        //       onError: handleError,
        //     }
        //   )
        // );
        dispatch(batchUpdateActivityAll(activitiesToEdit, item, {
            teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
            programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`],
            scheduleId: scheduleEdit === null || scheduleEdit === void 0 ? void 0 : scheduleEdit[`${PREFIX}cronogramadediaid`],
        }, {
            onSuccess: (actv) => {
                handleSuccess(actv);
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            },
            onError: handleError,
        }));
        let newSchedulerData = [...schedulerData];
        newSchedulerData = newSchedulerData.map((appointment) => appointment.id === item.id ? item : appointment);
        setSchedulerData(newSchedulerData);
    };
    const onItemChange = ({ event, oldEvent }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (event.allDay) {
            setSchedulerData(_.cloneDeep(schedulerData));
            return;
        }
        setLoading(true);
        const start = moment(event.start.toString());
        const end = moment(event.end.toString());
        const activityUpdated = oldEvent;
        if (start.day() != end.day()) {
            return;
        }
        const item = Object.assign(Object.assign({}, activityUpdated), { id: activityUpdated.id, [`${PREFIX}atividadeid`]: activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}atividadeid`], teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_b = (_a = activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}cronogramadediaid`], startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, duration: getDurationMoment(start, end), [`${PREFIX}datahorainicio`]: start.format(), [`${PREFIX}datahorafim`]: end.format(), spaces: ((_c = activityUpdated[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.length)
                ? (_d = activityUpdated[`${PREFIX}Atividade_Espaco`]) === null || _d === void 0 ? void 0 : _d.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                : [], people: ((_e = activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _e === void 0 ? void 0 : _e.length)
                ? (_f = activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                    id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                    person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                    function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                }))
                : [] });
        const activitiesFromDay = (_h = (_g = schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'))) === null || _g === void 0 ? void 0 : _g.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _h === void 0 ? void 0 : _h.sort((a, b) => a.startTime.unix() - b.startTime.unix());
        const actvIndex = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.findIndex((e) => (e === null || e === void 0 ? void 0 : e.id) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`]));
        let nextActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.slice(actvIndex + 1, activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.length);
        const lastDateTime = moment(moment(item.endDate).format('YYYY-MM-DD HH:mm:ss'));
        let nextChanges = (_j = reorderTimeActivities(lastDateTime, nextActivities)) === null || _j === void 0 ? void 0 : _j.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivity(actv, {
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        }))));
        const scheduleEdit = (_k = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _k === void 0 ? void 0 : _k[0];
        const activitiesToEdit = [
            Object.assign(Object.assign({}, item), { [`${PREFIX}inicio`]: item.startTime.format('HH:mm'), [`${PREFIX}fim`]: item.endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: moment
                    .utc(item.startDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: moment
                    .utc(item.endDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'), endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_m = (_l = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m[`${PREFIX}cronogramadediaid`] }),
            ...nextChanges,
        ];
        dispatch(batchUpdateActivityAll(activitiesToEdit, item, {
            teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
            programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`],
            scheduleId: scheduleEdit === null || scheduleEdit === void 0 ? void 0 : scheduleEdit[`${PREFIX}cronogramadediaid`],
        }, {
            onSuccess: (actv) => {
                handleSuccess(actv);
            },
            onError: handleError,
        }));
        // dispatch(
        //   updateActivityAll(
        //     {
        //       ...activityUpdated,
        //       id: activityUpdated.id,
        //       [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
        //       scheduleId:
        //         activityUpdated?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
        //           `${PREFIX}cronogramadediaid`
        //         ],
        //       startDate: start.format(),
        //       endDate: end.format(),
        //       startTime: start,
        //       endTime: end,
        //       duration: getDurationMoment(start, end),
        //       [`${PREFIX}datahorainicio`]: start.format(),
        //       [`${PREFIX}datahorafim`]: end.format(),
        //       spaces: activityUpdated[`${PREFIX}Atividade_Espaco`]?.length
        //         ? activityUpdated[`${PREFIX}Atividade_Espaco`]?.map(
        //             (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
        //           )
        //         : [],
        //       people: activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]
        //         ?.length
        //         ? activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map(
        //             (e) => ({
        //               id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
        //               person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
        //               function: dictTag[e?.[`_${PREFIX}funcao_value`]],
        //             })
        //           )
        //         : [],
        //     },
        //     {
        //       onSuccess: handleSuccess,
        //       onError: handleError,
        //     }
        //   )
        // );
    };
    const handleOpenEditDrawer = (activity) => {
        setVisibleTooltip(false);
        getActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]).then((actv) => {
            var _a;
            setEditDrawer({ open: true, item: (_a = actv === null || actv === void 0 ? void 0 : actv.value) === null || _a === void 0 ? void 0 : _a[0] });
        });
    };
    const onEventClick = React.useCallback((args) => {
        const event = args.event;
        setPopup({ open: true, item: event, anchor: args.domEvent.target });
    }, []);
    const handleClosePopup = () => {
        setPopup({ open: false, item: null });
    };
    const handleCloseEditDrawer = () => {
        setEditDrawer({ open: false, item: null });
    };
    const responsivePopup = {
        medium: {
            display: 'center',
            width: 400,
            fullScreen: false,
            touchUi: false,
            showOverlay: false,
        },
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ScheduleDayForm, { isModel: true, visible: visible, titleRequired: false, context: context, team: teamChoosed, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], handleClose: handleClose }),
        React.createElement(EditActivityForm, { isModel: true, team: teamChoosed, onSave: handleEdit, open: editDrawer.open, activity: editDrawer.item, onClose: handleCloseEditDrawer, setActivity: handleOpenEditDrawer }),
        React.createElement(Box, { display: 'flex', marginBottom: '1rem', alignItems: 'center', style: { gap: '1rem' } },
            React.createElement(Title, null, teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}nome`]),
            React.createElement(Button, { variant: 'contained', color: 'primary', startIcon: React.createElement(IoCalendarNumberSharp, null), onClick: () => setVisible(true) }, "Criar dia de aula")),
        React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' },
            React.createElement(TextField, { select: true, fullWidth: true, style: { maxWidth: '10rem' }, value: cellDuration, label: 'Dura\u00E7\u00E3o do Intervalo', onChange: (event) => setCellDuration(+event.target.value) },
                React.createElement(MenuItem, { value: 15 }, "15 Minutos"),
                React.createElement(MenuItem, { value: 30 }, "30 Minutos"),
                React.createElement(MenuItem, { value: 60 }, "60 Minutos"))),
        React.createElement(Eventcalendar, { dragToMove: canEdit, dragToResize: canEdit, width: '100%', height: '65vh', firstDay: 0, renderHeader: () => (React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'center' }, "Atividades")), selectedDate: scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}data`], locale: localePtBR, data: schedulerData, min: '2006-01-01T00:00:00', view: {
                schedule: {
                    type: 'day',
                    allDay: false,
                    timeCellStep: cellDuration,
                    timeLabelStep: 60,
                },
            }, cssClass: styles.calendar, onEventUpdate: onItemChange, onEventClick: onEventClick }),
        React.createElement(Popup, { showArrow: true, showOverlay: true, display: 'anchored', anchor: popup.anchor, fullScreen: true, scrollLock: false, contentPadding: false, isOpen: popup.open, onClose: handleClosePopup, responsive: responsivePopup, cssClass: styles.popup },
            React.createElement(Box, { width: '100%', padding: '1rem' },
                React.createElement(Typography, { variant: 'h5', align: 'center' }, (_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.title)),
            React.createElement(Divider, null),
            React.createElement(Box, { padding: '1rem' }, !((_b = popup === null || popup === void 0 ? void 0 : popup.item) === null || _b === void 0 ? void 0 : _b.allDay) ? (React.createElement(React.Fragment, null,
                React.createElement(Grid, { container: true },
                    React.createElement(Grid, { item: true, xs: 1 },
                        React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                            React.createElement(AccessTime, null))),
                    React.createElement(Grid, { item: true, xs: 11 },
                        React.createElement(Typography, { variant: 'body1' },
                            moment((_c = popup === null || popup === void 0 ? void 0 : popup.item) === null || _c === void 0 ? void 0 : _c.start).format('HH:mm'),
                            " -",
                            ' ',
                            moment((_d = popup === null || popup === void 0 ? void 0 : popup.item) === null || _d === void 0 ? void 0 : _d.end).format('HH:mm')))))) : null),
            !((_e = popup === null || popup === void 0 ? void 0 : popup.item) === null || _e === void 0 ? void 0 : _e.allDay) ? (React.createElement(Box, { display: 'flex', padding: '1rem', style: { gap: '10px' } },
                React.createElement(Button, { fullWidth: true, onClick: () => {
                        handleClosePopup();
                        handleOpenEditDrawer(popup === null || popup === void 0 ? void 0 : popup.item);
                    }, startIcon: React.createElement(Edit, null), variant: 'contained', color: 'primary' }, "Editar"),
                React.createElement(Button, { fullWidth: true, disabled: !canEdit, onClick: () => {
                        handleClosePopup();
                        confirmation.openConfirmation({
                            title: 'Excluir Apontamento',
                            description: 'Você tem certeza que deseja excluir o apontamento?',
                            onConfirm: () => { var _a; return handleDeleteAppointment((_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.id); },
                        });
                    }, startIcon: React.createElement(Delete, null), variant: 'contained', color: 'secondary' }, "Excluir"))) : null)));
};
export default Calendar;
//# sourceMappingURL=index.js.map