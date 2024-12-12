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
import { Dialog, AppBar, Tabs, Tab, Box, DialogContent, Button, CircularProgress, DialogActions, Typography, IconButton, DialogTitle, Tooltip, } from '@material-ui/core';
import * as yup from 'yup';
import { v4 } from 'uuid';
import Info from './Info';
import FantasyName from './FantasyName';
import styles from './AddTag.module.scss';
import { useConfirmation, useNotification } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdateTag, fetchAllTags } from '~/store/modules/tag/actions';
import { PREFIX } from '~/config/database';
import { useFormik } from 'formik';
import * as _ from 'lodash';
import { Close, Replay } from '@material-ui/icons';
import { fetchAllPerson } from '~/store/modules/person/actions';
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
const AddTag = ({ tag, open, fatherTags, fatherSelected, handleEdit, handleClose, }) => {
    const DEFAULT_VALUES = {
        description: '',
        order: 0,
        fatherTag: [],
        name: '',
        nameEn: '',
        nameEs: '',
        names: [
            {
                keyId: v4(),
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
            },
        ],
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [tab, setTab] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const { tag: tagStory, app } = useSelector((state) => state);
    const { dictTag } = tagStory;
    const { tooltips } = app;
    const validationSchema = yup.object({
        name: yup.string().required('Campo Obrigatório'),
    });
    React.useEffect(() => {
        if (fatherSelected) {
            formik.setFieldValue('fatherTag', [fatherSelected]);
            setPastValues(Object.assign(Object.assign({}, pastValues), { fatherTag: [fatherSelected] }));
        }
    }, [fatherSelected]);
    React.useEffect(() => {
        var _a, _b;
        if (tag) {
            const iniVal = {
                id: tag[`${PREFIX}etiquetaid`],
                description: tag[`${PREFIX}descricao`] || '',
                name: tag[`${PREFIX}nome`] || '',
                nameEn: tag[`${PREFIX}nomeen`] || '',
                nameEs: tag[`${PREFIX}nomees`] || '',
                order: tag[`${PREFIX}ordem`] || 0,
                fatherTag: tag[`${PREFIX}Etiqueta_Pai`] || [],
                names: ((_a = tag[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _a === void 0 ? void 0 : _a.length)
                    ? (_b = tag[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _b === void 0 ? void 0 : _b.map((e) => ({
                        id: e[`${PREFIX}nomeetiquetaid`],
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
                    ],
            };
            setInitialValues(_.cloneDeep(iniVal));
            setPastValues(_.cloneDeep(iniVal));
        }
    }, [tag]);
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
    const onClose = () => {
        handleClose();
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
        dispatch(fetchAllTags({ searchQuery: '', active: 'Ativo' }));
        setTab(0);
    };
    const handleSuccess = (item) => {
        if (!handleEdit) {
            setPastValues(formik.values);
        }
        handleEdit === null || handleEdit === void 0 ? void 0 : handleEdit(item);
        setLoading(false);
        if (pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) {
            undo.open('Deseja desfazer a ação?', () => handleUndo(item));
        }
        notification.success({
            title: 'Sucesso',
            description: tag
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
    const handleUndo = (newTag) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const tagUndo = JSON.parse(localStorage.getItem('undoTag'));
        const namesToDelete = [];
        (_a = newTag === null || newTag === void 0 ? void 0 : newTag[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
            var _a;
            const nameSaved = (_a = tagUndo === null || tagUndo === void 0 ? void 0 : tagUndo.names) === null || _a === void 0 ? void 0 : _a.find((sp) => (sp === null || sp === void 0 ? void 0 : sp.id) === (e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeetiquetaid`]));
            if (nameSaved) {
                namesToDelete.push(nameSaved);
            }
            else {
                namesToDelete.push({
                    keyId: v4(),
                    deleted: true,
                    id: e[`${PREFIX}nomeetiquetaid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                });
            }
        });
        (_b = tagUndo === null || tagUndo === void 0 ? void 0 : tagUndo.names) === null || _b === void 0 ? void 0 : _b.forEach((e) => {
            var _a;
            const nameSaved = (_a = newTag === null || newTag === void 0 ? void 0 : newTag[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _a === void 0 ? void 0 : _a.find((sp) => (e === null || e === void 0 ? void 0 : e.id) === (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}nomeetiquetaid`]));
            if (!nameSaved) {
                namesToDelete.push(Object.assign(Object.assign({}, e), { id: null }));
            }
        });
        dispatch(addOrUpdateTag(Object.assign(Object.assign({}, tagUndo), { names: namesToDelete }), {
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
        onSubmit: (values) => {
            var _a;
            setLoading(true);
            if (tag) {
                const fatherTagToDelete = (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.filter((e) => {
                    var _a;
                    return !((_a = values === null || values === void 0 ? void 0 : values.fatherTag) === null || _a === void 0 ? void 0 : _a.some((sp) => (sp === null || sp === void 0 ? void 0 : sp[`${PREFIX}etiquetaid`]) === e[`${PREFIX}etiquetaid`]));
                });
                localStorage.setItem('undoTag', JSON.stringify(pastValues));
                dispatch(addOrUpdateTag(Object.assign(Object.assign({}, values), { fatherTagToDelete, id: tag[`${PREFIX}etiquetaid`], previousNames: tag[`${PREFIX}Etiqueta_NomeEtiqueta`] }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
            }
            else {
                dispatch(addOrUpdateTag(values, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                }));
            }
        },
    });
    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllSpace({}));
    };
    const tagTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Etiqueta');
    return (React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true, disableBackdropClick: true },
        React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
            React.createElement(Box, null,
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold', maxWidth: '48rem' } },
                        (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`])
                            ? 'Editar Etiqueta'
                            : 'Cadastrar Etiqueta',
                        formik.values.name ? ` - ${formik.values.name}` : ''),
                    React.createElement(HelperTooltip, { content: tagTooltip === null || tagTooltip === void 0 ? void 0 : tagTooltip.Conteudo }),
                    React.createElement(Tooltip, { title: 'Atualizar' },
                        React.createElement(IconButton, { onClick: handleUpdateData },
                            React.createElement(Replay, null)))),
                React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null)))),
        React.createElement(DialogContent, null,
            React.createElement(AppBar, { position: 'static', color: 'default' },
                React.createElement(Tabs, { value: tab, onChange: handleChange, indicatorColor: 'primary', textColor: 'primary', variant: 'fullWidth', "aria-label": 'full width tabs example' },
                    React.createElement(Tab, Object.assign({ label: 'Informa\u00E7\u00F5es' }, a11yProps(0))),
                    React.createElement(Tab, Object.assign({ label: 'Nome Fantasia' }, a11yProps(1))))),
            React.createElement(TabPanel, { value: tab, index: 0 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(Info, { tag: tag, fatherTags: fatherTags, formik: formik }))),
            React.createElement(TabPanel, { value: tab, index: 1 },
                React.createElement(Box, { className: styles.boxTab },
                    React.createElement(FantasyName, { formik: formik })))),
        React.createElement(DialogActions, null,
            React.createElement(Box, { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
                React.createElement(Box, { style: { gap: '10px' }, mt: 2, display: 'flex', alignItems: 'end' },
                    React.createElement(Button, { color: 'primary', onClick: handleCheckClose }, "Cancelar"),
                    React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))))));
};
export default AddTag;
//# sourceMappingURL=index.js.map