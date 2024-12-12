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
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useConfirmation, useContextWebpart, useLoggedUser, useNotification, useTeam, } from '~/hooks';
import InfoForm from './InfoForm';
import FantasyNameForm from './FantasyNameForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import RelatedClass from './RelatedClass';
import Teams from './Teams';
import { PERSON, PREFIX } from '~/config/database';
import { Anexos, Backdrop } from '~/components';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import { EFatherTag, EGroups } from '~/config/enums';
import { AccessTime, CheckCircle, Close, Replay, Visibility, VisibilityOff, } from '@material-ui/icons';
import * as _ from 'lodash';
import { BoxCloseIcon } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateProgram, getProgramId, getPrograms, updateProgram, } from '~/store/modules/program/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../../HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import AddTeam from '~/components/AddTeam';
import { getTeamById } from '~/store/modules/team/actions';
const Form = ({ program, isModel, isDraft, isProgramResponsible, isLoadModel, tagsOptions, peopleOptions, dictTag, dictPeople, refetchProgram, handleClose, setProgram, }) => {
    var _a, _b, _c, _d, _e;
    const programResponsible = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.RESPONSAVEL_PELO_PROGRAMA);
    const DEFAULT_VALUES = {
        title: '',
        sigla: '',
        isReserve: false,
        typeProgram: null,
        nameProgram: null,
        institute: null,
        company: null,
        responsible: null,
        temperature: null,
        description: '',
        model: isModel,
        anexos: [],
        names: [{ keyId: v4(), name: '', nameEn: '', nameEs: '', use: '' }],
        relatedClass: [{ keyId: v4(), team: null, relatedTeam: null }],
        people: [
            {
                keyId: v4(),
                person: null,
                isRequired: true,
                function: Object.assign({}, programResponsible),
            },
        ],
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [isDetail, setIsDetail] = React.useState(!isLoadModel && program);
    const [loading, setLoading] = React.useState(false);
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [loadingApproval, setLoadingApproval] = React.useState({});
    const [currentProgram, setCurrentProgram] = React.useState();
    const [editLoading, setEditLoading] = React.useState(false);
    const [valuesSetted, setValuesSetted] = React.useState(false);
    const [isSubmitted, setIsSubmetted] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [teamSelected, setTeamSelected] = React.useState();
    const [openAddTeam, setOpenAddTeam] = React.useState(false);
    const [errorApproval, setErrorApproval] = React.useState({
        open: false,
        msg: null,
    });
    const { app } = useSelector((state) => state);
    const { tooltips } = app;
    const { notification } = useNotification();
    const { context } = useContextWebpart();
    const { currentUser } = useLoggedUser();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const updateTemperature = React.useRef(false);
    const dispatch = useDispatch();
    const programDirector = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA);
    const [{ teams }] = useTeam({
        active: 'Ativo',
    });
    const dictTeam = React.useMemo(() => {
        const teamMap = new Map();
        if (teams === null || teams === void 0 ? void 0 : teams.length) {
            teams === null || teams === void 0 ? void 0 : teams.forEach((team) => teamMap.set(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`], team));
        }
        return teamMap;
    }, [teams]);
    const refAnexo = React.useRef();
    const validationSchema = yup.object({
        nameProgram: yup.mixed().required('Campo Obrigatório'),
        sigla: yup.string().required('Campo Obrigatório'),
    });
    const validationSchemaModel = yup.object({
        title: yup.string().required('Campo Obrigatório'),
        nameProgram: yup.mixed().required('Campo Obrigatório'),
        sigla: yup.string().required('Campo Obrigatório'),
    });
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
        if (program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`]) {
            setLoading(true);
            getProgramId(program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`])
                .then(({ value }) => {
                setLoading(false);
                setCurrentProgram(value[0]);
            })
                .catch(() => {
                notification.error({
                    title: 'Falha',
                    description: 'Houve um erro interno!',
                });
                setLoading(false);
            });
        }
    }, [program]);
    React.useEffect(() => {
        if (currentProgram && dictTag && dictPeople && dictTeam && !valuesSetted) {
            const iniVal = formatValues(currentProgram);
            setInitialValues(iniVal);
            setPastValues(iniVal);
            setValuesSetted(true);
            getFiles(sp, `Anexos Interno/Programa/${moment(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram.createdon).format('YYYY')}/${currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`]}`).then((files) => {
                formik.setFieldValue('anexos', files);
                setPastValues(Object.assign(Object.assign({}, iniVal), { anexos: files }));
            });
            if ((currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                setIsDetail(false);
            }
        }
    }, [currentProgram, dictTag, dictPeople, teams, dictTeam]);
    const handleUndo = (newProgram) => {
        var _a, _b, _c, _d;
        setValuesSetted(false);
        const programUndo = JSON.parse(localStorage.getItem('undoProgram'));
        const peopleToDelete = [];
        const namesToDelete = [];
        (_a = newProgram === null || newProgram === void 0 ? void 0 : newProgram[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = programUndo === null || programUndo === void 0 ? void 0 : programUndo.people) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidasprogramaid`]));
            if (envolvedSaved) {
                peopleToDelete.push(envolvedSaved);
            }
            else {
                const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                peopleToDelete.push(Object.assign(Object.assign({}, e), { keyId: v4(), deleted: true, isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasprogramaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func }));
            }
        });
        (_b = programUndo === null || programUndo === void 0 ? void 0 : programUndo.people) === null || _b === void 0 ? void 0 : _b.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newProgram === null || newProgram === void 0 ? void 0 : newProgram[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasprogramaid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_c = newProgram === null || newProgram === void 0 ? void 0 : newProgram[`${PREFIX}Programa_NomePrograma`]) === null || _c === void 0 ? void 0 : _c.forEach((e) => {
            var _a;
            const nameSaved = (_a = programUndo === null || programUndo === void 0 ? void 0 : programUndo.names) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeprogramaid`]));
            if (nameSaved) {
                namesToDelete.push(nameSaved);
            }
            else {
                namesToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}nomeprogramaid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_d = programUndo === null || programUndo === void 0 ? void 0 : programUndo.names) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const nameSaved = (_a = newProgram === null || newProgram === void 0 ? void 0 : newProgram[`${PREFIX}Programa_NomePrograma`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nomeprogramaid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(addOrUpdateProgram(Object.assign(Object.assign({}, programUndo), { group: myGroup(), isLoadModel, people: peopleToDelete, names: namesToDelete, previousPeople: [], previousNames: [] }), {
            onSuccess: (pr) => {
                refetchProgram === null || refetchProgram === void 0 ? void 0 : refetchProgram();
                setProgram(pr);
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
    const formatValues = (item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const formatted = {
            id: item[`${PREFIX}programaid`] || '',
            title: item[`${PREFIX}titulo`] || '',
            sigla: item[`${PREFIX}sigla`] || '',
            model: item[`${PREFIX}modelo`],
            isReserve: item[`${PREFIX}ehreserva`],
            modeloid: item === null || item === void 0 ? void 0 : item.modeloid,
            typeProgram: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}TipoPrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) ||
                null,
            nameProgram: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}NomePrograma`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) ||
                null,
            institute: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Instituto`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]]) ||
                null,
            company: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_d = item === null || item === void 0 ? void 0 : item[`${PREFIX}Empresa`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]]) || null,
            temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_e = item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`]]) ||
                null,
            responsible: (dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[(_f = item === null || item === void 0 ? void 0 : item[`${PREFIX}ResponsavelpeloPrograma`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}pessoaid`]]) || null,
            description: item[`${PREFIX}observacao`] || '',
            anexos: [],
            teams: item.teams || [],
            relatedClass: ((_g = item === null || item === void 0 ? void 0 : item[`${PREFIX}ise_turmasrelacionadas_Programa_ise_progr`]) === null || _g === void 0 ? void 0 : _g.length)
                ? (_h = item === null || item === void 0 ? void 0 : item[`${PREFIX}ise_turmasrelacionadas_Programa_ise_progr`]) === null || _h === void 0 ? void 0 : _h.map((te) => ({
                    keyId: v4(),
                    id: te === null || te === void 0 ? void 0 : te[`${PREFIX}turmasrelacionadasid`],
                    team: dictTeam.get(te === null || te === void 0 ? void 0 : te[`_${PREFIX}turma_value`]),
                    relatedTeam: dictTeam.get(te === null || te === void 0 ? void 0 : te[`_${PREFIX}turmarelacionada_value`]),
                }))
                : [{ keyId: v4(), team: null, relatedTeam: null }],
            names: ((_j = item === null || item === void 0 ? void 0 : item[`${PREFIX}Programa_NomePrograma`]) === null || _j === void 0 ? void 0 : _j.length)
                ? (_k = item[`${PREFIX}Programa_NomePrograma`]) === null || _k === void 0 ? void 0 : _k.map((e) => ({
                    keyId: v4(),
                    id: e[`${PREFIX}nomeprogramaid`],
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
            people: [],
        };
        const peopleSaved = (_l = item[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _l === void 0 ? void 0 : _l.map((e) => {
            var _a;
            const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                : {};
            func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
            return Object.assign(Object.assign({}, e), { keyId: v4(), isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasprogramaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func });
        });
        if (!(peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.some((peo) => {
            var _a;
            return ((_a = peo.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                EFatherTag.RESPONSAVEL_PELO_PROGRAMA;
        }))) {
            const func = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.RESPONSAVEL_PELO_PROGRAMA);
            peopleSaved.push({
                keyId: v4(),
                isRequired: true,
                function: func,
            });
        }
        formatted.people = peopleSaved === null || peopleSaved === void 0 ? void 0 : peopleSaved.sort((a, b) => (a === null || a === void 0 ? void 0 : a[`${PREFIX}ordem`]) - (b === null || b === void 0 ? void 0 : b[`${PREFIX}ordem`]));
        return formatted;
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
                    handleSave();
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
    const handleSuccess = (newProgram) => {
        // handleClose();
        if (updateTemperature.current) {
            dispatch(executeChangeTemperature({
                origin: 'Programa',
                idOrigin: program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`],
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
        setLoading(false);
        notification.success({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso',
        });
        if (pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(newProgram));
        }
        setProgram(newProgram);
        // @ts-ignore
        if (formik.values.close) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
        }
    };
    const handleError = (error, newProgram) => {
        var _a, _b;
        console.log(error);
        setLoading(false);
        if (newProgram) {
            setProgram(newProgram);
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
        dispatch(addOrUpdateProgram(body, {
            onSuccess: handleSuccess,
            onError: handleError,
        }, forceCreate));
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: isModel ? validationSchemaModel : validationSchema,
        onSubmit: (values) => {
            var _a, _b, _c, _d;
            setIsSubmetted(true);
            if (!isModel) {
                const functionsRequired = {
                    programResponsible: false,
                };
                values.people.forEach((envolved) => {
                    var _a;
                    if (((_a = envolved.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                        EFatherTag.RESPONSAVEL_PELO_PROGRAMA &&
                        envolved.person &&
                        !(envolved === null || envolved === void 0 ? void 0 : envolved.deleted)) {
                        functionsRequired.programResponsible = true;
                    }
                });
                if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
                    setLoadingApproval(false);
                    setLoading(false);
                    setErrorApproval({
                        open: true,
                        msg: (React.createElement("div", null,
                            React.createElement(Typography, null, "Falta informar as pessoas para seguintes fun\u00E7\u00F5es:"),
                            React.createElement("ul", null, !functionsRequired.programResponsible && (React.createElement("li", null,
                                React.createElement("strong", null, EFatherTag.RESPONSAVEL_PELO_PROGRAMA)))))),
                    });
                    return;
                }
            }
            const files = (_a = refAnexo === null || refAnexo === void 0 ? void 0 : refAnexo.current) === null || _a === void 0 ? void 0 : _a.getAnexos();
            setLoading(true);
            setValuesSetted(false);
            localStorage.setItem('undoProgram', JSON.stringify(pastValues));
            if (!isModel &&
                (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`]) &&
                (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_Turma`].length) &&
                ((_b = currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]) !==
                    ((_d = (_c = formik.values) === null || _c === void 0 ? void 0 : _c.temperature) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`])) {
                confirmation.openConfirmation({
                    title: 'Alteração de Temperatura',
                    description: 'Deseja atualizar a temperatura dos subordinados?',
                    yesLabel: 'Sim',
                    noLabel: 'Não',
                    onConfirm: () => {
                        handleSaveSubmit(Object.assign(Object.assign({}, values), { group: myGroup(), isLoadModel, anexos: files, id: currentProgram[`${PREFIX}programaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], previousPeople: currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`] || [], previousNames: currentProgram[`${PREFIX}Programa_NomePrograma`] || [] }), true);
                    },
                    onCancel: () => {
                        handleSaveSubmit(Object.assign(Object.assign({}, values), { group: myGroup(), isLoadModel, anexos: files, id: currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], previousPeople: (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`]) || [], previousNames: (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_NomePrograma`]) || [] }), false);
                    },
                });
            }
            else {
                handleSaveSubmit(Object.assign(Object.assign({}, values), { group: myGroup(), isLoadModel, anexos: files, id: currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], previousPeople: (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`]) || [], previousNames: (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_NomePrograma`]) || [] }), false);
            }
            // dispatch(
            //   addOrUpdateProgram(
            //     {
            //       ...values,
            //       group: myGroup(),
            //       isLoadModel,
            //       anexos: files,
            //       id: program[`${PREFIX}programaid`],
            //       user: currentUser?.[`${PREFIX}pessoaid`],
            //       previousPeople:
            //         program[`${PREFIX}Programa_PessoasEnvolvidas`] || [],
            //       previousNames: program[`${PREFIX}Programa_NomePrograma`] || [],
            //     },
            //     {
            //       onSuccess: handleSuccess,
            //       onError: handleError,
            //     }
            //   )
            // );
        },
    });
    const handleSave = () => {
        var _a, _b, _c, _d;
        if (!isModel) {
            setLoading(true);
            getPrograms({
                active: 'Ativo',
                model: false,
                nameProgram: (_a = formik.values.nameProgram) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`],
                typeProgram: (_b = formik.values.typeProgram) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`],
                institute: (_c = formik.values.institute) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`],
                company: (_d = formik.values.company) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`],
            }).then((data) => {
                var _a;
                if (data.length &&
                    ((_a = data === null || data === void 0 ? void 0 : data[0]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}programaid`]) !==
                        (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`])) {
                    setLoading(false);
                    notification.error({
                        title: 'Programa existente',
                        description: 'Programa já cadastrado, verifique o nome',
                    });
                }
                else {
                    setLoading(false);
                    formik.handleSubmit();
                }
            });
        }
        else {
            formik.handleSubmit();
        }
    };
    const refreshProgram = () => {
        setValuesSetted(false);
        setLoading(true);
        getProgramId(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`])
            .then(({ value }) => {
            setLoading(false);
            setProgram(value[0]);
        })
            .catch(() => {
            notification.error({
                title: 'Falha',
                description: 'Houve um erro interno!',
            });
            setLoading(false);
        });
    };
    const handleToApprove = () => {
        const functionsRequired = {
            programResponsible: false,
        };
        formik.values.people.forEach((envolved) => {
            var _a;
            if (((_a = envolved.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                EFatherTag.RESPONSAVEL_PELO_PROGRAMA) {
                functionsRequired.programResponsible = true;
            }
        });
        if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
            setLoadingApproval(false);
            setErrorApproval({
                open: true,
                msg: (React.createElement("div", null,
                    React.createElement(Typography, null, "Falta informar as seguintes fun\u00E7\u00F5es:"),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("strong", null, "Repons\u00E1vel pelo programa"))))),
            });
            return;
        }
        updateProgram(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], {
            [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
        }, {
            onSuccess: (it) => {
                setProgram(it);
                setLoadingApproval(false);
            },
            onError: () => {
                setLoadingApproval(false);
            },
        });
    };
    const handleAproval = (nameField, dateField) => {
        setLoadingApproval({ [nameField]: true });
        updateProgram(currentProgram[`${PREFIX}programaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}${dateField}`]: moment().format(),
        }, {
            onSuccess: (pro) => {
                setLoadingApproval({});
                setProgram(pro);
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
        updateProgram(program[`${PREFIX}programaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: null,
            [`${PREFIX}${dateField}`]: null,
        }, {
            onSuccess: (pro) => {
                setLoadingApproval({});
                setProgram(pro);
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
        updateProgram(currentProgram[`${PREFIX}programaid`], {
            [`${PREFIX}publicado`]: !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}publicado`]),
        }, {
            onSuccess: (it) => {
                setProgram(it);
                setPublishLoading(false);
            },
            onError: () => {
                setPublishLoading(false);
            },
        });
    };
    const handleEdit = () => {
        setEditLoading(true);
        updateProgram(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], {
            [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}datahoraeditanto`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setProgram(act);
                setEditLoading(false);
                setIsDetail(false);
            },
            onError: () => { },
        });
    };
    const handleResetEditing = () => __awaiter(void 0, void 0, void 0, function* () {
        if ((currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) !==
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setIsDetail(false);
            setValuesSetted(false);
            return;
        }
        setEditLoading(true);
        yield updateProgram(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], {
            [`${PREFIX}Editanto@odata.bind`]: null,
            [`${PREFIX}datahoraeditanto`]: null,
        }, {
            onSuccess: (act) => {
                setInitialValues(DEFAULT_VALUES);
                setIsDetail(false);
                formik.resetForm();
                handleClose();
                setValuesSetted(false);
            },
            onError: () => null,
        });
    });
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const handleTeam = (team) => {
        getTeamById(team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]).then(({ value }) => {
            setTeamSelected(value[0]);
            setOpenAddTeam(true);
        });
    };
    const handleCloseTeam = () => {
        setTeamSelected(null);
        setOpenAddTeam(false);
        refreshProgram();
    };
    const canEdit = React.useMemo(() => {
        var _a, _b;
        const programDirectorProgram = (_a = currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((env) => (env === null || env === void 0 ? void 0 : env[`_${PREFIX}funcao_value`]) ===
            (programDirector === null || programDirector === void 0 ? void 0 : programDirector[`${PREFIX}etiquetaid`]));
        return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            (programDirectorProgram === null || programDirectorProgram === void 0 ? void 0 : programDirectorProgram[`_${PREFIX}pessoa_value`]) ===
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ||
            ((_b = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.some((cUser) => {
                var _a;
                return (_a = currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
            })) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}criadopor_value`]));
    }, [currentUser]);
    const isProgramDirector = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, currentProgram, dictPeople]);
    const isFinance = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.FINANCEIRO) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, currentProgram, dictPeople]);
    const programTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Programa');
    return (React.createElement(React.Fragment, null,
        React.createElement(BoxCloseIcon, null,
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(AddTeam, { teams: teams, context: context, isDraft: (((_a = teamSelected === null || teamSelected === void 0 ? void 0 : teamSelected[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                currentProgram) === EFatherTag.RASCUNHO, 
            // refetch={updateAll}
            open: openAddTeam, program: currentProgram, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isFinance: isFinance, team: teamSelected, setTeam: setTeamSelected, teamLength: teams === null || teams === void 0 ? void 0 : teams.length, company: (_b = currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Empresa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`], programId: currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], handleClose: handleCloseTeam }),
        React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', padding: '2rem', minWidth: '30rem', style: { gap: '10px' } },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '2rem' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`])
                        ? 'Alterar Programa'
                        : 'Cadastrar Programa'),
                    React.createElement(HelperTooltip, { content: programTooltip === null || programTooltip === void 0 ? void 0 : programTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                canEdit ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '2rem' } },
                    (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) &&
                        (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) !==
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Box, null,
                        React.createElement(Typography, { variant: 'subtitle2', style: { fontWeight: 'bold' } }, "Outra pessoa est\u00E1 editanto esse programa"),
                        React.createElement(Typography, { variant: 'subtitle2' }, (_c = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]]) === null || _c === void 0 ? void 0 :
                            _c[`${PREFIX}nomecompleto`],
                            ' ',
                            "-",
                            ' ',
                            moment(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}datahoraeditanto`]).format('DD/MM/YYYY HH:mm:ss')))) : null,
                    !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) ||
                        (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}editanto_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Editar'))) : (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Liberar'))))) : null),
            React.createElement(Box, { flex: '1 0 auto', overflow: 'auto', maxHeight: 'calc(100vh - 12rem)', maxWidth: '50rem' },
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' }, defaultExpanded: true },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Informa\u00E7\u00F5es")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(InfoForm, { isModel: isModel, isDraft: isDraft, program: currentProgram, isDetail: isDetail, tags: tagsOptions, loadingApproval: loadingApproval, handleAproval: handleAproval, handleEditApproval: handleEditApproval, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange, isProgramResponsible: isProgramResponsible }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Nome Fantasia")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaonomefantasia_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaonomefantasia_value`]) &&
                                    !isModel &&
                                    !isDraft && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) &&
                                    !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaonomefantasia_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFantasia) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoNomeFantasia', 'dataaprovacaonomefantasia'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(FantasyNameForm, { isDetail: isDetail ||
                                    (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaonomefantasia_value`]), values: formik.values, errors: formik.errors, setValues: formik.setValues, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Pessoas Envolvidas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(EnvolvedPeopleForm, { isDetail: isDetail, isModel: isModel, isDraft: isDraft, programId: currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`], values: formik.values, errors: formik.errors, tags: tagsOptions, dictTag: dictTag, persons: peopleOptions, setProgram: setProgram, currentUser: currentUser, setValues: formik.setValues, setFieldValue: formik.setFieldValue }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Turmas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Teams, { isDetail: isDetail, handleTeam: handleTeam, refreshProgram: refreshProgram, teams: currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}Programa_Turma`], isSaved: !!(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`]) }))),
                !isModel && (React.createElement(Accordion, { elevation: 3, disabled: !currentProgram, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Turmas Relacionadas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(RelatedClass, { isDetail: isDetail, program: currentProgram, teams: teams, values: formik.values, errors: formik.errors, setValues: formik.setValues, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Anexos")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoanexos_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoAnexos) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoAnexos', 'dataaprovacaoanexos'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoanexos_value`]) &&
                                    !isModel &&
                                    !isDraft && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) &&
                                    !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoanexos_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoAnexos) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoAnexos', 'dataaprovacaoanexos'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(Anexos, { ref: refAnexo, disabled: isDetail ||
                                    !!(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoanexos_value`]), anexos: formik.values.anexos })))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Observa\u00E7\u00E3o")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%', style: { gap: '10px' } },
                            (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoobservacao_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                                React.createElement(Box, null, (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoObservacao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoObservacao', 'dataaprovacaoobservacao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '40%' },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoobservacao_value`]) &&
                                    !isModel &&
                                    !isDraft && (React.createElement(React.Fragment, null,
                                    React.createElement(AccessTime, { fontSize: 'small' }),
                                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                                (isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) &&
                                    !(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoobservacao_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoObservacao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoObservacao', 'dataaprovacaoobservacao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null),
                            React.createElement(FormControl, { fullWidth: true },
                                React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 3, disabled: isDetail ||
                                        !!(currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`_${PREFIX}aprovacaoobservacao_value`]), inputProps: { maxLength: 2000 }, type: 'text', name: 'description', onChange: (nextValue) => formik.setFieldValue('description', nextValue.target.value), value: formik.values.description }),
                                React.createElement(FormHelperText, null,
                                    ((_e = (_d = formik === null || formik === void 0 ? void 0 : formik.values) === null || _d === void 0 ? void 0 : _d.description) === null || _e === void 0 ? void 0 : _e.length) || 0,
                                    "/2000")))))),
            React.createElement(Box, { width: '100%', marginTop: '1rem', display: 'flex', padding: '1rem', justifyContent: 'space-between' },
                React.createElement(Box, null, isModel && canEdit && (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}programaid`]) ? (React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: handlePublish, startIcon: (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}publicado`]) ? (React.createElement(VisibilityOff, null)) : (React.createElement(Visibility, null)) }, publishLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : (currentProgram === null || currentProgram === void 0 ? void 0 : currentProgram[`${PREFIX}publicado`]) ? ('Despublicar') : ('Publicar'))) : null),
                React.createElement(Box, { display: 'flex', style: { gap: '1rem' } },
                    React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                    React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !canEdit || isDetail, onClick: handleSave }, "Salvar"))),
            React.createElement(Dialog, { open: errorApproval.open },
                React.createElement(DialogTitle, null,
                    React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                        "Campos/Fun\u00E7\u00F5es obrigat\u00F3rios",
                        React.createElement(IconButton, { "aria-label": 'close', onClick: () => setErrorApproval({ open: false, msg: null }), style: { position: 'absolute', right: 8, top: 8 } },
                            React.createElement(Close, null)))),
                React.createElement(DialogContent, null, errorApproval.msg)))));
};
export default Form;
//# sourceMappingURL=index.js.map