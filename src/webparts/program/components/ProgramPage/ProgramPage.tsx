import { Box, CircularProgress, Typography } from '@material-ui/core';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { FaAward, FaUserFriends } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AccordionVertical from '~/components/AccordionVertical';
import Page from '~/components/Page';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { useLoggedUser, useResource, useScheduleDay } from '~/hooks';
import { AppState } from '~/store';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAllTeams } from '~/store/modules/team/actions';
import DetailProgram from './components/DetailProgram';
import DetailTeam from './components/DetailTeam';
import ListPrograms from './components/ListPrograms';
import {
  fetchAllPrograms,
  getProgramId,
} from '~/store/modules/program/actions';
import { getActivity } from '~/store/modules/activity/actions';
import { TYPE_PROGRAM_FILTER } from '~/store/modules/program/utils';
import * as moment from 'moment';
import { Backdrop } from '~/components';

interface IProgramPage {
  context: WebPartContext;
}

const ProgramPage: React.FC<IProgramPage> = ({ context }) => {
  const [programChoosed, setProgramChoosed] = React.useState(null);
  const [teamChoosed, setTeamChoosed] = React.useState(null);
  const [activityChoosed, setActivityChoosed] = React.useState({
    open: false,
    item: null,
  });
  const [listMode, setListMode] = React.useState(true);
  const refFirstRender = React.useRef(true);
  const [filterProgram, setFilterProgram] = React.useState<any>({
    active: 'Ativo',
    type: TYPE_PROGRAM_FILTER.PROGRAMA,
    model: false,
  });
  const queryParameters = new URLSearchParams(window.location.search);
  const programIdParam = queryParameters.get('programid');
  const activityIdParam = queryParameters.get('activityid');

  const dispatch = useDispatch();

  const [{ resources, loading, fetchResources, getResources }] = useResource(
    {},
    { manual: true }
  );

  const { currentUser } = useLoggedUser();
  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;

  const [{ schedule, refetch: refetchSchedule, updateSchedule }] =
    useScheduleDay(
      {
        teamId: teamChoosed?.[`${PREFIX}turmaid`],
        active: 'Ativo',
      },
      { manual: true }
    );

  const refetchResource = () => {
    const start = schedule?.[0]?.[`${PREFIX}data`];
    const end = schedule?.[schedule?.length - 1]?.[`${PREFIX}data`];

    fetchResources({
      startDate: moment.utc(start),
      endDate: moment.utc(end),
    });
  };

  React.useEffect(() => {
    const firstRender = refFirstRender.current;

    if (firstRender) {
      refFirstRender.current = false;
    }
  }, []);

  React.useEffect(() => {
    if (schedule?.length) {
      refetchResource();
    }
  }, [schedule]);

  React.useEffect(() => {
    if (activityIdParam) {
      getActivity(activityIdParam).then(({ value }) =>
        setActivityChoosed({ open: true, item: value[0] })
      );
    }
  }, [activityIdParam]);

  React.useEffect(() => {
    if (programIdParam) {
      getProgramId(programIdParam).then(({ value }) =>
        setProgramChoosed(value[0])
      );
    }
  }, [programIdParam]);

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  React.useEffect(() => {
    if (programChoosed) {
      refetchTeam({
        programId: programChoosed?.[`${PREFIX}programaid`],
        active: 'Ativo',
        model: false,
      });
    }
  }, [programChoosed]);

  React.useEffect(() => {
    if (teamChoosed) {
      refetchSchedule();
    }
  }, [teamChoosed?.[`${PREFIX}turmaid`]]);

  React.useEffect(() => {
    setTeamChoosed(null);
  }, [programChoosed]);

  const refetchTeam = (ftr?: any) => {
    dispatch(
      fetchAllTeams(
        ftr || {
          programId: programChoosed?.[`${PREFIX}programaid`],
          active: 'Ativo',
          model: false,
        }
      )
    );
  };

  const refetchProgram = (ftr?: any) => {
    dispatch(fetchAllPrograms(ftr || filterProgram));
  };

  const isProgramResponsible = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return programChoosed?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (
            func?.[`${PREFIX}nome`] === EFatherTag.RESPONSAVEL_PELO_PROGRAMA
          ) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, programChoosed, dictPeople]);

  const isProgramDirector = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return programChoosed?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (func?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, programChoosed, dictPeople]);

  const isFinance = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return programChoosed?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (func?.[`${PREFIX}nome`] === EFatherTag.FINANCEIRO) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, programChoosed, dictPeople]);

  const isHeadOfService = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return programChoosed?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (func?.[`${PREFIX}nome`] === EFatherTag.FINANCEIRO) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, programChoosed, dictPeople]);

  const programTemperature = React.useMemo(
    () => programChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`],
    [programChoosed]
  );

  const teamTemperature = React.useMemo(
    () => teamChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`],
    [teamChoosed]
  );

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Page
        noPadding
        context={context}
        itemsBreadcrumbs={[{ name: 'Programas', page: 'Programa' }]}
      >
        <AccordionVertical
          defaultExpanded
          title='Programas'
          width={260}
          expansibleColumn={
            <ListPrograms
              context={context}
              currentUser={currentUser}
              programChoosed={programChoosed}
              refetch={refetchProgram}
              setFilter={setFilterProgram}
              filter={filterProgram}
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
            width={270}
            expansibleColumn={
              <>
                {programChoosed ? (
                  <DetailProgram
                    context={context}
                    refetch={refetchTeam}
                    programTemperature={programTemperature}
                    isProgramResponsible={isProgramResponsible}
                    isProgramDirector={isProgramDirector}
                    isFinance={isFinance}
                    refetchSchedule={refetchSchedule}
                    refetchResource={refetchResource}
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
                        Escolha um Programa
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
                  <Box marginRight='1rem'>
                    <DetailTeam
                      currentUser={currentUser}
                      programChoosed={programChoosed}
                      activityChoosed={activityChoosed}
                      setActivityChoosed={setActivityChoosed}
                      teamTemperature={teamTemperature}
                      programTemperature={programTemperature}
                      isProgramResponsible={isProgramResponsible}
                      isProgramDirector={isProgramDirector}
                      isHeadOfService={isHeadOfService}
                      context={context}
                      resources={resources}
                      schedules={schedule}
                      listMode={listMode}
                      handleModeView={() => setListMode(!listMode)}
                      refetchTeam={refetchTeam}
                      refetchProgram={refetchProgram}
                      refetchSchedule={refetchSchedule}
                      refetchResource={refetchResource}
                      updateSchedule={updateSchedule}
                      teamChoosed={teamChoosed}
                    />
                  </Box>
                ) : (
                  <Box
                    display='flex'
                    height='100%'
                    // width='55rem'
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
    </>
  );
};

export default ProgramPage;
