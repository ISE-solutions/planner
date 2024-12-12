import * as React from 'react';
import { v4 } from 'uuid';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  AccessTime,
  Add,
  CheckCircle,
  PlusOne,
  Remove,
} from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import * as moment from 'moment';
import AddPerson from '~/components/AddPerson';
import { useDispatch } from 'react-redux';
import { updateEnvolvedPerson } from '~/store/modules/program/actions';

interface IEnvolvedPeopleForm {
  isModel: boolean;
  isDetail: boolean;
  isDraft: boolean;
  errors: any;
  values: any;
  dictTag: any;
  tags: any[];
  persons: any[];
  setValues: any;
  setFieldValue: any;
  currentUser: any;
  programId: string;
  setProgram: (item) => void;
}

const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm> = ({
  isDetail,
  isDraft,
  isModel,
  tags = [],
  values,
  persons = [],
  errors,
  dictTag,
  currentUser,
  programId,
  setProgram,
  setValues,
  setFieldValue,
}) => {
  const [functionOptions, setFunctionOptions] = React.useState<any>({});
  const [peopleOptions, setPeopleOptions] = React.useState<any>({});
  const [valueSetted, setValueSetted] = React.useState(false);
  const [loading, setLoading] = React.useState<any>({});
  const [newPerson, setNewPerson] = React.useState({
    open: false,
  });

  const dispatch = useDispatch();

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  React.useEffect(() => {
    if (!valueSetted) {
      let newOptionsFunction = {};
      let newOptionsPeople = {};

      values?.people.map((item, index) => {
        if (item.person || item.function) {
          // setValueSetted(true);
        }
        const functions = [];

        if (item?.isRequired) {
          const peoples = persons.filter(
            (pers) =>
              !pers?.[`${PREFIX}excluido`] &&
              pers?.[`${PREFIX}ativo`] &&
              pers?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
                (ta) =>
                  ta?.[`${PREFIX}etiquetaid`] ===
                  item?.function?.[`${PREFIX}etiquetaid`]
              )
          );

          newOptionsPeople[index] = peoples;
        } else {
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

        newOptionsFunction[index] = functions;
      });

      setFunctionOptions(newOptionsFunction);
      setPeopleOptions(newOptionsPeople);
    }
  }, [values?.people, persons, tags]);

  const handleAddPeople = () => {
    let people = values.people || [];

    people.push({
      keyId: v4(),
      person: null,
      function: null,
    });

    setFieldValue('people', people);
  };

  const handleRemovePeople = (keyId) => {
    let people = values.people || [];
    people = people?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setFieldValue('people', people);
  };

  const approvePerson = (item, index) => {
    setLoading({ ...loading, [index]: true });
    dispatch(
      updateEnvolvedPerson(
        item?.id,
        programId,
        {
          [`${PREFIX}AprovadoPor@odata.bind`]: `/${PERSON}(${
            currentUser?.[`${PREFIX}pessoaid`]
          })`,
          [`${PREFIX}datahoraaprovacao`]: moment().format(),
        },
        {
          onSuccess: (sch) => {
            setLoading({ ...loading, [index]: false });
            setProgram(sch);
            notification.success({
              title: 'Sucesso',
              description: 'Atualização realizada com sucesso',
            });
          },
          onError: (err) => {
            setLoading({ ...loading, [index]: false });
            notification.error({
              title: 'Falha',
              description: err?.data?.error?.message,
            });
          },
        }
      )
    );
  };

  const editPerson = (item, index) => {
    setLoading({ ...loading, [index]: true });
    dispatch(
      updateEnvolvedPerson(
        item?.id,
        programId,
        {
          [`${PREFIX}AprovadoPor@odata.bind`]: null,
          [`${PREFIX}datahoraaprovacao`]: null,
        },
        {
          onSuccess: (sch) => {
            setLoading({ ...loading, [index]: false });
            setProgram(sch);
            notification.success({
              title: 'Sucesso',
              description: 'Atualização realizada com sucesso',
            });
          },
          onError: (err) => {
            setLoading({ ...loading, [index]: false });
            notification.error({
              title: 'Falha',
              description: err?.data?.error?.message,
            });
          },
        }
      )
    );
  };

  const handleEditPerson = (item, index) => {
    confirmation.openConfirmation({
      onConfirm: () => editPerson(item, index),
      title: 'Confirmação',
      description:
        'Ao confirmar a pessoa irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
    });
  };

  const canApprove = (envolvedPerson) => {
    // IS TEACHER AND IS AREA CHIEF
    if (
      (envolvedPerson?.function?.needApprove &&
        envolvedPerson?.function?.[`${PREFIX}nome`] === EFatherTag.PROFESSOR) ||
      envolvedPerson?.function?.[`${PREFIX}Etiqueta_Pai`]?.some(
        (fatherTag) => fatherTag?.[`${PREFIX}nome`] === EFatherTag.PROFESSOR
      )
    ) {
      return currentUser?.isAreaChief;
    }

    // NEED APPROVE AND CURRENT USER IS FROM PLANNING
    if (envolvedPerson?.function?.needApprove) {
      return currentUser?.isPlanning;
    }
  };

  const handleChangePerson = (idx, person) => {
    const functions = [];

    setFieldValue(`people[${idx}].person`, person);

    if (!values?.people?.[idx].isRequired) {
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

      setFieldValue(`people[${idx}].function`, {});
      const newOptions = { ...functionOptions };
      newOptions[idx] = functions;
      setFunctionOptions(newOptions);
    }
  };

  const listPeople = values?.people?.filter((e) => !e.deleted);

  return (
    <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
      {values?.people?.map((item, index) => {
        if (item.deleted) return;
        return (
          <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
            <Grid item sm={12} md={5} lg={5}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  noOptionsText='Sem Opções'
                  options={peopleOptions?.[index] || persons}
                  disabled={isDetail}
                  filterSelectedOptions={true}
                  value={item.person}
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) =>
                    handleChangePerson(index, newValue)
                  }
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Pessoa'
                      // @ts-ignore
                      error={!!errors?.people?.[index]?.person}
                      // @ts-ignore
                      helperText={errors?.people?.[index]?.person}
                    />
                  )}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    onClick={() => setNewPerson({ open: true })}
                    disabled={isDetail || !currentUser?.isPlanning}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
              {item?.function?.needApprove &&
                item?.[`_${PREFIX}aprovadopor_value`] && (
                  <Box display='flex' justifyContent='space-between'>
                    <Box
                      display='flex'
                      alignItems='center'
                      style={{ gap: '10px' }}
                    >
                      <CheckCircle
                        fontSize='small'
                        style={{ color: '#35bb5a' }}
                      />
                      <Typography
                        variant='body2'
                        color='primary'
                        style={{ fontWeight: 'bold' }}
                      >
                        Aprovado
                      </Typography>
                    </Box>

                    <Box display='flex' justifyContent='space-between'>
                      {canApprove(item) && (
                        <>
                          {loading[index] ? (
                            <CircularProgress size={15} />
                          ) : (
                            <Link
                              variant='body2'
                              onClick={() => handleEditPerson(item, index)}
                              style={{
                                fontWeight: 'bold',
                                cursor: 'pointer',
                              }}
                            >
                              Editar
                            </Link>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                )}
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  {item?.function?.needApprove &&
                    !isModel &&
                    !isDraft &&
                    !item?.[`_${PREFIX}aprovadopor_value`] && (
                      <>
                        <AccessTime fontSize='small' />
                        <Typography
                          variant='body2'
                          style={{ fontWeight: 'bold' }}
                        >
                          Pendente Aprovação
                        </Typography>
                      </>
                    )}
                </Box>
                {canApprove(item) &&
                  !item?.[`_${PREFIX}aprovadopor_value`] &&
                  item?.[`_${PREFIX}pessoa_value`] &&
                  !isDraft && (
                    <Box display='flex' justifyContent='flex-end'>
                      {loading[index] ? (
                        <CircularProgress size={15} />
                      ) : (
                        <Link
                          variant='body2'
                          onClick={() => approvePerson(item, index)}
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Aprovar
                        </Link>
                      )}
                    </Box>
                  )}
              </Box>
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={functionOptions?.[index] || []}
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                disabled={
                  item?.isRequired || !functionOptions[index] || isDetail
                }
                getOptionLabel={(option) => option?.[`${PREFIX}nome`]}
                value={item.function}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`people[${index}].function`, newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.[`${PREFIX}etiquetaid`] ===
                  value?.[`${PREFIX}etiquetaid`]
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label='Função'
                    // @ts-ignore
                    error={!!errors?.people?.[index]?.function}
                    // @ts-ignore
                    helperText={errors?.people?.[index]?.function}
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
              {listPeople.length &&
                item.keyId === listPeople[listPeople.length - 1].keyId &&
                !isDetail && (
                  <Add
                    onClick={handleAddPeople}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              {((listPeople.length &&
                item.keyId !== listPeople[0].keyId &&
                !isDetail) ||
                listPeople.length > 1) &&
                !isDetail &&
                !item?.isRequired && (
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
    </Box>
  );
};

export default EnvolvedPeopleForm;
