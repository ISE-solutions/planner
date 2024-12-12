var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'react-quill/dist/quill.snow.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import { AccessTime, CheckCircle, Close, ExpandMore, Replay, Visibility, VisibilityOff, } from '@material-ui/icons';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { useConfirmation, useContextWebpart, useLoggedUser, useNotification, } from '~/hooks';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import ParticipantsForm from './ParticipantsForm';
import Schedules from './Schedules';
import { PERSON, PREFIX } from '~/config/database';
import * as moment from 'moment';
import { Anexos, Backdrop } from '~/components';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import romanize from '~/utils/romanize';
import { EFatherTag, EGroups } from '~/config/enums';
import { BoxCloseIcon } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateTeam, getTeamById, updateTeam, } from '~/store/modules/team/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '~/components/HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { getScheduleId } from '~/store/modules/schedule/actions';
const Form = ({ team, isModel, isDraft, teams, isLoadModel, tagsOptions, peopleOptions, dictTag, setTeam, program, dictPeople, programId, refetch, isProgramResponsible, isProgramDirector, isFinance, getActivityByTeamId, handleClose, }) => {
    var _a, _b, _c, _d, _e, _f;
    const programDirector = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA);
    const academicDirector = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO);
    const coordination = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES);
    const academicCoordination = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ACADEMICA);
    const DEFAULT_VALUES = React.useMemo(() => {
        if (!(tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.length))
            return {};
        const planning = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
            (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
            (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO);
        const materialProducer = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
            (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
            (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.PRODUTOR_MATERIAIS);
        return {
            name: '',
            title: '',
            teamCode: '',
            sigla: '',
            teamName: '',
            mask: '',
            maskBackup: '',
            modality: null,
            temperature: null,
            videoConference: null,
            videoConferenceBackup: null,
            nameEdited: false,
            yearConclusion: '',
            description: '',
            anexos: [],
            schedules: [],
            concurrentActivity: false,
            model: isModel,
            names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
            people: [
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, programDirector),
                },
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, academicDirector),
                },
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, coordination),
                },
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, academicCoordination),
                },
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, planning),
                },
                {
                    keyId: v4(),
                    person: null,
                    isRequired: true,
                    function: Object.assign({}, materialProducer),
                },
            ],
            participants: [{ keyId: v4(), date: null, quantity: null, use: '' }],
        };
    }, [tagsOptions]);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [isDetail, setIsDetail] = React.useState(!isLoadModel && team);
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [loadingApproval, setLoadingApproval] = React.useState({});
    const [editLoading, setEditLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [valuesSetted, setValuesSetted] = React.useState(false);
    const [openSchedule, setOpenSchedule] = React.useState(false);
    const [scheduleChoosed, setScheduleChoosed] = React.useState();
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [errorApproval, setErrorApproval] = React.useState({
        title: 'Campos/Funções obrigatórios para lançar para aprovação',
        open: false,
        msg: null,
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const refAnexo = React.useRef();
    const updateTemperature = React.useRef(false);
    const validationSchema = yup.object({
        sigla: yup.string().required('Campo Obrigatório'),
        temperature: yup.mixed().required('Campo Obrigatório'),
        modality: yup.mixed().required('Campo Obrigatório'),
        yearConclusion: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            test: (value) => {
                return !value || (value >= 2000 && value <= 9999);
            },
            message: 'Informe um ano válido',
            name: 'ValidYear',
        })
            .test({
            test: (value) => {
                return !value || value >= moment().year();
            },
            message: `Informe um ano maior ou igual a ${moment().year()}`,
            name: 'ValidY',
        }),
    });
    const validationSchemaModel = yup.object({
        title: yup.string().required('Campo Obrigatório'),
    });
    const validationSchemaInternEvent = yup.object({
        sigla: yup.string().required('Campo Obrigatório'),
    });
    const { app } = useSelector((state) => state);
    const { context } = useContextWebpart();
    const { tooltips } = app;
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
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
        var _a, _b, _c, _d, _e, _f, _g;
        if (team && dictTag && dictPeople && !valuesSetted) {
            const iniVal = {
                id: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`],
                title: team[`${PREFIX}titulo`] || '',
                baseadoemmodeloturma: team === null || team === void 0 ? void 0 : team.baseadoemmodeloturma,
                modeloid: team === null || team === void 0 ? void 0 : team.modeloid,
                sigla: team[`${PREFIX}sigla`] || '',
                name: team[`${PREFIX}nome`] || '',
                model: team[`${PREFIX}modelo`],
                nameEdited: false,
                teamCode: team[`${PREFIX}codigodaturma`] || '',
                teamName: team[`${PREFIX}nomefinanceiro`] || '',
                mask: team[`${PREFIX}mascara`] || '',
                maskBackup: team[`${PREFIX}mascarabackup`] || '',
                yearConclusion: team[`${PREFIX}anodeconclusao`] || '',
                description: team[`${PREFIX}observacao`] || '',
                concurrentActivity: team[`${PREFIX}atividadeconcorrente`],
                modality: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Modalidade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) ||
                    null,
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) ||
                    null,
                videoConferenceBackup: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[team === null || team === void 0 ? void 0 : team[`_${PREFIX}ferramentavideoconferenciabackup_value`]]) || null,
                videoConference: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[team === null || team === void 0 ? void 0 : team[`_${PREFIX}ferramentavideoconferencia_value`]]) ||
                    null,
                anexos: [],
                schedules: team.schedules || [],
                names: ((_c = team[`${PREFIX}Turma_NomeTurma`]) === null || _c === void 0 ? void 0 : _c.length)
                    ? (_d = team[`${PREFIX}Turma_NomeTurma`]) === null || _d === void 0 ? void 0 : _d.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}nometurmaid`],
                        name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                        nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                        nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                        use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                    }))
                    : [
                        {
                            name: '',
                            nameEn: '',
                            nameEs: '',
                            use: '',
                        },
                    ],
                participants: ((_e = team[`${PREFIX}Turma_ParticipantesTurma`]) === null || _e === void 0 ? void 0 : _e.length)
                    ? (_f = team[`${PREFIX}Turma_ParticipantesTurma`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}participantesturmaid`],
                        date: (e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]) && moment.utc(e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]),
                        quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                        use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                    }))
                    : [
                        {
                            date: null,
                            quantity: '',
                            use: '',
                        },
                    ],
                people: [],
            };
            const peopleSaved = (_g = team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _g === void 0 ? void 0 : _g.map((e) => {
                var _a;
                let func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                if (!func) {
                    func = {};
                }
                func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                return Object.assign(Object.assign({}, e), { keyId: v4(), isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasturmaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func });
            });
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ACADEMICA; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ACADEMICA);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => { var _a; return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.PRODUTOR_MATERIAIS; }))) {
                const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.PRODUTOR_MATERIAIS);
                peopleSaved.push({
                    keyId: v4(),
                    isRequired: true,
                    function: func,
                });
            }
            iniVal.people = peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.sort((a, b) => (a === null || a === void 0 ? void 0 : a[`${PREFIX}ordem`]) - (b === null || b === void 0 ? void 0 : b[`${PREFIX}ordem`]));
            setInitialValues(iniVal);
            setPastValues(iniVal);
            setValuesSetted(true);
            getFiles(sp, `Anexos Interno/Turma/${moment(team === null || team === void 0 ? void 0 : team.createdon).format('YYYY')}/${team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]}`).then((files) => {
                formik.setFieldValue('anexos', files);
                setPastValues(Object.assign(Object.assign({}, iniVal), { anexos: files }));
            });
        }
    }, [team, dictTag, dictPeople]);
    const handleUndo = (newTeam) => {
        var _a, _b, _c, _d, _e, _f;
        setValuesSetted(false);
        const teamUndo = JSON.parse(localStorage.getItem('undoTeam'));
        const peopleToDelete = [];
        const namesToDelete = [];
        const participantsToDelete = [];
        (_a = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.people) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidasturmaid`]));
            if (envolvedSaved) {
                peopleToDelete.push(envolvedSaved);
            }
            else {
                const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                peopleToDelete.push(Object.assign(Object.assign({}, e), { keyId: v4(), deleted: true, isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasturmaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func }));
            }
        });
        (_b = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.people) === null || _b === void 0 ? void 0 : _b.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasturmaid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_c = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_NomeTurma`]) === null || _c === void 0 ? void 0 : _c.forEach((e) => {
            var _a;
            const nameSaved = (_a = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.names) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}nometurmaid`]));
            if (nameSaved) {
                namesToDelete.push(nameSaved);
            }
            else {
                namesToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}nometurmaid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_d = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.names) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const nameSaved = (_a = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_NomeTurma`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nometurmaid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_e = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_ParticipantesTurma`]) === null || _e === void 0 ? void 0 : _e.forEach((e) => {
            var _a;
            const participantSaved = (_a = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.participants) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}participantesturmaid`]));
            if (participantSaved) {
                participantsToDelete.push(participantSaved);
            }
            else {
                participantsToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}participantesturmaid`],
                    date: (e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]) && moment.utc(e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]),
                    quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_f = teamUndo === null || teamUndo === void 0 ? void 0 : teamUndo.participants) === null || _f === void 0 ? void 0 : _f.forEach((e) => {
            var _a;
            const participantSaved = (_a = newTeam === null || newTeam === void 0 ? void 0 : newTeam[`${PREFIX}Turma_ParticipantesTurma`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}participantesturmaid`]));
            if (!participantSaved) {
                participantsToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(addOrUpdateTeam(Object.assign(Object.assign({}, teamUndo), { participants: participantsToDelete, people: peopleToDelete, names: namesToDelete }), programId, {
            onSuccess: (te) => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
                setTeam(te);
                notification.success({
                    title: 'Sucesso',
                    description: 'Ação realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }, updateTemperature.current, true));
    };
    const onClose = () => {
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
                },
            });
        }
        else {
            handleResetEditing();
        }
    };
    const handleSuccess = (newTeam) => {
        setLoading(false);
        if (updateTemperature.current) {
            dispatch(executeChangeTemperature({
                origin: 'Turma',
                idOrigin: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`],
                idPerson: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
            }, {
                onSuccess: () => {
                    notification.success({
                        title: 'Sucesso',
                        description: 'Alteração solicitada com sucesso!',
                    });
                },
                onError: () => null,
            }));
        }
        notification.success({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso',
        });
        setTeam === null || setTeam === void 0 ? void 0 : setTeam(newTeam);
        if ((pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) || (pastValues === null || pastValues === void 0 ? void 0 : pastValues[`${PREFIX}turmaid`])) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(newTeam));
        }
        // @ts-ignore
        if (formik.values.close) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
        }
    };
    const handleError = (error, newTeam) => {
        var _a, _b;
        setLoading(false);
        if (newTeam) {
            setTeam(newTeam);
            setIsDetail(true);
        }
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
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
    const handleSaveSubmit = (body, forceCreate) => {
        setValuesSetted(false);
        updateTemperature.current = forceCreate;
        dispatch(addOrUpdateTeam(body, programId, {
            onSuccess: handleSuccess,
            onError: handleError,
        }, forceCreate));
    };
    const schemaToValidate = () => {
        if (program === null || program === void 0 ? void 0 : program[`${PREFIX}ehreserva`]) {
            return validationSchemaInternEvent;
        }
        if (isModel) {
            return validationSchemaModel;
        }
        return validationSchema;
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: schemaToValidate(),
        onSubmit: (values) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (!isModel && !(program === null || program === void 0 ? void 0 : program[`${PREFIX}ehreserva`])) {
                const functionsRequired = {
                    programDirector: false,
                    academicDirector: false,
                    materialProducer: false,
                    admissionCoordinator: false,
                };
                values.people.forEach((envolved) => {
                    var _a, _b, _c, _d;
                    if (((_a = envolved.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                        EFatherTag.DIRETOR_PROGRAMA &&
                        envolved.person &&
                        !(envolved === null || envolved === void 0 ? void 0 : envolved.deleted)) {
                        functionsRequired.programDirector = true;
                    }
                    if (((_b = envolved.function) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ===
                        EFatherTag.DIRETOR_ACADEMICO &&
                        envolved.person &&
                        !(envolved === null || envolved === void 0 ? void 0 : envolved.deleted)) {
                        functionsRequired.academicDirector = true;
                    }
                    if (((_c = envolved.function) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) ===
                        EFatherTag.PRODUTOR_MATERIAIS &&
                        envolved.person &&
                        !(envolved === null || envolved === void 0 ? void 0 : envolved.deleted)) {
                        functionsRequired.materialProducer = true;
                    }
                    if (((_d = envolved.function) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) ===
                        EFatherTag.COORDENACAO_ADMISSOES &&
                        envolved.person &&
                        !(envolved === null || envolved === void 0 ? void 0 : envolved.deleted)) {
                        functionsRequired.admissionCoordinator = true;
                    }
                });
                if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
                    setLoadingApproval(false);
                    setErrorApproval({
                        open: true,
                        title: 'Existem campos obrigatórios por preencher. A criação de tarefas requer o preenchimento obrigatório de determinadas funções relacionadas com o squad. Favor verificar os campos relacionados com as funções obrigatórios.',
                        msg: (React.createElement("div", null,
                            React.createElement(Typography, null, "Falta informar as pessoas para seguintes fun\u00E7\u00F5es:"),
                            React.createElement("ul", null,
                                !functionsRequired.programDirector && (React.createElement("li", null,
                                    React.createElement("strong", null, EFatherTag.DIRETOR_PROGRAMA))),
                                !functionsRequired.academicDirector && (React.createElement("li", null,
                                    React.createElement("strong", null, EFatherTag.DIRETOR_ACADEMICO))),
                                !functionsRequired.admissionCoordinator && (React.createElement("li", null,
                                    React.createElement("strong", null, EFatherTag.COORDENACAO_ADMISSOES))),
                                !functionsRequired.materialProducer && (React.createElement("li", null,
                                    React.createElement("strong", null, EFatherTag.PRODUTOR_MATERIAIS)))))),
                    });
                    return;
                }
            }
            setLoading(true);
            localStorage.setItem('undoTeam', JSON.stringify(pastValues));
            try {
                const files = (_a = refAnexo === null || refAnexo === void 0 ? void 0 : refAnexo.current) === null || _a === void 0 ? void 0 : _a.getAnexos();
                let name = team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`];
                let teamPosition = team === null || team === void 0 ? void 0 : team[`${PREFIX}posicao`];
                if (!values.nameEdited) {
                    if (!teamPosition ||
                        +values.yearConclusion !== +pastValues.yearConclusion ||
                        values.sigla !== pastValues.sigla) {
                        const teamsSame = teams === null || teams === void 0 ? void 0 : teams.filter((te) => (te === null || te === void 0 ? void 0 : te[`${PREFIX}sigla`]) === values.sigla &&
                            (te === null || te === void 0 ? void 0 : te[`${PREFIX}anodeconclusao`]) === +values.yearConclusion &&
                            (!(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) ||
                                (te === null || te === void 0 ? void 0 : te[`${PREFIX}turmaid`]) !== (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`])));
                        const maxTeam = teamsSame.reduce((max, actual) => {
                            return (actual === null || actual === void 0 ? void 0 : actual[`${PREFIX}posicao`]) > max.numero ? actual : max;
                        }, teamsSame[0]);
                        teamPosition = ((maxTeam === null || maxTeam === void 0 ? void 0 : maxTeam[`${PREFIX}posicao`]) || 0) + 1;
                    }
                    name = !isModel
                        ? `${(_b = values.sigla) === null || _b === void 0 ? void 0 : _b.trim()} ${romanize(teamPosition || 1)} ${values.yearConclusion}`
                        : '';
                }
                else {
                    name = values.name;
                }
                setValuesSetted(false);
                let deleteTask = false;
                if (((_c = pastValues.temperature) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) === EFatherTag.CONTRATADO &&
                    ((_d = pastValues.temperature) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) !==
                        ((_e = values.temperature) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nome`])) {
                    deleteTask = true;
                }
                let temp = values.temperature;
                if (!temp && (team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`])) {
                    temp =
                        dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_f = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`]];
                }
                if (!temp && (program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`])) {
                    temp =
                        dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_g = program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`]];
                }
                if (!isModel &&
                    (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) &&
                    (team === null || team === void 0 ? void 0 : team[`${PREFIX}CronogramadeDia_Turma`].length) &&
                    ((_h = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}etiquetaid`]) !==
                        ((_k = (_j = formik.values) === null || _j === void 0 ? void 0 : _j.temperature) === null || _k === void 0 ? void 0 : _k[`${PREFIX}etiquetaid`])) {
                    confirmation.openConfirmation({
                        title: 'Alteração de Temperatura',
                        description: 'Deseja atualizar a temperatura dos subordinados?',
                        yesLabel: 'Sim',
                        noLabel: 'Não',
                        onConfirm: () => {
                            var _a;
                            handleSaveSubmit(Object.assign(Object.assign({}, values), { deleteTask,
                                teamPosition, group: myGroup(), isLoadModel,
                                name, temperature: temp, programId: program === null || program === void 0 ? void 0 : program[`${PREFIX}programid`], programName: (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], id: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], anexos: files, previousPeople: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) || [], previousNames: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_NomeTurma`]) || [], previousPaticipants: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_ParticipantesTurma`]) || [] }), true);
                        },
                        onCancel: () => {
                            var _a;
                            handleSaveSubmit(Object.assign(Object.assign({}, values), { deleteTask,
                                teamPosition, group: myGroup(), isLoadModel,
                                name, temperature: temp, programId: program === null || program === void 0 ? void 0 : program[`${PREFIX}programid`], programName: (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], id: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], anexos: files, previousPeople: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) || [], previousNames: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_NomeTurma`]) || [], previousPaticipants: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_ParticipantesTurma`]) || [] }), false);
                        },
                    });
                }
                else {
                    handleSaveSubmit(Object.assign(Object.assign({}, values), { deleteTask,
                        teamPosition, group: myGroup(), isLoadModel,
                        name, temperature: temp, programId: program === null || program === void 0 ? void 0 : program[`${PREFIX}programid`], programName: (_l = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _l === void 0 ? void 0 : _l[`${PREFIX}nome`], id: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], anexos: files, previousPeople: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) || [], previousNames: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_NomeTurma`]) || [], previousPaticipants: (team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_ParticipantesTurma`]) || [] }), false);
                }
            }
            catch (err) {
                console.error(err);
                setLoading(false);
                notification.error({
                    title: 'Falha',
                    description: 'Ocorreu um erro, Tente novamente mais tarde',
                });
            }
        },
    });
    console.log(formik.errors);
    const handleSave = () => {
        formik.handleSubmit();
    };
    const removeDaySchedule = (id) => {
        var _a;
        const listSchedule = _.cloneDeep((_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.schedules);
        const indexSchedule = listSchedule.findIndex((e) => (e === null || e === void 0 ? void 0 : e.keyid) === id);
        const newSchedule = [...listSchedule];
        newSchedule.splice(indexSchedule, 1);
        formik.setFieldValue('schedules', newSchedule);
    };
    React.useEffect(() => {
        var _a;
        if ((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.participants) {
            notification.error({
                title: 'Falha',
                description: 'Por favor, verifique que todos os campos obrigatórios estão preenchidos e de forma correta.',
            });
        }
    }, [formik.errors]);
    const handleToApprove = () => {
        setLoadingApproval(true);
        const functionsRequired = {
            programDirector: false,
            academicDirector: false,
            coordination: false,
            academicCoordination: false,
            planning: false,
            materialProducer: false,
        };
        formik.values.people.forEach((envolved) => {
            var _a, _b, _c, _d, _e, _f;
            if (((_a = envolved.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA &&
                envolved.person) {
                functionsRequired.programDirector = true;
            }
            if (((_b = envolved.function) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) === EFatherTag.DIRETOR_ACADEMICO &&
                envolved.person) {
                functionsRequired.academicDirector = true;
            }
            if (((_c = envolved.function) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) ===
                EFatherTag.COORDENACAO_ADMISSOES &&
                envolved.person) {
                functionsRequired.coordination = true;
            }
            if (((_d = envolved.function) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`]) ===
                EFatherTag.COORDENACAO_ACADEMICA &&
                envolved.person) {
                functionsRequired.academicCoordination = true;
            }
            if (((_e = envolved.function) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO &&
                envolved.person) {
                functionsRequired.planning = true;
            }
            if (((_f = envolved.function) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`]) ===
                EFatherTag.PRODUTOR_MATERIAIS &&
                envolved.person) {
                functionsRequired.materialProducer = true;
            }
        });
        if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
            setLoadingApproval(false);
            setErrorApproval({
                open: true,
                title: 'Campos/Funções obrigatórios para lançar para aprovação',
                msg: (React.createElement("div", null,
                    React.createElement(Typography, null, "Falta informar as seguintes fun\u00E7\u00F5es:"),
                    React.createElement("ul", null,
                        !functionsRequired.programDirector && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.DIRETOR_PROGRAMA))),
                        !functionsRequired.academicDirector && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.DIRETOR_ACADEMICO))),
                        !functionsRequired.coordination && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.COORDENACAO_ADMISSOES))),
                        !functionsRequired.academicCoordination && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.COORDENACAO_ACADEMICA))),
                        !functionsRequired.planning && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.PLANEJAMENTO))),
                        !functionsRequired.materialProducer && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.PRODUTOR_MATERIAIS)))))),
            });
            return;
        }
        updateTeam(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], {
            [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
        }, {
            onSuccess: (it) => {
                setTeam(it);
                setLoadingApproval(false);
            },
            onError: () => {
                setLoadingApproval(false);
            },
        });
    };
    const handleAproval = (nameField, dateField) => {
        setLoadingApproval({ [nameField]: true });
        updateTeam(team[`${PREFIX}turmaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}${dateField}`]: moment().format(),
        }, {
            onSuccess: (te) => {
                setLoadingApproval({});
                setTeam(te);
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
        updateTeam(team[`${PREFIX}turmaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: null,
            [`${PREFIX}${dateField}`]: null,
        }, {
            onSuccess: (te) => {
                setLoadingApproval({});
                setTeam(te);
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
    const handlePublish = () => {
        setPublishLoading(true);
        updateTeam(team[`${PREFIX}turmaid`], {
            [`${PREFIX}publicado`]: !(team === null || team === void 0 ? void 0 : team[`${PREFIX}publicado`]),
        }, {
            onSuccess: (it) => {
                setTeam(it);
                setPublishLoading(false);
            },
            onError: () => {
                setPublishLoading(false);
            },
        });
    };
    const handleEdit = () => {
        setEditLoading(true);
        updateTeam(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], {
            [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}datahoraeditanto`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setTeam(act);
                setEditLoading(false);
                setIsDetail(false);
            },
            onError: () => { },
        });
    };
    const handleResetEditing = () => __awaiter(void 0, void 0, void 0, function* () {
        if ((team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]) !== (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
            setIsDetail(false);
            return;
        }
        setEditLoading(true);
        yield updateTeam(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], {
            [`${PREFIX}Editanto@odata.bind`]: null,
            [`${PREFIX}datahoraeditanto`]: null,
        }, {
            onSuccess: (act) => {
                setInitialValues(DEFAULT_VALUES);
                formik.resetForm();
                handleClose();
                setValuesSetted(false);
                setIsDetail(false);
            },
            onError: () => null,
        });
    });
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const refreshTeam = () => {
        setValuesSetted(false);
        setLoading(true);
        getTeamById(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`])
            .then(({ value }) => {
            setLoading(false);
            setTeam(value[0]);
        })
            .catch(() => {
            notification.error({
                title: 'Falha',
                description: 'Houve um erro interno!',
            });
            setLoading(false);
        });
    };
    const handleSchedule = (sche) => {
        getScheduleId(sche === null || sche === void 0 ? void 0 : sche[`${PREFIX}cronogramadediaid`]).then(({ value }) => {
            setScheduleChoosed(value[0]);
            setOpenSchedule(true);
        });
    };
    const handleCloseSchedule = () => {
        setScheduleChoosed(null);
        setOpenSchedule(false);
        refreshTeam();
    };
    const canEdit = React.useMemo(() => {
        var _a, _b, _c, _d;
        const programDirectorTeam = (_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _a === void 0 ? void 0 : _a.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        const coordinatorTeam = (_b = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _b === void 0 ? void 0 : _b.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (coordination === null || coordination === void 0 ? void 0 : coordination[`${PREFIX}etiquetaid`]));
        const programDirectorProgram = (_c = program === null || program === void 0 ? void 0 : program[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            (programDirectorTeam === null || programDirectorTeam === void 0 ? void 0 : programDirectorTeam[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            (programDirectorProgram === null || programDirectorProgram === void 0 ? void 0 : programDirectorProgram[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            (coordinatorTeam === null || coordinatorTeam === void 0 ? void 0 : coordinatorTeam[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            ((_d = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _d === void 0 ? void 0 : _d.some((cUser) => {
                var _a;
                return (_a = team === null || team === void 0 ? void 0 : team[`${PREFIX}Turma_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
            })) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) === (team === null || team === void 0 ? void 0 : team[`_${PREFIX}criadopor_value`]));
    }, [currentUser]);
    const isHeadOfService = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return program === null || program === void 0 ? void 0 : program[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.FINANCEIRO) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, program, dictPeople]);
    const teamTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Turma');
    const infoParent = React.useMemo(() => {
        var _a;
        const info = [];
        if (program) {
            info.push((_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]);
        }
        return info.join(' - ');
    }, []);
    return (React.createElement(React.Fragment, null,
        React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(ScheduleDayForm, { visible: openSchedule, context: context, titleRequired: isModel, isDraft: (((_a = scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                ((_b = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ||
                ((_c = program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`])) ===
                EFatherTag.RASCUNHO, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isHeadOfService: isHeadOfService, schedule: scheduleChoosed, program: program, team: team, setSchedule: setScheduleChoosed, teamId: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], programId: team === null || team === void 0 ? void 0 : team[`_${PREFIX}programa_value`], handleClose: handleCloseSchedule }),
        React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', padding: '2rem', minWidth: '30rem' },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '2rem' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) ? 'Alterar turma' : 'Cadastrar turma'),
                    React.createElement(HelperTooltip, { content: teamTooltip === null || teamTooltip === void 0 ? void 0 : teamTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                canEdit ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '2rem' } },
                    (team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]) &&
                        (team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]) !==
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Box, null,
                        React.createElement(Typography, { variant: 'subtitle2', style: { fontWeight: 'bold' } }, "Outra pessoa est\u00E1 editanto essa turma"),
                        React.createElement(Typography, { variant: 'subtitle2' }, (_d = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]]) === null || _d === void 0 ? void 0 :
                            _d[`${PREFIX}nomecompleto`],
                            ' ',
                            "-",
                            ' ',
                            moment(team === null || team === void 0 ? void 0 : team[`${PREFIX}datahoraeditanto`]).format('DD/MM/YYYY HH:mm:ss')))) : null,
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]) ||
                        (team === null || team === void 0 ? void 0 : team[`_${PREFIX}editanto_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Editar'))) : (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Liberar'))))) : null),
            React.createElement(Box, { display: 'flex', width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
                React.createElement(Typography, { variant: 'body2', style: { fontWeight: 700, maxWidth: '36rem' } }, infoParent)),
            React.createElement(Box, { flex: '1 0 auto', overflow: 'auto', maxHeight: 'calc(100vh - 12rem)', maxWidth: '50rem' },
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' }, defaultExpanded: true },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Informa\u00E7\u00F5es")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(InfoForm, { isDetail: isDetail, isModel: isModel, isDraft: isDraft, tags: tagsOptions, team: team, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isFinance: isFinance, loadingApproval: loadingApproval, handleAproval: handleAproval, handleEditApproval: handleEditApproval, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Nome Fantasia")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefantasia_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefantasia_value`]) &&
                                    !isModel &&
                                    !isDraft && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                (isProgramDirector || isProgramResponsible) &&
                                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefantasia_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(FantasyNameForm, { isDetail: isDetail || (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefantasia_value`]), values: formik.values, errors: formik.errors, setValues: formik.setValues, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Pessoas Envolvidas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(EnvolvedPeopleForm, { isDetail: isDetail, isDraft: isDraft, values: formik.values, errors: formik.errors, tags: tagsOptions, setTeam: setTeam, teamId: team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], currentUser: currentUser, persons: peopleOptions, setValues: formik.setValues, setFieldValue: formik.setFieldValue }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Dias de aula")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Schedules, { isModel: isModel, isDetail: isDetail, handleSchedule: handleSchedule, isSaved: !!(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]), refetch: refetch, isLoadModel: isLoadModel, removeDaySchedule: removeDaySchedule, getActivityByTeamId: getActivityByTeamId, schedules: team === null || team === void 0 ? void 0 : team[`${PREFIX}CronogramadeDia_Turma`] }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Participantes")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoparticipantes_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoParticipantes) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoParticipantes', 'dataaprovacaoparticipantes'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoparticipantes_value`]) &&
                                    !isModel && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                (isProgramDirector || isProgramResponsible) &&
                                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoparticipantes_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoParticipantes) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoParticipantes', 'dataaprovacaoparticipantes'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(ParticipantsForm, { isDetail: isDetail, errors: formik.errors, values: formik.values, setValues: formik.setValues, handleChange: formik.handleChange, setFieldValue: formik.setFieldValue })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Anexos")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Anexos, { ref: refAnexo, disabled: isDetail, anexos: formik.values.anexos }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Observa\u00E7\u00E3o")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(FormControl, { fullWidth: true },
                            React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 3, disabled: !canEdit || isDetail, inputProps: { maxLength: 2000 }, type: 'text', name: 'description', onChange: (nextValue) => formik.setFieldValue('description', nextValue.target.value), value: formik.values.description }),
                            React.createElement(FormHelperText, null,
                                ((_f = (_e = formik === null || formik === void 0 ? void 0 : formik.values) === null || _e === void 0 ? void 0 : _e.description) === null || _f === void 0 ? void 0 : _f.length) || 0,
                                "/2000"))))),
            React.createElement(Box, { width: '100%', marginTop: '1rem', display: 'flex', padding: '1rem', justifyContent: 'space-between' },
                React.createElement(Box, null,
                    isModel && canEdit && (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) && !programId ? (React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: handlePublish, startIcon: (team === null || team === void 0 ? void 0 : team[`${PREFIX}publicado`]) ? (React.createElement(VisibilityOff, null)) : (React.createElement(Visibility, null)) }, publishLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : (team === null || team === void 0 ? void 0 : team[`${PREFIX}publicado`]) ? ('Despublicar') : ('Publicar'))) : null,
                    !isModel &&
                        !isLoadModel &&
                        (team === null || team === void 0 ? void 0 : team[`_${PREFIX}lancarparaaprovacao_value`]) ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Lan\u00E7ado para aprova\u00E7\u00E3o"))) : null),
                React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', style: { gap: '1rem' } },
                    React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                    React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !canEdit || isDetail, onClick: handleSave }, "Salvar"))),
            React.createElement(Dialog, { open: errorApproval.open },
                React.createElement(DialogTitle, null,
                    React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                        errorApproval.title,
                        React.createElement(IconButton, { "aria-label": 'close', onClick: () => setErrorApproval({
                                title: 'Campos/Funções obrigatórios para lançar para aprovação',
                                open: false,
                                msg: null,
                            }), style: { position: 'absolute', right: 8, top: 8 } },
                            React.createElement(Close, null)))),
                React.createElement(DialogContent, null, errorApproval.msg)))));
};
export default Form;
//# sourceMappingURL=index.js.map