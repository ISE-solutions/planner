var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, FormControl, FormHelperText, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { v4 } from 'uuid';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import Classroom from './Classroom';
import Documents from './Documents';
import AcademicRequest from './AcademicRequest';
import { PERSON, PREFIX } from '~/config/database';
import * as moment from 'moment';
import { EFatherTag, TYPE_ACTIVITY, TYPE_RESOURCE } from '~/config/enums';
import { useConfirmation, useContextWebpart, useNotification } from '~/hooks';
import checkPermitionByTag from '~/utils/checkPermitionByTag';
import { AccessTime, CheckCircle, Close, Publish, Replay, Visibility, VisibilityOff, } from '@material-ui/icons';
import * as _ from 'lodash';
import { BoxCloseIcon } from '~/components/AddTeam/styles';
import { batchUpdateActivity, getAcademicRequestsByActivityId, getActivity, getActivityPermitions, updateActivity, updateActivityAll, } from '~/store/modules/activity/actions';
import { useDispatch, useSelector } from 'react-redux';
import LoadModel from './LoadModel';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { batchAddNotification } from '~/store/modules/notification/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';
const ActivityForm = ({ activity, team, program, isDraft, isModel, maxHeight, noPadding, headerInfo, forceUpdate, isModelReference, isDrawer, undoNextActivities, isProgramResponsible, academicDirector, refetch, setActivity, throwToApprove, handleClose, onSave, }) => {
    var _a, _b, _c;
    const DEFAULT_VALUES = {
        title: '',
        name: '',
        type: '',
        startTime: null,
        duration: moment('00:05', 'HH:mm'),
        endTime: null,
        quantity: 0,
        theme: '',
        description: '',
        observation: '',
        area: null,
        spaces: [],
        academicRequests: [],
        documents: [],
        temperature: null,
        names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
        people: [{ keyId: v4(), person: null, function: null }],
    };
    const [isDetail, setIsDetail] = React.useState(Boolean(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]));
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [detailLoading, setDetailLoading] = React.useState(false);
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [valuesSetted, setValuesSetted] = React.useState(false);
    const [openLoad, setOpenLoad] = React.useState(false);
    const [editLoading, setEditLoading] = React.useState(false);
    const [documentChanged, setDocumentChanged] = React.useState(false);
    const [academicChanged, setAcademicChanged] = React.useState(false);
    const [loadingApproval, setLoadingApproval] = React.useState({});
    const [tagsShared, setTagsShared] = React.useState([]);
    const [academicRequests, setAcademicRequests] = React.useState([]);
    const firstRender = React.useRef(false);
    const dispatch = useDispatch();
    const { context } = useContextWebpart();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const { tag, space, person, app } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { spaces, dictSpace } = space;
    const { persons, dictPeople } = person;
    const { tooltips } = app;
    const currentUser = React.useMemo(() => {
        var _a, _b;
        if ((persons === null || persons === void 0 ? void 0 : persons.length) && activity) {
            const myEmail = context.pageContext.user.email || context.pageContext.user.loginName;
            const people = persons === null || persons === void 0 ? void 0 : persons.find((pe) => {
                var _a;
                return ((_a = pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}email`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) ===
                    (myEmail === null || myEmail === void 0 ? void 0 : myEmail.toLocaleLowerCase());
            });
            const teacherEnvolved = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((e) => {
                const tag = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]];
                return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) === EFatherTag.PROFESSOR;
            });
            const teacher = dictPeople[teacherEnvolved === null || teacherEnvolved === void 0 ? void 0 : teacherEnvolved[`_${PREFIX}pessoa_value`]];
            return Object.assign(Object.assign({}, people), { isTeacher: (teacher === null || teacher === void 0 ? void 0 : teacher[`${PREFIX}email`]) === (people === null || people === void 0 ? void 0 : people[`${PREFIX}email`]) &&
                    !!(teacherEnvolved === null || teacherEnvolved === void 0 ? void 0 : teacherEnvolved[`_${PREFIX}aprovadopor_value`]), isAcademicDirector: (academicDirector === null || academicDirector === void 0 ? void 0 : academicDirector[`${PREFIX}email`]) === myEmail, isAreaChief: (_b = people === null || people === void 0 ? void 0 : people[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _b === void 0 ? void 0 : _b.some((are) => {
                    var _a;
                    return (are === null || are === void 0 ? void 0 : are[`${PREFIX}etiquetaid`]) ===
                        ((_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                }), isPlanning: checkPermitionByTag(tags, people === null || people === void 0 ? void 0 : people[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], EFatherTag.PLANEJAMENTO) });
        }
    }, [persons, activity]);
    const validationSchema = yup.object({
        duration: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            name: 'durationValid',
            message: 'Formato inválido',
            test: (v) => v === null || v === void 0 ? void 0 : v.isValid(),
        }),
        startTime: yup.mixed().required('Campo Obrigatório'),
    });
    const validationSchemaModel = yup.object({
        duration: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            name: 'durationValid',
            message: 'Formato inválido',
            test: (v) => v === null || v === void 0 ? void 0 : v.isValid(),
        }),
        title: yup.mixed().required('Campo Obrigatório'),
        startTime: yup.mixed().required('Campo Obrigatório'),
    });
    const programDirector = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA);
    const coordination = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES);
    const academicDirectorLocal = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO);
    React.useEffect(() => {
        if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) && !firstRender.current) {
            firstRender.current = true;
            getAcademicRequestsByActivityId(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]).then((data) => setAcademicRequests(data));
        }
    }, [activity]);
    React.useEffect(() => {
        const handleBeforeUnload = (event) => {
            handleResetEditing();
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    React.useEffect(() => {
        if (academicRequests === null || academicRequests === void 0 ? void 0 : academicRequests.length) {
            const newAcademicRequests = academicRequests === null || academicRequests === void 0 ? void 0 : academicRequests.map((request) => {
                var _a, _b, _c, _d, _e;
                const peopleRequest = (_a = activity[`${PREFIX}PessoasRequisica_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((pe) => (pe === null || pe === void 0 ? void 0 : pe[`_${PREFIX}requisicao_pessoasenvolvidas_value`]) ===
                    (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
                return {
                    keyId: v4(),
                    equipments: ((_b = request[`${PREFIX}Equipamentos`]) === null || _b === void 0 ? void 0 : _b.length)
                        ? (_c = request[`${PREFIX}Equipamentos`]) === null || _c === void 0 ? void 0 : _c.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                        : [],
                    finiteResource: (_d = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _d === void 0 ? void 0 : _d.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO),
                    infiniteResource: (_e = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _e === void 0 ? void 0 : _e.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO),
                    id: request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`],
                    description: request === null || request === void 0 ? void 0 : request[`${PREFIX}descricao`],
                    deadline: request === null || request === void 0 ? void 0 : request[`${PREFIX}prazominimo`],
                    observation: request === null || request === void 0 ? void 0 : request[`${PREFIX}observacao`],
                    other: request === null || request === void 0 ? void 0 : request[`${PREFIX}outro`],
                    delivery: request === null || request === void 0 ? void 0 : request[`${PREFIX}momentoentrega`],
                    link: request === null || request === void 0 ? void 0 : request[`${PREFIX}link`],
                    nomemoodle: request === null || request === void 0 ? void 0 : request[`${PREFIX}nomemoodle`],
                    deliveryDate: (request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                        ? moment(request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                        : null,
                    people: (peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.length)
                        ? peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.map((e) => {
                            var _a;
                            let func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                            func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                            return {
                                keyId: v4(),
                                id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                                person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                                function: func,
                            };
                        })
                        : [
                            {
                                keyId: v4(),
                                person: null,
                                function: null,
                            },
                        ],
                };
            });
            setInitialValues(Object.assign(Object.assign({}, initialValues), { academicRequests: newAcademicRequests }));
            setPastValues(Object.assign(Object.assign({}, pastValues), { academicRequests: newAcademicRequests }));
        }
    }, [academicRequests]);
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        if (activity &&
            dictTag &&
            dictPeople &&
            (!valuesSetted || isModelReference || forceUpdate)) {
            const iniVal = {
                id: activity[`${PREFIX}atividadeid`],
                title: activity[`${PREFIX}titulo`] || '',
                name: activity[`${PREFIX}nome`] || '',
                startDate: moment(activity[`${PREFIX}datahorainicio`]),
                endDate: moment(activity[`${PREFIX}datahorafim`]),
                startTime: (activity[`${PREFIX}inicio`] &&
                    moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
                    null,
                duration: (activity[`${PREFIX}duracao`] &&
                    moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
                    null,
                endTime: (activity[`${PREFIX}fim`] &&
                    moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
                    null,
                quantity: activity[`${PREFIX}quantidadesessao`] || 0,
                typeApplication: activity[`${PREFIX}tipoaplicacao`],
                type: activity[`${PREFIX}tipo`],
                theme: activity[`${PREFIX}temaaula`] || '',
                description: activity[`${PREFIX}descricaoobjetivo`] || '',
                observation: activity[`${PREFIX}observacao`] || '',
                documents: (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.map((document) => ({
                    keyId: v4(),
                    id: document === null || document === void 0 ? void 0 : document[`${PREFIX}documentosatividadeid`],
                    name: document === null || document === void 0 ? void 0 : document[`${PREFIX}nome`],
                    link: document === null || document === void 0 ? void 0 : document[`${PREFIX}link`],
                    font: document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`],
                    delivery: document === null || document === void 0 ? void 0 : document[`${PREFIX}entrega`],
                })),
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) || null,
                lastTemperature: (_c = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Temperatura`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`],
                academicRequests: [],
                area: activity[`${PREFIX}AreaAcademica`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}AreaAcademica`]), { value: (_d = activity[`${PREFIX}AreaAcademica`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`], label: (_e = activity[`${PREFIX}AreaAcademica`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nome`] }) : null,
                course: activity[`${PREFIX}Curso`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}Curso`]), { value: (_f = activity[`${PREFIX}Curso`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`], label: (_g = activity[`${PREFIX}Curso`]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}nome`] }) : null,
                spaces: ((_h = activity[`${PREFIX}Atividade_Espaco`]) === null || _h === void 0 ? void 0 : _h.length)
                    ? (_j = activity[`${PREFIX}Atividade_Espaco`]) === null || _j === void 0 ? void 0 : _j.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                    : [],
                names: ((_k = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _k === void 0 ? void 0 : _k.length)
                    ? (_l = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _l === void 0 ? void 0 : _l.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}nomeatividadeid`],
                        name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                        nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                        nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                        use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                    }))
                    : [
                        {
                            keyId: v4(),
                            name: '',
                            nameEn: '',
                            nameEs: '',
                            use: '',
                        },
                    ],
                people: ((_m = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _m === void 0 ? void 0 : _m.length)
                    ? (_o = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _o === void 0 ? void 0 : _o.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func });
                    })
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ],
            };
            setInitialValues(iniVal);
            setPastValues(iniVal);
            setValuesSetted(true);
        }
        if ((activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) ===
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
            setIsDetail(false);
        }
    }, [activity, dictTag, dictPeople]);
    React.useEffect(() => {
        if (!firstRender.current) {
            setIsDetail(Boolean(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]));
        }
        if (activity && isModelReference && (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
            getActivityPermitions(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]).then(({ value }) => {
                firstRender.current = true;
                const actv = value[0];
                setTagsShared(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Compartilhamento`]);
            });
        }
    }, [activity]);
    const getDates = (item) => {
        const dateRef = moment
            .utc(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`])
            .format('YYYY-MM-DD');
        let startTime = item.startTime.format('HH:mm');
        const startDate = moment(`${dateRef} ${startTime}`);
        const duration = item.duration.hour() * 60 + item.duration.minute();
        return {
            startDate: startDate.format(),
            endDate: startDate.clone().add(duration, 'minutes').format(),
            [`${PREFIX}datahorainicio`]: startDate.format(),
            [`${PREFIX}datahorafim`]: startDate
                .clone()
                .add(duration, 'minutes')
                .format(),
        };
    };
    const handleUndo = () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const activityUndo = JSON.parse(localStorage.getItem('undoActivity'));
        const [newActivityRequest, newRequestAcademic] = yield Promise.all([
            getActivity(activityUndo.id),
            getAcademicRequestsByActivityId(activityUndo.id),
        ]);
        const newActivity = newActivityRequest.value[0];
        const peopleToDelete = [];
        const spaceToDelete = [];
        const namesToDelete = [];
        const documentsToDelete = [];
        const requestAcademicToDelete = [];
        (_d = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_Espaco`]) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const spaceSaved = (_a = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.spaces) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}espacoid`]) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]));
            if (!spaceSaved) {
                spaceToDelete.push(e);
            }
        });
        (_e = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.people) === null || _e === void 0 ? void 0 : _e.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasatividadeid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_f = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.people) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidasatividadeid`]));
            if (envolvedSaved) {
                peopleToDelete.push(envolvedSaved);
            }
            else {
                const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                peopleToDelete.push(Object.assign(Object.assign({}, e), { keyId: v4(), deleted: true, isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func }));
            }
        });
        (_g = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.people) === null || _g === void 0 ? void 0 : _g.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasatividadeid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_h = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_NomeAtividade`]) === null || _h === void 0 ? void 0 : _h.forEach((e) => {
            var _a;
            const nameSaved = (_a = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.names) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeatividadeid`]));
            if (nameSaved) {
                namesToDelete.push(nameSaved);
            }
            else {
                namesToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}nomeatividadeid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_j = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.names) === null || _j === void 0 ? void 0 : _j.forEach((e) => {
            var _a;
            const nameSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_NomeAtividade`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nomeatividadeid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_k = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_Documento`]) === null || _k === void 0 ? void 0 : _k.forEach((e) => {
            var _a;
            const documentSaved = (_a = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.documents) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}documentosatividadeid`]));
            if (documentSaved) {
                documentsToDelete.push(documentSaved);
            }
            else {
                documentsToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e === null || e === void 0 ? void 0 : e[`${PREFIX}documentosatividadeid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    link: e === null || e === void 0 ? void 0 : e[`${PREFIX}link`],
                    font: e === null || e === void 0 ? void 0 : e[`${PREFIX}fonte`],
                    delivery: e === null || e === void 0 ? void 0 : e[`${PREFIX}entrega`],
                    type: document === null || document === void 0 ? void 0 : document[`${PREFIX}tipo`],
                });
            }
        });
        (_l = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.documents) === null || _l === void 0 ? void 0 : _l.forEach((e) => {
            var _a;
            const documentSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}documentosatividadeid`]));
            if (!documentSaved) {
                documentsToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        newRequestAcademic === null || newRequestAcademic === void 0 ? void 0 : newRequestAcademic.forEach((request) => {
            var _a, _b, _c, _d, _e, _f;
            const requestSaved = (_a = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.academicRequests) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
            if (requestSaved) {
                requestAcademicToDelete.push(Object.assign(Object.assign({}, requestSaved), { deliveryDate: moment(requestSaved.deliveryDate) }));
            }
            else {
                const peopleRequest = (_b = newActivity[`${PREFIX}PessoasRequisica_Atividade`]) === null || _b === void 0 ? void 0 : _b.filter((pe) => (pe === null || pe === void 0 ? void 0 : pe[`_${PREFIX}requisicao_pessoasenvolvidas_value`]) ===
                    (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
                requestAcademicToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    equipments: ((_c = request[`${PREFIX}Equipamentos`]) === null || _c === void 0 ? void 0 : _c.length)
                        ? (_d = request[`${PREFIX}Equipamentos`]) === null || _d === void 0 ? void 0 : _d.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                        : [],
                    finiteResource: (_e = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _e === void 0 ? void 0 : _e.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO),
                    infiniteResource: (_f = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _f === void 0 ? void 0 : _f.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO),
                    id: request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`],
                    description: request === null || request === void 0 ? void 0 : request[`${PREFIX}descricao`],
                    deadline: request === null || request === void 0 ? void 0 : request[`${PREFIX}prazominimo`],
                    other: request === null || request === void 0 ? void 0 : request[`${PREFIX}outro`],
                    delivery: request === null || request === void 0 ? void 0 : request[`${PREFIX}momentoentrega`],
                    link: request === null || request === void 0 ? void 0 : request[`${PREFIX}link`],
                    nomemoodle: request === null || request === void 0 ? void 0 : request[`${PREFIX}nomemoodle`],
                    deliveryDate: (request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                        ? moment(request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                        : null,
                    people: (peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.length)
                        ? peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.map((e) => {
                            var _a;
                            let func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                            func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                            return {
                                keyId: v4(),
                                id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                                person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                                function: func,
                            };
                        })
                        : [
                            {
                                keyId: v4(),
                                person: null,
                                function: null,
                            },
                        ],
                });
            }
        });
        (_m = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.academicRequests) === null || _m === void 0 ? void 0 : _m.forEach((e) => {
            const requestSaved = newRequestAcademic === null || newRequestAcademic === void 0 ? void 0 : newRequestAcademic.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}requisicaoacademicaid`]));
            if (!requestSaved) {
                requestAcademicToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(updateActivityAll(Object.assign(Object.assign({}, activityUndo), { [`${PREFIX}atividadeid`]: activityUndo.id, spacesToDelete: spaceToDelete, user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], startTime: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.startTime), duration: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.duration), endTime: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.endTime), startDate: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.startDate), endDate: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.endDate), academicRequests: requestAcademicToDelete, people: peopleToDelete, names: namesToDelete, documents: documentsToDelete }), {
            onSuccess: (actv) => {
                if (undoNextActivities && undoNextActivities.length) {
                    const toUpdate = undoNextActivities.map((e) => ({
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}atividadeid`],
                        data: {
                            [`${PREFIX}inicio`]: e === null || e === void 0 ? void 0 : e[`${PREFIX}inicio`],
                            [`${PREFIX}fim`]: e === null || e === void 0 ? void 0 : e[`${PREFIX}fim`],
                            [`${PREFIX}datahorainicio`]: e === null || e === void 0 ? void 0 : e[`${PREFIX}datahorainicio`],
                            [`${PREFIX}datahorafim`]: e === null || e === void 0 ? void 0 : e[`${PREFIX}datahorafim`],
                        },
                    }));
                    batchUpdateActivity(toUpdate, {
                        onSuccess: () => {
                            refetch === null || refetch === void 0 ? void 0 : refetch();
                            setValuesSetted(false);
                            setActivity(actv);
                            notification.success({
                                title: 'Sucesso',
                                description: 'Ação realizada com sucesso',
                            });
                        },
                        onError: () => null,
                    });
                }
                else {
                    refetch === null || refetch === void 0 ? void 0 : refetch();
                    setValuesSetted(false);
                    setActivity(actv);
                    notification.success({
                        title: 'Sucesso',
                        description: 'Ação realizada com sucesso',
                    });
                }
            },
            onError: () => null,
        }));
    });
    const approveDetailActivity = () => {
        setDetailLoading(true);
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}DetalhamentoAprovadoPor@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}detalhamentodatahoraaprovacao`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setDetailLoading(false);
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setDetailLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const onClose = (e) => {
        if (!_.isEqualWith(pastValues, formik.values)) {
            confirmation.openConfirmation({
                title: 'Dados não alterados',
                description: 'O que deseja?',
                yesLabel: 'Salvar e sair',
                noLabel: 'Sair sem Salvar',
                onConfirm: () => {
                    formik.setFieldValue('close', true);
                    formik.handleSubmit();
                },
                onCancel: () => {
                    handleResetEditing();
                    e === null || e === void 0 ? void 0 : e.stopPropagation();
                },
            });
        }
        else {
            handleResetEditing();
        }
    };
    const handleAproval = (nameField, dateField) => {
        setLoadingApproval({ [nameField]: true });
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}${dateField}`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setLoadingApproval({});
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setLoadingApproval({});
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const editAproval = (nameField, dateField) => {
        setLoadingApproval({ name: true });
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}${nameField}@odata.bind`]: null,
            [`${PREFIX}${dateField}`]: null,
        }, {
            onSuccess: (act) => {
                setLoadingApproval({});
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setLoadingApproval({});
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const handleEditApproval = (nameField, dateField) => {
        confirmation.openConfirmation({
            onConfirm: () => editAproval(nameField, dateField),
            title: 'Confirmação',
            description: 'Ao confirmar a área irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
        });
    };
    const checkActivityUpdated = (savedValues, currentValues) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let timeChanged = false;
        let fieldChanged = false;
        const pastStartTime = (_a = savedValues === null || savedValues === void 0 ? void 0 : savedValues.startTime) === null || _a === void 0 ? void 0 : _a.format('HH:mm');
        const pastDuration = (_b = savedValues === null || savedValues === void 0 ? void 0 : savedValues.duration) === null || _b === void 0 ? void 0 : _b.format('HH:mm');
        const currrentStartTime = (_c = currentValues === null || currentValues === void 0 ? void 0 : currentValues.startTime) === null || _c === void 0 ? void 0 : _c.format('HH:mm');
        const currentDuration = (_d = currentValues === null || currentValues === void 0 ? void 0 : currentValues.duration) === null || _d === void 0 ? void 0 : _d.format('HH:mm');
        if (pastDuration !== currentDuration ||
            pastStartTime !== currrentStartTime) {
            timeChanged = true;
        }
        if (savedValues.name !== currentValues.name ||
            savedValues.theme !== currentValues.theme ||
            savedValues.description !== currentValues.description ||
            ((_e = savedValues === null || savedValues === void 0 ? void 0 : savedValues.area) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]) !==
                ((_f = currentValues === null || currentValues === void 0 ? void 0 : currentValues.area) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`]) ||
            ((_g = savedValues === null || savedValues === void 0 ? void 0 : savedValues.course) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`]) !==
                ((_h = currentValues === null || currentValues === void 0 ? void 0 : currentValues.course) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`]) ||
            ((_j = savedValues.academicRequests) === null || _j === void 0 ? void 0 : _j.length) !==
                ((_k = currentValues.academicRequests) === null || _k === void 0 ? void 0 : _k.length) ||
            ((_l = savedValues.documents) === null || _l === void 0 ? void 0 : _l.length) !== ((_m = currentValues.documents) === null || _m === void 0 ? void 0 : _m.length)) {
            fieldChanged = true;
        }
        return {
            timeChanged,
            fieldChanged: fieldChanged || documentChanged || academicChanged,
        };
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: isModelReference
            ? validationSchemaModel
            : validationSchema,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            var _a, _b, _c;
            setValuesSetted(false);
            localStorage.setItem('undoActivity', JSON.stringify(pastValues));
            const isChanged = checkActivityUpdated(pastValues, values);
            let temp = values.temperature;
            if (!temp && (team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`])) {
                temp =
                    dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]];
            }
            if (!temp &&
                ((_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`]) === null || _b === void 0 ? void 0 : _b.length) &&
                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`][0])) {
                const sch = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`][0];
                temp = dictTag === null || dictTag === void 0 ? void 0 : dictTag[sch === null || sch === void 0 ? void 0 : sch[`_${PREFIX}_temperatura_value`]];
            }
            if (!temp && (program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`])) {
                temp =
                    dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]];
            }
            onSave(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, activity), values), getDates(values)), isChanged), { temperature: temp }), () => {
                if ((pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) || (pastValues === null || pastValues === void 0 ? void 0 : pastValues[`${PREFIX}atividadeid`])) {
                    undo.open('Deseja desfazer a ação?', () => handleUndo());
                }
                // @ts-ignore
                if (formik.values.close) {
                    setInitialValues(DEFAULT_VALUES);
                    formik.resetForm();
                    handleClose();
                    setValuesSetted(false);
                }
            });
        },
    });
    const handleSave = () => {
        if (isModelReference || isModel) {
            formik.handleSubmit();
            return;
        }
        const values = formik.values;
        const spacesWarning = [];
        let qtdTeam;
        values.spaces.forEach((space) => {
            const alertUse = space === null || space === void 0 ? void 0 : space[`${PREFIX}Espaco_CapacidadeEspaco`].find((cap) => {
                if (!(cap === null || cap === void 0 ? void 0 : cap[`_${PREFIX}uso_value`]))
                    return false;
                const tagUso = dictTag === null || dictTag === void 0 ? void 0 : dictTag[cap === null || cap === void 0 ? void 0 : cap[`_${PREFIX}uso_value`]];
                return (tagUso === null || tagUso === void 0 ? void 0 : tagUso[`${PREFIX}nome`]) === EFatherTag.ALERTA;
            });
            qtdTeam = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_ParticipantesTurma`].find((part) => {
                if (!(part === null || part === void 0 ? void 0 : part[`_${PREFIX}uso_value`]))
                    return false;
                const tagUso = dictTag === null || dictTag === void 0 ? void 0 : dictTag[part === null || part === void 0 ? void 0 : part[`_${PREFIX}uso_value`]];
                return (tagUso === null || tagUso === void 0 ? void 0 : tagUso[`${PREFIX}nome`]) === EFatherTag.QUANTIDADE_TURMA;
            });
            if ((alertUse === null || alertUse === void 0 ? void 0 : alertUse[`${PREFIX}quantidade`]) < (qtdTeam === null || qtdTeam === void 0 ? void 0 : qtdTeam[`${PREFIX}quantidade`])) {
                spacesWarning.push(Object.assign(Object.assign({}, space), { teamQuantity: qtdTeam === null || qtdTeam === void 0 ? void 0 : qtdTeam[`${PREFIX}quantidade`], quantity: alertUse === null || alertUse === void 0 ? void 0 : alertUse[`${PREFIX}quantidade`] }));
            }
        });
        if (spacesWarning.length) {
            confirmation.openConfirmation({
                title: 'Deseja continuar?',
                yesLabel: 'Continuar',
                description: (React.createElement(Box, null,
                    React.createElement(Typography, null,
                        "O(s) seguinte(s) espa\u00E7o(s) n\u00E3o possui capacidade suficientes para",
                        ' ',
                        React.createElement("strong", null,
                            " ", qtdTeam === null || qtdTeam === void 0 ? void 0 :
                            qtdTeam[`${PREFIX}quantidade`],
                            " "),
                        ' ',
                        "participantes da turma"),
                    React.createElement("ul", null, spacesWarning.map((spcW) => (React.createElement("li", null,
                        React.createElement("strong", null,
                            spcW.label,
                            ":"),
                        React.createElement("span", { style: { paddingLeft: '10px' } }, spcW.quantity))))))),
                onConfirm: () => {
                    const notifiers = [];
                    persons.forEach((p) => {
                        var _a;
                        (_a = p === null || p === void 0 ? void 0 : p[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.forEach((tag) => {
                            var _a;
                            const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                            const schedule = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`][0];
                            if ((fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO) {
                                notifiers.push({
                                    title: 'Alerta uso espaço',
                                    link: `${context.pageContext.web.absoluteUrl}/SitePages/Programa.aspx?programid=${program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`]}&teamid=${team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]}&scheduleId=${team === null || team === void 0 ? void 0 : team[`${PREFIX}cronogramadediaid`]}&activityid=${activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]}`,
                                    description: `O(s) seguinte(s) espaço(s) ${spacesWarning === null || spacesWarning === void 0 ? void 0 : spacesWarning.map((e) => e === null || e === void 0 ? void 0 : e.label).join(' ;')} não possui capacidade suficientes para ${qtdTeam === null || qtdTeam === void 0 ? void 0 : qtdTeam[`${PREFIX}quantidade`]}
                    participantes no dia ${moment
                                        .utc(schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`])
                                        .format('DD/MM/YYYY')} da turma ${team === null || team === void 0 ? void 0 : team[`${PREFIX}sigla`]} do Programa ${(_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]}`,
                                    pessoaId: p === null || p === void 0 ? void 0 : p[`${PREFIX}pessoaid`],
                                });
                            }
                        });
                    });
                    batchAddNotification(notifiers, {
                        onSuccess: () => null,
                        onError: () => null,
                    });
                    formik.handleSubmit();
                },
            });
            return;
        }
        formik.handleSubmit();
    };
    const onLoadModel = (model) => __awaiter(void 0, void 0, void 0, function* () {
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        const fantasyNames = formik.values.names;
        const start = formik.values.startTime;
        const obs = formik.values.observation;
        const duration = moment(model[`${PREFIX}duracao`], 'HH:mm');
        const minDuration = (duration === null || duration === void 0 ? void 0 : duration.hour()) * 60 + (duration === null || duration === void 0 ? void 0 : duration.minute());
        const endTime = start.clone().add(minDuration, 'minutes');
        formik.setFieldValue('duration', duration);
        formik.setFieldValue('endTime', endTime);
        formik.setFieldValue('quantity', model[`${PREFIX}quantidadesessao`] || 0);
        formik.setFieldValue('theme', model[`${PREFIX}temaaula`] || '');
        formik.setFieldValue('observation', `${obs || ''} ${model[`${PREFIX}observacao`] || ''}`);
        formik.setFieldValue('names', fantasyNames
            .concat(((_o = model[`${PREFIX}Atividade_NomeAtividade`]) === null || _o === void 0 ? void 0 : _o.length)
            ? (_p = model[`${PREFIX}Atividade_NomeAtividade`]) === null || _p === void 0 ? void 0 : _p.map((e) => ({
                keyId: v4(),
                name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
            }))
            : [
                {
                    keyId: v4(),
                    name: '',
                    nameEn: '',
                    nameEs: '',
                    use: '',
                },
            ])
            .filter((e) => (e === null || e === void 0 ? void 0 : e.name) || (e === null || e === void 0 ? void 0 : e.nameEn) || (e === null || e === void 0 ? void 0 : e.nameEs)));
        formik.setFieldValue('description', model[`${PREFIX}descricaoobjetivo`] || '');
        formik.setFieldValue('equipments', ((_q = model[`${PREFIX}Atividade_Equipamentos`]) === null || _q === void 0 ? void 0 : _q.length)
            ? (_r = model[`${PREFIX}Atividade_Equipamentos`]) === null || _r === void 0 ? void 0 : _r.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
            : []);
        formik.setFieldValue('finiteResource', (_s = model[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _s === void 0 ? void 0 : _s.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO));
        formik.setFieldValue('infiniteResource', (_t = model[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _t === void 0 ? void 0 : _t.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO));
        formik.setFieldValue('documents', [
            ...(_u = model === null || model === void 0 ? void 0 : model[`${PREFIX}Atividade_Documento`]) === null || _u === void 0 ? void 0 : _u.map((document) => ({
                keyId: v4(),
                name: document === null || document === void 0 ? void 0 : document[`${PREFIX}nome`],
                link: document === null || document === void 0 ? void 0 : document[`${PREFIX}link`],
                font: document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`],
                delivery: document === null || document === void 0 ? void 0 : document[`${PREFIX}entrega`],
            })),
            ...(_w = (_v = formik === null || formik === void 0 ? void 0 : formik.values) === null || _v === void 0 ? void 0 : _v.documents) === null || _w === void 0 ? void 0 : _w.map((dc) => (Object.assign(Object.assign({}, dc), { deleted: true }))),
        ]);
        formik.setFieldValue('area', model[`${PREFIX}AreaAcademica`]
            ? Object.assign(Object.assign({}, model[`${PREFIX}AreaAcademica`]), { value: (_x = model[`${PREFIX}AreaAcademica`]) === null || _x === void 0 ? void 0 : _x[`${PREFIX}etiquetaid`], label: (_y = model[`${PREFIX}AreaAcademica`]) === null || _y === void 0 ? void 0 : _y[`${PREFIX}nome`] }) : null);
        formik.setFieldValue('course', model[`${PREFIX}Curso`]
            ? Object.assign(Object.assign({}, model[`${PREFIX}Curso`]), { value: (_z = model[`${PREFIX}Curso`]) === null || _z === void 0 ? void 0 : _z[`${PREFIX}etiquetaid`], label: (_0 = model[`${PREFIX}Curso`]) === null || _0 === void 0 ? void 0 : _0[`${PREFIX}nome`] }) : null);
        const academicRequestModel = yield getAcademicRequestsByActivityId(model === null || model === void 0 ? void 0 : model[`${PREFIX}atividadeid`]);
        const newAcademicRequests = academicRequestModel === null || academicRequestModel === void 0 ? void 0 : academicRequestModel.map((request) => {
            var _a, _b, _c, _d, _e;
            const peopleRequest = (_a = model[`${PREFIX}PessoasRequisica_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((pe) => (pe === null || pe === void 0 ? void 0 : pe[`_${PREFIX}requisicao_pessoasenvolvidas_value`]) ===
                (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
            return {
                keyId: v4(),
                equipments: ((_b = request[`${PREFIX}Equipamentos`]) === null || _b === void 0 ? void 0 : _b.length)
                    ? (_c = request[`${PREFIX}Equipamentos`]) === null || _c === void 0 ? void 0 : _c.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                    : [],
                finiteResource: (_d = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _d === void 0 ? void 0 : _d.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO),
                infiniteResource: (_e = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _e === void 0 ? void 0 : _e.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO),
                description: request === null || request === void 0 ? void 0 : request[`${PREFIX}descricao`],
                deadline: request === null || request === void 0 ? void 0 : request[`${PREFIX}prazominimo`],
                observation: request === null || request === void 0 ? void 0 : request[`${PREFIX}observacao`],
                other: request === null || request === void 0 ? void 0 : request[`${PREFIX}outro`],
                delivery: request === null || request === void 0 ? void 0 : request[`${PREFIX}momentoentrega`],
                link: request === null || request === void 0 ? void 0 : request[`${PREFIX}link`],
                nomemoodle: request === null || request === void 0 ? void 0 : request[`${PREFIX}nomemoodle`],
                deliveryDate: (request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                    ? moment(request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                    : null,
                people: (peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.length)
                    ? peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.map((e) => {
                        var _a;
                        let func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return {
                            keyId: v4(),
                            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                            function: func,
                        };
                    })
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ],
            };
        });
        formik.setFieldValue('academicRequests', (formik.values.academicRequests || []).concat(newAcademicRequests));
    });
    const handlePublish = () => {
        setPublishLoading(true);
        updateActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}publicado`]: !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}publicado`]),
        }, {
            onSuccess: (it) => {
                setActivity(it);
                refetch === null || refetch === void 0 ? void 0 : refetch();
                setPublishLoading(false);
            },
            onError: () => {
                setPublishLoading(false);
            },
        });
    };
    const handleResetEditing = () => __awaiter(void 0, void 0, void 0, function* () {
        if ((activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) !==
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose === null || handleClose === void 0 ? void 0 : handleClose();
            setValuesSetted(false);
            return;
        }
        setEditLoading(true);
        yield updateActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}Editanto@odata.bind`]: null,
            [`${PREFIX}datahoraeditanto`]: null,
        }, {
            onSuccess: (act) => {
                setInitialValues(DEFAULT_VALUES);
                formik.resetForm();
                handleClose === null || handleClose === void 0 ? void 0 : handleClose();
                setValuesSetted(false);
            },
            onError: () => null,
        });
    });
    const handleEdit = () => {
        setEditLoading(true);
        updateActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}datahoraeditanto`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setActivity(act);
                setEditLoading(false);
                setIsDetail(false);
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const canEdit = React.useMemo(() => {
        var _a, _b, _c, _d, _e;
        const programDirectorTeam = (_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        const programDirectorProgram = (_b = program === null || program === void 0 ? void 0 : program[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        const coordinatorTeam = (_c = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _c === void 0 ? void 0 : _c.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (coordination === null || coordination === void 0 ? void 0 : coordination[`${PREFIX}etiquetaid`]));
        const academicDirectorTeam = (_d = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _d === void 0 ? void 0 : _d.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (academicDirectorLocal === null || academicDirectorLocal === void 0 ? void 0 : academicDirectorLocal[`${PREFIX}etiquetaid`]));
        return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isTeacher) ||
            !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) ||
            (programDirectorTeam === null || programDirectorTeam === void 0 ? void 0 : programDirectorTeam[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            (programDirectorProgram === null || programDirectorProgram === void 0 ? void 0 : programDirectorProgram[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            ((coordinatorTeam === null || coordinatorTeam === void 0 ? void 0 : coordinatorTeam[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
            ((academicDirectorTeam === null || academicDirectorTeam === void 0 ? void 0 : academicDirectorTeam[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
            (isModel &&
                ((_e = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _e === void 0 ? void 0 : _e.some((cUser) => tagsShared === null || tagsShared === void 0 ? void 0 : tagsShared.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]))))) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}criadopor_value`]));
    }, [currentUser, tagsShared]);
    const isAcademicDirector = React.useMemo(() => {
        var _a;
        const academicDirectorTeam = (_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (academicDirectorLocal === null || academicDirectorLocal === void 0 ? void 0 : academicDirectorLocal[`${PREFIX}etiquetaid`]));
        return ((academicDirectorTeam === null || academicDirectorTeam === void 0 ? void 0 : academicDirectorTeam[`_${PREFIX}pessoa_value`]) ===
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]));
    }, [currentUser, tagsShared]);
    const isProgramDirector = React.useMemo(() => {
        var _a;
        const programDirectorProgram = (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        return ((programDirectorProgram === null || programDirectorProgram === void 0 ? void 0 : programDirectorProgram[`_${PREFIX}pessoa_value`]) ===
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]));
    }, [currentUser, tagsShared]);
    const activityTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) ===
        (formik.values.type === TYPE_ACTIVITY.ACADEMICA
            ? 'Atividade Acadêmica'
            : formik.values.type === TYPE_ACTIVITY.NON_ACADEMICA
                ? 'Atividade não Acadêmica'
                : 'Atividade Interna'));
    const infoParent = React.useMemo(() => {
        var _a, _b;
        const info = [];
        if (program) {
            info.push((_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]);
        }
        if (team) {
            info.push(team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`]);
        }
        if ((_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}CronogramadeDia_Atividade`]) === null || _b === void 0 ? void 0 : _b.length) {
            info.push(moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format(isModel ? 'DD/MM' : 'DD/MM/YYYY'));
        }
        return info.join(' - ');
    }, []);
    return (React.createElement(React.Fragment, null,
        handleClose ? (React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null)))) : null,
        openLoad ? (React.createElement(LoadModel, { open: openLoad, onClose: () => setOpenLoad(false), onLoadModel: onLoadModel })) : null,
        React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', padding: noPadding ? 0 : '2rem', minWidth: '30rem', style: { gap: '10px' } },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])
                        ? 'Alterar Atividade'
                        : 'Cadastrar Atividade'),
                    React.createElement(HelperTooltip, { content: activityTooltip === null || activityTooltip === void 0 ? void 0 : activityTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                canEdit ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '2rem' } },
                    (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) &&
                        (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) !==
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Box, null,
                        React.createElement(Typography, { variant: 'subtitle2', style: { fontWeight: 'bold' } }, "Outra pessoa est\u00E1 editanto essa atividade"),
                        React.createElement(Typography, { variant: 'subtitle2' }, (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]]) === null || _a === void 0 ? void 0 :
                            _a[`${PREFIX}nomecompleto`],
                            ' ',
                            "-",
                            ' ',
                            moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahoraeditanto`]).format('DD/MM/YYYY HH:mm:ss')))) : null,
                    !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) ||
                        (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}editanto_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Editar'))) : (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Liberar'))))) : null),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                !isModel && canEdit && !isDetail ? (React.createElement(Box, { paddingLeft: '8px' },
                    React.createElement(Button, { startIcon: React.createElement(Publish, null), color: 'primary', onClick: () => setOpenLoad(!openLoad) }, "Carregar Atividade"))) : (React.createElement("div", null)),
                React.createElement(Typography, { variant: 'body2', style: { fontWeight: 700, maxWidth: '36rem' } }, infoParent)),
            headerInfo,
            React.createElement(Box, { flex: '1 0 auto', overflow: 'auto', maxHeight: !isDrawer
                    ? maxHeight || 'calc(100vh - 20rem)'
                    : 'calc(100vh - 14rem)', maxWidth: !isDrawer ? '100%' : '50rem' },
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' }, defaultExpanded: true },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Informa\u00E7\u00F5es")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(InfoForm, { isDetail: isDetail, canEdit: canEdit, isModel: isModel, isModelReference: isModelReference, isDraft: isDraft, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isAcademicDirector: isAcademicDirector, activityType: formik.values.type, tagsOptions: tags, currentUser: currentUser, spaceOptions: spaces, activity: activity, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), loadingApproval: loadingApproval, handleAproval: handleAproval, handleEditApproval: handleEditApproval, setActivity: setActivity, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Nome Fantasia")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaonomefantasia_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, !isModel && !isDraft && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaonomefantasia_value`]) &&
                                    !isModel &&
                                    !isDraft && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaonomefantasia_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(FantasyNameForm, { canEdit: canEdit &&
                                    !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaonomefantasia_value`]), isDetail: isDetail, values: formik.values, errors: formik.errors, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), setValues: formik.setValues, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Pessoas Envolvidas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(EnvolvedPeopleForm, { canEdit: canEdit, isDetail: isDetail, isModel: isModel, values: formik.values, errors: formik.errors, activity: activity, setActivity: (actv) => {
                                setValuesSetted(false);
                                setActivity(actv);
                            }, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), currentUser: currentUser, setValues: formik.setValues, setFieldValue: formik.setFieldValue }))),
                formik.values.type === TYPE_ACTIVITY.ACADEMICA && (React.createElement(React.Fragment, null,
                    React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Aula")),
                        React.createElement(AccordionDetails, null,
                            React.createElement(Classroom, { canEdit: canEdit, isDetail: isDetail, isModel: isModel, isDraft: isDraft, activity: activity, isProgramDirector: isProgramDirector, isProgramResponsible: isProgramResponsible, currentUser: currentUser, values: formik.values, errors: formik.errors, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), handleChange: formik.handleChange, setFieldValue: formik.setFieldValue, loadingApproval: loadingApproval, handleAproval: handleAproval, handleEditApproval: handleEditApproval }))),
                    React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Documentos")),
                        React.createElement(AccordionDetails, null,
                            React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodocumentos_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                    React.createElement(Box, null, !isModel && !isDraft && !isDetail && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDocumentos) ? (React.createElement(CircularProgress, { size: 15 })) : (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoDocumentos', 'dataaprovacaodocumentos'), style: {
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        } }, "Editar"))))))),
                                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodocumentos_value`]) &&
                                        !isModel &&
                                        !isDetail &&
                                        !isDraft && (React.createElement(React.Fragment, null,
                                        React.createElement(AccessTime, { fontSize: 'small' }),
                                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                    !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodocumentos_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDocumentos) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoDocumentos', 'dataaprovacaodocumentos'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                                React.createElement(Documents, { canEdit: canEdit &&
                                        !isDetail &&
                                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodocumentos_value`]), setDocumentChanged: setDocumentChanged, values: formik.values, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), setFieldValue: formik.setFieldValue })))),
                    React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Requisi\u00E7\u00E3o Acad\u00EAmica")),
                        React.createElement(AccordionDetails, null,
                            React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoreqacademica_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                    React.createElement(Box, null, !isModel && !isDraft && !isDetail && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoReqAcademica) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoReqAcademica', 'dataaprovacaoreqacademica'), style: {
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                        } }, "Editar")) : null))))),
                                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoreqacademica_value`]) &&
                                        !isModel &&
                                        !isDraft && (React.createElement(React.Fragment, null,
                                        React.createElement(AccessTime, { fontSize: 'small' }),
                                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                    !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoreqacademica_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoReqAcademica) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoReqAcademica', 'dataaprovacaoreqacademica'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                                React.createElement(AcademicRequest, { canEdit: canEdit &&
                                        !isDetail &&
                                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoreqacademica_value`]), setAcademicChanged: setAcademicChanged, values: formik.values, detailApproved: !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), setFieldValue: formik.setFieldValue })))))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Observa\u00E7\u00E3o")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(FormControl, { fullWidth: true },
                            React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 3, disabled: !canEdit || isDetail, inputProps: { maxLength: 2000 }, type: 'text', name: 'observation', onChange: (nextValue) => formik.setFieldValue('observation', nextValue.target.value), value: formik.values.observation }),
                            React.createElement(FormHelperText, null,
                                ((_c = (_b = formik === null || formik === void 0 ? void 0 : formik.values) === null || _b === void 0 ? void 0 : _b.observation) === null || _c === void 0 ? void 0 : _c.length) || 0,
                                "/2000"))))),
            React.createElement(Box, { width: '100%', 
                // marginTop='2rem'
                display: 'flex', padding: '1rem', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, isModelReference &&
                    canEdit &&
                    (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]) ? (React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: handlePublish, startIcon: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}publicado`]) ? (React.createElement(VisibilityOff, null)) : (React.createElement(Visibility, null)) }, publishLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}publicado`]) ? ('Despublicar') : ('Publicar'))) : null),
                React.createElement(Box, { display: 'flex', style: { gap: '1rem' } },
                    isDrawer ? (React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar")) : null,
                    React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !canEdit ||
                            isDetail ||
                            !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}detalhamentoaprovadopor_value`]), onClick: handleSave }, "Salvar"))))));
};
export default ActivityForm;
//# sourceMappingURL=index.js.map