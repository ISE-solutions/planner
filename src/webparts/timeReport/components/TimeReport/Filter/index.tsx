import * as React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { AppState } from '~/store';
import { PREFIX } from '~/config/database';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { fetchAllPrograms } from '~/store/modules/program/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import { Autocomplete } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Today } from '@material-ui/icons';
import { getSchedules } from '~/store/modules/schedule/actions';
import * as moment from 'moment';
import * as _ from 'lodash';

interface IFilterProps {
  formik: any;
}

const Filter: React.FC<IFilterProps> = ({ formik }) => {
  const [schedules, setSchedules] = React.useState([]);
  const [openChooseSchedules, setOpenChooseSchedules] = React.useState(false);
  const dispatch = useDispatch();

  const { program, team } = useSelector((state: AppState) => state);
  const { loading: loadingProgram, programs } = program;
  const { loading: loadingTeam, teams } = team;

  React.useEffect(() => {
    dispatch(
      fetchAllPrograms({
        active: 'Ativo',
        model: false,
      })
    );
  }, []);

  const handleChangeProgram = (newValue: any) => {
    formik.setFieldValue('program', newValue);
    formik.setFieldValue('team', null);

    dispatch(
      fetchAllTeams({
        programId: newValue?.[`${PREFIX}programaid`],
        active: 'Ativo',
        model: false,
      })
    );
  };

  const handleChangeTeam = (newValue: any) => {
    formik.setFieldValue('team', newValue);

    getSchedules({
      teamId: newValue?.[`${PREFIX}turmaid`],
      active: 'Ativo',
      orderBy: `${PREFIX}data`,
      order: 'asc',
    }).then((data) => {
      const newSchedules = data.map((e) => ({
        ...e,
        day: moment.utc(e?.[`${PREFIX}data`]).format('DD/MM/YYYY'),
        selected: true,
      }));
      setSchedules(newSchedules);
      formik.setFieldValue(
        'schedules',
        newSchedules?.map((e) => e?.[`${PREFIX}cronogramadediaid`])
      );
    });
  };

  const handleCheckSchedule = (i) => {
    const newSchedules = _.cloneDeep(schedules);
    newSchedules[i].selected = !newSchedules[i].selected;

    setSchedules(newSchedules);
  };

  const handleSelectAll = (selected) => {
    let newSchedules = _.cloneDeep(schedules);
    newSchedules = newSchedules.map((e) => ({ ...e, selected }));

    setSchedules(newSchedules);
  };

  const handleApply = () => {
    formik.setFieldValue(
      'schedules',
      schedules
        ?.filter((e) => e?.selected)
        ?.map((e) => e?.[`${PREFIX}cronogramadediaid`])
    );
    setOpenChooseSchedules(false);
  };

  return (
    <>
      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Grid container spacing={3}>
          <Grid item lg={6} md={6}>
            <Autocomplete
              fullWidth
              noOptionsText='Sem Opções'
              loading={loadingProgram}
              options={programs}
              onChange={(event: any, newValue: string | null) => {
                handleChangeProgram(newValue);
              }}
              getOptionLabel={(option) =>
                `${
                  option?.[`${PREFIX}Empresa`]
                    ? option?.[`${PREFIX}Empresa`]?.[`${PREFIX}nome`] + ' - '
                    : ''
                }${option?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`] || ''}`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.program}
                  helperText={formik.errors.program as string}
                  label='Programa'
                />
              )}
              value={formik.values.program}
            />
          </Grid>

          <Grid item lg={5} md={5}>
            <Autocomplete
              fullWidth
              noOptionsText='Sem Opções'
              loading={loadingTeam}
              options={teams}
              disabled={!teams?.length}
              onChange={(event: any, newValue: string | null) =>
                handleChangeTeam(newValue)
              }
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.team}
                  helperText={formik.errors.team as string}
                  label='Turma'
                />
              )}
              value={formik.values.team}
            />
          </Grid>

          <Grid item lg={1} md={1}>
            <Tooltip title='Dias de aula'>
              <IconButton
                disabled={!schedules.length}
                onClick={() => setOpenChooseSchedules(true)}
              >
                <Today />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid item lg={3} md={4}>
            <KeyboardDatePicker
              autoOk
              clearable
              fullWidth
              variant='inline'
              format={'DD/MM/YYYY'}
              label='Data de Início'
              error={!!formik.errors.startDate}
              // @ts-ignore
              helperText={formik.errors.startDate}
              value={formik.values.startDate}
              onChange={(value) => {
                formik.setFieldValue('startDate', value);

                if (!formik.values.endDate) {
                  formik.setFieldValue('endDate', value);
                }
              }}
            />
          </Grid>

          <Grid item lg={3} md={4}>
            <KeyboardDatePicker
              autoOk
              fullWidth
              clearable
              variant='inline'
              format={'DD/MM/YYYY'}
              label='Data de Fim'
              error={!!formik.errors.endDate}
              // @ts-ignore
              helperText={formik.errors.endDate}
              value={formik.values.endDate}
              onChange={(value) => {
                formik.setFieldValue('endDate', value);
              }}
            />
          </Grid>
        </Grid>

        <Box width='100%' display='flex' justifyContent='flex-end'>
          <Button
            variant='contained'
            color='primary'
            onClick={() => formik.handleSubmit()}
          >
            Pesquisar
          </Button>
        </Box>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={openChooseSchedules}
        onClose={() => setOpenChooseSchedules(false)}
      >
        <DialogTitle>Dias de aula</DialogTitle>
        <DialogContent>
          <Box width='100%' display='flex' style={{ gap: '10px' }}>
            <Button onClick={() => handleSelectAll(true)}>Marcar todos</Button>
            <Button onClick={() => handleSelectAll(false)}>
              Desmarcar todos
            </Button>
          </Box>
          <Box>
            <FormControl component='fieldset'>
              <FormGroup>
                {schedules?.map((actv: any, i) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={actv.selected}
                        onChange={() => handleCheckSchedule(i)}
                        name={actv.day}
                        color='primary'
                      />
                    }
                    label={actv.day}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChooseSchedules(false)}>
            Cancelar
          </Button>
          <Button onClick={handleApply} variant='contained' color='primary'>
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Filter;
