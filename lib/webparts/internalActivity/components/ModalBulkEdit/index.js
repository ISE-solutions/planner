import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField, Grid, CircularProgress, } from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { bulkUpdateActivity } from '~/store/modules/activity/actions';
const ModalBulkEdit = ({ open, academicActivities, notification, handleClose, }) => {
    const DEFAULT_VALUES = {
        school: '',
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const validationSchema = yup.object({
        school: yup.string().required('Campo Obrigatório'),
    });
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
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setLoading(true);
            bulkUpdateActivity(Object.assign(Object.assign({}, values), { data: academicActivities }), {
                onSuccess: handleSuccess,
                onError: handleError,
            });
        },
    });
    return (React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true },
        React.createElement(DialogTitle, null, "Atualizar Categoria(s)"),
        React.createElement(DialogContent, null,
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(TextField, { fullWidth: true, label: 'Escola de origem', type: 'text', name: 'school', error: !!formik.errors.school, helperText: formik.errors.school, onChange: formik.handleChange, value: formik.values.school })))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default ModalBulkEdit;
//# sourceMappingURL=index.js.map