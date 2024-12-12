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
import { PREFIX } from '~/config/database';
import { NotificationActionProps } from '~/providers/NotificationProvider/NotificationProvider';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { useConfirmation } from '~/hooks';
import { AppState } from '~/store';
import { useSelector } from 'react-redux';
import { addOrUpdateClassroom } from '~/store/modules/activity/actions';

interface IClassroomProps {
  academicActivity: any;
  finiteInfiniteResources: any[];
  tempTab: any;
  tab: number;
  handleEdit: (item) => void;
  onResetTempTab: () => void;
  handleChangeIndex: () => void;
  notification: NotificationActionProps;
  onClose: () => void;
}

const Classroom: React.FC<IClassroomProps> = ({
  onClose,
  tab,
  tempTab,
  handleEdit,
  onResetTempTab,
  handleChangeIndex,
  academicActivity,
  finiteInfiniteResources,
  notification,
}) => {
  const DEFAULT_VALUES = {
    theme: '',
    description: '',
    equipments: [],
    finiteResource: [],
    infiniteResource: [],
  };

  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const [pastValues, setPastValues] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const validationSchema = yup.object({
    // theme: yup.string().required('Campo Obrigatório'),
    // description: yup.string().required('Campo Obrigatório'),
  });

  const { tag } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;

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
              if (!Object.keys(values)?.length) {
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
        theme: academicActivity?.[`${PREFIX}temaaula`] || '',
        description: academicActivity?.[`${PREFIX}descricaoobjetivo`] || '',
        equipments: academicActivity[`${PREFIX}Atividade_Equipamentos`]?.length
          ? academicActivity[`${PREFIX}Atividade_Equipamentos`].map(
              (e) => dictTag[e?.[`${PREFIX}etiquetaid`]]
            )
          : [],
        finiteResource: academicActivity[
          `${PREFIX}Atividade_RecursoFinitoInfinito`
        ]?.filter((e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO),
        infiniteResource: academicActivity[
          `${PREFIX}Atividade_RecursoFinitoInfinito`
        ]?.filter(
          (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
        ),
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
    onSubmit: async (values) => {
      setLoading(true);

      const equipmentsToDelete = academicActivity?.[
        `${PREFIX}Atividade_Equipamentos`
      ]?.filter(
        (e) =>
          !values?.equipments?.some(
            (sp) => sp.value === e[`${PREFIX}etiquetaid`]
          )
      );

      const finiteInfiniteResourceToDelete = academicActivity?.[
        `${PREFIX}Atividade_RecursoFinitoInfinito`
      ]?.filter(
        (e) =>
          !values.finiteResource?.some(
            (sp) =>
              sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
              e[`${PREFIX}recursofinitoinfinitoid`]
          ) &&
          !values.infiniteResource?.some(
            (sp) =>
              sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
              e[`${PREFIX}recursofinitoinfinitoid`]
          )
      );

      await addOrUpdateClassroom(
        {
          ...values,
          id: academicActivity[`${PREFIX}atividadeid`],
          equipmentsToDelete,
          finiteInfiniteResourceToDelete,
        },
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );
    },
  });

  const equipmentsOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.EQUIPAMENTO_OUTROS
    )
  );

  const finiteResources = finiteInfiniteResources?.filter(
    (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
  );

  const infiniteResources = finiteInfiniteResources?.filter(
    (e) => e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.INFINITO
  );

  return (
    <>
      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              disabled
              autoFocus
              fullWidth
              minRows={2}
              label='Tema'
              type='text'
              name='theme'
              inputProps={{ maxLength: 255 }}
              // @ts-ignore
              error={!!formik?.errors?.theme}
              // @ts-ignore
              helperText={formik?.errors?.theme as string}
              onChange={formik.handleChange}
              value={formik.values.theme}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              minRows={2}
              inputProps={{ maxLength: 255 }}
              label='Descrição/Objetivo da sessão'
              type='text'
              name='description'
              onChange={formik.handleChange}
              value={formik.values.description}
              // @ts-ignore
              error={!!formik?.errors?.description}
              // @ts-ignore
              helperText={formik?.errors?.description as string}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12}>
            <Autocomplete
              multiple
              filterSelectedOptions={true}
              options={
                equipmentsOptions?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                ) || []
              }
              noOptionsText='Sem Opções'
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue(`equipments`, newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.value === value?.value
              }
              getOptionLabel={(option) => option?.label || ''}
              value={formik.values?.equipments || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name='equipments'
                  label='Equipamentos/Outros'
                  // @ts-ignore
                  error={!!formik.errors?.equipments}
                  // @ts-ignore
                  helperText={formik.errors?.equipments as string}
                />
              )}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12}>
            <Autocomplete
              multiple
              filterSelectedOptions={true}
              options={
                finiteResources?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                ) || []
              }
              noOptionsText='Sem Opções'
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue(`finiteResource`, newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.[`${PREFIX}recursofinitoinfinitoid`] ===
                value?.[`${PREFIX}recursofinitoinfinitoid`]
              }
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              value={formik.values?.finiteResource || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name='finiteResource'
                  label='Recurso Finito'
                  // @ts-ignore
                  error={!!formik.errors?.finiteResource}
                  // @ts-ignore
                  helperText={formik.errors?.finiteResource as string}
                />
              )}
            />
          </Grid>
          <Grid item sm={12} md={12} lg={12}>
            <Autocomplete
              multiple
              filterSelectedOptions={true}
              options={
                infiniteResources?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                ) || []
              }
              noOptionsText='Sem Opções'
              onChange={(event: any, newValue: any[]) => {
                formik.setFieldValue(`infiniteResource`, newValue);
              }}
              getOptionSelected={(option, value) =>
                option?.[`${PREFIX}recursofinitoinfinitoid`] ===
                value?.[`${PREFIX}recursofinitoinfinitoid`]
              }
              getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
              value={formik.values?.infiniteResource || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name='infiniteResource'
                  label='Recurso Infinito'
                  // @ts-ignore
                  error={!!formik.errors?.infiniteResource}
                  // @ts-ignore
                  helperText={formik.errors?.infiniteResource as string}
                />
              )}
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

export default Classroom;
