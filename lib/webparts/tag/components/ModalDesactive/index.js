import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Grid, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, } from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import { Close } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { desactiveTag } from '~/store/modules/tag/actions';
const ModalDesactive = ({ open, tag, notification, handleClose, }) => {
    var _a;
    const DEFAULT_VALUES = {
        type: 'definitivo',
        start: null,
        end: null,
    };
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const validationSchema = yup.object({
        start: yup.mixed().when('type', {
            is: 'temporario',
            then: yup.mixed().required('Campo Obrigatório'),
        }),
        end: yup.mixed().when('type', {
            is: 'temporario',
            then: yup.mixed().required('Campo Obrigatório'),
        }),
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
            description: 'Desativado com sucesso',
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
            dispatch(desactiveTag(Object.assign(Object.assign({}, values), { data: tag }), {
                onSuccess: handleSuccess,
                onError: handleError,
            }));
        },
    });
    return (React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true },
        React.createElement(DialogTitle, null,
            "Desativar Etiqueta",
            React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(FormLabel, { component: 'legend' }, "Tipo de Desativa\u00E7\u00E3o"),
                        React.createElement(RadioGroup, { "aria-label": 'desativacao', name: 'type', value: formik.values.type, onChange: formik.handleChange },
                            React.createElement(FormControlLabel, { value: 'definitivo', control: React.createElement(Radio, { color: 'primary' }), label: 'Definitivo' }),
                            React.createElement(FormControlLabel, { value: 'temporario', control: React.createElement(Radio, { color: 'primary' }), label: 'Tempor\u00E1rio' })))),
                formik.values.type === 'temporario' && (React.createElement(React.Fragment, null,
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, disablePast: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Data In\u00EDcio de Desativa\u00E7\u00E3o', error: !!formik.errors.start, helperText: formik.errors.start, value: formik.values.start, onChange: (value) => formik.setFieldValue('start', value) })),
                    React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                        React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, minDate: ((_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.start) || moment(), variant: 'inline', format: 'DD/MM/YYYY', label: 'Data Final de Desativa\u00E7\u00E3o', error: !!formik.errors.end, helperText: formik.errors.end, value: formik.values.end, onChange: (value) => formik.setFieldValue('end', value) })))))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default ModalDesactive;
//# sourceMappingURL=index.js.map