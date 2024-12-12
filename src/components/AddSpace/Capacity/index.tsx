import * as React from 'react';
import * as _ from 'lodash';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, EUso } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { PREFIX } from '~/config/database';

interface ICapacityProps {
  formik: any;
}

const Capacity: React.FC<ICapacityProps> = ({ formik }) => {
  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const handleAddCapacity = () => {
    let capacities = formik.values.capacities || [];

    capacities.push({
      keyId: v4(),
      quantity: 0,
      use: '',
    });

    formik.setFieldValue('capacities', capacities);
  };

  const handleRemoveCapacity = (keyId) => {
    let capacities = formik.values.capacities || [];
    capacities = capacities?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    formik.setFieldValue('capacities', capacities);
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

  const listCapacities = formik.values?.capacities?.filter((e) => !e.deleted);

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        {(formik.values.capacities || [])?.map((item, index) => {
          if (item.deleted) return;
          return (
            <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
              <Grid item sm={12} md={5} lg={5}>
                <TextField
                  fullWidth
                  label='Quantidade'
                  type='number'
                  name={`capacities[${index}].quantity`}
                  onChange={formik.handleChange}
                  // @ts-ignore
                  error={!!formik.errors?.capacities?.[index]?.quantity}
                  // @ts-ignore
                  helperText={formik.errors?.capacities?.[index]?.quantity}
                  value={formik.values.capacities?.[index]?.quantity}
                />
              </Grid>

              <Grid item sm={12} md={5} lg={5}>
                <Autocomplete
                  options={useOptions}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option.label}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue(`capacities[${index}].use`, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Uso'
                      // @ts-ignore
                      error={!!formik.errors?.capacities?.[index]?.use}
                      // @ts-ignore
                      helperText={formik.errors?.capacities?.[index]?.use}
                    />
                  )}
                  value={formik.values?.capacities?.[index]?.use}
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
                {listCapacities?.length &&
                  item.keyId ===
                    listCapacities[listCapacities?.length - 1].keyId && (
                    <Add
                      onClick={handleAddCapacity}
                      style={{ color: '#333', cursor: 'pointer' }}
                    />
                  )}
                {listCapacities?.length &&
                  item.keyId !== listCapacities[0].keyId && (
                    <Remove
                      onClick={() => handleRemoveCapacity(item.keyId)}
                      style={{ color: '#333', cursor: 'pointer' }}
                    />
                  )}
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </>
  );
};

export default Capacity;
