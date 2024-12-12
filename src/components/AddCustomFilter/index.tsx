import * as React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ETYPE_CUSTOM_FILTER } from '~/config/enums';
import { useDispatch } from 'react-redux';
import { addOrUpdateCustomFilter } from '~/store/modules/customFilter/actions';
import { useLoggedUser, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';

interface IAddCustomFilter {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  filter: any;
  filterSaved?: any;
  type: ETYPE_CUSTOM_FILTER;
}

const AddCustomFilter: React.FC<IAddCustomFilter> = ({
  open,
  filter,
  type,
  filterSaved,
  onClose,
  refetch,
}) => {
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { notification } = useNotification();
  const { currentUser } = useLoggedUser();

  React.useEffect(() => {
    if (filterSaved) {
      formik.setFieldValue('name', filterSaved?.[`${PREFIX}nome`]);
    }
  }, [filterSaved]);

  const handleSuccess = () => {
    setLoading(false);
    refetch?.();
    notification.success({
      title: 'Sucesso',
      description: 'Cadastro realizado com sucesso',
    });

    onClose();
  };

  const handleError = (error) => {
    setLoading(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: yup.object({
      name: yup.mixed().required('Campo Obrigatório'),
    }),
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      setLoading(true);
      dispatch(
        addOrUpdateCustomFilter(
          {
            ...values,
            type,
            id: filterSaved?.[`${PREFIX}filtroid`],
            user: currentUser?.[`${PREFIX}pessoaid`],
            value: filter,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        )
      );
    },
  });

  const handleClose = () => {
    formik.handleReset({});
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={handleClose}>
      <DialogTitle>Salvar Filtro</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          value={formik.values.name}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
          onChange={formik.handleChange}
          margin='dense'
          label='Nome'
          name='name'
          placeholder='Informe o nome do filtro'
          type='text'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant='contained'
          color='primary'
        >
          {loading ? (
            <CircularProgress size={25} style={{ color: '#fff' }} />
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomFilter;
