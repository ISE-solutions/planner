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
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { Close } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { bulkUpdateTag } from '~/store/modules/tag/actions';

interface IModalBulkEditProps {
  open: boolean;
  tags: any[];
  notification: NotificationActionProps;
  handleClose: () => void;
}

const ModalBulkEdit: React.FC<IModalBulkEditProps> = ({
  open,
  tags,
  notification,
  handleClose,
}) => {
  const DEFAULT_VALUES = {
    school: '',
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const validationSchema = yup.object({
    school: yup.string().required('Campo Obrigatório'),
  });

  const onClose = () => {
    formik.handleReset(DEFAULT_VALUES);
    setInitialValues(DEFAULT_VALUES);
    handleClose();
  };

  const handleSuccess = () => {
    onClose();
    setLoading(false);
    notification.success({
      title: 'Sucesso',
      description: 'Atualizado(s) com sucesso',
    });
  };

  const handleError = (error) => {
    setLoading(false);
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
      setLoading(true);

      dispatch(
        bulkUpdateTag(
          {
            ...values,
            data: tags,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        )
      );
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Atualizar Etiqueta(s)
        <DialogTitle>
          <IconButton
            aria-label='close'
            onClick={onClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Escola de origem'
              type='text'
              name='school'
              inputProps={{ maxLength: 255 }}
              error={!!formik.errors.school}
              helperText={formik.errors.school as string}
              onChange={formik.handleChange}
              value={formik.values.school}
            />
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
  );
};

export default ModalBulkEdit;