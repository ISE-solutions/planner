import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormik } from 'formik';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { PREFIX } from '~/config/database';
import { KeyboardTimePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import { IconHelpTooltip } from '~/components';
import {
  EActivityTypeApplication,
  EFatherTag,
  TYPE_ACTIVITY,
} from '~/config/enums';
import { useConfirmation } from '~/hooks';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { addOrUpdateActivity } from '~/store/modules/activity/actions';
import { useDispatch } from 'react-redux';

interface IInfoProps {
  academicActivity: any;
  onClose: () => void;
  tempTab: any;
  tab: number;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
  notification: NotificationActionProps;
}

const Info: React.FC<IInfoProps> = ({
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
    name: null,
    startTime: null,
    duration: moment('00:05', 'HH:mm'),
    endTime: null,
    quantity: 0,
    area: null,
    spaces: [],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const { space, tag } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { spaces, dictSpace } = space;

  const validationSchema = yup.object({
    name: yup.mixed().required('Campo Obrigatório'),
    startTime: yup.mixed().test({
      name: 'durationValid',
      message: 'Formato inválido',
      test: (v) => {
        if (v) {
          return v?.isValid();
        }
        return true;
      },
    }),
    duration: yup
      .mixed()
      .required('Campo Obrigatório')
      .test({
        name: 'durationValid',
        message: 'Formato inválido',
        test: (v) => v?.isValid(),
      }),
    quantity: yup
      .number()
      .min(0, 'Informe um número maior ou igual a zero')
      .integer('Informe um número inteiro'),
    // area: yup.mixed().required('Campo Obrigatório'),
  });

  const dispatch = useDispatch();
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
      const iniVal = {
        name: academicActivity[`${PREFIX}nome`] || '',
        startTime:
          (academicActivity[`${PREFIX}inicio`] &&
            moment(academicActivity[`${PREFIX}inicio`], 'HH:mm')) ||
          null,
        duration:
          (academicActivity[`${PREFIX}duracao`] &&
            moment(academicActivity[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        endTime:
          (academicActivity[`${PREFIX}fim`] &&
            moment(academicActivity[`${PREFIX}fim`], 'HH:mm')) ||
          null,
        quantity: academicActivity[`${PREFIX}quantidadesessao`] || 0,
        area: academicActivity[`${PREFIX}AreaAcademica`]
          ? {
              ...academicActivity[`${PREFIX}AreaAcademica`],
              value:
                academicActivity[`${PREFIX}AreaAcademica`]?.[
                  `${PREFIX}etiquetaid`
                ],
              label:
                academicActivity[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
            }
          : null,
        spaces: academicActivity[`${PREFIX}Atividade_Espaco`]?.length
          ? academicActivity[`${PREFIX}Atividade_Espaco`].map(
              (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
            )
          : [],
      };

      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));
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
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);

      if (academicActivity) {
        dispatch(
          addOrUpdateActivity(
            {
              ...values,
              type: TYPE_ACTIVITY.ACADEMICA,
              id: academicActivity[`${PREFIX}atividadeid`],
              previousSpace: academicActivity[`${PREFIX}Atividade_Espaco`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      } else {
        dispatch(
          addOrUpdateActivity(
            {
              ...values,
              type: TYPE_ACTIVITY.ACADEMICA,
              typeApplication: EActivityTypeApplication.PLANEJAMENTO,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      }
    },
  });

  const areaOptions = tags
    .filter((tag) =>
      tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
        (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
      )
    )
    .sort((a, b) => a?.[`${PREFIX}ordem`] - b?.[`${PREFIX}ordem`]);

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={6} lg={6}>
            <TextField
              autoFocus
              fullWidth
              required
              label={
                <Box display='flex' alignItems='center' style={{ gap: '5px' }}>
                  Nome
                  <IconHelpTooltip title='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
                </Box>
              }
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
            <Box display='flex' alignItems='end' style={{ gap: '10px' }}>
              <KeyboardTimePicker
                ampm={false}
                fullWidth
                disabled
                cancelLabel='Cancelar'
                invalidDateMessage='Formato inválido'
                label={
                  <Box
                    display='flex'
                    alignItems='center'
                    style={{ gap: '5px' }}
                  >
                    Início da Atividade
                    <IconHelpTooltip title='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
                  </Box>
                }
                value={formik.values.startTime}
                onChange={(value) => {
                  formik.setFieldValue('startTime', value);

                  if (!value) {
                    formik.setFieldValue('endTime', null);
                    return;
                  }
                  if (formik.values.duration) {
                    const duration =
                      formik.values.duration.hour() * 60 +
                      formik.values.duration.minute();

                    formik.setFieldValue(
                      'endTime',
                      value?.clone().add(duration, 'minutes')
                    );
                  }
                }}
              />
              <IconHelpTooltip title='Lorem Ipsum is simply dummy text of the printing and typesetting industry.' />
            </Box>
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <KeyboardTimePicker
              required
              ampm={false}
              fullWidth
              cancelLabel='Cancelar'
              invalidDateMessage='Formato inválido'
              label='Duração da Atividade'
              value={formik.values.duration}
              error={!!formik.errors.duration}
              helperText={formik?.errors?.duration as any}
              onChange={(value) => {
                formik.setFieldValue('duration', value);

                if (formik.values.startTime) {
                  const duration = value?.hour() * 60 + value?.minute();
                  formik.setFieldValue(
                    'endTime',
                    formik.values.startTime?.clone()?.add(duration, 'minutes')
                  );
                }
              }}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <KeyboardTimePicker
              disabled
              ampm={false}
              fullWidth
              cancelLabel='Cancelar'
              label='Fim da Atividade'
              invalidDateMessage='Formato inválido'
              value={formik.values.endTime}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Quantidade de Sessões'
              type='number'
              name='quantity'
              error={!!formik.errors.quantity}
              helperText={formik.errors.quantity as string}
              onChange={formik.handleChange}
              value={formik.values.quantity}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <Autocomplete
              filterSelectedOptions={true}
              noOptionsText='Sem Opções'
              options={areaOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              )}
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue('area', newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.value === value?.value
              }
              getOptionLabel={(option) => option?.label || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.area}
                  helperText={formik.errors.area as string}
                  label='Área Acadêmica'
                />
              )}
              value={formik.values.area}
            />
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <Autocomplete
              multiple
              disabled
              noOptionsText='Sem Opções'
              filterSelectedOptions={true}
              options={spaces?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              )}
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue('spaces', newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.value === value?.value
              }
              getOptionLabel={(option) => option?.label || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!formik.errors.spaces}
                  helperText={formik.errors.spaces as string}
                  label='Espaço'
                />
              )}
              value={formik.values.spaces}
            />
          </Grid>
        </Grid>
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

export default Info;
