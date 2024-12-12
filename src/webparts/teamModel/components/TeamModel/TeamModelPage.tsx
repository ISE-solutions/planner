import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Page from '~/components/Page';
import {
  useFiniteInfiniteResource,
  useLoggedUser,
  useScheduleDay,
  useTeam,
} from '~/hooks';
import { PREFIX } from '~/config/database';
import AccordionVertical from '~/components/AccordionVertical';
import ListModels from './components/ListModels';
import Calendar from './components/Calendar';
import ListDays from './components/ListDays';
import { Box, Typography } from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { getTeamById } from '~/store/modules/team/actions';

interface ITeamModelPage {
  context: WebPartContext;
}

const TeamModelPage: React.FC<ITeamModelPage> = ({ context }) => {
  const [teamChoosed, setTeamChoosed] = React.useState<any>();
  const [scheduleChoosed, setScheduleChoosed] = React.useState<any>();
  const [filter, setFilter] = React.useState<any>({
    searchQuery: '',
    active: 'Ativo',
    model: true,
    programId: null,
    filterProgram: true,
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const modelIdParam = queryParameters.get('modelid');

  const dispatch = useDispatch();

  const [{ schedule, refetch: refetchSchedule }] = useScheduleDay(
    {
      teamId: teamChoosed?.[`${PREFIX}turmaid`],
      active: 'Ativo',
      model: true,
    },
    { manual: true }
  );

  const { currentUser } = useLoggedUser();

  const [
    { loading, loadingSave, teams, addOrUpdateTeam, refetch: refetchTeam },
  ] = useTeam(filter);

  React.useEffect(() => {
    if (modelIdParam) {
      getTeamById(modelIdParam).then(({ value }) => setTeamChoosed(value[0]));
    }
  }, [modelIdParam]);

  React.useEffect(() => {
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  React.useEffect(() => {
    if (teamChoosed) {
      refetchSchedule();
    }
  }, [teamChoosed?.[`${PREFIX}turmaid`]]);

  const canEdit = React.useMemo(() => {
    if (currentUser && teamChoosed) {
      return (
        currentUser?.isPlanning ||
        currentUser?.[`${PREFIX}pessoaid`] ===
          teamChoosed?.[`_${PREFIX}criadopor_value`]
      );
    }

    return false;
  }, [currentUser, teamChoosed]);

  return (
    <Page
      context={context}
      itemsBreadcrumbs={[
        { name: 'Modelos', page: 'Cronograma Modelo' },
        { name: 'Turma', page: 'Modelo Turma' },
      ]}
    >
      <AccordionVertical
        defaultExpanded
        title='Modelos de Turma'
        width={260}
        expansibleColumn={
          <ListModels
            context={context}
            loading={loading}
            currentUser={currentUser}
            loadingSave={loadingSave}
            teams={teams}
            filter={filter}
            setFilter={setFilter}
            refetch={refetchTeam}
            refetchSchedule={refetchSchedule}
            teamChoosed={teamChoosed}
            setTeamChoosed={setTeamChoosed}
            handleSchedule={(sch) => setTeamChoosed(sch)}
          />
        }
      >
        {teamChoosed ? (
          <AccordionVertical
            defaultExpanded
            title='Modelos de Turma'
            width={260}
            expansibleColumn={
              <ListDays
                canEdit={canEdit}
                schedules={schedule}
                context={context}
                refetch={refetchSchedule}
                scheduleChoosed={scheduleChoosed}
                teamChoosed={teamChoosed}
                handleSchedule={(sch) => setScheduleChoosed(sch)}
              />
            }
          >
            {scheduleChoosed ? (
              <Calendar
                canEdit={canEdit}
                context={context}
                schedules={schedule}
                scheduleChoosed={scheduleChoosed}
                refetchSchedule={refetchSchedule}
                refetchTeam={refetchTeam}
                teamChoosed={teamChoosed}
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
                    Escolha um dia
                  </Typography>
                </Box>
              </Box>
            )}
          </AccordionVertical>
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

export default TeamModelPage;
