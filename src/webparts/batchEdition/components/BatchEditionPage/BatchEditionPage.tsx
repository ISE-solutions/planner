import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Page from '~/components/Page';
import { AppState } from '~/store';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import {
  getAcademicRequestsByTeamId,
  getActivities,
  getActivityByProgramId,
  getActivityByTeamId,
} from '~/store/modules/activity/actions';

import { ReactGridContainer } from './styles';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { getSchedules } from '~/store/modules/schedule/actions';
import { getTeamById } from '~/store/modules/team/actions';
import * as moment from 'moment';
import useBatchEdition from './useBatchEdition';
import { executeBatchEdition } from '~/store/modules/batchEdition/actions';
import TableTeam from './components/TableTeam';
import TableSchedule from './components/TableSchedule';
import TableActivity from './components/TableActivity';
import TableActivityName from './components/TableActivityName';
import TableActivityDocuments from './components/TableActivityDocuments';
import TableActivityRequestAcademic from './components/TableActivityRequestAcademic';
import TableActivityEnvolvedPeople from './components/TableActivityEnvolvedPeople';
import { useNotification } from '~/hooks';
import { Backdrop } from '~/components';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication } from '~/config/enums';
import momentToMinutes from '~/utils/momentToMinutes';
import { fetchAllTags } from '~/store/modules/tag/actions';
import { fetchAllPerson } from '~/store/modules/person/actions';
import { Replay } from '@material-ui/icons';

interface IBatchEditionPage {
  context: WebPartContext;
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const BatchEditionPage: React.FC<IBatchEditionPage> = ({ context }) => {
  const [team, setTeam] = React.useState<any>([]);
  const [planningActivities, setPlanningActivities] = React.useState<any>([]);
  const [tab, setTab] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const refFirstRender = React.useRef(true);
  const refFirstInitData = React.useRef(true);

  const queryParameters = new URLSearchParams(window.location.search);
  const teamIdParam = queryParameters.get('teamid');

  const dispatch = useDispatch();
  const { notification } = useNotification();

  const { tag, person, space, finiteInfiniteResource } = useSelector(
    (state: AppState) => state
  );
  const { dictTag, tags } = tag;
  const { dictPeople, persons } = person;
  const { dictSpace, spaces } = space;
  const { finiteInfiniteResources } = finiteInfiniteResource;

  const {
    buildInitDate,
    temperatureOptions,
    modalityOptions,
    modalityDayOptions,
    moduleOptions,
    areaOptions,
    courseOptions,
    functionOptions,
    useOptions,
    useParticipantsOptions,
    equipmentsOptions,
    finiteResources,
    infiniteResources,
  } = useBatchEdition({ tags, finiteInfiniteResources });

  React.useEffect(() => {
    setLoading(true);
    const firstRender = refFirstRender.current;

    if (firstRender) {
      refFirstRender.current = false;
    }

    getActivities({
      active: 'Ativo',
      typeApplication: EActivityTypeApplication.PLANEJAMENTO,
    }).then((data) => setPlanningActivities(data));
  }, []);

  React.useEffect(() => {
    if (teamIdParam && tags.length && spaces.length && persons.length && refFirstInitData.current) {
      getActivityByProgramId(teamIdParam);

      Promise.all([
        getTeamById(teamIdParam),
        getSchedules({ teamId: teamIdParam, active: 'Ativo' }),
        getActivityByTeamId(teamIdParam),
        getAcademicRequestsByTeamId(teamIdParam),
      ])
        .then(([teamSaved, schedules, activities, requestsAcademic]) => {
          buildInitDate({
            dictTag,
            setTeam,
            reset,
            dictPeople,
            dictSpace,
            teamSaved: teamSaved?.value[0],
            schedules: schedules,
            activities: activities?.value,
            requestsAcademic: requestsAcademic,
          });
          setLoading(false);
          refFirstInitData.current = false;
        })
        .catch((error) => {
          setLoading(false);
          notification.error({
            title: 'Falha',
            description: 'Houve um erro interno!',
          });
        });
    }
  }, [teamIdParam, tags, spaces, persons]);

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
    getValues,
  } = useForm({
    mode: 'onChange',
    defaultValues: { team: [], schedules: [], activities: [] },
  });

  const getDates = (item) => {
    const dateRef = item?.startDate?.clone().format('YYYY-MM-DD');
    const startTime = item?.startTime?.clone().format('HH:mm');

    const startDate = moment(`${dateRef} ${startTime}`);

    const momentDuration = item?.duration?.clone();
    const minutes = momentToMinutes(momentDuration);

    return {
      startDate: startDate.format(),
      endDate: startDate.clone().add(minutes, 'minutes').format(),
    };
  };

  const onSubmit = (values) => {
    setLoading(true);

    const acts = values.activities?.map((act) => {
      const spacesToDelete = act?.pastSpaces?.filter(
        (e) => !act.spaces?.some((sp) => sp.value === e[`${PREFIX}espacoid`])
      );
      return { ...act, ...getDates(act), spacesToDelete };
    });

    const scls = values.schedules?.filter((sc) => !sc.blocked && !!sc?.id);
    dispatch(
      executeBatchEdition(
        {
          teams: values.team,
          schedules: scls,
          activities: acts,
        },
        {
          onSuccess: () => {
            setLoading(false);
            notification.success({
              title: 'Sucesso',
              description: 'Cadastro realizado com sucesso',
            });
          },
          onError: (err) => {
            setLoading(false);
            notification.error({
              title: 'Falha',
              description: err?.data?.error?.message,
            });
          },
        }
      )
    );
  };

  const handleScheduleDateChange = (newValue, id) => {
    const i = watch('schedules').findIndex((sc) => sc.id === id);

    setValue(`schedules.${i}.date`, newValue);

    watch('activities')?.forEach((elm, i) => {
      const currentStartDate = elm.startDate;
      const currentEndDate = elm.endDate;

      if (elm?.scheduleId === id) {
        setValue(
          `activities.${i}.startDate`,
          moment(
            `${newValue.format('YYYY-MM-DD')}T${currentStartDate.format(
              'HH:mm'
            )}`
          )
        );

        setValue(
          `activities.${i}.endDate`,
          moment(
            `${newValue.format('YYYY-MM-DD')}T${currentEndDate.format('HH:mm')}`
          )
        );

        setValue(`activities.${i}.date`, newValue.format('DD/MM/YYYY'));
      }
    });
  };

  const handleUpdateData = () => {
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
    dispatch(fetchAllTags({}));
    dispatch(fetchAllPerson({}));
  };

  return (
    <>
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Page
        noPadding
        blockOverflow={false}
        context={context}
        itemsBreadcrumbs={[
          { name: 'Edição em massa', page: 'Edição em massa' },
        ]}
      >
        <ReactGridContainer>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSubmit(onSubmit)}
            >
              Salvar
            </Button>
            
            <Tooltip title='Atualizar'>
              <IconButton onClick={handleUpdateData}>
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>

          <Box marginTop='2rem'>
            <AppBar position='static' color='default'>
              <Tabs
                value={tab}
                onChange={(event: React.ChangeEvent<{}>, newValue) => {
                  setTab(newValue);
                }}
                indicatorColor='primary'
                textColor='primary'
                variant='fullWidth'
                aria-label='full width tabs example'
              >
                <Tab label='Turma' {...a11yProps(0)} />
                <Tab label='Dias de aula' {...a11yProps(1)} />
                <Tab label='Atividades' {...a11yProps(2)} />
                <Tab label='Pessoas Envolvidas' {...a11yProps(3)} />
                <Tab label='Nome Fantasia' {...a11yProps(4)} />
                <Tab label='Documentos' {...a11yProps(5)} />
                <Tab label='Requisição Acadêmica' {...a11yProps(6)} />
              </Tabs>
            </AppBar>
            <TabPanel value={tab} index={0}>
              <TableTeam
                team={team}
                control={control}
                setValue={setValue}
                modalityOptions={modalityOptions}
                temperatureOptions={temperatureOptions}
                persons={persons}
                functionOptions={functionOptions}
                useOptions={useOptions}
                useParticipantsOptions={useParticipantsOptions}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <TableSchedule
                control={control}
                setValue={setValue}
                values={watch('schedules')}
                handleScheduleDateChange={handleScheduleDateChange}
                modalityDayOptions={modalityDayOptions}
                moduleOptions={moduleOptions}
                temperatureOptions={temperatureOptions}
                persons={persons}
                functionOptions={functionOptions}
              />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <TableActivity
                control={control}
                values={watch('activities')}
                setValue={setValue}
                planningActivities={planningActivities}
                temperatureOptions={temperatureOptions}
                areaOptions={areaOptions}
                courseOptions={courseOptions}
                spaces={spaces}
              />
            </TabPanel>
            <TabPanel value={tab} index={3}>
              <TableActivityEnvolvedPeople
                values={watch('activities')}
                functionOptions={functionOptions}
                persons={persons}
                control={control}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel value={tab} index={4}>
              <TableActivityName
                values={watch('activities')}
                control={control}
                setValue={setValue}
                useOptions={useOptions}
              />
            </TabPanel>
            <TabPanel value={tab} index={5}>
              <TableActivityDocuments
                values={watch('activities')}
                control={control}
                setValue={setValue}
              />
            </TabPanel>
            <TabPanel value={tab} index={6}>
              <TableActivityRequestAcademic
                values={watch('activities')}
                control={control}
                setValue={setValue}
                equipmentsOptions={equipmentsOptions}
                finiteResources={finiteResources}
                infiniteResources={infiniteResources}
              />
            </TabPanel>
          </Box>
        </ReactGridContainer>
      </Page>
    </>
  );
};

export default BatchEditionPage;
