import * as React from 'react';

import { Autocomplete } from '@material-ui/lab';
import { Box, Grid, TextField } from '@material-ui/core';
import { ENTITIES } from '../constants';
import { KeyboardDatePicker } from '@material-ui/pickers';

interface IFilter {
  formik: any;
}

const entities = [
  {
    value: ENTITIES.TAG,
    label: 'Etiqueta',
  },
  {
    value: ENTITIES.PERSON,
    label: 'Pessoa',
  },
  {
    value: ENTITIES.SPACE,
    label: 'Espaço',
  },
  {
    value: ENTITIES.FINITE_RESOURCES,
    label: 'Recurso Finito',
  },
  {
    value: ENTITIES.INFINITE_RESOURCES,
    label: 'Recurso Infinito',
  },
  {
    value: ENTITIES.ACADEMIC_ACTIVITY,
    label: 'Atividade Acadêmica',
  },
  {
    value: ENTITIES.NON_ACADEMIC_ACTIVITY,
    label: 'Atividade não Acadêmica',
  },
  {
    value: ENTITIES.INTERNAL_ACTIVITY,
    label: 'Atividade Interna',
  },
  {
    value: ENTITIES.PROGRAM,
    label: 'Programa',
  },
  {
    value: ENTITIES.PROGRAM_MODEL,
    label: 'Programa (Modelo)',
  },
  {
    value: ENTITIES.TEAM,
    label: 'Turma',
  },
  {
    value: ENTITIES.TEAM_MODEL,
    label: 'Turma (Modelo)',
  },
  {
    value: ENTITIES.SCHEDULE,
    label: 'Dia de aula',
  },
  {
    value: ENTITIES.SCHEDULE_MODEL,
    label: 'Dia de aula (Modelo)',
  },
  {
    value: ENTITIES.ACTIVITY,
    label: 'Atividade',
  },
  {
    value: ENTITIES.ACTIVITY_MODEL,
    label: 'Atividade (Modelo)',
  },
];

const Filter: React.FC<IFilter> = ({ formik }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item sm={12} md={4} lg={4}>
          <Autocomplete
            options={entities}
            getOptionLabel={(option) => option?.label}
            onChange={(event: any, newValue: string | null) => {
              formik.setFieldValue(`entity`, newValue);
            }}
            noOptionsText='Sem Opções'
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label='Entidade'
                // @ts-ignore
                error={!!formik.errors?.entity}
                // @ts-ignore
                helperText={formik.errors?.entity as string}
              />
            )}
            value={formik.values?.entity}
          />
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <KeyboardDatePicker
            clearable
            autoOk
            fullWidth
            variant='inline'
            format='DD/MM/YYYY'
            label='Início de exclusão'
            error={!!formik.errors?.startDeleted}
            helperText={formik.errors?.startDeleted}
            value={formik.values.startDeleted}
            onChange={(value) => formik.setFieldValue(`startDeleted`, value)}
          />
        </Grid>
        <Grid item sm={12} md={4} lg={4}>
          <KeyboardDatePicker
            clearable
            autoOk
            fullWidth
            variant='inline'
            format='DD/MM/YYYY'
            label='Fim de exclusão'
            error={!!formik.errors?.endDeleted}
            helperText={formik.errors?.endDeleted}
            value={formik.values.endDeleted}
            onChange={(value) => formik.setFieldValue(`endDeleted`, value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Filter;
