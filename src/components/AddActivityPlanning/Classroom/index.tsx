import * as React from 'react';
import * as _ from 'lodash';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { PlusOne } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { AppState } from '~/store';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import AddTag from '~/components/AddTag';
interface IClassroomProps {
  formik: any;
}

const Classroom: React.FC<IClassroomProps> = ({ formik }) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;

  const courseOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.COURSE
    )
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

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

  return (
    <>
      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />

      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              disabled
              autoFocus
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
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              inputProps={{ maxLength: 2000 }}
              label='Descrição/Objetivo da sessão'
              type='text'
              name='description'
              onChange={formik.handleChange}
              value={formik.values.description}
              // @ts-ignore
              error={!!formik?.errors?.description}
              // @ts-ignore
              helperText={formik?.errors?.description as string}
            />
          </Grid>

          <Grid item sm={12} md={12} lg={12}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                options={courseOptions}
                onChange={(event: any, newValue: any[]) => {
                  formik.setFieldValue('course', newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                getOptionLabel={(option) => option?.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formik.errors.course}
                    helperText={formik.errors.course as string}
                    label='Curso'
                  />
                )}
                value={formik.values.course}
              />
              <Tooltip title='Adicionar Curso'>
                <IconButton onClick={() => handleNewTag(EFatherTag.COURSE)}>
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Classroom;
