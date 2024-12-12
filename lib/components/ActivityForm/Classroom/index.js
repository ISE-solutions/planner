import * as React from 'react';
import { Box, CircularProgress, Grid, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import AddTag from '~/components/AddTag';
const Classroom = ({ canEdit, isDetail, values, errors, isModel, isDraft, isProgramDirector, isProgramResponsible, detailApproved, handleChange, setFieldValue, activity, currentUser, loadingApproval, handleAproval, handleEditApproval, }) => {
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const { tag, person } = useSelector((state) => state);
    const { dictTag, tags } = tag;
    const { dictPeople } = person;
    const isTeacher = React.useMemo(() => {
        var _a, _b;
        if (!((_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.length))
            return false;
        return (_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.some((act) => {
            const per = dictPeople[act === null || act === void 0 ? void 0 : act[`_${PREFIX}pessoa_value`]];
            const func = dictTag[act === null || act === void 0 ? void 0 : act[`_${PREFIX}funcao_value`]];
            return ((per === null || per === void 0 ? void 0 : per[`${PREFIX}pessoaid`]) === (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) &&
                (func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.PROFESSOR);
        });
    }, [activity, currentUser, dictPeople, dictTag]);
    const courseOptions = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COURSE);
    });
    const fatherTags = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tags]);
    const handleNewTag = React.useCallback((type) => {
        const tag = tags.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tags]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    return (React.createElement(React.Fragment, null,
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag }),
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { autoFocus: true, fullWidth: true, minRows: 2, label: 'Tema', type: 'text', name: 'theme', disabled: detailApproved ||
                            !canEdit ||
                            isDetail ||
                            !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]), inputProps: { maxLength: 255 }, 
                        // @ts-ignore
                        error: !!(errors === null || errors === void 0 ? void 0 : errors.theme), 
                        // @ts-ignore
                        helperText: errors === null || errors === void 0 ? void 0 : errors.theme, onChange: handleChange, value: values.theme }),
                    (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                            React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                        React.createElement(Box, null, (((isTeacher || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAreaChief)) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                            ((isProgramDirector || isProgramResponsible) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                            ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTema) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTema', 'dataaprovacaotema'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                    React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]) &&
                            !isModel &&
                            !isDraft && (React.createElement(React.Fragment, null,
                            React.createElement(AccessTime, { fontSize: 'small' }),
                            React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                        (((isTeacher || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAreaChief)) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                            ((isProgramDirector || isProgramResponsible) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                            ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                            !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTema) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTema', 'dataaprovacaotema'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 2, disabled: detailApproved ||
                            !canEdit ||
                            isDetail ||
                            !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodescricao_value`]), inputProps: { maxLength: 2000 }, label: 'Descri\u00E7\u00E3o/Objetivo da sess\u00E3o', type: 'text', name: 'description', onChange: handleChange, value: values.description }),
                    (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodescricao_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                            React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                        React.createElement(Box, null, (((isTeacher || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAreaChief)) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                            ((isProgramDirector || isProgramResponsible) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                            ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDescricao) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoDescricao', 'dataaprovacaodescricao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                    React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodescricao_value`]) &&
                            !isModel &&
                            !isDraft && (React.createElement(React.Fragment, null,
                            React.createElement(AccessTime, { fontSize: 'small' }),
                            React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                        (((isTeacher || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAreaChief)) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                            ((isProgramDirector || isProgramResponsible) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                            ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                            !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaodescricao_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDescricao) ? (React.createElement(CircularProgress, { size: 15 })) : !isModel && !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoDescricao', 'dataaprovacaodescricao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
                React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: courseOptions, onChange: (event, newValue) => {
                                setFieldValue('course', newValue);
                            }, disabled: detailApproved || !canEdit || isDetail, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.spaces, helperText: errors.spaces, label: 'Curso' }))), value: values.course }),
                        React.createElement(Tooltip, { title: 'Adicionar Curso' },
                            React.createElement(IconButton, { disabled: detailApproved || !canEdit || isDetail, onClick: () => handleNewTag(EFatherTag.COURSE) },
                                React.createElement(PlusOne, null)))))))));
};
export default Classroom;
//# sourceMappingURL=index.js.map