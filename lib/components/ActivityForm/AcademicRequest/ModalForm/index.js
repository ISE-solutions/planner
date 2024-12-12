import * as React from 'react';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import * as yup from 'yup';
import { Box, Button, Dialog, Grid, DialogContent, TextField, DialogTitle, Typography, IconButton, DialogActions, } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { EDeliveryType, EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { Add, Close, Remove } from '@material-ui/icons';
import ModalMoodle from '~/components/ModalMoodle';
import { useConfirmation, useNotification } from '~/hooks';
const ModalForm = ({ open, onClose, onSave, detailApproved, canEdit, academicRequest, setFieldValue, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const DEFAULT_VALUES = {
        keyId: v4(),
        description: '',
        delivery: null,
        deliveryDate: null,
        deadline: 0,
        link: '',
        nomemoodle: '',
        other: '',
        observation: '',
        equipments: [],
        finiteResource: [],
        infiniteResource: [],
        people: [
            {
                keyId: v4(),
                deleted: false,
                person: null,
                function: null,
            },
        ],
    };
    const [personOption, setPersonOption] = React.useState({});
    const [searchInMoodle, setSearchInMoodle] = React.useState(false);
    const [pastValues, setPastValues] = React.useState(DEFAULT_VALUES);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    React.useEffect(() => {
        if (academicRequest) {
            setInitialValues(_.cloneDeep(academicRequest));
            setPastValues(_.cloneDeep(academicRequest));
        }
    }, [academicRequest]);
    const validationSchema = yup.object({
        description: yup.string().required('Campo Obrigatório'),
        link: yup
            .string()
            .nullable()
            .matches(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, 'Insira uma URL válida'),
        deadline: yup
            .number()
            .min(0, 'Informe um número maior ou igual a zero')
            .required('Campo Obrigatório'),
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { tag, person, finiteInfiniteResource } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const { finiteInfiniteResources } = finiteInfiniteResource;
    const equipmentsOptions = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EQUIPAMENTO_OUTROS);
    });
    const finiteResources = finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO);
    const infiniteResources = finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO);
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSave(values);
            formik.resetForm({});
        },
    });
    const handleAddPeople = () => {
        let people = formik.values.people || [];
        people.push({
            keyId: v4(),
            deleted: false,
            person: null,
            function: null,
        });
        formik.setFieldValue('people', people);
    };
    const handleRemovePeople = (keyId) => {
        let people = formik.values.people || [];
        people = people === null || people === void 0 ? void 0 : people.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        formik.setFieldValue('people', people);
    };
    const handleAddMoodleDocument = React.useCallback((doc) => {
        formik.setFieldValue('link', doc.contenturl);
        formik.setFieldValue('nomemoodle', doc.content_name);
        setSearchInMoodle(false);
        notification.success({
            title: 'Sucesso',
            description: 'Documento adicionado com sucesso!',
        });
    }, []);
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
                onCancel: () => {
                    onClose();
                    formik.resetForm({});
                    setInitialValues(DEFAULT_VALUES);
                    setPastValues(DEFAULT_VALUES);
                },
            });
        }
        else {
            onClose();
            formik.resetForm({});
            setInitialValues(DEFAULT_VALUES);
            setPastValues(DEFAULT_VALUES);
        }
    };
    const functionOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO);
    }), [tags]);
    const peopleOptions = React.useMemo(() => persons === null || persons === void 0 ? void 0 : persons.map((person) => (Object.assign(Object.assign({}, person), { value: person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`], label: (person === null || person === void 0 ? void 0 : person[`${PREFIX}nome`]) + ' ' + (person === null || person === void 0 ? void 0 : person[`${PREFIX}sobrenome`]) }))), [persons]);
    const listPeople = (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b.filter((e) => !e.deleted);
    return (React.createElement(React.Fragment, null,
        React.createElement(ModalMoodle, { open: searchInMoodle, onAdd: handleAddMoodleDocument, onClose: () => setSearchInMoodle(false) }),
        React.createElement(Dialog, { open: open, maxWidth: 'md', fullWidth: true, disableBackdropClick: true },
            React.createElement(DialogTitle, { style: { paddingBottom: 0 } },
                React.createElement(Box, null,
                    React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`])
                        ? 'Editar Requisição acadêmica'
                        : 'Cadastrar Requisição acadêmica'),
                    React.createElement(IconButton, { "aria-label": 'close', onClick: handleCheckClose, style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null,
                React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '9rem', flexGrow: 1 },
                    React.createElement(Grid, { container: true, spacing: 3, alignItems: 'center' },
                        React.createElement(Grid, { container: true, spacing: 3, sm: 12, md: 12, lg: 12, style: { margin: 0 } },
                            React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                                React.createElement(TextField, { autoFocus: true, fullWidth: true, label: 'Descri\u00E7\u00E3o do Pedido', type: 'text', name: 'description', disabled: detailApproved || !canEdit, inputProps: { maxLength: 255 }, error: !!formik.errors.description, helperText: formik.errors.description, onChange: formik.handleChange, value: formik.values.description })),
                            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                                React.createElement(KeyboardDateTimePicker, { ampm: false, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY HH:mm', disabled: detailApproved || !canEdit, invalidDateMessage: 'Formato inv\u00E1lido', label: 'Data de entrega', value: formik.values.deliveryDate, onChange: (value) => {
                                        formik.setFieldValue('deliveryDate', value);
                                    } })),
                            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                                React.createElement(Autocomplete, { options: Object.keys(EDeliveryType) || [], getOptionLabel: (option) => EDeliveryType[option], onChange: (event, newValue) => {
                                        formik.setFieldValue(`delivery`, newValue);
                                    }, noOptionsText: 'Sem Op\u00E7\u00F5es', disabled: detailApproved || !canEdit, renderInput: (params) => {
                                        var _a, _b;
                                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Momento Entrega', 
                                            // @ts-ignore
                                            error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.delivery), 
                                            // @ts-ignore
                                            helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.delivery })));
                                    }, value: (_c = formik.values) === null || _c === void 0 ? void 0 : _c.delivery })),
                            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                                React.createElement(TextField, { fullWidth: true, label: 'Prazo M\u00EDnimo', type: 'number', name: 'deadline', disabled: detailApproved || !canEdit, inputProps: { maxLength: 100 }, error: !!formik.errors.deadline, helperText: formik.errors.deadline, onChange: formik.handleChange, value: formik.values.deadline })),
                            React.createElement(Grid, { item: true, sm: 12 },
                                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                                    React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 2, inputProps: { maxLength: 2000 }, label: 'Observa\u00E7\u00E3o', type: 'text', name: 'observation', onChange: formik.handleChange, value: formik.values.observation }))),
                            React.createElement(Grid, { item: true, sm: 12, md: 8, lg: 8 },
                                React.createElement(TextField, { fullWidth: true, label: 'Link', type: 'url', name: 'link', disabled: detailApproved || !canEdit, inputProps: { maxLength: 255 }, error: !!formik.errors.link, helperText: formik.errors.link, onChange: formik.handleChange, value: formik.values.link })),
                            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                                React.createElement(Button, { onClick: () => setSearchInMoodle(true), disabled: !canEdit, variant: 'contained', color: 'primary' }, "Buscar Moodle"))),
                        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                            React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, disabled: detailApproved || !canEdit, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (equipmentsOptions === null || equipmentsOptions === void 0 ? void 0 : equipmentsOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], onChange: (event, newValue) => {
                                    formik.setFieldValue(`equipments`, newValue);
                                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: (_d = formik.values) === null || _d === void 0 ? void 0 : _d.equipments, renderInput: (params) => {
                                    var _a, _b;
                                    return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'equipments', label: 'Equipamentos/Outros', 
                                        // @ts-ignore
                                        error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.equipments), 
                                        // @ts-ignore
                                        helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.equipments })));
                                } })),
                        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                            React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: detailApproved || !canEdit, options: (finiteResources === null || finiteResources === void 0 ? void 0 : finiteResources.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], onChange: (event, newValue) => {
                                    formik.setFieldValue(`finiteResource`, newValue);
                                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}recursofinitoinfinitoid`]) ===
                                    (value === null || value === void 0 ? void 0 : value[`${PREFIX}recursofinitoinfinitoid`]), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', value: ((_e = formik.values) === null || _e === void 0 ? void 0 : _e.finiteResource) || [], renderInput: (params) => {
                                    var _a, _b;
                                    return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'finiteResource', label: 'Recurso Finito', 
                                        // @ts-ignore
                                        error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.finiteResource), 
                                        // @ts-ignore
                                        helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.finiteResource })));
                                } })),
                        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                            React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: detailApproved || !canEdit, options: (infiniteResources === null || infiniteResources === void 0 ? void 0 : infiniteResources.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], onChange: (event, newValue) => {
                                    formik.setFieldValue(`infiniteResource`, newValue);
                                }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}recursofinitoinfinitoid`]) ===
                                    (value === null || value === void 0 ? void 0 : value[`${PREFIX}recursofinitoinfinitoid`]), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', value: ((_f = formik.values) === null || _f === void 0 ? void 0 : _f.infiniteResource) || [], renderInput: (params) => {
                                    var _a, _b;
                                    return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, name: 'infiniteResource', label: 'Recurso Infinito', 
                                        // @ts-ignore
                                        error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.infiniteResource), 
                                        // @ts-ignore
                                        helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.infiniteResource })));
                                } })),
                        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                            React.createElement(TextField, { fullWidth: true, label: 'Outro', type: 'text', name: 'other', disabled: detailApproved || !canEdit, inputProps: { maxLength: 255 }, error: !!formik.errors.other, helperText: formik.errors.other, onChange: formik.handleChange, value: formik.values.other })),
                        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12, style: { padding: 0 } },
                            React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (_h = (_g = formik.values) === null || _g === void 0 ? void 0 : _g.people) === null || _h === void 0 ? void 0 : _h.map((item, index) => {
                                if (item.deleted)
                                    return;
                                return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                                    React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                                        React.createElement(Autocomplete, { options: (functionOptions === null || functionOptions === void 0 ? void 0 : functionOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) &&
                                                e[`${PREFIX}ativo`])) || [], noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, value: item.function || [], disabled: detailApproved || !canEdit, onChange: (event, newValue) => {
                                                formik.setFieldValue(`people[${index}].function`, newValue);
                                                const peoples = peopleOptions === null || peopleOptions === void 0 ? void 0 : peopleOptions.filter((pers) => {
                                                    var _a;
                                                    return (pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}ativo`]) &&
                                                        !(pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}excluido`]) &&
                                                        ((_a = pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((ta) => (ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}etiquetaid`]) ===
                                                            (newValue === null || newValue === void 0 ? void 0 : newValue[`${PREFIX}etiquetaid`])));
                                                });
                                                const newOptions = Object.assign({}, personOption);
                                                newOptions[index] = peoples;
                                                setPersonOption(newOptions);
                                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                                                var _a, _b, _c, _d, _e, _f;
                                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Fun\u00E7\u00E3o', error: 
                                                    // @ts-ignore
                                                    !!((_c = (_b = (_a = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.function), helperText: 
                                                    // @ts-ignore
                                                    (_f = (_e = (_d = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.function })));
                                            } })),
                                    React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                                        React.createElement(Autocomplete, { options: (personOption === null || personOption === void 0 ? void 0 : personOption[index]) || [], disabled: !personOption[index] || detailApproved || !canEdit, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, value: item.person, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                                                formik.setFieldValue(`people[${index}].person`, newValue);
                                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                                                var _a, _b, _c, _d, _e, _f;
                                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa', error: 
                                                    // @ts-ignore
                                                    !!((_c = (_b = (_a = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.person), helperText: 
                                                    // @ts-ignore
                                                    (_f = (_e = (_d = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.person })));
                                            } })),
                                    React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginTop: 25,
                                        }, justify: 'center' },
                                        listPeople.length &&
                                            item.keyId ===
                                                listPeople[listPeople.length - 1].keyId &&
                                            !detailApproved &&
                                            canEdit && (React.createElement(Add, { onClick: handleAddPeople, style: { color: '#333', cursor: 'pointer' } })),
                                        ((listPeople.length &&
                                            item.keyId !== listPeople[0].keyId) ||
                                            listPeople.length > 1) &&
                                            !detailApproved &&
                                            canEdit && (React.createElement(Remove, { onClick: () => handleRemovePeople(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
                            })))))),
            React.createElement(DialogActions, null,
                React.createElement(Box, { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
                    React.createElement(Box, { style: { gap: '10px' }, mt: 2, display: 'flex', alignItems: 'end' },
                        React.createElement(Button, { color: 'primary', onClick: handleCheckClose }, "Cancelar"),
                        React.createElement(Button, { variant: 'contained', color: 'primary', disabled: detailApproved || !canEdit, onClick: () => formik.handleSubmit() }, "Salvar")))))));
};
export default ModalForm;
//# sourceMappingURL=index.js.map