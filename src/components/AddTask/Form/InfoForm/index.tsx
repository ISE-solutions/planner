import * as React from 'react';
import { Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  EFatherTag,
  PRIORITY_TASK,
  STATUS_TASK,
  TYPE_TASK,
} from '~/config/enums';
import { PREFIX } from '~/config/database';
import { AppState } from '~/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { fetchAllPrograms } from '~/store/modules/program/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import * as moment from 'moment';

interface IInfoForm {
  isDetail?: boolean;
  errors: any;
  values: any;
  task: any;
  handleChange: any;
  setFieldValue: any;
}

const InfoForm: React.FC<IInfoForm> = ({
  isDetail,
  values,
  errors,
  task,
  setFieldValue,
  handleChange,
}) => {
  const dispatch = useDispatch();

  const { tag, person, program, team } = useSelector(
    (state: AppState) => state
  );
  const { dictTag, tags } = tag;
  const { persons } = person;
  const { loading: loadingProgram, programs } = program;
  const { loading: loadingTeam, teams } = team;

  React.useEffect(() => {
    if (!task || task?.[`${PREFIX}tipo`] !== TYPE_TASK.PLANEJAMENTO) {
      dispatch(
        fetchAllPrograms({
          active: 'Ativo',
          model: false,
        })
      );
    }
  }, []);

  const handleChangeProgram = (newValue: any) => {
    setFieldValue('program', newValue);

    dispatch(
      fetchAllTeams({
        programId: newValue?.[`${PREFIX}programaid`],
        active: 'Ativo',
        model: false,
      })
    );
  };

  const handleChangeStatus = (_e: any, newValue: any) => {
    setFieldValue(`status`, newValue);

    if (newValue.value === STATUS_TASK.Concluído) {
      setFieldValue('concludedDay', moment());
    }
  };

  const functionOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      ),
    [tags]
  );

  const statusOptions = React.useMemo(
    () =>
      Object.values(STATUS_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
          value: STATUS_TASK[key],
          label: key,
        })),
    []
  );

  const priorityOptions = React.useMemo(
    () =>
      Object.values(PRIORITY_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
          value: PRIORITY_TASK[key],
          label: key,
        })),
    []
  );

  const activitiesOptions = React.useMemo(
    () =>
      values.team?.[`${PREFIX}ise_atividade_Turma_ise_turma`]?.map((actv) => ({
        ...actv,
        label: `${moment(actv?.[`${PREFIX}datahorainicio`]).format(
          'DD/MM/YYYY'
        )} - ${actv?.[`${PREFIX}nome`]}`,
      })),
    [values.team]
  );

  return (
    <Grid container spacing={3}>
      <Grid item sm={12} md={6} lg={6}>
        <TextField
          autoFocus
          fullWidth
          required
          label='Título'
          type='text'
          name='title'
          disabled={
            task &&
            (isDetail || task?.[`${PREFIX}tipo`] !== TYPE_TASK.PLANEJAMENTO)
          }
          inputProps={{ maxLength: 255 }}
          error={!!errors.title}
          helperText={errors.title}
          onChange={handleChange}
          value={values.title}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          disabled
          label='Tipo'
          type='text'
          name='type'
          inputProps={{ maxLength: 255 }}
          error={!!errors.type}
          helperText={errors.type}
          onChange={handleChange}
          value={values.type}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          multiple
          options={persons || []}
          filterSelectedOptions={true}
          noOptionsText='Sem Opções'
          disabled={isDetail}
          getOptionLabel={(option) => option?.label}
          onChange={(event: any, newValue: any | null) => {
            setFieldValue(`responsible`, newValue);
          }}
          getOptionSelected={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField {...params} fullWidth label='Pessoa(s) Responsável' />
          )}
          value={values?.responsible}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          options={functionOptions || []}
          filterSelectedOptions={true}
          noOptionsText='Sem Opções'
          disabled={isDetail}
          getOptionLabel={(option) => option?.label}
          onChange={(event: any, newValue: any | null) => {
            setFieldValue(`group`, newValue);
          }}
          getOptionSelected={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField {...params} fullWidth label='Grupo Responsável' />
          )}
          value={values?.group}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          options={statusOptions}
          filterSelectedOptions={true}
          noOptionsText='Sem Opções'
          disabled={isDetail}
          getOptionLabel={(option) => option?.label || ''}
          onChange={handleChangeStatus}
          getOptionSelected={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField required {...params} fullWidth label='Progresso' />
          )}
          value={values?.status}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          options={priorityOptions}
          filterSelectedOptions={true}
          disabled={isDetail}
          noOptionsText='Sem Opções'
          getOptionLabel={(option) => option?.label || ''}
          onChange={(event: any, newValue: string | null) => {
            setFieldValue(`priority`, newValue);
          }}
          getOptionSelected={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField required {...params} fullWidth label='Prioridade' />
          )}
          value={values?.priority}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          loading={loadingProgram}
          options={programs}
          filterSelectedOptions={true}
          disabled={
            task &&
            (isDetail || task?.[`${PREFIX}tipo`] !== TYPE_TASK.PLANEJAMENTO)
          }
          noOptionsText='Sem Opções'
          getOptionLabel={(option) =>
            (option?.[`${PREFIX}NomePrograma`]
              ? `${option?.[`${PREFIX}Empresa`]?.[`${PREFIX}nome`] || ''} - ${
                  option?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`] || ''
                }`
              : option?.label) || ''
          }
          onChange={(event: any, newValue: any) => {
            handleChangeProgram(newValue);
          }}
          getOptionSelected={(option, value) => option?.value === value?.value}
          renderInput={(params) => (
            <TextField
              required
              {...params}
              fullWidth
              error={!!errors.program}
              helperText={errors.program as string}
              label='Programa'
            />
          )}
          value={values?.program}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          fullWidth
          noOptionsText='Sem Opções'
          loading={loadingTeam}
          options={teams}
          disabled={!teams?.length}
          onChange={(event: any, newValue: string | null) => {
            setFieldValue('team', newValue);
          }}
          getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!errors.team}
              helperText={errors.team as string}
              label='Turma'
            />
          )}
          value={values.team}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Autocomplete
          fullWidth
          noOptionsText='Sem Opções'
          options={activitiesOptions || []}
          disabled={!teams?.length}
          onChange={(event: any, newValue: string | null) => {
            setFieldValue('activity', newValue);
          }}
          getOptionLabel={(option) => option?.label || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={!!errors.activity}
              helperText={errors.activity as string}
              label='Atividade'
            />
          )}
          value={values.activity}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <KeyboardDatePicker
          autoOk
          clearable
          fullWidth
          disabled={isDetail}
          variant='inline'
          format={'DD/MM/YYYY'}
          label='Data de Início'
          value={values.startDay}
          error={!!errors.startDay}
          helperText={errors.startDay as string}
          onChange={(newValue: any) => {
            setFieldValue(`startDay`, newValue);
          }}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <KeyboardDateTimePicker
          autoOk
          clearable
          fullWidth
          disabled
          ampm={false}
          variant='inline'
          format={'DD/MM/YYYY HH:mm'}
          label='Data de Criação'
          value={values.createdon || null}
          onChange={() => {}}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <KeyboardDatePicker
          autoOk
          clearable
          fullWidth
          required
          disabled={isDetail}
          variant='inline'
          format={'DD/MM/YYYY'}
          label='Previsão de Conclusão'
          error={!!errors.completionForecast}
          helperText={errors.completionForecast as string}
          value={values.completionForecast}
          onChange={(newValue: any) => {
            setFieldValue(`completionForecast`, newValue);
          }}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <KeyboardDateTimePicker
          autoOk
          disabled
          clearable
          fullWidth
          variant='inline'
          format={'DD/MM/YYYY HH:mm'}
          label='Data de Conclusão'
          error={!!errors.concludedDay}
          helperText={errors.concludedDay as string}
          value={values.concludedDay}
          onChange={() => {}}
        />
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          label='Link para Conteúdo'
          type='text'
          name='link'
          disabled={isDetail}
          inputProps={{ maxLength: 255 }}
          error={!!errors.link}
          helperText={errors.link}
          onChange={handleChange}
          value={values.link}
        />
      </Grid>

      <Grid item sm={12} md={12} lg={12}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label='Anotações'
          type='text'
          name='observation'
          disabled={isDetail}
          inputProps={{ maxLength: 2000 }}
          onChange={handleChange}
          value={values.observation}
        />
      </Grid>
    </Grid>
  );
};

export default InfoForm;
