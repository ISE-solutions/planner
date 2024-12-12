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
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, Grid, IconButton, Box, Typography, Tooltip, CircularProgress, } from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { Close, PlusOne, Replay } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import * as _ from 'lodash';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { addOrUpdateFiniteInfiniteResource, } from '~/store/modules/finiteInfiniteResource/actions';
import AddTag from '../AddTag';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';
const AddFiniteInfiniteResource = ({ open, resource, handleClose, refetch, typeResource, }) => {
    const DEFAULT_VALUES = {
        name: '',
        limit: 0,
        quantity: 0,
        type: null,
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { currentUser } = useLoggedUser();
    const validationSchema = typeResource == TYPE_RESOURCE.FINITO
        ? yup.object({
            name: yup.string().required('Campo Obrigatório'),
            limit: yup.number().min(1, 'Campo Obrigatório'),
            type: yup.mixed().required('Campo Obrigatório'),
            quantity: yup
                .number()
                .min(1, 'Campo Obrigatório')
                .required('Campo Obrigatório'),
        })
        : yup.object({
            name: yup.string().required('Campo Obrigatório'),
            type: yup.mixed().required('Campo Obrigatório'),
        });
    const { confirmation } = useConfirmation();
    const { undo } = useUndo();
    const dispatch = useDispatch();
    const { tag, app } = useSelector((state) => state);
    const { tags } = tag;
    const { tooltips } = app;
    const { notification } = useNotification();
    const tagOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) ===
            (typeResource === TYPE_RESOURCE.FINITO
                ? EFatherTag.RECURSO_FINITOS
                : EFatherTag.RECURSO_INFINITOS));
    }), [tags, typeResource]);
    React.useEffect(() => {
        var _a, _b;
        if (resource) {
            const iniVal = {
                id: resource[`${PREFIX}recursofinitoinfinitoid`],
                name: resource[`${PREFIX}nome`] || '',
                limit: resource[`${PREFIX}limitacao`] || 0,
                quantity: resource[`${PREFIX}quantidade`] || 0,
                type: resource[`${PREFIX}Tipo`]
                    ? {
                        value: (_a = resource[`${PREFIX}Tipo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`],
                        label: (_b = resource[`${PREFIX}Tipo`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`],
                    }
                    : null,
            };
            setInitialValues(_.cloneDeep(iniVal));
            setPastValues(_.cloneDeep(iniVal));
        }
    }, [resource]);
    const onClose = () => {
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
        setPastValues(DEFAULT_VALUES);
        handleClose();
    };
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleSuccess = () => {
        setLoading(false);
        refetch === null || refetch === void 0 ? void 0 : refetch();
        onClose();
        if (pastValues === null || pastValues === void 0 ? void 0 : pastValues.id) {
            undo.open('Deseja desfazer a ação?', () => handleUndo());
        }
        notification.success({
            title: 'Sucesso',
            description: resource
                ? 'Atualizado com sucesso'
                : 'Cadastro realizado com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        setLoading(false);
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleUndo = () => __awaiter(void 0, void 0, void 0, function* () {
        const finiteResourceUndo = JSON.parse(localStorage.getItem('undoFiniteResource'));
        addOrUpdateFiniteInfiniteResource(Object.assign(Object.assign({}, finiteResourceUndo), { typeResource: typeResource }), {
            onSuccess: () => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
                notification.success({
                    title: 'Sucesso',
                    description: 'Ação realizada com sucesso',
                });
            },
            onError: () => null,
        });
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
            localStorage.setItem('undoFiniteResource', JSON.stringify(pastValues));
            if (resource) {
                addOrUpdateFiniteInfiniteResource(Object.assign(Object.assign({}, values), { id: resource[`${PREFIX}recursofinitoinfinitoid`], typeResource: typeResource }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                });
            }
            else {
                addOrUpdateFiniteInfiniteResource(Object.assign(Object.assign({}, values), { typeResource: typeResource }), {
                    onSuccess: handleSuccess,
                    onError: handleError,
                });
            }
        },
    });
    const handleCheckClose = () => {
        if (!_.isEqualWith(pastValues, formik.values)) {
            confirmation.openConfirmation({
                title: 'Dados não alterados',
                description: 'O que deseja?',
                yesLabel: 'Salvar',
                noLabel: 'Sair sem Salvar',
                onConfirm: () => formik.handleSubmit(),
                onCancel: onClose,
            });
        }
        else {
            onClose();
        }
    };
    const handleUpdateData = () => {
        dispatch(fetchAllPerson({}));
        dispatch(fetchAllTags({}));
        dispatch(fetchAllSpace({}));
    };
    const resourceTooltip = tooltips.find((tooltip) => (tooltip === null || tooltip === void 0 ? void 0 : tooltip.Title) ===
        (typeResource == TYPE_RESOURCE.FINITO
            ? 'Recurso Finito'
            : 'Recurso Infinito'));
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true, disableBackdropClick: true },
            React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
                React.createElement(Box, null,
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold', maxWidth: '48rem' } },
                            resource
                                ? `Atualizar Recurso ${typeResource == TYPE_RESOURCE.FINITO
                                    ? 'Finito'
                                    : 'Infinito'}`
                                : `Cadastrar Recurso ${typeResource == TYPE_RESOURCE.FINITO
                                    ? 'Finito'
                                    : 'Infinito'}`,
                            formik.values.name ? ` - ${formik.values.name}` : ''),
                        React.createElement(HelperTooltip, { content: resourceTooltip === null || resourceTooltip === void 0 ? void 0 : resourceTooltip.Conteudo }),
                        React.createElement(Tooltip, { title: 'Atualizar' },
                            React.createElement(IconButton, { onClick: handleUpdateData },
                                React.createElement(Replay, null)))),
                    React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null,
                React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, label: 'Nome', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                    typeResource == TYPE_RESOURCE.FINITO && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { required: true, fullWidth: true, label: 'Limita\u00E7\u00E3o', type: 'number', name: 'limit', inputProps: { maxLength: 255 }, error: !!formik.errors.limit, helperText: formik.errors.limit, onChange: formik.handleChange, value: formik.values.limit }))),
                    typeResource == TYPE_RESOURCE.FINITO && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { required: true, fullWidth: true, label: 'Quantidade', type: 'number', name: 'quantity', error: !!formik.errors.quantity, helperText: formik.errors.quantity, onChange: formik.handleChange, value: formik.values.quantity }))),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Box, { display: 'flex', alignItems: 'center' },
                            React.createElement(Autocomplete, { fullWidth: true, options: (tagOptions === null || tagOptions === void 0 ? void 0 : tagOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], onChange: (event, newValue) => {
                                    formik.setFieldValue('type', newValue);
                                }, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option.label || '', renderInput: (params) => (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, error: !!formik.errors.type, helperText: formik.errors.type, label: 'Tipo' }))), value: formik.values.type }),
                            React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                                React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(typeResource == TYPE_RESOURCE.FINITO
                                        ? EFatherTag.RECURSO_FINITOS
                                        : EFatherTag.RECURSO_INFINITOS) },
                                    React.createElement(PlusOne, null))))))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
                React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default AddFiniteInfiniteResource;
//# sourceMappingURL=index.js.map