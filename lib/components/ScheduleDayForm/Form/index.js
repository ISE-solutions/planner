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
import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, TextField, Tooltip, Typography, } from '@material-ui/core';
import { CheckCircle, Close, ExpandMore, Publish, Replay, Visibility, VisibilityOff, } from '@material-ui/icons';
import { BoxCloseIcon } from './styles';
import { useFormik } from 'formik';
import { v4 } from 'uuid';
import InfoForm from './InfoForm';
import ActivitiesForm from './ActivitiesForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import { Anexos, Backdrop } from '~/components';
import { useConfirmation, useNotification, useScheduleDay } from '~/hooks';
import * as moment from 'moment';
import { PERSON, PREFIX } from '~/config/database';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import formatActivityModel from '~/utils/formatActivityModel';
import { EFatherTag, EGroups } from '~/config/enums';
import checkPermitionByTag from '~/utils/checkPermitionByTag';
import { addUpdateSchedule, getSchedules, } from '~/store/modules/schedule/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { batchAddNotification } from '~/store/modules/notification/actions';
import HelperTooltip from '~/components/HelperTooltip';
import useUndo from '~/hooks/useUndo';
import { executeChangeTemperature } from '~/store/modules/genericActions/actions';
import LoadModel from './LoadModel';
import { getActivityByScheduleId } from '~/store/modules/activity/actions';
const Form = ({ teamId, program, team, programId, isModel, isDraft, isGroup, isLoadModel, isScheduleModel, titleRequired, setScheduleModel, isProgramResponsible, isProgramDirector, isHeadOfService, schedule: scheduleSaved, context, dictTag, dictSpace, dictPeople, tagsOptions, spaceOptions, peopleOptions, setSchedule, handleClose, }) => {
    var _a, _b, _c;
    const DEFAULT_VALUES = {
        name: '',
        date: isScheduleModel && !scheduleSaved
            ? moment('2006-01-01', 'YYYY-MM-DD')
            : null,
        module: null,
        startTime: null,
        duration: null,
        endTime: null,
        modality: null,
        tool: null,
        toolBackup: null,
        temperature: null,
        place: null,
        link: '',
        linkBackup: '',
        activities: [],
        activitiesToDelete: [],
        observation: '',
        isGroupActive: false,
        anexos: [],
        people: [{ keyId: v4(), person: null, function: null }],
        locale: [{ keyId: v4(), space: null, observation: '' }],
    };
    const [dateReference, setDateReference] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [publishLoading, setPublishLoading] = React.useState(false);
    const [isSaveAsModel, setSaveAsModel] = React.useState(false);
    const [editLoading, setEditLoading] = React.useState(false);
    const [openLoad, setOpenLoad] = React.useState(false);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [isDetail, setIsDetail] = React.useState(!isLoadModel && scheduleSaved);
    const [loadingApproval, setLoadingApproval] = React.useState({});
    const [valuesSetted, setValuesSetted] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [errorApproval, setErrorApproval] = React.useState({
        open: false,
        msg: null,
    });
    const updateTemperature = React.useRef(false);
    const dispatch = useDispatch();
    const { undo } = useUndo();
    const { app } = useSelector((state) => state);
    const { tooltips } = app;
    const programDirector = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.DIRETOR_PROGRAMA);
    const coordination = tagsOptions.find((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) &&
        (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COORDENACAO_ADMISSOES);
    const validationSchema = yup.object({
        date: yup.mixed().required('Campo Obrigatório'),
    });
    const validationSchemaModel = yup.object({
        name: yup.string().required('Campo Obrigatório'),
        date: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            message: 'Data Inválida',
            exclusive: true,
            name: 'invalidDateMessage',
            test: (val) => {
                return val === null || val === void 0 ? void 0 : val.isValid();
            },
        }),
    });
    const refAnexo = React.useRef();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { person } = useSelector((state) => state);
    const { persons } = person;
    const currentUser = React.useMemo(() => {
        if (peopleOptions === null || peopleOptions === void 0 ? void 0 : peopleOptions.length) {
            const myEmail = context.pageContext.user.email || context.pageContext.user.loginName;
            const people = peopleOptions === null || peopleOptions === void 0 ? void 0 : peopleOptions.find((pe) => {
                var _a;
                return ((_a = pe === null || pe === void 0 ? void 0 : pe[`${PREFIX}email`]) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) ===
                    (myEmail === null || myEmail === void 0 ? void 0 : myEmail.toLocaleLowerCase());
            });
            return Object.assign(Object.assign({}, people), { isPlanning: checkPermitionByTag(tagsOptions, people === null || people === void 0 ? void 0 : people[`${PREFIX}Pessoa_Etiqueta_Etiqueta`], EFatherTag.PLANEJAMENTO) });
        }
    }, [peopleOptions]);
    const [{ schedule, updateSchedule, updateEnvolvedPerson }] = useScheduleDay({
        date: dateReference === null || dateReference === void 0 ? void 0 : dateReference.format('YYYY-MM-DD'),
        active: 'Ativo',
        teamId: teamId,
        model: isModel,
        group: isGroup ? 'Sim' : 'Não',
        filterTeam: true,
    }, {
        manual: true,
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
        var _a, _b, _c, _d, _e;
        if (Object.keys(dictPeople).length && ((schedule === null || schedule === void 0 ? void 0 : schedule.length) || scheduleSaved)) {
            const scheduleDay = scheduleSaved || schedule[0];
            const iniVal = {
                id: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}cronogramadediaid`],
                modeloid: scheduleDay.modeloid,
                baseadoemcronogramadiamodelo: scheduleDay.baseadoemcronogramadiamodelo,
                name: (scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}nome`]) || '',
                date: isLoadModel && isModel
                    ? moment.utc(scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}data`])
                    : isLoadModel
                        ? null
                        : moment.utc(scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}data`]),
                module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}modulo_value`]],
                modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}modalidade_value`]],
                tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}ferramenta_value`]],
                isGroupActive: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}agrupamentoatividade`],
                startTime: (scheduleDay[`${PREFIX}inicio`] &&
                    moment(scheduleDay[`${PREFIX}inicio`], 'HH:mm')) ||
                    null,
                endTime: (scheduleDay[`${PREFIX}fim`] &&
                    moment(scheduleDay[`${PREFIX}fim`], 'HH:mm')) ||
                    null,
                duration: (scheduleDay[`${PREFIX}duracao`] &&
                    moment(scheduleDay[`${PREFIX}duracao`], 'HH:mm')) ||
                    null,
                toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}ferramentabackup_value`]],
                place: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}local_value`]],
                link: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}link`],
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) || null,
                linkBackup: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}linkbackup`],
                observation: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}observacao`],
                anexos: [],
                activities: [],
                activitiesToDelete: [],
                people: ((_b = scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.length)
                    ? (_c = scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return {
                            keyId: v4(),
                            id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                            function: func,
                        };
                    })
                    : [{ keyId: v4(), person: null, function: null }],
                locale: ((_d = scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _d === void 0 ? void 0 : _d.length)
                    ? (_e = scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _e === void 0 ? void 0 : _e.map((e) => ({
                        keyId: v4(),
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                        space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                        observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
                    }))
                    : [{ keyId: v4(), person: null, function: null }],
            };
            let newActivities = [];
            getActivityByScheduleId((scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}cronogramadediaid`]) || scheduleDay.modeloid).then(({ value }) => {
                newActivities = value === null || value === void 0 ? void 0 : value.map((act) => {
                    var _a, _b, _c, _d, _e;
                    let activity = Object.assign(Object.assign({}, act), { teamId,
                        programId, id: act[`${PREFIX}atividadeid`], name: act[`${PREFIX}nome`] || '', quantity: act[`${PREFIX}quantidadesessao`] || 0, theme: act[`${PREFIX}temaaula`] || '', area: act[`${PREFIX}AreaAcademica`]
                            ? Object.assign(Object.assign({}, act[`${PREFIX}AreaAcademica`]), { value: (_a = act[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], label: (_b = act[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`] }) : null, spaces: ((_c = act[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.length)
                            ? act[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                            : [], people: ((_d = act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _d === void 0 ? void 0 : _d.length)
                            ? (_e = act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _e === void 0 ? void 0 : _e.map((e) => {
                                var _a;
                                const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                                func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                                const pe = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]];
                                return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: pe, function: func });
                            })
                            : [
                                {
                                    keyId: v4(),
                                    person: null,
                                    function: null,
                                },
                            ], startDate: moment(act[`${PREFIX}datahorainicio`]), endDate: moment(act[`${PREFIX}datahorafim`]), startTime: (act[`${PREFIX}inicio`] &&
                            moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
                            null, duration: (act[`${PREFIX}duracao`] &&
                            moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
                            null, endTime: (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
                            null, keyId: v4() });
                    if (isLoadModel) {
                        delete activity[`${PREFIX}atividadeid`];
                    }
                    return activity;
                }).sort((a, b) => a.startTime.unix() - b.startTime.unix());
                // setPastValues({ ...iniVal, activities: newActivities });
                setInitialValues(iniVal);
                setValuesSetted(true);
                getFiles(sp, `Anexos Interno/Cronograma Dia/${moment(scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay.createdon).format('YYYY')}/${scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}cronogramadediaid`]}`)
                    .then((files) => {
                    formik.setFieldValue('anexos', files);
                    formik.setFieldValue('activities', newActivities);
                    setPastValues(Object.assign(Object.assign({}, iniVal), { activities: newActivities, anexos: files }));
                })
                    .catch(() => {
                    formik.setFieldValue('activities', newActivities);
                    setPastValues(Object.assign(Object.assign({}, iniVal), { activities: newActivities }));
                });
                if ((scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}editanto_value`]) ===
                    (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
                    setIsDetail(false);
                }
            });
        }
    }, [schedule, scheduleSaved]);
    const handleSuccess = (newSchedule) => {
        // handleClose();
        if (updateTemperature.current) {
            dispatch(executeChangeTemperature({
                origin: 'Cronograma de Dia',
                idOrigin: scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`],
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
        setSchedule(newSchedule);
        setIsLoading(false);
        setLoading(false);
        setScheduleModel(null);
        notification.success({
            title: 'Sucesso',
            description: (schedule === null || schedule === void 0 ? void 0 : schedule.length)
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
        if ((pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) || (pastValues === null || pastValues === void 0 ? void 0 : pastValues[`${PREFIX}cronogramadediaid`])) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(newSchedule));
        }
        // @ts-ignore
        if (formik.values.close) {
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            handleClose();
            setValuesSetted(false);
        }
    };
    const handleError = (error, newSchedule) => {
        var _a, _b;
        setLoading(false);
        setIsLoading(false);
        if (newSchedule) {
            setSchedule(newSchedule);
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
    const handleUndo = (newSchedule) => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g;
        setValuesSetted(false);
        const scheduleUndo = JSON.parse(localStorage.getItem('undoSchedule'));
        const peopleToDelete = [];
        const activitiesToUndo = [];
        (_d = newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = scheduleUndo === null || scheduleUndo === void 0 ? void 0 : scheduleUndo.people) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`]));
            if (envolvedSaved) {
                peopleToDelete.push(envolvedSaved);
            }
            else {
                const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                peopleToDelete.push(Object.assign(Object.assign({}, e), { keyId: v4(), deleted: true, isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidascronogramadiaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func }));
            }
        });
        (_e = scheduleUndo === null || scheduleUndo === void 0 ? void 0 : scheduleUndo.people) === null || _e === void 0 ? void 0 : _e.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidascronogramadiaid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        const newActivitiesRequest = yield getActivityByScheduleId(newSchedule === null || newSchedule === void 0 ? void 0 : newSchedule[`${PREFIX}cronogramadediaid`]);
        const newActivities = (_f = newActivitiesRequest === null || newActivitiesRequest === void 0 ? void 0 : newActivitiesRequest.value) === null || _f === void 0 ? void 0 : _f.map((act) => {
            var _a, _b, _c;
            let activity = Object.assign(Object.assign({}, act), { teamId,
                programId, startTime: (act[`${PREFIX}inicio`] &&
                    moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
                    null, duration: (act[`${PREFIX}duracao`] &&
                    moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
                    null, endTime: (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
                    null, id: act[`${PREFIX}atividadeid`], name: act[`${PREFIX}nome`] || '', quantity: act[`${PREFIX}quantidadesessao`] || 0, theme: act[`${PREFIX}temaaula`] || '', area: act[`${PREFIX}AreaAcademica`]
                    ? Object.assign(Object.assign({}, act[`${PREFIX}AreaAcademica`]), { value: (_a = act[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], label: (_b = act[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`] }) : null, spaces: ((_c = act[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.length)
                    ? act[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                    : [], keyId: v4() });
            if (isLoadModel) {
                delete activity[`${PREFIX}atividadeid`];
            }
            return activity;
        }).sort((a, b) => a.startTime.unix() - b.startTime.unix());
        newActivities === null || newActivities === void 0 ? void 0 : newActivities.forEach((e) => {
            var _a;
            const activitySaved = (_a = scheduleUndo === null || scheduleUndo === void 0 ? void 0 : scheduleUndo.activities) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}atividadeid`]));
            if (activitySaved) {
                activitiesToUndo.push(Object.assign(Object.assign({}, activitySaved), { teamId,
                    programId, id: activitySaved === null || activitySaved === void 0 ? void 0 : activitySaved[`${PREFIX}atividadeid`], startTime: moment(e === null || e === void 0 ? void 0 : e.startTime), duration: moment(e === null || e === void 0 ? void 0 : e.duration), endTime: moment(e === null || e === void 0 ? void 0 : e.endTime) }));
            }
            else {
                activitiesToUndo.push(Object.assign(Object.assign({}, e), { deleted: true }));
            }
        });
        (_g = scheduleUndo === null || scheduleUndo === void 0 ? void 0 : scheduleUndo.activities) === null || _g === void 0 ? void 0 : _g.forEach((e) => {
            const activitySaved = newActivities === null || newActivities === void 0 ? void 0 : newActivities.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp.id));
            if (!activitySaved) {
                activitiesToUndo.push(Object.assign(Object.assign({}, e), { id: null, [`${PREFIX}atividadeid`]: null, [`${PREFIX}ativo`]: true, deleted: false, temperature: scheduleUndo === null || scheduleUndo === void 0 ? void 0 : scheduleUndo.temperature, startTime: moment(e === null || e === void 0 ? void 0 : e.startTime), duration: moment(e === null || e === void 0 ? void 0 : e.duration), endTime: moment(e === null || e === void 0 ? void 0 : e.endTime) }));
            }
        });
        dispatch(addUpdateSchedule(Object.assign(Object.assign({}, scheduleUndo), { date: moment.utc(scheduleUndo.date).format('YYYY-MM-DD'), people: peopleToDelete, activities: activitiesToUndo }), teamId, programId, {
            onSuccess: (te) => {
                // re?.();
                setSchedule(te);
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
    });
    const handleSaveSubmit = (body, temperatureChanged) => {
        setValuesSetted(false);
        updateTemperature.current = temperatureChanged;
        dispatch(addUpdateSchedule(body, teamId, programId, {
            onSuccess: handleSuccess,
            onError: handleError,
        }, temperatureChanged));
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: isModel && titleRequired ? validationSchemaModel : validationSchema,
        onSubmit: (values) => {
            var _a, _b, _c, _d, _e, _f;
            localStorage.setItem('undoSchedule', JSON.stringify(pastValues));
            const files = (_a = refAnexo === null || refAnexo === void 0 ? void 0 : refAnexo.current) === null || _a === void 0 ? void 0 : _a.getAnexos();
            const newActivities = values.activities
                .concat(values.activitiesToDelete)
                .map((act) => {
                var _a;
                const spacesToDelete = [];
                (_a = act === null || act === void 0 ? void 0 : act[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                    var _a;
                    const spaceSaved = (_a = act === null || act === void 0 ? void 0 : act.spaces) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}espacoid`]) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]));
                    if (!spaceSaved) {
                        spacesToDelete.push(e);
                    }
                });
                return Object.assign(Object.assign({}, act), { spacesToDelete });
            });
            setLoading(true);
            let temp = values.temperature;
            if (!temp && (team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`])) {
                temp =
                    dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = team === null || team === void 0 ? void 0 : team[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]];
            }
            if (!temp && (program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`])) {
                temp =
                    dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = program === null || program === void 0 ? void 0 : program[`${PREFIX}Temperatura`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]];
            }
            const body = Object.assign(Object.assign({}, values), { isGroupActive: isGroup, temperature: temp, date: values.date.utc().format('YYYY-MM-DD'), group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], activities: newActivities === null || newActivities === void 0 ? void 0 : newActivities.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivityModel(actv, values.date, {
                    isModel: isModel,
                    dictPeople: dictPeople,
                    dictSpace: dictSpace,
                    dictTag: dictTag,
                    temp,
                })))) });
            if (!isModel &&
                (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`]) &&
                ((_d = scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}Temperatura`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]) !==
                    ((_f = (_e = formik.values) === null || _e === void 0 ? void 0 : _e.temperature) === null || _f === void 0 ? void 0 : _f[`${PREFIX}etiquetaid`])) {
                confirmation.openConfirmation({
                    title: 'Alteração de Temperatura',
                    description: 'Deseja atualizar a temperatura dos subordinados?',
                    yesLabel: 'Sim',
                    noLabel: 'Não',
                    onConfirm: () => {
                        handleSaveSubmit(Object.assign(Object.assign({}, body), { isLoadModel, group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], model: isModel, anexos: files }), true);
                    },
                    onCancel: () => {
                        handleSaveSubmit(Object.assign(Object.assign({}, body), { isLoadModel, group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], model: isModel, anexos: files }), false);
                    },
                });
            }
            else {
                handleSaveSubmit(Object.assign(Object.assign({}, body), { isLoadModel, group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], model: isModel, anexos: files }), false);
            }
        },
    });
    const onClose = () => __awaiter(void 0, void 0, void 0, function* () {
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
                onCancel: () => __awaiter(void 0, void 0, void 0, function* () {
                    handleResetEditing();
                }),
            });
        }
        else {
            handleResetEditing();
            // handleClose();
        }
    });
    const validateSpaces = () => {
        if (isModel) {
            formik.handleSubmit();
            return;
        }
        const values = formik.values;
        const spacesWarning = [];
        let qtdTeam;
        values.activities.forEach((actv) => {
            var _a;
            (_a = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.forEach((actvSpace) => {
                const space = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[actvSpace === null || actvSpace === void 0 ? void 0 : actvSpace[`${PREFIX}espacoid`]];
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
                            if ((fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}nome`]) === EFatherTag.PLANEJAMENTO) {
                                notifiers.push({
                                    title: 'Alerta uso espaço',
                                    link: `${context.pageContext.web.absoluteUrl}/SitePages/Programa.aspx?programid=${program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`]}&teamid=${team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]}&scheduleId=${team === null || team === void 0 ? void 0 : team[`${PREFIX}cronogramadediaid`]}`,
                                    description: `O(s) seguinte(s) espaço(s) ${spacesWarning === null || spacesWarning === void 0 ? void 0 : spacesWarning.map((e) => e === null || e === void 0 ? void 0 : e.label).join(' ;')} não possui capacidade suficientes para ${qtdTeam === null || qtdTeam === void 0 ? void 0 : qtdTeam[`${PREFIX}quantidade`]}
                    participantes no dia ${scheduleSaved} ${moment
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
                onCancel: () => {
                    setIsLoading(false);
                },
            });
            return;
        }
        formik.handleSubmit();
    };
    const onSave = () => __awaiter(void 0, void 0, void 0, function* () {
        var _h;
        setSaveAsModel(false);
        const errors = yield formik.validateForm();
        if (Object.keys(errors).length) {
            return;
        }
        setIsLoading(true);
        if (!isScheduleModel) {
            getSchedules({
                date: typeof formik.values.date === 'string'
                    ? formik.values.date
                    : (_h = formik.values.date) === null || _h === void 0 ? void 0 : _h.format('YYYY-MM-DD'),
                active: 'Ativo',
                teamId: teamId,
                model: isModel,
                filterTeam: true,
            })
                .then((value) => {
                const othersSchedule = value.filter((sc) => (sc === null || sc === void 0 ? void 0 : sc[`${PREFIX}cronogramadediaid`]) !==
                    (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`]));
                setIsLoading(false);
                if (othersSchedule === null || othersSchedule === void 0 ? void 0 : othersSchedule.length) {
                    notification.error({
                        title: 'Data já sendo utilizada',
                        description: 'O dia informado já possui cadastro, verifique!',
                    });
                    return;
                }
                validateSpaces();
            })
                .catch(() => {
                setIsLoading(false);
            });
        }
        else {
            validateSpaces();
        }
    });
    const handleSave = () => {
        onSave();
    };
    const handleToApprove = () => {
        const functionsRequired = {
            operationResponsible: false,
            attendanceCoordination: false,
            attendanceProgramDirector: false,
        };
        formik.values.people.forEach((envolved) => {
            var _a, _b, _c;
            if (((_a = envolved.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                EFatherTag.RESPONSAVEL_PELA_OPERACAO) {
                functionsRequired.operationResponsible = true;
            }
            if (((_b = envolved.function) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) ===
                EFatherTag.COORDENACAO_ATENDIMENTO) {
                functionsRequired.attendanceCoordination = true;
            }
            if (((_c = envolved.function) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`]) ===
                EFatherTag.DIRECAO_PROGRAMA_DE_ATENDIMENTO) {
                functionsRequired.attendanceProgramDirector = true;
            }
        });
        if (Object.keys(functionsRequired).some((key) => !functionsRequired[key])) {
            setLoadingApproval(false);
            setErrorApproval({
                open: true,
                msg: (React.createElement("div", null,
                    React.createElement(Typography, null, "Falta informar as seguintes fun\u00E7\u00F5es:"),
                    React.createElement("ul", null,
                        !functionsRequired.operationResponsible && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.RESPONSAVEL_PELA_OPERACAO))),
                        !functionsRequired.attendanceCoordination && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.COORDENACAO_ATENDIMENTO))),
                        !functionsRequired.attendanceProgramDirector && (React.createElement("li", null,
                            React.createElement("strong", null, EFatherTag.DIRECAO_PROGRAMA_DE_ATENDIMENTO)))))),
            });
            return;
        }
        updateSchedule(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}LancarparaAprovacao@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
        }, {
            onSuccess: (it) => {
                setSchedule(it);
                setLoadingApproval(false);
            },
            onError: () => {
                setLoadingApproval(false);
            },
        });
    };
    const handleAproval = (nameField, dateField) => {
        setLoadingApproval({ [nameField]: true });
        updateSchedule(scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}${dateField}`]: moment().format(),
        }, {
            onSuccess: (te) => {
                setLoadingApproval({});
                setSchedule(te);
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
        updateSchedule(scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}${nameField}@odata.bind`]: null,
            [`${PREFIX}${dateField}`]: null,
        }, {
            onSuccess: (te) => {
                setLoadingApproval({});
                setSchedule(te);
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
        updateSchedule(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}publicado`]: !(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}publicado`]),
        }, {
            onSuccess: (it) => {
                setSchedule(it);
                setPublishLoading(false);
            },
            onError: () => {
                setPublishLoading(false);
            },
        });
    };
    const handleEdit = () => {
        setEditLoading(true);
        updateSchedule(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}Editanto@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}datahoraeditanto`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setSchedule(act);
                setEditLoading(false);
                setIsDetail(false);
            },
            onError: () => { },
        });
    };
    const handleResetEditing = () => __awaiter(void 0, void 0, void 0, function* () {
        if ((scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]) !==
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`])) {
            handleClose();
            setEditLoading(false);
            setIsDetail(false);
            setInitialValues(DEFAULT_VALUES);
            formik.resetForm();
            setValuesSetted(false);
            return;
        }
        setEditLoading(true);
        yield updateSchedule(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`], {
            [`${PREFIX}Editanto@odata.bind`]: null,
            [`${PREFIX}datahoraeditanto`]: null,
        }, {
            onSuccess: (act) => {
                handleClose();
                setEditLoading(false);
                setIsDetail(false);
                setInitialValues(DEFAULT_VALUES);
                formik.resetForm();
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
    const onLoadModel = (model, infoToLoad) => __awaiter(void 0, void 0, void 0, function* () {
        var _j, _k;
        if (infoToLoad.info) {
            formik.setFieldValue('module', dictTag === null || dictTag === void 0 ? void 0 : dictTag[model === null || model === void 0 ? void 0 : model[`_${PREFIX}modulo_value`]]);
            formik.setFieldValue('modality', dictTag === null || dictTag === void 0 ? void 0 : dictTag[model === null || model === void 0 ? void 0 : model[`_${PREFIX}modalidade_value`]]);
            formik.setFieldValue('place', dictTag === null || dictTag === void 0 ? void 0 : dictTag[model === null || model === void 0 ? void 0 : model[`_${PREFIX}local_value`]]);
            formik.setFieldValue('link', model === null || model === void 0 ? void 0 : model[`${PREFIX}link`]);
            formik.setFieldValue('temperature', dictTag === null || dictTag === void 0 ? void 0 : dictTag[model === null || model === void 0 ? void 0 : model[`_${PREFIX}temperatura_value`]]);
        }
        if (infoToLoad.activities) {
            const activities = yield getActivityByScheduleId(model === null || model === void 0 ? void 0 : model[`${PREFIX}cronogramadediaid`]);
            const currentActivity = _.cloneDeep(formik.values.activities);
            const newActivities = (_j = activities === null || activities === void 0 ? void 0 : activities.value) === null || _j === void 0 ? void 0 : _j.map((actv) => {
                var _a, _b, _c, _d, _e;
                delete actv[`${PREFIX}atividadeid`];
                actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
                    delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
                });
                actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
                    delete elm[`${PREFIX}nomeatividadeid`];
                });
                actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
                    delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
                });
                actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
                    delete elm[`${PREFIX}requisicaoacademicaid`];
                });
                actv.people = ((_a = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.length)
                    ? (_b = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        const pe = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]];
                        return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: pe, function: func });
                    })
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ];
                return Object.assign(Object.assign({}, actv), { teamId,
                    programId, name: actv[`${PREFIX}nome`] || '', quantity: actv[`${PREFIX}quantidadesessao`] || 0, theme: actv[`${PREFIX}temaaula`] || '', area: actv[`${PREFIX}AreaAcademica`]
                        ? Object.assign(Object.assign({}, actv[`${PREFIX}AreaAcademica`]), { value: (_c = actv[`${PREFIX}AreaAcademica`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], label: (_d = actv[`${PREFIX}AreaAcademica`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`] }) : null, spaces: ((_e = actv[`${PREFIX}Atividade_Espaco`]) === null || _e === void 0 ? void 0 : _e.length)
                        ? actv[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                        : [], startTime: (actv[`${PREFIX}inicio`] &&
                        moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
                        null, duration: (actv[`${PREFIX}duracao`] &&
                        moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
                        null, endTime: (actv[`${PREFIX}fim`] && moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
                        null, keyId: v4() });
            });
            formik.setFieldValue('activitiesToDelete', currentActivity === null || currentActivity === void 0 ? void 0 : currentActivity.map((e) => (Object.assign(Object.assign({}, e), { deleted: true }))));
            formik.setFieldValue('activities', newActivities.sort((a, b) => a.startTime.unix() - b.startTime.unix()));
        }
        if (infoToLoad.envolvedPeople) {
            const currentPeople = _.cloneDeep(formik.values.people);
            const newPeople = (_k = model[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _k === void 0 ? void 0 : _k.map((e) => {
                var _a;
                const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                return {
                    keyId: v4(),
                    id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                    person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                    function: func,
                };
            });
            formik.setFieldValue('people', newPeople.concat(currentPeople === null || currentPeople === void 0 ? void 0 : currentPeople.map((e) => (Object.assign(Object.assign({}, e), { deleted: true })))));
        }
        if (infoToLoad.attachments) {
            const anexos = yield getFiles(sp, `Anexos Interno/Cronograma Dia/${moment(model === null || model === void 0 ? void 0 : model.createdon).format('YYYY')}/${model === null || model === void 0 ? void 0 : model[`${PREFIX}cronogramadediaid`]}`);
            const anextosToDelete = _.cloneDeep(formik.values.anexos).map((e) => (Object.assign(Object.assign({}, e), { deveExcluir: true })));
            formik.setFieldValue('anexos', anexos.concat(anextosToDelete));
        }
        if (infoToLoad.observation) {
            formik.setFieldValue('observation', model === null || model === void 0 ? void 0 : model[`${PREFIX}observacao`]);
        }
    });
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
                return (_a = scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
            })) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}criadopor_value`]));
    }, [currentUser]);
    const scheduleTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Cronograma Dia');
    const infoParent = React.useMemo(() => {
        var _a;
        const info = [];
        if (program) {
            info.push((_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]);
        }
        if (team) {
            info.push(team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`]);
        }
        return info.join(' - ');
    }, []);
    return (React.createElement(React.Fragment, null,
        openLoad ? (React.createElement(LoadModel, { open: openLoad, onClose: () => setOpenLoad(false), onLoadModel: onLoadModel })) : null,
        React.createElement(Backdrop, { open: (loading || isLoading) && !isSaveAsModel },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', paddingRight: '2rem' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, isGroup ? (React.createElement(React.Fragment, null, (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`])
                        ? 'Alterar agrupamento de atividades'
                        : 'Criar agrupamento de atividades')) : (React.createElement(React.Fragment, null, (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`])
                        ? 'Alterar dia de aula'
                        : 'Criar dia de aula'))),
                    React.createElement(HelperTooltip, { content: scheduleTooltip === null || scheduleTooltip === void 0 ? void 0 : scheduleTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                canEdit ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '2rem' } },
                    (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]) &&
                        (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]) !==
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Box, null,
                        React.createElement(Typography, { variant: 'subtitle2', style: { fontWeight: 'bold' } },
                            "Outra pessoa est\u00E1 editanto esse",
                            ' ',
                            isGroup ? 'Agrupamento de Atividades' : 'dia de aula'),
                        React.createElement(Typography, { variant: 'subtitle2' }, (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]]) === null || _a === void 0 ? void 0 :
                            _a[`${PREFIX}nomecompleto`],
                            ' ',
                            "-",
                            ' ',
                            moment(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}datahoraeditanto`]).format('DD/MM/YYYY HH:mm:ss')))) : null,
                    !(scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]) ||
                        (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}editanto_value`]) ===
                            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ? (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Editar'))) : (React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !isDetail, onClick: handleEdit }, editLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Liberar'))))) : null),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                !isModel && canEdit && !isDetail ? (React.createElement(Box, { paddingLeft: '8px' },
                    React.createElement(Button, { startIcon: React.createElement(Publish, null), color: 'primary', disabled: isDetail, onClick: () => setOpenLoad(!openLoad) },
                        "Carregar ",
                        isGroup ? 'agrupamento de atividades' : 'dia de aula'))) : (React.createElement("div", null)),
                React.createElement(Typography, { variant: 'body2', style: { fontWeight: 700, maxWidth: '36rem' } }, infoParent)),
            React.createElement(BoxCloseIcon, null,
                React.createElement(IconButton, { onClick: onClose },
                    React.createElement(Close, null)))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { maxWidth: '50rem' },
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' }, defaultExpanded: true },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Informa\u00E7\u00F5es")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(InfoForm, { isDetail: isDetail, isGroup: isGroup, titleRequired: titleRequired, isDraft: isDraft, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isHeadOfService: isHeadOfService, schedule: scheduleSaved, loadingApproval: loadingApproval, handleAproval: handleAproval, handleEditApproval: handleEditApproval, tagsOptions: tagsOptions, setDateReference: setDateReference, isModel: isModel, isScheduleModel: isScheduleModel, teamId: teamId, values: formik.values, errors: formik.errors, setFieldValue: formik.setFieldValue, handleChange: formik.handleChange }))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Atividades")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(ActivitiesForm, { isDetail: isDetail, values: formik.values, errors: formik.errors, tagsOptions: tagsOptions, spaceOptions: spaceOptions, setFieldValue: formik.setFieldValue }))),
                !isGroup ? (React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Pessoas Envolvidas")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(EnvolvedPeopleForm, { isDetail: isDetail, isDraft: isDraft, values: formik.values, errors: formik.errors, tags: tagsOptions, dictTag: dictTag, currentUser: currentUser, setSchedule: setSchedule, scheduleId: scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`], persons: peopleOptions, setValues: formik.setValues, updateEnvolvedPerson: updateEnvolvedPerson, setFieldValue: formik.setFieldValue })))) : null,
                !isGroup && (React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Anexos")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Anexos, { ref: refAnexo, disabled: isDetail, anexos: formik.values.anexos })))),
                !isGroup ? (React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Observa\u00E7\u00E3o")),
                    React.createElement(AccordionDetails, null,
                        React.createElement(FormControl, { fullWidth: true },
                            React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 3, disabled: !canEdit || isDetail, inputProps: { maxLength: 2000 }, type: 'text', name: 'observation', onChange: (nextValue) => formik.setFieldValue('observation', nextValue.target.value), value: formik.values.observation }),
                            React.createElement(FormHelperText, null,
                                ((_c = (_b = formik === null || formik === void 0 ? void 0 : formik.values) === null || _b === void 0 ? void 0 : _b.observation) === null || _c === void 0 ? void 0 : _c.length) || 0,
                                "/2000"))))) : null)),
        React.createElement(Box, { width: '100%', marginTop: '2rem', display: 'flex', padding: '1rem', justifyContent: 'space-between' },
            React.createElement(Box, null,
                isModel &&
                    canEdit &&
                    (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}cronogramadediaid`]) &&
                    !teamId ? (React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: handlePublish, startIcon: (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}publicado`]) ? (React.createElement(VisibilityOff, null)) : (React.createElement(Visibility, null)) }, publishLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`${PREFIX}publicado`]) ? ('Despublicar') : ('Publicar'))) : null,
                !isModel &&
                    !isLoadModel &&
                    (scheduleSaved === null || scheduleSaved === void 0 ? void 0 : scheduleSaved[`_${PREFIX}lancarparaaprovacao_value`]) ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Lan\u00E7ado para aprova\u00E7\u00E3o"))) : null),
            React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                React.createElement(Button, { variant: 'contained', color: 'primary', disabled: !canEdit || isDetail, onClick: () => !((loading || isLoading) && !isSaveAsModel) && handleSave() }, "Salvar"))),
        React.createElement(Dialog, { open: errorApproval.open },
            React.createElement(DialogTitle, null,
                React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                    "Campos/Fun\u00E7\u00F5es obrigat\u00F3rios para lan\u00E7ar para aprova\u00E7\u00E3o",
                    React.createElement(IconButton, { "aria-label": 'close', onClick: () => setErrorApproval({ open: false, msg: null }), style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null, errorApproval.msg))));
};
export default Form;
//# sourceMappingURL=index.js.map