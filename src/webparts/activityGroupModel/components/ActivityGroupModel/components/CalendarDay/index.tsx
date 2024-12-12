import * as React from 'react';
import * as moment from 'moment';
import { BackdropStyled, Title } from './styles';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';

import { AccessTime, Delete, Edit } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { useActivity, useConfirmation, useNotification } from '~/hooks';
import { EActivityTypeApplication } from '~/config/enums';
import EditActivityForm from '~/components/EditActivityForm';
import getDurationMoment from '~/utils/getDurationMoment';
import {
  Eventcalendar,
  localePtBR,
  Popup,
  setOptions,
} from '@mobiscroll/react';
import styles from './CalendarDay.module.scss';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  batchUpdateActivityAll,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import formatActivity from '~/utils/formatActivity';
import reorderTimeActivities from '~/utils/reorderTimeActivities';

const locale = 'pt-BR';
moment.locale(locale);
setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
});

interface ICalendarDay {
  scheduleChoosed: any;
  canEdit: boolean;
  refetch: any;
}

const CalendarDay: React.FC<ICalendarDay> = ({
  scheduleChoosed,
  canEdit,
  refetch,
}) => {
  const [visibleTooltip, setVisibleTooltip] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [editDrawer, setEditDrawer] = React.useState({
    open: false,
    item: null,
  });
  const [schedulerData, setSchedulerData] = React.useState([]);
  const [cellDuration, setCellDuration] = React.useState(60);
  const [popup, setPopup] = React.useState<any>({ open: false });

  const { confirmation } = useConfirmation();
  const { notification } = useNotification();
  const dispatch = useDispatch();

  const [{ getActivity, desactiveActivity }] = useActivity(
    { typeApplication: EActivityTypeApplication.MODELO, active: 'Ativo' },
    { manual: true }
  );

  const { tag, space, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;

  React.useEffect(() => {
    setSchedulerData(
      scheduleChoosed?.[`${PREFIX}CronogramadeDia_Atividade`]
        ?.filter((e) => !e?.[`${PREFIX}excluido`] && e?.[`${PREFIX}ativo`])
        ?.map((activity) => ({
          ...activity,
          id: activity?.[`${PREFIX}atividadeid`],
          title: activity?.[`${PREFIX}nome`],
          start: moment(activity?.[`${PREFIX}datahorainicio`]).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          end: moment(activity?.[`${PREFIX}datahorafim`]).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
        }))
    );
  }, [scheduleChoosed]);

  const handleDeleteAppointment = (activityId) => {
    let newSchedulerData = [...schedulerData];
    const itemDeleted = newSchedulerData.find(
      (appointment) => appointment.id === activityId
    );

    newSchedulerData = newSchedulerData?.filter(
      (appointment) => appointment.id !== activityId
    );
    desactiveActivity(
      {
        type: 'definitivo',
        data: {
          [`${PREFIX}atividadeid`]: itemDeleted?.[`${PREFIX}atividadeid`],
        },
      },
      {}
    );

    setSchedulerData(newSchedulerData);
    refetch();
  };

  const handleSuccess = (actv) => {
    refetch();

    setEditDrawer({ ...editDrawer, item: actv });

    setLoading(false);
    notification.success({
      title: 'Sucesso',
      description: 'Atualização realizada com sucesso',
    });
  };

  const handleError = (error) => {
    setLoading(false);

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
          teamId: null,
          programId: null,
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

    const item = {
      ...activityUpdated,
      id: activityUpdated.id,
      [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
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
          teamId: null,
          programId: null,
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

    // dispatch(
    //   updateActivityAll(
    //     {
    //       ...activityUpdated,
    //       id: activityUpdated.id,
    //       [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
    //       scheduleId:
    //         activityUpdated?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
    //           `${PREFIX}cronogramadediaid`
    //         ],
    //       startDate: start.format('YYYY-MM-DD HH:mm:ss'),
    //       endDate: end.format('YYYY-MM-DD HH:mm:ss'),
    //       startTime: start,
    //       endTime: end,
    //       duration: getDurationMoment(start, end),
    //       [`${PREFIX}datahorainicio`]: start.format('YYYY-MM-DD HH:mm:ss'),
    //       [`${PREFIX}datahorafim`]: end.format('YYYY-MM-DD HH:mm:ss'),
    //       spaces: activityUpdated[`${PREFIX}Atividade_Espaco`]?.length
    //         ? activityUpdated[`${PREFIX}Atividade_Espaco`]?.map(
    //             (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
    //           )
    //         : [],
    //       people: activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]
    //         ?.length
    //         ? activityUpdated[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map(
    //             (e) => ({
    //               id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
    //               person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
    //               function: dictTag[e?.[`_${PREFIX}funcao_value`]],
    //             })
    //           )
    //         : [],
    //     },
    //     {
    //       onSuccess: handleSuccess,
    //       onError: handleError,
    //     }
    //   )
    // );
  };

  const handleClosePopup = () => {
    setPopup({ open: false, item: null });
  };

  const handleOpenEditDrawer = (activity) => {
    setVisibleTooltip(false);

    getActivity(activity?.[`${PREFIX}atividadeid`]).then((actv) => {
      setEditDrawer({ open: true, item: actv?.value?.[0] });
    });
  };

  const handleCloseEditDrawer = () => {
    setEditDrawer({ open: false, item: null });
  };

  const onEventClick = React.useCallback((args) => {
    const event = args.event;
    setPopup({ open: true, item: event, anchor: args.domEvent.target });
  }, []);

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
      <BackdropStyled open={loading}>
        <CircularProgress color='inherit' />
      </BackdropStyled>

      <EditActivityForm
        isModel={true}
        onSave={handleEdit}
        setActivity={handleOpenEditDrawer}
        open={editDrawer.open}
        activity={editDrawer.item}
        onClose={handleCloseEditDrawer}
      />

      <Box
        display='flex'
        marginBottom='1rem'
        alignItems='center'
        style={{ gap: '1rem' }}
      >
        <Title>{scheduleChoosed?.[`${PREFIX}nome`]}</Title>
      </Box>

      <Box display='flex' marginBottom='1rem' justifyContent='flex-end'>
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
      <Eventcalendar
        dragToMove={canEdit}
        dragToResize={canEdit}
        width='100%'
        height='65vh'
        firstDay={0}
        renderHeader={() => (
          <Box width='100%' display='flex' justifyContent='center'>
            Atividades
          </Box>
        )}
        selectedDate='2006-01-01T00:00:00'
        locale={localePtBR}
        data={schedulerData}
        min='2006-01-01T00:00:00'
        max='2006-01-01T00:00:00'
        view={{
          schedule: {
            type: 'day',
            allDay: false,
            timeCellStep: cellDuration,
            timeLabelStep: 60,
          },
        }}
        cssClass={styles.calendar}
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
            </>
          ) : null}
        </Box>

        {!popup?.item?.allDay ? (
          <Box display='flex' padding='1rem' style={{ gap: '10px' }}>
            <Button
              fullWidth
              onClick={() => {
                handleClosePopup();
                handleOpenEditDrawer(popup?.item);
              }}
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

export default CalendarDay;
