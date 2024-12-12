import * as React from 'react';
import * as _ from 'lodash';
import { Box, Grid, TextField } from '@material-ui/core';
import { v4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IEnvolvedPersonProps {
  formik: any;
}

const EnvolvedPerson: React.FC<IEnvolvedPersonProps> = ({ formik }) => {
  const [functionOptions, setFunctionOptions] = React.useState<any>({});
  const [valueSetted, setValueSetted] = React.useState(false);

  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { persons } = person;

  React.useEffect(() => {
    if (!valueSetted) {
      let newOptions = {};
      formik.values?.people.map((item, index) => {
        if (item.person || item.function) {
          setValueSetted(true);
        }
        const functions = [];

        if (item.function) {
          item?.person?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.forEach(
            (tag) => {
              const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

              if (
                fullTag?.[`${PREFIX}Etiqueta_Pai`]?.some(
                  (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
                )
              ) {
                functions.push(fullTag);
              }
            }
          );
        }

        newOptions[index] = functions;
      });

      setFunctionOptions(newOptions);
    }
  }, [formik.values?.people]);

  const handleAddPerson = () => {
    let people = formik.values.people || [];

    people.push({
      keyId: v4(),
      person: null,
      function: null,
    });

    formik.setFieldValue('people', people);
  };

  const handleRemovePerson = (keyId) => {
    let people = formik.values.people || [];
    people = people?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    formik.setFieldValue('people', people);
  };

  const handleChangePerson = (idx, person) => {
    const functions = [];

    formik.setFieldValue(`people[${idx}].person`, person);

    if (!formik.values?.people?.[idx].isRequired) {
      person?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.forEach((tag) => {
        const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

        if (
          fullTag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          )
        ) {
          functions.push(fullTag);
        }
      });

      formik.setFieldValue(`people[${idx}].function`, {});
      const newOptions = { ...functionOptions };
      newOptions[idx] = functions;
      setFunctionOptions(newOptions);
    }
  };

  const listPeople = formik.values?.people?.filter((e) => !e.deleted);

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        {(formik.values.people || [])?.map((item, index) => {
          if (item.deleted) return;
          return (
            <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
              <Grid item sm={12} md={5} lg={5}>
                <Autocomplete
                  options={persons || []}
                  noOptionsText='Sem Opções'
                  filterSelectedOptions={true}
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) => {
                    handleChangePerson(index, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Pessoa'
                      // @ts-ignore
                      error={!!formik.errors?.people?.[index]?.person}
                      // @ts-ignore
                      helperText={formik.errors?.people?.[index]?.person}
                    />
                  )}
                  value={formik.values?.people?.[index]?.person}
                />
              </Grid>

              <Grid item sm={12} md={5} lg={5}>
                <Autocomplete
                  options={functionOptions?.[index] || []}
                  filterSelectedOptions={true}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue(`people[${index}].function`, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Função'
                      // @ts-ignore
                      error={!!formik.errors?.people?.[index]?.function}
                      // @ts-ignore
                      helperText={formik.errors?.people?.[index]?.function}
                    />
                  )}
                  value={formik.values?.people?.[index]?.function}
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
                {listPeople.length &&
                  item.keyId === listPeople[listPeople.length - 1].keyId && (
                    <Add
                      onClick={handleAddPerson}
                      style={{ color: '#333', cursor: 'pointer' }}
                    />
                  )}
                {((listPeople.length && item.keyId !== listPeople[0].keyId) ||
                  listPeople.length > 1) && (
                  <Remove
                    onClick={() => handleRemovePerson(item.keyId)}
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

export default EnvolvedPerson;
