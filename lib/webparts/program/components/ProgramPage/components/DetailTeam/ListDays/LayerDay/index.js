import { Box, CircularProgress, Divider, List, Tooltip, Typography, } from '@material-ui/core';
import { DragIndicator, ErrorOutline, MoreVert } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as moment from 'moment';
import * as React from 'react';
import { StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, TitleCard, } from '~/components/CustomCard';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import temperatureColor from '~/utils/temperatureColor';
import { WrapperTitle } from './styles';
import momentToMinutes from '~/utils/momentToMinutes';
import { EFatherTag, EGroups } from '~/config/enums';
import { addUpdateSchedule } from '~/store/modules/schedule/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import formatActivityModel from '~/utils/formatActivityModel';
import { useLoggedUser, useNotification } from '~/hooks';
import { Backdrop } from '~/components';
const getListStyle = () => ({
    background: '#fff',
    padding: 8,
    height: 'calc(100vh - 17rem)',
    overflow: 'auto',
});
const LayerDay = ({ schedule, teamChoosed, programChoosed, teamId, programId, refetchActivity, handleSchedule, handleDetailActivity, handleOptionActivity, }) => {
    var _a, _b;
    const DEFAULT_VALUES = {
        name: '',
        date: null,
        module: null,
        startTime: null,
        duration: null,
        endTime: null,
        modality: null,
        tool: null,
        toolBackup: null,
        temperature: null,
        place: null,
        link: '',
        linkBackup: '',
        activities: [],
        activitiesToDelete: [],
        observation: '',
        isGroupActive: false,
        anexos: [],
        people: [{ keyId: v4(), person: null, function: null }],
        locale: [{ keyId: v4(), space: null, observation: '' }],
    };
    const [loading, setLoading] = React.useState(false);
    const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
    const dispatch = useDispatch();
    const { currentUser } = useLoggedUser();
    const { notification } = useNotification();
    const { tag, person, space } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const { dictSpace } = space;
    React.useEffect(() => {
        var _a, _b, _c, _d, _e, _f;
        if (schedule) {
            const iniVal = {
                id: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}cronogramadediaid`],
                modeloid: schedule.modeloid,
                baseadoemcronogramadiamodelo: schedule.baseadoemcronogramadiamodelo,
                name: (schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}nome`]) || '',
                date: moment.utc(schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`]),
                module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}modulo_value`]],
                modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}modalidade_value`]],
                tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}ferramenta_value`]],
                isGroupActive: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}agrupamentoatividade`],
                startTime: (schedule[`${PREFIX}inicio`] &&
                    moment(schedule[`${PREFIX}inicio`], 'HH:mm')) ||
                    null,
                endTime: (schedule[`${PREFIX}fim`] &&
                    moment(schedule[`${PREFIX}fim`], 'HH:mm')) ||
                    null,
                duration: (schedule[`${PREFIX}duracao`] &&
                    moment(schedule[`${PREFIX}duracao`], 'HH:mm')) ||
                    null,
                toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}ferramentabackup_value`]],
                place: dictTag === null || dictTag === void 0 ? void 0 : dictTag[schedule === null || schedule === void 0 ? void 0 : schedule[`_${PREFIX}local_value`]],
                link: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}link`],
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) || null,
                linkBackup: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}linkbackup`],
                observation: schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}observacao`],
                anexos: [],
                activities: (_b = schedule === null || schedule === void 0 ? void 0 : schedule.activities) === null || _b === void 0 ? void 0 : _b.map((act) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    let activity = Object.assign(Object.assign({}, act), { id: act[`${PREFIX}atividadeid`], name: act[`${PREFIX}nome`] || '', quantity: act[`${PREFIX}quantidadesessao`] || 0, theme: act[`${PREFIX}temaaula`] || '', area: act[`${PREFIX}AreaAcademica`]
                            ? Object.assign(Object.assign({}, act[`${PREFIX}AreaAcademica`]), { value: (_a = act[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], label: (_b = act[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`] }) : null, course: act[`${PREFIX}Curso`]
                            ? Object.assign(Object.assign({}, act[`${PREFIX}Curso`]), { value: (_c = act[`${PREFIX}Curso`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], label: (_d = act[`${PREFIX}Curso`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`] }) : null, spaces: ((_e = act[`${PREFIX}Atividade_Espaco`]) === null || _e === void 0 ? void 0 : _e.length)
                            ? act[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                            : [], people: ((_f = act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.length)
                            ? (_g = act[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _g === void 0 ? void 0 : _g.map((e) => {
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
                            ], startTime: (act[`${PREFIX}inicio`] &&
                            moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
                            null, duration: (act[`${PREFIX}duracao`] &&
                            moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
                            null, endTime: (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
                            null, keyId: v4() });
                    return activity;
                }),
                activitiesToDelete: [],
                people: ((_c = schedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.length)
                    ? (_d = schedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _d === void 0 ? void 0 : _d.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return {
                            keyId: v4(),
                            id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                            function: func,
                        };
                    })
                    : [{ keyId: v4(), person: null, function: null }],
                locale: ((_e = schedule[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _e === void 0 ? void 0 : _e.length)
                    ? (_f = schedule[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                        keyId: v4(),
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                        space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                        observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
                    }))
                    : [{ keyId: v4(), person: null, function: null }],
            };
            setInitialValues(iniVal);
            formik.setValues(iniVal);
        }
    }, [schedule.activities]);
    const myGroup = () => {
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) {
            return EGroups.PLANEJAMENTO;
        }
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAdmission) {
            return EGroups.ADMISSOES;
        }
        return '';
    };
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            const newActivities = values.activities.concat(values.activitiesToDelete);
            setLoading(true);
            const body = Object.assign(Object.assign({}, values), { group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`], activities: newActivities === null || newActivities === void 0 ? void 0 : newActivities.map((actv) => (Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], deleted: actv === null || actv === void 0 ? void 0 : actv.deleted }, formatActivityModel(actv, values.date, {
                    isModel: false,
                    dictPeople: dictPeople,
                    dictSpace: dictSpace,
                    dictTag: dictTag,
                })))) });
            dispatch(addUpdateSchedule(Object.assign(Object.assign({}, body), { group: myGroup(), user: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`] }), teamId, programId, {
                onSuccess: () => {
                    refetchActivity === null || refetchActivity === void 0 ? void 0 : refetchActivity();
                    setLoading(false);
                    notification.success({
                        title: 'Sucesso',
                        description: 'Atualização realizada com sucesso',
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
            }));
        },
    });
    const getItemStyle = (isDragging, draggableStyle) => (Object.assign({ 
        // some basic styles to make the items look a bit nicer
        userSelect: 'none', borderRadius: '10px', marginBottom: '10px', width: '100%', background: isDragging ? '#d5effd' : '#fff' }, draggableStyle));
    const reorderTime = (list, newList) => {
        var _a;
        let lastTime = (_a = list[0]) === null || _a === void 0 ? void 0 : _a.startTime;
        return newList === null || newList === void 0 ? void 0 : newList.map((actv) => {
            const duration = momentToMinutes(actv.duration);
            const endTime = lastTime.clone().add(duration, 'm');
            const result = Object.assign(Object.assign({}, actv), { endTime, startTime: lastTime, startDate: lastTime.format('YYYY-MM-DD HH:mm:ss'), endDate: endTime.format('YYYY-MM-DD HH:mm:ss'), [`${PREFIX}inicio`]: lastTime.format('HH:mm'), [`${PREFIX}fim`]: endTime.format('HH:mm'), [`${PREFIX}datahorainicio`]: lastTime.format('YYYY-MM-DDTHH:mm:ss'), [`${PREFIX}datahorafim`]: endTime.format('YYYY-MM-DDTHH:mm:ss') });
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
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(formik.values.activities, result.source.index, result.destination.index);
        const newItems = reorderTime(formik.values.activities, items);
        formik.setFieldValue('activities', newItems);
        formik.handleSubmit();
    };
    const temperature = temperatureColor(schedule, ((_a = teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
        ((_b = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]));
    return (React.createElement(Box, { minWidth: '15rem', className: 'LayerDay', maxWidth: '20rem' },
        React.createElement(Backdrop, { open: loading },
            React.createElement(CircularProgress, { color: 'inherit' })),
        React.createElement(WrapperTitle, { background: temperature.background, color: temperature.color },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                schedule.hasConflict ? (React.createElement(Tooltip, { title: 'Dia de aula possui conflitos' },
                    React.createElement(ErrorOutline, null))) : null,
                React.createElement("h5", null, moment.utc(schedule === null || schedule === void 0 ? void 0 : schedule[`${PREFIX}data`]).format('DD/MM/YYYY'))),
            React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleSchedule(event, schedule) },
                    React.createElement(MoreVert, null)))),
        React.createElement(Divider, { style: { marginBottom: '1rem' } }),
        React.createElement(Box, { width: '100%', display: 'flex', flexDirection: 'column', style: { gap: '10px' } },
            React.createElement(DragDropContext, { onDragEnd: onDragEnd },
                React.createElement(Droppable, { droppableId: 'droppable' }, (provided, snapshot) => {
                    var _a, _b;
                    return (React.createElement(List, Object.assign({}, provided.droppableProps, { ref: provided.innerRef, style: getListStyle() }), (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.activities) === null || _b === void 0 ? void 0 :
                        _b.map((actv, index) => {
                            var _a, _b;
                            const actTemp = temperatureColor(actv, ((_a = teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                                ((_b = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]));
                            return (React.createElement(Draggable, { key: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], draggableId: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], index: index }, (provided, snapshot) => {
                                var _a;
                                return (React.createElement(Box, Object.assign({ ref: provided.innerRef, onClickCapture: (e) => {
                                        if (e.defaultPrevented ||
                                            e.target.nodeName === 'LI') {
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
                                    React.createElement(StyledCard, { key: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`], background: actTemp.background, color: actTemp.color, elevation: 3 },
                                        React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                                                React.createElement(StyledIconButton, { onClick: (event) => handleOptionActivity(event, actv), "aria-label": 'settings' },
                                                    React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}nome`] },
                                                React.createElement(TitleCard, { onClick: () => handleDetailActivity(actv) }, actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}nome`])) }),
                                        React.createElement(StyledContentCard, { onClick: () => handleDetailActivity(actv) },
                                            React.createElement(Divider, null),
                                            React.createElement(Box, { display: 'flex' },
                                                React.createElement(DragIndicator, { style: { marginRight: '10px' } }),
                                                React.createElement(Box, { display: 'flex', flexDirection: 'column' },
                                                    React.createElement(Typography, { variant: 'body1' }, actv === null || actv === void 0 ? void 0 :
                                                        actv[`${PREFIX}inicio`],
                                                        " -",
                                                        ' ', actv === null || actv === void 0 ? void 0 :
                                                        actv[`${PREFIX}fim`]),
                                                    React.createElement(Typography, { variant: 'body2' }, (_a = dictTag === null || dictTag === void 0 ? void 0 : dictTag[actv === null || actv === void 0 ? void 0 : actv[`_${PREFIX}areaacademica_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`])))))));
                            }));
                        }),
                        provided.placeholder));
                })))));
};
export default LayerDay;
//# sourceMappingURL=index.js.map