import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import { useLoggedUser, useScheduleDay } from '~/hooks';
import { PREFIX } from '~/config/database';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import CalendarDay from './components/CalendarDay';
import { Box, Typography } from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { getScheduleId } from '~/store/modules/schedule/actions';

interface IActivityGroupModelPage {
  context: WebPartContext;
}

const ActivityGroupModelPage: React.FC<IActivityGroupModelPage> = ({ context }) => {
  const [scheduleChoosed, setActivityGroupChoosed] = React.useState<any>();
  const [filter, setFilter] = React.useState<any>({
    active: 'Ativo',
    searchQuery: '',
    group: 'Sim',
    model: true,
    filterTeam: true,
    teamId: null,
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const modelIdParam = queryParameters.get('modelid');

  const dispatch = useDispatch();
  const { currentUser } = useLoggedUser();
  const [{ schedule, loading, refetch }] = useScheduleDay(filter);

  React.useEffect(() => {
    if (modelIdParam) {
      getScheduleId(modelIdParam).then(({ value }) =>
        setActivityGroupChoosed(value[0])
      );
    }
  }, [modelIdParam]);

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  React.useEffect(() => {
    if (schedule?.length && scheduleChoosed) {
      const scheduleChoosedIndex = schedule.findIndex(
        (item) =>
          item?.[`${PREFIX}cronogramadediaid`] ===
          scheduleChoosed?.[`${PREFIX}cronogramadediaid`]
      );
      if (scheduleChoosedIndex > -1) {
        setActivityGroupChoosed(schedule[scheduleChoosedIndex]);
      }
    }
  }, [schedule]);

  const canEdit = React.useMemo(() => {
    if (currentUser && scheduleChoosed) {
      return (
        currentUser?.isPlanning ||
        currentUser?.[`${PREFIX}pessoaid`] ===
          scheduleChoosed?.[`_${PREFIX}criadopor_value`]
      );
    }

    return false;
  }, [currentUser, scheduleChoosed]);

  return (
    <Page
      context={context}
      itemsBreadcrumbs={[
        { name: 'Modelos', page: 'Cronograma Modelo' },
        { name: 'Agrupamento de Atividades', page: 'Cronograma Modelo' },
      ]}
    >
      <AccordionVertical
        defaultExpanded
        title='Modelos de Agrupamento de Atividades'
        width={290}
        expansibleColumn={
          <ListModels
            context={context}
            refetch={refetch}
            currentUser={currentUser}
            filter={filter}
            canEdit={canEdit}
            setFilter={setFilter}
            schedule={schedule}
            loading={loading}
            scheduleChoosed={scheduleChoosed}
            handleSchedule={(sch) => setActivityGroupChoosed(sch)}
          />
        }
      >
        {scheduleChoosed ? (
          <CalendarDay
            canEdit={canEdit}
            scheduleChoosed={scheduleChoosed}
            refetch={refetch}
          />
        ) : (
          <Box
            display='flex'
            height='100%'
            width='55rem'
            justifyContent='center'
            alignItems='center'
          >
            <Box display='flex' flexDirection='column' alignItems='center'>
              <IoCalendarNumberSharp color='#0063a5' size='5rem' />
              <Typography
                variant='h5'
                color='primary'
                style={{ fontWeight: 'bold' }}
              >
                Escolha um modelo
              </Typography>
            </Box>
          </Box>
        )}
      </AccordionVertical>
    </Page>
  );
};

export default ActivityGroupModelPage;
