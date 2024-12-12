import * as React from 'react';
import * as moment from 'moment';
import { v4 } from 'uuid';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
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
  Close,
  PlusOne,
  Remove,
} from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import checkConflictDate from '~/utils/checkConflictDate';
import AddPerson from '~/components/AddPerson';
import {
  getActivity,
  updateEnvolvedPerson,
} from '~/store/modules/activity/actions';
import { getResources } from '~/store/modules/resource/actions';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IEnvolvedPeopleForm {
  canEdit: boolean;
  isDetail: boolean;
  isModel: boolean;
  errors: any;
  values: any;
  activity: any;
  setValues: any;
  setFieldValue: any;
  currentUser: any;
  detailApproved: boolean;
  setActivity: (item) => void;
}

const EnvolvedPeopleForm: React.FC<IEnvolvedPeopleForm> = ({
  canEdit,
  isDetail,
  isModel,
  values,
  errors,
  activity,
  setValues,
  setFieldValue,
  currentUser,
  detailApproved,
  setActivity,
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

  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { persons } = person;

  React.useEffect(() => {
    if (!valueSetted) {
      let newOptions = {};
      values?.people.map((item, index) => {
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
  }, [values?.people]);

  const checkPersonConflicts = async (item: any, resources: any[]) => {
    const datesAppointment = [
      moment(activity?.[`${PREFIX}datahorainicio`]),
      moment(activity?.[`${PREFIX}datahorafim`]),
    ] as [moment.Moment, moment.Moment];

    const conflicts = [];
    for (let i = 0; i < resources.length; i++) {
      const res = resources[i];

      const datesResource = [
        moment(res?.[`${PREFIX}inicio`]),
        moment(res?.[`${PREFIX}fim`]),
      ] as [moment.Moment, moment.Moment];

      if (checkConflictDate(datesAppointment, datesResource)) {
        const activityRequest = await getActivity(
          res?.[`${PREFIX}Atividade`]?.[`${PREFIX}atividadeid`]
        );
        const actv = activityRequest.value[0];
        const envolvedPerson = actv?.[
          `${PREFIX}Atividade_PessoasEnvolvidas`
        ]?.find(
          (e) =>
            e?.[`_${PREFIX}pessoa_value`] === item?.[`_${PREFIX}pessoa_value`]
        );

        if (envolvedPerson?.[`_${PREFIX}aprovadopor_value`]) {
          conflicts.push(res);
        }
      }
    }

    return conflicts;
  };

  const approvePerson = async (item, index) => {
    setLoading({ ...loading, [index]: true });

    const filterQuery = {
      dayDate: moment(activity[`${PREFIX}datahorainicio`]),
      people: [
        {
          value: item?.[`_${PREFIX}pessoa_value`],
        },
      ],
    };

    const resConflictRequest = await getResources(filterQuery);
    const conflicts = await checkPersonConflicts(
      item,
      resConflictRequest?.value
    );

    if (conflicts.length) {
      setLoading(false);

      setDialogConflict({
        open: true,
        msg: (
          <div>
            <Typography>As seguintes pessoas possui conflitos:</Typography>
            <ul>
              {conflicts?.map((conflict) => (
                <li key={conflict?.[`${PREFIX}Pessoa`]?.[`${PREFIX}nome`]}>
                  <Box display='flex' style={{ gap: '10px' }}>
                    <strong>
                      {conflict?.[`${PREFIX}Pessoa`]?.[`${PREFIX}nome`]}
                    </strong>
                    <span>
                      {conflict?.[`${PREFIX}Programa`]?.[`${PREFIX}titulo`]}
                      {' - '}
                      {conflict?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]}
                    </span>
                  </Box>
                </li>
              ))}
            </ul>
          </div>
        ),
      });
      return;
    }

    updateEnvolvedPerson(
      item[`${PREFIX}pessoasenvolvidasatividadeid`],
      activity.id || activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}AprovadoPor@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}datahoraaprovacao`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setLoading({ ...loading, [index]: false });
          setActivity(act);
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

  const editPerson = (item, index) => {
    setLoading({ ...loading, [index]: true });
    updateEnvolvedPerson(
      item[`${PREFIX}pessoasenvolvidasatividadeid`],
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}AprovadoPor@odata.bind`]: null,
        [`${PREFIX}datahoraaprovacao`]: null,
      },
      {
        onSuccess: (act) => {
          setLoading({ ...loading, [index]: false });
          setActivity(act);
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

  const handleAddPeople = () => {
    let people = values.people || [];

    people.push({
      keyId: v4(),
      person: {},
      function: {},
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

  const handleChangePerson = (idx, person) => {
    const functions = [];

    if (!person) {
      setFieldValue(`people[${idx}].person`, {});
      return;
    }

    if (
      values.people.some(
        (p) => p?.person?.value === person.value && !p?.deleted
      )
    ) {
      notification.error({
        title: 'Duplicação',
        description: 'A pessoa informada já se encontra cadastrada, verifique!',
      });
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
                  noOptionsText='Sem Opções'
                  options={persons}
                  disabled={
                    !!item?.[`_${PREFIX}aprovadopor_value`] ||
                    !canEdit ||
                    isDetail
                  }
                  filterSelectedOptions={true}
                  value={item.person}
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
                      error={!!errors?.people?.[index]?.person}
                      // @ts-ignore
                      helperText={errors?.people?.[index]?.person}
                    />
                  )}
                />
                <Tooltip title='Adicionar Pessoa'>
                  <IconButton
                    onClick={() => setNewPerson({ open: true })}
                    disabled={!canEdit || isDetail || !currentUser?.isPlanning}
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
                          ) : canEdit && !isDetail ? (
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

              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  {item?.function?.needApprove &&
                    !isModel &&
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
                  item?.[`_${PREFIX}pessoa_value`] && (
                    <Box display='flex' justifyContent='flex-end'>
                      {loading[index] ? (
                        <CircularProgress size={15} />
                      ) : canEdit && !isDetail ? (
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
              </Box>
            </Grid>

            <Grid item sm={12} md={5} lg={5}>
              <Autocomplete
                options={functionOptions?.[index] || []}
                filterSelectedOptions={true}
                noOptionsText='Sem Opções'
                getOptionLabel={(option) => option?.label}
                value={item.function}
                disabled={
                  !functionOptions?.[index] ||
                  !!item?.[`_${PREFIX}aprovadopor_value`] ||
                  !canEdit ||
                  isDetail
                }
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
                !detailApproved &&
                canEdit &&
                !isDetail && (
                  <Add
                    onClick={handleAddPeople}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              {((listPeople.length && item.keyId !== listPeople[0].keyId) ||
                listPeople.length > 1) &&
                !detailApproved &&
                canEdit &&
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
