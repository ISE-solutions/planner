import * as React from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addOrUpdateCustomFilter } from '~/store/modules/customFilter/actions';
import { useLoggedUser, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
const AddCustomFilter = ({ open, filter, type, filterSaved, onClose, refetch, }) => {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { currentUser } = useLoggedUser();
    React.useEffect(() => {
        if (filterSaved) {
            formik.setFieldValue('name', filterSaved === null || filterSaved === void 0 ? void 0 : filterSaved[`${PREFIX}nome`]);
        }
    }, [filterSaved]);
    const handleSuccess = () => {
        setLoading(false);
        refetch === null || refetch === void 0 ? void 0 : refetch();
        notification.success({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso',
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
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: yup.object({
            name: yup.mixed().required('Campo Obrigatório'),
        }),
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            setLoading(true);
            dispatch(addOrUpdateCustomFilter(Object.assign(Object.assign({}, values), { type, id: filterSaved === null || filterSaved === void 0 ? void 0 : filterSaved[`${PREFIX}filtroid`], user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], value: filter }), {
                onSuccess: handleSuccess,
                onError: handleError,
            }));
        },
    });
    const handleClose = () => {
        formik.handleReset({});
        onClose();
    };
    return (React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: open, onClose: handleClose },
        React.createElement(DialogTitle, null, "Salvar Filtro"),
        React.createElement(DialogContent, null,
            React.createElement(TextField, { autoFocus: true, fullWidth: true, value: formik.values.name, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, margin: 'dense', label: 'Nome', name: 'name', placeholder: 'Informe o nome do filtro', type: 'text' })),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose }, "Cancelar"),
            React.createElement(Button, { onClick: () => formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : ('Salvar')))));
};
export default AddCustomFilter;
//# sourceMappingURL=index.js.map