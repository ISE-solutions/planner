import * as React from 'react';
import { v4 } from 'uuid';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Delete, Remove } from '@material-ui/icons';
import { EFatherTag, EUso } from '~/config/enums';
import { AppState } from '~/store';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';

interface IFantasyNameForm {
  errors: any;
  isDetail: boolean;
  values: any;
  handleChange: any;
  setValues: any;
  setFieldValue: any;
}

const FantasyNameForm: React.FC<IFantasyNameForm> = ({
  values,
  errors,
  isDetail,
  setValues,
  handleChange,
  setFieldValue,
}) => {
  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const handleAddName = () => {
    let names = values.names || [];

    names.push({
      keyId: v4(),
      name: '',
      nameEn: '',
      nameEs: '',
      use: '',
    });

    setFieldValue('names', names);
  };

  const handleRemoveName = (keyId) => {
    let names = values.names || [];
    names = names?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setFieldValue('names', names);
  };

  const listName = values?.names?.filter((e) => !e.deleted);

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

  return (
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
      {listName.length && !isDetail && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddName}
          startIcon={<Add />}
        >
          Adicionar
        </Button>
      )}
      {(values.names || []).map((item, index) => {
        if (item.deleted) return;
        return (
          <Paper style={{ width: '100%', position: 'relative' }} elevation={3}>
            <Box>
              {((listName.length && item.keyId !== listName[0].keyId) ||
                listName.length > 1) &&
                !isDetail && (
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
                  disabled={isDetail}
                  name={`names[${index}].name`}
                  inputProps={{ maxLength: 255 }}
                  // @ts-ignore
                  error={!!errors?.names?.[index]?.name}
                  // @ts-ignore
                  helperText={errors?.names?.[index]?.name}
                  onChange={handleChange}
                  value={values.names?.[index]?.name}
                />
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label='Nome (EN)'
                  type='text'
                  disabled={isDetail}
                  inputProps={{ maxLength: 255 }}
                  name={`names[${index}].nameEn`}
                  onChange={handleChange}
                  value={values.names[index]?.nameEn}
                />
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label='Nome (ES)'
                  type='text'
                  disabled={isDetail}
                  inputProps={{ maxLength: 255 }}
                  name={`names[${index}].nameEs`}
                  onChange={handleChange}
                  value={values.names?.[index]?.nameEs}
                />
              </Grid>

              <Grid item sm={12} md={12} lg={12}>
                <Autocomplete
                  options={useOptions}
                  disabled={isDetail}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option.label}
                  onChange={(event: any, newValue: string | null) => {
                    setFieldValue(`names[${index}].use`, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Uso'
                      // @ts-ignore
                      error={!!errors?.names?.[index]?.use}
                      // @ts-ignore
                      helperText={errors?.names?.[index]?.use}
                    />
                  )}
                  value={values?.names?.[index]?.use}
                />
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </Box>
  );
};

export default FantasyNameForm;
