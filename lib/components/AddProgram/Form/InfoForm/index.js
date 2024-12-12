import * as React from 'react';
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import AddTag from '~/components/AddTag';
import { useLoggedUser } from '~/hooks';
const InfoForm = ({ tags, isDetail, isModel, isDraft, isProgramResponsible, values, program, errors, loadingApproval, handleAproval, handleEditApproval, handleChange, setFieldValue, }) => {
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { currentUser } = useLoggedUser();
    const typeProgramOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_PROGRAMA);
    }), [tags]);
    const nameProgramOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NOME_PROGRAMA);
    }), [tags]);
    const instituteOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.INSTITUTO);
    }), [tags]);
    const companyOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EMPRESA);
    }), [tags]);
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
    }), [tags]);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const canApprove = React.useMemo(() => isProgramResponsible || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), [isProgramResponsible, currentUser]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    return (React.createElement(Grid, { container: true, spacing: 3 },
        isModel && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { required: true, autoFocus: true, fullWidth: true, label: 'T\u00EDtulo', type: 'text', name: 'title', disabled: isDetail, inputProps: { maxLength: 255 }, error: !!errors.title, helperText: errors.title, onChange: handleChange, value: values.title }))),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaonomeprograma_value`]), options: (nameProgramOptions === null || nameProgramOptions === void 0 ? void 0 : nameProgramOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.nameProgram, onChange: (event, newValue) => {
                        setFieldValue('nameProgram', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Nome do Programa', error: !!errors.nameProgram, helperText: errors.nameProgram }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.NOME_PROGRAMA) },
                        React.createElement(PlusOne, null)))),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaonomeprograma_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, canApprove && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomePrograma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoNomePrograma', 'dataaprovacaonomeprograma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaonomeprograma_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                canApprove &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaonomeprograma_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomePrograma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoNomePrograma', 'dataaprovacaonomeprograma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: 'Sigla', type: 'text', name: 'sigla', disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaosigla_value`]), inputProps: { maxLength: 50 }, error: !!errors.sigla, helperText: errors.sigla, onChange: handleChange, value: values.sigla }),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaosigla_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSigla) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoSigla', 'dataaprovacaosigla'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaosigla_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaosigla_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSigla) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoSigla', 'dataaprovacaosigla'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotipoprograma_value`]), options: (typeProgramOptions === null || typeProgramOptions === void 0 ? void 0 : typeProgramOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.typeProgram, onChange: (event, newValue) => {
                        setFieldValue('typeProgram', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Tipo do Programa' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.TIPO_PROGRAMA) },
                        React.createElement(PlusOne, null)))),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotipoprograma_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, canApprove && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTipoPrograma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTipoPrograma', 'dataaprovacaotipoprograma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotipoprograma_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                canApprove &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotipoprograma_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTipoPrograma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTipoPrograma', 'dataaprovacaotipoprograma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoinstituto_value`]), options: (instituteOptions === null || instituteOptions === void 0 ? void 0 : instituteOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.institute, onChange: (event, newValue) => {
                        setFieldValue('institute', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Instituto' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.INSTITUTO) },
                        React.createElement(PlusOne, null)))),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoinstituto_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, canApprove && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoInstituto) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoInstituto', 'dataaprovacaoinstituto'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoinstituto_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                canApprove &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoinstituto_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoInstituto) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoInstituto', 'dataaprovacaoinstituto'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoempresa_value`]), options: (companyOptions === null || companyOptions === void 0 ? void 0 : companyOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.company, onChange: (event, newValue) => {
                        setFieldValue('company', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Empresa' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.EMPRESA) },
                        React.createElement(PlusOne, null)))),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoempresa_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, canApprove && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoEmpresa) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoEmpresa', 'dataaprovacaoempresa'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoempresa_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                canApprove &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaoempresa_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoEmpresa) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoEmpresa', 'dataaprovacaoempresa'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: (temperatureOptions === null || temperatureOptions === void 0 ? void 0 : temperatureOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], value: values.temperature, disabled: isDetail || !!(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotemperatura_value`]), onChange: (event, newValue) => {
                    setFieldValue('temperature', newValue);
                }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Temperatura/Status' }))) }),
            (program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotemperatura_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, canApprove && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTemperatura) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTemperatura', 'dataaprovacaotemperatura'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotemperatura_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                canApprove &&
                    !(program === null || program === void 0 ? void 0 : program[`_${PREFIX}aprovacaotemperatura_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTemperatura) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTemperatura', 'dataaprovacaotemperatura'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.isReserve, disabled: isDetail, onChange: (event) => setFieldValue('isReserve', event.target.checked), name: 'isReserve', color: 'primary' }), label: 'Marcar se for evento interno' })),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default InfoForm;
//# sourceMappingURL=index.js.map