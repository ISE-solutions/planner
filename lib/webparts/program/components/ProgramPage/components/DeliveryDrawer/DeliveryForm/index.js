import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, } from '@material-ui/core';
import { v4 } from 'uuid';
import * as moment from 'moment';
import * as React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useFormik } from 'formik';
import { Done, Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { addOrUpdateDelivery } from '~/store/modules/delivery/actions';
import * as _ from 'lodash';
import { useNotification } from '~/hooks';
const DeliveryForm = ({ open, teamId, setDelivery, nextDelivery, onClose, allDays, daysAvailable, delivery, }) => {
    const DEFAULT_VALUES = React.useMemo(() => ({
        title: `Entrega ${nextDelivery}`,
        finalGrid: moment(),
        outlines: moment(),
        times: moment(),
        approval: moment(),
        moodleFolder: moment(),
        checkMoodle: moment(),
        days: [],
    }), [nextDelivery]);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const [loading, setLoading] = React.useState(false);
    const { notification } = useNotification();
    React.useEffect(() => {
        var _a;
        if (delivery) {
            const iniVal = {
                title: delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}titulo`],
                finalGrid: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}gradefinal`]),
                outlines: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}outlines`]),
                times: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}horarios`]),
                approval: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}aprovacao`]),
                moodleFolder: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}moodlepasta`]),
                checkMoodle: moment(delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}conferirmoodle`]),
                days: (_a = delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}Entrega_CronogramadeDia`]) === null || _a === void 0 ? void 0 : _a.map((e) => (Object.assign(Object.assign({}, e), { keyId: v4() }))),
            };
            setInitialValues(iniVal);
        }
    }, [delivery]);
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            var _a;
            const daysSelected = (_a = values.days) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e.deleted));
            if (!daysSelected.length) {
                notification.error({
                    title: 'Sem dias',
                    description: 'Selecione o(s) dia(s) para entrega',
                });
                return;
            }
            setLoading(true);
            addOrUpdateDelivery(Object.assign(Object.assign({}, values), { teamId, title: (delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}entregaid`])
                    ? values.title
                    : `Entrega ${nextDelivery}`, days: values.days.filter((e) => !e.deleted), daysToDelete: values.days.filter((e) => e.deleted), id: delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}entregaid`] }), {
                onSuccess: (del) => {
                    setLoading(false);
                    setDelivery(del);
                    notification.success({
                        title: 'Sucesso',
                        description: 'Entrada salva com sucesso',
                    });
                },
                onError: (err) => {
                    var _a, _b;
                    setLoading(false);
                    notification.error({
                        title: 'Falha',
                        description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                    });
                },
            });
        },
    });
    const handleAddDay = (day) => {
        const newDays = _.cloneDeep(formik.values.days);
        newDays.push(Object.assign(Object.assign({}, day), { keyId: v4() }));
        formik.setFieldValue('days', newDays);
    };
    const handleRemoveDay = (scheduleId) => {
        let newDays = _.cloneDeep(formik.values.days);
        newDays = newDays === null || newDays === void 0 ? void 0 : newDays.map((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}cronogramadediaid`]) === scheduleId
            ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        formik.setFieldValue('days', newDays);
    };
    const handleClose = () => {
        setDelivery(null);
        setInitialValues(DEFAULT_VALUES);
        formik.resetForm();
        onClose();
    };
    const checkDisabled = (item) => {
        return !(daysAvailable === null || daysAvailable === void 0 ? void 0 : daysAvailable.some((dt) => (dt === null || dt === void 0 ? void 0 : dt[`${PREFIX}data`]) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}data`])));
    };
    return (React.createElement("div", null,
        React.createElement(Dialog, { open: open, onClose: handleClose, "aria-labelledby": 'DeliveryTitle', "aria-describedby": 'DeliveryDescription' },
            React.createElement(DialogTitle, { id: 'DeliveryTitle' },
                React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, (delivery === null || delivery === void 0 ? void 0 : delivery[`${PREFIX}entregaid`])
                    ? 'Editar Entrega'
                    : 'Cadastrar Entrega'),
                React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null))),
            React.createElement(DialogContent, null,
                React.createElement(Box, { marginBottom: '1rem', display: 'flex', style: { gap: '10px' }, flexWrap: 'wrap' }, allDays === null || allDays === void 0 ? void 0 : allDays.map((item) => {
                    var _a, _b, _c;
                    const isSelected = (_b = (_a = formik.values.days) === null || _a === void 0 ? void 0 : _a.filter((e) => !(e === null || e === void 0 ? void 0 : e.deleted))) === null || _b === void 0 ? void 0 : _b.some((dt) => (dt === null || dt === void 0 ? void 0 : dt[`${PREFIX}data`]) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}data`]));
                    const isSelectable = (_c = formik.values.days) === null || _c === void 0 ? void 0 : _c.some((dt) => (dt === null || dt === void 0 ? void 0 : dt[`${PREFIX}data`]) === (item === null || item === void 0 ? void 0 : item[`${PREFIX}data`]));
                    return (React.createElement(Chip, { icon: isSelected ? React.createElement(Done, null) : React.createElement(Close, null), label: moment.utc(item === null || item === void 0 ? void 0 : item[`${PREFIX}data`]).format('DD/MM/YYYY'), key: item === null || item === void 0 ? void 0 : item[`${PREFIX}data`], disabled: !isSelectable && checkDisabled(item), color: isSelected ? 'primary' : 'default', onClick: () => isSelected
                            ? handleRemoveDay(item === null || item === void 0 ? void 0 : item[`${PREFIX}cronogramadediaid`])
                            : handleAddDay(item) }));
                })),
                React.createElement(Box, { alignItems: 'center', justifyContent: 'space-evenly' },
                    React.createElement(Box, { display: 'grid', gridTemplateColumns: '1fr 1fr', gridRowGap: '10px', alignItems: 'center' },
                        React.createElement(Typography, null, "Grade Final"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('finalGrid', value);
                            }, value: formik.values.finalGrid }),
                        React.createElement(Typography, null, "Outlines"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('outlines', value);
                            }, value: formik.values.outlines }),
                        React.createElement(Typography, null, "Hor\u00E1rios"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('times', value);
                            }, value: formik.values.times }),
                        React.createElement(Typography, null, "Aprova\u00E7\u00E3o"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('approval', value);
                            }, value: formik.values.approval }),
                        React.createElement(Typography, null, " Moodle/Pasta"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('moodleFolder', value);
                            }, value: formik.values.moodleFolder }),
                        React.createElement(Typography, null, "Conferir Moodle"),
                        React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', onChange: (value) => {
                                formik.setFieldValue('checkMoodle', value);
                            }, value: formik.values.checkMoodle })))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleClose, color: 'primary' }, "Cancelar"),
                React.createElement(Button, { onClick: () => !loading && formik.handleSubmit(), variant: 'contained', color: 'primary', autoFocus: true }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar'))))));
};
export default DeliveryForm;
//# sourceMappingURL=index.js.map