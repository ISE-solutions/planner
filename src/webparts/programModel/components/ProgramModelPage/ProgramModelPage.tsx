import * as React from 'react';
import Page from '~/components/Page';
import AccordionVertical from '~/components/AccordionVertical';
import ListPrograms from './components/ListPrograms';
import DetailProgram from './components/DetailProgram';
import DetailTeam from './components/DetailTeam';
import ListDays from './components/ListDays';
import { Box, Typography } from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useLoggedUser, useScheduleDay, useTeam } from '~/hooks';
import { FaAward, FaUserFriends } from 'react-icons/fa';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { getProgramId } from '~/store/modules/program/actions';

interface IProgramModelPage {
  context: WebPartContext;
}

const ProgramModelPage: React.FC<IProgramModelPage> = ({ context }) => {
  const [scheduleChoosed, setScheduleChoosed] = React.useState(null);
  const [programChoosed, setProgramChoosed] = React.useState(null);
  const [teamChoosed, setTeamChoosed] = React.useState(null);
  const [listMode, setListMode] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const queryParameters = new URLSearchParams(window.location.search);
  const modelIdParam = queryParameters.get('modelid');

  const dispatch = useDispatch();

  const { currentUser } = useLoggedUser();

  const [{ schedule, addUpdateSchedule, refetch: refetchSchedule }] =
    useScheduleDay(
      {
        teamId: teamChoosed?.[`${PREFIX}turmaid`],
        active: 'Ativo',
        model: true,
      },
      { manual: true }
    );

  const [{ loading, teams, refetch: refetchTeam }] = useTeam({
    programId: programChoosed?.[`${PREFIX}programaid`],
    active: 'Ativo',
    searchQuery: search,
    model: true,
  });

  React.useEffect(() => {
    if (modelIdParam) {
      getProgramId(modelIdParam).then(({ value }) =>
        setProgramChoosed(value[0])
      );
    }
  }, [modelIdParam]);

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  React.useEffect(() => {
    if (teamChoosed) {
      refetchSchedule();
    }
  }, [teamChoosed?.[`${PREFIX}turmaid`]]);

  React.useEffect(() => {
    setTeamChoosed(null);
  }, [programChoosed]);

  const handleModeView = () => {
    setListMode(!listMode);
    setScheduleChoosed(null);
  };

  const canEdit = React.useMemo(() => {
    if (currentUser && programChoosed) {
      return (
        !!currentUser?.isPlanning ||
        currentUser?.[`${PREFIX}pessoaid`] ===
          programChoosed?.[`_${PREFIX}criadopor_value`]
      );
    }
    return false;
  }, [currentUser, programChoosed]);

  return (
    <Page
      noPadding
      context={context}
      itemsBreadcrumbs={[
        { name: 'Modelos', page: 'Dia de aula Modelo' },
        { name: 'Programa', page: 'Modelo Programa' },
      ]}
    >
      <AccordionVertical
        defaultExpanded
        title='Modelos'
        width={260}
        expansibleColumn={
          <ListPrograms
            context={context}
            currentUser={currentUser}
            programChoosed={programChoosed}
            setProgramChoosed={setProgramChoosed}
            handleProgram={(program) => setProgramChoosed(program)}
          />
        }
      >
        <AccordionVertical
          defaultExpanded
          title={
            programChoosed?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`] ||
            'Escolha um Programa'
          }
          width={260}
          expansibleColumn={
            <>
              {programChoosed ? (
                <DetailProgram
                  context={context}
                  canEdit={canEdit}
                  setSearch={setSearch}
                  loading={loading}
                  teams={teams}
                  refetch={refetchTeam}
                  programChoosed={programChoosed}
                  teamChoosed={teamChoosed}
                  setTeamChoosed={setTeamChoosed}
                />
              ) : (
                <Box
                  display='flex'
                  height='100%'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                  >
                    <FaAward color='#0063a5' style={{ fontSize: '5rem' }} />
                    <Typography
                      variant='h5'
                      color='primary'
                      style={{ fontWeight: 'bold' }}
                    >
                      Escolha um Modelo
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          }
        >
          {
            <>
              {teamChoosed ? (
                <>
                  {listMode ? (
                    <AccordionVertical
                      defaultExpanded
                      title={
                        teamChoosed?.[`${PREFIX}nome`] || 'Escolha uma Turma'
                      }
                      width={270}
                      expansibleColumn={
                        <ListDays
                          canEdit={canEdit}
                          schedules={schedule}
                          scheduleChoosed={scheduleChoosed}
                          setScheduleChoosed={setScheduleChoosed}
                          addUpdateSchedule={addUpdateSchedule}
                          context={context}
                          teamChoosed={teamChoosed}
                          programChoosed={programChoosed}
                          teamId={teamChoosed?.[`${PREFIX}turmaid`]}
                          programId={teamChoosed?.[`_${PREFIX}programa_value`]}
                          refetchSchedule={refetchSchedule}
                          refetchTeam={refetchTeam}
                        />
                      }
                    >
                      {scheduleChoosed ? (
                        <DetailTeam
                          context={context}
                          canEdit={canEdit}
                          listMode={listMode}
                          schedules={schedule}
                          handleModeView={handleModeView}
                          refetchTeam={refetchTeam}
                          refetchSchedule={refetchSchedule}
                          scheduleChoosed={scheduleChoosed}
                          teamChoosed={teamChoosed}
                          programChoosed={programChoosed}
                        />
                      ) : (
                        <Box
                          display='flex'
                          height='100%'
                          width='20rem'
                          justifyContent='center'
                          alignItems='center'
                        >
                          <Box
                            display='flex'
                            flexDirection='column'
                            alignItems='center'
                          >
                            <IoCalendarNumberSharp
                              color='#0063a5'
                              size='5rem'
                            />
                            <Typography
                              variant='h6'
                              color='primary'
                              style={{ fontWeight: 'bold' }}
                            >
                              Escolha um dia de aula
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </AccordionVertical>
                  ) : (
                    <Box marginRight='1rem'>
                      <DetailTeam
                        context={context}
                        canEdit={canEdit}
                        listMode={listMode}
                        schedules={schedule}
                        handleModeView={() => setListMode(!listMode)}
                        refetchTeam={refetchTeam}
                        scheduleChoosed={scheduleChoosed}
                        refetchSchedule={refetchSchedule}
                        teamChoosed={teamChoosed}
                        programChoosed={programChoosed}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  display='flex'
                  height='100%'
                  width='55rem'
                  justifyContent='center'
                  alignItems='center'
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                  >
                    <FaUserFriends color='#0063a5' size='5rem' />
                    <Typography
                      variant='h5'
                      color='primary'
                      style={{ fontWeight: 'bold' }}
                    >
                      Escolha uma turma
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          }
        </AccordionVertical>
      </AccordionVertical>
    </Page>
  );
};

export default ProgramModelPage;
