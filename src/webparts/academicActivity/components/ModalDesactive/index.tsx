import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@material-ui/core';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import * as moment from 'moment';
import { Close } from '@material-ui/icons';
import { desactiveActivity } from '~/store/modules/activity/actions';
import { useDispatch } from 'react-redux';

interface IModalDesactiveProps {
  open: boolean;
  academicActivity: any;
  notification: NotificationActionProps;
  handleClose: () => void;
}

const ModalDesactive: React.FC<IModalDesactiveProps> = ({
  open,
  academicActivity,
  notification,
  handleClose,
}) => {
  const DEFAULT_VALUES = {
    type: 'definitivo',
    start: null,
    end: null,
  };

  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    start: yup.mixed().when('type', {
      is: 'temporario',
      then: yup.mixed().required('Campo Obrigatório'),
    }),
    end: yup.mixed().when('type', {
      is: 'temporario',
      then: yup.mixed().required('Campo Obrigatório'),
    }),
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
      description: 'Desativado com sucesso',
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
        desactiveActivity(
          {
            ...values,
            data: academicActivity,
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
        Desativar Atividade Acadêmica
        <IconButton
          aria-label='close'
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={12} lg={12}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Tipo de Desativação</FormLabel>
              <RadioGroup
                aria-label='desativacao'
                name='type'
                value={formik.values.type}
                onChange={formik.handleChange}
              >
                <FormControlLabel
                  value='definitivo'
                  control={<Radio color='primary' />}
                  label='Definitivo'
                />
                <FormControlLabel
                  value='temporario'
                  control={<Radio color='primary' />}
                  label='Temporário'
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {formik.values.type === 'temporario' && (
            <>
              <Grid item sm={12} md={6} lg={6}>
                <KeyboardDatePicker
                  clearable
                  autoOk
                  fullWidth
                  disablePast
                  variant='inline'
                  format='DD/MM/YYYY'
                  label='Data Início de Desativação'
                  error={!!formik.errors.start}
                  helperText={formik.errors.start as string}
                  value={formik.values.start}
                  onChange={(value) => formik.setFieldValue('start', value)}
                />
              </Grid>

              <Grid item sm={12} md={6} lg={6}>
                <KeyboardDatePicker
                  clearable
                  autoOk
                  fullWidth
                  minDate={formik?.values?.start || moment()}
                  variant='inline'
                  format='DD/MM/YYYY'
                  label='Data Final de Desativação'
                  error={!!formik.errors.end}
                  helperText={formik.errors.end as string}
                  value={formik.values.end}
                  onChange={(value) => formik.setFieldValue('end', value)}
                />
              </Grid>
            </>
          )}
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

export default ModalDesactive;
