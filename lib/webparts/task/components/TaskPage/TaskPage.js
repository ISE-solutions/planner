import * as React from 'react';
import { Page, Table, AddTask } from '~/components';
import CreateHeader from '~/components/CreateHeader';
import AddCustomFilter from '~/components/AddCustomFilter';
import { Badge, Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, FilterList, Info } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks } from '~/store/modules/task/actions';
import { EFatherTag, ETYPE_CUSTOM_FILTER, PRIORITY_TASK, STATUS_TASK, } from '~/config/enums';
import { getTeamByIds } from '~/store/modules/team/actions';
import { getProgramByIds } from '~/store/modules/program/actions';
import { TYPE_ACTIVITY } from '~/config/enums';
import Filter from './Filter';
import FastFilter from './FastFilter';
import { fetchAllCustomFilter } from '~/store/modules/customFilter/actions';
const TaskPage = ({ context }) => {
    const dispatch = useDispatch();
    const [form, setForm] = React.useState({ open: false });
    const [taksRender, setTasksRender] = React.useState([]);
    const [openFilter, setOpenFilter] = React.useState(false);
    const [filterSelected, setFilterSelected] = React.useState();
    const [openAddCustomFilter, setOpenAddCustomFilter] = React.useState(false);
    const [filterEdit, setFilterEdit] = React.useState(null);
    const { currentUser } = useLoggedUser();
    const { task, tag } = useSelector((state) => state);
    const { dictTag } = tag;
    const { tasks } = task;
    React.useEffect(() => {
        if (currentUser) {
            formik.setFieldValue('responsible', [currentUser]);
            formik.handleSubmit();
            refetchFilter();
        }
    }, [currentUser]);
    React.useEffect(() => {
        if (tasks.length) {
            const teamIds = new Set();
            const programIds = new Set();
            tasks.forEach((ta) => {
                var _a, _b;
                const teamId = (_a = ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Turma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}turmaid`];
                const programId = (_b = ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Programa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}programaid`];
                if (teamId && !teamIds.has(teamId)) {
                    teamIds.add(teamId);
                }
                if (programId && !programIds.has(programId)) {
                    programIds.add(programId);
                }
            });
            Promise.all([
                getTeamByIds(Array.from(teamIds)),
                getProgramByIds(Array.from(programIds)),
            ]).then(([teams, programs]) => {
                const dictTeam = new Map(teams.map((te) => [te === null || te === void 0 ? void 0 : te[`${PREFIX}turmaid`], te]));
                const dictProgram = new Map(programs.map((pr) => [pr === null || pr === void 0 ? void 0 : pr[`${PREFIX}programaid`], pr]));
                const newTasks = tasks.map((atv) => {
                    var _a, _b;
                    return (Object.assign(Object.assign({}, atv), { team: dictTeam.get((_a = atv === null || atv === void 0 ? void 0 : atv[`${PREFIX}Turma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}turmaid`]), program: dictProgram.get((_b = atv === null || atv === void 0 ? void 0 : atv[`${PREFIX}Programa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}programaid`]) }));
                });
                setTasksRender(_.cloneDeep(newTasks));
            });
        }
        else {
            setTasksRender([]);
        }
    }, [tasks]);
    const formik = useFormik({
        initialValues: {
            institute: [],
            company: [],
            typeProgram: [],
            programTemperature: [],
            teamYearConclusion: '',
            teamSigla: '',
            teamName: '',
            teamTemperature: [],
            delivery: '',
            status: [
                {
                    value: STATUS_TASK['Em Andamento'],
                    label: STATUS_TASK[STATUS_TASK['Em Andamento']],
                },
                {
                    value: STATUS_TASK['Não Iniciada'],
                    label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
                },
            ],
            responsible: [],
            start: null,
            end: null,
            endForecastConclusion: '',
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            refetch();
            setOpenFilter(false);
        },
    });
    const columns = [
        {
            name: `${PREFIX}id`,
            label: 'Id',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `createdon`,
            label: 'Data de Criação',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `forecastConclusion`,
            label: 'Previsão de Conclusão',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `concludedDay`,
            label: 'Data de Conclusão',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}nome`,
            label: 'Título',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}Entrega.${PREFIX}titulo`,
            label: 'Entrega',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `status`,
            label: 'Status',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `priority`,
            label: 'Prioridade',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}tipo`,
            label: 'Tipo',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}Grupo.${PREFIX}nome`,
            label: 'Grupo Responsável',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `people`,
            label: 'Pessoa Responsável',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `nameProgram`,
            label: 'Programa',
        },
        {
            name: `${PREFIX}Turma.${PREFIX}nome`,
            label: 'Turma',
        },
        {
            name: 'actions',
            label: 'Ações',
            options: {
                filter: false,
                sort: false,
                setCellHeaderProps: () => ({ align: 'center' }),
                setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
            },
        },
    ];
    const formatFilter = () => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const ftr = {
            instituteId: (_b = (_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.institute) === null || _b === void 0 ? void 0 : _b.map((e) => e === null || e === void 0 ? void 0 : e.value),
            companyId: (_d = (_c = formik === null || formik === void 0 ? void 0 : formik.values) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.map((e) => e === null || e === void 0 ? void 0 : e.value),
            typeProgramId: (_f = (_e = formik === null || formik === void 0 ? void 0 : formik.values) === null || _e === void 0 ? void 0 : _e.typeProgram) === null || _f === void 0 ? void 0 : _f.map((e) => e === null || e === void 0 ? void 0 : e.value),
            programTemperatureId: (_h = (_g = formik === null || formik === void 0 ? void 0 : formik.values) === null || _g === void 0 ? void 0 : _g.programTemperature) === null || _h === void 0 ? void 0 : _h.map((e) => e === null || e === void 0 ? void 0 : e.value),
            teamYearConclusion: (_j = formik === null || formik === void 0 ? void 0 : formik.values) === null || _j === void 0 ? void 0 : _j.teamYearConclusion,
            teamSigla: (_k = formik === null || formik === void 0 ? void 0 : formik.values) === null || _k === void 0 ? void 0 : _k.teamSigla,
            teamName: (_l = formik === null || formik === void 0 ? void 0 : formik.values) === null || _l === void 0 ? void 0 : _l.teamName,
            teamTemperatureId: (_o = (_m = formik === null || formik === void 0 ? void 0 : formik.values) === null || _m === void 0 ? void 0 : _m.teamTemperature) === null || _o === void 0 ? void 0 : _o.map((e) => e === null || e === void 0 ? void 0 : e.value),
            delivery: (_p = formik === null || formik === void 0 ? void 0 : formik.values) === null || _p === void 0 ? void 0 : _p.delivery,
            status: (_r = (_q = formik === null || formik === void 0 ? void 0 : formik.values) === null || _q === void 0 ? void 0 : _q.status) === null || _r === void 0 ? void 0 : _r.map((e) => e === null || e === void 0 ? void 0 : e.value),
            responsible: (_t = (_s = formik === null || formik === void 0 ? void 0 : formik.values) === null || _s === void 0 ? void 0 : _s.responsible) === null || _t === void 0 ? void 0 : _t.map((e) => e === null || e === void 0 ? void 0 : e.value),
            endForecastConclusion: (_u = formik === null || formik === void 0 ? void 0 : formik.values) === null || _u === void 0 ? void 0 : _u.endForecastConclusion,
            start: ((_v = formik === null || formik === void 0 ? void 0 : formik.values) === null || _v === void 0 ? void 0 : _v.start) &&
                ((_w = formik === null || formik === void 0 ? void 0 : formik.values) === null || _w === void 0 ? void 0 : _w.start.startOf('day').format('YYYY-MM-DD HH:mm:ss')),
            end: ((_x = formik === null || formik === void 0 ? void 0 : formik.values) === null || _x === void 0 ? void 0 : _x.end) &&
                ((_y = formik === null || formik === void 0 ? void 0 : formik.values) === null || _y === void 0 ? void 0 : _y.end.endOf('day').format('YYYY-MM-DD HH:mm:ss')),
        };
        return _.omitBy(ftr, _.isNil);
    };
    const refetch = () => {
        dispatch(fetchAllTasks(formatFilter()));
    };
    const refetchFilter = () => {
        dispatch(fetchAllCustomFilter({
            active: 'Ativo',
            published: true,
            me: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
        }));
    };
    const handleAddFilter = () => {
        setFilterEdit(null);
        setOpenAddCustomFilter(true);
    };
    const handleOverwriteFilter = () => {
        setFilterEdit(filterSelected);
        setOpenAddCustomFilter(true);
    };
    const handleDetail = (item) => {
        setForm({
            open: true,
            item,
        });
    };
    const customToolbar = () => (React.createElement(Tooltip, { disableFocusListener: true, arrow: true, title: 'Filtro' },
        React.createElement(IconButton, { onClick: () => setOpenFilter(true) },
            React.createElement(Badge, { color: 'primary' },
                React.createElement(FilterList, null)))));
    const tableOptions = {
        // rowsPerPage: filter.rowsPerPage,
        enableNestedDataAccess: '.',
        tableBodyHeight: 'calc(100vh - 470px)',
        selectableRows: 'none',
        tableLayout: 'auto',
        download: false,
        print: false,
        filter: false,
        customToolbar,
    };
    const data = React.useMemo(() => {
        if (Object.keys(dictTag).length && taksRender.length && currentUser) {
            let tasksFiltered = [];
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) {
                tasksFiltered = taksRender;
            }
            else {
                tasksFiltered = taksRender === null || taksRender === void 0 ? void 0 : taksRender.filter((ta) => {
                    var _a, _b, _c, _d, _e, _f;
                    const isPersonResponsible = (_a = ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}tarefas_responsaveis_ise_pessoa`]) === null || _a === void 0 ? void 0 : _a.some((tape) => (tape === null || tape === void 0 ? void 0 : tape[`${PREFIX}pessoaid`]) === (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]));
                    const isGroupResponsible = (ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Grupo`]) &&
                        ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.some((peti) => {
                            var _a;
                            return (peti === null || peti === void 0 ? void 0 : peti[`${PREFIX}etiquetaid`]) ===
                                ((_a = ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Grupo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                        }));
                    const isProgramResponsible = (_c = ta.program) === null || _c === void 0 ? void 0 : _c[`${PREFIX}Programa_PessoasEnvolvidas`].some((pape) => {
                        const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}funcao_value`]];
                        return ((pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}pessoa_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                            (func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.RESPONSAVEL_PELO_PROGRAMA);
                    });
                    if (isProgramResponsible) {
                        return true;
                    }
                    const isProgramDirectorOrCoordinator = (_d = ta.team) === null || _d === void 0 ? void 0 : _d[`${PREFIX}Turma_PessoasEnvolvidasTurma`].some((pape) => {
                        const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}funcao_value`]];
                        return ((pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}pessoa_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                            ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA ||
                                (func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES));
                    });
                    if (isProgramDirectorOrCoordinator) {
                        return true;
                    }
                    const isAcademicDirectorOrAcademicCoordinator = (_e = ta.team) === null || _e === void 0 ? void 0 : _e[`${PREFIX}Turma_PessoasEnvolvidasTurma`].some((pape) => {
                        const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}funcao_value`]];
                        return (((pape === null || pape === void 0 ? void 0 : pape[`_${PREFIX}pessoa_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                            ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO ||
                                (func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) ===
                                    EFatherTag.COORDENACAO_ACADEMICA)) ||
                            isPersonResponsible ||
                            isGroupResponsible);
                    });
                    if (isAcademicDirectorOrAcademicCoordinator) {
                        return (((ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Atividade`]) &&
                            ((_f = ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}Atividade`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.ACADEMICA) ||
                            isPersonResponsible ||
                            isGroupResponsible);
                    }
                    return isPersonResponsible || isGroupResponsible;
                });
            }
            return tasksFiltered === null || tasksFiltered === void 0 ? void 0 : tasksFiltered.map((tsk) => {
                var _a, _b;
                const nameProgram = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}Programa`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}nomeprograma_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
                return Object.assign(Object.assign({}, tsk), { nameProgram, status: STATUS_TASK === null || STATUS_TASK === void 0 ? void 0 : STATUS_TASK[tsk.statuscode], priority: PRIORITY_TASK === null || PRIORITY_TASK === void 0 ? void 0 : PRIORITY_TASK[tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}prioridade`]], people: tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}tarefas_responsaveis_ise_pessoa`].map((p) => p === null || p === void 0 ? void 0 : p[`${PREFIX}nomecompleto`]).join(', '), createdon: moment(tsk.createdon).format('DD/MM/YYYY HH:mm'), concludedDay: (tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}dataconclusao`])
                        ? moment(tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}dataconclusao`]).format('DD/MM/YYYY HH:mm')
                        : '-', forecastConclusion: (tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}previsaodeconclusao`])
                        ? moment(tsk === null || tsk === void 0 ? void 0 : tsk[`${PREFIX}previsaodeconclusao`]).format('DD/MM/YYYY HH:mm')
                        : '-', actions: (React.createElement(Grid, null,
                        React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                            React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(tsk) },
                                React.createElement(Info, null))))) });
            });
        }
    }, [taksRender, dictTag, currentUser]);
    return (React.createElement(Page, { blockOverflow: false, context: context, itemsBreadcrumbs: [{ name: 'Tarefa', page: 'Tarefas' }] },
        React.createElement(Filter, { open: openFilter, filterSelected: filterSelected, setFilterSelected: setFilterSelected, refetch: refetch, onAddCustomFilter: handleAddFilter, onOvewriteFilter: handleOverwriteFilter, onClose: () => setOpenFilter(false), formik: formik }),
        React.createElement(CreateHeader, { title: 'Tarefas', action: React.createElement(React.Fragment, null, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) && (React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Tarefa"))) }),
        React.createElement(Table, { title: React.createElement(FastFilter, { formik: formik }), columns: columns, data: data, options: tableOptions }),
        React.createElement(AddTask, { open: form.open, task: form.item, refetch: refetch, handleClose: () => setForm({ open: false }) }),
        React.createElement(AddCustomFilter, { open: openAddCustomFilter, filter: formik.values, filterSaved: filterEdit, type: ETYPE_CUSTOM_FILTER.TASK, refetch: refetchFilter, onClose: () => setOpenAddCustomFilter(false) })));
};
export default TaskPage;
//# sourceMappingURL=TaskPage.js.map