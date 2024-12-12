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
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import { v4 } from 'uuid';
import { Close } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { addUpdateSchedule, getSchedules, } from '~/store/modules/schedule/actions';
import { useConfirmation, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import formatScheduleModel from '~/utils/formatScheduleModel';
import formatActivity from '~/utils/formatActivity';
import * as moment from 'moment';
import { EFatherTag } from '~/config/enums';
import * as _ from 'lodash';
const CloneSchedule = ({ open, handleClose, teamId, programId, schedule, refetch, refetchSchedule, }) => {
    const [loading, setLoading] = React.useState(false);
    const [daySelected, setDaySelected] = React.useState(moment());
    const dispatch = useDispatch();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { tag, space, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictSpace } = space;
    const { dictPeople } = person;
    const handleSuccess = () => {
        refetch();
        refetchSchedule();
        handleClose();
        setLoading(false);
        notification.success({
            title: 'Sucesso',
            description: 'Cadastro realizado com sucesso',
        });
    };
    const handleRequestSave = (item) => {
        dispatch(addUpdateSchedule(item, teamId, programId, {
            onSuccess: handleSuccess,
            onError: (error) => {
                var _a, _b;
                setLoading(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const handleSave = () => {
        var _a;
        setLoading(true);
        let payload = Object.assign({}, schedule);
        const dayUTC = moment(daySelected.clone().toDate());
        payload[`${PREFIX}data`] = dayUTC.format('YYYY-MM-DDT00:00:00Z');
        delete payload[`${PREFIX}cronogramadediaid`];
        payload.activities = schedule.activities.map((actv) => {
            var _a, _b;
            delete actv.id;
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
                    return Object.assign(Object.assign({}, e), { keyId: v4(), startTime: (actv[`${PREFIX}inicio`] &&
                            moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
                            null, duration: (actv[`${PREFIX}duracao`] &&
                            moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
                            null, endTime: (actv[`${PREFIX}fim`] &&
                            moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
                            null, id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: pe, function: func });
                })
                : [
                    {
                        keyId: v4(),
                        person: null,
                        function: null,
                    },
                ];
            return formatActivity(Object.assign(Object.assign({}, actv), { [`${PREFIX}datahorainicio`]: `${daySelected
                    .clone()
                    .format('YYYY-MM-DD')}T${actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}inicio`]}`, [`${PREFIX}datahorafim`]: `${daySelected
                    .clone()
                    .format('YYYY-MM-DD')}T${actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}fim`]}` }), { dictPeople, dictSpace, dictTag });
        });
        (_a = payload === null || payload === void 0 ? void 0 : payload[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.map((env) => {
            const newEnv = _.cloneDeep(env);
            delete newEnv.id;
            delete newEnv[`${PREFIX}atividadeid`];
            return newEnv;
        });
        getSchedules({
            date: dayUTC.format('YYYY-MM-DD'),
            active: 'Ativo',
            teamId: teamId,
            filterTeam: true,
        })
            .then((data) => {
            if (data === null || data === void 0 ? void 0 : data.length) {
                confirmation.openConfirmation({
                    title: 'Dia de aula existente',
                    description: `Já existe um Dia de aula para o dia ${dayUTC === null || dayUTC === void 0 ? void 0 : dayUTC.format('DD/MM/YYYY')}, verifique por favor`,
                    yesLabel: 'Ok',
                    onConfirm: () => __awaiter(void 0, void 0, void 0, function* () { }),
                });
                setLoading(false);
            }
            else {
                const toSave = formatScheduleModel(payload, {
                    dictTag,
                    dictSpace,
                    dictPeople,
                });
                handleRequestSave(toSave);
            }
        })
            .catch(() => {
            setLoading(false);
        });
    };
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'sm' },
        React.createElement(DialogTitle, null,
            "Para qual dia de aula ser\u00E1 clonada?",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
                React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, autoFocus: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', label: 'Dia', value: daySelected, onChange: (value) => {
                        setDaySelected(value);
                    } }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: handleSave, variant: 'contained', color: 'primary' }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Salvar')))));
};
export default CloneSchedule;
//# sourceMappingURL=index.js.map