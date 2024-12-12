import * as React from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EDeliveryType } from '~/config/enums';
import { Delete, Edit } from '@material-ui/icons';
import { useNotification } from '~/hooks';
import ModalMoodle from '~/components/ModalMoodle';
import formatUrl from '~/utils/formatUrl';
const Documents = ({ canEdit, values: activityValues, setFieldValue, setDocumentChanged, detailApproved, }) => {
    var _a, _b;
    const DEFAULT_VALUES = {
        name: '',
        font: 'moodle',
        delivery: null,
        link: '',
        type: '',
    };
    const [searchInMoodle, setSearchInMoodle] = React.useState(false);
    const [editDocument, setEditDocument] = React.useState({ isEdit: false });
    React.useEffect(() => {
        dispatch({
            type: 'ADD_INITIAL_DOCUMENT',
            payload: activityValues.documents,
        });
    }, [activityValues.documents]);
    const validationSchema = yup.object({
        name: yup.string().required('Campo Obrigatório'),
        link: yup
            .string()
            .matches(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi, 'Insira uma URL válida')
            .required('Campo Obrigatório'),
    });
    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADD_INITIAL_DOCUMENT':
                if (state.documents.lenght) {
                    return { documents: state.documents };
                }
                return { documents: action.payload || [] };
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
    const { notification } = useNotification();
    const [{ documents }, dispatch] = React.useReducer(reducer, {
        documents: [],
    });
    const formik = useFormik({
        initialValues: DEFAULT_VALUES,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            if (editDocument.isEdit) {
                dispatch({
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
            setDocumentChanged(true);
            setEditDocument({ isEdit: false });
            // const newDocuments = [...activityValues.documents];
            // newDocuments.push({
            //   keyId: v4(),
            //   name: values.name,
            //   font: values.font,
            //   delivery: values.delivery,
            //   link: values.link,
            // });
            // setFieldValue('documents', newDocuments);
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
    const handleEditDocument = (item) => {
        setEditDocument({
            isEdit: true,
        });
        formik.setValues(Object.assign(Object.assign({}, item), { id: item === null || item === void 0 ? void 0 : item.id, name: item === null || item === void 0 ? void 0 : item.name, link: item === null || item === void 0 ? void 0 : item.link, originFont: item === null || item === void 0 ? void 0 : item.font, font: 'externo', delivery: item === null || item === void 0 ? void 0 : item.delivery }));
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
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', width: '100%' },
        React.createElement(ModalMoodle, { open: searchInMoodle, onAdd: handleAddMoodleDocument, onClose: () => setSearchInMoodle(false) }),
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '9rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, alignItems: 'center' },
                React.createElement(Grid, { item: true, sm: 12, md: 2, lg: 2 },
                    React.createElement(FormControl, { component: 'fieldset', disabled: detailApproved || !canEdit },
                        React.createElement(FormLabel, { component: 'legend' }, "Fonte"),
                        React.createElement(RadioGroup, { "aria-label": 'fonte', name: 'font', value: formik.values.font, onChange: formik.handleChange, defaultValue: 'moodle' },
                            React.createElement(FormControlLabel, { value: 'moodle', control: React.createElement(Radio, { color: 'primary' }), label: 'Moodle', labelPlacement: 'end' }),
                            React.createElement(FormControlLabel, { value: 'externo', control: React.createElement(Radio, { color: 'primary' }), label: 'Externo', labelPlacement: 'end' })))),
                React.createElement(Grid, { container: true, spacing: 3, sm: 12, md: 8, lg: 8, style: { margin: 0 } }, formik.values.font === 'externo' ? (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(TextField, { autoFocus: true, fullWidth: true, label: 'Nome', type: 'text', name: 'name', disabled: detailApproved ||
                                !canEdit ||
                                (editDocument.isEdit &&
                                    (formik.values.originFont || formik.values.font) !==
                                        'externo'), inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(Autocomplete, { options: Object.keys(EDeliveryType), getOptionLabel: (option) => EDeliveryType[option], onChange: (event, newValue) => {
                                formik.setFieldValue(`delivery`, newValue);
                            }, noOptionsText: 'Sem Op\u00E7\u00F5es', disabled: detailApproved || !canEdit, renderInput: (params) => {
                                var _a, _b;
                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Momento Entrega', 
                                    // @ts-ignore
                                    error: !!((_a = formik.errors) === null || _a === void 0 ? void 0 : _a.delivery), 
                                    // @ts-ignore
                                    helperText: (_b = formik.errors) === null || _b === void 0 ? void 0 : _b.delivery })));
                            }, value: (_a = formik.values) === null || _a === void 0 ? void 0 : _a.delivery })),
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { fullWidth: true, label: 'Link', type: 'text', name: 'link', disabled: detailApproved || !canEdit, inputProps: { maxLength: 100 }, error: !!formik.errors.link, helperText: formik.errors.link, onChange: formik.handleChange, value: formik.values.link })))) : (React.createElement(Button, { onClick: () => setSearchInMoodle(true), disabled: detailApproved || !canEdit, variant: 'contained', color: 'primary' }, "Pesquisar documento"))),
                React.createElement(Grid, { item: true, sm: 12, md: 2, lg: 2 },
                    React.createElement(Button, { variant: 'contained', color: 'primary', disabled: detailApproved || !canEdit, onClick: () => formik.handleSubmit() }, "Salvar")))),
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
                    React.createElement(TableBody, null, (_b = documents === null || documents === void 0 ? void 0 : documents.filter((e) => !e.deleted)) === null || _b === void 0 ? void 0 : _b.map((row) => {
                        var _a;
                        return (React.createElement(TableRow, { key: row.name },
                            React.createElement(TableCell, { component: 'th', scope: 'row' }, row.name),
                            React.createElement(TableCell, null, (_a = row === null || row === void 0 ? void 0 : row.font) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()),
                            React.createElement(TableCell, null,
                                React.createElement("a", { href: formatUrl(row === null || row === void 0 ? void 0 : row.link), target: '_blank' }, "Acesse")),
                            React.createElement(TableCell, null, EDeliveryType[row.delivery]),
                            React.createElement(TableCell, null,
                                React.createElement(IconButton, { disabled: detailApproved || !canEdit, onClick: () => handleEditDocument(row) },
                                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                                        React.createElement(Edit, null))),
                                React.createElement(IconButton, { disabled: detailApproved || !canEdit, onClick: () => handleRemoveDocument(row.keyId) },
                                    React.createElement(Tooltip, { arrow: true, title: 'Remover' },
                                        React.createElement(Delete, null))))));
                    })))))));
};
export default Documents;
//# sourceMappingURL=index.js.map