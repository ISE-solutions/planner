import * as React from 'react';
import * as moment from 'moment';
import * as _ from 'lodash';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { Add, MoreVert } from '@material-ui/icons';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  AddButton,
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from '~/components/CustomCard';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { PREFIX } from '~/config/database';
import formatActivityModel from '~/utils/formatActivityModel';
import { useActivity, useNotification } from '~/hooks';
import { IExceptionOption } from '~/hooks/types';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IListDays {
  schedules: any[];
  canEdit: boolean;
  context: WebPartContext;
  scheduleChoosed: any;
  teamChoosed: any;
  programChoosed: any;
  setScheduleChoosed: any;
  addUpdateSchedule: any;
  teamId?: string;
  programId?: string;
  refetchSchedule: () => void;
  refetchTeam: () => void;
}

const ListDays: React.FC<IListDays> = ({
  schedules,
  canEdit,
  context,
  teamId,
  teamChoosed,
  programChoosed,
  scheduleChoosed,
  setScheduleChoosed,
  programId,
  addUpdateSchedule,
  refetchSchedule,
  refetchTeam,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activitiesModelChoosed, setActivitiesModelChoosed] = React.useState(
    []
  );
  const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
  const [modelName, setModelName] = React.useState<any>({
    open: false,
    name: '',
    error: '',
  });

  const { notification } = useNotification();
  const { tag, space, person } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { spaces, dictSpace } = space;
  const { persons, dictPeople } = person;

  const [{ getActivity }] = useActivity(
    {},
    {
      manual: true,
    }
  );

  const handleOption = (event, item) => {
    setScheduleChoosed(item);
    setActivitiesModelChoosed(
      item?.[`${PREFIX}CronogramadeDia_Atividade`].map((actv) => ({
        id: actv?.[`${PREFIX}atividadeid`],
        name: actv?.[`${PREFIX}nome`],
        checked: true,
      }))
    );
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

  const saveAsModel = async () => {
    if (!modelName.name) {
      setModelName({ ...modelName, error: 'Campo Obrigatório' });
      return;
    }
    setIsLoadingSaveModel(true);
    setModelName({ ...modelName, open: false, error: '' });

    let newModel = _.cloneDeep(scheduleChoosed);
    newModel.modeloid = newModel[`${PREFIX}cronogramadediaid`];

    delete newModel?.[`${PREFIX}cronogramadediaid`];
    newModel[`${PREFIX}modelo`] = true;
    newModel.anexossincronizados = false;

    const newActv = [];
    const dictActivityChoosed = new Map();

    activitiesModelChoosed.forEach((actv) => {
      if (actv.checked) {
        dictActivityChoosed.set(actv.id, actv);
      }
    });

    for (
      let i = 0;
      i < newModel?.[`${PREFIX}CronogramadeDia_Atividade`].length;
      i++
    ) {
      const activity = newModel?.[`${PREFIX}CronogramadeDia_Atividade`][i];

      if (!dictActivityChoosed.has(activity?.[`${PREFIX}atividadeid`])) {
        break;
      }

      const actvResponse = await getActivity(
        activity?.[`${PREFIX}atividadeid`]
      );
      let actv = actvResponse?.value?.[0];

      actv?.[`${PREFIX}Atividade_NomeAtividade`]?.map((item) => {
        delete item[`${PREFIX}nomeatividadeid`];

        return item;
      });

      actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((item) => {
        delete item[`${PREFIX}pessoasenvolvidasatividadeid`];

        return item;
      });

      actv?.[`${PREFIX}Atividade_Documento`]?.map((item) => {
        delete item[`${PREFIX}documentosatividadeid`];

        return item;
      });

      delete actv[`${PREFIX}atividadeid`];
      newActv.push({
        [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
        ...formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
          isModel: true,
          dictPeople: dictPeople,
          dictSpace: dictSpace,
          dictTag: dictTag,
        }),
      });
    }

    newModel.activities = newActv;

    newModel?.[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`].map((person) => {
      let newPerson = { ...person };
      delete newPerson?.[`${PREFIX}pessoasenvolvidascronogramadiaid`];

      return newPerson;
    });

    const scheduleToSave = {
      ...newModel,
      model: true,
      name: modelName.name,
      date: moment('2006-01-01', 'YYYY-MM-DD'),
      module: dictTag?.[newModel?.[`_${PREFIX}modulo_value`]],
      modality: dictTag?.[newModel?.[`_${PREFIX}modalidade_value`]],
      tool: dictTag?.[newModel?.[`_${PREFIX}ferramenta_value`]],
      isGroupActive: !modelName.isDay,
      startTime:
        (newModel[`${PREFIX}inicio`] &&
          moment(newModel[`${PREFIX}inicio`], 'HH:mm')) ||
        null,
      endTime:
        (newModel[`${PREFIX}fim`] &&
          moment(newModel[`${PREFIX}fim`], 'HH:mm')) ||
        null,
      duration:
        (newModel[`${PREFIX}duracao`] &&
          moment(newModel[`${PREFIX}duracao`], 'HH:mm')) ||
        null,
      toolBackup: dictTag?.[newModel?.[`_${PREFIX}ferramentabackup_value`]],
      link: newModel?.[`${PREFIX}link`],
      linkBackup: newModel?.[`${PREFIX}linkbackup`],
      observation: newModel?.[`${PREFIX}observacao`],
      anexos: [],
      people: newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.length
        ? newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map((e) => ({
            keyId: v4(),
            id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: dictTag[e?.[`_${PREFIX}funcao_value`]],
          }))
        : [{ keyId: v4(), person: null, function: null }],
      locale: newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.length
        ? newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map((e) => ({
            keyId: v4(),
            id: e?.[`${PREFIX}localcronogramadiaid`],
            space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
            observation: e?.[`${PREFIX}observacao`],
          }))
        : [{ keyId: v4(), person: null, function: null }],
    };

    addUpdateSchedule(
      scheduleToSave,
      null,
      null,
      {
        onSuccess: () => {
          setIsLoadingSaveModel(false);
          notification.success({
            title: 'Sucesso',
            description: 'Modelo salvo com sucesso',
          });
        },
        onError: (error) => {
          setIsLoadingSaveModel(false);
          notification.error({
            title: 'Falha',
            description: error?.data?.error?.message,
          });
        },
      },
      false
    );
  };

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

  const schedulesList = React.useMemo<any[]>(
    () =>
      schedules?.sort((left, right) =>
        moment
          .utc(left?.[`${PREFIX}data`])
          .diff(moment.utc(right?.[`${PREFIX}data`]))
      ),
    [schedules]
  );

  return (
    <>
      <ScheduleDayForm
        isModel
        titleRequired={false}
        visible={visible}
        context={context}
        program={programChoosed}
        team={teamChoosed}
        setSchedule={setScheduleChoosed}
        schedule={scheduleChoosed}
        teamId={teamId}
        programId={programId}
        handleClose={handleClose}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Title>Dias</Title>
          {canEdit ? (
            <Tooltip arrow title='Novo Dia'>
              <AddButton
                variant='contained'
                color='primary'
                onClick={() => setVisible(true)}
              >
                <Add />
              </AddButton>
            </Tooltip>
          ) : null}
        </Box>

        {/* <TextField
          label='Pesquisar'
          InputProps={{
            endAdornment: <></>,
          }}
            onChange={(e) => setSearch(e.target.value)}
        /> */}

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}
        >
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem
            onClick={() => !isLoadingSaveModel && handleToSaveGrouping()}
          >
            <Box display='flex' style={{ gap: '10px' }}>
              {isLoadingSaveModel && !modelName.isDay ? (
                <CircularProgress size={20} color='primary' />
              ) : null}
              Salvar como modelo de agrupamento
            </Box>
          </MenuItem>
        </Menu>

        <Box
          display='flex'
          flexDirection='column'
          overflow='auto'
          maxHeight='calc(100vh - 17rem)'
          paddingBottom='10px'
          margin='0 -5px'
          style={{ gap: '1rem' }}
        >
          {schedulesList?.length ? (
            <>
              {schedulesList?.map((sched) => (
                <StyledCard
                  key={sched?.[`${PREFIX}cronogramadediaid`]}
                  active={
                    scheduleChoosed?.[`${PREFIX}cronogramadediaid`] ===
                    sched?.[`${PREFIX}cronogramadediaid`]
                  }
                  elevation={3}
                >
                  <StyledHeaderCard
                    action={
                      <Tooltip arrow title='Ações'>
                        <StyledIconButton
                          aria-label='settings'
                          onClick={(event) => handleOption(event, sched)}
                        >
                          <MoreVert />
                        </StyledIconButton>
                      </Tooltip>
                    }
                    title={
                      <Tooltip
                        arrow
                        title={sched?.[`${PREFIX}nome`] || 'Sem informações'}
                      >
                        <TitleCard onClick={() => setScheduleChoosed(sched)}>
                          {sched?.[`${PREFIX}nome`]}
                        </TitleCard>
                      </Tooltip>
                    }
                  />
                  <StyledContentCard onClick={() => setScheduleChoosed(sched)}>
                    <Divider />
                    <Typography variant='body1'>
                      {moment.utc(sched?.[`${PREFIX}data`]).format('DD/MM')}
                    </Typography>
                    <Typography variant='body2'>
                      {sched?.[`${PREFIX}Modulo`]?.[`${PREFIX}nome`]}
                    </Typography>
                  </StyledContentCard>
                </StyledCard>
              ))}
            </>
          ) : (
            <Typography variant='body1'>Nenhum programa cadastrado</Typography>
          )}
        </Box>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={modelName.open}
        onClose={handleCloseSaveModel}
      >
        <DialogTitle>Salvar como modelo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!modelName.error}
            helperText={modelName.error}
            onChange={(event) =>
              setModelName({ ...modelName, name: event.target.value })
            }
            margin='dense'
            label='Nome'
            placeholder='Informe o nome do modelo'
            type='text'
          />

          <Box marginTop='2rem'>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Atividades</FormLabel>
              <FormGroup>
                {activitiesModelChoosed?.map((actv, i) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actv.checked}
                        onChange={(event) => handleChangeCheckbox(i, event)}
                        name={actv.name}
                        color='primary'
                      />
                    }
                    label={actv.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleCloseSaveModel}>
            Cancelar
          </Button>
          <Button onClick={saveAsModel} variant='contained' color='primary'>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListDays;
