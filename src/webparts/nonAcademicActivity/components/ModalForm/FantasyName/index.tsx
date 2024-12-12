import * as React from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@material-ui/core';
import * as _ from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import { EUso } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { useConfirmation } from '~/hooks';
import { addOrUpdateFantasyName } from '~/store/modules/activity/actions';

interface IFantasyNameProps {
  academicActivity: any;
  notification: NotificationActionProps;
  onClose: () => void;
  tempTab: any;
  tab: number;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
}

const FantasyName: React.FC<IFantasyNameProps> = ({
  tab,
  onClose,
  tempTab,
  handleEdit,
  notification,
  onResetTempTab,
  academicActivity,
  handleChangeIndex,
}) => {
  const DEFAULT_VALUES = {
    names: [
      {
        name: '',
        nameEn: '',
        nameEs: '',
        use: '',
      },
    ],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    names: yup.array().of(
      yup.object().shape({
        name: yup.mixed().required('Campo Obrigatório'),
        use: yup.mixed().required('Campo Obrigatório'),
      })
    ),
  });

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
        names: academicActivity[`${PREFIX}Atividade_NomeAtividade`]?.length
          ? academicActivity[`${PREFIX}Atividade_NomeAtividade`]?.map((e) => ({
              id: e[`${PREFIX}nomeatividadeid`],
              name: e?.[`${PREFIX}nome`],
              nameEn: e?.[`${PREFIX}nomeen`],
              nameEs: e?.[`${PREFIX}nomees`],
              use: e?.[`${PREFIX}uso`],
            }))
          : [
              {
                name: '',
                nameEn: '',
                nameEs: '',
                use: '',
              },
            ],
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
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await addOrUpdateFantasyName(
        {
          ...values,
          id: academicActivity[`${PREFIX}atividadeid`],
          previousNames:
            academicActivity[`${PREFIX}Atividade_NomeAtividade`] || [],
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );
    },
  });

  const handleAddName = () => {
    let names = formik.values.names || [];

    names.push({
      name: '',
      nameEn: '',
      nameEs: '',
      use: '',
    });

    formik.setValues({ ...formik.values, names });
  };

  const handleRemoveName = (index) => {
    let names = formik.values.names || [];

    names.splice(index, 1);

    formik.setValues({ ...formik.values, names });
  };

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        {(formik.values.names || []).map((member, index) => {
          return (
            <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
              <Grid item sm={12} md={3} lg={3}>
                <TextField
                  autoFocus
                  fullWidth
                  label='Nome (PT)'
                  type='text'
                  name={`names[${index}].name`}
                  inputProps={{ maxLength: 255 }}
                  // @ts-ignore
                  error={!!formik?.errors?.names?.[index]?.name}
                  // @ts-ignore
                  helperText={formik?.errors?.names?.[index]?.name}
                  onChange={formik.handleChange}
                  value={formik.values.names?.[index]?.name}
                />
              </Grid>
              <Grid item sm={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  label='Nome (EN)'
                  type='text'
                  name={`names[${index}].nameEn`}
                  inputProps={{ maxLength: 255 }}
                  onChange={formik.handleChange}
                  value={formik.values.names[index]?.nameEn}
                />
              </Grid>
              <Grid item sm={12} md={3} lg={3}>
                <TextField
                  fullWidth
                  label='Nome (ES)'
                  type='text'
                  name={`names[${index}].nameEs`}
                  inputProps={{ maxLength: 255 }}
                  onChange={formik.handleChange}
                  value={formik.values.names?.[index]?.nameEs}
                />
              </Grid>

              <Grid item sm={12} md={2} lg={2}>
                <Autocomplete
                  options={Object.keys(EUso)}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => EUso[option]}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue(`names[${index}].use`, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Uso'
                      // @ts-ignore
                      error={!!formik.errors?.names?.[index]?.use}
                      // @ts-ignore
                      helperText={formik.errors?.names?.[index]?.use}
                    />
                  )}
                  value={formik.values?.names?.[index]?.use}
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
                {index === 0 && (
                  <Add
                    onClick={handleAddName}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
                {(index !== 0 || formik.values?.names.length > 1) && (
                  <Remove
                    onClick={() => handleRemoveName(index)}
                    style={{ color: '#333', cursor: 'pointer' }}
                  />
                )}
              </Grid>
            </Grid>
          );
        })}
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

export default FantasyName;
