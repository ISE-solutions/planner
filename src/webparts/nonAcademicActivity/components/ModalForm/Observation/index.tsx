import * as React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import * as _ from 'lodash';
import 'react-quill/dist/quill.snow.css';
import { useFormik } from 'formik';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { PREFIX } from '~/config/database';
import { useConfirmation } from '~/hooks';
import { addOrUpdateObservation } from '~/store/modules/activity/actions';

interface IObservationProps {
  academicActivity: any;
  onClose: () => void;
  tempTab: any;
  tab: number;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
  notification: NotificationActionProps;
}

const Observation: React.FC<IObservationProps> = ({
  academicActivity,
  onClose,
  tab,
  tempTab,
  handleEdit,
  onResetTempTab,
  handleChangeIndex,
  notification,
}) => {
  const DEFAULT_VALUES = {
    description: '',
  };
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const { confirmation } = useConfirmation();

  React.useEffect(() => {
    if (academicActivity && tab !== tempTab) {
      if (!_.isEqualWith(pastValues, formik.values)) {
        confirmation.openConfirmation({
          title: 'Dados não alterados',
          description: 'O que deseja?',
          yesLabel: 'Salvar',
          noLabel: 'Sair sem Salvar',
          onConfirm: async () => {
            formik.validateForm().then((values) => {
              if (!Object.keys(values).length) {
                formik
                  .submitForm()
                  .then(() => {
                    confirmation.closeConfirmation();
                    handleChangeIndex();
                  })
                  .catch(() => {
                    confirmation.closeConfirmation();
                    onResetTempTab();
                  });
              } else {
                onResetTempTab();
              }
            });
          },
          onCancel: () => {
            handleChangeIndex();
          },
        });
      } else {
        handleChangeIndex();
      }
    }
  }, [tempTab]);

  React.useEffect(() => {
    if (academicActivity) {
      const initVal = {
        description: academicActivity[`${PREFIX}observacao`],
      };

      setInitialValues(initVal);
      setPastValues(initVal);
    }
  }, [academicActivity]);

  const handleSuccess = (item) => {
    handleEdit(item);
    setLoading(false);

    notification.success({
      title: 'Sucesso',
      description: academicActivity
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

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      await addOrUpdateObservation(
        {
          ...values,
          id: academicActivity[`${PREFIX}atividadeid`],
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );
    },
  });

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <FormControl fullWidth>
          <TextField
            fullWidth
            multiline
            minRows={3}
            inputProps={{ maxLength: 2000 }}
            type='text'
            name='description'
            onChange={(nextValue) =>
              formik.setFieldValue('description', nextValue.target.value)
            }
            value={formik.values.description}
          />
          <FormHelperText>
            {formik?.values?.description?.length || 0}/2000
          </FormHelperText>
        </FormControl>
      </Box>

      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Button variant='outlined' onClick={onClose}>
          Fechar
        </Button>
        <Box style={{ gap: '10px' }} mt={2} display='flex' alignItems='end'>
          <Button color='primary' onClick={onClose}>
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
        </Box>
      </Box>
    </>
  );
};

export default Observation;
