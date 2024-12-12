var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, Grid, CircularProgress, IconButton, Box, Typography, Tooltip, } from '@material-ui/core';
import InputMask from 'react-input-mask';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { Close, PlusOne, Replay } from '@material-ui/icons';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import AddTag from '../AddTag';
import { useDispatch, useSelector } from 'react-redux';
import { addOrUpdatePerson, fetchAllPerson, getPerson, } from '~/store/modules/person/actions';
import * as _ from 'lodash';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';
const AddPerson = ({ open, person, refetch, handleClose, }) => {
    const DEFAULT_VALUES = {
        name: '',
        favoriteName: '',
        lastName: '',
        email: '',
        emailSecondary: '',
        phone: '',
        school: '',
        title: null,
        areaChief: [],
        tag: [],
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const { tag, app } = useSelector((state) => state);
    const { tagsActive: tags, dictTag } = tag;
    const { tooltips } = app;
    const validationSchema = yup.object({
        name: yup.string().required('Campo Obrigatório'),
        lastName: yup.string().required('Campo Obrigatório'),
        email: yup.string().email('E-mail inválido').required('Campo Obrigatório'),
        emailSecondary: yup.string().email('E-mail inválido'),
    });
    const schoolOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.ESCOLA_ORIGEM);
    }), [tags]);
    const functionOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const titleOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TITULO);
    }), [tags]);
    const areaOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    }), [tags]);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f;
        if (person) {
            const iniVal = {
                id: person[`${PREFIX}pessoaid`],
                name: person[`${PREFIX}nome`] || '',
                lastName: person[`${PREFIX}sobrenome`] || '',
                favoriteName: person[`${PREFIX}nomepreferido`] || '',
                email: person[`${PREFIX}email`] || '',
                emailSecondary: person[`${PREFIX}emailsecundario`] || '',
                phone: person[`${PREFIX}celular`] || '',
                school: dictTag[person === null || person === void 0 ? void 0 : person[`_${PREFIX}escolaorigem_value`]],
                areaChief: ((_a = person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _a === void 0 ? void 0 : _a.length)
                    ? (_b = person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _b === void 0 ? void 0 : _b.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                    : [],
                title: person[`${PREFIX}Titulo`]
                    ? {
                        value: (_c = person[`${PREFIX}Titulo`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}categoriaetiquetaid`],
                        label: (_d = person[`${PREFIX}Titulo`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`],
                    }
                    : null,
                tag: ((_e = person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _e === void 0 ? void 0 : _e.length)
                    ? (_f = person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _f === void 0 ? void 0 : _f.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                    : [],
            };
            setInitialValues(iniVal);
            setPastValues(iniVal);
        }
    }, [person]);
    const onClose = () => {
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
        setPastValues(DEFAULT_VALUES);
        handleClose();
        dispatch(fetchAllPerson({ active: 'Ativo' }));
    };
    const handleSuccess = () => {
        onClose();
        setLoading(false);
        if (pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) {
            undo.open('Deseja desfazer a ação?', () => handleUndo());
        }
        notification.success({
            title: 'Sucesso',
            description: person
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
        // @ts-ignore
        if (formik.values.close) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
        }
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const handleUndo = () => __awaiter(void 0, void 0, void 0, function* () {
        const personUndo = JSON.parse(localStorage.getItem('undoPerson'));
        dispatch(addOrUpdatePerson(Object.assign(Object.assign({}, personUndo), { previousTag: personUndo.tag }), {
            onSuccess: (spc) => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
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
            var _a;
            setLoading(true);
            const personExists = yield getPerson(values.email, 'main');
            const personExistsSecEmail = yield getPerson(values.emailSecondary, 'secondary');
            if ((personExists === null || personExists === void 0 ? void 0 : personExists.length) &&
                (!(person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]) ||
                    (person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]) !==
                        personExists[0][`${PREFIX}pessoaid`])) {
                notification.error({
                    title: 'Pessoa duplicada',
                    description: `Já existe uma pessoa registrada com o email principal ${values.email}`,
                });
                setLoading(false);
            }
            else if ((personExistsSecEmail === null || personExistsSecEmail === void 0 ? void 0 : personExistsSecEmail.length) &&
                (!(person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]) ||
                    (person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]) !==
                        personExistsSecEmail[0][`${PREFIX}pessoaid`])) {
                notification.error({
                    title: 'Pessoa duplicada',
                    description: `Já existe uma pessoa registrada com o email secundário ${values.emailSecondary}`,
                });
                setLoading(false);
            }
            else {
                localStorage.setItem('undoPerson', JSON.stringify(pastValues));
                if (person) {
                    const areaChiefToDelete = (_a = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _a === void 0 ? void 0 : _a.filter((e) => {
                        var _a;
                        return !((_a = person.areaChief) === null || _a === void 0 ? void 0 : _a.some((sp) => sp.value === e[`${PREFIX}etiquetaid`]));
                    });
                    dispatch(addOrUpdatePerson(Object.assign(Object.assign({}, values), { areaChiefToDelete, id: person[`${PREFIX}pessoaid`], previousTag: person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`] }), {
                        onSuccess: handleSuccess,
                        onError: handleError,
                    }));
                }
                else {
                    dispatch(addOrUpdatePerson(values, {
                        onSuccess: handleSuccess,
                        onError: handleError,
                    }));
                }
            }
        }),
    });
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
    const handleUpdateData = () => {
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const personTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) === 'Pessoa');
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true, disableBackdropClick: true },
            React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
                React.createElement(Box, null,
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold', maxWidth: '48rem' } },
                            person ? 'Atualizar Pessoa' : 'Cadastrar Pessoa',
                            formik.values.name
                                ? ` - ${formik.values.name} ${formik.values.lastName}`
                                : ''),
                        React.createElement(HelperTooltip, { content: personTooltip === null || personTooltip === void 0 ? void 0 : personTooltip.Conteudo }),
                        React.createElement(Tooltip, { title: 'Atualizar' },
                            React.createElement(IconButton, { onClick: handleUpdateData },
                                React.createElement(Replay, null)))),
                    React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null,
                React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, label: 'Nome', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { required: true, fullWidth: true, label: 'Sobrenome', type: 'text', name: 'lastName', inputProps: { maxLength: 255 }, error: !!formik.errors.lastName, helperText: formik.errors.lastName, onChange: formik.handleChange, value: formik.values.lastName })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { fullWidth: true, label: 'Nome Preferido', type: 'text', name: 'favoriteName', inputProps: { maxLength: 255 }, error: !!formik.errors.favoriteName, helperText: formik.errors.favoriteName, onChange: formik.handleChange, value: formik.values.favoriteName })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Box, { display: 'flex', alignItems: 'center' },
                            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: titleOptions === null || titleOptions === void 0 ? void 0 : titleOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                                    formik.setFieldValue('title', newValue);
                                }, getOptionLabel: (option) => option.label || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.title, helperText: formik.errors.title, label: 'T\u00EDtulo' }))), value: formik.values.title }),
                            React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                                React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.TITULO) },
                                    React.createElement(PlusOne, null))))),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(InputMask, { mask: '(99) 99999-9999', maskPlaceholder: ' ', value: formik.values.phone, onChange: formik.handleChange }, (inputProps) => (React.createElement(TextField, Object.assign({}, inputProps, { fullWidth: true, label: 'Telefone Celular (WhatsApp)', type: 'text', name: 'phone', error: !!formik.errors.phone, helperText: formik.errors.phone, onChange: formik.handleChange, value: formik.values.phone }))))),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { required: true, fullWidth: true, label: 'E-mail', type: 'email', name: 'email', inputProps: { maxLength: 100 }, error: !!formik.errors.email, helperText: formik.errors.email, onChange: formik.handleChange, value: formik.values.email })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { fullWidth: true, label: 'E-mail Secund\u00E1rio', type: 'email', name: 'emailSecondary', inputProps: { maxLength: 100 }, error: !!formik.errors.emailSecondary, helperText: formik.errors.emailSecondary, onChange: formik.handleChange, value: formik.values.emailSecondary })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Box, { display: 'flex', alignItems: 'center' },
                            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: schoolOptions === null || schoolOptions === void 0 ? void 0 : schoolOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), value: formik.values.school, onChange: (event, newValue) => formik.setFieldValue('school', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Escola de Origem', error: !!formik.errors.school, helperText: formik.errors.school }))) }),
                            React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                                React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.ESCOLA_ORIGEM) },
                                    React.createElement(PlusOne, null))))),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Box, { display: 'flex', alignItems: 'center' },
                            React.createElement(Autocomplete, { multiple: true, fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: functionOptions, onChange: (event, newValue) => {
                                    formik.setFieldValue('tag', newValue);
                                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.tag, helperText: formik.errors.tag, label: 'Etiqueta(s)' }))), value: formik.values.tag }),
                            React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                                React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.FUNCAO) },
                                    React.createElement(PlusOne, null))))),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Box, { display: 'flex', alignItems: 'center' },
                            React.createElement(Autocomplete, { fullWidth: true, multiple: true, filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: areaOptions === null || areaOptions === void 0 ? void 0 : areaOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                                    formik.setFieldValue('areaChief', newValue);
                                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.areaChief, helperText: formik.errors.areaChief, label: 'Chefe de Departamento' }))), value: formik.values.areaChief }),
                            React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                                React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.AREA_ACADEMICA) },
                                    React.createElement(PlusOne, null))))))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
                React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default AddPerson;
//# sourceMappingURL=index.js.map