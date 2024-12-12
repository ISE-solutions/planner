import * as React from 'react';
import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import AddTag from '~/components/AddTag';
import { AccessTime, CheckCircle, Edit, PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';
const InfoForm = ({ tags, isModel, isDraft, isDetail, values, errors, team, handleChange, setFieldValue, loadingApproval, isProgramResponsible, isProgramDirector, isFinance, handleAproval, handleEditApproval, }) => {
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const [editName, setEditName] = React.useState(true);
    const { currentUser } = useLoggedUser();
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
    }), [tags]);
    const modalityOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_TURMA);
    }), [tags]);
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const toolVideoConferenceOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA));
    }), [tags]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    return (React.createElement(Grid, { container: true, spacing: 3 },
        isModel ? (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { autoFocus: true, fullWidth: true, required: true, label: 'T\u00EDtulo', type: 'text', name: 'title', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotitulo_value`]), inputProps: { maxLength: 255 }, error: !!errors.title, helperText: errors.title, onChange: handleChange, value: values.title }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotitulo_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTitulo) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTitulo', 'dataaprovacaotitulo'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotitulo_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotitulo_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTitulo) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTitulo', 'dataaprovacaotitulo'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null))) : null,
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: isModel ? 'Sigla' : 'Sigla*', type: 'text', name: 'sigla', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaosigla_value`]), inputProps: { maxLength: 50 }, error: !!errors.sigla, helperText: errors.sigla, onChange: handleChange, value: values.sigla }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaosigla_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSigla) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoSigla', 'dataaprovacaosigla'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaosigla_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaosigla_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSigla) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoSigla', 'dataaprovacaosigla'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(TextField, { fullWidth: true, label: 'Nome', type: 'text', name: 'name', disabled: isDetail || editName, inputProps: { maxLength: 50 }, error: !!errors.name, helperText: errors.name, onChange: handleChange, value: values.name }),
                React.createElement(Tooltip, { title: 'Editar' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => {
                            setEditName(false);
                            setFieldValue('nameEdited', true);
                        } },
                        React.createElement(Edit, null))))),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: 'C\u00F3digo da turma (Financeiro)', type: 'text', name: 'teamCode', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaocodigoturma_value`]), inputProps: { maxLength: 50 }, error: !!errors.teamCode, helperText: errors.teamCode, onChange: handleChange, value: values.teamCode }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaocodigoturma_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, isFinance && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoCodigoTurma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoCodigoTurma', 'dataaprovacaocodigoturma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaocodigoturma_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                isFinance && !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaocodigoturma_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoCodigoTurma) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoCodigoTurma', 'dataaprovacaocodigoturma'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: 'Nome da turma (Financeiro)', type: 'text', name: 'teamName', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefinanceiro_value`]), inputProps: { maxLength: 50 }, error: !!errors.teamName, helperText: errors.teamName, onChange: handleChange, value: values.teamName }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefinanceiro_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, isFinance && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFinanceiro) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoNomeFinanceiro', 'dataaprovacaonomefinanceiro'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefinanceiro_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                isFinance && !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaonomefinanceiro_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoNomeFinanceiro) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoNomeFinanceiro', 'dataaprovacaonomefinanceiro'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: 'M\u00E1scara do Link', type: 'text', name: 'mask', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaolink_value`]), inputProps: { maxLength: 50 }, error: !!errors.mask, helperText: errors.mask, onChange: handleChange, value: values.mask }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaolink_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoLink) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoLink', 'dataaprovacaolink'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaolink_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaolink_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoLink) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoLink', 'dataaprovacaolink'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail, options: toolVideoConferenceOptions, value: values.videoConference, onChange: (event, newValue) => setFieldValue('videoConference', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Ferramenta de videoconfer\u00EAncia' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA) },
                        React.createElement(PlusOne, null))))),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: isDetail, options: toolVideoConferenceOptions, value: values.videoConferenceBackup, onChange: (event, newValue) => setFieldValue('videoConferenceBackup', newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Ferramenta de videoconfer\u00EAncia (Backup)' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA) },
                        React.createElement(PlusOne, null))))),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(TextField, { fullWidth: true, label: isModel ? 'Ano de Conclusão' : 'Ano de Conclusão*', type: 'number', name: 'yearConclusion', disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoanoconclusao_value`]), error: !!errors.yearConclusion, helperText: errors.yearConclusion, onChange: (event) => parseInt(event.target.value) < 9999 &&
                    setFieldValue('yearConclusion', event.target.value), value: values.yearConclusion }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoanoconclusao_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoAnoConclusao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoAnoConclusao', 'dataaprovacaoanoconclusao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoanoconclusao_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaoanoconclusao_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoAnoConclusao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoAnoConclusao', 'dataaprovacaoanoconclusao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: (temperatureOptions === null || temperatureOptions === void 0 ? void 0 : temperatureOptions.filter((e) => e[`${PREFIX}ativo`])) || [], value: values.temperature, disabled: isDetail || !!(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotemperatura_value`]), onChange: (event, newValue) => {
                    setFieldValue('temperature', newValue);
                }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { required: !isModel, fullWidth // @ts-ignore
                    : true, error: !!(errors === null || errors === void 0 ? void 0 : errors.temperature), 
                    // @ts-ignore
                    helperText: errors === null || errors === void 0 ? void 0 : errors.temperature, label: 'Temperatura/Status' }))) }),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotemperatura_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTemperatura) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTemperatura', 'dataaprovacaotemperatura'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotemperatura_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaotemperatura_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTemperatura) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTemperatura', 'dataaprovacaotemperatura'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(Box, { display: 'flex', alignItems: 'center' },
                React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: (modalityOptions === null || modalityOptions === void 0 ? void 0 : modalityOptions.filter((e) => e[`${PREFIX}ativo`])) || [], value: values.modality, disabled: isDetail, onChange: (event, newValue) => {
                        setFieldValue('modality', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { required: !isModel, fullWidth: true, error: !!(errors === null || errors === void 0 ? void 0 : errors.modality), 
                        // @ts-ignore
                        helperText: errors === null || errors === void 0 ? void 0 : errors.modality, label: 'Modalidade' }))) }),
                React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                    React.createElement(IconButton, { disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.MODALIDADE_TURMA) },
                        React.createElement(PlusOne, null)))),
            (team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaomodalidade_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                    React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                React.createElement(Box, null, (isProgramDirector || isProgramResponsible) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModalidade) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoModalidade', 'dataaprovacaomodalidade'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaomodalidade_value`]) &&
                    !isModel &&
                    !isDraft && (React.createElement(React.Fragment, null,
                    React.createElement(AccessTime, { fontSize: 'small' }),
                    React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                (isProgramDirector || isProgramResponsible) &&
                    !(team === null || team === void 0 ? void 0 : team[`_${PREFIX}aprovacaomodalidade_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoModalidade) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoModalidade', 'dataaprovacaomodalidade'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
        !isModel && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
            React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.concurrentActivity, disabled: isDetail, onChange: (event) => setFieldValue('concurrentActivity', event.target.checked), name: 'concurrentActivity', color: 'primary' }), label: 'Permitir atividades concorrentes' }))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag })));
};
export default InfoForm;
//# sourceMappingURL=index.js.map