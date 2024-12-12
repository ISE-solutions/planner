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
import { CalendarNext, CalendarPrev, Eventcalendar, localePtBR, Popup, setOptions, } from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { useConfirmation, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { BackdropStyled, SectionList, SectionNamePopup } from './styles';
import getDurationMoment from '~/utils/getDurationMoment';
import { Box, Button, CircularProgress, Divider, Grid, MenuItem, TextField, Typography, } from '@material-ui/core';
import checkConflictDate from '~/utils/checkConflictDate';
import * as _ from 'lodash';
import { TitleResource } from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import { AccessTime, ArrowBackIos, ArrowForwardIos, Error, } from '@material-ui/icons';
import styles from './Timeline.module.scss';
import { EFatherTag } from '~/config/enums';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { batchUpdateActivityAll, changeActivityDate, getActivity, getActivityByIds, getActivityByScheduleId, } from '~/store/modules/activity/actions';
import formatActivity from '~/utils/formatActivity';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import minTwoDigits from '~/utils/minTwoDigits';
import { Autocomplete } from '@material-ui/lab';
import { AVAILABILITY } from '../constants';
import { getScheduleByDateAndTeam } from '~/store/modules/schedule/actions';
setOptions({
    locale: localePtBR,
    theme: 'ios',
    themeVariant: 'light',
});
const Timeline = ({ groups, loading: resourceLoading, resources, refetch, typeResource, handleActivity, filter, setFieldValue, handleFilter, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const [loading, setLoading] = React.useState(false);
    const [currentDate, setCurrentDate] = React.useState(moment().toISOString());
    const [popup, setPopup] = React.useState({ open: false });
    const [schedulerData, setSchedulerData] = React.useState([]);
    const [backupData, setBackupData] = React.useState([]);
    const [cellDuration, setCellDuration] = React.useState(60);
    const [popupHover, setPopupHover] = React.useState({ open: false });
    const [view, setView] = React.useState('day');
    const [resourcesRender, setResourcesRender] = React.useState(groups);
    const [activitiesIds, setActivitiesIds] = React.useState([]);
    const [activities, setActivities] = React.useState([]);
    const [timeView, setTimeView] = React.useState({
        startTime: { value: '08:00', label: '08:00' },
        endTime: { value: '20:00', label: '20:00' },
    });
    const timerRef = React.useRef(null);
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const { tag, person, space } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const { dictSpace } = space;
    const activitiesMap = React.useMemo(() => {
        return activities === null || activities === void 0 ? void 0 : activities.reduce((acc, it) => {
            acc[it === null || it === void 0 ? void 0 : it[`${PREFIX}atividadeid`]] = it;
            return acc;
        }, {});
    }, [activities]);
    React.useEffect(() => {
        setResourcesRender(groups);
    }, [groups]);
    React.useEffect(() => {
        setCurrentDate(filter.startDate.utc().clone().startOf('day').toISOString());
        setTimeout(() => {
            document.getElementsByClassName('mbsc-timeline-grid-scroll')[0].scrollLeft = 0;
        }, 700);
    }, [filter.endDate]);
    React.useEffect(() => {
        getActivityByIds(activitiesIds).then(({ value }) => {
            setActivities(value);
        });
    }, [activitiesIds]);
    React.useEffect(() => {
        loadResources();
    }, [resources, typeResource]);
    const loadResources = () => {
        var _a, _b;
        const activitiesSet = new Set();
        let resourceItems = (_a = resources === null || resources === void 0 ? void 0 : resources.filter((res) => typeResource === 'Pessoa'
            ? res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]
            : res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`])) === null || _a === void 0 ? void 0 : _a.map((res) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            const resourceConflict = checkResourceConflict(res);
            const visibleConflicts = [];
            for (let k = 0; k < (resourceConflict === null || resourceConflict === void 0 ? void 0 : resourceConflict.length); k++) {
                const resConflict = resourceConflict[k];
                const temp = ((_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}temperatura_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                    ((_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}CronogramaDia`]) === null || _c === void 0 ? void 0 : _c[`_${PREFIX}temperatura_value`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) ||
                    ((_f = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_e = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Turma`]) === null || _e === void 0 ? void 0 : _e[`_${PREFIX}temperatura_value`]]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`]) ||
                    ((_h = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_g = resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Programa`]) === null || _g === void 0 ? void 0 : _g[`_${PREFIX}temperatura_value`]]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`]);
                let approved = false;
                if ((resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Espaco`]) &&
                    ((_j = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _j === void 0 ? void 0 : _j[`_${PREFIX}espaco_aprovador_por_value`])) {
                    approved = true;
                }
                if (resConflict === null || resConflict === void 0 ? void 0 : resConflict[`${PREFIX}Pessoa`]) {
                    const envolvedPerson = (_l = (_k = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _k === void 0 ? void 0 : _k[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _l === void 0 ? void 0 : _l.find((e) => {
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
            const hasConflict = visibleConflicts.length > 0;
            const activity = (res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) || {};
            activity[`${PREFIX}Temperatura`] =
                dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_o = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _o === void 0 ? void 0 : _o[`_${PREFIX}temperatura_value`]];
            const programTemp = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_p = res === null || res === void 0 ? void 0 : res[`${PREFIX}Programa`]) === null || _p === void 0 ? void 0 : _p[`_${PREFIX}temperatura_value`]];
            const teamTemp = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_q = res === null || res === void 0 ? void 0 : res[`${PREFIX}Turma`]) === null || _q === void 0 ? void 0 : _q[`_${PREFIX}temperatura_value`]];
            const dayTemp = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_r = res === null || res === void 0 ? void 0 : res[`${PREFIX}CronogramaDia`]) === null || _r === void 0 ? void 0 : _r[`_${PREFIX}temperatura_value`]];
            if (!activitiesSet.has(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
                activitiesSet.add(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]);
            }
            return Object.assign(Object.assign({}, res), { hasConflict, conflicts: visibleConflicts, color: hasConflict
                    ? '#a71111'
                    : temperatureColor(activity, (programTemp === null || programTemp === void 0 ? void 0 : programTemp[`${PREFIX}nome`]) ||
                        (teamTemp === null || teamTemp === void 0 ? void 0 : teamTemp[`${PREFIX}nome`]) ||
                        (dayTemp === null || dayTemp === void 0 ? void 0 : dayTemp[`${PREFIX}nome`])).background, space: (_s = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _s === void 0 ? void 0 : _s[`${PREFIX}nome`], id: res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], resource: typeResource === 'Pessoa'
                    ? (_t = res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) === null || _t === void 0 ? void 0 : _t[`${PREFIX}pessoaid`]
                    : (_u = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _u === void 0 ? void 0 : _u[`${PREFIX}espacoid`], title: (_w = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_v = res === null || res === void 0 ? void 0 : res[`${PREFIX}Programa`]) === null || _v === void 0 ? void 0 : _v[`_${PREFIX}nomeprograma_value`]]) === null || _w === void 0 ? void 0 : _w[`${PREFIX}nome`], start: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]).format('YYYY-MM-DD HH:mm:ss'), end: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]).format('YYYY-MM-DD HH:mm:ss') });
        });
        let resourcesToShow = _.cloneDeep(groups);
        if ((_b = filter.tagsFilter) === null || _b === void 0 ? void 0 : _b.length) {
            resourcesToShow = groups === null || groups === void 0 ? void 0 : groups.filter((gp) => {
                var _a, _b;
                if (typeResource === 'Pessoa') {
                    return (_a = gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tg) => {
                        var _a;
                        return (_a = filter.tagsFilter) === null || _a === void 0 ? void 0 : _a.some((tF) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) === (tF === null || tF === void 0 ? void 0 : tF[`${PREFIX}etiquetaid`]));
                    });
                }
                if (typeResource === 'Espaço') {
                    return (_b = gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.some((tg) => {
                        var _a;
                        return (_a = filter.tagsFilter) === null || _a === void 0 ? void 0 : _a.some((tF) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) === (tF === null || tF === void 0 ? void 0 : tF[`${PREFIX}etiquetaid`]));
                    });
                }
            });
        }
        switch (filter.availability) {
            case AVAILABILITY.CONFLITO:
                resourceItems = resourceItems.filter((res) => res.hasConflict);
                resourcesToShow = groups === null || groups === void 0 ? void 0 : groups.filter((gp) => resourceItems === null || resourceItems === void 0 ? void 0 : resourceItems.some((res) => {
                    var _a, _b;
                    if (typeResource === 'Pessoa') {
                        return (((_a = res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}pessoaid`]));
                    }
                    if (typeResource === 'Espaço') {
                        return (((_b = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}espacoid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}espacoid`]));
                    }
                }));
                break;
            case AVAILABILITY.TOTALMENTE_LIVRE:
                resourcesToShow = groups === null || groups === void 0 ? void 0 : groups.filter((gp) => !(resourceItems === null || resourceItems === void 0 ? void 0 : resourceItems.some((res) => {
                    var _a, _b;
                    if (typeResource === 'Pessoa') {
                        return (((_a = res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}pessoaid`]));
                    }
                    if (typeResource === 'Espaço') {
                        return (((_b = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}espacoid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}espacoid`]));
                    }
                })));
                break;
            case AVAILABILITY.PARCIALMENTE_LIVRE:
                resourcesToShow = groups === null || groups === void 0 ? void 0 : groups.filter((gp) => resourceItems === null || resourceItems === void 0 ? void 0 : resourceItems.some((res) => {
                    var _a, _b;
                    if (typeResource === 'Pessoa') {
                        return (((_a = res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}pessoaid`]));
                    }
                    if (typeResource === 'Espaço') {
                        return (((_b = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}espacoid`]) ===
                            (gp === null || gp === void 0 ? void 0 : gp[`${PREFIX}espacoid`]));
                    }
                }));
                break;
            default:
                break;
        }
        setActivitiesIds(Array.from(activitiesSet));
        setResourcesRender(resourcesToShow);
        setSchedulerData(resourceItems);
        setBackupData(_.cloneDeep(resourceItems));
    };
    const handleSuccess = () => {
        refetch();
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
    const checkActivityConflict = (activity, resource) => {
        const dateToMove = moment(activity === null || activity === void 0 ? void 0 : activity.startDate).startOf('day');
        const resourcesOfDay = resources === null || resources === void 0 ? void 0 : resources.filter((resource) => moment(resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}inicio`]).startOf('day').isSame(dateToMove));
        let resourcesConflicted = [];
        const datesAppointment = [
            moment(activity === null || activity === void 0 ? void 0 : activity.startDate),
            moment(activity === null || activity === void 0 ? void 0 : activity.endDate),
        ];
        resourcesConflicted = resourcesOfDay.filter((res) => {
            var _a, _b;
            const datesResource = [
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]),
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]),
            ];
            const isConflicted = checkConflictDate(datesAppointment, datesResource) &&
                (res === null || res === void 0 ? void 0 : res[`_${PREFIX}atividade_value`]) !==
                    (resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}atividade_value`]);
            return (isConflicted &&
                (((_a = activity === null || activity === void 0 ? void 0 : activity.spaces) === null || _a === void 0 ? void 0 : _a.some((act) => (act === null || act === void 0 ? void 0 : act[`${PREFIX}espacoid`]) === (res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]))) ||
                    ((_b = activity === null || activity === void 0 ? void 0 : activity.people) === null || _b === void 0 ? void 0 : _b.some((act) => {
                        var _a;
                        return ((_a = act === null || act === void 0 ? void 0 : act.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                            (res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]);
                    }))));
        });
        return resourcesConflicted;
    };
    const checkResourceConflict = (resource) => {
        let resourcesConflicted = [];
        const datesAppointment = [
            moment(resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}inicio`]),
            moment(resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}fim`]),
        ];
        resourcesConflicted = resources.filter((res) => {
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
    const onItemChange = ({ event, oldEvent }) => {
        setLoading(true);
        const resource = resources === null || resources === void 0 ? void 0 : resources.find((r) => (r === null || r === void 0 ? void 0 : r[`${PREFIX}recursosid`]) === event.id);
        getActivity(resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}atividade_value`]).then(({ value }) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            if (!value.length) {
                notification.error({
                    title: 'Falha',
                    description: 'Não foi possível encontrar a atividade, entre em contato com o administrador!',
                });
                setLoading(false);
            }
            const activity = value[0];
            const newStartTime = moment(event.start.toString());
            const newEndTime = moment(event.end.toString());
            const startString = newStartTime.clone().format('YYYY-MM-DD');
            if (startString !==
                moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('YYYY-MM-DD')) {
                const previousSchedule = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`]) === null || _a === void 0 ? void 0 : _a[0];
                const newSchedule = yield getScheduleByDateAndTeam(`${startString}T00:00:00`, (_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Turma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}turmaid`]);
                if (!newSchedule.value.length) {
                    confirmation.openConfirmation({
                        title: 'Dia de aula não encontrado',
                        description: `O dia ${startString} não está cadastrado`,
                        onConfirm: loadResources,
                        onCancel: loadResources,
                        showCancel: false,
                        yesLabel: 'Fechar',
                    });
                    setLoading(false);
                    return;
                }
                dispatch(changeActivityDate(Object.assign(Object.assign({}, activity), { id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], [`${PREFIX}atividadeid`]: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], startDate: newStartTime.format(), endDate: newEndTime.format(), startTime: newStartTime, endTime: newEndTime, duration: getDurationMoment(newStartTime, newEndTime), [`${PREFIX}datahorainicio`]: newStartTime.format(), [`${PREFIX}datahorafim`]: newEndTime.format() }), previousSchedule === null || previousSchedule === void 0 ? void 0 : previousSchedule[`${PREFIX}cronogramadediaid`], (_d = (_c = newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule.value) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}cronogramadediaid`], {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
                return;
            }
            let newGroup = null;
            let newSpaces = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`];
            let spacesToDelete = [];
            let newPeople = (_e = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _e === void 0 ? void 0 : _e.map((e) => ({
                id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
            }));
            if (event.resource !== oldEvent.resource && typeResource === 'Espaço') {
                newGroup = groups.find((g) => g.id === event.resource);
                newSpaces = [];
                if (newGroup.id !== ((_f = resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}Espaco`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}espacoid`])) {
                    spacesToDelete = (_g = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _g === void 0 ? void 0 : _g.filter((e) => {
                        var _a;
                        return e[`${PREFIX}espacoid`] ===
                            ((_a = resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}Espaco`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}espacoid`]);
                    });
                    newSpaces =
                        ((_h = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _h === void 0 ? void 0 : _h.filter((e) => {
                            var _a;
                            return e[`${PREFIX}espacoid`] !==
                                ((_a = resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}Espaco`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}espacoid`]);
                        })) || [];
                }
                newSpaces.push(newGroup);
            }
            if (event.resource !== oldEvent.resource && typeResource === 'Pessoa') {
                newGroup = groups.find((g) => g.id === event.resource);
                const indexPeopleSaved = newPeople === null || newPeople === void 0 ? void 0 : newPeople.findIndex((e) => {
                    var _a, _b;
                    return ((_a = e === null || e === void 0 ? void 0 : e.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                        ((_b = resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}Pessoa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}pessoaid`]);
                });
                const envolvedPeopleSaved = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`][indexPeopleSaved];
                const newPeopleHasGroup = (_j = newGroup === null || newGroup === void 0 ? void 0 : newGroup[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _j === void 0 ? void 0 : _j.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]) ===
                    (envolvedPeopleSaved === null || envolvedPeopleSaved === void 0 ? void 0 : envolvedPeopleSaved[`_${PREFIX}funcao_value`]));
                if (!newPeopleHasGroup) {
                    setLoading(false);
                    setSchedulerData(_.cloneDeep(backupData));
                    confirmation.openConfirmation({
                        title: (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            React.createElement(Error, { style: { color: '#a71111' } }),
                            " Pessoa n\u00E3o possui fun\u00E7\u00E3o")),
                        description: `O(a) ${newGroup === null || newGroup === void 0 ? void 0 : newGroup[`${PREFIX}nome`]} não possui a função ${(_k = dictTag[envolvedPeopleSaved === null || envolvedPeopleSaved === void 0 ? void 0 : envolvedPeopleSaved[`_${PREFIX}funcao_value`]]) === null || _k === void 0 ? void 0 : _k[`${PREFIX}nome`]}`,
                        showCancel: false,
                        yesLabel: 'Fechar',
                        onConfirm: () => { },
                    });
                    return;
                }
                newPeople[indexPeopleSaved].person = Object.assign(Object.assign({}, newGroup), { value: newGroup === null || newGroup === void 0 ? void 0 : newGroup[`${PREFIX}pessoaid`] });
            }
            const activityToUpdate = Object.assign(Object.assign({}, activity), { spacesToDelete, teamId: resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}turma_value`], programId: resource === null || resource === void 0 ? void 0 : resource[`_${PREFIX}programa_value`], id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], [`${PREFIX}atividadeid`]: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], startDate: newStartTime.format(), endDate: newEndTime.format(), startTime: newStartTime, endTime: newEndTime, duration: getDurationMoment(newStartTime, newEndTime), [`${PREFIX}datahorainicio`]: newStartTime.format(), [`${PREFIX}datahorafim`]: newEndTime.format(), spaces: newSpaces, people: newPeople });
            const conflicts = checkActivityConflict(activityToUpdate, resource);
            const resourcesConflicted = [];
            newSpaces.forEach((spc) => {
                const conflictsRes = conflicts === null || conflicts === void 0 ? void 0 : conflicts.filter((c) => {
                    var _a;
                    return ((_a = c === null || c === void 0 ? void 0 : c[`${PREFIX}Espaco`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}espacoid`]) ===
                        (spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]);
                });
                resourcesConflicted.push({
                    name: spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}nome`],
                    hasConflict: conflictsRes.length,
                    conflicts: conflictsRes,
                });
            });
            newPeople.forEach((pe) => {
                var _a;
                const conflictsRes = conflicts === null || conflicts === void 0 ? void 0 : conflicts.filter((c) => {
                    var _a, _b;
                    return ((_a = c === null || c === void 0 ? void 0 : c[`${PREFIX}Pessoa`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]) ===
                        ((_b = pe === null || pe === void 0 ? void 0 : pe.person) === null || _b === void 0 ? void 0 : _b[`${PREFIX}pessoaid`]);
                });
                resourcesConflicted.push({
                    name: (_a = pe === null || pe === void 0 ? void 0 : pe.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                    hasConflict: conflictsRes.length,
                    conflicts: conflictsRes,
                });
            });
            const responseActivities = yield getActivityByScheduleId(activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`_${PREFIX}cronogramadia_value`]);
            const activities = responseActivities === null || responseActivities === void 0 ? void 0 : responseActivities.value;
            const activitiesFromDay = (_l = activities === null || activities === void 0 ? void 0 : activities.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))) === null || _l === void 0 ? void 0 : _l.sort((a, b) => a.startTime.unix() - b.startTime.unix());
            const actvIndex = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.findIndex((e) => (e === null || e === void 0 ? void 0 : e.id) === (activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`${PREFIX}atividadeid`]));
            let nextActivities = activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.slice(actvIndex + 1, activitiesFromDay === null || activitiesFromDay === void 0 ? void 0 : activitiesFromDay.length);
            const lastDateTime = moment(activityToUpdate.endDate);
            let nextChanges = (_m = reorderTimeActivities(lastDateTime, nextActivities)) === null || _m === void 0 ? void 0 : _m.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivity(actv, {
                dictPeople: dictPeople,
                dictSpace: dictSpace,
                dictTag: dictTag,
            }))));
            const scheduleEdit = (_o = activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`${PREFIX}CronogramadeDia_Atividade`]) === null || _o === void 0 ? void 0 : _o[0];
            const activitiesToEdit = [
                Object.assign(Object.assign({}, activityToUpdate), { [`${PREFIX}inicio`]: activityToUpdate.startTime.format('HH:mm'), [`${PREFIX}fim`]: activityToUpdate.endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: moment
                        .utc(activityToUpdate.startDate)
                        .format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: moment
                        .utc(activityToUpdate.endDate)
                        .format('YYYY-MM-DDTHH:mm:ss'), startDate: moment
                        .utc(activityToUpdate.startDate)
                        .format('YYYY-MM-DD HH:mm'), endDate: moment
                        .utc(activityToUpdate.endDate)
                        .format('YYYY-MM-DD HH:mm'), teamId: activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`_${PREFIX}turma_value`], programId: activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`_${PREFIX}programa_value`], scheduleId: (_q = (_p = activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`${PREFIX}CronogramadeDia_Atividade`]) === null || _p === void 0 ? void 0 : _p[0]) === null || _q === void 0 ? void 0 : _q[`${PREFIX}cronogramadediaid`] }),
                ...nextChanges,
            ];
            dispatch(batchUpdateActivityAll(activitiesToEdit, activityToUpdate, {
                teamId: activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`_${PREFIX}turma_value`],
                programId: activityToUpdate === null || activityToUpdate === void 0 ? void 0 : activityToUpdate[`_${PREFIX}programa_value`],
                scheduleId: scheduleEdit === null || scheduleEdit === void 0 ? void 0 : scheduleEdit[`${PREFIX}cronogramadediaid`],
            }, {
                onSuccess: handleSuccess,
                onError: handleError,
            }));
        }));
    };
    const onEventClick = React.useCallback((args) => {
        var _a;
        const event = args.event;
        handleActivity((_a = event === null || event === void 0 ? void 0 : event[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}atividadeid`]);
        // setPopup({ open: true, item: event, anchor: args.domEvent.target });
    }, []);
    const onEventHoverIn = React.useCallback((args) => {
        var _a;
        const event = args.event;
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setPopupHover({
            open: true,
            anchor: args.domEvent.target,
            event,
            activity: activitiesMap === null || activitiesMap === void 0 ? void 0 : activitiesMap[(_a = event === null || event === void 0 ? void 0 : event[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}atividadeid`]],
        });
    }, [activitiesMap]);
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
    const renderCustomEvent = React.useCallback((data) => {
        const ev = data.original;
        const style = data.style;
        return (React.createElement("div", { className: 'mbsc-schedule-event-inner mbsc-ios', style: {
                borderRadius: '5px',
                width: '100%',
                backgroundColor: style.background,
            } },
            React.createElement(Box, { display: 'flex' },
                React.createElement("div", { style: { color: style.color }, className: 'mbsc-schedule-event-title mbsc-ios' }, ev.title))));
    }, []);
    const handleClosePopup = () => {
        setPopup({ open: false, item: null });
    };
    const handleChangeDate = (amount) => {
        const date = moment(currentDate);
        date.add('day', amount);
        setCurrentDate(date.utc().clone().startOf('day').toISOString());
        setFieldValue('startDate', date.utc());
        setFieldValue('endDate', date.utc());
        handleFilter();
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
    const currentView = React.useMemo(() => {
        var _a, _b;
        let calView;
        switch (view) {
            case 'day':
                calView = {
                    timeline: {
                        type: 'day',
                        labels: 1,
                        startTime: (_a = timeView === null || timeView === void 0 ? void 0 : timeView.startTime) === null || _a === void 0 ? void 0 : _a.value,
                        endTime: (_b = timeView === null || timeView === void 0 ? void 0 : timeView.endTime) === null || _b === void 0 ? void 0 : _b.value,
                        size: (filter === null || filter === void 0 ? void 0 : filter.endDate.diff(filter.startDate, 'days')) + 1,
                        range: (filter === null || filter === void 0 ? void 0 : filter.endDate.diff(filter.startDate, 'days')) + 1,
                        resolution: 'hour',
                        timeCellStep: cellDuration,
                        timeLabelStep: cellDuration <= 60 ? 60 : 120,
                    },
                };
                break;
        }
        return calView;
    }, [cellDuration, view, timeView, filter]);
    const timeOptions = React.useMemo(() => Array(24)
        .fill(0)
        .map((_, i) => ({
        value: `${minTwoDigits(i)}:00`,
        label: `${minTwoDigits(i)}:00`,
    })), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(BackdropStyled, { open: loading || resourceLoading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        !filter.onlyConflicts ||
            (filter.onlyConflicts && (schedulerData === null || schedulerData === void 0 ? void 0 : schedulerData.length)) ? (React.createElement(React.Fragment, null,
            React.createElement(Box, { display: 'flex', width: '100%', justifyContent: 'space-between', paddingBottom: '10px' },
                React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                    React.createElement(Button, { onClick: () => handleChangeDate(-1), startIcon: React.createElement(ArrowBackIos, null) }, "Anterior"),
                    React.createElement(Button, { onClick: () => handleChangeDate(1), endIcon: React.createElement(ArrowForwardIos, null) }, "Proximo")),
                React.createElement(Box, { display: 'flex', justifyContent: 'flex-between', style: { gap: '20px' } },
                    React.createElement(Box, { display: 'flex', justifyContent: 'flex-between', style: { gap: '10px' } },
                        React.createElement(Autocomplete, { options: timeOptions, style: { minWidth: '6rem' }, getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                                setTimeView(Object.assign(Object.assign({}, timeView), { startTime: newValue }));
                            }, noOptionsText: 'Sem Op\u00E7\u00F5es', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'In\u00EDcio do dia' }))), value: timeView.startTime }),
                        React.createElement(Autocomplete, { options: timeOptions, style: { minWidth: '6rem' }, getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                                setTimeView(Object.assign(Object.assign({}, timeView), { endTime: newValue }));
                            }, noOptionsText: 'Sem Op\u00E7\u00F5es', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Fim do dia' }))), value: timeView.endTime })),
                    React.createElement(TextField, { select: true, fullWidth: true, style: { maxWidth: '10rem' }, value: cellDuration, label: 'Intervalo', onChange: (event) => setCellDuration(+event.target.value) },
                        React.createElement(MenuItem, { value: 15 }, "15 Minutos"),
                        React.createElement(MenuItem, { value: 30 }, "30 Minutos"),
                        React.createElement(MenuItem, { value: 60 }, "60 Minutos"),
                        React.createElement(MenuItem, { value: 120 }, "2 Horas"),
                        React.createElement(MenuItem, { value: 180 }, "3 Horas"),
                        React.createElement(MenuItem, { value: 240 }, "4 Horas")))),
            React.createElement(Eventcalendar, { dragToResize: true, dragToMove: true, firstDay: 0, dataTimezone: 'America/Sao_Paulo', cssClass: styles.calendar, data: schedulerData, renderHeader: () => (React.createElement(Box, null,
                    React.createElement(CalendarPrev, { className: 'cal-header-prev' }),
                    React.createElement(CalendarNext, { className: 'cal-header-next' }))), onEventUpdate: onItemChange, onEventClick: onEventClick, renderScheduleEvent: renderCustomEvent, onEventHoverIn: onEventHoverIn, onEventHoverOut: onEventHoverOut, locale: localePtBR, view: currentView, resources: resourcesRender, width: '100%', height: '70vh', selectedDate: currentDate, refDate: currentDate, defaultSelectedDate: new Date(filter.startDate
                    .clone()
                    .utc()
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')), min: new Date(filter.startDate
                    .clone()
                    .utc()
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')), max: new Date(filter.endDate
                    .clone()
                    .utc()
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')) }))) : (React.createElement(Box, { textAlign: 'center', fontWeight: 'bold' },
            React.createElement(Typography, { variant: 'h5' }, "N\u00E3o possui conflitos no per\u00EDodo informado"))),
        React.createElement(Popup, { display: 'anchored', isOpen: popupHover.open && !popup.open, anchor: popupHover.anchor, touchUi: false, showOverlay: false, contentPadding: false, closeOnOverlayClick: false, width: 350, closeOnScroll: true, onClose: () => setPopupHover({ open: false }), cssClass: 'md-tooltip' },
            React.createElement("div", { onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave },
                React.createElement(Box, { display: 'flex', padding: '5px', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '.8rem', style: { backgroundColor: (_a = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _a === void 0 ? void 0 : _a.color } },
                    React.createElement(Box, { width: '70%' },
                        React.createElement("span", null, (_c = (_b = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _b === void 0 ? void 0 : _b[`${PREFIX}Atividade`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`])),
                    React.createElement("span", null,
                        moment((_d = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _d === void 0 ? void 0 : _d.start).format('HH:mm'),
                        " -",
                        ' ',
                        moment((_e = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _e === void 0 ? void 0 : _e.end).format('HH:mm'))),
                React.createElement(Box, { padding: '5px' },
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Programa"),
                        ":",
                        ' ', (_f = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _f === void 0 ? void 0 :
                        _f.title),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Turma"),
                        ":",
                        ' ', (_h = (_g = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _g === void 0 ? void 0 : _g[`${PREFIX}Turma`]) === null || _h === void 0 ? void 0 :
                        _h[`${PREFIX}nome`])),
                !((_j = popupHover === null || popupHover === void 0 ? void 0 : popupHover.event) === null || _j === void 0 ? void 0 : _j.allDay) ? (React.createElement(Box, { padding: '5px' },
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Tema"),
                        ":",
                        ' ', (_k = popupHover === null || popupHover === void 0 ? void 0 : popupHover.activity) === null || _k === void 0 ? void 0 :
                        _k[`${PREFIX}temaaula`],
                        ' '),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Pessoas Envolvidas"),
                        React.createElement(SectionList, null, (_m = (_l = popupHover === null || popupHover === void 0 ? void 0 : popupHover.activity) === null || _l === void 0 ? void 0 : _l[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _m === void 0 ? void 0 : _m.map((envol) => {
                            var _a;
                            return (React.createElement("li", null, (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`]));
                        }))),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Espa\u00E7o"),
                        React.createElement(SectionList, null, (_p = (_o = popupHover === null || popupHover === void 0 ? void 0 : popupHover.activity) === null || _o === void 0 ? void 0 : _o[`${PREFIX}Atividade_Espaco`]) === null || _p === void 0 ? void 0 : _p.map((spc) => (React.createElement("li", null,
                            " ", spc === null || spc === void 0 ? void 0 :
                            spc[`${PREFIX}nome`]))))),
                    React.createElement(Box, null,
                        React.createElement(SectionNamePopup, null, "Documentos"),
                        React.createElement(SectionList, null, (_r = (_q = popupHover === null || popupHover === void 0 ? void 0 : popupHover.activity) === null || _q === void 0 ? void 0 : _q[`${PREFIX}Atividade_Documento`]) === null || _r === void 0 ? void 0 : _r.map((doc) => (React.createElement("li", null,
                            " ", doc === null || doc === void 0 ? void 0 :
                            doc[`${PREFIX}nome`]))))))) : null)),
        React.createElement(Popup, { showArrow: true, display: 'anchored', anchor: popup.anchor, fullScreen: true, scrollLock: false, contentPadding: false, isOpen: popup.open, onClose: handleClosePopup, responsive: responsivePopup, cssClass: styles.popup },
            React.createElement(Box, { width: '100%', padding: '1rem' },
                React.createElement(Typography, { variant: 'h5', align: 'center' }, (_s = popup === null || popup === void 0 ? void 0 : popup.item) === null || _s === void 0 ? void 0 : _s.title)),
            React.createElement(Divider, null),
            React.createElement(Box, { padding: '1rem' },
                React.createElement(Grid, { container: true },
                    React.createElement(Grid, { item: true, xs: 1 },
                        React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                            React.createElement(AccessTime, null))),
                    React.createElement(Grid, { item: true, xs: 11 },
                        React.createElement(Typography, { variant: 'body1' },
                            moment((_t = popup === null || popup === void 0 ? void 0 : popup.item) === null || _t === void 0 ? void 0 : _t.start).format('HH:mm'),
                            " -",
                            ' ',
                            moment((_u = popup === null || popup === void 0 ? void 0 : popup.item) === null || _u === void 0 ? void 0 : _u.end).format('HH:mm'),
                            " |",
                            ' ', (_w = (_v = popup === null || popup === void 0 ? void 0 : popup.item) === null || _v === void 0 ? void 0 : _v[`${PREFIX}Atividade`]) === null || _w === void 0 ? void 0 :
                            _w[`${PREFIX}nome`],
                            " -",
                            ' ', (_y = (_x = popup === null || popup === void 0 ? void 0 : popup.item) === null || _x === void 0 ? void 0 : _x[`${PREFIX}Turma`]) === null || _y === void 0 ? void 0 :
                            _y[`${PREFIX}nome`]))),
                ((_z = popup === null || popup === void 0 ? void 0 : popup.item) === null || _z === void 0 ? void 0 : _z.hasConflict) ? (React.createElement(TitleResource, null, "Conflitos")) : null,
                React.createElement(Grid, { container: true, style: { maxHeight: '15rem', overflow: 'auto' } }, (_1 = (_0 = popup === null || popup === void 0 ? void 0 : popup.item) === null || _0 === void 0 ? void 0 : _0.conflicts) === null || _1 === void 0 ? void 0 : _1.map((item) => {
                    var _a, _b, _c;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: 1 },
                            React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                                React.createElement(Error, { style: { color: '#a71111' } }))),
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' }, (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`])),
                        React.createElement("ul", null,
                            React.createElement("li", null,
                                moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`]).format('HH:mm'),
                                " -",
                                ' ',
                                moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}fim`]).format('HH:mm'),
                                " |",
                                ' ', (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Turma`]) === null || _b === void 0 ? void 0 :
                                _b[`${PREFIX}nome`],
                                " -",
                                ' ', (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Programa`]) === null || _c === void 0 ? void 0 :
                                _c[`${PREFIX}titulo`]))));
                }))))));
};
export default Timeline;
//# sourceMappingURL=index.js.map