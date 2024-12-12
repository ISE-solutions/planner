import * as React from 'react';
import * as _ from 'lodash';
import { Box, Grid, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Anexos from '~/components/Anexos';
import { PREFIX } from '~/config/database';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { PlusOne } from '@material-ui/icons';
import { AddTag } from '~/components';
import AddProperty from './AddProperty';
import { useLoggedUser } from '~/hooks';

interface IInfoProps {
  refAnexo: any;
  formik: any;
}

const Info: React.FC<IInfoProps> = ({ formik, refAnexo }) => {
  const [openAddProperty, setOpenAddProperty] = React.useState(false);
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { currentUser } = useLoggedUser();
  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { personsActive, loading } = person;

  const ownerOptions = React.useMemo(
    () =>
      personsActive?.filter((tag) =>
        tag?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
          (tag) => tag?.[`${PREFIX}nome`] == ETypeTag.PROPRIETARIO
        )
      ),
    [personsActive]
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tags.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tags]
  );

  const typeSpaceOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_ESPACO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  return (
    <>
      <AddProperty
        open={openAddProperty}
        onAddProperty={(e) => console.log(e)}
        onClose={() => setOpenAddProperty(false)}
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
              required
              autoFocus
              fullWidth
              label='Nome'
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
            <TextField
              fullWidth
              label='E-mail'
              type='email'
              name='email'
              inputProps={{ maxLength: 255 }}
              error={!!formik.errors.email}
              helperText={formik.errors.email as string}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                multiple
                filterSelectedOptions={true}
                options={typeSpaceOptions}
                noOptionsText='Sem Opções'
                onChange={(event: any, newValue: any[]) => {
                  formik.setFieldValue('tags', newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                getOptionLabel={(option) => option?.label || ''}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    fullWidth
                    error={!!formik.errors.tags}
                    helperText={formik.errors.tags as string}
                    label='Etiqueta(s)'
                  />
                )}
                value={formik.values.tags}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={!currentUser?.isPlanning}
                  onClick={() => handleNewTag(EFatherTag.TIPO_ESPACO)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                loading={loading}
                filterSelectedOptions={true}
                options={ownerOptions?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                )}
                onChange={(event: any, newValue: any[]) => {
                  formik.setFieldValue('owner', newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                noOptionsText='Sem Opções'
                getOptionLabel={(option) => option?.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!formik.errors.owner}
                    helperText={formik.errors.owner as string}
                    label='Proprietário'
                  />
                )}
                value={formik.values.owner}
              />
              <Tooltip title='Adicionar Proprietário'>
                <IconButton
                  disabled={!currentUser?.isPlanning}
                  onClick={() => setOpenAddProperty(true)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        <Box marginTop={'1rem'}>
          <Anexos ref={refAnexo} anexos={formik.values.anexos} />
        </Box>
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
