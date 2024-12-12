import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { Close, PlusOne, Replay } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import * as _ from 'lodash';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import {
  addOrUpdateFiniteInfiniteResource,
  fetchAllFiniteInfiniteResources,
} from '~/store/modules/finiteInfiniteResource/actions';
import AddTag from '../AddTag';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import HelperTooltip from '../HelperTooltip';
import useUndo from '~/hooks/useUndo';

interface IAddFiniteInfiniteResourceProps {
  open: boolean;
  resource?: any;
  handleClose: () => void;
  refetch?: () => void;
  typeResource: TYPE_RESOURCE;
}

const AddFiniteInfiniteResource: React.FC<IAddFiniteInfiniteResourceProps> = ({
  open,
  resource,
  handleClose,
  refetch,
  typeResource,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    limit: 0,
    quantity: 0,
    type: null,
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { currentUser } = useLoggedUser();

  const validationSchema =
    typeResource == TYPE_RESOURCE.FINITO
      ? yup.object({
          name: yup.string().required('Campo Obrigatório'),
          limit: yup.number().min(1, 'Campo Obrigatório'),
          type: yup.mixed().required('Campo Obrigatório'),
          quantity: yup
            .number()
            .min(1, 'Campo Obrigatório')
            .required('Campo Obrigatório'),
        })
      : yup.object({
          name: yup.string().required('Campo Obrigatório'),
          type: yup.mixed().required('Campo Obrigatório'),
        });

  const { confirmation } = useConfirmation();
  const { undo } = useUndo();
  const dispatch = useDispatch();

  const { tag, app } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { tooltips } = app;

  const { notification } = useNotification();

  const tagOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) =>
            e?.[`${PREFIX}nome`] ===
            (typeResource === TYPE_RESOURCE.FINITO
              ? EFatherTag.RECURSO_FINITOS
              : EFatherTag.RECURSO_INFINITOS)
        )
      ),
    [tags, typeResource]
  );

  React.useEffect(() => {
    if (resource) {
      const iniVal = {
        id: resource[`${PREFIX}recursofinitoinfinitoid`],
        name: resource[`${PREFIX}nome`] || '',
        limit: resource[`${PREFIX}limitacao`] || 0,
        quantity: resource[`${PREFIX}quantidade`] || 0,
        type: resource[`${PREFIX}Tipo`]
          ? {
              value: resource[`${PREFIX}Tipo`]?.[`${PREFIX}etiquetaid`],
              label: resource[`${PREFIX}Tipo`]?.[`${PREFIX}nome`],
            }
          : null,
      };

      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));
    }
  }, [resource]);

  const onClose = () => {
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    setPastValues(DEFAULT_VALUES);
    handleClose();
  };

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tags.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tags]
  );

  const handleSuccess = () => {
    setLoading(false);
    refetch?.();
    onClose();

    if (pastValues?.id) {
      undo.open('Deseja desfazer a ação?', () => handleUndo());
    }

    notification.success({
      title: 'Sucesso',
      description: resource
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });
  };

  const handleError = (error) => {
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleUndo = async () => {
    const finiteResourceUndo = JSON.parse(
      localStorage.getItem('undoFiniteResource')
    );

    addOrUpdateFiniteInfiniteResource(
      {
        ...finiteResourceUndo,
        typeResource: typeResource,
      },
      {
        onSuccess: () => {
          refetch?.();
          notification.success({
            title: 'Sucesso',
            description: 'Ação realizada com sucesso',
          });
        },
        onError: () => null,
      }
    );
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      localStorage.setItem('undoFiniteResource', JSON.stringify(pastValues));

      if (resource) {
        addOrUpdateFiniteInfiniteResource(
          {
            ...values,
            id: resource[`${PREFIX}recursofinitoinfinitoid`],
            typeResource: typeResource,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
      } else {
        addOrUpdateFiniteInfiniteResource(
          { ...values, typeResource: typeResource },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
      }
    },
  });

  const handleCheckClose = () => {
    if (!_.isEqualWith(pastValues, formik.values)) {
      confirmation.openConfirmation({
        title: 'Dados não alterados',
        description: 'O que deseja?',
        yesLabel: 'Salvar',
        noLabel: 'Sair sem Salvar',
        onConfirm: () => formik.handleSubmit(),
        onCancel: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleUpdateData = () => {
    dispatch(fetchAllPerson({}));
    dispatch(fetchAllTags({}));
    dispatch(fetchAllSpace({}));
  };

  const resourceTooltip = tooltips.find(
    (tooltip) =>
      tooltip?.Title ===
      (typeResource == TYPE_RESOURCE.FINITO
        ? 'Recurso Finito'
        : 'Recurso Infinito')
  );

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
                {resource
                  ? `Atualizar Recurso ${
                      typeResource == TYPE_RESOURCE.FINITO
                        ? 'Finito'
                        : 'Infinito'
                    }`
                  : `Cadastrar Recurso ${
                      typeResource == TYPE_RESOURCE.FINITO
                        ? 'Finito'
                        : 'Infinito'
                    }`}
                {formik.values.name ? ` - ${formik.values.name}` : ''}
              </Typography>

              <HelperTooltip content={resourceTooltip?.Conteudo} />

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
            {typeResource == TYPE_RESOURCE.FINITO && (
              <Grid item sm={12} md={6} lg={6}>
                <TextField
                  required
                  fullWidth
                  label='Limitação'
                  type='number'
                  name='limit'
                  inputProps={{ maxLength: 255 }}
                  error={!!formik.errors.limit}
                  helperText={formik.errors.limit as string}
                  onChange={formik.handleChange}
                  value={formik.values.limit}
                />
              </Grid>
            )}

            {typeResource == TYPE_RESOURCE.FINITO && (
              <Grid item sm={12} md={6} lg={6}>
                <TextField
                  required
                  fullWidth
                  label='Quantidade'
                  type='number'
                  name='quantity'
                  error={!!formik.errors.quantity}
                  helperText={formik.errors.quantity as string}
                  onChange={formik.handleChange}
                  value={formik.values.quantity}
                />
              </Grid>
            )}

            <Grid item sm={12} md={6} lg={6}>
              <Box display='flex' alignItems='center'>
                <Autocomplete
                  fullWidth
                  options={
                    tagOptions?.filter(
                      (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                    ) || []
                  }
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue('type', newValue);
                  }}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option.label || ''}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      fullWidth
                      error={!!formik.errors.type}
                      helperText={formik.errors.type as string}
                      label='Tipo'
                    />
                  )}
                  value={formik.values.type}
                />
                <Tooltip title='Adicionar Etiqueta'>
                  <IconButton
                    disabled={!currentUser?.isPlanning}
                    onClick={() =>
                      handleNewTag(
                        typeResource == TYPE_RESOURCE.FINITO
                          ? EFatherTag.RECURSO_FINITOS
                          : EFatherTag.RECURSO_INFINITOS
                      )
                    }
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

export default AddFiniteInfiniteResource;
