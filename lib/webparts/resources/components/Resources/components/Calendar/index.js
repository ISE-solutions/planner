import * as React from 'react';
import * as Moment from 'moment';
import { Box, Divider, Grid, MenuItem, TextField, Typography, } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { extendMoment } from 'moment-range';
import checkConflictDate from '~/utils/checkConflictDate';
import { CalendarNav, CalendarNext, CalendarPrev, CalendarToday, Eventcalendar, localePtBR, Popup, SegmentedGroup, SegmentedItem, setOptions, } from '@mobiscroll/react';
import { AccessTime, Error } from '@material-ui/icons';
import styles from './Calendar.module.scss';
import { TitleResource } from './styles';
import { EFatherTag } from '~/config/enums';
import temperatureColor from '~/utils/temperatureColor';
import { useSelector } from 'react-redux';
const locale = 'pt-BR';
const moment = extendMoment(Moment);
moment.locale(locale);
setOptions({
    locale: localePtBR,
    theme: 'ios',
    themeVariant: 'light',
});
const Calendar = ({ resources, filter }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const [schedulerData, setSchedulerData] = React.useState([]);
    const [currentDate, setCurrentDate] = React.useState(moment().toISOString());
    const [cellDuration, setCellDuration] = React.useState(60);
    const [popup, setPopup] = React.useState({ open: false });
    const [view, setView] = React.useState('week');
    const { tag, person, space } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const { dictSpace } = space;
    const checkConflict = (resource) => {
        let resourcesConflicted = [];
        const datesAppointment = [
            moment(resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}inicio`]),
            moment(resource === null || resource === void 0 ? void 0 : resource[`${PREFIX}fim`]),
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
        setCurrentDate(filter.startDate.clone().startOf('day').toISOString());
    }, [filter.startDate]);
    React.useEffect(() => {
        if (dictTag && Object.keys(dictTag).length) {
            let newSchedulerData = resources === null || resources === void 0 ? void 0 : resources.map((res) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                const resourceConflict = checkConflict(res);
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
                const activity = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`];
                activity[`${PREFIX}Temperatura`] =
                    dictTag[(_o = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _o === void 0 ? void 0 : _o[`_${PREFIX}temperatura_value`]];
                const programTemp = dictTag[(_p = res === null || res === void 0 ? void 0 : res[`${PREFIX}Programa`]) === null || _p === void 0 ? void 0 : _p[`_${PREFIX}temperatura_value`]];
                const teamTemp = dictTag[(_q = res === null || res === void 0 ? void 0 : res[`${PREFIX}Turma`]) === null || _q === void 0 ? void 0 : _q[`_${PREFIX}temperatura_value`]];
                const dayTemp = dictTag[(_r = res === null || res === void 0 ? void 0 : res[`${PREFIX}CronogramaDia`]) === null || _r === void 0 ? void 0 : _r[`_${PREFIX}temperatura_value`]];
                return Object.assign(Object.assign({}, res), { hasConflict, conflicts: visibleConflicts, color: hasConflict
                        ? '#a71111'
                        : temperatureColor(activity, (programTemp === null || programTemp === void 0 ? void 0 : programTemp[`${PREFIX}nome`]) ||
                            (teamTemp === null || teamTemp === void 0 ? void 0 : teamTemp[`${PREFIX}nome`]) ||
                            (dayTemp === null || dayTemp === void 0 ? void 0 : dayTemp[`${PREFIX}nome`])).background, id: res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`], title: ((_s = res === null || res === void 0 ? void 0 : res[`${PREFIX}Espaco`]) === null || _s === void 0 ? void 0 : _s[`${PREFIX}nome`]) ||
                        ((_t = res === null || res === void 0 ? void 0 : res[`${PREFIX}Pessoa`]) === null || _t === void 0 ? void 0 : _t[`${PREFIX}nome`]) ||
                        ((_u = res === null || res === void 0 ? void 0 : res[`${PREFIX}Recurso_RecursoFinitoeInfinito`]) === null || _u === void 0 ? void 0 : _u[`${PREFIX}nome`]), start: res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`], end: res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`] });
            });
            if (filter.tagsFilter) {
                newSchedulerData = newSchedulerData === null || newSchedulerData === void 0 ? void 0 : newSchedulerData.filter((res) => {
                    const spaceRes = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]];
                    const personRes = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]];
                    if (spaceRes) {
                        return spaceRes === null || spaceRes === void 0 ? void 0 : spaceRes[`${PREFIX}Espaco_Etiqueta_Etiqueta`].some((tg) => {
                            var _a;
                            return (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) ===
                                ((_a = filter.tagsFilter) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                        });
                    }
                    if (personRes) {
                        return personRes === null || personRes === void 0 ? void 0 : personRes[`${PREFIX}Pessoa_Etiqueta_Etiqueta`].some((tg) => {
                            var _a;
                            return (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) ===
                                ((_a = filter.tagsFilter) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                        });
                    }
                });
            }
            if (filter.onlyConflicts) {
                newSchedulerData = newSchedulerData.filter((res) => res.hasConflict);
            }
            setSchedulerData(newSchedulerData);
        }
    }, [resources, dictTag]);
    const onEventClick = React.useCallback((args) => {
        const event = args.event;
        setPopup({ open: true, item: event, anchor: args.domEvent.target });
    }, []);
    const handleClosePopup = () => {
        setPopup({ open: false, item: null });
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
    const customWithNavButtons = () => {
        return (React.createElement(React.Fragment, null,
            React.createElement(CalendarNav, { className: 'cal-header-nav' }),
            React.createElement("div", { className: styles.headerPicker },
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
    const currentView = React.useMemo(() => {
        let calView;
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
            case 'agenda':
                calView = {
                    calendar: { type: 'week' },
                    agenda: { type: 'week' },
                };
                break;
        }
        return calView;
    }, [cellDuration, view]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' },
            React.createElement(TextField, { select: true, fullWidth: true, style: { maxWidth: '10rem' }, value: cellDuration, label: 'Dura\u00E7\u00E3o do Intervalo', onChange: (event) => setCellDuration(+event.target.value) },
                React.createElement(MenuItem, { value: 15 }, "15 Minutos"),
                React.createElement(MenuItem, { value: 30 }, "30 Minutos"),
                React.createElement(MenuItem, { value: 60 }, "60 Minutos"))),
        React.createElement(Eventcalendar, { allDayText: 'M\u00F3dulo', width: '100%', height: '34rem', locale: localePtBR, firstDay: 0, data: [...(schedulerData || [])], view: currentView, 
            // @ts-ignore
            onSelectedDateChange: (e) => setCurrentDate(e.date.toISOString()), renderHeader: customWithNavButtons, onEventClick: onEventClick, selectedDate: currentDate, min: filter.startDate.clone().startOf('day').toISOString(), max: filter.endDate.clone().startOf('day').toISOString() }),
        React.createElement(Popup, { showArrow: true, display: 'anchored', anchor: popup.anchor, fullScreen: true, scrollLock: false, contentPadding: false, isOpen: popup.open, onClose: handleClosePopup, responsive: responsivePopup, cssClass: styles.popup },
            React.createElement(Box, { width: '100%', padding: '1rem' },
                React.createElement(Typography, { variant: 'h5', align: 'center' }, (_a = popup === null || popup === void 0 ? void 0 : popup.item) === null || _a === void 0 ? void 0 : _a.title)),
            React.createElement(Divider, null),
            React.createElement(Box, { padding: '1rem' },
                React.createElement(Grid, { container: true },
                    React.createElement(Grid, { item: true, xs: 1 },
                        React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                            React.createElement(AccessTime, null))),
                    React.createElement(Grid, { item: true, xs: 11 },
                        React.createElement(Typography, { variant: 'body1' },
                            moment.utc((_b = popup === null || popup === void 0 ? void 0 : popup.item) === null || _b === void 0 ? void 0 : _b.start).format('HH:mm'),
                            " -",
                            ' ',
                            moment.utc((_c = popup === null || popup === void 0 ? void 0 : popup.item) === null || _c === void 0 ? void 0 : _c.end).format('HH:mm'),
                            " |",
                            ' ', (_e = (_d = popup === null || popup === void 0 ? void 0 : popup.item) === null || _d === void 0 ? void 0 : _d[`${PREFIX}Atividade`]) === null || _e === void 0 ? void 0 :
                            _e[`${PREFIX}nome`],
                            " -",
                            ' ', (_g = (_f = popup === null || popup === void 0 ? void 0 : popup.item) === null || _f === void 0 ? void 0 : _f[`${PREFIX}Turma`]) === null || _g === void 0 ? void 0 :
                            _g[`${PREFIX}nome`]))),
                ((_h = popup === null || popup === void 0 ? void 0 : popup.item) === null || _h === void 0 ? void 0 : _h.hasConflict) ? (React.createElement(TitleResource, null, "Conflitos")) : null,
                React.createElement(Grid, { container: true, style: { maxHeight: '15rem', overflow: 'auto' } }, (_k = (_j = popup === null || popup === void 0 ? void 0 : popup.item) === null || _j === void 0 ? void 0 : _j.conflicts) === null || _k === void 0 ? void 0 : _k.map((item) => {
                    var _a, _b, _c;
                    return (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: 1 },
                            React.createElement(Box, { width: '100%', justifyContent: 'center', alignItems: 'center' },
                                React.createElement(Error, { style: { color: '#a71111' } }))),
                        React.createElement(Grid, { item: true, xs: 11 },
                            React.createElement(Typography, { variant: 'body1' }, (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`])),
                        React.createElement("ul", null,
                            React.createElement("li", null,
                                moment.utc(item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`]).format('HH:mm'),
                                " -",
                                ' ',
                                moment.utc(item === null || item === void 0 ? void 0 : item[`${PREFIX}fim`]).format('HH:mm'),
                                " |",
                                ' ', (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Turma`]) === null || _b === void 0 ? void 0 :
                                _b[`${PREFIX}nome`],
                                " -",
                                ' ', (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Programa`]) === null || _c === void 0 ? void 0 :
                                _c[`${PREFIX}titulo`]))));
                }))))));
};
export default Calendar;
//# sourceMappingURL=index.js.map