import * as React from 'react';
import Page from '~/components/Page';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Filter from './Filter';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ENTITIES } from './constants';
import { getTagByName, getTags, updateTag } from '~/store/modules/tag/actions';
import { COLUMNS_ENTITY, formatRows } from './util';
import { Table } from '~/components';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import { getPeople, updatePerson } from '~/store/modules/person/actions';
import { getSpaces, updateSpace } from '~/store/modules/space/actions';
import {
  getActivities,
  updateActivity,
} from '~/store/modules/activity/actions';
import {
  EActivityTypeApplication,
  TYPE_ACTIVITY,
  TYPE_RESOURCE,
} from '~/config/enums';
import {
  getFiniteInfiniteResources,
  updateResource,
} from '~/store/modules/finiteInfiniteResource/actions';
import { getPrograms, updateProgram } from '~/store/modules/program/actions';
import { getTeams, updateTeam } from '~/store/modules/team/actions';
import { getSchedules, updateSchedule } from '~/store/modules/schedule/actions';
import { BackdropStyled } from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import { addOrUpdateByActivities } from '~/store/modules/resource/actions';
import { AppState } from '~/store';
import { TypeBlockUpdated } from '~/config/constants';

const TYPE_ENTITY = {
  [ENTITIES.ACADEMIC_ACTIVITY]: TYPE_ACTIVITY.ACADEMICA,
  [ENTITIES.NON_ACADEMIC_ACTIVITY]: TYPE_ACTIVITY.NON_ACADEMICA,
  [ENTITIES.INTERNAL_ACTIVITY]: TYPE_ACTIVITY.INTERNAL,
};

const TYPE_APPLICATION_ENTITY = {
  [ENTITIES.ACADEMIC_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
  [ENTITIES.NON_ACADEMIC_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
  [ENTITIES.INTERNAL_ACTIVITY]: [EActivityTypeApplication.PLANEJAMENTO],
  [ENTITIES.ACTIVITY]: [EActivityTypeApplication.APLICACAO],
  [ENTITIES.ACTIVITY_MODEL]: [
    EActivityTypeApplication.MODELO,
    EActivityTypeApplication.MODELO_REFERENCIA,
  ],
};

interface ITrashProps {
  context: WebPartContext;
}

const TrashPage: React.FC<ITrashProps> = ({ context }) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingRestore, setLoadingRestore] = React.useState(false);

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const { tag, environmentReference } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { references } = environmentReference;

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { entity: null, startDeleted: null, endDeleted: null },
    validationSchema: yup.object({
      entity: yup.mixed().required('Campo Obrigatório'),
    }),
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: () => {
      refetch();
    },
  });

  React.useEffect(() => {
    setData([]);
  }, [formik?.values?.entity]);

  const onFetchResult = (val) => {
    setData(val);
    setLoading(false);
  };

  const refetch = () => {
    setLoading(true);

    const entity = formik.values?.entity?.value;
    switch (entity) {
      case ENTITIES.TAG:
        getTags({
          deleted: true,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.PERSON:
        getPeople({
          deleted: true,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.SPACE:
        getSpaces({
          deleted: true,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.FINITE_RESOURCES:
        getFiniteInfiniteResources({
          deleted: true,
          typeResource: TYPE_RESOURCE.FINITO,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.INFINITE_RESOURCES:
        getFiniteInfiniteResources({
          deleted: true,
          typeResource: TYPE_RESOURCE.INFINITO,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.ACADEMIC_ACTIVITY:
      case ENTITIES.NON_ACADEMIC_ACTIVITY:
      case ENTITIES.INTERNAL_ACTIVITY:
      case ENTITIES.ACTIVITY:
      case ENTITIES.ACTIVITY_MODEL:
        getActivities({
          deleted: true,
          typeActivity: TYPE_ENTITY[entity],
          typesApplication: TYPE_APPLICATION_ENTITY[entity],
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.PROGRAM:
      case ENTITIES.PROGRAM_MODEL:
        getPrograms({
          deleted: true,
          model: entity === ENTITIES.PROGRAM_MODEL,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.TEAM:
      case ENTITIES.TEAM_MODEL:
        getTeams({
          deleted: true,
          programDeleted: false,
          model: entity === ENTITIES.TEAM_MODEL,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
      case ENTITIES.SCHEDULE:
      case ENTITIES.SCHEDULE_MODEL:
        getSchedules({
          deleted: true,
          teamDeleted: false,
          model: entity === ENTITIES.SCHEDULE_MODEL,
          startDeleted: formik.values.startDeleted,
          endDeleted: formik.values.endDeleted,
        }).then(onFetchResult);
        break;
    }
  };

  const handleSuccess = () => {
    refetch();
    setLoadingRestore(false);
    notification.success({
      title: 'Sucesso',
      description: 'Restaurado com sucesso',
    });
  };

  const handleError = () => {
    setLoadingRestore(false);
    notification.error({
      title: 'Falha',
      description: 'Ocorreu um erro, tente novamente mais tarde',
    });
  };

  const handleRecovery = (item) => {
    setLoadingRestore(true);
    switch (formik?.values?.entity?.value) {
      case ENTITIES.TAG:
        dispatch(
          updateTag(
            item?.[`${PREFIX}etiquetaid`],
            {
              [`${PREFIX}excluido`]: false,
              [`${PREFIX}ativo`]: true,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
        // getTagByName(formik?.values?.entity?.label).then(({ value }) => {
        //   if (!value.length) {

        //   } else {
        //     setLoadingRestore(false);
        //     notification.error({
        //       title: 'Etiqueta já existente',
        //       description: 'A etiqueta a ser restaurada já se encontra ativa',
        //     });
        //   }
        // });
        break;
      case ENTITIES.SPACE:
        dispatch(
          updateSpace(
            item?.[`${PREFIX}espacoid`],
            {
              [`${PREFIX}excluido`]: false,
              [`${PREFIX}ativo`]: true,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
        break;
      case ENTITIES.PERSON:
        dispatch(
          updatePerson(
            item?.[`${PREFIX}pessoaid`],
            {
              [`${PREFIX}excluido`]: false,
              [`${PREFIX}ativo`]: true,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
        break;
      case ENTITIES.FINITE_RESOURCES:
      case ENTITIES.INFINITE_RESOURCES:
        dispatch(
          updateResource(
            item?.[`${PREFIX}recursofinitoinfinitoid`],
            {
              [`${PREFIX}excluido`]: false,
              [`${PREFIX}ativo`]: true,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
        break;
      case ENTITIES.ACADEMIC_ACTIVITY:
      case ENTITIES.NON_ACADEMIC_ACTIVITY:
      case ENTITIES.INTERNAL_ACTIVITY:
        updateActivity(
          item?.[`${PREFIX}atividadeid`],
          {
            [`${PREFIX}excluido`]: false,
            [`${PREFIX}ativo`]: true,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
        break;
      case ENTITIES.ACTIVITY:
      case ENTITIES.ACTIVITY_MODEL:
        const sch = item?.[`${PREFIX}CronogramadeDia_Atividade`][0];

        if (sch && sch?.[`${PREFIX}excluido`]) {
          setLoadingRestore(false);
          notification.error({
            title: 'Dia de aula',
            description: 'O dia de aula desta atividade não se encontra ativo!',
          });
          return;
        }
        updateActivity(
          item?.[`${PREFIX}atividadeid`],
          {
            [`${PREFIX}excluido`]: false,
            [`${PREFIX}ativo`]: true,
          },
          {
            onSuccess: () => {
              addOrUpdateByActivities(
                [item],
                { references, dictTag },
                { activityId: item?.[`${PREFIX}atividadeid`] },
                {
                  type: TypeBlockUpdated.Atividade,
                  id: item?.[`${PREFIX}atividadeid`],
                }
              );
              handleSuccess();
            },
            onError: handleError,
          }
        );
        break;
      case ENTITIES.PROGRAM:
      case ENTITIES.PROGRAM_MODEL:
        updateProgram(
          item?.[`${PREFIX}programaid`],
          {
            [`${PREFIX}excluido`]: false,
            [`${PREFIX}ativo`]: true,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
        break;
      case ENTITIES.TEAM:
      case ENTITIES.TEAM_MODEL:
        const pr = item?.[`${PREFIX}Programa`];

        if (pr && pr?.[`${PREFIX}excluido`]) {
          setLoadingRestore(false);
          notification.error({
            title: 'Programa',
            description: 'O programa desta turma não se encontra ativo!',
          });
          return;
        }

        updateTeam(
          item?.[`${PREFIX}turmaid`],
          {
            [`${PREFIX}excluido`]: false,
            [`${PREFIX}ativo`]: true,
          },
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        );
        break;
      case ENTITIES.SCHEDULE:
      case ENTITIES.SCHEDULE_MODEL:
        const te = item?.[`${PREFIX}Turma`];

        if (te && te?.[`${PREFIX}excluido`]) {
          setLoadingRestore(false);
          notification.error({
            title: 'Turma',
            description: 'A turma deste dia de aula não se encontra ativa!',
          });
          return;
        }
        dispatch(
          updateSchedule(
            item?.[`${PREFIX}cronogramadediaid`],
            {
              [`${PREFIX}excluido`]: false,
              [`${PREFIX}ativo`]: true,
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
        break;

      default:
        return [];
    }
  };

  const handleConfirmRecovery = (item) => {
    confirmation.openConfirmation({
      title: 'Deseja relmente recuperar o item?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () => handleRecovery(item),
    });
  };

  const rows = React.useMemo(
    () => formatRows(data, { handleRecovery: handleConfirmRecovery }) || [],
    [data, formik?.values?.entity?.value]
  );

  const tableOptions = {
    enableNestedDataAccess: '.',
    responsive: 'vertical',
    selectableRows: 'none',
  };

  return (
    <>
      <BackdropStyled open={loadingRestore}>
        <CircularProgress color='inherit' />
      </BackdropStyled>

      <Page
        context={context}
        blockOverflow={false}
        itemsBreadcrumbs={[
          { name: 'Planejamento', page: 'Pessoa' },
          { name: 'Lixeira', page: 'Lixeira' },
        ]}
      >
        <Filter formik={formik} />

        <Box
          width='100%'
          display='flex'
          marginTop='1rem'
          marginBottom='2rem'
          justifyContent='flex-end'
          style={{ gap: '10px' }}
        >
          <Button onClick={() => formik.handleReset({})} color='primary'>
            Limpar
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            variant='contained'
            color='primary'
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Pesquisar'
            )}
          </Button>
        </Box>

        {formik?.values?.entity ? (
          <Table
            columns={COLUMNS_ENTITY?.[formik?.values?.entity?.value] || []}
            data={rows}
            options={tableOptions}
          />
        ) : null}
      </Page>
    </>
  );
};

export default TrashPage;
