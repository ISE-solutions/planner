import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { useLoggedUser, useNotification } from '~/hooks';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { FaSchool } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  fetchAllActivities,
  getActivity,
  updateActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import { EActivityTypeApplication, EGroups } from '~/config/enums';
import { ActivityForm, Backdrop } from '~/components';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { PREFIX } from '~/config/database';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';

interface IActivityModelPage {
  context: WebPartContext;
}

const ActivityModelPage: React.FC<IActivityModelPage> = ({ context }) => {
  const [activityChoosed, setActivityChoosed] = React.useState<any>();
  const [search, setSearch] = React.useState('');
  const [loadingSave, setLoadingSave] = React.useState(false);
  const [filter, setFilter] = React.useState<any>({
    searchQuery: search,
    active: 'Ativo',
    typeApplication: EActivityTypeApplication.MODELO_REFERENCIA,
  });

  const { loading, activities } = useSelector(
    (state: AppState) => state.activity
  );
  const { notification } = useNotification();
  const dispatch = useDispatch();

  const queryParameters = new URLSearchParams(window.location.search);
  const modelIdParam = queryParameters.get('modelid');
  const { currentUser } = useLoggedUser();

  const refetch = (ftr?: any) => {
    dispatch(fetchAllActivities(ftr || filter));
  };

  React.useEffect(() => {
    if (modelIdParam) {
      getActivity(modelIdParam).then(({ value }) =>
        setActivityChoosed(value[0])
      );
    }
  }, [modelIdParam]);

  React.useEffect(() => {
    refetch();
  }, [filter]);

  React.useEffect(() => {
    refetch();
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  const myGroup = () => {
    if (currentUser?.isPlanning) {
      return EGroups.PLANEJAMENTO;
    }

    if (currentUser?.isAdmission) {
      return EGroups.ADMISSOES;
    }

    return '';
  };

  const handleSuccess = () => {
    refetch();
    setLoadingSave(false);

    notification.success({
      title: 'Sucesso',
      description: 'Atualização realizada com sucesso',
    });
  };

  const handleError = (error) => {
    setLoadingSave(false);
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleSaveActivity = (item, onSuccess?) => {
    setLoadingSave(true);
    const spacesToDelete = item?.[`${PREFIX}Atividade_Espaco`]?.filter(
      (e) => !item.spaces?.some((sp) => sp.value === e[`${PREFIX}espacoid`])
    );
    const equipmentsToDelete = item?.[
      `${PREFIX}Atividade_Equipamentos`
    ]?.filter(
      (e) =>
        !item.equipments?.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])
    );

    const finiteInfiniteResourceToDelete = item?.[
      `${PREFIX}Atividade_RecursoFinitoInfinito`
    ]?.filter(
      (e) =>
        !item.finiteResource?.some(
          (sp) =>
            sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
            e[`${PREFIX}recursofinitoinfinitoid`]
        ) &&
        !item.infiniteResource?.some(
          (sp) =>
            sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
            e[`${PREFIX}recursofinitoinfinitoid`]
        )
    );

    dispatch(
      updateActivityAll(
        {
          ...item,
          typeApplication: EActivityTypeApplication.MODELO_REFERENCIA,
          user: currentUser?.[`${PREFIX}pessoaid`],
          group: myGroup(),
          spacesToDelete: spacesToDelete,
          equipmentsToDelete: equipmentsToDelete,
          finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete,
        },
        {
          onSuccess: () => {
            handleSuccess?.();
            onSuccess?.();
            refetch?.();
          },
          onError: handleError,
        }
      )
    );
  };

  const handleChangeActivity = async (actv) => {
    if (activityChoosed) {
      await updateActivity(
        activityChoosed?.[`${PREFIX}atividadeid`],
        {
          [`${PREFIX}Editanto@odata.bind`]: null,
          [`${PREFIX}datahoraeditanto`]: null,
        },
        {
          onSuccess: () => null,
          onError: () => null,
        }
      );
    }
    setActivityChoosed(actv);
  };

  return (
    <>
      <Backdrop open={loadingSave}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Page
        context={context}
        itemsBreadcrumbs={[
          { name: 'Modelos', page: 'Cronograma Modelo' },
          { name: 'Atividade', page: 'Modelo Atividades' },
        ]}
      >
        <AccordionVertical
          defaultExpanded
          title='Modelos de Atividades'
          width={260}
          expansibleColumn={
            <ListModels
              loading={loading}
              currentUser={currentUser}
              models={activities}
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
              setSearch={setSearch}
              handleSaveActivity={handleSaveActivity}
              modelChoosed={activityChoosed}
              handleActivity={handleChangeActivity}
            />
          }
        >
          <Box
            display='flex'
            height='100%'
            justifyContent='center'
            alignItems='center'
          >
            {activityChoosed ? (
              <ActivityForm
                isModel
                isModelReference
                refetch={refetch}
                activity={activityChoosed}
                setActivity={setActivityChoosed}
                onSave={handleSaveActivity}
              />
            ) : (
              <Box display='flex' flexDirection='column' alignItems='center'>
                <FaSchool color='#0063a5' size='5rem' />
                <Typography
                  variant='h5'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  Escolha um modelo
                </Typography>
              </Box>
            )}
          </Box>
        </AccordionVertical>
      </Page>
    </>
  );
};

export default ActivityModelPage;
