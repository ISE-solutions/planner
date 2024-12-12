import * as React from 'react';
import { Box, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, Link, MenuItem, Select, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import AddTag from '~/components/AddTag';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';
const InfoForm = ({ values, teamId, titleRequired, isGroup, isDetail, isModel, isDraft, isScheduleModel, errors, schedule, tagsOptions, setFieldValue, isProgramResponsible, isProgramDirector, isHeadOfService, setDateReference, handleChange, loadingApproval, handleAproval, handleEditApproval, }) => {
    const [day, setDay] = React.useState(0);
    const [month, setMonth] = React.useState(0);
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { currentUser } = useLoggedUser();
    const temperatureOptions = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS));
    }), [tagsOptions]);
    const modalidadeOptions = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_DIA));
    }), [tagsOptions]);
    const moduleOptions = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODULO));
    }), [tagsOptions]);
    const placeOptions = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.CLASS_LOCALE));
    }), [tagsOptions]);
    const fatherTags = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`]) && (e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`])), [tagsOptions]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tagsOptions]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    function minTwoDigits(n) {
        return (n < 10 ? '0' : '') + n;
    }
    const handleDayMonth = (d, m) => {
        const date = moment(`2006-${minTwoDigits(m)}-${minTwoDigits(d)}`);
        setFieldValue('date', date);
        setDateReference(date);
    };
    const handleIsGroupChange = (e) => {
        handleChange(e);
        setFieldValue('duration', e.target.checked ? moment('00:05', 'HH:mm') : null);
    };
    return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
        !isModel && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, autoFocus: true, fullWidth: true, required: true, disabled: isDetail || !!(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaodata_value`]), variant: 'inline', format: 'DD/MM/YYYY', label: 'Data', error: !!errors.date, 
                // @ts-ignore
                helperText: errors.date, value: values.date, onChange: (value) => {
                    setFieldValue('date', value);
                    setDateReference(value);
                } }),
            (schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaodata_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoData) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoData', 'dataaprovacaodata'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaodata_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaodata_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoData) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoData', 'dataaprovacaodata'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null))),
        isModel && teamId && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', width: '100%', style: { gap: '1rem' } },
                React.createElement(FormControl, { disabled: isDetail, fullWidth: true, error: !!errors.date },
                    React.createElement(InputLabel, null, "Dia"),
                    React.createElement(Select, { fullWidth: true, value: day, required: true, onChange: (event) => {
                            setDay(+event.target.value);
                            handleDayMonth(+event.target.value, month);
                        }, label: 'Dia' }, Array(31)
                        .fill(1)
                        .map((e, index) => (React.createElement(MenuItem, { value: index }, index)))),
                    errors.date ? (React.createElement(FormHelperText, null, "Informe um dia")) : null),
                React.createElement(FormControl, { disabled: isDetail, fullWidth: true, error: !!errors.date },
                    React.createElement(InputLabel, null, "M\u00EAs"),
                    React.createElement(Select, { fullWidth: true, required: true, value: month, onChange: (event) => {
                            setMonth(+event.target.value);
                            handleDayMonth(day, +event.target.value);
                        }, label: 'M\u00EAs' }, Array(13)
                        .fill(1)
                        .map((e, index) => (React.createElement(MenuItem, { value: index }, index)))),
                    errors.date ? (React.createElement(FormHelperText, null, "Informe um m\u00EAs")) : null)))),
        isModel && titleRequired && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { required: true, fullWidth: true, label: 'T\u00EDtulo', type: 'text', name: 'name', disabled: isDetail, inputProps: { maxLength: 255 }, error: !!errors.name, helperText: errors.name, onChange: handleChange, value: values.name }))),
        !isGroup && (React.createElement(React.Fragment, null,
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail || !!(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodulo_value`]), options: moduleOptions, value: values.module, onChange: (event, newValue) => setFieldValue('module', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'M\u00F3dulo' }))) }),
                    React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                        React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.MODULO) },
                            React.createElement(PlusOne, null)))),
                (schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodulo_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModulo) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoModulo', 'dataaprovacaomodulo'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodulo_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    (isProgramDirector || isProgramResponsible) &&
                        !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodulo_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModulo) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoModulo', 'dataaprovacaomodulo'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail ||
                            !!(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodalidade_value`]), options: modalidadeOptions, value: values.modality, onChange: (event, newValue) => setFieldValue('modality', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Modalidade' }))) }),
                    React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                        React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.MODALIDADE_DIA) },
                            React.createElement(PlusOne, null)))),
                (schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodalidade_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModalidade) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoModalidade', 'dataaprovacaomodalidade'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodalidade_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    (isProgramDirector || isProgramResponsible) &&
                        !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaomodalidade_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModalidade) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoModalidade', 'dataaprovacaomodalidade'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail, options: placeOptions, value: values.place, onChange: (event, newValue) => setFieldValue('place', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Local' }))) }),
                    React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                        React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.CLASS_LOCALE) },
                            React.createElement(PlusOne, null))))),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(TextField, { fullWidth: true, label: 'Link aberto', type: 'text', name: 'link', disabled: isDetail || !!(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaolink_value`]), inputProps: { maxLength: 50 }, error: !!errors.link, helperText: errors.link, onChange: handleChange, value: values.link }),
                (schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaolink_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, (isHeadOfService || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoLink) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoLink', 'dataaprovacaolink'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaolink_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    (isHeadOfService || isProgramResponsible) &&
                        !(schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}aprovacaolink_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoLink) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoLink', 'dataaprovacaolink'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: temperatureOptions || [], value: values.temperature, disabled: isDetail, onChange: (event, newValue) => {
                        setFieldValue('temperature', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Temperatura/Status' }))) })))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default InfoForm;
//# sourceMappingURL=index.js.map