import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  CircularProgress,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from '@material-ui/core';
import InputMask from 'react-input-mask';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { Close, PlusOne, Replay } from '@material-ui/icons';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import AddTag from '../AddTag';
import { useDispatch, useSelector } from 'react-redux';
import {
  addOrUpdatePerson,
  fetchAllPerson,
  getPerson,
} from '~/store/modules/person/actions';
import { AppState } from '~/store';
import * as _ from 'lodash';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';

interface IAddPersonProps {
  open: boolean;
  person?: any;
  refetch?: any;
  handleClose: () => void;
}

const AddPerson: React.FC<IAddPersonProps> = ({
  open,
  person,
  refetch,
  handleClose,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    favoriteName: '',
    lastName: '',
    email: '',
    emailSecondary: '',
    phone: '',
    school: '',
    title: null,
    areaChief: [],
    tag: [],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const dispatch = useDispatch();
  const { currentUser } = useLoggedUser();
  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { undo } = useUndo();

  const { tag, app } = useSelector((state: AppState) => state);
  const { tagsActive: tags, dictTag } = tag;
  const { tooltips } = app;

  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
    lastName: yup.string().required('Campo Obrigatório'),
    email: yup.string().email('E-mail inválido').required('Campo Obrigatório'),
    emailSecondary: yup.string().email('E-mail inválido'),
  });

  const schoolOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.ESCOLA_ORIGEM
        )
      ),
    [tags]
  );

  const functionOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const titleOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TITULO
        )
      ),
    [tags]
  );

  const areaOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
        )
      ),
    [tags]
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  React.useEffect(() => {
    if (person) {
      const iniVal = {
        id: person[`${PREFIX}pessoaid`],
        name: person[`${PREFIX}nome`] || '',
        lastName: person[`${PREFIX}sobrenome`] || '',
        favoriteName: person[`${PREFIX}nomepreferido`] || '',
        email: person[`${PREFIX}email`] || '',
        emailSecondary: person[`${PREFIX}emailsecundario`] || '',
        phone: person[`${PREFIX}celular`] || '',
        school: dictTag[person?.[`_${PREFIX}escolaorigem_value`]],
        areaChief: person[`${PREFIX}Pessoa_AreaResponsavel`]?.length
          ? person[`${PREFIX}Pessoa_AreaResponsavel`]?.map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
        title: person[`${PREFIX}Titulo`]
          ? {
              value:
                person[`${PREFIX}Titulo`]?.[`${PREFIX}categoriaetiquetaid`],
              label: person[`${PREFIX}Titulo`]?.[`${PREFIX}nome`],
            }
          : null,
        tag: person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.length
          ? person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
      };
      setInitialValues(iniVal);
      setPastValues(iniVal);
    }
  }, [person]);

  const onClose = () => {
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    setPastValues(DEFAULT_VALUES);
    handleClose();
    dispatch(fetchAllPerson({ active: 'Ativo' }));
  };

  const handleSuccess = () => {
    onClose();
    setLoading(false);
    if (pastValues?.id) {
      undo.open('Deseja desfazer a ação?', () => handleUndo());
    }

    notification.success({
      title: 'Sucesso',
      description: person
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });

    // @ts-ignore
    if (formik.values.close) {
      onClose?.();
    }
  };

  const handleError = (error) => {
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tags.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tags]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  const handleUndo = async () => {
    const personUndo = JSON.parse(localStorage.getItem('undoPerson'));

    dispatch(
      addOrUpdatePerson(
        {
          ...personUndo,
          previousTag: personUndo.tag,
        },
        {
          onSuccess: (spc) => {
            refetch?.();
            notification.success({
              title: 'Sucesso',
              description: 'Ação realizada com sucesso',
            });
          },
          onError: () => null,
        }
      )
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const personExists = await getPerson(values.email, 'main');
      const personExistsSecEmail = await getPerson(
        values.emailSecondary,
        'secondary'
      );

      if (
        personExists?.length &&
        (!person?.[`${PREFIX}pessoaid`] ||
          person?.[`${PREFIX}pessoaid`] !==
            personExists[0][`${PREFIX}pessoaid`])
      ) {
        notification.error({
          title: 'Pessoa duplicada',
          description: `Já existe uma pessoa registrada com o email principal ${values.email}`,
        });
        setLoading(false);
      } else if (
        personExistsSecEmail?.length &&
        (!person?.[`${PREFIX}pessoaid`] ||
          person?.[`${PREFIX}pessoaid`] !==
            personExistsSecEmail[0][`${PREFIX}pessoaid`])
      ) {
        notification.error({
          title: 'Pessoa duplicada',
          description: `Já existe uma pessoa registrada com o email secundário ${values.emailSecondary}`,
        });
        setLoading(false);
      } else {
        localStorage.setItem('undoPerson', JSON.stringify(pastValues));

        if (person) {
          const areaChiefToDelete = person?.[
            `${PREFIX}Pessoa_AreaResponsavel`
          ]?.filter(
            (e) =>
              !person.areaChief?.some(
                (sp) => sp.value === e[`${PREFIX}etiquetaid`]
              )
          );

          dispatch(
            addOrUpdatePerson(
              {
                ...values,
                areaChiefToDelete,
                id: person[`${PREFIX}pessoaid`],
                previousTag: person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
              },
              {
                onSuccess: handleSuccess,
                onError: handleError,
              }
            )
          );
        } else {
          dispatch(
            addOrUpdatePerson(values, {
              onSuccess: handleSuccess,
              onError: handleError,
            })
          );
        }
      }
    },
  });

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
        onCancel: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleUpdateData = () => {
    dispatch(fetchAllTags({}));
    dispatch(fetchAllSpace({}));
  };

  const personTooltip = tooltips.find((tooltip) => tooltip?.Title === 'Pessoa');

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='md'
        fullWidth
        disableBackdropClick
      >
        <DialogTitle style={{ paddingBottom: 0 }}>
          <Box>
            <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
              <Typography
                variant='h6'
                color='textPrimary'
                style={{ fontWeight: 'bold', maxWidth: '48rem' }}
              >
                {person ? 'Atualizar Pessoa' : 'Cadastrar Pessoa'}
                {formik.values.name
                  ? ` - ${formik.values.name} ${formik.values.lastName}`
                  : ''}
              </Typography>

              <HelperTooltip content={personTooltip?.Conteudo} />

              <Tooltip title='Atualizar'>
                <IconButton onClick={handleUpdateData}>
                  <Replay />
                </IconButton>
              </Tooltip>
            </Box>

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
          <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
            <Grid item sm={12} md={12} lg={12}>
              <TextField
                required
                autoFocus
                fullWidth
                label='Nome'
                type='text'
                name='name'
                inputProps={{ maxLength: 255 }}
                error={!!formik.errors.name}
                helperText={formik.errors.name as string}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <TextField
                required
                fullWidth
                label='Sobrenome'
                type='text'
                name='lastName'
                inputProps={{ maxLength: 255 }}
                error={!!formik.errors.lastName}
                helperText={formik.errors.lastName as string}
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label='Nome Preferido'
                type='text'
                name='favoriteName'
                inputProps={{ maxLength: 255 }}
                error={!!formik.errors.favoriteName}
                helperText={formik.errors.favoriteName as string}
                onChange={formik.handleChange}
                value={formik.values.favoriteName}
              />
            </Grid>

            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  noOptionsText='Sem Opções'
                  options={titleOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  )}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue('title', newValue);
                  }}
                  getOptionLabel={(option) => option.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.title}
                      helperText={formik.errors.title as string}
                      label='Título'
                    />
                  )}
                  value={formik.values.title}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() => handleNewTag(EFatherTag.TITULO)}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item sm={12} md={6} lg={6}>
              <InputMask
                mask='(99) 99999-9999'
                maskPlaceholder={' '}
                value={formik.values.phone}
                onChange={formik.handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label='Telefone Celular (WhatsApp)'
                    type='text'
                    name='phone'
                    error={!!formik.errors.phone}
                    helperText={formik.errors.phone as string}
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                  />
                )}
              </InputMask>
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <TextField
                required
                fullWidth
                label='E-mail'
                type='email'
                name='email'
                inputProps={{ maxLength: 100 }}
                error={!!formik.errors.email}
                helperText={formik.errors.email as string}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label='E-mail Secundário'
                type='email'
                name='emailSecondary'
                inputProps={{ maxLength: 100 }}
                error={!!formik.errors.emailSecondary}
                helperText={formik.errors.emailSecondary as string}
                onChange={formik.handleChange}
                value={formik.values.emailSecondary}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  noOptionsText='Sem Opções'
                  filterSelectedOptions={true}
                  options={schoolOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  )}
                  value={formik.values.school}
                  onChange={(event: any, newValue: any[]) =>
                    formik.setFieldValue('school', newValue)
                  }
                  getOptionSelected={(option: any, item: any) =>
                    option?.value === item?.value
                  }
                  getOptionLabel={(option: any) => option?.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Escola de Origem'
                      error={!!formik.errors.school}
                      helperText={formik.errors.school as string}
                    />
                  )}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() => handleNewTag(EFatherTag.ESCOLA_ORIGEM)}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  multiple
                  fullWidth
                  noOptionsText='Sem Opções'
                  filterSelectedOptions={true}
                  options={functionOptions}
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue('tag', newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.tag}
                      helperText={formik.errors.tag as string}
                      label='Etiqueta(s)'
                    />
                  )}
                  value={formik.values.tag}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() => handleNewTag(EFatherTag.FUNCAO)}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  multiple
                  filterSelectedOptions={true}
                  noOptionsText='Sem Opções'
                  options={areaOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  )}
                  onChange={(event: any, newValue: any[]) => {
                    formik.setFieldValue('areaChief', newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!formik.errors.areaChief}
                      helperText={formik.errors.areaChief as string}
                      label='Chefe de Departamento'
                    />
                  )}
                  value={formik.values.areaChief}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() => handleNewTag(EFatherTag.AREA_ACADEMICA)}
                  >
                    <PlusOne />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='primary'>
            Cancelar
          </Button>
          <Button
            onClick={() => !loading && formik.handleSubmit()}
            variant='contained'
            color='primary'
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />
    </>
  );
};

export default AddPerson;
