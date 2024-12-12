import * as React from 'react';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import * as yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  Grid,
  DialogContent,
  TextField,
  DialogTitle,
  Typography,
  IconButton,
  DialogActions,
} from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { EDeliveryType, EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { useFormik } from 'formik';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { Autocomplete } from '@material-ui/lab';
import { Add, Close, Remove } from '@material-ui/icons';
import ModalMoodle from '~/components/ModalMoodle';
import { useConfirmation, useNotification } from '~/hooks';

interface IModalForm {
  detailApproved: boolean;
  canEdit: boolean;
  open: boolean;
  setFieldValue: any;
  academicRequest: any;
  onClose: () => void;
  onSave: (item) => void;
}

const ModalForm: React.FC<IModalForm> = ({
  open,
  onClose,
  onSave,
  detailApproved,
  canEdit,
  academicRequest,
  setFieldValue,
}) => {
  const DEFAULT_VALUES = {
    keyId: v4(),
    description: '',
    delivery: null,
    deliveryDate: null,
    deadline: 0,
    link: '',
    nomemoodle: '',
    other: '',
    observation: '',
    equipments: [],
    finiteResource: [],
    infiniteResource: [],
    people: [
      {
        keyId: v4(),
        deleted: false,
        person: null,
        function: null,
      },
    ],
  };

  const [personOption, setPersonOption] = React.useState<any>({});
  const [searchInMoodle, setSearchInMoodle] = React.useState(false);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);

  React.useEffect(() => {
    if (academicRequest) {
      setInitialValues(_.cloneDeep(academicRequest));
      setPastValues(_.cloneDeep(academicRequest));
    }
  }, [academicRequest]);

  const validationSchema = yup.object({
    description: yup.string().required('Campo Obrigatório'),
    link: yup
      .string()
      .nullable()
      .matches(
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
        'Insira uma URL válida'
      ),
    deadline: yup
      .number()
      .min(0, 'Informe um número maior ou igual a zero')
      .required('Campo Obrigatório'),
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const { tag, person, finiteInfiniteResource } = useSelector(
    (state: AppState) => state
  );
  const { tags } = tag;
  const { persons } = person;
  const { finiteInfiniteResources } = finiteInfiniteResource;

  const equipmentsOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.EQUIPAMENTO_OUTROS
    )
  );

  const finiteResources = finiteInfiniteResources?.filter(
    (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
  );

  const infiniteResources = finiteInfiniteResources?.filter(
    (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSave(values);
      formik.resetForm({});
    },
  });

  const handleAddPeople = () => {
    let people = formik.values.people || [];

    people.push({
      keyId: v4(),
      deleted: false,
      person: null,
      function: null,
    });

    formik.setFieldValue('people', people);
  };

  const handleRemovePeople = (keyId) => {
    let people = formik.values.people || [];
    people = people?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    formik.setFieldValue('people', people);
  };

  const handleAddMoodleDocument = React.useCallback((doc) => {
    formik.setFieldValue('link', doc.contenturl);
    formik.setFieldValue('nomemoodle', doc.content_name);
    setSearchInMoodle(false);
    notification.success({
      title: 'Sucesso',
      description: 'Documento adicionado com sucesso!',
    });
  }, []);

  const handleCheckClose = () => {
    if (!_.isEqualWith(pastValues, formik.values)) {
      confirmation.openConfirmation({
        title: 'Dados não alterados',
        description: 'O que deseja?',
        yesLabel: 'Salvar e sair',
        noLabel: 'Sair sem Salvar',
        onConfirm: () => {
          formik.setFieldValue('close', true);
          formik.handleSubmit();
        },
        onCancel: () => {
          onClose();
          formik.resetForm({});
          setInitialValues(DEFAULT_VALUES);
          setPastValues(DEFAULT_VALUES);
        },
      });
    } else {
      onClose();
      formik.resetForm({});
      setInitialValues(DEFAULT_VALUES);
      setPastValues(DEFAULT_VALUES);
    }
  };

  const functionOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      ),
    [tags]
  );

  const peopleOptions = React.useMemo(
    () =>
      persons?.map((person) => ({
        ...person,
        value: person?.[`${PREFIX}pessoaid`],
        label: person?.[`${PREFIX}nome`] + ' ' + person?.[`${PREFIX}sobrenome`],
      })),
    [persons]
  );

  const listPeople = formik.values?.people?.filter((e) => !e.deleted);

  return (
    <>
      <ModalMoodle
        open={searchInMoodle}
        onAdd={handleAddMoodleDocument}
        onClose={() => setSearchInMoodle(false)}
      />
      <Dialog open={open} maxWidth='md' fullWidth disableBackdropClick>
        <DialogTitle style={{ paddingBottom: 0 }}>
          <Box>
            <Typography
              variant='h6'
              color='textPrimary'
              style={{ fontWeight: 'bold' }}
            >
              {tag?.[`${PREFIX}etiquetaid`]
                ? 'Editar Requisição acadêmica'
                : 'Cadastrar Requisição acadêmica'}
            </Typography>
            <IconButton
              aria-label='close'
              onClick={handleCheckClose}
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            overflow='hidden auto'
            maxHeight='25rem'
            minHeight='9rem'
            flexGrow={1}
          >
            <Grid container spacing={3} alignItems='center'>
              <Grid
                container
                spacing={3}
                sm={12}
                md={12}
                lg={12}
                style={{ margin: 0 }}
              >
                <Grid item sm={12} md={12} lg={12}>
                  <TextField
                    autoFocus
                    fullWidth
                    label='Descrição do Pedido'
                    type='text'
                    name='description'
                    disabled={detailApproved || !canEdit}
                    inputProps={{ maxLength: 255 }}
                    error={!!formik.errors.description}
                    helperText={formik.errors.description as string}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  />
                </Grid>

                <Grid item sm={12} md={4} lg={4}>
                  <KeyboardDateTimePicker
                    ampm={false}
                    fullWidth
                    variant='inline'
                    format='DD/MM/YYYY HH:mm'
                    disabled={detailApproved || !canEdit}
                    invalidDateMessage='Formato inválido'
                    label='Data de entrega'
                    value={formik.values.deliveryDate}
                    onChange={(value) => {
                      formik.setFieldValue('deliveryDate', value);
                    }}
                  />
                </Grid>

                <Grid item sm={12} md={4} lg={4}>
                  <Autocomplete
                    options={Object.keys(EDeliveryType) || []}
                    getOptionLabel={(option) => EDeliveryType[option]}
                    onChange={(event: any, newValue: string | null) => {
                      formik.setFieldValue(`delivery`, newValue);
                    }}
                    noOptionsText='Sem Opções'
                    disabled={detailApproved || !canEdit}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label='Momento Entrega'
                        // @ts-ignore
                        error={!!formik.errors?.delivery}
                        // @ts-ignore
                        helperText={formik.errors?.delivery as string}
                      />
                    )}
                    value={formik.values?.delivery}
                  />
                </Grid>

                <Grid item sm={12} md={4} lg={4}>
                  <TextField
                    fullWidth
                    label='Prazo Mínimo'
                    type='number'
                    name='deadline'
                    disabled={detailApproved || !canEdit}
                    inputProps={{ maxLength: 100 }}
                    error={!!formik.errors.deadline}
                    helperText={formik.errors.deadline as string}
                    onChange={formik.handleChange}
                    value={formik.values.deadline}
                  />
                </Grid>

                <Grid item sm={12}>
                  <Grid item sm={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 2000 }}
                      label='Observação'
                      type='text'
                      name='observation'
                      onChange={formik.handleChange}
                      value={formik.values.observation}
                    />
                  </Grid>
                </Grid>

                <Grid item sm={12} md={8} lg={8}>
                  <TextField
                    fullWidth
                    label='Link'
                    type='url'
                    name='link'
                    disabled={detailApproved || !canEdit}
                    inputProps={{ maxLength: 255 }}
                    error={!!formik.errors.link}
                    helperText={formik.errors.link as string}
                    onChange={formik.handleChange}
                    value={formik.values.link}
                  />
                </Grid>

                <Grid item sm={12} md={4} lg={4}>
                  <Button
                    onClick={() => setSearchInMoodle(true)}
                    disabled={!canEdit}
                    variant='contained'
                    color='primary'
                  >
                    Buscar Moodle
                  </Button>
                </Grid>
              </Grid>

              <Grid item sm={12} md={6} lg={6}>
                <Autocomplete
                  multiple
                  filterSelectedOptions={true}
                  disabled={detailApproved || !canEdit}
                  noOptionsText='Sem Opções'
                  options={
                    equipmentsOptions?.filter(
                      (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                    ) || []
                  }
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue(`equipments`, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  value={formik.values?.equipments}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name='equipments'
                      label='Equipamentos/Outros'
                      // @ts-ignore
                      error={!!formik.errors?.equipments}
                      // @ts-ignore
                      helperText={formik.errors?.equipments as string}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={12} md={6} lg={6}>
                <Autocomplete
                  multiple
                  noOptionsText='Sem Opções'
                  filterSelectedOptions={true}
                  disabled={detailApproved || !canEdit}
                  options={
                    finiteResources?.filter(
                      (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                    ) || []
                  }
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue(`finiteResource`, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.[`${PREFIX}recursofinitoinfinitoid`] ===
                    value?.[`${PREFIX}recursofinitoinfinitoid`]
                  }
                  getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                  value={formik.values?.finiteResource || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name='finiteResource'
                      label='Recurso Finito'
                      // @ts-ignore
                      error={!!formik.errors?.finiteResource}
                      // @ts-ignore
                      helperText={formik.errors?.finiteResource as string}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={12} md={6} lg={6}>
                <Autocomplete
                  multiple
                  noOptionsText='Sem Opções'
                  filterSelectedOptions={true}
                  disabled={detailApproved || !canEdit}
                  options={
                    infiniteResources?.filter(
                      (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                    ) || []
                  }
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue(`infiniteResource`, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.[`${PREFIX}recursofinitoinfinitoid`] ===
                    value?.[`${PREFIX}recursofinitoinfinitoid`]
                  }
                  getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                  value={formik.values?.infiniteResource || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name='infiniteResource'
                      label='Recurso Infinito'
                      // @ts-ignore
                      error={!!formik.errors?.infiniteResource}
                      // @ts-ignore
                      helperText={formik.errors?.infiniteResource as string}
                    />
                  )}
                />
              </Grid>

              <Grid item sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label='Outro'
                  type='text'
                  name='other'
                  disabled={detailApproved || !canEdit}
                  inputProps={{ maxLength: 255 }}
                  error={!!formik.errors.other}
                  helperText={formik.errors.other as string}
                  onChange={formik.handleChange}
                  value={formik.values.other}
                />
              </Grid>

              <Grid item sm={12} md={12} lg={12} style={{ padding: 0 }}>
                <Box overflow='hidden auto' maxHeight='25rem' flexGrow={1}>
                  {formik.values?.people?.map((item, index) => {
                    if (item.deleted) return;
                    return (
                      <Grid
                        container
                        spacing={3}
                        style={{ margin: 0, width: '100%' }}
                      >
                        <Grid item sm={12} md={5} lg={5}>
                          <Autocomplete
                            options={
                              functionOptions?.filter(
                                (e) =>
                                  !e?.[`${PREFIX}excluido`] &&
                                  e[`${PREFIX}ativo`]
                              ) || []
                            }
                            noOptionsText='Sem Opções'
                            filterSelectedOptions={true}
                            getOptionLabel={(option) => option?.label}
                            value={item.function || []}
                            disabled={detailApproved || !canEdit}
                            onChange={(event: any, newValue: string | null) => {
                              formik.setFieldValue(
                                `people[${index}].function`,
                                newValue
                              );

                              const peoples = peopleOptions?.filter(
                                (pers) =>
                                  pers?.[`${PREFIX}ativo`] &&
                                  !pers?.[`${PREFIX}excluido`] &&
                                  pers?.[
                                    `${PREFIX}Pessoa_Etiqueta_Etiqueta`
                                  ]?.some(
                                    (ta) =>
                                      ta?.[`${PREFIX}etiquetaid`] ===
                                      newValue?.[`${PREFIX}etiquetaid`]
                                  )
                              );

                              const newOptions = { ...personOption };

                              newOptions[index] = peoples;
                              setPersonOption(newOptions);
                            }}
                            getOptionSelected={(option, value) =>
                              option?.value === value?.value
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                label='Função'
                                error={
                                  // @ts-ignore
                                  !!formik?.errors?.people?.[index]?.function
                                }
                                helperText={
                                  // @ts-ignore
                                  formik?.errors?.people?.[index]?.function
                                }
                              />
                            )}
                          />
                        </Grid>

                        <Grid item sm={12} md={5} lg={5}>
                          <Autocomplete
                            options={personOption?.[index] || []}
                            disabled={
                              !personOption[index] || detailApproved || !canEdit
                            }
                            noOptionsText='Sem Opções'
                            filterSelectedOptions={true}
                            value={item.person}
                            getOptionLabel={(option) => option?.label}
                            onChange={(event: any, newValue: string | null) => {
                              formik.setFieldValue(
                                `people[${index}].person`,
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
                                label='Pessoa'
                                error={
                                  // @ts-ignore
                                  !!formik?.errors?.people?.[index]?.person
                                }
                                helperText={
                                  // @ts-ignore
                                  formik?.errors?.people?.[index]?.person
                                }
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
                            item.keyId ===
                              listPeople[listPeople.length - 1].keyId &&
                            !detailApproved &&
                            canEdit && (
                              <Add
                                onClick={handleAddPeople}
                                style={{ color: '#333', cursor: 'pointer' }}
                              />
                            )}
                          {((listPeople.length &&
                            item.keyId !== listPeople[0].keyId) ||
                            listPeople.length > 1) &&
                            !detailApproved &&
                            canEdit && (
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
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box
            display='flex'
            width='100%'
            alignItems='center'
            justifyContent='flex-end'
          >
            <Box style={{ gap: '10px' }} mt={2} display='flex' alignItems='end'>
              <Button color='primary' onClick={handleCheckClose}>
                Cancelar
              </Button>
              <Button
                variant='contained'
                color='primary'
                disabled={detailApproved || !canEdit}
                onClick={() => formik.handleSubmit()}
              >
                Salvar
                {/* {isEditing ? 'Salvar' : 'Adicionar'} */}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalForm;
