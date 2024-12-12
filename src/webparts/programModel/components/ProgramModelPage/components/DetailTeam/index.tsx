import * as React from 'react';
import * as moment from 'moment';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { IoCalendarNumberSharp } from 'react-icons/io5';

import {
  AccessTime,
  CalendarTodayRounded,
  Delete,
  Edit,
  List,
  MoreVert,
} from '@material-ui/icons';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import EditActivityForm from '~/components/EditActivityForm';
import { PREFIX } from '~/config/database';
import { useActivity, useConfirmation, useNotification } from '~/hooks';
import { Title } from '../DetailProgram/styles';
import { EActivityTypeApplication } from '~/config/enums';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import getDurationMoment from '~/utils/getDurationMoment';
import styles from './DetailTeam.module.scss';
import {
  CalendarNext,
  CalendarPrev,
  CalendarToday,
  Eventcalendar,
  formatDate,
  localePtBR,
  Popup,
  SegmentedGroup,
  SegmentedItem,
} from '@mobiscroll/react';
import {
  BoxDay,
  TitleResource,
} from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  batchUpdateActivityAll,
  deleteActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import { deleteSchedule } from '~/store/modules/schedule/actions';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import formatActivity from '~/utils/formatActivity';

const locale = 'pt-BR';
moment.locale(locale);

interface IDetailTeam {
  teamChoosed: any;
  programChoosed: any;
  listMode: boolean;
  canEdit: boolean;
  refetchSchedule: any;
  refetchTeam: any;
  scheduleChoosed: any;
  schedules: any[];
  context: WebPartContext;
  width?: number;
  handleModeView: () => void;
}

const DetailTeam: React.FC<IDetailTeam> = ({
  teamChoosed,
  programChoosed,
  width,
  listMode,
  canEdit,
  refetchSchedule,
  schedules,
  context,
  scheduleChoosed,
  handleModeView,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [visibleTooltip, setVisibleTooltip] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [popup, setPopup] = React.useState<any>({ open: false });
  const [editDrawer, setEditDrawer] = React.useState({
    open: false,
    item: null,
  });
  const [view, setView] = React.useState('week');
  const [schedulerData, setSchedulerData] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [cellDuration, setCellDuration] = React.useState(60);
  const [currentDate, setCurrentDate] = React.useState('2006-01-01T00:00:00');

  const { confirmation } = useConfirmation();
  const { notification } = useNotification();
  const { tag, space, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;

  const [{ activities, changeActivityDate, desactiveActivity, refetch }] =
    useActivity({
      typeApplication: EActivityTypeApplication.MODELO,
      active: 'Ativo',
      teamId: teamChoosed?.[`${PREFIX}turmaid`],
    });

  const dispatch = useDispatch();

  React.useEffect(() => {
    refetchSchedule();
  }, [teamChoosed?.[`${PREFIX}turmaid`]]);

  React.useEffect(() => {
    if (schedules?.length) {
      setModules(
        schedules
          .filter((sched) => !!sched?.[`${PREFIX}Modulo`])
          .map((sched) => ({
            id: sched?.[`${PREFIX}cronogramadediaid`],
            title: sched?.[`${PREFIX}Modulo`]?.[`${PREFIX}nome`],
            start: sched?.[`${PREFIX}data`],
            end: moment
              .utc(sched?.[`${PREFIX}data`])
              .add(30, 'minutes')
              .format(),
            startDate: sched?.[`${PREFIX}data`],
            endDate: moment
              .utc(sched?.[`${PREFIX}data`])
              .add(30, 'minutes')
              .format(),
            allDay: true,
            module: 'Módulo',
          }))
      );
    }
  }, [schedules]);

  React.useEffect(() => {
    if (activities?.length) {
      setSchedulerData(
        activities.map((activity) => ({
          ...activity,
          id: activity?.[`${PREFIX}atividadeid`],
          title: activity?.[`${PREFIX}nome`],
          start: moment(activity?.[`${PREFIX}datahorainicio`]).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          end: moment(activity?.[`${PREFIX}datahorafim`]).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          startDate: activity?.[`${PREFIX}datahorainicio`],
          endDate: activity?.[`${PREFIX}datahorafim`],
        }))
      );
    }
  }, [activities]);

  const allMessages = {
    [locale]: {
      confirmDeleteMessage:
        'Você tem certeza que deseja excluir o apontamento?',
      deleteButton: 'Excluir',
      saveButton: 'Salvar',
      commitCommand: 'Salvar',
      cancelButton: 'Cancelar',
      discardButton: 'Descartar',
      detailsLabel: 'Nome',
      today: 'Hoje',
      allDay: 'Módulo',
    },
  };

  const handleDeleteAppointment = (activityId) => {
    setVisibleTooltip(false);
    let newSchedulerData = [...schedulerData];
    const itemDeleted = newSchedulerData.find(
      (appointment) => appointment.id === activityId
    );

    newSchedulerData = newSchedulerData.filter(
      (appointment) => appointment.id !== activityId
    );
    dispatch(
      deleteActivity(
        { id: itemDeleted?.[`${PREFIX}atividadeid`], item: itemDeleted },
        { onSuccess: () => null, onError: () => null }
      )
    );
    setSchedulerData(newSchedulerData);
  };

  const handleClose = () => {
    refetch();
    setVisible(false);
  };

  const handleSuccess = (actv) => {
    refetch();
    setEditDrawer({ ...editDrawer, item: actv });

    notification.success({
      title: 'Sucesso',
      description: 'Atualização realizada com sucesso',
    });
  };

  const handleError = (error) => {
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleEdit = (item, onSuccess?) => {
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

    const activitiesFromDay = schedulerData
      ?.filter(
        (actv) =>
          moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
          moment(item?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')
      )
      ?.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))
      ?.sort((a, b) => a.startTime.unix() - b.startTime.unix());

    const actvIndex = activitiesFromDay?.findIndex(
      (e) => e?.id === item?.[`${PREFIX}atividadeid`]
    );

    let nextActivities = activitiesFromDay?.slice(
      actvIndex + 1,
      activitiesFromDay?.length
    );

    const lastDateTime = moment.utc(item.endDate);

    let nextChanges = reorderTimeActivities(lastDateTime, nextActivities)?.map(
      (actv) => ({
        [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
        deleted: actv?.deleted,
        ...formatActivity(actv, {
          dictPeople: dictPeople,
          dictSpace: dictSpace,
          dictTag: dictTag,
        }),
      })
    );

    const scheduleEdit = item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
    const activitiesToEdit = [
      {
        ...item,
        [`${PREFIX}inicio`]: item.startTime.format('HH:mm'),
        [`${PREFIX}fim`]: item.endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: moment
          .utc(item.startDate)
          .format('YYYY-MM-DDTHH:mm:ss'),
        [`${PREFIX}datahorafim`]: moment
          .utc(item.endDate)
          .format('YYYY-MM-DDTHH:mm:ss'),
        startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'),
        endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'),
        teamId: teamChoosed?.[`${PREFIX}turmaid`],
        programId: teamChoosed?.[`_${PREFIX}programa_value`],
        scheduleId:
          item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
            `${PREFIX}cronogramadediaid`
          ],
        // activities: nextChanges,
        spacesToDelete: spacesToDelete,
        finiteInfiniteResourceToDelete: finiteInfiniteResourceToDelete,
        equipmentsToDelete: equipmentsToDelete,
      },
      ...nextChanges,
    ];

    dispatch(
      batchUpdateActivityAll(
        activitiesToEdit,
        item,
        {
          teamId: teamChoosed?.[`${PREFIX}turmaid`],
          programId: teamChoosed?.[`_${PREFIX}programa_value`],
          scheduleId: scheduleEdit?.[`${PREFIX}cronogramadediaid`],
        },
        {
          onSuccess: (actv) => {
            handleSuccess(actv);
            onSuccess?.();
          },
          onError: handleError,
        }
      )
    );

    let newSchedulerData = [...schedulerData];
    newSchedulerData = newSchedulerData.map((appointment) =>
      appointment.id === item.id ? item : appointment
    );

    setSchedulerData(newSchedulerData);
  };

  const handleOpenEditDrawer = (activity) => {
    handleClosePopup();
    setEditDrawer({ open: true, item: activity });
  };

  const handleCloseEditDrawer = () => {
    setEditDrawer({ open: false, item: null });
  };

  const onItemChange = ({ event, oldEvent }) => {
    if (event.allDay) {
      setSchedulerData(_.cloneDeep(schedulerData));
      return;
    }
    setLoading(true);

    const start = moment(event.start.toString());
    const end = moment(event.end.toString());
    const activityUpdated = oldEvent;

    if (start.day() != end.day()) {
      return;
    }

    if (
      start.format('YYYY-MM-DD') !==
      moment(activityUpdated.start).format('YYYY-MM-DD')
    ) {
      const previousSchedule =
        activityUpdated?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
      const newSchedule = schedules.find((s) =>
        moment
          .utc(s?.[`${PREFIX}data`])
          .startOf('day')
          .isSame(moment(start.startOf('day')))
      );

      if (!newSchedule) {
        confirmation.openConfirmation({
          title: 'Cronograma não encontrado',
          description: `O dia ${start.format(
            'DD/MM/YYYY'
          )} não está cadastrado, deseja realizar a criação?`,
          onConfirm: () => setVisible(true),
        });

        setLoading(false);
        return;
      }

      changeActivityDate(
        {
          ...activityUpdated,
          id: activityUpdated.id,
          [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
          startDate: start.format(),
          endDate: end.format(),
          startTime: start,
          endTime: end,
          duration: getDurationMoment(start, end),
        },
        previousSchedule?.[`${PREFIX}cronogramadediaid`],
        newSchedule?.[`${PREFIX}cronogramadediaid`],
        {
          onSuccess: handleSuccess,
          onError: handleError,
        }
      );

      return;
    }

    const item = {
      ...activityUpdated,
      id: activityUpdated.id,
      [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
      teamId: teamChoosed?.[`${PREFIX}turmaid`],
      programId: teamChoosed?.[`_${PREFIX}programa_value`],
      scheduleId:
        activityUpdated?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
          `${PREFIX}cronogramadediaid`
        ],
      startDate: start.format(),
      endDate: end.format(),
      startTime: start,
      endTime: end,
      duration: getDurationMoment(start, end),
      [`${PREFIX}datahorainicio`]: start.format(),
      [`${PREFIX}datahorafim`]: end.format(),
      spaces: activityUpdated[`${PREFIX}Atividade_Espaco`]?.length
        ? activityUpdated[`${PREFIX}Atividade_Espaco`]?.map(
            (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
          )
        : [],
      people: activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
        ? activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => ({
            id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: dictTag[e?.[`_${PREFIX}funcao_value`]],
          }))
        : [],
    };

    const activitiesFromDay = schedulerData
      ?.filter(
        (actv) =>
          moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
          moment(item?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')
      )
      ?.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))
      ?.sort((a, b) => a.startTime.unix() - b.startTime.unix());

    const actvIndex = activitiesFromDay?.findIndex(
      (e) => e?.id === item?.[`${PREFIX}atividadeid`]
    );

    let nextActivities = activitiesFromDay?.slice(
      actvIndex + 1,
      activitiesFromDay?.length
    );

    const lastDateTime = moment(
      moment(item.endDate).format('YYYY-MM-DD HH:mm:ss')
    );

    let nextChanges = reorderTimeActivities(lastDateTime, nextActivities)?.map(
      (actv) => ({
        [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
        deleted: actv?.deleted,
        ...formatActivity(actv, {
          dictPeople: dictPeople,
          dictSpace: dictSpace,
          dictTag: dictTag,
        }),
      })
    );

    const scheduleEdit = item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
    const activitiesToEdit = [
      {
        ...item,
        [`${PREFIX}inicio`]: item.startTime.format('HH:mm'),
        [`${PREFIX}fim`]: item.endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: moment
          .utc(item.startDate)
          .format('YYYY-MM-DDTHH:mm:ss'),
        [`${PREFIX}datahorafim`]: moment
          .utc(item.endDate)
          .format('YYYY-MM-DDTHH:mm:ss'),
        startDate: moment.utc(item.startDate).format('YYYY-MM-DD HH:mm'),
        endDate: moment.utc(item.endDate).format('YYYY-MM-DD HH:mm'),
        teamId: teamChoosed?.[`${PREFIX}turmaid`],
        programId: teamChoosed?.[`_${PREFIX}programa_value`],
        scheduleId:
          item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
            `${PREFIX}cronogramadediaid`
          ],
      },
      ...nextChanges,
    ];

    dispatch(
      batchUpdateActivityAll(
        activitiesToEdit,
        item,
        {
          teamId: teamChoosed?.[`${PREFIX}turmaid`],
          programId: teamChoosed?.[`_${PREFIX}programa_value`],
          scheduleId: scheduleEdit?.[`${PREFIX}cronogramadediaid`],
        },
        {
          onSuccess: (actv) => {
            handleSuccess(actv);
          },
          onError: handleError,
        }
      )
    );
  };

  const handleOption = (event, item) => {
    setItemSelected(item);
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteSchedule = () => {
    handleCloseAnchor();

    const activitiesToDelete = activities.filter(
      (actv) =>
        moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
        moment.utc(itemSelected?.[`${PREFIX}data`]).format('DD/MM/YYYY')
    );

    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir o dia ${moment
        .utc(itemSelected?.[`${PREFIX}data`])
        .format('DD/MM')}?`,
      onConfirm: () => {
        dispatch(
          deleteSchedule(
            itemSelected[`${PREFIX}cronogramadediaid`],
            activitiesToDelete,
            {
              onSuccess: refetchSchedule,
              onError: () => null,
            }
          )
        );
      },
    });
  };

  const renderDay = (args) => {
    const date = args.date;
    const sched = schedules?.find((sc) =>
      moment
        .utc(sc?.[`${PREFIX}data`])
        .startOf('day')
        .isSame(moment(date).startOf('day'))
    );

    return (
      <BoxDay hasInfo={!!sched}>
        <Box
          // width='88vh'
          paddingLeft='10%'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <div>{formatDate('DDD', date)}</div>
          <div>{formatDate('DD', date)}</div>
        </Box>
        {!!sched ? (
          <Box
            style={{ cursor: 'pointer' }}
            onClick={(event) => handleOption(event, sched)}
          >
            <MoreVert />
          </Box>
        ) : null}
      </BoxDay>
    );
  };

  const onEventClick = React.useCallback((args) => {
    const event = args.event;
    setPopup({ open: true, item: event, anchor: args.domEvent.target });
  }, []);

  const handleClosePopup = () => {
    setPopup({ open: false, item: null });
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleDetail = () => {
    setVisible(true);
    handleCloseAnchor();
  };

  const currentView = React.useMemo(() => {
    let calView;
    if (listMode) {
      return {
        schedule: {
          type: 'day',
          timeCellStep: cellDuration,
          timeLabelStep: 60,
        },
      };
    }

    switch (view) {
      case 'year':
        calView = {
          calendar: { type: 'year' },
        };
        break;
      case 'month':
        calView = {
          calendar: { labels: true },
        };
        break;
      case 'week':
        calView = {
          schedule: {
            type: 'week',
            firstWeekDay: 0,
            timeCellStep: cellDuration,
            timeLabelStep: 60,
          },
        };
        break;
      case 'day':
        calView = {
          schedule: {
            type: 'day',
            timeCellStep: cellDuration,
            timeLabelStep: 60,
          },
        };
        break;
      case 'agenda':
        calView = {
          calendar: { type: 'week' },
          agenda: { type: 'week' },
        };
        break;
    }

    return calView;
  }, [cellDuration, view, listMode]);

  const customWithNavButtons = () => {
    if (listMode) {
      return (
        <Box width='100%' display='flex' justifyContent='center'>
          Atividades
        </Box>
      );
    }

    return (
      <>
        <Box flex='1 0 0'>
          <SegmentedGroup
            value={view}
            onChange={(event) => setView(event.target.value)}
          >
            <SegmentedItem value='year'>Ano</SegmentedItem>
            <SegmentedItem value='month'>Mês</SegmentedItem>
            <SegmentedItem value='week'>Semana</SegmentedItem>
            <SegmentedItem value='day'>Dia</SegmentedItem>
            <SegmentedItem value='agenda'>Agenda</SegmentedItem>
          </SegmentedGroup>
        </Box>
        <CalendarPrev className='cal-header-prev' />
        <CalendarToday className='cal-header-today' />
        <CalendarNext className='cal-header-next' />
      </>
    );
  };

  const responsivePopup = {
    medium: {
      display: 'center',
      width: 400,
      fullScreen: false,
      touchUi: false,
      showOverlay: false,
    },
  };

  return (
    <>
      <ScheduleDayForm
        isModel
        titleRequired={false}
        visible={visible}
        schedule={itemSelected}
        context={context}
        team={teamChoosed}
        program={programChoosed}
        teamId={teamChoosed?.[`${PREFIX}turmaid`]}
        programId={teamChoosed?.[`_${PREFIX}programa_value`]}
        handleClose={handleClose}
      />

      <EditActivityForm
        isModel={true}
        team={teamChoosed}
        program={programChoosed}
        onSave={handleEdit}
        open={editDrawer.open}
        activity={editDrawer.item}
        onClose={handleCloseEditDrawer}
        setActivity={handleOpenEditDrawer}
      />

      <Box
        display='flex'
        marginBottom='1rem'
        alignItems='center'
        width={width ? `${width}px` : '100%'}
        style={{ gap: '1rem' }}
      >
        <Title>{teamChoosed?.[`${PREFIX}nome`]}</Title>

        <Button
          variant='contained'
          color='primary'
          disabled={!canEdit}
          startIcon={<IoCalendarNumberSharp />}
          onClick={() => setVisible(true)}
        >
          Criar dia de aula
        </Button>
      </Box>

      <Box display='flex' justifyContent='space-between' paddingBottom='10px'>
        <IconButton onClick={handleModeView}>
          {listMode ? <CalendarTodayRounded /> : <List />}
        </IconButton>
        <TextField
          select
          fullWidth
          style={{ maxWidth: '10rem' }}
          value={cellDuration}
          label='Duração do Intervalo'
          onChange={(event) => setCellDuration(+event.target.value)}
        >
          <MenuItem value={15}>15 Minutos</MenuItem>
          <MenuItem value={30}>30 Minutos</MenuItem>
          <MenuItem value={60}>60 Minutos</MenuItem>
        </TextField>
      </Box>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAnchor}
      >
        <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
        <MenuItem onClick={handleDeleteSchedule}>Excluir</MenuItem>
      </Menu>

      <Eventcalendar
        dragToMove={canEdit}
        dragToResize={canEdit}
        allDayText='Módulo'
        width='100%'
        height='65vh'
        locale={localePtBR}
        min='2006-01-01T00:00:00'
        firstDay={0}
        data={[...(schedulerData || []), ...(modules || [])]}
        view={currentView}
        selectedDate={scheduleChoosed?.[`${PREFIX}data`] || currentDate}
        // @ts-ignore
        onSelectedDateChange={(e) => setCurrentDate(e.date.toISOString())}
        renderHeader={customWithNavButtons}
        renderDay={view === 'week' && renderDay}
        cssClass={listMode && styles.calendar}
        onEventUpdate={onItemChange}
        onEventClick={onEventClick}
      />

      <Popup
        showArrow
        showOverlay
        display='anchored'
        anchor={popup.anchor}
        fullScreen={true}
        scrollLock={false}
        contentPadding={false}
        isOpen={popup.open}
        onClose={handleClosePopup}
        responsive={responsivePopup}
        cssClass={styles.popup}
      >
        <Box width='100%' padding='1rem'>
          <Typography variant='h5' align='center'>
            {popup?.item?.title}
          </Typography>
        </Box>
        <Divider />

        <Box padding='1rem'>
          {!popup?.item?.allDay ? (
            <>
              <Grid container>
                <Grid item xs={1}>
                  <Box width='100%' justifyContent='center' alignItems='center'>
                    <AccessTime />
                  </Box>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant='body1'>
                    {moment(popup?.item?.start).format('HH:mm')} -{' '}
                    {moment(popup?.item?.end).format('HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
              <TitleResource>Recursos</TitleResource>
            </>
          ) : null}

          <Grid container style={{ maxHeight: '15rem', overflow: 'auto' }}>
            {popup?.item?.[`${PREFIX}recursos_Atividade`]?.map((item) => (
              <>
                <Grid item xs={11}>
                  <Typography variant='body1'>
                    {item?.person?.[`${PREFIX}nome`] ||
                      item?.space?.[`${PREFIX}nome`] ||
                      item?.finiteInfiniteResources?.[`${PREFIX}nome`]}
                  </Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </Box>

        {!popup?.item?.allDay ? (
          <Box display='flex' padding='1rem' style={{ gap: '10px' }}>
            <Button
              fullWidth
              onClick={() => handleOpenEditDrawer(popup?.item)}
              startIcon={<Edit />}
              variant='contained'
              color='primary'
            >
              Editar
            </Button>
            <Button
              fullWidth
              disabled={!canEdit}
              onClick={() => {
                handleClosePopup();
                confirmation.openConfirmation({
                  title: 'Excluir Apontamento',
                  description:
                    'Você tem certeza que deseja excluir o apontamento?',
                  onConfirm: () => handleDeleteAppointment(popup?.item?.id),
                });
              }}
              startIcon={<Delete />}
              variant='contained'
              color='secondary'
            >
              Excluir
            </Button>
          </Box>
        ) : null}
      </Popup>
    </>
  );
};

export default DetailTeam;
