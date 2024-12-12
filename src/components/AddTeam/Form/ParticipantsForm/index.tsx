import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EFatherTag, EUso } from '~/config/enums';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { PREFIX } from '~/config/database';

interface IParticipantsForm {
  isDetail?: boolean;
  errors: any;
  values: any;
  handleChange: any;
  setValues: any;
  setFieldValue: any;
}

const ParticipantsForm: React.FC<IParticipantsForm> = ({
  values,
  isDetail,
  errors,
  setValues,
  handleChange,
  setFieldValue,
}) => {
  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;

  const handleAddParticipant = () => {
    let participants = values.participants || [];

    participants.push({
      keyId: v4(),
      date: null,
      quantity: 0,
      use: '',
    });

    setValues({ ...values, participants });
  };

  const handleRemoveParticipant = (keyId) => {
    let participants = values.participants || [];
    participants = participants?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setValues({ ...values, participants });
  };

  const useOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.USO_PARTICIPANTE
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const listParticipant = values?.participants?.filter((e) => !e.deleted);

  return (
    <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
      {values?.participants?.map((item, index) => {
        if (item.deleted) return;
        return (
          <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
            <Grid item sm={12} md={4} lg={4}>
              <KeyboardDatePicker
                clearable
                autoOk
                fullWidth
                variant='inline'
                format='DD/MM/YYYY'
                disabled={isDetail}
                InputLabelProps={{
                  style: {
                    fontSize: '15px',
                  },
                }}
                label='Data Limite de Preenchimento'
                // @ts-ignore
                error={!!errors?.participants?.[index]?.date}
                // @ts-ignore
                helperText={errors?.participants?.[index]?.date}
                value={item.date}
                onChange={(value) =>
                  setFieldValue(`participants[${index}].date`, value)
                }
              />
            </Grid>

            <Grid item sm={12} md={4} lg={4}>
              <TextField
                fullWidth
                disabled={isDetail}
                label='Quantidade Prevista'
                type='number'
                name={`participants[${index}].quantity`}
                onChange={handleChange}
                value={item.quantity || ''}
                // @ts-ignore
                error={!!errors?.participants?.[index]?.quantity}
                // @ts-ignore
                helperText={errors?.participants?.[index]?.quantity}
              />
            </Grid>

            <Grid item sm={12} md={3} lg={3}>
              <Autocomplete
                options={useOptions}
                disabled={isDetail}
                noOptionsText='Sem Opções'
                getOptionLabel={(option) => option.label}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`participants[${index}].use`, newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Uso'
                    // @ts-ignore
                    error={!!errors?.participants?.[index]?.use}
                    // @ts-ignore
                    helperText={errors?.participants?.[index]?.use}
                  />
                )}
                value={values?.participants?.[index]?.use}
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
              {listParticipant.length &&
                item.keyId === listParticipant[0].keyId &&
                !isDetail && (
                  <Add
                    onClick={handleAddParticipant}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              {((listParticipant.length &&
                item.keyId !== listParticipant[0].keyId) ||
                listParticipant.length > 1) &&
                !isDetail && (
                  <Remove
                    onClick={() => handleRemoveParticipant(item.keyId)}
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

export default ParticipantsForm;
