import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Radio, RadioGroup, TextField, Tooltip, } from '@material-ui/core';
import { v4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Autocomplete } from '@material-ui/lab';
import { IconHelpTooltip } from '~/components';
import { useActivity, useScheduleDay } from '~/hooks';
import { EActivityTypeApplication, EFatherTag, TYPE_ACTIVITY, } from '~/config/enums';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { Add, Delete, DragIndicator, ExpandMore, FileCopy, } from '@material-ui/icons';
import { KeyboardTimePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import momentToMinutes from '~/utils/momentToMinutes';
import { BoxActivityName } from './styles';
import * as _ from 'lodash';
import InfoForm from './InfoForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import { useSelector } from 'react-redux';
const getListStyle = () => ({
    background: '#fff',
    padding: 8,
});
const ActivitiesForm = ({ values, isDetail, errors, setFieldValue, tagsOptions, spaceOptions, }) => {
    const [filter, setFilter] = React.useState({
        typeActivity: TYPE_ACTIVITY.ACADEMICA,
        typeApplication: EActivityTypeApplication.PLANEJAMENTO,
        top: TOP_QUANTITY,
        active: 'Ativo',
        search: '',
    });
    const [activity, setActivity] = React.useState({});
    const [expand, setExpand] = React.useState({});
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const [{ loading, activities, getActivityByScheduleId }] = useActivity(filter);
    const [{ loading: loadingSchedule, schedule }] = useScheduleDay({
        active: 'Ativo',
        searchQuery: filter.search,
        published: 'Sim',
        group: 'Sim',
        model: true,
    });
    const handleActivityType = (event) => {
        setFilter(Object.assign(Object.assign({}, filter), { typeActivity: event.target.value }));
    };
    const handleAddActivity = () => {
        var _a, _b;
        if (!Object.keys(activity).length)
            return;
        if (filter.typeActivity === 'agrupamento') {
            getActivityByScheduleId(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}cronogramadediaid`]).then((activities) => {
                var _a;
                let newActivities = [...values.activities];
                const activitiesToSave = (_a = activities === null || activities === void 0 ? void 0 : activities.value) === null || _a === void 0 ? void 0 : _a.map((actv) => {
                    var _a, _b;
                    delete actv[`${PREFIX}atividadeid`];
                    actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
                        delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
                    });
                    actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
                        delete elm[`${PREFIX}nomeatividadeid`];
                    });
                    actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
                        delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
                    });
                    actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
                        delete elm[`${PREFIX}requisicaoacademicaid`];
                    });
                    actv.people = ((_a = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.length)
                        ? (_b = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.map((e) => {
                            var _a;
                            const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                            func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                            const pe = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]];
                            return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: pe, function: func });
                        })
                        : [
                            {
                                keyId: v4(),
                                person: null,
                                function: null,
                            },
                        ];
                    return Object.assign(Object.assign({}, actv), { startTime: (actv[`${PREFIX}inicio`] &&
                            moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
                            null, duration: (actv[`${PREFIX}duracao`] &&
                            moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
                            null, endTime: (actv[`${PREFIX}fim`] &&
                            moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
                            null, keyId: v4() });
                });
                newActivities = newActivities.concat(activitiesToSave);
                setFieldValue('activities', reorderTime(newActivities, newActivities));
                setActivity({});
            });
        }
        else {
            const newActivities = [...values.activities];
            delete activity[`${PREFIX}atividadeid`];
            const startTime = moment('08:00', 'HH:mm');
            const duration = momentToMinutes(moment(activity[`${PREFIX}duracao`], 'HH:mm'));
            const endTime = startTime.clone().add(duration, 'minutes');
            const actv = Object.assign(Object.assign({}, activity), { startTime,
                endTime, duration: (activity[`${PREFIX}duracao`] &&
                    moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
                    null, startDate: startTime.format(), endDate: endTime.format(), [`${PREFIX}inicio`]: startTime.format('HH:mm'), [`${PREFIX}fim`]: endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: startTime.format(), [`${PREFIX}datahorafim`]: endTime.format(), keyId: v4() });
            actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
                delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
            });
            actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
                delete elm[`${PREFIX}nomeatividadeid`];
            });
            actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
                delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
            });
            actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
                delete elm[`${PREFIX}requisicaoacademicaid`];
            });
            actv.people = ((_a = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.length)
                ? (_b = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.map((e) => {
                    var _a;
                    const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                    func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                    const pe = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]];
                    return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: pe, function: func });
                })
                : [
                    {
                        keyId: v4(),
                        person: null,
                        function: null,
                    },
                ];
            newActivities.push(actv);
            let newItems = newActivities;
            if (newActivities.length > 1) {
                newItems = reorderTime(newItems, newItems);
            }
            setActivity({});
            setFieldValue('activities', newItems);
        }
    };
    const handleRemoveActivity = (index) => {
        let newActivities = [...values.activities];
        let newActivitiesToDelete = [...values.activitiesToDelete];
        const actvToDelete = newActivities[index];
        actvToDelete.deleted = true;
        if (actvToDelete === null || actvToDelete === void 0 ? void 0 : actvToDelete[`${PREFIX}atividadeid`]) {
            newActivitiesToDelete.push(actvToDelete);
            setFieldValue('activitiesToDelete', newActivitiesToDelete);
        }
        newActivities.splice(index, 1);
        setFieldValue('activities', newActivities);
    };
    const handleCopyActivity = (index) => {
        let newActivities = [...values.activities];
        let actvToCopy = _.cloneDeep(newActivities[index]);
        delete actvToCopy[`${PREFIX}atividadeid`];
        delete actvToCopy.id;
        actvToCopy === null || actvToCopy === void 0 ? void 0 : actvToCopy[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
            delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
        });
        actvToCopy === null || actvToCopy === void 0 ? void 0 : actvToCopy[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
            delete elm[`${PREFIX}nomeatividadeid`];
        });
        actvToCopy === null || actvToCopy === void 0 ? void 0 : actvToCopy[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
            delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
        });
        actvToCopy === null || actvToCopy === void 0 ? void 0 : actvToCopy[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
            delete elm[`${PREFIX}requisicaoacademicaid`];
        });
        actvToCopy.keyId = v4();
        newActivities.splice(index, 0, actvToCopy);
        setFieldValue('activities', reorderTime(newActivities, newActivities));
    };
    const handleChangeStart = (index, value) => {
        if (!value || !value.isValid()) {
            return;
        }
        let actv = Object.assign({}, values.activities[index]);
        const start = value;
        const momentDuration = moment(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}duracao`], 'HH:mm');
        const minutes = momentToMinutes(momentDuration);
        const end = value.clone().add(minutes, 'minutes');
        actv = Object.assign(Object.assign({}, actv), { startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, [`${PREFIX}inicio`]: start.format('HH:mm'), [`${PREFIX}fim`]: end.format('HH:mm'), [`${PREFIX}datahorainicio`]: start.format(), [`${PREFIX}datahorafim`]: end.format() });
        let newItems = _.cloneDeep(values.activities);
        newItems[index] = actv;
        if (index != 0) {
            newItems = newItems.sort((a, b) => a.startTime.unix() - b.startTime.unix());
        }
        newItems = reorderTime(newItems, newItems);
        setFieldValue(`activities`, newItems);
    };
    const handleChangeDuration = (index, value) => {
        if (!value || !value.isValid()) {
            return;
        }
        let actv = Object.assign({}, values.activities[index]);
        const duration = (value === null || value === void 0 ? void 0 : value.hour()) * 60 + (value === null || value === void 0 ? void 0 : value.minute());
        const start = actv.startTime;
        const end = start.clone().add(duration, 'minutes');
        actv = Object.assign(Object.assign({}, actv), { startDate: start.format(), endDate: end.format(), startTime: start, endTime: end, duration: value, [`${PREFIX}duracao`]: value.format('HH:mm'), [`${PREFIX}inicio`]: start.format('HH:mm'), [`${PREFIX}fim`]: end.format('HH:mm'), [`${PREFIX}datahorainicio`]: start.format(), [`${PREFIX}datahorafim`]: end.format() });
        let newItems = _.cloneDeep(values.activities);
        newItems[index] = actv;
        newItems = reorderTime(newItems, newItems);
        setFieldValue(`activities`, newItems);
    };
    const reorderTime = (list, newList) => {
        var _a;
        let lastTime = (_a = list[0]) === null || _a === void 0 ? void 0 : _a.startTime;
        return newList === null || newList === void 0 ? void 0 : newList.map((actv) => {
            const duration = momentToMinutes(actv.duration);
            const endTime = lastTime.clone().add(duration, 'm');
            const result = Object.assign(Object.assign({}, actv), { endTime, startTime: lastTime, startDate: lastTime.format(), endDate: endTime.format(), [`${PREFIX}inicio`]: lastTime.format('HH:mm'), [`${PREFIX}fim`]: endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: lastTime.format(), [`${PREFIX}datahorafim`]: endTime.format() });
            lastTime = endTime;
            return result;
        });
    };
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const getItemStyle = (isDragging, draggableStyle) => (Object.assign({ 
        // some basic styles to make the items look a bit nicer
        userSelect: 'none', borderRadius: '10px', marginBottom: '10px', width: '100%', background: isDragging ? '#d5effd' : '#fff' }, draggableStyle));
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(values.activities, result.source.index, result.destination.index);
        const newItems = reorderTime(values.activities, items);
        setFieldValue('activities', newItems);
    };
    const toggleAcordion = (index) => {
        setExpand(Object.assign(Object.assign({}, expand), { [index]: !expand[index] }));
    };
    const setValuePerson = (index, actv) => { };
    const activitiesOptions = React.useMemo(() => activities === null || activities === void 0 ? void 0 : activities.sort((a, b) => {
        if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
            return -1;
        }
        if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
            return 1;
        }
        return 0;
    }), [activities]);
    const scheduleOptions = React.useMemo(() => schedule === null || schedule === void 0 ? void 0 : schedule.sort((a, b) => {
        if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) < (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
            return -1;
        }
        if ((a === null || a === void 0 ? void 0 : a[`${PREFIX}nome`]) > (b === null || b === void 0 ? void 0 : b[`${PREFIX}nome`])) {
            return 1;
        }
        return 0;
    }), [schedule]);
    return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
        React.createElement(Grid, { item: true, lg: 12, md: 12, xs: 12 },
            React.createElement(FormControl, { disabled: isDetail, component: 'fieldset', onChange: handleActivityType },
                React.createElement(FormLabel, { component: 'legend' }, "Tipo de Atividade"),
                React.createElement(RadioGroup, { "aria-label": 'position', name: 'position', style: { flexDirection: 'row' }, value: filter.typeActivity, defaultValue: filter.typeActivity },
                    React.createElement(FormControlLabel, { value: TYPE_ACTIVITY.ACADEMICA, control: React.createElement(Radio, { color: 'primary' }), label: 'Atividade Acad\u00EAmica' }),
                    React.createElement(FormControlLabel, { value: TYPE_ACTIVITY.NON_ACADEMICA, control: React.createElement(Radio, { color: 'primary' }), label: 'Atividade N\u00E3o Acad\u00EAmica' }),
                    React.createElement(FormControlLabel, { value: TYPE_ACTIVITY.INTERNAL, control: React.createElement(Radio, { color: 'primary' }), label: 'Atividade Interna' }),
                    React.createElement(FormControlLabel, { value: 'agrupamento', control: React.createElement(Radio, { color: 'primary' }), label: 'Agrupamento de atividades' })))),
        React.createElement(Grid, { item: true, lg: 12, md: 12, xs: 12 },
            React.createElement(Box, { display: 'flex', alignItems: 'end', style: { gap: '1rem' } },
                React.createElement(Autocomplete, { fullWidth: true, disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', options: filter.typeActivity === 'agrupamento'
                        ? scheduleOptions || []
                        : activitiesOptions || [], value: activity, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setActivity(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, error: !!errors.activity, 
                        // @ts-ignore
                        helperText: errors.activity, label: React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '5px' } },
                            "Atividade",
                            React.createElement(IconHelpTooltip, { title: 'Digite pelo menos 3 caracteres para realizar a busca.' })), onChange: (event) => setFilter(Object.assign(Object.assign({}, filter), { search: event.target.value })), InputProps: Object.assign(Object.assign({}, params.InputProps), { endAdornment: (React.createElement(React.Fragment, null,
                                loading ? (React.createElement(CircularProgress, { color: 'inherit', size: 20 })) : null,
                                params.InputProps.endAdornment)) }) }))) }),
                React.createElement(Button, { variant: 'contained', color: 'primary', disabled: isDetail || !activity, startIcon: React.createElement(Add, null), onClick: () => handleAddActivity() }, "Adicionar")),
            React.createElement(DragDropContext, { onDragEnd: onDragEnd },
                React.createElement(Droppable, { isDropDisabled: !!isDetail, droppableId: 'droppable' }, (provided, snapshot) => {
                    var _a;
                    return (React.createElement(List, Object.assign({}, provided.droppableProps, { ref: provided.innerRef, style: getListStyle() }), (_a = values.activities) === null || _a === void 0 ? void 0 :
                        _a.map((act, index) => (React.createElement(Draggable, { key: act.keyId, draggableId: act.keyId, isEnabled: isDetail, disableInteractiveElementBlocking: isDetail, index: index }, (provided, snapshot) => (React.createElement(Box, Object.assign({ ref: provided.innerRef, onClickCapture: (e) => {
                                var _a;
                                if (e.defaultPrevented ||
                                    e.target.nodeName === 'LI' ||
                                    ((_a = e.target) === null || _a === void 0 ? void 0 : _a.id) === 'checkSpace') {
                                    return;
                                }
                                if (e.currentTarget !== e.target &&
                                    e.target.tabIndex >= 0) {
                                    e.target.focus();
                                }
                                else {
                                    e.currentTarget.focus();
                                }
                            } }, provided.draggableProps, provided.dragHandleProps, { style: getItemStyle(snapshot.isDragging, provided.draggableProps.style) }),
                            React.createElement(Accordion, { onChange: () => null, expanded: !!expand[index] },
                                React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null), IconButtonProps: {
                                        onClick: () => toggleAcordion(index),
                                    }, "aria-label": 'Expand', "aria-controls": 'additional-actions1-content', id: 'additional-actions1-header' },
                                    React.createElement(ListItem, { ContainerProps: { style: { width: '100%' } }, style: { paddingLeft: 0 } },
                                        React.createElement(DragIndicator, { style: { marginRight: '10px' } }),
                                        React.createElement(ListItemText, { primary: React.createElement(BoxActivityName, null, (act === null || act === void 0 ? void 0 : act.name) || (act === null || act === void 0 ? void 0 : act[`${PREFIX}nome`])), secondary: `${act === null || act === void 0 ? void 0 : act[`${PREFIX}inicio`]} - ${act === null || act === void 0 ? void 0 : act[`${PREFIX}fim`]}` }),
                                        React.createElement(ListItemSecondaryAction, null,
                                            React.createElement(Box, { display: 'flex', maxWidth: '20rem' },
                                                React.createElement(KeyboardTimePicker, { ampm: false, cancelLabel: 'Cancelar', disabled: isDetail || !activity, invalidDateMessage: 'Formato inv\u00E1lido', label: 'In\u00EDcio', style: { marginRight: '10px' }, value: act === null || act === void 0 ? void 0 : act.startTime, error: !!errors.startTime, helperText: errors.startTime, onChange: (value) => handleChangeStart(index, value) }),
                                                React.createElement(KeyboardTimePicker, { ampm: false, cancelLabel: 'Cancelar', disabled: isDetail || !activity, invalidDateMessage: 'Formato inv\u00E1lido', label: 'Dura\u00E7\u00E3o', value: act === null || act === void 0 ? void 0 : act.duration, error: !!errors.duration, helperText: errors.duration, onChange: (value) => handleChangeDuration(index, value) }),
                                                React.createElement(Divider, { orientation: 'vertical' }),
                                                React.createElement(Tooltip, { title: 'Remover' },
                                                    React.createElement(IconButton, { edge: 'end', disabled: isDetail, onClick: () => handleRemoveActivity(index) },
                                                        React.createElement(Delete, null))),
                                                React.createElement(Tooltip, { title: 'Duplicar' },
                                                    React.createElement(IconButton, { edge: 'end', disabled: isDetail, onClick: () => handleCopyActivity(index) },
                                                        React.createElement(FileCopy, null)))))),
                                    React.createElement(Divider, null)),
                                React.createElement(AccordionDetails, { style: { flexDirection: 'column' } },
                                    React.createElement(InfoForm, { index: index, disabled: isDetail || !activity, tagsOptions: tagsOptions, spaceOptions: spaceOptions, values: act, errors: errors, setFieldValue: setFieldValue }),
                                    React.createElement(Box, { width: '100%' },
                                        React.createElement(EnvolvedPeopleForm, { isDetail: isDetail, values: values, errors: errors, index: index, setFieldValue: setFieldValue }))))))))),
                        provided.placeholder));
                })))));
};
export default ActivitiesForm;
//# sourceMappingURL=index.js.map