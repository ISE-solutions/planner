import * as React from 'react';
import * as yup from 'yup';
import * as _ from 'lodash';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { PREFIX } from '~/config/database';
import { useConfirmation } from '~/hooks';
import { addOrUpdatePerson } from '~/store/modules/activity/actions';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IEnvolvedPersonProps {
  academicActivity: any;
  tempTab: any;
  tab: number;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
  notification: NotificationActionProps;
  onClose: () => void;
}

const EnvolvedPerson: React.FC<IEnvolvedPersonProps> = ({
  tab,
  tempTab,
  handleEdit,
  onResetTempTab,
  handleChangeIndex,
  academicActivity,
  onClose,
  notification,
}) => {
  const DEFAULT_VALUES = {
    people: [
      {
        person: null,
        function: null,
      },
    ],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>({});
  const [personOption, setPersonOption] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    people: yup.array().of(
      yup.object().shape({
        person: yup.mixed().required('Campo Obrigatório'),
        function: yup.mixed().required('Campo Obrigatório'),
      })
    ),
  });

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { persons, dictPeople } = person;

  const functionOptions = React.useMemo(
    () =>
      tags.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
        )
      ),
    [tags]
  );

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
        people: academicActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
          ? academicActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map(
              (e, index) => ({
                id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                function: dictTag[e?.[`_${PREFIX}funcao_value`]],
              })
            )
          : [
              {
                person: null,
                function: null,
              },
            ],
      };

      setInitialValues(_.cloneDeep(iniVal));
      setPastValues(_.cloneDeep(iniVal));

      verifyPeopleOptions();
    }
  }, [academicActivity]);

  const verifyPeopleOptions = async () => {
    if (academicActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length) {
      const newOptions = {};
      await academicActivity[`${PREFIX}Atividade_PessoasEnvolvidas`]?.forEach(
        (pers, index) => {
          const func = dictTag[pers?.[`_${PREFIX}funcao_value`]];

          const peoples = persons.filter(
            (pers) =>
              pers?.[`${PREFIX}ativo`] &&
              pers?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
                (ta) =>
                  ta?.[`${PREFIX}etiquetaid`] === func?.[`${PREFIX}etiquetaid`]
              )
          );

          newOptions[index] = peoples;
        }
      );

      setPersonOption(newOptions);
    }
  };

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

      await addOrUpdatePerson(
        {
          ...values,
          id: academicActivity[`${PREFIX}atividadeid`],
          previousPeople:
            academicActivity[`${PREFIX}Atividade_PessoasEnvolvidas`] || [],
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );
    },
  });

  const handleAddName = () => {
    let people = formik.values.people || [];

    people.push({
      person: null,
      function: null,
    });

    formik.setValues({ ...formik.values, people });
  };

  const handleRemoveName = (index) => {
    let people = formik.values.people || [];

    people.splice(index, 1);

    formik.setValues({ ...formik.values, people });
  };

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        {(formik.values.people || []).map((member, index) => {
          return (
            <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
              <Grid item sm={12} md={5} lg={5}>
                <Autocomplete
                  options={functionOptions?.filter(
                    (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                  )}
                  filterSelectedOptions={true}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue(`people[${index}].function`, newValue);

                    const peoples = persons.filter(
                      (pers) =>
                        !pers?.[`${PREFIX}excluido`] &&
                        pers?.[`${PREFIX}ativo`] &&
                        pers?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
                          (ta) =>
                            ta?.[`${PREFIX}etiquetaid`] ===
                            newValue?.[`${PREFIX}etiquetaid`]
                        )
                    );

                    const newOptions = { ...personOption };

                    newOptions[index] = peoples;
                    setPersonOption(newOptions);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      fullWidth
                      label='Função'
                      error={
                        // @ts-ignore
                        !!formik.errors?.people?.[index]?.function
                      }
                      helperText={
                        // @ts-ignore
                        formik.errors?.people?.[index]?.function as string
                      }
                    />
                  )}
                  value={formik.values?.people?.[index]?.function}
                />
              </Grid>

              <Grid item sm={12} md={5} lg={5}>
                <Autocomplete
                  options={personOption[index] || []}
                  disabled={!personOption[index]}
                  filterSelectedOptions={true}
                  noOptionsText='Sem Opções'
                  getOptionLabel={(option) => option?.label}
                  onChange={(event: any, newValue: string | null) => {
                    formik.setFieldValue(`people[${index}].person`, newValue);
                  }}
                  getOptionSelected={(option, value) =>
                    option?.value === value?.value
                  }
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      fullWidth
                      label='Pessoa'
                      // @ts-ignore
                      error={!!formik.errors?.people?.[index]?.person as string}
                      helperText={
                        // @ts-ignore
                        formik.errors?.people?.[index]?.person as string
                      }
                    />
                  )}
                  value={formik.values?.people?.[index]?.person}
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
                {(index !== 0 || formik.values?.people?.length > 1) && (
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

export default EnvolvedPerson;
