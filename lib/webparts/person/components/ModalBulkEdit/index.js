import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, Grid, CircularProgress, IconButton, } from '@material-ui/core';
import { useFormik } from 'formik';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { bulkUpdatePerson } from '~/store/modules/person/actions';
const ModalBulkEdit = ({ open, tags, persons, notification, handleClose, }) => {
    const DEFAULT_VALUES = {
        school: '',
        tag: null,
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const onClose = () => {
        formik.handleReset(DEFAULT_VALUES);
        setInitialValues(DEFAULT_VALUES);
        handleClose();
    };
    const handleSuccess = () => {
        onClose();
        setLoading(false);
        notification.success({
            title: 'Sucesso',
            description: 'Atualizado(s) com sucesso',
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
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            setLoading(true);
            dispatch(bulkUpdatePerson(Object.assign(Object.assign({}, values), { data: persons }), {
                onSuccess: handleSuccess,
                onError: handleError,
            }));
        },
    });
    const tagOptions = tags === null || tags === void 0 ? void 0 : tags.map((e) => ({
        value: e[`${PREFIX}etiquetaid`],
        label: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
    }));
    return (React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true },
        React.createElement(DialogTitle, null,
            "Atualizar Pessoa(s)",
            React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(TextField, { fullWidth: true, label: 'Escola de origem', type: 'text', name: 'school', error: !!formik.errors.school, helperText: formik.errors.school, onChange: formik.handleChange, value: formik.values.school })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Autocomplete, { noOptionsText: 'Sem Op\u00E7\u00F5es', options: tagOptions === null || tagOptions === void 0 ? void 0 : tagOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                            formik.setFieldValue('tag', newValue);
                        }, getOptionLabel: (option) => option.label || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.tag, helperText: formik.errors.tag, label: 'Etiqueta' }))), value: formik.values.tag })))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default ModalBulkEdit;
//# sourceMappingURL=index.js.map