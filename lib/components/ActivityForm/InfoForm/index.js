var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Box, Checkbox, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EActivityTypeApplication, EFatherTag, TYPE_ACTIVITY, } from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { KeyboardTimePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import { useConfirmation, useNotification } from '~/hooks';
import { AccessTime, CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, CheckCircle, Close, FilterList, PlusOne, SyncAlt, } from '@material-ui/icons';
import checkConflictDate from '~/utils/checkConflictDate';
import AddTag from '~/components/AddTag';
import AddSpace from '~/components/AddSpace';
import { getResources } from '~/store/modules/resource/actions';
import { updateActivity } from '~/store/modules/activity/actions';
import LoadActivity from './LoadActivity';
import FilterSpace from './FilterSpace';
import * as _ from 'lodash';
const InfoForm = ({ canEdit, isModel, isDetail, isModelReference, isDraft, isProgramResponsible, isProgramDirector, isAcademicDirector, tagsOptions, activityType, spaceOptions, values, errors, detailApproved, currentUser, handleChange, setFieldValue, setActivity, activity, loadingApproval, handleAproval, handleEditApproval, }) => {
    var _a, _b;
    const [newTagModal, setNewTagModal] = React.useState({
        open: false,
        fatherTag: null,
    });
    const [newSpace, setNewSpace] = React.useState({
        open: false,
    });
    const [areaLoading, setAreaLoading] = React.useState(false);
    const [spaceLoading, setSpaceLoading] = React.useState(false);
    const [openLoadActivity, setOpenLoadActivity] = React.useState(false);
    const [openFilterSpace, setOpenFilterSpace] = React.useState(false);
    const [dialogConflict, setDialogConflict] = React.useState({
        open: false,
        msg: null,
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const areaOptions = (_a = tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    })) === null || _a === void 0 ? void 0 : _a.sort((a, b) => (a === null || a === void 0 ? void 0 : a[`${PREFIX}ordem`]) - (b === null || b === void 0 ? void 0 : b[`${PREFIX}ordem`]));
    const temperatureOptions = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
    }), [tagsOptions]);
    const fatherTags = React.useMemo(() => tagsOptions === null || tagsOptions === void 0 ? void 0 : tagsOptions.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ehpai`]), [tagsOptions]);
    const checkSpaceConflicts = (resources) => {
        const datesAppointment = [
            moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]),
            moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]),
        ];
        return resources.filter((res) => {
            var _a;
            const datesResource = [
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]),
                moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]),
            ];
            return (checkConflictDate(datesAppointment, datesResource) &&
                ((_a = res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`]) === null || _a === void 0 ? void 0 : _a[`_${PREFIX}espaco_aprovador_por_value`]));
        });
    };
    const approveSpace = () => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        setSpaceLoading(true);
        const filterQuery = {
            dayDate: moment(activity[`${PREFIX}datahorainicio`]),
            spaces: (_c = activity[`${PREFIX}Atividade_Espaco`]) === null || _c === void 0 ? void 0 : _c.map((e) => ({
                value: e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`],
            })),
        };
        const resConflictRequest = yield getResources(filterQuery);
        const conflicts = checkSpaceConflicts(resConflictRequest === null || resConflictRequest === void 0 ? void 0 : resConflictRequest.value);
        if (conflicts === null || conflicts === void 0 ? void 0 : conflicts.length) {
            setSpaceLoading(false);
            setDialogConflict({
                open: true,
                msg: (React.createElement("div", null,
                    React.createElement(Typography, null, "Os seguintes espa\u00E7os possui conflitos:"),
                    React.createElement("ul", null, conflicts === null || conflicts === void 0 ? void 0 : conflicts.map((conflict) => {
                        var _a, _b, _c, _d;
                        return (React.createElement("li", { key: (_a = conflict === null || conflict === void 0 ? void 0 : conflict[`${PREFIX}Espaco`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`] },
                            React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                                React.createElement("strong", null, (_b = conflict === null || conflict === void 0 ? void 0 : conflict[`${PREFIX}Espaco`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]),
                                React.createElement("span", null, (_c = conflict === null || conflict === void 0 ? void 0 : conflict[`${PREFIX}Programa`]) === null || _c === void 0 ? void 0 :
                                    _c[`${PREFIX}titulo`],
                                    ' - ', (_d = conflict === null || conflict === void 0 ? void 0 : conflict[`${PREFIX}Turma`]) === null || _d === void 0 ? void 0 :
                                    _d[`${PREFIX}nome`]))));
                    })))),
            });
            return;
        }
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}Espaco_Aprovador_Por@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}espacodatahoraaprovacao`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setSpaceLoading(false);
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setSpaceLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    });
    const editSpace = () => {
        setSpaceLoading(true);
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}Espaco_Aprovador_Por@odata.bind`]: null,
            [`${PREFIX}espacodatahoraaprovacao`]: null,
        }, {
            onSuccess: (act) => {
                setSpaceLoading(false);
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setSpaceLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const handleEditSpace = () => {
        confirmation.openConfirmation({
            onConfirm: editSpace,
            title: 'Confirmação',
            description: 'Ao confirmar todos os espaços precisaram de uma nova aprovação, tem certeza de realizar essa ação',
        });
    };
    const approveArea = () => {
        setAreaLoading(true);
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}AreaAcademicaAprovadaPor@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}areaacademicadatahoraaprovacao`]: moment().format(),
        }, {
            onSuccess: (act) => {
                setAreaLoading(false);
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setAreaLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const editArea = () => {
        setAreaLoading(true);
        updateActivity(activity[`${PREFIX}atividadeid`], {
            [`${PREFIX}AreaAcademicaAprovadaPor@odata.bind`]: null,
            [`${PREFIX}areaacademicadatahoraaprovacao`]: null,
        }, {
            onSuccess: (act) => {
                setAreaLoading(false);
                setActivity(act);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setAreaLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        });
    };
    const handleEditArea = () => {
        confirmation.openConfirmation({
            onConfirm: editArea,
            title: 'Confirmação',
            description: 'Ao confirmar a área irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
        });
    };
    const handleNewTag = React.useCallback((type) => {
        const tag = tagsOptions.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === type);
        setNewTagModal({ open: true, fatherTag: tag });
    }, [tagsOptions]);
    const handleCloseNewTag = React.useCallback(() => setNewTagModal({ open: false, fatherTag: null }), []);
    const handleChangeActivity = (newActivity) => {
        var _a;
        setFieldValue('name', newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}nome`]);
        if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) !== (newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]) &&
            (newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) {
            setFieldValue('theme', '');
            setFieldValue('type', newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]);
        }
        if ((activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) !== (newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]) &&
            ((newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.NON_ACADEMICA ||
                (newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) {
            setFieldValue('theme', '');
            setFieldValue('description', '');
            setFieldValue('type', newActivity === null || newActivity === void 0 ? void 0 : newActivity[`${PREFIX}tipo`]);
            setFieldValue('documents', (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.map((document) => (Object.assign(Object.assign({}, document), { deleted: true }))));
        }
    };
    const handleAddSpaceByFilter = (newSpaces) => {
        let spc = _.cloneDeep(values.spaces);
        spc = spc.concat(newSpaces);
        spc = _.uniqBy(spc, 'value');
        setFieldValue('spaces', spc);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(LoadActivity, { currentActivity: activity, open: openLoadActivity, onLoadActivity: handleChangeActivity, onClose: () => setOpenLoadActivity(false) }),
        React.createElement(FilterSpace, { open: openFilterSpace, currentSpaces: values.spaces, onFilterSpace: handleAddSpaceByFilter, onClose: () => setOpenFilterSpace(false) }),
        React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
            isModelReference ? (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(TextField, { fullWidth: true, label: 'T\u00EDtulo', type: 'text', name: 'title', disabled: isDetail, inputProps: { maxLength: 255 }, error: !!errors.title, helperText: errors.title, onChange: handleChange, value: values.title }))) : null,
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(TextField, { fullWidth: true, disabled: true, label: 'Nome da Atividade', type: 'text', name: 'name', inputProps: { maxLength: 255 }, error: !!errors.name, helperText: errors.name, onChange: handleChange, value: values.name }),
                    React.createElement(Tooltip, { title: 'Alterar Atividade' },
                        React.createElement(IconButton, { disabled: detailApproved || isDetail || !canEdit, onClick: () => setOpenLoadActivity(true) },
                            React.createElement(SyncAlt, null))))),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, variant: 'dialog', cancelLabel: 'Cancelar', disabled: detailApproved ||
                        isDetail ||
                        !canEdit ||
                        !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoinicio_value`]), invalidDateMessage: 'Formato inv\u00E1lido', label: 'In\u00EDcio da Atividade', value: values.startTime, error: !!errors.startTime, helperText: errors.startTime, onChange: (value) => {
                        var _a;
                        setFieldValue('startTime', value);
                        if (values.duration) {
                            const duration = (values === null || values === void 0 ? void 0 : values.duration.hour()) * 60 + (values === null || values === void 0 ? void 0 : values.duration.minute());
                            setFieldValue('endTime', (_a = value === null || value === void 0 ? void 0 : value.clone()) === null || _a === void 0 ? void 0 : _a.add(duration, 'minutes'));
                        }
                    } }),
                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoinicio_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoInicio) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoInicio', 'dataaprovacaoinicio'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoinicio_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoinicio_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoInicio) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoInicio', 'dataaprovacaoinicio'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(KeyboardTimePicker, { ampm: false, fullWidth: true, cancelLabel: 'Cancelar', disabled: detailApproved ||
                        isDetail ||
                        !canEdit ||
                        !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoduracao_value`]), invalidDateMessage: 'Formato inv\u00E1lido', label: 'Dura\u00E7\u00E3o da Atividade', value: values.duration, error: !!errors.duration, helperText: errors.duration, onChange: (value) => {
                        setFieldValue('duration', value);
                        if (values.startTime) {
                            const duration = (value === null || value === void 0 ? void 0 : value.hour()) * 60 + (value === null || value === void 0 ? void 0 : value.minute());
                            setFieldValue('endTime', values.startTime.clone().add(duration, 'minutes'));
                        }
                    } }),
                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoduracao_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDuracao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoDuracao', 'dataaprovacaoduracao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoduracao_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaoduracao_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoDuracao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoDuracao', 'dataaprovacaoduracao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(KeyboardTimePicker, { disabled: true, ampm: false, fullWidth: true, cancelLabel: 'Cancelar', label: 'Fim da Atividade', invalidDateMessage: 'Formato inv\u00E1lido', value: values.endTime, onChange: handleChange })),
            (activityType === TYPE_ACTIVITY.ACADEMICA ||
                activityType === TYPE_ACTIVITY.NON_ACADEMICA) && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(TextField, { fullWidth: true, label: 'Quantidade de Sess\u00F5es', type: 'number', name: 'quantity', disabled: detailApproved ||
                        isDetail ||
                        !canEdit ||
                        !!(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaosessao_value`]), inputProps: { maxLength: 255 }, error: !!errors.quantity, helperText: errors.quantity, onChange: handleChange, value: values.quantity }),
                (activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaosessao_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSessao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoSessao', 'dataaprovacaosessao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaosessao_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaosessao_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoSessao) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoSessao', 'dataaprovacaosessao'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null))),
            activityType === TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, options: areaOptions === null || areaOptions === void 0 ? void 0 : areaOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                            setFieldValue('area', newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), disabled: isDetail ||
                            !!(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademicaAprovadaPor`]) ||
                            !canEdit, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.area, helperText: errors.area, label: '\u00C1rea Acad\u00EAmica' }))), value: values.area }),
                    React.createElement(Tooltip, { title: 'Adicionar Etiqueta' },
                        React.createElement(IconButton, { disabled: isDetail ||
                                !!(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademicaAprovadaPor`]) ||
                                !canEdit ||
                                !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => handleNewTag(EFatherTag.AREA_ACADEMICA) },
                            React.createElement(PlusOne, null)))),
                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademicaAprovadaPor`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, areaLoading ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: handleEditArea, style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademicaAprovadaPor`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                        !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademicaAprovadaPor`]) &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}AreaAcademica`]) &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipoaplicacao`]) ===
                            EActivityTypeApplication.APLICACAO ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, areaLoading ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: approveArea, style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null))),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Box, { display: 'flex', alignItems: 'center' },
                    React.createElement(Autocomplete, { multiple: true, fullWidth: true, disableCloseOnSelect: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: spaceOptions === null || spaceOptions === void 0 ? void 0 : spaceOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]), onChange: (event, newValue) => {
                            setFieldValue('spaces', newValue);
                        }, disabled: isDetail ||
                            !!(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Espaco_Aprovador_Por`]) ||
                            !canEdit, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderOption: (option, { selected }) => (React.createElement(React.Fragment, null,
                            React.createElement(Checkbox, { icon: React.createElement(CheckBoxOutlineBlankIcon, { fontSize: 'small' }), checkedIcon: React.createElement(CheckBoxIcon, { color: 'secondary', fontSize: 'small' }), style: { marginRight: 8 }, checked: selected }),
                            option.label)), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.spaces, helperText: errors.spaces, label: 'Espa\u00E7o' }))), value: values.spaces }),
                    React.createElement(Tooltip, { title: 'Adicionar Espa\u00E7o' },
                        React.createElement(IconButton, { disabled: detailApproved ||
                                isDetail ||
                                !canEdit ||
                                !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning), onClick: () => setNewSpace({ open: true }) },
                            React.createElement(PlusOne, null))),
                    React.createElement(Tooltip, { title: 'Filtrar Espa\u00E7o' },
                        React.createElement(IconButton, { disabled: detailApproved || isDetail || !canEdit, onClick: () => setOpenFilterSpace(true) },
                            React.createElement(FilterList, null)))),
                (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Espaco_Aprovador_Por`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                    React.createElement(Box, null, (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) && (React.createElement(React.Fragment, null, spaceLoading ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: handleEditSpace, style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Espaco_Aprovador_Por`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    !(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Espaco_Aprovador_Por`]) &&
                        ((_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Espaco`]) === null || _b === void 0 ? void 0 : _b.length) &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipoaplicacao`]) ===
                            EActivityTypeApplication.APLICACAO &&
                        (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, spaceLoading ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: approveSpace, style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)),
            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                React.createElement(Autocomplete, { fullWidth: true, filterSelectedOptions: true, options: (temperatureOptions === null || temperatureOptions === void 0 ? void 0 : temperatureOptions.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`])) || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: values.temperature, disabled: !canEdit || isDetail, onChange: (event, newValue) => {
                        setFieldValue('temperature', newValue);
                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Temperatura/Status' }))) })),
            activityType !== TYPE_ACTIVITY.ACADEMICA && (React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                React.createElement(TextField, { fullWidth: true, minRows: 2, label: 'Tema', type: 'text', name: 'theme', disabled: !canEdit ||
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
                    React.createElement(Box, null, ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.INTERNAL)) && (React.createElement(React.Fragment, null, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTema) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditApproval('AprovacaoTema', 'dataaprovacaotema'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Editar")) : null))))),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]) &&
                        !isModel &&
                        !isDraft && (React.createElement(React.Fragment, null,
                        React.createElement(AccessTime, { fontSize: 'small' }),
                        React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                    ((isAcademicDirector &&
                        (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.ACADEMICA) ||
                        ((isProgramDirector || isProgramResponsible) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) ===
                                TYPE_ACTIVITY.NON_ACADEMICA) ||
                        ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) &&
                            (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}tipo`]) === TYPE_ACTIVITY.INTERNAL)) &&
                        !(activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}aprovacaotema_value`]) ? (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, (loadingApproval === null || loadingApproval === void 0 ? void 0 : loadingApproval.AprovacaoTema) ? (React.createElement(CircularProgress, { size: 15 })) : !isDetail && !isModel && !isDraft && canEdit ? (React.createElement(Link, { variant: 'body2', onClick: () => handleAproval('AprovacaoTema', 'dataaprovacaotema'), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)) : null)))),
        React.createElement(AddTag, { open: newTagModal.open, fatherTags: fatherTags, fatherSelected: newTagModal.fatherTag, handleClose: handleCloseNewTag }),
        React.createElement(AddSpace, { open: newSpace.open, handleClose: () => setNewSpace({ open: false }) }),
        React.createElement(Dialog, { open: dialogConflict.open },
            React.createElement(DialogTitle, null,
                React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                    "Resursos com conflito",
                    React.createElement(IconButton, { "aria-label": 'close', onClick: () => setDialogConflict({
                            open: false,
                            msg: null,
                        }), style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null, dialogConflict.msg))));
};
export default InfoForm;
//# sourceMappingURL=index.js.map