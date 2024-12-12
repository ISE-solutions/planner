var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Page from '~/components/Page';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { getAcademicRequestsByTeamId, getActivities, getActivityByProgramId, getActivityByTeamId, } from '~/store/modules/activity/actions';
import { ReactGridContainer } from './styles';
import { Box, Button, Typography, AppBar, Tabs, Tab, CircularProgress, Tooltip, IconButton, } from '@material-ui/core';
import { getSchedules } from '~/store/modules/schedule/actions';
import { getTeamById } from '~/store/modules/team/actions';
import * as moment from 'moment';
import useBatchEdition from './useBatchEdition';
import { executeBatchEdition } from '~/store/modules/batchEdition/actions';
import TableTeam from './components/TableTeam';
import TableSchedule from './components/TableSchedule';
import TableActivity from './components/TableActivity';
import TableActivityName from './components/TableActivityName';
import TableActivityDocuments from './components/TableActivityDocuments';
import TableActivityRequestAcademic from './components/TableActivityRequestAcademic';
import TableActivityEnvolvedPeople from './components/TableActivityEnvolvedPeople';
import { useNotification } from '~/hooks';
import { Backdrop } from '~/components';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication } from '~/config/enums';
import momentToMinutes from '~/utils/momentToMinutes';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { Replay } from '@material-ui/icons';
function TabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    return (React.createElement("div", Object.assign({ role: 'tabpanel', hidden: value !== index, id: `full-width-tabpanel-${index}`, "aria-labelledby": `full-width-tab-${index}` }, other), value === index && (React.createElement(Box, { p: 3 },
        React.createElement(Typography, null, children)))));
}
function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
const BatchEditionPage = ({ context }) => {
    const [team, setTeam] = React.useState([]);
    const [planningActivities, setPlanningActivities] = React.useState([]);
    const [tab, setTab] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const refFirstRender = React.useRef(true);
    const refFirstInitData = React.useRef(true);
    const queryParameters = new URLSearchParams(window.location.search);
    const teamIdParam = queryParameters.get('teamid');
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { tag, person, space, finiteInfiniteResource } = useSelector((state) => state);
    const { dictTag, tags } = tag;
    const { dictPeople, persons } = person;
    const { dictSpace, spaces } = space;
    const { finiteInfiniteResources } = finiteInfiniteResource;
    const { buildInitDate, temperatureOptions, modalityOptions, modalityDayOptions, moduleOptions, areaOptions, courseOptions, functionOptions, useOptions, useParticipantsOptions, equipmentsOptions, finiteResources, infiniteResources, } = useBatchEdition({ tags, finiteInfiniteResources });
    React.useEffect(() => {
        setLoading(true);
        const firstRender = refFirstRender.current;
        if (firstRender) {
            refFirstRender.current = false;
        }
        getActivities({
            active: 'Ativo',
            typeApplication: EActivityTypeApplication.PLANEJAMENTO,
        }).then((data) => setPlanningActivities(data));
    }, []);
    React.useEffect(() => {
        if (teamIdParam && tags.length && spaces.length && persons.length && refFirstInitData.current) {
            getActivityByProgramId(teamIdParam);
            Promise.all([
                getTeamById(teamIdParam),
                getSchedules({ teamId: teamIdParam, active: 'Ativo' }),
                getActivityByTeamId(teamIdParam),
                getAcademicRequestsByTeamId(teamIdParam),
            ])
                .then(([teamSaved, schedules, activities, requestsAcademic]) => {
                buildInitDate({
                    dictTag,
                    setTeam,
                    reset,
                    dictPeople,
                    dictSpace,
                    teamSaved: teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved.value[0],
                    schedules: schedules,
                    activities: activities === null || activities === void 0 ? void 0 : activities.value,
                    requestsAcademic: requestsAcademic,
                });
                setLoading(false);
                refFirstInitData.current = false;
            })
                .catch((error) => {
                setLoading(false);
                notification.error({
                    title: 'Falha',
                    description: 'Houve um erro interno!',
                });
            });
        }
    }, [teamIdParam, tags, spaces, persons]);
    React.useEffect(() => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
    }, []);
    const { control, handleSubmit, setValue, formState: { errors }, reset, watch, getValues, } = useForm({
        mode: 'onChange',
        defaultValues: { team: [], schedules: [], activities: [] },
    });
    const getDates = (item) => {
        var _a, _b, _c;
        const dateRef = (_a = item === null || item === void 0 ? void 0 : item.startDate) === null || _a === void 0 ? void 0 : _a.clone().format('YYYY-MM-DD');
        const startTime = (_b = item === null || item === void 0 ? void 0 : item.startTime) === null || _b === void 0 ? void 0 : _b.clone().format('HH:mm');
        const startDate = moment(`${dateRef} ${startTime}`);
        const momentDuration = (_c = item === null || item === void 0 ? void 0 : item.duration) === null || _c === void 0 ? void 0 : _c.clone();
        const minutes = momentToMinutes(momentDuration);
        return {
            startDate: startDate.format(),
            endDate: startDate.clone().add(minutes, 'minutes').format(),
        };
    };
    const onSubmit = (values) => {
        var _a, _b;
        setLoading(true);
        const acts = (_a = values.activities) === null || _a === void 0 ? void 0 : _a.map((act) => {
            var _a;
            const spacesToDelete = (_a = act === null || act === void 0 ? void 0 : act.pastSpaces) === null || _a === void 0 ? void 0 : _a.filter((e) => { var _a; return !((_a = act.spaces) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}espacoid`])); });
            return Object.assign(Object.assign(Object.assign({}, act), getDates(act)), { spacesToDelete });
        });
        const scls = (_b = values.schedules) === null || _b === void 0 ? void 0 : _b.filter((sc) => !sc.blocked && !!(sc === null || sc === void 0 ? void 0 : sc.id));
        dispatch(executeBatchEdition({
            teams: values.team,
            schedules: scls,
            activities: acts,
        }, {
            onSuccess: () => {
                setLoading(false);
                notification.success({
                    title: 'Sucesso',
                    description: 'Cadastro realizado com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const handleScheduleDateChange = (newValue, id) => {
        var _a;
        const i = watch('schedules').findIndex((sc) => sc.id === id);
        setValue(`schedules.${i}.date`, newValue);
        (_a = watch('activities')) === null || _a === void 0 ? void 0 : _a.forEach((elm, i) => {
            const currentStartDate = elm.startDate;
            const currentEndDate = elm.endDate;
            if ((elm === null || elm === void 0 ? void 0 : elm.scheduleId) === id) {
                setValue(`activities.${i}.startDate`, moment(`${newValue.format('YYYY-MM-DD')}T${currentStartDate.format('HH:mm')}`));
                setValue(`activities.${i}.endDate`, moment(`${newValue.format('YYYY-MM-DD')}T${currentEndDate.format('HH:mm')}`));
                setValue(`activities.${i}.date`, newValue.format('DD/MM/YYYY'));
            }
        });
    };
    const handleUpdateData = () => {
        dispatch(fetchAllSpace({}));
        dispatch(fetchAllFiniteInfiniteResources({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllPerson({}));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(Page, { noPadding: true, blockOverflow: false, context: context, itemsBreadcrumbs: [
                { name: 'Edição em massa', page: 'Edição em massa' },
            ] },
            React.createElement(ReactGridContainer, null,
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleSubmit(onSubmit) }, "Salvar"),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                React.createElement(Box, { marginTop: '2rem' },
                    React.createElement(AppBar, { position: 'static', color: 'default' },
                        React.createElement(Tabs, { value: tab, onChange: (event, newValue) => {
                                setTab(newValue);
                            }, indicatorColor: 'primary', textColor: 'primary', variant: 'fullWidth', "aria-label": 'full width tabs example' },
                            React.createElement(Tab, Object.assign({ label: 'Turma' }, a11yProps(0))),
                            React.createElement(Tab, Object.assign({ label: 'Dias de aula' }, a11yProps(1))),
                            React.createElement(Tab, Object.assign({ label: 'Atividades' }, a11yProps(2))),
                            React.createElement(Tab, Object.assign({ label: 'Pessoas Envolvidas' }, a11yProps(3))),
                            React.createElement(Tab, Object.assign({ label: 'Nome Fantasia' }, a11yProps(4))),
                            React.createElement(Tab, Object.assign({ label: 'Documentos' }, a11yProps(5))),
                            React.createElement(Tab, Object.assign({ label: 'Requisi\u00E7\u00E3o Acad\u00EAmica' }, a11yProps(6))))),
                    React.createElement(TabPanel, { value: tab, index: 0 },
                        React.createElement(TableTeam, { team: team, control: control, setValue: setValue, modalityOptions: modalityOptions, temperatureOptions: temperatureOptions, persons: persons, functionOptions: functionOptions, useOptions: useOptions, useParticipantsOptions: useParticipantsOptions })),
                    React.createElement(TabPanel, { value: tab, index: 1 },
                        React.createElement(TableSchedule, { control: control, setValue: setValue, values: watch('schedules'), handleScheduleDateChange: handleScheduleDateChange, modalityDayOptions: modalityDayOptions, moduleOptions: moduleOptions, temperatureOptions: temperatureOptions, persons: persons, functionOptions: functionOptions })),
                    React.createElement(TabPanel, { value: tab, index: 2 },
                        React.createElement(TableActivity, { control: control, values: watch('activities'), setValue: setValue, planningActivities: planningActivities, temperatureOptions: temperatureOptions, areaOptions: areaOptions, courseOptions: courseOptions, spaces: spaces })),
                    React.createElement(TabPanel, { value: tab, index: 3 },
                        React.createElement(TableActivityEnvolvedPeople, { values: watch('activities'), functionOptions: functionOptions, persons: persons, control: control, setValue: setValue })),
                    React.createElement(TabPanel, { value: tab, index: 4 },
                        React.createElement(TableActivityName, { values: watch('activities'), control: control, setValue: setValue, useOptions: useOptions })),
                    React.createElement(TabPanel, { value: tab, index: 5 },
                        React.createElement(TableActivityDocuments, { values: watch('activities'), control: control, setValue: setValue })),
                    React.createElement(TabPanel, { value: tab, index: 6 },
                        React.createElement(TableActivityRequestAcademic, { values: watch('activities'), control: control, setValue: setValue, equipmentsOptions: equipmentsOptions, finiteResources: finiteResources, infiniteResources: infiniteResources })))))));
};
export default BatchEditionPage;
//# sourceMappingURL=BatchEditionPage.js.map