import * as React from 'react';
import { v4 } from 'uuid';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Close, PlusOne, Remove } from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification, useLoggedUser } from '~/hooks';
import AddPerson from '~/components/AddPerson';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IEnvolvedPeopleForm {
  isDetail: boolean;
  index: number;
  errors: any;
  values: any;
  setFieldValue: any;
}

const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm> = ({
  isDetail,
  index,
  values,
  errors,
  setFieldValue,
}) => {
  const [functionOptions, setFunctionOptions] = React.useState<any>({});
  const [valueSetted, setValueSetted] = React.useState(false);
  const [loading, setLoading] = React.useState<any>({});
  const [dialogConflict, setDialogConflict] = React.useState({
    open: false,
    msg: null,
  });
  const [newPerson, setNewPerson] = React.useState({
    open: false,
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { currentUser } = useLoggedUser();

  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { persons } = person;

  React.useEffect(() => {
    if (!valueSetted) {
      let newOptions = {};
      values?.activities?.[index]?.people.map((item, index) => {
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
  }, [values?.activities?.[index]?.people]);

  const handleAddPeople = () => {
    let people = values?.activities?.[index].people || [];

    people.push({
      keyId: v4(),
      person: {},
      function: {},
    });

    setFieldValue(`activities[${index}].people`, people);
  };

  const handleRemovePeople = (keyId) => {
    let people = values?.activities?.[index].people || [];
    people = people?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setFieldValue(`activities[${index}].people`, people);
  };

  const handleChangePerson = (idx, person) => {
    const functions = [];

    if (!person) {
      setFieldValue(`activities[${index}].people[${idx}].person`, {});
      return;
    }

    if (
      values?.activities?.[index].people.some(
        (p) => p?.person?.value === person.value && !p?.deleted
      )
    ) {
      notification.error({
        title: 'Duplicação',
        description: 'A pessoa informada já se encontra cadastrada, verifique!',
      });
      setFieldValue(`activities[${index}].people[${idx}].person`, {});
      return;
    }
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

    setFieldValue(`activities[${index}].people[${idx}].person`, person);
    setFieldValue(`activities[${index}].people[${idx}].function`, {});

    const newOptions = { ...functionOptions };

    newOptions[idx] = functions;
    setFunctionOptions(newOptions);
  };

  const listPeople = values?.activities?.[index]?.people?.filter(
    (e) => !e.deleted
  );

  return (
    <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
      {values?.activities?.[index]?.people?.map((item, i) => {
        if (item.deleted) return;
        return (
          <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
            <Grid item sm={12} md={5} lg={5}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  noOptionsText='Sem Opções'
                  options={persons}
                  disabled={isDetail}
                  filterSelectedOptions={true}
                  value={item.person || {}}
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) => {
                    handleChangePerson(i, newValue);
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
                      error={!!errors?.people?.[i]?.person}
                      // @ts-ignore
                      helperText={errors?.people?.[i]?.person}
                    />
                  )}
                />
                <Tooltip title='Adicionar Pessoa'>
                  <IconButton
                    onClick={() => setNewPerson({ open: true })}
                    disabled={isDetail || !currentUser?.isPlanning}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={functionOptions?.[i] || []}
                filterSelectedOptions={true}
                noOptionsText='Sem Opções'
                getOptionLabel={(option) => option?.label}
                value={item.function}
                disabled={!functionOptions?.[i] || isDetail}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(
                    `activities[${index}].people[${i}].function`,
                    newValue
                  );
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
                    error={!!errors?.people?.[i]?.function}
                    // @ts-ignore
                    helperText={errors?.people?.[i]?.function}
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
              {listPeople?.length &&
                item.keyId === listPeople[listPeople?.length - 1].keyId &&
                !isDetail && (
                  <Add
                    onClick={handleAddPeople}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              {((listPeople?.length && item.keyId !== listPeople[0].keyId) ||
                listPeople?.length > 1) &&
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

      <AddPerson
        open={newPerson.open}
        handleClose={() => setNewPerson({ open: false })}
      />

      <Dialog open={dialogConflict.open}>
        <DialogTitle>
          <Typography
            variant='subtitle1'
            color='secondary'
            style={{ maxWidth: '25rem', fontWeight: 'bold' }}
          >
            Resursos com conflito
            <IconButton
              aria-label='close'
              onClick={() =>
                setDialogConflict({
                  open: false,
                  msg: null,
                })
              }
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>{dialogConflict.msg}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default EnvolvedPeopleForm;
