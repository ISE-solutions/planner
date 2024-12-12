import * as React from 'react';
import * as _ from 'lodash';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';

interface IInfoProps {
  fatherTags: any[];
  tag: any;
  formik: any;
}

const Info: React.FC<IInfoProps> = ({ tag, fatherTags, formik }) => {
  const fatherTagsOptions = React.useMemo(
    () =>
      fatherTags
        ?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
        ?.sort((a, b) =>
          a?.[`${PREFIX}nome`].localeCompare(b?.[`${PREFIX}nome`], 'pt-BR')
        ),
    [fatherTags]
  );
  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              required
              autoFocus
              fullWidth
              label='Nome'
              type='text'
              name='name'
              disabled={tag && tag?.[`${PREFIX}ehpai`]}
              inputProps={{ maxLength: 255 }}
              error={!!formik.errors.name}
              helperText={formik.errors.name as string}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Grid>

          <Grid item sm={12} md={8} lg={8}>
            <Autocomplete
              multiple
              noOptionsText='Sem Opções'
              options={fatherTagsOptions}
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue('fatherTag', newValue);
              }}
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.fatherTag}
                  helperText={formik.errors.fatherTag as string}
                  label='Etiqueta(s) pai'
                />
              )}
              value={formik.values.fatherTag}
            />
          </Grid>
          <Grid item sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              label='Ordem'
              type='number'
              name='order'
              error={!!formik.errors.order}
              helperText={formik.errors.order as string}
              onChange={formik.handleChange}
              value={formik.values.order}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label='Descrição'
              type='text'
              name='description'
              inputProps={{ maxLength: 255 }}
              error={!!formik.errors.description}
              helperText={formik.errors.description as string}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Info;
