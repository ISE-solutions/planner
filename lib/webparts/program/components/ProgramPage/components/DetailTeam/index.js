var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import * as moment from 'moment';
import { BackdropStyled, BoxDay, SectionList, SectionNamePopup, TitleResource, } from './styles';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography, } from '@material-ui/core';
import { v4 } from 'uuid';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { AccessTime, ArrowBackIos, ArrowForwardIos, CalendarTodayRounded, CheckCircle, Delete, Edit, Error, FormatListBulleted, List, MoreVert, Save, } from '@material-ui/icons';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import EditActivityForm from '~/components/EditActivityForm';
import { ACTIVITY, PREFIX, PROGRAM, TAG, TEAM } from '~/config/database';
import { useConfirmation, useNotification, useTask } from '~/hooks';
import { EActivityTypeApplication, EFatherTag, EGroups } from '~/config/enums';
import getDurationMoment from '~/utils/getDurationMoment';
import { CalendarNav, CalendarNext, CalendarPrev, CalendarToday, Eventcalendar, formatDate, localePtBR, Popup, SegmentedGroup, SegmentedItem, setOptions, } from '@mobiscroll/react';
import styles from './DetailTeam.module.scss';
import checkConflictDate from '~/utils/checkConflictDate';
import * as _ from 'lodash';
import { Title } from '~/components/CustomCard';
import temperatureColor from '~/utils/temperatureColor';
import ListDays from './ListDays';
import CalendarDrawer from './CalendarDrawer';
import formatActivityModel from '~/utils/formatActivityModel';
import { useDispatch, useSelector } from 'react-redux';
import { batchUpdateActivity, batchUpdateActivityAll, changeActivityDate, deleteActivity, fetchAllActivities, getActivity, updateActivityAll, } from '~/store/modules/activity/actions';
import AddActivity from './AddActivity';
import { addUpdateSchedule, deleteSchedule, } from '~/store/modules/schedule/actions';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import formatActivity from '~/utils/formatActivity';
import CloneSchedule from './CloneSchedule';
import { deleteByActivity, deleteBySchedule, } from '~/store/modules/resource/actions';
import momentToMinutes from '~/utils/momentToMinutes';
const locale = 'pt-BR';
moment.locale(locale);
setOptions({
    locale: localePtBR,
    theme: 'ios',
    themeVariant: 'light',
});
const DetailTeam = ({ teamChoosed, programChoosed, currentUser, isProgramResponsible, isProgramDirector, isHeadOfService, width, listMode, refetchTeam, refetchSchedule, refetchResource, refetchProgram, schedules, resources, context, activityChoosed, handleModeView, programTemperature, teamTemperature, setActivityChoosed, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    const [visible, setVisible] = React.useState(false);
    const [anchorScheduleEl, setAnchorScheduleEl] = React.useState(null);
    const [anchorMoreOptionEl, setAnchorMoreOptionEl] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [openCloneSchedule, setOpenCloneSchedule] = React.useState(false);
    const [undoNextActivities, setUndoNextActivities] = React.useState();
    const [addActivity, setAddActivity] = React.useState({
        open: false,
        date: null,
        schedule: null,
    });
    const [loadingSaveActivityModel, setLoadingSaveActivityModel] = React.useState(false);
    const [currentDate, setCurrentDate] = React.useState();
    const [schedulerData, setSchedulerData] = React.useState([]);
    const [modules, setModules] = React.useState([]);
    const [cellDuration, setCellDuration] = React.useState(60);
    const [popup, setPopup] = React.useState({ open: false });
    const [popupHover, setPopupHover] = React.useState({ open: false });
    const [scheduleChoosed, setScheduleChoosed] = React.useState(null);
    const [calendarDrawer, setCalendarDrawer] = React.useState({
        open: false,
    });
    const [view, setView] = React.useState('week');
    const [activitiesModelChoosed, setActivitiesModelChoosed] = React.useState([]);
    const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
    const [modelName, setModelName] = React.useState({
        open: false,
        loadSpaces: true,
        loadPerson: true,
        name: '',
        error: '',
    });
    const [activityModelName, setActivityModelName] = React.useState({
        open: false,
        loadSpaces: true,
        loadPerson: true,
        name: '',
        error: '',
    });
    const dispatch = useDispatch();
    const timerRef = React.useRef(null);
    const { tag, space, person, activity, finiteInfiniteResource } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    const { activities, loading: loadingActivity } = activity;
    const { dictFiniteInfiniteResources } = finiteInfiniteResource;
    const { confirmation } = useConfirmation();
    const { notification } = useNotification();
    const [{ bulkAddTaks }] = useTask({}, { manual: false });
    const checkConflict = (activity, resource) => {
        let resourcesConflicted = [];
        const datesAppointment = [
            moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]),
            moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]),
        ];
        resourcesConflicted = resources === null || resources === void 0 ? void 0 : resources.filter((res) => {
            const datesResource = [
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]),
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]),
            ];
            return (checkConflictDate(datesAppointment, datesResource) &&
                (res === null || res === void 0 ? void 0 : res[`_${PREFIX}atividade_value`]) !==
                    (resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}atividade_value`]) &&
                (((resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}espaco_value`]) &&
                    (resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}espaco_value`]) ===
                        (res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`])) ||
                    ((resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}pessoa_value`]) &&
                        (resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}pessoa_value`]) ===
                            (res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]))));
        });
        return resourcesConflicted;
    };
    React.useEffect(() => {
        if (teamChoosed) {
            refetch();
        }
    }, [teamChoosed]);
    React.useEffect(() => {
        var _a;
        setModules((_a = schedules === null || schedules === void 0 ? void 0 : schedules.filter((sched) => !!(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}Modulo`]))) === null || _a === void 0 ? void 0 : _a.map((sched) => {
            var _a;
            return ({
                id: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}cronogramadediaid`],
                title: (_a = sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}Modulo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                start: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`],
                end: moment.utc(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`]).add(30, 'minutes').format(),
                startDate: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`],
                endDate: moment
                    .utc(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`])
                    .add(30, 'minutes')
                    .format(),
                allDay: true,
                color: '#9e9e9e',
                editable: false,
            });
        }));
    }, [schedules]);
    React.useEffect(() => {
        var _a;
        if (!listMode) {
            setCurrentDate((_a = schedules === null || schedules === void 0 ? void 0 : schedules[0]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}data`]);
        }
    }, [listMode]);
    React.useEffect(() => {
        if (Object.keys(dictTag).length) {
            adapterSchedulerData();
        }
    }, [activities, dictTag, resources]);
    const refetch = () => {
        // refetchResource?.()
        dispatch(fetchAllActivities({
            typeApplication: EActivityTypeApplication.APLICACAO,
            active: 'Ativo',
            teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`],
        }));
    };
    const myGroup = () => {
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) {
            return EGroups.PLANEJAMENTO;
        }
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAdmission) {
            return EGroups.ADMISSOES;
        }
        return '';
    };
    const adapterSchedulerData = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const arrScheduler = [];
        try {
            for (let j = 0; j < (activities === null || activities === void 0 ? void 0 : activities.length); j++) {
                const activity = activities[j];
                let hasConflict = false;
                const resourcesActivity = [];
                const resourcesToAnalizy = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]));
                for (let i = 0; i < resourcesToAnalizy.length; i++) {
                    const res = (_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}recursos_Atividade`]) === null || _b === void 0 ? void 0 : _b[i];
                    const resourceConflict = checkConflict(activity, res);
                    const visibleConflicts = [];
                    for (let k = 0; k < (resourceConflict === null || resourceConflict === void 0 ? void 0 : resourceConflict.length); k++) {
                        const resConflict = resourceConflict[k];
                        const temp = ((_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Atividade`]) === null || _c === void 0 ? void 0 : _c[`_${PREFIX}temperatura_value`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) ||
                            ((_f = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_e = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}CronogramaDia`]) === null || _e === void 0 ? void 0 : _e[`_${PREFIX}temperatura_value`]]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`]) ||
                            ((_h = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_g = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Turma`]) === null || _g === void 0 ? void 0 : _g[`_${PREFIX}temperatura_value`]]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`]) ||
                            ((_k = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_j = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Programa`]) === null || _j === void 0 ? void 0 : _j[`_${PREFIX}temperatura_value`]]) === null || _k === void 0 ? void 0 : _k[`${PREFIX}nome`]);
                        let approved = false;
                        if ((resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Espaco`]) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}espaco_aprovador_por_value`])) {
                            approved = true;
                        }
                        if (resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Pessoa`]) {
                            const envolvedPerson = (_l = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _l === void 0 ? void 0 : _l.find((e) => {
                                var _a;
                                return (e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]) ===
                                    ((_a = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Pessoa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]);
                            });
                            const func = dictTag[envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson[`_${PREFIX}funcao_value`]];
                            const needApprove = (_m = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _m === void 0 ? void 0 : _m.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                            approved = needApprove
                                ? !!(envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson[`_${PREFIX}aprovadopor_value`])
                                : false;
                        }
                        if ((!temp || temp !== EFatherTag.RASCUNHO) && !approved) {
                            visibleConflicts.push(resConflict);
                        }
                    }
                    if (visibleConflicts.length) {
                        hasConflict = true;
                        resourcesActivity.push(Object.assign(Object.assign({}, res), { hasConflict, space: dictSpace[res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]], person: dictPeople[res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]], finiteInfiniteResources: dictFiniteInfiniteResources[res === null || res === void 0 ? void 0 : res[`_${PREFIX}recurso_recursofinitoeinfinito_value`]], conflicts: visibleConflicts }));
                    }
                    else {
                        resourcesActivity.push(Object.assign(Object.assign({}, res), { space: dictSpace[res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]], person: dictPeople[res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]], finiteInfiniteResources: dictFiniteInfiniteResources[res === null || res === void 0 ? void 0 : res[`_${PREFIX}recurso_recursofinitoeinfinito_value`]] }));
                    }
                }
                activity[`${PREFIX}recursos_Atividade`] = resourcesActivity;
                arrScheduler.push(Object.assign(Object.assign({}, activity), { hasConflict, color: hasConflict
                        ? '#a71111'
                        : temperatureColor(activity, 
                        // scheduleChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
                        ((_o = teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}Temperatura`]) === null || _o === void 0 ? void 0 : _o[`${PREFIX}nome`]) ||
                            ((_p = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Temperatura`]) === null || _p === void 0 ? void 0 : _p[`${PREFIX}nome`])).background, id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], title: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}nome`], start: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('YYYY-MM-DD HH:mm:ss'), end: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]).format('YYYY-MM-DD HH:mm:ss'), startDate: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`], endDate: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`] }));
            }
        }
        catch (error) {
            console.error(error);
        }
        setSchedulerData(arrScheduler);
    };
    const handleDeleteAppointment = (activityId) => {
        let newSchedulerData = [...schedulerData];
        const itemDeleted = newSchedulerData.find((appointment) => appointment.id === activityId);
        newSchedulerData = newSchedulerData.filter((appointment) => appointment.id !== activityId);
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir a Atividade ${itemDeleted === null || itemDeleted === void 0 ? void 0 : itemDeleted[`${PREFIX}nome`]}?`,
            onConfirm: () => {
                var _a, _b, _c;
                dispatch(deleteActivity({ id: itemDeleted[`${PREFIX}atividadeid`], activity: itemDeleted }, {
                    onSuccess: () => null,
                    onError: () => null,
                }));
                const activitiesFromDay = (_b = (_a = schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
                    moment(itemDeleted === null || itemDeleted === void 0 ? void 0 : itemDeleted[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') && (actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`]) !== activityId)) === null || _a === void 0 ? void 0 : _a.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.startTime.unix() - b.startTime.unix());
                let lastTime = (_c = activitiesFromDay[0]) === null || _c === void 0 ? void 0 : _c.startTime;
                const newActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.map((actv) => {
                    const duration = momentToMinutes(actv.duration);
                    const endTime = lastTime.clone().add(duration, 'm');
                    const startDate = moment(`${moment(actv === null || actv === void 0 ? void 0 : actv.startDate).format('YYYY-MM-DD')} ${lastTime.format('HH:mm')}`);
                    const momentDuration = moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}duracao`], 'HH:mm');
                    const minutes = momentToMinutes(momentDuration);
                    const result = {
                        id: actv.id,
                        data: {
                            [`${PREFIX}inicio`]: lastTime.format('HH:mm'),
                            [`${PREFIX}fim`]: endTime.format('HH:mm'),
                            [`${PREFIX}datahorainicio`]: startDate.format(),
                            [`${PREFIX}datahorafim`]: startDate
                                .clone()
                                .add(minutes, 'minutes')
                                .format(),
                        },
                    };
                    lastTime = endTime;
                    return result;
                });
                setSchedulerData(newSchedulerData);
                dispatch(deleteByActivity(itemDeleted[`${PREFIX}atividadeid`]));
                batchUpdateActivity(newActivities, {
                    onSuccess: () => {
                        refetch();
                    },
                    onError: () => { },
                });
            },
        });
    };
    const handleClose = () => {
        refetch();
        refetchSchedule();
        refetchResource();
        refetchTeam();
        setVisible(false);
        setScheduleChoosed(null);
    };
    const handleSuccess = (actv) => {
        refetch();
        refetchResource === null || refetchResource === void 0 ? void 0 : refetchResource();
        setActivityChoosed(Object.assign(Object.assign({}, activityChoosed), { item: actv }));
        setLoading(false);
        notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b, _c;
        setLoading(false);
        getActivity((_a = activityChoosed === null || activityChoosed === void 0 ? void 0 : activityChoosed.item) === null || _a === void 0 ? void 0 : _a[`${PREFIX}atividadeid`]).then(({ value }) => {
            setActivityChoosed(Object.assign(Object.assign({}, activityChoosed), { item: value === null || value === void 0 ? void 0 : value[0] }));
            setLoading(false);
        });
        notification.error({
            title: 'Falha',
            description: (_c = (_b = error === null || error === void 0 ? void 0 : error.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message,
        });
    };
    const handleEdit = (item, onSuccess) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            const activitiesFromDay = (_b = (_a = schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
                moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'))) === null || _a === void 0 ? void 0 : _a.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _b === void 0 ? void 0 : _b.sort((a, b) => a.startTime.unix() - b.startTime.unix());
            setLoading(true);
            const spacesToDelete = (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.filter((e) => { var _a; return !((_a = item.spaces) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}espacoid`])); });
            const finiteInfiniteResourceToDelete = (_d = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _d === void 0 ? void 0 : _d.filter((e) => {
                var _a, _b;
                return !((_a = item === null || item === void 0 ? void 0 : item.finiteResource) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                    e[`${PREFIX}recursofinitoinfinitoid`])) &&
                    !((_b = item === null || item === void 0 ? void 0 : item.infiniteResource) === null || _b === void 0 ? void 0 : _b.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}recursofinitoinfinitoid`]) ===
                        e[`${PREFIX}recursofinitoinfinitoid`]));
            });
            const equipmentsToDelete = (_e = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Equipamentos`]) === null || _e === void 0 ? void 0 : _e.filter((e) => { var _a; return !((_a = item === null || item === void 0 ? void 0 : item.equipments) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])); });
            const actvIndex = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.findIndex((e) => (e === null || e === void 0 ? void 0 : e.id) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`]));
            let nextActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.slice(actvIndex + 1, activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.length);
            setUndoNextActivities(nextActivities);
            const lastDateTime = moment(item.endDate);
            let nextChanges = (_f = reorderTimeActivities(lastDateTime, nextActivities)) === null || _f === void 0 ? void 0 : _f.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted, changed: item.timeChanged }, formatActivity(actv, {
                dictPeople: dictPeople,
                dictSpace: dictSpace,
                dictTag: dictTag,
            }))));
            const scheduleEdit = (_g = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _g === void 0 ? void 0 : _g[0];
            const activitiesToEdit = [
                Object.assign(Object.assign({}, item), { changed: item.timeChanged || item.fieldChanged, [`${PREFIX}inicio`]: item.startTime.format('HH:mm'), [`${PREFIX}fim`]: item.endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: moment
                        .utc(item.startDate)
                        .format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: moment
                        .utc(item.endDate)
                        .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment(item.startDate).format(), endDate: moment(item.endDate).format(), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_j = (_h = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j[`${PREFIX}cronogramadediaid`], 
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
        }
        catch (err) {
            console.error(err);
        }
    };
    const handleOptionSchedule = (event, item) => {
        var _a, _b, _c;
        setScheduleChoosed(item);
        setActivitiesModelChoosed((_c = (_b = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((act) => act === null || act === void 0 ? void 0 : act[`${PREFIX}ativo`])) === null || _b === void 0 ? void 0 : _b.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a[`${PREFIX}inicio`], 'HH:mm').unix() -
            moment(b === null || b === void 0 ? void 0 : b[`${PREFIX}inicio`], 'HH:mm').unix())) === null || _c === void 0 ? void 0 : _c.map((actv) => ({
            id: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`],
            name: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}nome`],
            start: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}inicio`],
            checked: true,
        })));
        setAnchorScheduleEl(event.currentTarget);
    };
    const handleOpenEditDrawer = (activity) => {
        handleClosePopup();
        setActivityChoosed({ open: true, item: activity });
    };
    const handleCloseEditDrawer = () => {
        setActivityChoosed({ open: false, item: null });
    };
    const hasOverlap = React.useCallback((args, inst) => {
        const ev = args.event;
        const events = inst
            .getEvents(ev.start, ev.end)
            .filter((e) => e.id !== ev.id);
        return events.length > 0;
    }, []);
    const onItemChange = (args, inst) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const { event, oldEvent } = args;
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
        const startString = start.clone().format('YYYY-MM-DD');
        if (startString !== moment(activityUpdated.start).format('YYYY-MM-DD')) {
            const previousSchedule = (_a = activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0];
            const newSchedule = schedules.find((s) => moment.utc(s === null || s === void 0 ? void 0 : s[`${PREFIX}data`]).format('YYYY-MM-DD') === startString);
            if (!newSchedule) {
                confirmation.openConfirmation({
                    title: 'Dia de aula não encontrado',
                    description: `O dia ${start.format('DD/MM/YYYY')} não está cadastrado, deseja realizar a criação?`,
                    onConfirm: () => setVisible(true),
                });
                setLoading(false);
                adapterSchedulerData();
                return;
            }
            dispatch(changeActivityDate(Object.assign(Object.assign({}, activityUpdated), { id: activityUpdated.id, [`${PREFIX}atividadeid`]: activityUpdated === null || activityUpdated === void 0 ? void 0 : activityUpdated[`${PREFIX}atividadeid`], startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, [`${PREFIX}datahorainicio`]: start.format(), [`${PREFIX}datahorafim`]: end.format(), duration: getDurationMoment(start, end) }), previousSchedule === null || previousSchedule === void 0 ? void 0 : previousSchedule[`${PREFIX}cronogramadediaid`], newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule[`${PREFIX}cronogramadediaid`], {
                onSuccess: handleSuccess,
                onError: handleError,
            }));
            adapterSchedulerData();
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
        const lastDateTime = moment(item.endDate);
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
                    .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment(item.startDate).format(), endDate: moment(item.endDate).format(), teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], scheduleId: (_o = (_m = item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`]) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o[`${PREFIX}cronogramadediaid`] }),
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
    const renderDay = (args) => {
        const date = args.date;
        const sched = schedules === null || schedules === void 0 ? void 0 : schedules.find((sc) => moment.utc(sc === null || sc === void 0 ? void 0 : sc[`${PREFIX}data`]).format('YYYY-MM-DD') ===
            moment(date).format('YYYY-MM-DD'));
        return (React.createElement(BoxDay, { hasInfo: !!sched },
            React.createElement(Box
            // width='88vh'
            , { 
                // width='88vh'
                paddingLeft: '10%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
                React.createElement("div", null, formatDate('DDD', date)),
                React.createElement("div", null, formatDate('DD', date))),
            !!sched ? (React.createElement(Box, { style: { cursor: 'pointer' }, onClick: (event) => handleOptionSchedule(event, sched) },
                React.createElement(MoreVert, null))) : null));
    };
    const onEventClick = React.useCallback((args) => {
        const event = args.event;
        setPopup({ open: true, item: event, anchor: args.domEvent.target });
    }, []);
    const onEventHoverIn = React.useCallback((args) => {
        const event = args.event;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setPopupHover({ open: true, anchor: args.domEvent.target, event });
    }, []);
    const onEventHoverOut = React.useCallback(() => {
        timerRef.current = setTimeout(() => {
            setPopupHover({ open: false });
        }, 200);
    }, []);
    const onMouseEnter = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);
    const onMouseLeave = React.useCallback(() => {
        timerRef.current = setTimeout(() => {
            setPopupHover({ open: false });
        }, 200);
    }, []);
    const handleClosePopup = () => {
        setPopup({ open: false, item: null });
    };
    const handleCloseScheduleAnchor = () => {
        setAnchorScheduleEl(null);
        handleCloseCalendar();
    };
    const handleDetail = () => {
        setVisible(true);
        setAnchorScheduleEl(null);
    };
    const throwToApprove = (activity) => {
        var _a;
        const tasksToSave = [];
        const planningTag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO);
        if (!(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Espaco_Aprovador_Por`]) &&
            ((_a = activity[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.length)) {
            tasksToSave.push({
                [`${PREFIX}Atividade@odata.bind`]: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) &&
                    `/${ACTIVITY}(${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]})`,
                [`${PREFIX}Programa@odata.bind`]: (programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`]) &&
                    `/${PROGRAM}(${programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`]})`,
                [`${PREFIX}Turma@odata.bind`]: (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]) &&
                    `/${TEAM}(${teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]})`,
                [`${PREFIX}itemaaprovar`]: 'Espaço',
                [`${PREFIX}NotificacaoGrupo@odata.bind`]: (planningTag === null || planningTag === void 0 ? void 0 : planningTag[`${PREFIX}etiquetaid`]) &&
                    `/${TAG}(${planningTag === null || planningTag === void 0 ? void 0 : planningTag[`${PREFIX}etiquetaid`]})`,
            });
        }
        bulkAddTaks(tasksToSave, {
            onSuccess: () => notification.success({
                title: 'Sucesso',
                description: 'Lançado para aprovação',
            }),
            onError: () => notification.error({
                title: 'Falha',
                description: '',
            }),
        });
    };
    const handleOpenCalendar = () => {
        handleCloseScheduleAnchor();
        setCalendarDrawer({ open: true, schedule: scheduleChoosed });
    };
    const handleCloneSchedule = () => {
        setOpenCloneSchedule(true);
        setAnchorScheduleEl(null);
    };
    const handleCloseCalendar = () => {
        setCalendarDrawer({ open: false });
        setScheduleChoosed(null);
    };
    const saveAsModel = () => __awaiter(void 0, void 0, void 0, function* () {
        var _0, _1, _2, _3, _4, _5, _6, _7, _8;
        if (!modelName.name) {
            setModelName(Object.assign(Object.assign({}, modelName), { error: 'Campo Obrigatório' }));
            return;
        }
        setIsLoadingSaveModel(true);
        setModelName(Object.assign(Object.assign({}, modelName), { open: false, error: '' }));
        if (modelName.isDay) {
            dispatch(createModel({
                Tipo: TYPE_REQUEST_MODEL.CRIACAO,
                Origem: TYPE_ORIGIN_MODEL.CRONOGRAMA,
                Nome: modelName.name,
                ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
                ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
                IDOrigem: scheduleChoosed[`${PREFIX}cronogramadediaid`],
                IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
            }, {
                onSuccess: () => {
                    setIsLoadingSaveModel(false);
                    handleCloseScheduleAnchor();
                    confirmation.openConfirmation({
                        title: 'Criação de modelo',
                        yesLabel: 'Fechar',
                        showCancel: false,
                        description: 'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!',
                        onConfirm: () => null,
                    });
                },
                onError: (error) => {
                    var _a, _b;
                    setIsLoadingSaveModel(false);
                    notification.error({
                        title: 'Falha',
                        description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                    });
                },
            }));
        }
        else {
            let newModel = _.cloneDeep(scheduleChoosed);
            newModel.modeloid = newModel[`${PREFIX}cronogramadediaid`];
            newModel === null || newModel === void 0 ? true : delete newModel[`${PREFIX}cronogramadediaid`];
            newModel[`${PREFIX}modelo`] = true;
            newModel.anexossincronizados = false;
            const newActv = [];
            const dictActivityChoosed = new Map();
            activitiesModelChoosed.forEach((actv) => {
                if (actv.checked) {
                    dictActivityChoosed.set(actv.id, actv);
                }
            });
            for (let i = 0; i < (newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_Atividade`].length); i++) {
                const activity = newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_Atividade`][i];
                if (!dictActivityChoosed.has(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
                    continue;
                }
                const actvResponse = yield getActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]);
                let actv = (_0 = actvResponse === null || actvResponse === void 0 ? void 0 : actvResponse.value) === null || _0 === void 0 ? void 0 : _0[0];
                (_1 = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`]) === null || _1 === void 0 ? void 0 : _1.map((item) => {
                    delete item[`${PREFIX}nomeatividadeid`];
                    return item;
                });
                (_2 = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _2 === void 0 ? void 0 : _2.map((item) => {
                    delete item[`${PREFIX}pessoasenvolvidasatividadeid`];
                    return item;
                });
                (_3 = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Documento`]) === null || _3 === void 0 ? void 0 : _3.map((item) => {
                    delete item[`${PREFIX}documentosatividadeid`];
                    return item;
                });
                delete actv[`${PREFIX}atividadeid`];
                newActv.push(Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`] }, formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
                    isModel: true,
                    dictPeople: dictPeople,
                    dictSpace: dictSpace,
                    dictTag: dictTag,
                })));
            }
            newModel.activities = newActv;
            (_4 = newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _4 === void 0 ? void 0 : _4.map((person) => {
                let newPerson = Object.assign({}, person);
                newPerson === null || newPerson === void 0 ? true : delete newPerson[`${PREFIX}pessoasenvolvidascronogramadiaid`];
                return newPerson;
            });
            const scheduleToSave = Object.assign(Object.assign({}, newModel), { model: true, name: modelName.name, date: moment('2006-01-01', 'YYYY-MM-DD'), module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}modulo_value`]], modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}modalidade_value`]], tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}ferramenta_value`]], isGroupActive: !modelName.isDay, startTime: (newModel[`${PREFIX}inicio`] &&
                    moment(newModel[`${PREFIX}inicio`], 'HH:mm')) ||
                    null, endTime: (newModel[`${PREFIX}fim`] &&
                    moment(newModel[`${PREFIX}fim`], 'HH:mm')) ||
                    null, duration: (newModel[`${PREFIX}duracao`] &&
                    moment(newModel[`${PREFIX}duracao`], 'HH:mm')) ||
                    null, toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}ferramentabackup_value`]], link: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}link`], linkBackup: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}linkbackup`], observation: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}observacao`], anexos: [], people: ((_5 = newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _5 === void 0 ? void 0 : _5.length)
                    ? (_6 = newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _6 === void 0 ? void 0 : _6.map((e) => ({
                        keyId: v4(),
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                        person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                        function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                    }))
                    : [{ keyId: v4(), person: null, function: null }], locale: ((_7 = newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _7 === void 0 ? void 0 : _7.length)
                    ? (_8 = newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _8 === void 0 ? void 0 : _8.map((e) => ({
                        keyId: v4(),
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                        space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                        observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
                    }))
                    : [{ keyId: v4(), person: null, function: null }] });
            dispatch(addUpdateSchedule(scheduleToSave, null, null, {
                onSuccess: () => {
                    setIsLoadingSaveModel(false);
                    notification.success({
                        title: 'Sucesso',
                        description: 'Modelo salvo com sucesso',
                    });
                },
                onError: (error) => {
                    var _a, _b;
                    setIsLoadingSaveModel(false);
                    notification.error({
                        title: 'Falha',
                        description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                    });
                },
            }));
        }
    });
    const saveActivityAsModel = () => {
        var _a, _b, _c, _d, _e, _f;
        if (!activityModelName.name) {
            setActivityModelName(Object.assign(Object.assign({}, activityModelName), { error: 'Campo Obrigatório' }));
            return;
        }
        setLoadingSaveActivityModel(true);
        let actv = activityModelName === null || activityModelName === void 0 ? void 0 : activityModelName.item;
        actv[`${PREFIX}Atividade_NomeAtividade`] = (_a = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`]) === null || _a === void 0 ? void 0 : _a.map((item) => {
            delete item[`${PREFIX}nomeatividadeid`];
            return item;
        });
        if (!activityModelName.loadSpaces) {
            actv[`${PREFIX}Atividade_Espaco`] = [];
        }
        if (activityModelName.loadPerson) {
            actv[`${PREFIX}Atividade_PessoasEnvolvidas`] = (_b = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.map((item) => {
                delete item[`${PREFIX}pessoasenvolvidasatividadeid`];
                delete item.id;
                return item;
            });
        }
        else {
            actv[`${PREFIX}Atividade_PessoasEnvolvidas`] = [];
        }
        actv[`${PREFIX}Atividade_Documento`] = (_c = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Documento`]) === null || _c === void 0 ? void 0 : _c.map((item) => {
            delete item[`${PREFIX}documentosatividadeid`];
            delete item.id;
            return item;
        });
        delete actv[`${PREFIX}atividadeid`];
        let model = Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], group: myGroup() }, formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
            isModel: true,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
        }));
        model.typeApplication = EActivityTypeApplication.MODELO_REFERENCIA;
        model.title = activityModelName.name;
        model.people = (_d = model.people) === null || _d === void 0 ? void 0 : _d.map((p) => {
            delete p[`${PREFIX}pessoasenvolvidasatividadeid`];
            delete p.id;
            return p;
        });
        model.documents = (_e = model.documents) === null || _e === void 0 ? void 0 : _e.map((p) => {
            delete p[`${PREFIX}documentosatividadeid`];
            delete p.id;
            return p;
        });
        model.names = (_f = model.names) === null || _f === void 0 ? void 0 : _f.map((p) => {
            delete p[`${PREFIX}nomeatividadeid`];
            delete p.id;
            return p;
        });
        dispatch(updateActivityAll(model, {
            onSuccess: () => {
                setLoadingSaveActivityModel(false);
                handleCloseSaveActivityModel();
                notification.success({
                    title: 'Sucesso',
                    description: 'Modelo cadastrado com sucesso',
                });
            },
            onError: (error) => {
                var _a, _b;
                setLoadingSaveActivityModel(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const handleToSaveActivityModel = (item) => {
        setActivityModelName({
            loadSpaces: true,
            loadPerson: true,
            open: true,
            item,
            name: '',
            error: '',
        });
    };
    const handleCloseSaveActivityModel = () => {
        setActivityModelName({
            loadSpaces: true,
            loadPerson: true,
            open: false,
            item: null,
            name: '',
            error: '',
        });
    };
    const handleToSaveModel = () => {
        setModelName({
            loadSpaces: true,
            loadPerson: true,
            open: true,
            isDay: true,
            name: '',
            error: '',
        });
    };
    const handleToSaveGrouping = () => {
        setModelName({
            loadSpaces: true,
            loadPerson: true,
            open: true,
            isDay: false,
            name: '',
            error: '',
        });
    };
    const handleCloseSaveModel = () => {
        setModelName({
            loadSpaces: true,
            loadPerson: true,
            open: false,
            isDay: true,
            name: '',
            error: '',
        });
    };
    const handleChangeCheckbox = (index, event) => {
        const newActv = _.cloneDeep(activitiesModelChoosed);
        newActv[index].checked = event.target.checked;
        setActivitiesModelChoosed(newActv);
    };
    const handleDeleteSchedule = () => {
        handleCloseScheduleAnchor();
        const activitiesToDelete = activities.filter((actv) => moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment.utc(scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}data`]).format('DD/MM/YYYY'));
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir o dia ${moment
                .utc(scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}data`])
                .format('DD/MM/YYYY')}?`,
            onConfirm: () => {
                dispatch(deleteSchedule(scheduleChoosed[`${PREFIX}cronogramadediaid`], activitiesToDelete, {
                    onSuccess: refetchSchedule,
                    onError: () => null,
                }));
                dispatch(deleteBySchedule(scheduleChoosed[`${PREFIX}cronogramadediaid`]));
            },
        });
    };
    const customWithNavButtons = () => {
        if (listMode) {
            return (React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'center' }, "Atividades"));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(CalendarNav, { className: 'cal-header-nav' }),
            React.createElement(Box, { flex: '1 0 0' },
                React.createElement(SegmentedGroup, { value: view, onChange: (event) => setView(event.target.value) },
                    React.createElement(SegmentedItem, { value: 'year' }, "Ano"),
                    React.createElement(SegmentedItem, { value: 'month' }, "M\u00EAs"),
                    React.createElement(SegmentedItem, { value: 'week' }, "Semana"),
                    React.createElement(SegmentedItem, { value: 'day' }, "Dia"))),
            React.createElement(CalendarPrev, { className: 'cal-header-prev' }),
            React.createElement(CalendarToday, { className: 'cal-header-today' }),
            React.createElement(CalendarNext, { className: 'cal-header-next' })));
    };
    const handleAddActivity = (args, inst) => {
        const date = moment.utc(args.date.toString());
        const schedule = schedules.find((sc) => moment.utc(sc === null || sc === void 0 ? void 0 : sc[`${PREFIX}data`]).format('DD/MM/YYYY') ===
            date.format('DD/MM/YYYY'));
        if (!schedule) {
            notification.error({
                title: 'Dia não cadastrado',
                description: 'O dia não foi cadastrado, por favor verifique!',
            });
            return;
        }
        setAddActivity({ open: true, date, schedule: schedule });
    };
    const handleScrollNext = () => {
        const container = document.querySelector('#DayCalendarList');
        const widthDay = document.getElementsByClassName('LayerDay')[0].clientWidth;
        container.scrollBy({
            left: (widthDay + 30) * 2,
            behavior: 'smooth',
        });
    };
    const handleScrollPrev = () => {
        const container = document.querySelector('#DayCalendarList');
        const widthDay = document.getElementsByClassName('LayerDay')[0].clientWidth;
        container.scrollBy({
            left: -((widthDay + 30) * 2),
            behavior: 'smooth',
        });
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
        }
        return calView;
    }, [cellDuration, view, listMode]);
    const academicDirector = React.useMemo(() => {
        var _a;
        let user;
        if (teamChoosed &&
            Object.keys(dictTag).length &&
            Object.keys(dictPeople).length) {
            (_a = teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.forEach((elm) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`_${PREFIX}funcao_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO) {
                    user = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`_${PREFIX}pessoa_value`]];
                }
            });
        }
        return user;
    }, [teamChoosed, dictTag, dictPeople]);
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
        React.createElement(BackdropStyled, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(CalendarDrawer, { open: calendarDrawer.open, schedule: calendarDrawer.schedule, onClose: handleCloseCalendar, onEventHoverIn: onEventHoverIn, onEventHoverOut: onEventHoverOut, onItemChange: onItemChange, onEventClick: onEventClick }),
        React.createElement(ScheduleDayForm, { visible: visible, context: context, isDraft: (((_a = scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                teamTemperature ||
                programTemperature) === EFatherTag.RASCUNHO, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isHeadOfService: isHeadOfService, schedule: scheduleChoosed, program: programChoosed, team: teamChoosed, setSchedule: setScheduleChoosed, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], handleClose: handleClose }),
        React.createElement(CloneSchedule, { open: openCloneSchedule, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], handleClose: () => setOpenCloneSchedule(false), schedule: scheduleChoosed, refetch: refetch, refetchSchedule: refetchSchedule }),
        React.createElement(EditActivityForm, { onSave: handleEdit, isDraft: (((_c = (_b = activityChoosed === null || activityChoosed === void 0 ? void 0 : activityChoosed.item) === null || _b === void 0 ? void 0 : _b[`${PREFIX}Temperatura`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) ||
                ((_d = scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}Temperatura`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) ||
                teamTemperature ||
                programTemperature) === EFatherTag.RASCUNHO, refetch: refetch, undoNextActivities: undoNextActivities, team: teamChoosed, program: programChoosed, isProgramDirector: isProgramDirector, isProgramResponsible: isProgramResponsible, throwToApprove: throwToApprove, open: activityChoosed.open, activity: activityChoosed.item, academicDirector: academicDirector, setActivity: handleOpenEditDrawer, onClose: handleCloseEditDrawer }),
        React.createElement(AddActivity, { open: addActivity.open, schedule: addActivity.schedule, date: addActivity.date, refetchActivity: refetch, teamId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`], programId: teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`_${PREFIX}programa_value`], onClose: () => setAddActivity({ open: false, date: null, schedule: null }) }),
        React.createElement(Menu, { anchorEl: anchorScheduleEl, keepMounted: true, open: Boolean(anchorScheduleEl), onClose: () => {
                handleCloseScheduleAnchor();
                setScheduleChoosed(null);
            } },
            React.createElement(MenuItem, { onClick: handleOpenCalendar }, "Calend\u00E1rio"),
            React.createElement(MenuItem, { onClick: handleCloneSchedule }, "Clonar"),
            React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
            React.createElement(MenuItem, { onClick: () => !isLoadingSaveModel && handleToSaveModel() },
                React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                    isLoadingSaveModel && modelName.isDay ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null,
                    "Salvar como modelo de dia")),
            React.createElement(MenuItem, { onClick: () => !isLoadingSaveModel && handleToSaveGrouping() },
                React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                    isLoadingSaveModel && !modelName.isDay ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null,
                    "Salvar como modelo de agrupamento")),
            React.createElement(MenuItem, { onClick: handleDeleteSchedule }, "Excluir")),
        React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
            React.createElement(Box, { display: 'flex', marginBottom: '1rem', alignItems: 'center', width: width ? `${width}px` : '100%', style: { gap: '1rem' } },
                React.createElement(IconButton, { onClick: (e) => setAnchorMoreOptionEl(e.currentTarget) },
                    React.createElement(FormatListBulleted, null)),
                React.createElement(Title, { style: { whiteSpace: 'nowrap' } }, teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}nome`]),
                React.createElement(Menu, { anchorEl: anchorMoreOptionEl, keepMounted: true, open: Boolean(anchorMoreOptionEl), onClose: () => {
                        setAnchorMoreOptionEl(null);
                    } },
                    React.createElement(MenuItem, { onClick: () => {
                            setVisible(true);
                            setScheduleChoosed(null);
                            setAnchorMoreOptionEl(null);
                        } },
                        React.createElement(ListItemIcon, null,
                            React.createElement(IoCalendarNumberSharp, null)),
                        React.createElement(ListItemText, { primary: 'Criar dia de aula' })),
                    listMode ? (React.createElement(MenuItem, { onClick: () => {
                            handleModeView();
                            setAnchorMoreOptionEl(null);
                        } },
                        React.createElement(ListItemIcon, null,
                            React.createElement(CalendarTodayRounded, { fontSize: 'small' })),
                        React.createElement(ListItemText, { primary: 'Modo Calend\u00E1rio' }))) : (
                    // <Button
                    //   variant='contained'
                    //   color='primary'
                    //   startIcon={<CalendarTodayRounded />}
                    //   onClick={handleModeView}
                    // >
                    //   Modo Calendário
                    // </Button>
                    React.createElement(MenuItem, { onClick: () => {
                            handleModeView();
                            setAnchorMoreOptionEl(null);
                        } },
                        React.createElement(ListItemIcon, null,
                            React.createElement(List, { fontSize: 'small' })),
                        React.createElement(ListItemText, { primary: 'Modo Lista' }))
                    // <Button
                    //   variant='contained'
                    //   color='primary'
                    //   startIcon={<List />}
                    //   onClick={handleModeView}
                    // >
                    //   Modo Lista
                    // </Button>
                    )),
                loadingActivity && React.createElement(CircularProgress, { size: 20 })),
            React.createElement(Box, { minWidth: '10rem', marginBottom: '1rem' }, !listMode ? (React.createElement(TextField, { select: true, fullWidth: true, style: { maxWidth: '10rem' }, value: cellDuration, label: 'Dura\u00E7\u00E3o do Intervalo', onChange: (event) => setCellDuration(+event.target.value) },
                React.createElement(MenuItem, { value: 15 }, "15 Minutos"),
                React.createElement(MenuItem, { value: 30 }, "30 Minutos"),
                React.createElement(MenuItem, { value: 60 }, "60 Minutos"))) : (React.createElement(Box, null,
                React.createElement(IconButton, { onClick: handleScrollPrev },
                    React.createElement(ArrowBackIos, { fontSize: 'small' })),
                React.createElement(IconButton, { onClick: handleScrollNext },
                    React.createElement(ArrowForwardIos, { fontSize: 'small' })))))),
        listMode ? (React.createElement(ListDays, { schedules: schedules, dictTag: dictTag, handleDelete: handleDeleteAppointment, refetchActivity: refetch, activities: schedulerData, handleToSaveActivityModel: handleToSaveActivityModel, handleActivityDetail: handleOpenEditDrawer, teamChoosed: teamChoosed, programChoosed: programChoosed, handleOptionSchedule: handleOptionSchedule })) : (React.createElement(Eventcalendar, { dragToMove: true, dragToResize: true, allDayText: 'M\u00F3dulo', width: '100%', height: '65vh', firstDay: 0, 
            // @ts-ignore
            onSelectedDateChange: (e) => setCurrentDate(e.date.toISOString()), selectedDate: currentDate, onCellDoubleClick: handleAddActivity, locale: localePtBR, data: [...(schedulerData || []), ...(modules || [])], view: currentView, renderHeader: customWithNavButtons, renderDay: (view === 'week' || view === 'day') && renderDay, cssClass: listMode && styles.calendar, onEventHoverIn: onEventHoverIn, onEventHoverOut: onEventHoverOut, onEventUpdate: onItemChange, onEventClick: onEventClick })),
        React.createElement(Popup, { display: 'anchored', isOpen: popupHover.open && !popup.open, anchor: popupHover.anchor, touchUi: false, showOverlay: false, contentPadding: false, closeOnOverlayClick: false, width: 350, closeOnScroll: true, onClose: () => setPopupHover({ open: false }), cssClass: 'md-tooltip' },
            React.createElement("div", { onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
                React.createElement(Box, { display: 'flex', padding: '5px', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '.8rem', style: { backgroundColor: (_e = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _e === void 0 ? void 0 : _e.color } },
                    React.createElement(Box, { width: '70%' },
                        React.createElement("span", null, (_f = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _f === void 0 ? void 0 : _f.title)),
                    !((_g = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _g === void 0 ? void 0 : _g.allDay) ? (React.createElement("span", null, (_h = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _h === void 0 ? void 0 :
                        _h[`${PREFIX}inicio`],
                        " -",
                        ' ', (_j = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _j === void 0 ? void 0 :
                        _j[`${PREFIX}fim`])) : null),
                !((_k = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _k === void 0 ? void 0 : _k.allDay) ? (React.createElement(Box, { padding: '5px' },
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Tema"),
                        ":",
                        ' ', (_l = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _l === void 0 ? void 0 :
                        _l[`${PREFIX}temaaula`],
                        ' '),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Pessoas Envolvidas"),
                        React.createElement(SectionList, null, (_o = (_m = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _m === void 0 ? void 0 : _m[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _o === void 0 ? void 0 : _o.map((envol) => {
                            var _a;
                            return (React.createElement("li", null, (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`]));
                        }))),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Espa\u00E7o"),
                        React.createElement(SectionList, null, (_q = (_p = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _p === void 0 ? void 0 : _p[`${PREFIX}Atividade_Espaco`]) === null || _q === void 0 ? void 0 : _q.map((spc) => (React.createElement("li", null,
                            " ", spc === null || spc === void 0 ? void 0 :
                            spc[`${PREFIX}nome`]))))),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Documentos"),
                        React.createElement(SectionList, null, (_s = (_r = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _r === void 0 ? void 0 : _r[`${PREFIX}Atividade_Documento`]) === null || _s === void 0 ? void 0 : _s.map((doc) => (React.createElement("li", null,
                            " ", doc === null || doc === void 0 ? void 0 :
                            doc[`${PREFIX}nome`]))))))) : null)),
        React.createElement(Popup, { showArrow: true, showOverlay: true, display: 'anchored', anchor: popup.anchor, fullScreen: true, scrollLock: false, contentPadding: false, isOpen: popup.open, onClose: handleClosePopup, responsive: responsivePopup, cssClass: styles.popup },
            React.createElement(Box, { width: '100%', padding: '1rem' },
                React.createElement(Typography, { variant: 'h5', align: 'center' }, (_t = popup === null || popup === void 0 ? void 0 : popup.item) === null || _t === void 0 ? void 0 : _t.title)),
            React.createElement(Divider, null),
            React.createElement(Box, { padding: '1rem' },
                !((_u = popup === null || popup === void 0 ? void 0 : popup.item) === null || _u === void 0 ? void 0 : _u.allDay) ? (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { container: true },
                        React.createElement(Grid, { item: true, xs: 1 },
                            React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                                React.createElement(AccessTime, null))),
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' }, (_v = popup === null || popup === void 0 ? void 0 : popup.item) === null || _v === void 0 ? void 0 :
                                _v[`${PREFIX}inicio`],
                                " -",
                                ' ', (_w = popup === null || popup === void 0 ? void 0 : popup.item) === null || _w === void 0 ? void 0 :
                                _w[`${PREFIX}fim`]))),
                    React.createElement(TitleResource, null, "Recursos"))) : null,
                React.createElement(Grid, { container: true, style: { maxHeight: '15rem', overflow: 'auto' } }, (_y = (_x = popup === null || popup === void 0 ? void 0 : popup.item) === null || _x === void 0 ? void 0 : _x[`${PREFIX}recursos_Atividade`]) === null || _y === void 0 ? void 0 : _y.map((item) => {
                    var _a, _b, _c;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: 1 },
                            React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' }, item.hasConflict ? (React.createElement(Error, { style: { color: '#a71111' } })) : (React.createElement(CheckCircle, { style: { color: '#35bb5a' } })))),
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' }, ((_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`]) ||
                                ((_b = item === null || item === void 0 ? void 0 : item.space) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                                ((_c = item === null || item === void 0 ? void 0 : item.finiteInfiniteResources) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]))),
                        item.hasConflict ? (React.createElement("ul", null, item.conflicts.map((conf) => {
                            var _a, _b, _c;
                            return (React.createElement("li", null,
                                moment(conf === null || conf === void 0 ? void 0 : conf[`${PREFIX}inicio`]).format('HH:mm'),
                                " -",
                                ' ',
                                moment(conf === null || conf === void 0 ? void 0 : conf[`${PREFIX}fim`]).format('HH:mm'),
                                " |",
                                ' ', (_a = conf === null || conf === void 0 ? void 0 : conf[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 :
                                _a[`${PREFIX}nome`],
                                " -",
                                ' ', (_b = conf === null || conf === void 0 ? void 0 : conf[`${PREFIX}Turma`]) === null || _b === void 0 ? void 0 :
                                _b[`${PREFIX}nome`],
                                " -",
                                ' ', (_c = conf === null || conf === void 0 ? void 0 : conf[`${PREFIX}Programa`]) === null || _c === void 0 ? void 0 :
                                _c[`${PREFIX}titulo`]));
                        }))) : null));
                }))),
            !((_z = popup === null || popup === void 0 ? void 0 : popup.item) === null || _z === void 0 ? void 0 : _z.allDay) ? (React.createElement(Box, { display: 'flex', padding: '1rem', style: { gap: '10px' } },
                React.createElement(Button, { onClick: () => handleOpenEditDrawer(popup === null || popup === void 0 ? void 0 : popup.item), startIcon: React.createElement(Edit, null), variant: 'contained', color: 'primary' }, "Editar"),
                React.createElement(Button, { onClick: () => {
                        handleToSaveActivityModel(popup === null || popup === void 0 ? void 0 : popup.item);
                        handleClosePopup();
                    }, startIcon: React.createElement(Save, null), variant: 'contained', color: 'primary' }, "Salvar como Modelo"),
                React.createElement(Button, { onClick: () => {
                        var _a;
                        handleClosePopup();
                        handleDeleteAppointment((_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.id);
                    }, startIcon: React.createElement(Delete, null), variant: 'contained', color: 'secondary' }, "Excluir"))) : null),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: modelName.open, onClose: handleCloseSaveModel },
            React.createElement(DialogTitle, null, "Salvar como modelo"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, fullWidth: true, error: !!modelName.error, helperText: modelName.error, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { name: event.target.value })), margin: 'dense', label: 'Nome', placeholder: 'Informe o nome do modelo', type: 'text' }),
                !modelName.isDay ? (React.createElement(Box, { marginTop: '2rem' },
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(FormLabel, { component: 'legend' }, "Atividades"),
                        React.createElement(FormGroup, null, activitiesModelChoosed === null || activitiesModelChoosed === void 0 ? void 0 : activitiesModelChoosed.map((actv, i) => (React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: actv.checked, onChange: (event) => handleChangeCheckbox(i, event), name: actv.name, color: 'primary' }), label: `${actv === null || actv === void 0 ? void 0 : actv.start} - ${actv.name}` }))))))) : null),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleCloseSaveModel }, "Cancelar"),
                React.createElement(Button, { onClick: saveAsModel, variant: 'contained', color: 'primary' }, "Salvar"))),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: activityModelName.open, onClose: handleCloseSaveActivityModel },
            React.createElement(DialogTitle, null, "Salvar como modelo"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, fullWidth: true, error: !!activityModelName.error, helperText: activityModelName.error, onChange: (event) => setActivityModelName(Object.assign(Object.assign({}, activityModelName), { name: event.target.value })), margin: 'dense', label: 'Nome', placeholder: 'Informe o nome do modelo', type: 'text' }),
                React.createElement(FormControl, { style: { marginTop: '1rem' }, component: 'fieldset' },
                    React.createElement(FormLabel, { component: 'legend' }, "Deseja preservar os recursos?"),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: activityModelName.loadSpaces, onChange: (event) => setActivityModelName(Object.assign(Object.assign({}, activityModelName), { loadSpaces: event.target.checked })), name: 'loadSpaces', color: 'primary' }), label: 'Espa\u00E7os' }),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: activityModelName.loadPerson, onChange: (event) => setActivityModelName(Object.assign(Object.assign({}, activityModelName), { loadPerson: event.target.checked })), name: 'loadPerson', color: 'primary' }), label: 'Pessoas' }))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleCloseSaveActivityModel }, "Cancelar"),
                React.createElement(Button, { variant: 'contained', color: 'primary', onClick: saveActivityAsModel }, loadingSaveActivityModel ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar'))))));
};
export default DetailTeam;
//# sourceMappingURL=index.js.map