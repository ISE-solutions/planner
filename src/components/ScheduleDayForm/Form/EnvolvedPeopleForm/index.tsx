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
import { Add, CheckCircle, PlusOne, Remove } from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import { IExceptionOption } from '~/hooks/types';
import * as moment from 'moment';
import AddPerson from '~/components/AddPerson';

interface IEnvolvedPeopleForm {
  errors: any;
  isDetail: boolean;
  isDraft: boolean;
  values: any;
  tags: any[];
  persons: any[];
  setValues: any;
  currentUser?: any;
  setFieldValue: any;
  dictTag: any;
  scheduleId: string;
  setSchedule: (item) => void;
  updateEnvolvedPerson: (
    id: any,
    scheduleId: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
}

const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm> = ({
  tags = [],
  isDetail,
  isDraft,
  values,
  persons = [],
  errors,
  dictTag,
  currentUser,
  setValues,
  setFieldValue,
  scheduleId,
  setSchedule,
  updateEnvolvedPerson,
}) => {
  const [functionOptions, setFunctionOptions] = React.useState<any>({});
  const [valueSetted, setValueSetted] = React.useState(false);
  const [loading, setLoading] = React.useState<any>({});
  const [newPerson, setNewPerson] = React.useState({
    open: false,
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  React.useEffect(() => {
    if (!valueSetted) {
      let newOptions = {};
      values?.people.map((item, index) => {
        if (item.person || item.function) {
          setValueSetted(true);
        }
        const functions = [];

        item?.person?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.forEach((tag) => {
          const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

          if (
            fullTag?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
            )
          ) {
            functions.push(fullTag);
          }
        });

        newOptions[index] = functions;
      });

      setFunctionOptions(newOptions);
    }
  }, [values?.people]);

  const handleAddPeople = () => {
    let people = values.people || [];

    people.push({
      keyId: v4(),
      name: '',
      nameEn: '',
      nameEs: '',
      use: '',
    });

    setValues({ ...values, people });
  };

  const handleRemovePeople = (keyId) => {
    let people = values.people || [];
    people = people?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setValues({ ...values, people });
  };

  const approvePerson = (item, index) => {
    setLoading({ ...loading, [index]: true });
    updateEnvolvedPerson(
      item?.id,
      scheduleId,
      {
        [`${PREFIX}AprovadoPor@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraaprovacao`]: moment().format(),
      },
      {
        onSuccess: (sch) => {
          setLoading({ ...loading, [index]: false });
          setSchedule(sch);
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
    );
  };

  const handleChangePerson = (idx, person) => {
    const functions = [];

    if (!person) {
      setFieldValue(`people[${idx}].person`, {});
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

    setFieldValue(`people[${idx}].person`, person);
    setFieldValue(`people[${idx}].function`, {});

    const newOptions = { ...functionOptions };

    newOptions[idx] = functions;
    setFunctionOptions(newOptions);
  };

  const editPerson = (item, index) => {
    setLoading({ ...loading, [index]: true });
    updateEnvolvedPerson(
      item?.id,
      scheduleId,
      {
        [`${PREFIX}AprovadoPor@odata.bind`]: null,
        [`${PREFIX}datahoraaprovacao`]: null,
      },
      {
        onSuccess: (sch) => {
          setLoading({ ...loading, [index]: false });
          setSchedule(sch);
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
                  options={persons}
                  noOptionsText='Sem Opções'
                  disabled={isDetail || !!item?.[`_${PREFIX}aprovadopor_value`]}
                  filterSelectedOptions={true}
                  value={item.person || {}}
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
                      label='Pessoas'
                      // @ts-ignore
                      error={!!errors?.people?.[index]?.person}
                      // @ts-ignore
                      helperText={errors?.people?.[index]?.person}
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
                          ) : !isDraft ? (
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
                          ) : null}
                        </>
                      )}
                    </Box>
                  </Box>
                )}
              {canApprove(item) &&
                !item?.[`_${PREFIX}aprovadopor_value`] &&
                item?.[`_${PREFIX}pessoa_value`] && (
                  <Box display='flex' justifyContent='flex-end'>
                    {loading[index] ? (
                      <CircularProgress size={15} />
                    ) : !isDraft ? (
                      <Link
                        variant='body2'
                        onClick={() => approvePerson(item, index)}
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Aprovar
                      </Link>
                    ) : null}
                  </Box>
                )}
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                options={functionOptions?.[index] || []}
                disabled={
                  !functionOptions[index] ||
                  isDetail ||
                  !!item?.[`_${PREFIX}aprovadopor_value`]
                }
                filterSelectedOptions={true}
                getOptionLabel={(option) => option?.label}
                value={item.function}
                onChange={(event: any, newValue: string | null) => {
                  setFieldValue(`people[${index}].function`, newValue);
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
    </Box>
  );
};

export default EnvolvedPeopleForm;
