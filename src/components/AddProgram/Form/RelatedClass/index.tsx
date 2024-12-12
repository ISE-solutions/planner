import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';

interface IRelatedClassForm {
  errors: any;
  program: any;
  isDetail: boolean;
  values: any;
  handleChange: any;
  setValues: any;
  teams: any[];
  setFieldValue: any;
}

const RelatedClassForm: React.FC<IRelatedClassForm> = ({
  values,
  errors,
  program,
  isDetail,
  setValues,
  teams,
  handleChange,
  setFieldValue,
}) => {
  const handleAddTeam = () => {
    let relatedClass = values.relatedClass || [];

    relatedClass.push({
      keyId: v4(),
      team: null,
      relatedTeam: null,
    });

    setValues({ ...values, relatedClass });
  };

  const handleRemoveTeam = (keyId) => {
    let relatedClass = values.relatedClass || [];
    relatedClass = relatedClass?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setValues({ ...values, relatedClass });
  };

  const listTeam = values?.relatedClass?.filter((e) => !e.deleted);
  const ownTeams = program?.[`${PREFIX}Programa_Turma`];

  return (
    <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
      {(values.relatedClass || []).map((item, index) => {
        if (item.deleted) return;
        return (
          <Grid
            container
            spacing={3}
            key={item.keyId}
            style={{ margin: 0, width: '100%' }}
          >
            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={ownTeams || []}
                disabled={isDetail}
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`relatedClass[${index}].team`, newValue);
                }}
                defaultValue={item?.team}
                value={item?.team}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Turma'
                    // @ts-ignore
                    error={!!errors?.relatedClass?.[index]?.team}
                    // @ts-ignore
                    helperText={errors?.relatedClass?.[index]?.team}
                  />
                )}
              />
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={teams || []}
                disabled={isDetail}
                noOptionsText='Sem Opções'
                getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                getOptionSelected={(option, value) =>
                  option?.[`${PREFIX}nome`] === value?.[`${PREFIX}nome`]
                }
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`relatedClass[${index}].relatedTeam`, newValue);
                }}
                value={item?.relatedTeam}
                defaultValue={item?.team}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Turma Relacionada'
                    // @ts-ignore
                    error={!!errors?.relatedClass?.[index]?.relatedTeam}
                    // @ts-ignore
                    helperText={errors?.relatedClass?.[index]?.relatedTeam}
                  />
                )}
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
              {listTeam?.length &&
                item.keyId === listTeam[0].keyId &&
                !isDetail && (
                  <Add
                    onClick={handleAddTeam}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              {((listTeam?.length &&
                item.keyId !== listTeam[0].keyId &&
                !isDetail) ||
                listTeam?.length > 1) &&
                !isDetail && (
                  <Remove
                    onClick={() => handleRemoveTeam(item.keyId)}
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

export default RelatedClassForm;
