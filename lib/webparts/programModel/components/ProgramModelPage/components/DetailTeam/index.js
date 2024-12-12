import * as React from 'react';
import * as moment from 'moment';
import { Box, Button, Divider, Grid, IconButton, Menu, MenuItem, TextField, Typography, } from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { AccessTime, CalendarTodayRounded, Delete, Edit, List, MoreVert, } from '@material-ui/icons';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import EditActivityForm from '~/components/EditActivityForm';
import { PREFIX } from '~/config/database';
import { useActivity, useConfirmation, useNotification } from '~/hooks';
import { Title } from '../DetailProgram/styles';
import { EActivityTypeApplication } from '~/config/enums';
import getDurationMoment from '~/utils/getDurationMoment';
import styles from './DetailTeam.module.scss';
import { CalendarNext, CalendarPrev, CalendarToday, Eventcalendar, formatDate, localePtBR, Popup, SegmentedGroup, SegmentedItem, } from '@mobiscroll/react';
import { BoxDay, TitleResource, } from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { batchUpdateActivityAll, deleteActivity, } from '~/store/modules/activity/actions';
import { deleteSchedule } from '~/store/modules/schedule/actions';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import formatActivity from '~/utils/formatActivity';
const locale = 'pt-BR';
moment.locale(locale);
const DetailTeam = ({ teamChoosed, programChoosed, width, listMode, canEdit, refetchSchedule, schedules, context, scheduleChoosed, handleModeView, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const [visible, setVisible] = React.useState(false);
    const [visibleTooltip, setVisibleTooltip] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [popup, setPopup] = React.useState({ open: false });
    const [editDrawer, setEditDrawer] = React.useState({
        open: false,
        item: null,
    });
    const [view, setView] = React.useState('week');
    const [schedulerData, setSchedulerData] = React.useState([]);
    const [modules, setModules] = React.useState([]);
    const [cellDuration, setCellDuration] = React.useState(60);
    const [currentDate, setCurrentDate] = React.useState('2006-01-01T00:00:00');
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    const [{ activities, changeActivityDate, desactiveActivity, refetch }] = useActivity({
        typeApplication: EActivityTypeApplication.MODELO,
        active: 'Ativo',
        teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        refetchSchedule();
    }, [teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]]);
    React.useEffect(() => {
        if (schedules === null || schedules === void 0 ? void 0 : schedules.length) {
            setModules(schedules
                .filter((sched) => !!(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}Modulo`]))
                .map((sched) => {
                var _a;
                return ({
                    id: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}cronogramadediaid`],
                    title: (_a = sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}Modulo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                    start: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`],
                    end: moment
                        .utc(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`])
                        .add(30, 'minutes')
                        .format(),
                    startDate: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`],
                    endDate: moment
                        .utc(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`])
                        .add(30, 'minutes')
                        .format(),
                    allDay: true,
                    module: 'Módulo',
                });
            }));
        }
    }, [schedules]);
    React.useEffect(() => {
        if (activities === null || activities === void 0 ? void 0 : activities.length) {
            setSchedulerData(activities.map((activity) => (Object.assign(Object.assign({}, activity), { id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`], start: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('YYYY-MM-DD HH:mm:ss'), end: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]).format('YYYY-MM-DD HH:mm:ss'), startDate: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`], endDate: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`] }))));
        }
    }, [activities]);
    const allMessages = {
        [locale]: {
            confirmDeleteMessage: 'Você tem certeza que deseja excluir o apontamento?',
            deleteButton: 'Excluir',
            saveButton: 'Salvar',
            commitCommand: 'Salvar',
            cancelButton: 'Cancelar',
            discardButton: 'Descartar',
            detailsLabel: 'Nome',
            today: 'Hoje',
            allDay: 'Módulo',
        },
    };
    const handleDeleteAppointment = (activityId) => {
        setVisibleTooltip(false);
        let newSchedulerData = [...schedulerData];
        const itemDeleted = newSchedulerData.find((appointment) => appointment.id === activityId);
        newSchedulerData = newSchedulerData.filter((appointment) => appointment.id !== activityId);
        dispatch(deleteActivity({ id: itemDeleted === null || itemDeleted === void 0 ? void 0 : itemDeleted[`${PREFIX}atividadeid`], item: itemDeleted }, { onSuccess: () => null, onError: () => null }));
        setSchedulerData(newSchedulerData);
    };
    const handleClose = () => {
        refetch();
        setVisible(false);
    };
    const handleSuccess = (actv) => {
        refetch();
        setEditDrawer(Object.assign(Object.assign({}, editDrawer), { item: actv }));
        notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
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
    const handleOpenEditDrawer = (activity) => {
        handleClosePopup();
        setEditDrawer({ open: true, item: activity });
    };
    const handleCloseEditDrawer = () => {
        setEditDrawer({ open: false, item: null });
    };
    const onItemChange = ({ event, oldEvent }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
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
        if (start.format('YYYY-MM-DD') !==
            moment(activityUpdated.start).format('YYYY-MM-DD')) {
            const previousSchedule = (_a = activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0];
            const newSchedule = schedules.find((s) => moment
                .utc(s === null || s === void 0 ? void 0 : s[`${PREFIX}data`])
                .startOf('day')
                .isSame(moment(start.startOf('day'))));
            if (!newSchedule) {
                confirmation.openConfirmation({
                    title: 'Cronograma não encontrado',
                    description: `O dia ${start.format('DD/MM/YYYY')} não está cadastrado, deseja realizar a criação?`,
                    onConfirm: () => setVisible(true),
                });
                setLoading(false);
                return;
            }
            changeActivityDate(Object.assign(Object.assign({}, activityUpdated), { id: activityUpdated.id, [`${PREFIX}atividadeid`]: activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}atividadeid`], startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, duration: getDurationMoment(start, end) }), previousSchedule === null || previousSchedule === void 0 ? void 0 : previousSchedule[`${PREFIX}cronogramadediaid`], newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule[`${PREFIX}cronogramadediaid`], {
                onSuccess: handleSuccess,
                onError: handleError,
            });
            return;
        }
        const item = Object.assign(Object.assign({}, activityUpdated), { id: activityUpdated.id, [`${PREFIX}atividadeid`]: activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}atividadeid`], teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_c = (_b = activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}CronogramadeDia_Atividade`]) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}cronogramadediaid`], startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, duration: getDurationMoment(start, end), [`${PREFIX}datahorainicio`]: start.format(), [`${PREFIX}datahorafim`]: end.format(), spaces: ((_d = activityUpdated[`${PREFIX}Atividade_Espaco`]) === null || _d === void 0 ? void 0 : _d.length)
                ? (_e = activityUpdated[`${PREFIX}Atividade_Espaco`]) === null || _e === void 0 ? void 0 : _e.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                : [], people: ((_f = activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.length)
                ? (_g = activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _g === void 0 ? void 0 : _g.map((e) => ({
                    id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                    person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                    function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                }))
                : [] });
        const activitiesFromDay = (_j = (_h = schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'))) === null || _h === void 0 ? void 0 : _h.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _j === void 0 ? void 0 : _j.sort((a, b) => a.startTime.unix() - b.startTime.unix());
        const actvIndex = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.findIndex((e) => (e === null || e === void 0 ? void 0 : e.id) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`]));
        let nextActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.slice(actvIndex + 1, activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.length);
        const lastDateTime = moment(moment(item.endDate).format('YYYY-MM-DD HH:mm:ss'));
        let nextChanges = (_k = reorderTimeActivities(lastDateTime, nextActivities)) === null || _k === void 0 ? void 0 : _k.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivity(actv, {
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        }))));
        const scheduleEdit = (_l = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _l === void 0 ? void 0 : _l[0];
        const activitiesToEdit = [
            Object.assign(Object.assign({}, item), { [`${PREFIX}inicio`]: item.startTime.format('HH:mm'), [`${PREFIX}fim`]: item.endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: moment
                    .utc(item.startDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: moment
                    .utc(item.endDate)
                    .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'), endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_o = (_m = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o[`${PREFIX}cronogramadediaid`] }),
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
    };
    const handleOption = (event, item) => {
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteSchedule = () => {
        handleCloseAnchor();
        const activitiesToDelete = activities.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment.utc(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}data`]).format('DD/MM/YYYY'));
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir o dia ${moment
                .utc(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}data`])
                .format('DD/MM')}?`,
            onConfirm: () => {
                dispatch(deleteSchedule(itemSelected[`${PREFIX}cronogramadediaid`], activitiesToDelete, {
                    onSuccess: refetchSchedule,
                    onError: () => null,
                }));
            },
        });
    };
    const renderDay = (args) => {
        const date = args.date;
        const sched = schedules === null || schedules === void 0 ? void 0 : schedules.find((sc) => moment
            .utc(sc === null || sc === void 0 ? void 0 : sc[`${PREFIX}data`])
            .startOf('day')
            .isSame(moment(date).startOf('day')));
        return (React.createElement(BoxDay, { hasInfo: !!sched },
            React.createElement(Box
            // width='88vh'
            , { 
                // width='88vh'
                paddingLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
                React.createElement("div", null, formatDate('DDD', date)),
                React.createElement("div", null, formatDate('DD', date))),
            !!sched ? (React.createElement(Box, { style: { cursor: 'pointer' }, onClick: (event) => handleOption(event, sched) },
                React.createElement(MoreVert, null))) : null));
    };
    const onEventClick = React.useCallback((args) => {
        const event = args.event;
        setPopup({ open: true, item: event, anchor: args.domEvent.target });
    }, []);
    const handleClosePopup = () => {
        setPopup({ open: false, item: null });
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleDetail = () => {
        setVisible(true);
        handleCloseAnchor();
    };
    const currentView = React.useMemo(() => {
        let calView;
        if (listMode) {
            return {
                schedule: {
                    type: 'day',
                    timeCellStep: cellDuration,
                    timeLabelStep: 60,
                },
            };
        }
        switch (view) {
            case 'year':
                calView = {
                    calendar: { type: 'year' },
                };
                break;
            case 'month':
                calView = {
                    calendar: { labels: true },
                };
                break;
            case 'week':
                calView = {
                    schedule: {
                        type: 'week',
                        firstWeekDay: 0,
                        timeCellStep: cellDuration,
                        timeLabelStep: 60,
                    },
                };
                break;
            case 'day':
                calView = {
                    schedule: {
                        type: 'day',
                        timeCellStep: cellDuration,
                        timeLabelStep: 60,
                    },
                };
                break;
            case 'agenda':
                calView = {
                    calendar: { type: 'week' },
                    agenda: { type: 'week' },
                };
                break;
        }
        return calView;
    }, [cellDuration, view, listMode]);
    const customWithNavButtons = () => {
        if (listMode) {
            return (React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'center' }, "Atividades"));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(Box, { flex: '1 0 0' },
                React.createElement(SegmentedGroup, { value: view, onChange: (event) => setView(event.target.value) },
                    React.createElement(SegmentedItem, { value: 'year' }, "Ano"),
                    React.createElement(SegmentedItem, { value: 'month' }, "M\u00EAs"),
                    React.createElement(SegmentedItem, { value: 'week' }, "Semana"),
                    React.createElement(SegmentedItem, { value: 'day' }, "Dia"),
                    React.createElement(SegmentedItem, { value: 'agenda' }, "Agenda"))),
            React.createElement(CalendarPrev, { className: 'cal-header-prev' }),
            React.createElement(CalendarToday, { className: 'cal-header-today' }),
            React.createElement(CalendarNext, { className: 'cal-header-next' })));
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
        React.createElement(ScheduleDayForm, { isModel: true, titleRequired: false, visible: visible, schedule: itemSelected, context: context, team: teamChoosed, program: programChoosed, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], handleClose: handleClose }),
        React.createElement(EditActivityForm, { isModel: true, team: teamChoosed, program: programChoosed, onSave: handleEdit, open: editDrawer.open, activity: editDrawer.item, onClose: handleCloseEditDrawer, setActivity: handleOpenEditDrawer }),
        React.createElement(Box, { display: 'flex', marginBottom: '1rem', alignItems: 'center', width: width ? `${width}px` : '100%', style: { gap: '1rem' } },
            React.createElement(Title, null, teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}nome`]),
            React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !canEdit, startIcon: React.createElement(IoCalendarNumberSharp, null), onClick: () => setVisible(true) }, "Criar dia de aula")),
        React.createElement(Box, { display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' },
            React.createElement(IconButton, { onClick: handleModeView }, listMode ? React.createElement(CalendarTodayRounded, null) : React.createElement(List, null)),
            React.createElement(TextField, { select: true, fullWidth: true, style: { maxWidth: '10rem' }, value: cellDuration, label: 'Dura\u00E7\u00E3o do Intervalo', onChange: (event) => setCellDuration(+event.target.value) },
                React.createElement(MenuItem, { value: 15 }, "15 Minutos"),
                React.createElement(MenuItem, { value: 30 }, "30 Minutos"),
                React.createElement(MenuItem, { value: 60 }, "60 Minutos"))),
        React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
            React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
            React.createElement(MenuItem, { onClick: handleDeleteSchedule }, "Excluir")),
        React.createElement(Eventcalendar, { dragToMove: canEdit, dragToResize: canEdit, allDayText: 'M\u00F3dulo', width: '100%', height: '65vh', locale: localePtBR, min: '2006-01-01T00:00:00', firstDay: 0, data: [...(schedulerData || []), ...(modules || [])], view: currentView, selectedDate: (scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}data`]) || currentDate, 
            // @ts-ignore
            onSelectedDateChange: (e) => setCurrentDate(e.date.toISOString()), renderHeader: customWithNavButtons, renderDay: view === 'week' && renderDay, cssClass: listMode && styles.calendar, onEventUpdate: onItemChange, onEventClick: onEventClick }),
        React.createElement(Popup, { showArrow: true, showOverlay: true, display: 'anchored', anchor: popup.anchor, fullScreen: true, scrollLock: false, contentPadding: false, isOpen: popup.open, onClose: handleClosePopup, responsive: responsivePopup, cssClass: styles.popup },
            React.createElement(Box, { width: '100%', padding: '1rem' },
                React.createElement(Typography, { variant: 'h5', align: 'center' }, (_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.title)),
            React.createElement(Divider, null),
            React.createElement(Box, { padding: '1rem' },
                !((_b = popup === null || popup === void 0 ? void 0 : popup.item) === null || _b === void 0 ? void 0 : _b.allDay) ? (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { container: true },
                        React.createElement(Grid, { item: true, xs: 1 },
                            React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                                React.createElement(AccessTime, null))),
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' },
                                moment((_c = popup === null || popup === void 0 ? void 0 : popup.item) === null || _c === void 0 ? void 0 : _c.start).format('HH:mm'),
                                " -",
                                ' ',
                                moment((_d = popup === null || popup === void 0 ? void 0 : popup.item) === null || _d === void 0 ? void 0 : _d.end).format('HH:mm')))),
                    React.createElement(TitleResource, null, "Recursos"))) : null,
                React.createElement(Grid, { container: true, style: { maxHeight: '15rem', overflow: 'auto' } }, (_f = (_e = popup === null || popup === void 0 ? void 0 : popup.item) === null || _e === void 0 ? void 0 : _e[`${PREFIX}recursos_Atividade`]) === null || _f === void 0 ? void 0 : _f.map((item) => {
                    var _a, _b, _c;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' }, ((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                                ((_b = item === null || item === void 0 ? void 0 : item.space) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                                ((_c = item === null || item === void 0 ? void 0 : item.finiteInfiniteResources) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`])))));
                }))),
            !((_g = popup === null || popup === void 0 ? void 0 : popup.item) === null || _g === void 0 ? void 0 : _g.allDay) ? (React.createElement(Box, { display: 'flex', padding: '1rem', style: { gap: '10px' } },
                React.createElement(Button, { fullWidth: true, onClick: () => handleOpenEditDrawer(popup === null || popup === void 0 ? void 0 : popup.item), startIcon: React.createElement(Edit, null), variant: 'contained', color: 'primary' }, "Editar"),
                React.createElement(Button, { fullWidth: true, disabled: !canEdit, onClick: () => {
                        handleClosePopup();
                        confirmation.openConfirmation({
                            title: 'Excluir Apontamento',
                            description: 'Você tem certeza que deseja excluir o apontamento?',
                            onConfirm: () => { var _a; return handleDeleteAppointment((_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.id); },
                        });
                    }, startIcon: React.createElement(Delete, null), variant: 'contained', color: 'secondary' }, "Excluir"))) : null)));
};
export default DetailTeam;
//# sourceMappingURL=index.js.map