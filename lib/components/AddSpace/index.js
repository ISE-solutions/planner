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
import * as yup from 'yup';
import { Dialog, AppBar, Tabs, Tab, Box, DialogContent, DialogActions, Button, CircularProgress, DialogTitle, Typography, IconButton, Tooltip, } from '@material-ui/core';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import Info from './Info';
import FantasyName from './FantasyName';
import Capacity from './Capacity';
import EnvolvedPerson from './EnvolvedPerson';
import Observation from './Observation';
import styles from './AddSpace.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import { addOrUpdateSpace, fetchAllSpace, getSpaceByEmail, } from '~/store/modules/space/actions';
import { useDispatch, useSelector } from 'react-redux';
import * as moment from 'moment';
import { sp } from '@pnp/sp';
import { getFiles } from '~/utils/sharepoint';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import { Close, Replay } from '@material-ui/icons';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
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
const AddSpace = ({ open, space, handleClose, handleEdit, }) => {
    const DEFAULT_VALUES = {
        name: '',
        nameEn: '',
        nameEs: '',
        email: '',
        description: '',
        owner: null,
        names: [
            {
                keyId: v4(),
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
            },
        ],
        capacities: [
            {
                keyId: v4(),
                quantity: 0,
                use: null,
            },
        ],
        people: [
            {
                keyId: v4(),
                person: null,
                function: null,
            },
        ],
        tags: [],
        anexos: [],
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [tab, setTab] = React.useState(0);
    const refAnexo = React.useRef();
    const validationSchema = yup.object({
        name: yup.string().required('Campo Obrigatório'),
        // email: yup.string().email('E-mail inválido').required('Campo Obrigatório'),
        tags: yup.array().min(1, 'Campo Obrigatório').required('Campo Obrigatório'),
    });
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const { tag, person, app } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const { tooltips } = app;
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (space) {
            const iniVal = {
                id: space[`${PREFIX}espacoid`] || '',
                name: space[`${PREFIX}nome`] || '',
                nameEn: space[`${PREFIX}nomeen`] || '',
                nameEs: space[`${PREFIX}nomees`] || '',
                email: space[`${PREFIX}email`] || '',
                description: space[`${PREFIX}observacao`],
                owner: (dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[space === null || space === void 0 ? void 0 : space[`_${PREFIX}proprietario_value`]]) || null,
                tags: ((_a = space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.length)
                    ? (_b = space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                    : [],
                names: ((_c = space[`${PREFIX}Espaco_NomeEspaco`]) === null || _c === void 0 ? void 0 : _c.length)
                    ? (_d = space[`${PREFIX}Espaco_NomeEspaco`]) === null || _d === void 0 ? void 0 : _d.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}nomeespacoid`],
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
                people: ((_e = space[`${PREFIX}Espaco_PessoasEnvolvidas`]) === null || _e === void 0 ? void 0 : _e.length)
                    ? (_f = space[`${PREFIX}Espaco_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}pessoasenvolvidasespacoid`],
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
                capacities: ((_g = space[`${PREFIX}Espaco_CapacidadeEspaco`]) === null || _g === void 0 ? void 0 : _g.length)
                    ? (_h = space[`${PREFIX}Espaco_CapacidadeEspaco`]) === null || _h === void 0 ? void 0 : _h.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}capacidadeespacoid`],
                        quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                        use: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                    }))
                    : [
                        {
                            keyId: v4(),
                            quantity: 0,
                            use: null,
                        },
                    ],
                anexos: [],
            };
            setInitialValues(_.cloneDeep(iniVal));
            setPastValues(_.cloneDeep(iniVal));
            getFiles(sp, `Anexos Interno/Espaco/${moment(space === null || space === void 0 ? void 0 : space.createdon).format('YYYY')}/${space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]}`).then((files) => {
                formik.setFieldValue('anexos', files);
                setPastValues(Object.assign(Object.assign({}, iniVal), { anexos: files }));
            });
        }
    }, [space]);
    const onClose = () => {
        dispatch(fetchAllSpace({}));
        handleClose();
        setTab(0);
        setPastValues(DEFAULT_VALUES);
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
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
        handleEdit === null || handleEdit === void 0 ? void 0 : handleEdit(item);
        setLoading(false);
        if (pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(item));
        }
        notification.success({
            title: 'Sucesso',
            description: space
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
        onClose();
    };
    const handleError = (error) => {
        var _a, _b;
        console.log(error);
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleUndo = (newSpace) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const spaceUndo = JSON.parse(localStorage.getItem('undoSpace'));
        const peopleToDelete = [];
        const namesToDelete = [];
        const capacityToDelete = [];
        (_a = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.people) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidasespacoid`]));
            if (envolvedSaved) {
                peopleToDelete.push(envolvedSaved);
            }
            else {
                const func = (e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`])
                    ? _.cloneDeep(dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]])
                    : {};
                peopleToDelete.push(Object.assign(Object.assign({}, e), { keyId: v4(), deleted: true, isRequired: e === null || e === void 0 ? void 0 : e[`${PREFIX}obrigatorio`], id: e[`${PREFIX}pessoasenvolvidasespacoid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func }));
            }
        });
        (_b = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.people) === null || _b === void 0 ? void 0 : _b.forEach((e) => {
            var _a;
            const envolvedSaved = (_a = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}pessoasenvolvidasespacoid`]));
            if (!envolvedSaved) {
                peopleToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_c = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_NomeEspaco`]) === null || _c === void 0 ? void 0 : _c.forEach((e) => {
            var _a;
            const nameSaved = (_a = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.names) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeespacoid`]));
            if (nameSaved) {
                namesToDelete.push(nameSaved);
            }
            else {
                namesToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}nomeespacoid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_d = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.names) === null || _d === void 0 ? void 0 : _d.forEach((e) => {
            var _a;
            const nameSaved = (_a = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_NomeEspaco`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nomeespacoid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        (_e = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_CapacidadeEspaco`]) === null || _e === void 0 ? void 0 : _e.forEach((e) => {
            var _a;
            const nameSaved = (_a = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.capacities) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}capacidadeespacoid`]));
            if (nameSaved) {
                capacityToDelete.push(nameSaved);
            }
            else {
                capacityToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}capacidadeespacoid`],
                    quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                    use: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_f = spaceUndo === null || spaceUndo === void 0 ? void 0 : spaceUndo.capacities) === null || _f === void 0 ? void 0 : _f.forEach((e) => {
            var _a;
            const nameSaved = (_a = newSpace === null || newSpace === void 0 ? void 0 : newSpace[`${PREFIX}Espaco_CapacidadeEspaco`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}capacidadeespacoid`]));
            if (!nameSaved) {
                capacityToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(addOrUpdateSpace(Object.assign(Object.assign({}, spaceUndo), { people: peopleToDelete, names: namesToDelete, capacities: capacityToDelete }), {
            onSuccess: (spc) => {
                handleEdit(spc);
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
        onSubmit: (values) => __awaiter(void 0, void 0, void 0, function* () {
            var _g, _h, _j;
            setLoading(true);
            try {
                const anexos = yield ((_g = refAnexo === null || refAnexo === void 0 ? void 0 : refAnexo.current) === null || _g === void 0 ? void 0 : _g.getAnexos());
                const spacesRequest = yield getSpaceByEmail(values.email);
                const spacesHasEmail = (_h = spacesRequest === null || spacesRequest === void 0 ? void 0 : spacesRequest.value) === null || _h === void 0 ? void 0 : _h.some((spc) => (spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}espacoid`]) !== (space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]));
                if (spacesHasEmail) {
                    notification.error({
                        title: 'E-mail utilizado',
                        description: 'O E-mail informado está sendo utilizado em outro espaço, verifique!',
                    });
                    setLoading(false);
                    return;
                }
                const tagsToDelete = (_j = space === null || space === void 0 ? void 0 : space[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _j === void 0 ? void 0 : _j.filter((e) => {
                    var _a;
                    return !((_a = values === null || values === void 0 ? void 0 : values.tags) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}etiquetaid`]) === e[`${PREFIX}etiquetaid`]));
                });
                localStorage.setItem('undoSpace', JSON.stringify(pastValues));
                dispatch(addOrUpdateSpace(Object.assign(Object.assign({}, values), { anexos,
                    tagsToDelete, id: space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`] }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
            }
            catch (err) {
                console.error(err);
            }
        }),
    });
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
    };
    const spaceTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Espaço');
    return (React.createElement(Dialog, { open: open, className: styles.dialogContent, onClose: onClose, maxWidth: 'md', fullWidth: true, disableBackdropClick: true },
        React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
            React.createElement(Box, null,
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold', maxWidth: '48rem' } },
                        (space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`])
                            ? 'Editar Espaço'
                            : 'Cadastrar Espaço',
                        formik.values.name ? ` - ${formik.values.name}` : ''),
                    React.createElement(HelperTooltip, { content: spaceTooltip === null || spaceTooltip === void 0 ? void 0 : spaceTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null)))),
        React.createElement(DialogContent, null,
            React.createElement(AppBar, { position: 'static', color: 'default' },
                React.createElement(Tabs, { value: tab, onChange: handleChange, indicatorColor: 'primary', textColor: 'primary', variant: 'fullWidth', scrollButtons: 'auto', "aria-label": 'full width tabs example' },
                    React.createElement(Tab, Object.assign({ label: 'Informa\u00E7\u00F5es' }, a11yProps(0))),
                    React.createElement(Tab, Object.assign({ label: 'Nome Fantasia' }, a11yProps(1))),
                    React.createElement(Tab, Object.assign({ label: 'Capacidade' }, a11yProps(2))),
                    React.createElement(Tab, Object.assign({ label: 'Pessoas Envolvidas' }, a11yProps(3))),
                    React.createElement(Tab, Object.assign({ label: 'Observa\u00E7\u00F5es' }, a11yProps(4))))),
            React.createElement(TabPanel, { value: tab, index: 0 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(Info, { refAnexo: refAnexo, formik: formik }))),
            React.createElement(TabPanel, { value: tab, index: 1 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(FantasyName, { formik: formik }))),
            React.createElement(TabPanel, { value: tab, index: 2 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(Capacity, { formik: formik }))),
            React.createElement(TabPanel, { value: tab, index: 3 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(EnvolvedPerson, { formik: formik }))),
            React.createElement(TabPanel, { value: tab, index: 4 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(Observation, { formik: formik })))),
        React.createElement(DialogActions, null,
            React.createElement(Box, { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
                React.createElement(Box, { style: { gap: '10px' }, mt: 2, display: 'flex', alignItems: 'end' },
                    React.createElement(Button, { color: 'primary', onClick: handleCheckClose }, "Cancelar"),
                    React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))))));
};
export default AddSpace;
//# sourceMappingURL=index.js.map