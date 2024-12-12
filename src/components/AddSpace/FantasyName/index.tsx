import * as React from 'react';
import * as _ from 'lodash';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, EUso } from '~/config/enums';
import { Add, Delete } from '@material-ui/icons';
import { AppState } from '~/store';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';

interface IFantasyNameProps {
  formik: any;
}

const FantasyName: React.FC<IFantasyNameProps> = ({ formik }) => {
  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const handleAddName = () => {
    let names = formik.values.names || [];

    names.push({
      keyId: v4(),
      name: '',
      nameEn: '',
      nameEs: '',
      use: '',
    });

    formik.setFieldValue('names', names);
  };

  const handleRemoveName = (keyId) => {
    let names = formik.values.names || [];
    names = names?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    formik.setFieldValue('names', names);
  };

  const useOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.USO_RELATORIO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const listName = formik.values?.names?.filter((e) => !e.deleted);
  return (
    <>
      <Box
        overflow='hidden auto'
        display='flex'
        alignItems='flex-start'
        flexDirection='column'
        style={{ gap: '10px' }}
        padding='.5rem'
        maxHeight='25rem'
        flexGrow={1}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddName}
          startIcon={<Add />}
        >
          Adicionar
        </Button>

        {(formik.values.names || [])?.map((item, index) => {
          if (item.deleted) return;
          return (
            <Paper
              style={{ width: '100%', position: 'relative' }}
              elevation={3}
            >
              <Box>
                {listName.length > 1 && (
                  <Box position='absolute' right='10px'>
                    <IconButton onClick={() => handleRemoveName(item.keyId)}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Grid
                container
                spacing={3}
                style={{ margin: 0, paddingTop: '20px', width: '100%' }}
              >
                <Grid item sm={12} md={12} lg={12}>
                  <TextField
                    autoFocus
                    fullWidth
                    label='Nome (PT)'
                    type='text'
                    name={`names[${index}].name`}
                    inputProps={{ maxLength: 255 }}
                    // @ts-ignore
                    error={!!formik?.errors?.names?.[index]?.name}
                    // @ts-ignore
                    helperText={formik?.errors?.names?.[index]?.name}
                    onChange={formik.handleChange}
                    value={formik.values.names?.[index]?.name}
                  />
                </Grid>
                <Grid item sm={12} md={12} lg={12}>
                  <TextField
                    fullWidth
                    label='Nome (EN)'
                    type='text'
                    inputProps={{ maxLength: 255 }}
                    name={`names[${index}].nameEn`}
                    onChange={formik.handleChange}
                    value={formik.values.names[index]?.nameEn}
                  />
                </Grid>
                <Grid item sm={12} md={12} lg={12}>
                  <TextField
                    fullWidth
                    label='Nome (ES)'
                    type='text'
                    inputProps={{ maxLength: 255 }}
                    name={`names[${index}].nameEs`}
                    onChange={formik.handleChange}
                    value={formik.values.names?.[index]?.nameEs}
                  />
                </Grid>

                <Grid item sm={12} md={12} lg={12}>
                  <Autocomplete
                    options={useOptions}
                    noOptionsText='Sem Opções'
                    getOptionLabel={(option) => option.label}
                    onChange={(event: any, newValue: string | null) => {
                      formik.setFieldValue(`names[${index}].use`, newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label='Uso'
                        // @ts-ignore
                        error={!!formik.errors?.names?.[index]?.use}
                        // @ts-ignore
                        helperText={formik.errors?.names?.[index]?.use}
                      />
                    )}
                    value={formik.values?.names?.[index]?.use}
                  />
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Box>
    </>
  );
};

export default FantasyName;
