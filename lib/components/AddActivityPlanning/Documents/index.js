import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { useFormik } from 'formik';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EDeliveryType } from '~/config/enums';
import { Delete, Edit } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { useNotification } from '~/hooks';
import { ModalMoodle } from '~/components';
import formatUrl from '~/utils/formatUrl';
const Documents = ({ activity, setFieldValue }) => {
    var _a, _b;
    const [searchInMoodle, setSearchInMoodle] = React.useState(false);
    const [editDocument, setEditDocument] = React.useState({ isEdit: false });
    const { notification } = useNotification();
    const validationSchema = yup.object({
        name: yup.string().required('Campo Obrigatório'),
        delivery: yup.mixed().required('Campo Obrigatório'),
        link: yup
            .string()
            .matches(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, 'Insira uma URL válida')
            .required('Campo Obrigatório'),
    });
    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADD_INITIAL_DOCUMENT':
                return { documents: action.payload };
            case 'ADD_DOCUMENT':
                const newAddDocuments = [...state.documents, action.payload];
                setFieldValue('documents', newAddDocuments);
                return { documents: newAddDocuments };
            case 'EDIT_DOCUMENT':
                let newEditDocuments = [...state.documents];
                newEditDocuments = newEditDocuments === null || newEditDocuments === void 0 ? void 0 : newEditDocuments.map((e) => { var _a; return e.keyId === ((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.keyId) ? action.payload : e; });
                setFieldValue('documents', newEditDocuments);
                return { documents: newEditDocuments };
            case 'REMOVE_DOCUMENT':
                let newDocuments = [...state.documents];
                newDocuments = newDocuments === null || newDocuments === void 0 ? void 0 : newDocuments.map((e) => { var _a; return e.keyId === ((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.keyId) ? Object.assign(Object.assign({}, e), { deleted: true }) : e; });
                setFieldValue('documents', newDocuments);
                return { documents: newDocuments };
            default:
                return { documents: state.documents };
        }
    };
    const [{ documents }, dispatch] = React.useReducer(reducer, {
        documents: [],
    });
    React.useEffect(() => {
        var _a;
        if (activity) {
            const newDocuments = (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.map((document) => ({
                keyId: v4(),
                id: document === null || document === void 0 ? void 0 : document[`${PREFIX}documentosatividadeid`],
                name: document === null || document === void 0 ? void 0 : document[`${PREFIX}nome`],
                link: document === null || document === void 0 ? void 0 : document[`${PREFIX}link`],
                font: document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`],
                delivery: document === null || document === void 0 ? void 0 : document[`${PREFIX}entrega`],
                type: document === null || document === void 0 ? void 0 : document[`${PREFIX}tipo`],
            }));
            dispatch({
                type: 'ADD_INITIAL_DOCUMENT',
                payload: _.cloneDeep(newDocuments),
            });
        }
    }, [activity]);
    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            originFont: '',
            font: 'moodle',
            delivery: null,
            link: '',
            type: '',
        },
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (editDocument.isEdit) {
                dispatch({
                    index: editDocument.index,
                    type: 'EDIT_DOCUMENT',
                    payload: Object.assign(Object.assign({}, values), { name: values.name, font: values.originFont }),
                });
            }
            else {
                dispatch({
                    type: 'ADD_DOCUMENT',
                    payload: {
                        keyId: v4(),
                        name: values.name,
                        font: values.font,
                        delivery: values.delivery,
                        link: values.link,
                        type: values.type,
                    },
                });
            }
            setEditDocument({ isEdit: false });
            formik.resetForm({});
        },
    });
    const handleRemoveDocument = (keyId) => {
        dispatch({
            type: 'REMOVE_DOCUMENT',
            payload: {
                keyId,
            },
        });
    };
    const handleAddMoodleDocument = React.useCallback((doc) => {
        dispatch({
            type: 'ADD_DOCUMENT',
            payload: {
                keyId: v4(),
                name: doc.content_name,
                delivery: doc.delivery,
                font: 'Moodle',
                link: doc.contenturl,
                type: doc.doctype,
            },
        });
        notification.success({
            title: 'Sucesso',
            description: 'Documento adicionado com sucesso!',
        });
    }, [documents]);
    const handleEditDocument = (item) => {
        setEditDocument({
            isEdit: true,
        });
        formik.setValues(Object.assign(Object.assign({}, item), { id: item === null || item === void 0 ? void 0 : item.id, name: item === null || item === void 0 ? void 0 : item.name, link: item === null || item === void 0 ? void 0 : item.link, originFont: item === null || item === void 0 ? void 0 : item.font, font: 'externo', delivery: item === null || item === void 0 ? void 0 : item.delivery }));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ModalMoodle, { open: searchInMoodle, onAdd: handleAddMoodleDocument, onClose: () => setSearchInMoodle(false) }),
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '13rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, alignItems: 'center' },
                React.createElement(Grid, { item: true, sm: 12, md: 2, lg: 2 },
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(FormLabel, { component: 'legend' }, "Fonte"),
                        React.createElement(RadioGroup, { "aria-label": 'fonte', name: 'font', value: formik.values.font, onChange: formik.handleChange, defaultValue: 'externo' },
                            React.createElement(FormControlLabel, { value: 'moodle', control: React.createElement(Radio, { color: 'primary' }), label: 'Moodle', labelPlacement: 'end' }),
                            React.createElement(FormControlLabel, { value: 'externo', control: React.createElement(Radio, { color: 'primary' }), label: 'Externo', labelPlacement: 'end' })))),
                React.createElement(Grid, { container: true, spacing: 3, sm: 12, md: 8, lg: 8, style: { margin: 0 } }, formik.values.font === 'externo' ? (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, disabled: editDocument.isEdit &&
                                (formik.values.originFont || formik.values.font) !==
                                    'externo', label: 'Nome', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Autocomplete, { options: Object.keys(EDeliveryType), getOptionLabel: (option) => EDeliveryType[option], onChange: (event, newValue) => {
                                formik.setFieldValue(`delivery`, newValue);
                            }, noOptionsText: 'Sem Op\u00E7\u00F5es', renderInput: (params) => {
                                var _a, _b;
                                return (React.createElement(TextField, Object.assign({ required: true }, params, { fullWidth: true, label: 'Momento Entrega', 
                                    // @ts-ignore
                                    error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.delivery), 
                                    // @ts-ignore
                                    helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.delivery })));
                            }, value: (_a = formik.values) === null || _a === void 0 ? void 0 : _a.delivery })),
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { required: true, fullWidth: true, label: 'Link', type: 'text', name: 'link', inputProps: { maxLength: 100 }, error: !!formik.errors.link, helperText: formik.errors.link, onChange: formik.handleChange, value: formik.values.link })),
                    React.createElement(Grid, { item: true, sm: 12, md: 2, lg: 2 },
                        React.createElement(Button, { variant: 'contained', color: 'primary', onClick: () => formik.handleSubmit() }, "Salvar")))) : (React.createElement(Button, { onClick: () => setSearchInMoodle(true), variant: 'contained', color: 'primary' }, "Pesquisar documento"))))),
        React.createElement(Box, { marginTop: '2rem' },
            React.createElement(TableContainer, { component: Paper },
                React.createElement(Table, { "aria-label": 'simple table' },
                    React.createElement(TableHead, null,
                        React.createElement(TableRow, null,
                            React.createElement(TableCell, null, "Nome"),
                            React.createElement(TableCell, null, "Fonte"),
                            React.createElement(TableCell, null, "Link"),
                            React.createElement(TableCell, null, "Momento de Entrega"),
                            React.createElement(TableCell, null, "A\u00E7\u00F5es"))),
                    React.createElement(TableBody, null, (_b = documents === null || documents === void 0 ? void 0 : documents.filter((e) => !e.deleted)) === null || _b === void 0 ? void 0 : _b.map((row, index) => {
                        var _a;
                        return (React.createElement(TableRow, { key: row.name },
                            React.createElement(TableCell, { component: 'th', scope: 'row' }, row.name),
                            React.createElement(TableCell, null, (_a = row === null || row === void 0 ? void 0 : row.font) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()),
                            React.createElement(TableCell, null,
                                React.createElement("a", { href: formatUrl(row === null || row === void 0 ? void 0 : row.link), target: '_blank' }, "Acesse")),
                            React.createElement(TableCell, null, EDeliveryType[row.delivery]),
                            React.createElement(TableCell, null,
                                React.createElement(IconButton, { onClick: () => handleEditDocument(row) },
                                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                                        React.createElement(Edit, null))),
                                React.createElement(IconButton, { onClick: () => handleRemoveDocument(row.keyId) },
                                    React.createElement(Tooltip, { arrow: true, title: 'Remover' },
                                        React.createElement(Delete, null))))));
                    })))))));
};
export default Documents;
//# sourceMappingURL=index.js.map