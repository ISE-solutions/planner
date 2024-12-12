import * as React from 'react';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { AddTag } from '~/components';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { useSelector } from 'react-redux';
import { PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';
const Info = ({ formik, activityType }) => {
    var _a, _b, _c;
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { currentUser } = useLoggedUser();
    const { space, tag } = useSelector((state) => state);
    const { tags } = tag;
    const { spaces } = space;
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const areaOptions = tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { autoFocus: true, fullWidth: true, required: true, label: 'Nome da Atividade', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!formik.errors.name, helperText: formik.errors.name, onChange: formik.handleChange, value: formik.values.name })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Box, { display: 'flex', alignItems: 'end', style: { gap: '10px' } },
                        React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, disabled: true, cancelLabel: 'Cancelar', invalidDateMessage: 'Formato inv\u00E1lido', label: 'In\u00EDcio da Atividade', value: formik.values.startTime, onChange: (value) => {
                                formik.setFieldValue('startTime', value);
                                if (!value) {
                                    formik.setFieldValue('endTime', null);
                                    return;
                                }
                                if (formik.values.duration) {
                                    const duration = formik.values.duration.hour() * 60 +
                                        formik.values.duration.minute();
                                    formik.setFieldValue('endTime', value === null || value === void 0 ? void 0 : value.clone().add(duration, 'minutes'));
                                }
                            } }))),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(KeyboardTimePicker, { required: true, ampm: false, fullWidth: true, cancelLabel: 'Cancelar', invalidDateMessage: 'Formato inv\u00E1lido', label: 'Dura\u00E7\u00E3o da Atividade', value: formik.values.duration, error: !!formik.errors.duration, helperText: (_a = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _a === void 0 ? void 0 : _a.duration, onChange: (value) => {
                            var _a, _b;
                            formik.setFieldValue('duration', value);
                            if (formik.values.startTime) {
                                const duration = (value === null || value === void 0 ? void 0 : value.hour()) * 60 + (value === null || value === void 0 ? void 0 : value.minute());
                                formik.setFieldValue('endTime', (_b = (_a = formik.values.startTime) === null || _a === void 0 ? void 0 : _a.clone()) === null || _b === void 0 ? void 0 : _b.add(duration, 'minutes'));
                            }
                        } })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(KeyboardTimePicker, { disabled: true, ampm: false, fullWidth: true, cancelLabel: 'Cancelar', label: 'Fim da Atividade', invalidDateMessage: 'Formato inv\u00E1lido', value: formik.values.endTime, onChange: formik.handleChange })),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(TextField, { fullWidth: true, label: 'Quantidade de Sess\u00F5es', type: 'number', name: 'quantity', error: !!formik.errors.quantity, helperText: formik.errors.quantity, onChange: formik.handleChange, value: formik.values.quantity })),
                activityType === TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: areaOptions === null || areaOptions === void 0 ? void 0 : areaOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                                formik.setFieldValue('area', newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.area, helperText: formik.errors.area, label: '\u00C1rea Acad\u00EAmica' }))), value: formik.values.area }),
                        React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                            React.createElement(IconButton, { disabled: !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.AREA_ACADEMICA) },
                                React.createElement(PlusOne, null)))))),
                React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                    React.createElement(Autocomplete, { multiple: true, disabled: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: spaces === null || spaces === void 0 ? void 0 : spaces.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                            formik.setFieldValue('spaces', newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!formik.errors.spaces, helperText: formik.errors.spaces, label: 'Espa\u00E7o' }))), value: formik.values.spaces })),
                activityType !== TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { disabled: true, fullWidth: true, minRows: 2, label: 'Tema', type: 'text', name: 'theme', inputProps: { maxLength: 255 }, 
                        // @ts-ignore
                        error: !!((_b = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _b === void 0 ? void 0 : _b.theme), 
                        // @ts-ignore
                        helperText: (_c = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _c === void 0 ? void 0 : _c.theme, onChange: formik.handleChange, value: formik.values.theme }))))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default Info;
//# sourceMappingURL=index.js.map