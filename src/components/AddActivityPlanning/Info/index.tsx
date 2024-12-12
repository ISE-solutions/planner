import * as React from 'react';
import * as _ from 'lodash';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { AddTag, IconHelpTooltip } from '~/components';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';

interface IInfoProps {
  formik: any;
  activityType:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
}

const Info: React.FC<IInfoProps> = ({ formik, activityType }) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { currentUser } = useLoggedUser();

  const { space, tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { spaces } = space;

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tags.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tags]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const areaOptions = tags.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
    )
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
              autoFocus
              fullWidth
              required
              label='Nome da Atividade'
              type='text'
              name='name'
              inputProps={{ maxLength: 255 }}
              error={!!formik.errors.name}
              helperText={formik.errors.name as string}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='end' style={{ gap: '10px' }}>
              <KeyboardTimePicker
                ampm={false}
                fullWidth
                disabled
                cancelLabel='Cancelar'
                invalidDateMessage='Formato inválido'
                label='Início da Atividade'
                value={formik.values.startTime}
                onChange={(value) => {
                  formik.setFieldValue('startTime', value);

                  if (!value) {
                    formik.setFieldValue('endTime', null);
                    return;
                  }
                  if (formik.values.duration) {
                    const duration =
                      formik.values.duration.hour() * 60 +
                      formik.values.duration.minute();

                    formik.setFieldValue(
                      'endTime',
                      value?.clone().add(duration, 'minutes')
                    );
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <KeyboardTimePicker
              required
              ampm={false}
              fullWidth
              cancelLabel='Cancelar'
              invalidDateMessage='Formato inválido'
              label='Duração da Atividade'
              value={formik.values.duration}
              error={!!formik.errors.duration}
              helperText={formik?.errors?.duration as any}
              onChange={(value) => {
                formik.setFieldValue('duration', value);

                if (formik.values.startTime) {
                  const duration = value?.hour() * 60 + value?.minute();
                  formik.setFieldValue(
                    'endTime',
                    formik.values.startTime?.clone()?.add(duration, 'minutes')
                  );
                }
              }}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <KeyboardTimePicker
              disabled
              ampm={false}
              fullWidth
              cancelLabel='Cancelar'
              label='Fim da Atividade'
              invalidDateMessage='Formato inválido'
              value={formik.values.endTime}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Quantidade de Sessões'
              type='number'
              name='quantity'
              error={!!formik.errors.quantity}
              helperText={formik.errors.quantity as string}
              onChange={formik.handleChange}
              value={formik.values.quantity}
            />
          </Grid>

          {activityType === TYPE_ACTIVITY.ACADEMICA && (
            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  filterSelectedOptions={true}
                  noOptionsText='Sem Opções'
                  options={areaOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  )}
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue('area', newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.area}
                      helperText={formik.errors.area as string}
                      label='Área Acadêmica'
                    />
                  )}
                  value={formik.values.area}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() => handleNewTag(EFatherTag.AREA_ACADEMICA)}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          )}

          <Grid item sm={12} md={6} lg={6}>
            <Autocomplete
              multiple
              disabled
              noOptionsText='Sem Opções'
              filterSelectedOptions={true}
              options={spaces?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              )}
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue('spaces', newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.value === value?.value
              }
              getOptionLabel={(option) => option?.label || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.spaces}
                  helperText={formik.errors.spaces as string}
                  label='Espaço'
                />
              )}
              value={formik.values.spaces}
            />
          </Grid>
          {activityType !== TYPE_ACTIVITY.ACADEMICA && (
            <Grid item sm={12} md={12} lg={12}>
              <TextField
                disabled
                fullWidth
                minRows={2}
                label='Tema'
                type='text'
                name='theme'
                inputProps={{ maxLength: 255 }}
                // @ts-ignore
                error={!!formik?.errors?.theme}
                // @ts-ignore
                helperText={formik?.errors?.theme as string}
                onChange={formik.handleChange}
                value={formik.values.theme}
              />
            </Grid>
          )}
        </Grid>
      </Box>

      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />
    </>
  );
};

export default Info;
