import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@material-ui/core';
import { v4 } from 'uuid';

import * as moment from 'moment';
import * as React from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useFormik } from 'formik';
import { Done, Close } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { addOrUpdateDelivery } from '~/store/modules/delivery/actions';
import * as _ from 'lodash';
import { useNotification } from '~/hooks';

interface DeliveryFormProps {
  open: boolean;
  nextDelivery: number;
  delivery: any;
  setDelivery: React.Dispatch<any>;
  teamId: string;
  onClose: () => void;
  daysAvailable: any[];
  allDays: any[];
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  open,
  teamId,
  setDelivery,
  nextDelivery,
  onClose,
  allDays,
  daysAvailable,
  delivery,
}) => {
  const DEFAULT_VALUES = React.useMemo(
    () => ({
      title: `Entrega ${nextDelivery}`,
      finalGrid: moment(),
      outlines: moment(),
      times: moment(),
      approval: moment(),
      moodleFolder: moment(),
      checkMoodle: moment(),
      days: [],
    }),
    [nextDelivery]
  );

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [loading, setLoading] = React.useState(false);

  const { notification } = useNotification();

  React.useEffect(() => {
    if (delivery) {
      const iniVal = {
        title: delivery?.[`${PREFIX}titulo`],
        finalGrid: moment(delivery?.[`${PREFIX}gradefinal`]),
        outlines: moment(delivery?.[`${PREFIX}outlines`]),
        times: moment(delivery?.[`${PREFIX}horarios`]),
        approval: moment(delivery?.[`${PREFIX}aprovacao`]),
        moodleFolder: moment(delivery?.[`${PREFIX}moodlepasta`]),
        checkMoodle: moment(delivery?.[`${PREFIX}conferirmoodle`]),
        days: delivery?.[`${PREFIX}Entrega_CronogramadeDia`]?.map((e) => ({
          ...e,
          keyId: v4(),
        })),
      };
      setInitialValues(iniVal);
    }
  }, [delivery]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const daysSelected = values.days?.filter((e) => !e?.deleted);

      if (!daysSelected.length) {
        notification.error({
          title: 'Sem dias',
          description: 'Selecione o(s) dia(s) para entrega',
        });
        return;
      }
      setLoading(true);
      addOrUpdateDelivery(
        {
          ...values,
          teamId,
          title: delivery?.[`${PREFIX}entregaid`]
            ? values.title
            : `Entrega ${nextDelivery}`,
          days: values.days.filter((e) => !e.deleted),
          daysToDelete: values.days.filter((e) => e.deleted),
          id: delivery?.[`${PREFIX}entregaid`],
        },
        {
          onSuccess: (del) => {
            setLoading(false);
            setDelivery(del);
            notification.success({
              title: 'Sucesso',
              description: 'Entrada salva com sucesso',
            });
          },
          onError: (err) => {
            setLoading(false);
            notification.error({
              title: 'Falha',
              description: err?.data?.error?.message,
            });
          },
        }
      );
    },
  });

  const handleAddDay = (day: any) => {
    const newDays = _.cloneDeep(formik.values.days);
    newDays.push({ ...day, keyId: v4() });

    formik.setFieldValue('days', newDays);
  };

  const handleRemoveDay = (scheduleId: string) => {
    let newDays = _.cloneDeep(formik.values.days);
    newDays = newDays?.map((e) =>
      e?.[`${PREFIX}cronogramadediaid`] === scheduleId
        ? { ...e, deleted: true }
        : e
    );

    formik.setFieldValue('days', newDays);
  };

  const handleClose = () => {
    setDelivery(null);
    setInitialValues(DEFAULT_VALUES);
    formik.resetForm();
    onClose();
  };

  const checkDisabled = (item): boolean => {
    return !daysAvailable?.some(
      (dt) => dt?.[`${PREFIX}data`] === item?.[`${PREFIX}data`]
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='DeliveryTitle'
        aria-describedby='DeliveryDescription'
      >
        <DialogTitle id='DeliveryTitle'>
          <Typography
            variant='h6'
            color='textPrimary'
            style={{ fontWeight: 'bold' }}
          >
            {delivery?.[`${PREFIX}entregaid`]
              ? 'Editar Entrega'
              : 'Cadastrar Entrega'}
          </Typography>

          <IconButton
            aria-label='close'
            onClick={handleClose}
            style={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            marginBottom='1rem'
            display='flex'
            style={{ gap: '10px' }}
            flexWrap='wrap'
          >
            {allDays?.map((item) => {
              const isSelected = formik.values.days
                ?.filter((e) => !e?.deleted)
                ?.some(
                  (dt) => dt?.[`${PREFIX}data`] === item?.[`${PREFIX}data`]
                );
              const isSelectable = formik.values.days?.some(
                (dt) => dt?.[`${PREFIX}data`] === item?.[`${PREFIX}data`]
              );

              return (
                <Chip
                  icon={isSelected ? <Done /> : <Close />}
                  label={moment.utc(item?.[`${PREFIX}data`]).format('DD/MM/YYYY')}
                  key={item?.[`${PREFIX}data`]}
                  disabled={!isSelectable && checkDisabled(item)}
                  color={isSelected ? 'primary' : 'default'}
                  onClick={() =>
                    isSelected
                      ? handleRemoveDay(item?.[`${PREFIX}cronogramadediaid`])
                      : handleAddDay(item)
                  }
                />
              );
            })}
          </Box>

          <Box alignItems='center' justifyContent='space-evenly'>
            <Box
              display='grid'
              gridTemplateColumns='1fr 1fr'
              gridRowGap='10px'
              alignItems='center'
            >
              <Typography>Grade Final</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('finalGrid', value);
                }}
                value={formik.values.finalGrid}
              />

              <Typography>Outlines</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('outlines', value);
                }}
                value={formik.values.outlines}
              />

              <Typography>Horários</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('times', value);
                }}
                value={formik.values.times}
              />

              <Typography>Aprovação</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('approval', value);
                }}
                value={formik.values.approval}
              />

              <Typography> Moodle/Pasta</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('moodleFolder', value);
                }}
                value={formik.values.moodleFolder}
              />

              <Typography>Conferir Moodle</Typography>
              <KeyboardDatePicker
                autoOk
                clearable
                fullWidth
                variant='inline'
                format={'DD/MM/YYYY'}
                onChange={(value: any) => {
                  formik.setFieldValue('checkMoodle', value);
                }}
                value={formik.values.checkMoodle}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancelar
          </Button>
          <Button
            onClick={() => !loading && formik.handleSubmit()}
            variant='contained'
            color='primary'
            autoFocus
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeliveryForm;
