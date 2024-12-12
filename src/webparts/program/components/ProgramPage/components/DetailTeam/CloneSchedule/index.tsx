import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { Close } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import {
  addUpdateSchedule,
  getSchedules,
} from '~/store/modules/schedule/actions';
import { useConfirmation, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import formatScheduleModel from '~/utils/formatScheduleModel';
import { AppState } from '~/store';
import formatActivity from '~/utils/formatActivity';
import * as moment from 'moment';
import { EFatherTag } from '~/config/enums';
import * as _ from 'lodash';

const CloneSchedule = ({
  open,
  handleClose,
  teamId,
  programId,
  schedule,
  refetch,
  refetchSchedule,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [daySelected, setDaySelected] = React.useState<any>(moment());

  const dispatch = useDispatch();
  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const { tag, space, person } = useSelector((state: AppState) => state);
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
    dispatch(
      addUpdateSchedule(item, teamId, programId, {
        onSuccess: handleSuccess,
        onError: (error) => {
          setLoading(false);
          notification.error({
            title: 'Falha',
            description: error?.data?.error?.message,
          });
        },
      })
    );
  };

  const handleSave = () => {
    setLoading(true);

    let payload = { ...schedule };
    const dayUTC = moment(daySelected.clone().toDate());

    payload[`${PREFIX}data`] = dayUTC.format('YYYY-MM-DDT00:00:00Z');
    delete payload[`${PREFIX}cronogramadediaid`];

    payload.activities = schedule.activities.map((actv) => {
      delete actv.id;
      delete actv[`${PREFIX}atividadeid`];

      actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
        delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
      });

      actv?.[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
        delete elm[`${PREFIX}nomeatividadeid`];
      });

      actv?.[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
        delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
      });

      actv?.[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
        delete elm[`${PREFIX}requisicaoacademicaid`];
      });

      actv.people = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
        ? actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
            const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
            func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
            );
            const pe = dictPeople[e?.[`_${PREFIX}pessoa_value`]];

            return {
              ...e,
              keyId: v4(),
              startTime:
                (actv[`${PREFIX}inicio`] &&
                  moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
                null,
              duration:
                (actv[`${PREFIX}duracao`] &&
                  moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
                null,
              endTime:
                (actv[`${PREFIX}fim`] &&
                  moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
                null,
              id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
              person: pe,
              function: func,
            };
          })
        : [
            {
              keyId: v4(),
              person: null,
              function: null,
            },
          ];

      return formatActivity(
        {
          ...actv,
          [`${PREFIX}datahorainicio`]: `${daySelected
            .clone()
            .format('YYYY-MM-DD')}T${actv?.[`${PREFIX}inicio`]}`,
          [`${PREFIX}datahorafim`]: `${daySelected
            .clone()
            .format('YYYY-MM-DD')}T${actv?.[`${PREFIX}fim`]}`,
        },
        { dictPeople, dictSpace, dictTag }
      );
    });

    payload?.[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map((env) => {
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
        if (data?.length) {
          confirmation.openConfirmation({
            title: 'Dia de aula existente',
            description: `Já existe um Dia de aula para o dia ${dayUTC?.format(
              'DD/MM/YYYY'
            )}, verifique por favor`,
            yesLabel: 'Ok',
            onConfirm: async () => {},
          });
          setLoading(false);
        } else {
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

  return (
    <Dialog open={open} fullWidth maxWidth='sm'>
      <DialogTitle>
        Para qual dia de aula será clonada?
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
          <KeyboardDatePicker
            autoOk
            clearable
            autoFocus
            fullWidth
            variant='inline'
            format={'DD/MM/YYYY'}
            label='Dia'
            value={daySelected}
            onChange={(value) => {
              setDaySelected(value);
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Cancelar
        </Button>

        <Button onClick={handleSave} variant='contained' color='primary'>
          {loading ? (
            <CircularProgress size={20} style={{ color: '#fff' }} />
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloneSchedule;
