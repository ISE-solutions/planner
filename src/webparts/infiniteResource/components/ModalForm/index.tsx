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
  Typography,
  Box,
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { IExceptionOption } from '~/hooks/types';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import getKeyEnum from '~/utils/getKeyEnum';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import * as _ from 'lodash';
import { useConfirmation } from '~/hooks';

interface IModalFormProps {
  open: boolean;
  postLoading: boolean;
  resource?: any;
  notification: NotificationActionProps;
  addOrUpdateInfiniteResource: (resource, options?: IExceptionOption) => void;
  handleClose: () => void;
}

const ModalForm: React.FC<IModalFormProps> = ({
  open,
  resource,
  postLoading,
  notification,
  handleClose,
  addOrUpdateInfiniteResource,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    type: null,
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>(DEFAULT_VALUES);
  const validationSchema = yup.object({
    name: yup.string().required('Campo Obrigatório'),
    type: yup.mixed().required('Campo Obrigatório'),
  });

  const { confirmation } = useConfirmation();
  const { tag } = useSelector((state: AppState) => state);
  const { tags } = tag;

  const tagOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.RECURSO_INFINITOS
        )
      ),
    [tags]
  );

  React.useEffect(() => {
    if (resource) {
      setInitialValues({
        name: resource[`${PREFIX}nome`] || '',
        type: resource[`${PREFIX}Tipo`]
          ? {
              value: resource[`${PREFIX}Tipo`]?.[`${PREFIX}etiquetaid`],
              label: resource[`${PREFIX}Tipo`]?.[`${PREFIX}nome`],
            }
          : null,
      });
    }
  }, [resource]);

  const onClose = () => {
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    handleClose();
  };

  const handleSuccess = () => {
    onClose();
    notification.success({
      title: 'Sucesso',
      description: resource
        ? 'Atualizado com sucesso'
        : 'Cadastro realizado com sucesso',
    });
  };

  const handleError = (error) => {
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (resource) {
        addOrUpdateInfiniteResource(
          {
            ...values,
            id: resource[`${PREFIX}recursofinitoinfinitoid`],
            typeResource: TYPE_RESOURCE.INFINITO,
            previousTag: resource[`${PREFIX}Pessoa_Etiqueta_Etiqueta`],
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
      } else {
        addOrUpdateInfiniteResource(
          { ...values, typeResource: TYPE_RESOURCE.INFINITO },
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      disableBackdropClick
    >
      <DialogTitle style={{ paddingBottom: 0 }}>
        <Box>
          <Typography
            variant='h6'
            color='textPrimary'
            style={{ fontWeight: 'bold' }}
          >
            {resource
              ? 'Atualizar Recurso Infinito'
              : 'Cadastrar Recurso Infinito'}
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
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={6} lg={6}>
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
            <Autocomplete
              options={tagOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              )}
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancelar
        </Button>
        <Button
          onClick={() => !postLoading && formik.handleSubmit()}
          variant='contained'
          color='primary'
        >
          {postLoading ? (
            <CircularProgress size={20} style={{ color: '#fff' }} />
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalForm;
