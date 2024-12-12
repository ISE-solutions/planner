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
import * as moment from 'moment';
import * as _ from 'lodash';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Menu, MenuItem, TextField, Tooltip, Typography, } from '@material-ui/core';
import { v4 } from 'uuid';
import { Add, MoreVert } from '@material-ui/icons';
import { AddButton, StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from '~/components/CustomCard';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { PREFIX } from '~/config/database';
import formatActivityModel from '~/utils/formatActivityModel';
import { useActivity, useNotification } from '~/hooks';
import { useSelector } from 'react-redux';
const ListDays = ({ schedules, canEdit, context, teamId, teamChoosed, programChoosed, scheduleChoosed, setScheduleChoosed, programId, addUpdateSchedule, refetchSchedule, refetchTeam, }) => {
    const [visible, setVisible] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [activitiesModelChoosed, setActivitiesModelChoosed] = React.useState([]);
    const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
    const [modelName, setModelName] = React.useState({
        open: false,
        name: '',
        error: '',
    });
    const { notification } = useNotification();
    const { tag, space, person } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { spaces, dictSpace } = space;
    const { persons, dictPeople } = person;
    const [{ getActivity }] = useActivity({}, {
        manual: true,
    });
    const handleOption = (event, item) => {
        setScheduleChoosed(item);
        setActivitiesModelChoosed(item === null || item === void 0 ? void 0 : item[`${PREFIX}CronogramadeDia_Atividade`].map((actv) => ({
            id: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`],
            name: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}nome`],
            checked: true,
        })));
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleDetail = () => {
        setVisible(true);
        handleCloseAnchor();
    };
    const handleClose = () => {
        //refetch();
        refetchSchedule();
        refetchTeam();
        setVisible(false);
        setScheduleChoosed(null);
    };
    const saveAsModel = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!modelName.name) {
            setModelName(Object.assign(Object.assign({}, modelName), { error: 'Campo Obrigatório' }));
            return;
        }
        setIsLoadingSaveModel(true);
        setModelName(Object.assign(Object.assign({}, modelName), { open: false, error: '' }));
        let newModel = _.cloneDeep(scheduleChoosed);
        newModel.modeloid = newModel[`${PREFIX}cronogramadediaid`];
        newModel === null || newModel === void 0 ? true : delete newModel[`${PREFIX}cronogramadediaid`];
        newModel[`${PREFIX}modelo`] = true;
        newModel.anexossincronizados = false;
        const newActv = [];
        const dictActivityChoosed = new Map();
        activitiesModelChoosed.forEach((actv) => {
            if (actv.checked) {
                dictActivityChoosed.set(actv.id, actv);
            }
        });
        for (let i = 0; i < (newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_Atividade`].length); i++) {
            const activity = newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_Atividade`][i];
            if (!dictActivityChoosed.has(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`])) {
                break;
            }
            const actvResponse = yield getActivity(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]);
            let actv = (_a = actvResponse === null || actvResponse === void 0 ? void 0 : actvResponse.value) === null || _a === void 0 ? void 0 : _a[0];
            (_b = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_NomeAtividade`]) === null || _b === void 0 ? void 0 : _b.map((item) => {
                delete item[`${PREFIX}nomeatividadeid`];
                return item;
            });
            (_c = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.map((item) => {
                delete item[`${PREFIX}pessoasenvolvidasatividadeid`];
                return item;
            });
            (_d = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Documento`]) === null || _d === void 0 ? void 0 : _d.map((item) => {
                delete item[`${PREFIX}documentosatividadeid`];
                return item;
            });
            delete actv[`${PREFIX}atividadeid`];
            newActv.push(Object.assign({ [`${PREFIX}atividadeid`]: actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}atividadeid`] }, formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
                isModel: true,
                dictPeople: dictPeople,
                dictSpace: dictSpace,
                dictTag: dictTag,
            })));
        }
        newModel.activities = newActv;
        newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`].map((person) => {
            let newPerson = Object.assign({}, person);
            newPerson === null || newPerson === void 0 ? true : delete newPerson[`${PREFIX}pessoasenvolvidascronogramadiaid`];
            return newPerson;
        });
        const scheduleToSave = Object.assign(Object.assign({}, newModel), { model: true, name: modelName.name, date: moment('2006-01-01', 'YYYY-MM-DD'), module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}modulo_value`]], modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}modalidade_value`]], tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}ferramenta_value`]], isGroupActive: !modelName.isDay, startTime: (newModel[`${PREFIX}inicio`] &&
                moment(newModel[`${PREFIX}inicio`], 'HH:mm')) ||
                null, endTime: (newModel[`${PREFIX}fim`] &&
                moment(newModel[`${PREFIX}fim`], 'HH:mm')) ||
                null, duration: (newModel[`${PREFIX}duracao`] &&
                moment(newModel[`${PREFIX}duracao`], 'HH:mm')) ||
                null, toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[newModel === null || newModel === void 0 ? void 0 : newModel[`_${PREFIX}ferramentabackup_value`]], link: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}link`], linkBackup: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}linkbackup`], observation: newModel === null || newModel === void 0 ? void 0 : newModel[`${PREFIX}observacao`], anexos: [], people: ((_e = newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _e === void 0 ? void 0 : _e.length)
                ? (_f = newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                    keyId: v4(),
                    id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                    person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                    function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                }))
                : [{ keyId: v4(), person: null, function: null }], locale: ((_g = newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _g === void 0 ? void 0 : _g.length)
                ? (_h = newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _h === void 0 ? void 0 : _h.map((e) => ({
                    keyId: v4(),
                    id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                    space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                    observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
                }))
                : [{ keyId: v4(), person: null, function: null }] });
        addUpdateSchedule(scheduleToSave, null, null, {
            onSuccess: () => {
                setIsLoadingSaveModel(false);
                notification.success({
                    title: 'Sucesso',
                    description: 'Modelo salvo com sucesso',
                });
            },
            onError: (error) => {
                var _a, _b;
                setIsLoadingSaveModel(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }, false);
    });
    const handleToSaveModel = () => {
        setModelName({ open: true, isDay: true, name: '', error: '' });
    };
    const handleToSaveGrouping = () => {
        setModelName({ open: true, isDay: false, name: '', error: '' });
    };
    const handleCloseSaveModel = () => {
        setModelName({ open: false, isDay: true, name: '', error: '' });
    };
    const handleChangeCheckbox = (index, event) => {
        const newActv = _.cloneDeep(activitiesModelChoosed);
        newActv[index].checked = event.target.checked;
        setActivitiesModelChoosed(newActv);
    };
    const schedulesList = React.useMemo(() => schedules === null || schedules === void 0 ? void 0 : schedules.sort((left, right) => moment
        .utc(left === null || left === void 0 ? void 0 : left[`${PREFIX}data`])
        .diff(moment.utc(right === null || right === void 0 ? void 0 : right[`${PREFIX}data`]))), [schedules]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ScheduleDayForm, { isModel: true, titleRequired: false, visible: visible, context: context, program: programChoosed, team: teamChoosed, setSchedule: setScheduleChoosed, schedule: scheduleChoosed, teamId: teamId, programId: programId, handleClose: handleClose }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Title, null, "Dias"),
                canEdit ? (React.createElement(Tooltip, { arrow: true, title: 'Novo Dia' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setVisible(true) },
                        React.createElement(Add, null)))) : null),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: () => !isLoadingSaveModel && handleToSaveGrouping() },
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                        isLoadingSaveModel && !modelName.isDay ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null,
                        "Salvar como modelo de agrupamento"))),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.length) ? (React.createElement(React.Fragment, null, schedulesList === null || schedulesList === void 0 ? void 0 : schedulesList.map((sched) => {
                var _a;
                return (React.createElement(StyledCard, { key: sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}cronogramadediaid`], active: (scheduleChoosed === null || scheduleChoosed === void 0 ? void 0 : scheduleChoosed[`${PREFIX}cronogramadediaid`]) ===
                        (sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}cronogramadediaid`]), elevation: 3 },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, sched) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: (sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}nome`]) || 'Sem informações' },
                            React.createElement(TitleCard, { onClick: () => setScheduleChoosed(sched) }, sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}nome`])) }),
                    React.createElement(StyledContentCard, { onClick: () => setScheduleChoosed(sched) },
                        React.createElement(Divider, null),
                        React.createElement(Typography, { variant: 'body1' }, moment.utc(sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}data`]).format('DD/MM')),
                        React.createElement(Typography, { variant: 'body2' }, (_a = sched === null || sched === void 0 ? void 0 : sched[`${PREFIX}Modulo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]))));
            }))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum programa cadastrado")))),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: modelName.open, onClose: handleCloseSaveModel },
            React.createElement(DialogTitle, null, "Salvar como modelo"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, fullWidth: true, error: !!modelName.error, helperText: modelName.error, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { name: event.target.value })), margin: 'dense', label: 'Nome', placeholder: 'Informe o nome do modelo', type: 'text' }),
                React.createElement(Box, { marginTop: '2rem' },
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(FormLabel, { component: 'legend' }, "Atividades"),
                        React.createElement(FormGroup, null, activitiesModelChoosed === null || activitiesModelChoosed === void 0 ? void 0 : activitiesModelChoosed.map((actv, i) => (React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: actv.checked, onChange: (event) => handleChangeCheckbox(i, event), name: actv.name, color: 'primary' }), label: actv.name }))))))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { color: 'primary', onClick: handleCloseSaveModel }, "Cancelar"),
                React.createElement(Button, { onClick: saveAsModel, variant: 'contained', color: 'primary' }, "Salvar")))));
};
export default ListDays;
//# sourceMappingURL=index.js.map