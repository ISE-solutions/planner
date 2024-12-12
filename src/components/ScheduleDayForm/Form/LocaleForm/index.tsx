import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';

interface ILocaleForm {
  errors: any;
  isDetail: boolean;
  values: any;
  spaceOptions: any[];
  handleChange: any;
  setValues: any;
  setFieldValue: any;
}

const LocaleForm: React.FC<ILocaleForm> = ({
  isDetail,
  values,
  spaceOptions,
  handleChange,
  errors,
  setValues,
  setFieldValue,
}) => {
  const handleAddPeople = () => {
    let locale = values.locale || [];

    locale.push({
      keyId: v4(),
      space: null,
      observation: '',
    });

    setValues({ ...values, locale });
  };

  const handleRemovePeople = (keyId) => {
    let locale = values.locale || [];
    locale = locale?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setValues({ ...values, locale });
  };

  const listLocale = values?.locale?.filter((e) => !e.deleted);

  return (
    <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
      {values?.locale?.map((item, index) => {
        if (item.deleted) return;
        return (
          <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={
                  spaceOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  ) || []
                }
                disabled={isDetail}
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                getOptionLabel={(option) => option?.label}
                value={item.space}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`locale[${index}].space`, newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Espaço'
                    // @ts-ignore
                    error={!!errors?.locale?.[index]?.space}
                    // @ts-ignore
                    helperText={errors?.locale?.[index]?.space}
                  />
                )}
              />
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <TextField
                fullWidth
                label='Observação'
                type='text'
                name={`locale[${index}].observation`}
                disabled={isDetail}
                inputProps={{ maxLength: 200 }}
                error={!!errors.linkBackup}
                helperText={errors.linkBackup}
                onChange={handleChange}
                value={item.observation}
              />
            </Grid>

            <Grid
              item
              lg={1}
              md={1}
              sm={1}
              xs={1}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 25,
              }}
              justify='center'
            >
              {index === 0 && !isDetail && (
                <Add
                  onClick={handleAddPeople}
                  style={{ color: '#333', cursor: 'pointer' }}
                />
              )}
              {((index !== 0 && !isDetail) || listLocale.length > 1) &&
                !isDetail && (
                  <Remove
                    onClick={() => handleRemovePeople(item.keyId)}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

export default LocaleForm;
