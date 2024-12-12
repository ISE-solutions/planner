var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { Dialog, AppBar, Tabs, Tab, Box, DialogContent, DialogActions, Button, CircularProgress, Typography, DialogTitle, IconButton, Tooltip, } from '@material-ui/core';
import * as yup from 'yup';
import { v4 } from 'uuid';
import Info from './Info';
import Classroom from './Classroom';
import Documents from './Documents';
import EnvolvedPerson from './EnvolvedPerson';
import Observation from './Observation';
import FantasyName from './FantasyName';
import styles from './AddActivityPlanning.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import { EActivityTypeApplication, TYPE_ACTIVITY, TYPE_RESOURCE, } from '~/config/enums';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { updateActivityAll, } from '~/store/modules/activity/actions';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import { Close, Replay } from '@material-ui/icons';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';
function TabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    return (React.createElement("div", Object.assign({ role: 'tabpanel', hidden: value !== index, id: `full-width-tabpanel-${index}`, "aria-labelledby": `full-width-tab-${index}` }, other), value === index && React.createElement(React.Fragment, null, children)));
}
function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
const AddActivityPlanning = ({ open, activityType, activity, refetch, handleClose, handleEdit, }) => {
    var _a, _b;
    const DEFAULT_VALUES = {
        name: null,
        startTime: null,
        duration: moment('00:05', 'HH:mm'),
        endTime: null,
        quantity: 0,
        area: null,
        course: null,
        spaces: [],
        theme: '',
        description: '',
        observation: '',
        equipments: [],
        finiteResource: [],
        infiniteResource: [],
        names: [
            {
                keyId: v4(),
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
            },
        ],
        people: [
            {
                keyId: v4(),
                person: null,
                function: null,
            },
        ],
    };
    const [tab, setTab] = React.useState(0);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const validationSchema = yup.object({
        name: yup.mixed().required('Campo Obrigatório'),
        // startTime: yup.mixed().test({
        //   name: 'durationValid',
        //   message: 'Formato inválido',
        //   test: (v) => {
        //     if (v) {
        //       return v?.isValid();
        //     }
        //     return true;
        //   },
        // }),
        duration: yup
            .mixed()
            .required('Campo Obrigatório')
            .test({
            name: 'durationValid',
            message: 'Formato inválido',
            test: (v) => v === null || v === void 0 ? void 0 : v.isValid(),
        }),
        quantity: yup
            .number()
            .min(0, 'Informe um número maior ou igual a zero')
            .integer('Informe um número inteiro'),
        // area: yup.mixed().required('Campo Obrigatório'),
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const dispatch = useDispatch();
    const { space, tag, person, app } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    const { tooltips } = app;
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        if (activity) {
            const iniVal = {
                id: activity[`${PREFIX}atividadeid`],
                name: activity[`${PREFIX}nome`] || '',
                startTime: (activity[`${PREFIX}inicio`] &&
                    moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
                    null,
                duration: (activity[`${PREFIX}duracao`] &&
                    moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
                    null,
                endTime: (activity[`${PREFIX}fim`] &&
                    moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
                    null,
                typeApplication: activity[`${PREFIX}tipoaplicacao`],
                type: activity[`${PREFIX}tipo`],
                quantity: activity[`${PREFIX}quantidadesessao`] || 0,
                area: activity[`${PREFIX}AreaAcademica`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}AreaAcademica`]), { value: (_a = activity[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], label: (_b = activity[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`] }) : null,
                course: activity[`${PREFIX}Curso`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}Curso`]), { value: (_c = activity[`${PREFIX}Curso`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], label: (_d = activity[`${PREFIX}Curso`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`] }) : null,
                spaces: ((_e = activity[`${PREFIX}Atividade_Espaco`]) === null || _e === void 0 ? void 0 : _e.length)
                    ? activity[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                    : [],
                theme: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}temaaula`]) || '',
                description: (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}descricaoobjetivo`]) || '',
                observation: activity[`${PREFIX}observacao`] || '',
                equipments: ((_f = activity[`${PREFIX}Atividade_Equipamentos`]) === null || _f === void 0 ? void 0 : _f.length)
                    ? activity[`${PREFIX}Atividade_Equipamentos`].map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                    : [],
                finiteResource: (_g = activity[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _g === void 0 ? void 0 : _g.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO),
                infiniteResource: (_h = activity[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _h === void 0 ? void 0 : _h.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO),
                names: ((_j = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _j === void 0 ? void 0 : _j.length)
                    ? activity[`${PREFIX}Atividade_NomeAtividade`].map((e) => ({
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
                people: ((_k = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _k === void 0 ? void 0 : _k.length)
                    ? (_l = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _l === void 0 ? void 0 : _l.map((e, index) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                        person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                        function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                    }))
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ],
            };
            setInitialValues(_.cloneDeep(iniVal));
            setPastValues(_.cloneDeep(iniVal));
        }
    }, [activity]);
    const onClose = () => {
        refetch();
        handleClose();
        setTab(0);
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
        setPastValues(DEFAULT_VALUES);
    };
    const handleCheckClose = () => {
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
                onCancel: onClose,
            });
        }
        else {
            onClose();
        }
    };
    const handleSuccess = (item) => {
        handleEdit(item);
        setLoading(false);
        if ((pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) || (pastValues === null || pastValues === void 0 ? void 0 : pastValues[`${PREFIX}atividadeid`])) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(item));
        }
        notification.success({
            title: 'Sucesso',
            description: activity
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
        onClose();
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleUndo = (newActivity) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f, _g, _h;
        const activityUndo = JSON.parse(localStorage.getItem('undoActivityPlanning'));
        const peopleToDelete = [];
        const namesToDelete = [];
        const documentsToDelete = [];
        (_c = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.forEach((e) => {
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
        (_d = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.people) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasatividadeid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_e = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_NomeAtividade`]) === null || _e === void 0 ? void 0 : _e.forEach((e) => {
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
        (_f = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.names) === null || _f === void 0 ? void 0 : _f.forEach((e) => {
            var _a;
            const nameSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_NomeAtividade`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nomeatividadeid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_g = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_Documento`]) === null || _g === void 0 ? void 0 : _g.forEach((e) => {
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
                });
            }
        });
        (_h = activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.documents) === null || _h === void 0 ? void 0 : _h.forEach((e) => {
            var _a;
            const documentSaved = (_a = newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}documentosatividadeid`]));
            if (!documentSaved) {
                documentsToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(updateActivityAll(Object.assign(Object.assign({}, activityUndo), { [`${PREFIX}atividadeid`]: activityUndo.id, duration: moment(activityUndo === null || activityUndo === void 0 ? void 0 : activityUndo.duration), people: peopleToDelete, names: namesToDelete, documents: documentsToDelete }), {
            onSuccess: (actv) => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
                handleEdit(actv);
                notification.success({
                    title: 'Sucesso',
                    description: 'Ação realizada com sucesso',
                });
            },
            onError: () => null,
        }));
    });
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            localStorage.setItem('undoActivityPlanning', JSON.stringify(pastValues));
            try {
                dispatch(updateActivityAll(Object.assign(Object.assign({}, values), { [`${PREFIX}atividadeid`]: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`], type: activityType, typeApplication: EActivityTypeApplication.PLANEJAMENTO, id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`] }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
            }
            catch (err) {
                console.error(err);
                setLoading(false);
            }
        },
    });
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const components = {
        info: React.createElement(Info, { formik: formik, activityType: activityType }),
        fantasyName: React.createElement(FantasyName, { formik: formik }),
        envolvedPeople: React.createElement(EnvolvedPerson, { formik: formik }),
        classroom: React.createElement(Classroom, { formik: formik }),
        documents: (React.createElement(Documents, { activity: activity, setFieldValue: formik.setFieldValue })),
        observation: React.createElement(Observation, { formik: formik }),
    };
    const tabs = {
        [TYPE_ACTIVITY.ACADEMICA]: [
            {
                component: 'info',
                label: 'Informações',
            },
            {
                component: 'fantasyName',
                label: 'Nome Fantasia',
            },
            {
                component: 'envolvedPeople',
                label: 'Pessoas Envolvidas',
            },
            {
                component: 'classroom',
                label: 'Aula',
            },
            {
                component: 'documents',
                label: 'Documentos',
            },
            {
                component: 'observation',
                label: 'Observações',
            },
        ],
        [TYPE_ACTIVITY.NON_ACADEMICA]: [
            {
                component: 'info',
                label: 'Informações',
            },
            {
                component: 'fantasyName',
                label: 'Nome Fantasia',
            },
            {
                component: 'envolvedPeople',
                label: 'Pessoas Envolvidas',
            },
            {
                component: 'observation',
                label: 'Observações',
            },
        ],
        [TYPE_ACTIVITY.INTERNAL]: [
            {
                component: 'info',
                label: 'Informações',
            },
            {
                component: 'fantasyName',
                label: 'Nome Fantasia',
            },
            {
                component: 'envolvedPeople',
                label: 'Pessoas Envolvidas',
            },
            {
                component: 'observation',
                label: 'Observações',
            },
        ],
    };
    const activityTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) ===
        (activityType === TYPE_ACTIVITY.ACADEMICA
            ? 'Atividade Acadêmica'
            : activityType === TYPE_ACTIVITY.NON_ACADEMICA
                ? 'Atividade não Acadêmica'
                : 'Atividade Interna'));
    return (React.createElement(Dialog, { fullWidth: true, open: open, onClose: onClose, disableBackdropClick: true, maxWidth: 'md', className: styles.dialogContent },
        React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
            React.createElement(Box, null,
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold', maxWidth: '48rem' } },
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])
                            ? 'Editar Atividade'
                            : 'Cadastrar Atividade',
                        formik.values.name ? ` - ${formik.values.name}` : ''),
                    React.createElement(HelperTooltip, { content: activityTooltip === null || activityTooltip === void 0 ? void 0 : activityTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null)))),
        React.createElement(DialogContent, null,
            React.createElement(AppBar, { position: 'static', color: 'default' },
                React.createElement(Tabs, { value: tab, onChange: handleChange, indicatorColor: 'primary', textColor: 'primary', variant: 'fullWidth', scrollButtons: 'auto', "aria-label": 'full width tabs example' }, (_a = tabs[activityType]) === null || _a === void 0 ? void 0 : _a.map((ta, i) => (React.createElement(Tab, Object.assign({ label: ta.label }, a11yProps(i))))))), (_b = tabs[activityType]) === null || _b === void 0 ? void 0 :
            _b.map((ta, i) => (React.createElement(TabPanel, { value: tab, index: i },
                React.createElement(Box, { className: styles.boxTab }, components[ta.component]))))),
        React.createElement(DialogActions, null,
            React.createElement(Box, { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
                React.createElement(Box, { style: { gap: '10px' }, mt: 2, display: 'flex', alignItems: 'end' },
                    React.createElement(Button, { color: 'primary', onClick: handleCheckClose }, "Cancelar"),
                    React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))))));
};
export default AddActivityPlanning;
//# sourceMappingURL=index.js.map