import * as React from 'react';
import * as moment from 'moment';
import {
  BackdropStyled,
  BoxDay,
  SectionList,
  SectionNamePopup,
  TitleResource,
} from './styles';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import {
  AccessTime,
  ArrowBackIos,
  ArrowForwardIos,
  CalendarTodayRounded,
  CheckCircle,
  Delete,
  Edit,
  Error,
  FormatListBulleted,
  List,
  MoreVert,
  Save,
} from '@material-ui/icons';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import EditActivityForm from '~/components/EditActivityForm';
import { ACTIVITY, PREFIX, PROGRAM, TAG, TEAM } from '~/config/database';
import { useConfirmation, useNotification, useTask } from '~/hooks';
import { EActivityTypeApplication, EFatherTag, EGroups } from '~/config/enums';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import getDurationMoment from '~/utils/getDurationMoment';
import {
  CalendarNav,
  CalendarNext,
  CalendarPrev,
  CalendarToday,
  Eventcalendar,
  formatDate,
  localePtBR,
  MbscCellClickEvent,
  Popup,
  SegmentedGroup,
  SegmentedItem,
  setOptions,
} from '@mobiscroll/react';
import styles from './DetailTeam.module.scss';
import checkConflictDate from '~/utils/checkConflictDate';
import * as _ from 'lodash';
import { Title } from '~/components/CustomCard';
import temperatureColor from '~/utils/temperatureColor';
import { IExceptionOption } from '~/hooks/types';
import ListDays from './ListDays';
import CalendarDrawer from './CalendarDrawer';
import formatActivityModel from '~/utils/formatActivityModel';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  batchUpdateActivity,
  batchUpdateActivityAll,
  changeActivityDate,
  deleteActivity,
  fetchAllActivities,
  getActivity,
  updateActivityAll,
} from '~/store/modules/activity/actions';
import AddActivity from './AddActivity';
import { EventcalendarBase } from '@mobiscroll/react/dist/src/core/components/eventcalendar/eventcalendar';
import {
  addUpdateSchedule,
  deleteSchedule,
} from '~/store/modules/schedule/actions';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import formatActivity from '~/utils/formatActivity';
import CloneSchedule from './CloneSchedule';
import {
  deleteByActivity,
  deleteBySchedule,
} from '~/store/modules/resource/actions';
import momentToMinutes from '~/utils/momentToMinutes';
import useBreakpoints from '~/hooks/useBreakpoints';

const locale = 'pt-BR';
moment.locale(locale);

setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
});

interface IDetailTeam {
  teamChoosed: any;
  programChoosed: any;
  teamTemperature: any;
  programTemperature: any;
  activityChoosed: {
    open: boolean;
    item: any;
  };
  listMode: boolean;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isHeadOfService: boolean;
  currentUser: any;
  refetchSchedule: any;
  refetchResource: any;
  refetchTeam: any;
  refetchProgram: any;
  schedules: any[];
  context: WebPartContext;
  width?: number;
  resources: any[];
  handleModeView: () => void;
  setActivityChoosed: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      item: any;
    }>
  >;
  updateSchedule: (
    id: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
}

const DetailTeam: React.FC<IDetailTeam> = ({
  teamChoosed,
  programChoosed,
  currentUser,
  isProgramResponsible,
  isProgramDirector,
  isHeadOfService,
  width,
  listMode,
  refetchTeam,
  refetchSchedule,
  refetchResource,
  refetchProgram,
  schedules,
  resources,
  context,
  activityChoosed,
  handleModeView,
  programTemperature,
  teamTemperature,
  setActivityChoosed,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [anchorScheduleEl, setAnchorScheduleEl] = React.useState(null);
  const [anchorMoreOptionEl, setAnchorMoreOptionEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [openCloneSchedule, setOpenCloneSchedule] = React.useState(false);
  const [undoNextActivities, setUndoNextActivities] = React.useState<any[]>();

  const [addActivity, setAddActivity] = React.useState({
    open: false,
    date: null,
    schedule: null,
  });
  const [loadingSaveActivityModel, setLoadingSaveActivityModel] =
    React.useState(false);

  const [currentDate, setCurrentDate] = React.useState();
  const [schedulerData, setSchedulerData] = React.useState([]);
  const [modules, setModules] = React.useState([]);
  const [cellDuration, setCellDuration] = React.useState(60);
  const [popup, setPopup] = React.useState<any>({ open: false });
  const [popupHover, setPopupHover] = React.useState<any>({ open: false });
  const [scheduleChoosed, setScheduleChoosed] = React.useState(null);
  const [calendarDrawer, setCalendarDrawer] = React.useState<any>({
    open: false,
  });
  const [view, setView] = React.useState('week');
  const [activitiesModelChoosed, setActivitiesModelChoosed] = React.useState(
    []
  );
  const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
  const [modelName, setModelName] = React.useState<any>({
    open: false,
    loadSpaces: true,
    loadPerson: true,
    name: '',
    error: '',
  });
  const [activityModelName, setActivityModelName] = React.useState<any>({
    open: false,
    loadSpaces: true,
    loadPerson: true,
    name: '',
    error: '',
  });

  const dispatch = useDispatch();

  const timerRef = React.useRef(null);
  const { tag, space, person, activity, finiteInfiniteResource } = useSelector(
    (state: AppState) => state
  );
  const { tags, dictTag } = tag;
  const { dictSpace } = space;
  const { dictPeople } = person;
  const { activities, loading: loadingActivity } = activity;
  const { dictFiniteInfiniteResources } = finiteInfiniteResource;

  const { confirmation } = useConfirmation();
  const { notification } = useNotification();

  const [{ bulkAddTaks }] = useTask({}, { manual: false });

  const checkConflict = (activity: any, resource: any) => {
    let resourcesConflicted = [];

    const datesAppointment = [
      moment(activity?.[`${PREFIX}datahorainicio`]),
      moment(activity?.[`${PREFIX}datahorafim`]),
    ] as [moment.Moment, moment.Moment];

    resourcesConflicted = resources?.filter((res) => {
      const datesResource = [
        moment(res?.[`${PREFIX}inicio`]),
        moment(res?.[`${PREFIX}fim`]),
      ] as [moment.Moment, moment.Moment];

      return (
        checkConflictDate(datesAppointment, datesResource) &&
        res?.[`_${PREFIX}atividade_value`] !==
          resource?.[`_${PREFIX}atividade_value`] &&
        ((resource?.[`_${PREFIX}espaco_value`] &&
          resource?.[`_${PREFIX}espaco_value`] ===
            res?.[`_${PREFIX}espaco_value`]) ||
          (resource?.[`_${PREFIX}pessoa_value`] &&
            resource?.[`_${PREFIX}pessoa_value`] ===
              res?.[`_${PREFIX}pessoa_value`]))
      );
    });

    return resourcesConflicted;
  };

  React.useEffect(() => {
    if (teamChoosed) {
      refetch();
    }
  }, [teamChoosed]);

  React.useEffect(() => {
    setModules(
      schedules
        ?.filter((sched) => !!sched?.[`${PREFIX}Modulo`])
        ?.map((sched) => ({
          id: sched?.[`${PREFIX}cronogramadediaid`],
          title: sched?.[`${PREFIX}Modulo`]?.[`${PREFIX}nome`],
          start: sched?.[`${PREFIX}data`],
          end: moment.utc(sched?.[`${PREFIX}data`]).add(30, 'minutes').format(),
          startDate: sched?.[`${PREFIX}data`],
          endDate: moment
            .utc(sched?.[`${PREFIX}data`])
            .add(30, 'minutes')
            .format(),
          allDay: true,
          color: '#9e9e9e',
          editable: false,
        }))
    );
  }, [schedules]);

  React.useEffect(() => {
    if (!listMode) {
      setCurrentDate(schedules?.[0]?.[`${PREFIX}data`]);
    }
  }, [listMode]);

  React.useEffect(() => {
    if (Object.keys(dictTag).length) {
      adapterSchedulerData();
    }
  }, [activities, dictTag, resources]);

  const refetch = () => {
    // refetchResource?.()
    dispatch(
      fetchAllActivities({
        typeApplication: EActivityTypeApplication.APLICACAO,
        active: 'Ativo',
        teamId: teamChoosed?.[`${PREFIX}turmaid`],
      })
    );
  };

  const myGroup = () => {
    if (currentUser?.isPlanning) {
      return EGroups.PLANEJAMENTO;
    }

    if (currentUser?.isAdmission) {
      return EGroups.ADMISSOES;
    }

    return '';
  };

  const adapterSchedulerData = () => {
    const arrScheduler = [];
    try {
      for (let j = 0; j < activities?.length; j++) {
        const activity = activities[j];
        let hasConflict = false;
        const resourcesActivity = [];

        const resourcesToAnalizy = activity?.[
          `${PREFIX}recursos_Atividade`
        ]?.filter((e) => !e?.[`${PREFIX}excluido`]);

        for (let i = 0; i < resourcesToAnalizy.length; i++) {
          const res = activity?.[`${PREFIX}recursos_Atividade`]?.[i];

          const resourceConflict = checkConflict(activity, res);
          const visibleConflicts = [];

          for (let k = 0; k < resourceConflict?.length; k++) {
            const resConflict = resourceConflict[k];
            const temp =
              dictTag?.[
                resConflict?.[`${PREFIX}Atividade`]?.[
                  `_${PREFIX}temperatura_value`
                ]
              ]?.[`${PREFIX}nome`] ||
              dictTag?.[
                resConflict?.[`${PREFIX}CronogramaDia`]?.[
                  `_${PREFIX}temperatura_value`
                ]
              ]?.[`${PREFIX}nome`] ||
              dictTag?.[
                resConflict?.[`${PREFIX}Turma`]?.[`_${PREFIX}temperatura_value`]
              ]?.[`${PREFIX}nome`] ||
              dictTag?.[
                resConflict?.[`${PREFIX}Programa`]?.[
                  `_${PREFIX}temperatura_value`
                ]
              ]?.[`${PREFIX}nome`];

            let approved = false;

            if (
              resConflict?.[`${PREFIX}Espaco`] &&
              activity?.[`_${PREFIX}espaco_aprovador_por_value`]
            ) {
              approved = true;
            }

            if (resConflict?.[`${PREFIX}Pessoa`]) {
              const envolvedPerson = activity?.[
                `${PREFIX}Atividade_PessoasEnvolvidas`
              ]?.find(
                (e) =>
                  e?.[`_${PREFIX}pessoa_value`] ===
                  resConflict?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`]
              );

              const func = dictTag[envolvedPerson?.[`_${PREFIX}funcao_value`]];
              const needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
              );

              approved = needApprove
                ? !!envolvedPerson?.[`_${PREFIX}aprovadopor_value`]
                : false;
            }

            if ((!temp || temp !== EFatherTag.RASCUNHO) && !approved) {
              visibleConflicts.push(resConflict);
            }
          }

          if (visibleConflicts.length) {
            hasConflict = true;
            resourcesActivity.push({
              ...res,
              hasConflict,
              space: dictSpace[res?.[`_${PREFIX}espaco_value`]],
              person: dictPeople[res?.[`_${PREFIX}pessoa_value`]],
              finiteInfiniteResources:
                dictFiniteInfiniteResources[
                  res?.[`_${PREFIX}recurso_recursofinitoeinfinito_value`]
                ],
              conflicts: visibleConflicts,
            });
          } else {
            resourcesActivity.push({
              ...res,
              space: dictSpace[res?.[`_${PREFIX}espaco_value`]],
              person: dictPeople[res?.[`_${PREFIX}pessoa_value`]],
              finiteInfiniteResources:
                dictFiniteInfiniteResources[
                  res?.[`_${PREFIX}recurso_recursofinitoeinfinito_value`]
                ],
            });
          }
        }

        activity[`${PREFIX}recursos_Atividade`] = resourcesActivity;

        arrScheduler.push({
          ...activity,
          hasConflict,
          color: hasConflict
            ? '#a71111'
            : temperatureColor(
                activity,
                // scheduleChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
                teamChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
                  programChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`]
              ).background,
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
        });
      }
    } catch (error) {
      console.error(error);
    }

    setSchedulerData(arrScheduler);
  };

  const handleDeleteAppointment = (activityId) => {
    let newSchedulerData = [...schedulerData];
    const itemDeleted = newSchedulerData.find(
      (appointment) => appointment.id === activityId
    );

    newSchedulerData = newSchedulerData.filter(
      (appointment) => appointment.id !== activityId
    );

    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir a Atividade ${
        itemDeleted?.[`${PREFIX}nome`]
      }?`,
      onConfirm: () => {
        dispatch(
          deleteActivity(
            { id: itemDeleted[`${PREFIX}atividadeid`], activity: itemDeleted },
            {
              onSuccess: () => null,
              onError: () => null,
            }
          )
        );

        const activitiesFromDay = schedulerData
          ?.filter(
            (actv) =>
              moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
                moment(itemDeleted?.[`${PREFIX}datahorainicio`]).format(
                  'DD/MM/YYYY'
                ) && actv?.[`${PREFIX}atividadeid`] !== activityId
          )
          ?.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))
          ?.sort((a, b) => a.startTime.unix() - b.startTime.unix());

        let lastTime = activitiesFromDay[0]?.startTime;

        const newActivities = activitiesFromDay?.map((actv) => {
          const duration = momentToMinutes(actv.duration);
          const endTime = lastTime.clone().add(duration, 'm');

          const startDate = moment(
            `${moment(actv?.startDate).format('YYYY-MM-DD')} ${lastTime.format(
              'HH:mm'
            )}`
          );

          const momentDuration = moment(actv?.[`${PREFIX}duracao`], 'HH:mm');
          const minutes = momentToMinutes(momentDuration);

          const result = {
            id: actv.id,
            data: {
              [`${PREFIX}inicio`]: lastTime.format('HH:mm'),
              [`${PREFIX}fim`]: endTime.format('HH:mm'),
              [`${PREFIX}datahorainicio`]: startDate.format(),
              [`${PREFIX}datahorafim`]: startDate
                .clone()
                .add(minutes, 'minutes')
                .format(),
            },
          };

          lastTime = endTime;

          return result;
        });

        setSchedulerData(newSchedulerData);
        dispatch(deleteByActivity(itemDeleted[`${PREFIX}atividadeid`]));

        batchUpdateActivity(newActivities, {
          onSuccess: () => {
            refetch();
          },
          onError: () => {},
        });
      },
    });
  };

  const handleClose = () => {
    refetch();
    refetchSchedule();
    refetchResource();
    refetchTeam();

    setVisible(false);
    setScheduleChoosed(null);
  };

  const handleSuccess = (actv) => {
    refetch();
    refetchResource?.();

    setActivityChoosed({ ...activityChoosed, item: actv });
    setLoading(false);
    notification.success({
      title: 'Sucesso',
      description: 'Atualização realizada com sucesso',
    });
  };

  const handleError = (error) => {
    setLoading(false);

    getActivity(activityChoosed?.item?.[`${PREFIX}atividadeid`]).then(
      ({ value }) => {
        setActivityChoosed({ ...activityChoosed, item: value?.[0] });
        setLoading(false);
      }
    );
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleEdit = (item, onSuccess?) => {
    try {
      const activitiesFromDay = schedulerData
        ?.filter(
          (actv) =>
            moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
            moment(item?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY')
        )
        ?.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))
        ?.sort((a, b) => a.startTime.unix() - b.startTime.unix());

      setLoading(true);
      const spacesToDelete = item?.[`${PREFIX}Atividade_Espaco`]?.filter(
        (e) => !item.spaces?.some((sp) => sp.value === e[`${PREFIX}espacoid`])
      );
      const finiteInfiniteResourceToDelete = item?.[
        `${PREFIX}Atividade_RecursoFinitoInfinito`
      ]?.filter(
        (e) =>
          !item?.finiteResource?.some(
            (sp) =>
              sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
              e[`${PREFIX}recursofinitoinfinitoid`]
          ) &&
          !item?.infiniteResource?.some(
            (sp) =>
              sp?.[`${PREFIX}recursofinitoinfinitoid`] ===
              e[`${PREFIX}recursofinitoinfinitoid`]
          )
      );

      const equipmentsToDelete = item?.[
        `${PREFIX}Atividade_Equipamentos`
      ]?.filter(
        (e) =>
          !item?.equipments?.some((sp) => sp.value === e[`${PREFIX}etiquetaid`])
      );

      const actvIndex = activitiesFromDay?.findIndex(
        (e) => e?.id === item?.[`${PREFIX}atividadeid`]
      );

      let nextActivities = activitiesFromDay?.slice(
        actvIndex + 1,
        activitiesFromDay?.length
      );

      setUndoNextActivities(nextActivities);
      const lastDateTime = moment(item.endDate);

      let nextChanges = reorderTimeActivities(
        lastDateTime,
        nextActivities
      )?.map((actv) => ({
        [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
        deleted: actv?.deleted,
        changed: item.timeChanged,
        ...formatActivity(actv, {
          dictPeople: dictPeople,
          dictSpace: dictSpace,
          dictTag: dictTag,
        }),
      }));

      const scheduleEdit = item?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
      const activitiesToEdit = [
        {
          ...item,
          changed: item.timeChanged || item.fieldChanged,
          [`${PREFIX}inicio`]: item.startTime.format('HH:mm'),
          [`${PREFIX}fim`]: item.endTime.format('HH:mm'),
          [`${PREFIX}datahorainicio`]: moment
            .utc(item.startDate)
            .format('YYYY-MM-DDTHH:mm:ss'),
          [`${PREFIX}datahorafim`]: moment
            .utc(item.endDate)
            .format('YYYY-MM-DDTHH:mm:ss'),
          startDate: moment(item.startDate).format(),
          endDate: moment(item.endDate).format(),
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSchedule = (event, item) => {
    setScheduleChoosed(item);
    setActivitiesModelChoosed(
      item?.[`${PREFIX}CronogramadeDia_Atividade`]
        ?.filter((act) => act?.[`${PREFIX}ativo`])
        ?.sort(
          (a, b) =>
            moment(a?.[`${PREFIX}inicio`], 'HH:mm').unix() -
            moment(b?.[`${PREFIX}inicio`], 'HH:mm').unix()
        )
        ?.map((actv) => ({
          id: actv?.[`${PREFIX}atividadeid`],
          name: actv?.[`${PREFIX}nome`],
          start: actv?.[`${PREFIX}inicio`],
          checked: true,
        }))
    );
    setAnchorScheduleEl(event.currentTarget);
  };

  const handleOpenEditDrawer = (activity) => {
    handleClosePopup();
    setActivityChoosed({ open: true, item: activity });
  };

  const handleCloseEditDrawer = () => {
    setActivityChoosed({ open: false, item: null });
  };

  const hasOverlap = React.useCallback((args, inst) => {
    const ev = args.event;
    const events = inst
      .getEvents(ev.start, ev.end)
      .filter((e) => e.id !== ev.id);

    return events.length > 0;
  }, []);

  const onItemChange = (args, inst) => {
    const { event, oldEvent } = args;

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

    const startString = start.clone().format('YYYY-MM-DD');
    if (startString !== moment(activityUpdated.start).format('YYYY-MM-DD')) {
      const previousSchedule =
        activityUpdated?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
      const newSchedule = schedules.find(
        (s) =>
          moment.utc(s?.[`${PREFIX}data`]).format('YYYY-MM-DD') === startString
      );

      if (!newSchedule) {
        confirmation.openConfirmation({
          title: 'Dia de aula não encontrado',
          description: `O dia ${start.format(
            'DD/MM/YYYY'
          )} não está cadastrado, deseja realizar a criação?`,
          onConfirm: () => setVisible(true),
        });

        setLoading(false);
        adapterSchedulerData();
        return;
      }

      dispatch(
        changeActivityDate(
          {
            ...activityUpdated,
            id: activityUpdated.id,
            [`${PREFIX}atividadeid`]: activityUpdated?.[`${PREFIX}atividadeid`],
            startDate: start.format(),
            endDate: end.format(),
            startTime: start,
            endTime: end,
            [`${PREFIX}datahorainicio`]: start.format(),
            [`${PREFIX}datahorafim`]: end.format(),
            duration: getDurationMoment(start, end),
          },
          previousSchedule?.[`${PREFIX}cronogramadediaid`],
          newSchedule?.[`${PREFIX}cronogramadediaid`],
          {
            onSuccess: handleSuccess,
            onError: handleError,
          }
        )
      );

      adapterSchedulerData();
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

    const lastDateTime = moment(item.endDate);

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
        startDate: moment(item.startDate).format(),
        endDate: moment(item.endDate).format(),
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

  const renderDay = (args) => {
    const date = args.date;
    const sched = schedules?.find(
      (sc) =>
        moment.utc(sc?.[`${PREFIX}data`]).format('YYYY-MM-DD') ===
        moment(date).format('YYYY-MM-DD')
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
            onClick={(event) => handleOptionSchedule(event, sched)}
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

  const onEventHoverIn = React.useCallback((args) => {
    const event = args.event;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPopupHover({ open: true, anchor: args.domEvent.target, event });
  }, []);

  const onEventHoverOut = React.useCallback(() => {
    timerRef.current = setTimeout(() => {
      setPopupHover({ open: false });
    }, 200);
  }, []);

  const onMouseEnter = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const onMouseLeave = React.useCallback(() => {
    timerRef.current = setTimeout(() => {
      setPopupHover({ open: false });
    }, 200);
  }, []);

  const handleClosePopup = () => {
    setPopup({ open: false, item: null });
  };

  const handleCloseScheduleAnchor = () => {
    setAnchorScheduleEl(null);

    handleCloseCalendar();
  };

  const handleDetail = () => {
    setVisible(true);
    setAnchorScheduleEl(null);
  };

  const throwToApprove = (activity: any) => {
    const tasksToSave = [];
    const planningTag = tags.find(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.PLANEJAMENTO
    );

    if (
      !activity?.[`${PREFIX}Espaco_Aprovador_Por`] &&
      activity[`${PREFIX}Atividade_Espaco`]?.length
    ) {
      tasksToSave.push({
        [`${PREFIX}Atividade@odata.bind`]:
          activity?.[`${PREFIX}atividadeid`] &&
          `/${ACTIVITY}(${activity?.[`${PREFIX}atividadeid`]})`,
        [`${PREFIX}Programa@odata.bind`]:
          programChoosed?.[`${PREFIX}programaid`] &&
          `/${PROGRAM}(${programChoosed?.[`${PREFIX}programaid`]})`,
        [`${PREFIX}Turma@odata.bind`]:
          teamChoosed?.[`${PREFIX}turmaid`] &&
          `/${TEAM}(${teamChoosed?.[`${PREFIX}turmaid`]})`,
        [`${PREFIX}itemaaprovar`]: 'Espaço',
        [`${PREFIX}NotificacaoGrupo@odata.bind`]:
          planningTag?.[`${PREFIX}etiquetaid`] &&
          `/${TAG}(${planningTag?.[`${PREFIX}etiquetaid`]})`,
      });
    }

    bulkAddTaks(tasksToSave, {
      onSuccess: () =>
        notification.success({
          title: 'Sucesso',
          description: 'Lançado para aprovação',
        }),
      onError: () =>
        notification.error({
          title: 'Falha',
          description: '',
        }),
    });
  };

  const handleOpenCalendar = () => {
    handleCloseScheduleAnchor();
    setCalendarDrawer({ open: true, schedule: scheduleChoosed });
  };

  const handleCloneSchedule = () => {
    setOpenCloneSchedule(true);
    setAnchorScheduleEl(null);
  };

  const handleCloseCalendar = () => {
    setCalendarDrawer({ open: false });
    setScheduleChoosed(null);
  };

  const saveAsModel = async () => {
    if (!modelName.name) {
      setModelName({ ...modelName, error: 'Campo Obrigatório' });
      return;
    }
    setIsLoadingSaveModel(true);
    setModelName({ ...modelName, open: false, error: '' });

    if (modelName.isDay) {
      dispatch(
        createModel(
          {
            Tipo: TYPE_REQUEST_MODEL.CRIACAO,
            Origem: TYPE_ORIGIN_MODEL.CRONOGRAMA,
            Nome: modelName.name,
            ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
            IDOrigem: scheduleChoosed[`${PREFIX}cronogramadediaid`],
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
          },
          {
            onSuccess: () => {
              setIsLoadingSaveModel(false);
              handleCloseScheduleAnchor();
              confirmation.openConfirmation({
                title: 'Criação de modelo',
                yesLabel: 'Fechar',
                showCancel: false,
                description:
                  'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!',
                onConfirm: () => null,
              });
            },
            onError: (error) => {
              setIsLoadingSaveModel(false);
              notification.error({
                title: 'Falha',
                description: error?.data?.error?.message,
              });
            },
          }
        )
      );
    } else {
      let newModel = _.cloneDeep(scheduleChoosed);
      newModel.modeloid = newModel[`${PREFIX}cronogramadediaid`];

      delete newModel?.[`${PREFIX}cronogramadediaid`];
      newModel[`${PREFIX}modelo`] = true;
      newModel.anexossincronizados = false;

      const newActv = [];
      const dictActivityChoosed = new Map();

      activitiesModelChoosed.forEach((actv) => {
        if (actv.checked) {
          dictActivityChoosed.set(actv.id, actv);
        }
      });

      for (
        let i = 0;
        i < newModel?.[`${PREFIX}CronogramadeDia_Atividade`].length;
        i++
      ) {
        const activity = newModel?.[`${PREFIX}CronogramadeDia_Atividade`][i];

        if (!dictActivityChoosed.has(activity?.[`${PREFIX}atividadeid`])) {
          continue;
        }

        const actvResponse = await getActivity(
          activity?.[`${PREFIX}atividadeid`]
        );
        let actv = actvResponse?.value?.[0];

        actv?.[`${PREFIX}Atividade_NomeAtividade`]?.map((item) => {
          delete item[`${PREFIX}nomeatividadeid`];

          return item;
        });

        actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((item) => {
          delete item[`${PREFIX}pessoasenvolvidasatividadeid`];

          return item;
        });

        actv?.[`${PREFIX}Atividade_Documento`]?.map((item) => {
          delete item[`${PREFIX}documentosatividadeid`];

          return item;
        });

        delete actv[`${PREFIX}atividadeid`];
        newActv.push({
          [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
          ...formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
            isModel: true,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
          }),
        });
      }

      newModel.activities = newActv;

      newModel?.[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map(
        (person) => {
          let newPerson = { ...person };
          delete newPerson?.[`${PREFIX}pessoasenvolvidascronogramadiaid`];

          return newPerson;
        }
      );

      const scheduleToSave = {
        ...newModel,
        model: true,
        name: modelName.name,
        date: moment('2006-01-01', 'YYYY-MM-DD'),
        module: dictTag?.[newModel?.[`_${PREFIX}modulo_value`]],
        modality: dictTag?.[newModel?.[`_${PREFIX}modalidade_value`]],
        tool: dictTag?.[newModel?.[`_${PREFIX}ferramenta_value`]],
        isGroupActive: !modelName.isDay,
        startTime:
          (newModel[`${PREFIX}inicio`] &&
            moment(newModel[`${PREFIX}inicio`], 'HH:mm')) ||
          null,
        endTime:
          (newModel[`${PREFIX}fim`] &&
            moment(newModel[`${PREFIX}fim`], 'HH:mm')) ||
          null,
        duration:
          (newModel[`${PREFIX}duracao`] &&
            moment(newModel[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        toolBackup: dictTag?.[newModel?.[`_${PREFIX}ferramentabackup_value`]],
        link: newModel?.[`${PREFIX}link`],
        linkBackup: newModel?.[`${PREFIX}linkbackup`],
        observation: newModel?.[`${PREFIX}observacao`],
        anexos: [],
        people: newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.length
          ? newModel[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map(
              (e) => ({
                keyId: v4(),
                id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                function: dictTag[e?.[`_${PREFIX}funcao_value`]],
              })
            )
          : [{ keyId: v4(), person: null, function: null }],
        locale: newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.length
          ? newModel[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map(
              (e) => ({
                keyId: v4(),
                id: e?.[`${PREFIX}localcronogramadiaid`],
                space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
                observation: e?.[`${PREFIX}observacao`],
              })
            )
          : [{ keyId: v4(), person: null, function: null }],
      };

      dispatch(
        addUpdateSchedule(scheduleToSave, null, null, {
          onSuccess: () => {
            setIsLoadingSaveModel(false);
            notification.success({
              title: 'Sucesso',
              description: 'Modelo salvo com sucesso',
            });
          },
          onError: (error) => {
            setIsLoadingSaveModel(false);
            notification.error({
              title: 'Falha',
              description: error?.data?.error?.message,
            });
          },
        })
      );
    }
  };

  const saveActivityAsModel = () => {
    if (!activityModelName.name) {
      setActivityModelName({
        ...activityModelName,
        error: 'Campo Obrigatório',
      });
      return;
    }

    setLoadingSaveActivityModel(true);
    let actv = activityModelName?.item;

    actv[`${PREFIX}Atividade_NomeAtividade`] = actv?.[
      `${PREFIX}Atividade_NomeAtividade`
    ]?.map((item) => {
      delete item[`${PREFIX}nomeatividadeid`];

      return item;
    });

    if (!activityModelName.loadSpaces) {
      actv[`${PREFIX}Atividade_Espaco`] = [];
    }

    if (activityModelName.loadPerson) {
      actv[`${PREFIX}Atividade_PessoasEnvolvidas`] = actv?.[
        `${PREFIX}Atividade_PessoasEnvolvidas`
      ]?.map((item) => {
        delete item[`${PREFIX}pessoasenvolvidasatividadeid`];
        delete item.id;

        return item;
      });
    } else {
      actv[`${PREFIX}Atividade_PessoasEnvolvidas`] = [];
    }

    actv[`${PREFIX}Atividade_Documento`] = actv?.[
      `${PREFIX}Atividade_Documento`
    ]?.map((item) => {
      delete item[`${PREFIX}documentosatividadeid`];
      delete item.id;

      return item;
    });

    delete actv[`${PREFIX}atividadeid`];
    let model: any = {
      [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
      user: currentUser?.[`${PREFIX}pessoaid`],
      group: myGroup(),
      ...formatActivityModel(actv, moment('2006-01-01', 'YYYY-MM-DD'), {
        isModel: true,
        dictPeople: dictPeople,
        dictSpace: dictSpace,
        dictTag: dictTag,
      }),
    };

    model.typeApplication = EActivityTypeApplication.MODELO_REFERENCIA;
    model.title = activityModelName.name;

    model.people = model.people?.map((p) => {
      delete p[`${PREFIX}pessoasenvolvidasatividadeid`];
      delete p.id;

      return p;
    });

    model.documents = model.documents?.map((p) => {
      delete p[`${PREFIX}documentosatividadeid`];
      delete p.id;

      return p;
    });

    model.names = model.names?.map((p) => {
      delete p[`${PREFIX}nomeatividadeid`];
      delete p.id;

      return p;
    });

    dispatch(
      updateActivityAll(model, {
        onSuccess: () => {
          setLoadingSaveActivityModel(false);
          handleCloseSaveActivityModel();

          notification.success({
            title: 'Sucesso',
            description: 'Modelo cadastrado com sucesso',
          });
        },
        onError: (error) => {
          setLoadingSaveActivityModel(false);
          notification.error({
            title: 'Falha',
            description: error?.data?.error?.message,
          });
        },
      })
    );
  };

  const handleToSaveActivityModel = (item) => {
    setActivityModelName({
      loadSpaces: true,
      loadPerson: true,
      open: true,
      item,
      name: '',
      error: '',
    });
  };

  const handleCloseSaveActivityModel = () => {
    setActivityModelName({
      loadSpaces: true,
      loadPerson: true,
      open: false,
      item: null,
      name: '',
      error: '',
    });
  };

  const handleToSaveModel = () => {
    setModelName({
      loadSpaces: true,
      loadPerson: true,
      open: true,
      isDay: true,
      name: '',
      error: '',
    });
  };

  const handleToSaveGrouping = () => {
    setModelName({
      loadSpaces: true,
      loadPerson: true,
      open: true,
      isDay: false,
      name: '',
      error: '',
    });
  };

  const handleCloseSaveModel = () => {
    setModelName({
      loadSpaces: true,
      loadPerson: true,
      open: false,
      isDay: true,
      name: '',
      error: '',
    });
  };

  const handleChangeCheckbox = (index, event) => {
    const newActv = _.cloneDeep(activitiesModelChoosed);
    newActv[index].checked = event.target.checked;
    setActivitiesModelChoosed(newActv);
  };

  const handleDeleteSchedule = () => {
    handleCloseScheduleAnchor();

    const activitiesToDelete = activities.filter(
      (actv) =>
        moment(actv?.[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY') ===
        moment.utc(scheduleChoosed?.[`${PREFIX}data`]).format('DD/MM/YYYY')
    );

    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir o dia ${moment
        .utc(scheduleChoosed?.[`${PREFIX}data`])
        .format('DD/MM/YYYY')}?`,
      onConfirm: () => {
        dispatch(
          deleteSchedule(
            scheduleChoosed[`${PREFIX}cronogramadediaid`],
            activitiesToDelete,
            {
              onSuccess: refetchSchedule,
              onError: () => null,
            }
          )
        );

        dispatch(
          deleteBySchedule(scheduleChoosed[`${PREFIX}cronogramadediaid`])
        );
      },
    });
  };

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
        <CalendarNav className='cal-header-nav' />
        <Box flex='1 0 0'>
          <SegmentedGroup
            value={view}
            onChange={(event) => setView(event.target.value)}
          >
            <SegmentedItem value='year'>Ano</SegmentedItem>
            <SegmentedItem value='month'>Mês</SegmentedItem>
            <SegmentedItem value='week'>Semana</SegmentedItem>
            <SegmentedItem value='day'>Dia</SegmentedItem>
            {/* <SegmentedItem value='agenda'>Agenda</SegmentedItem> */}
          </SegmentedGroup>
        </Box>
        <CalendarPrev className='cal-header-prev' />
        <CalendarToday className='cal-header-today' />
        <CalendarNext className='cal-header-next' />
      </>
    );
  };

  const handleAddActivity = (
    args: MbscCellClickEvent,
    inst: EventcalendarBase
  ) => {
    const date = moment.utc(args.date.toString());

    const schedule = schedules.find(
      (sc) =>
        moment.utc(sc?.[`${PREFIX}data`]).format('DD/MM/YYYY') ===
        date.format('DD/MM/YYYY')
    );

    if (!schedule) {
      notification.error({
        title: 'Dia não cadastrado',
        description: 'O dia não foi cadastrado, por favor verifique!',
      });
      return;
    }
    setAddActivity({ open: true, date, schedule: schedule });
  };

  const handleScrollNext = () => {
    const container = document.querySelector('#DayCalendarList');
    const widthDay = document.getElementsByClassName('LayerDay')[0].clientWidth;
    container.scrollBy({
      left: (widthDay + 30) * 2,
      behavior: 'smooth',
    });
  };

  const handleScrollPrev = () => {
    const container = document.querySelector('#DayCalendarList');
    const widthDay = document.getElementsByClassName('LayerDay')[0].clientWidth;
    container.scrollBy({
      left: -((widthDay + 30) * 2),
      behavior: 'smooth',
    });
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
    }

    return calView;
  }, [cellDuration, view, listMode]);

  const academicDirector = React.useMemo(() => {
    let user;
    if (
      teamChoosed &&
      Object.keys(dictTag).length &&
      Object.keys(dictPeople).length
    ) {
      teamChoosed?.[`${PREFIX}Turma_PessoasEnvolvidasTurma`]?.forEach((elm) => {
        const func = dictTag?.[elm?.[`_${PREFIX}funcao_value`]];

        if (func?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO) {
          user = dictPeople?.[elm?.[`_${PREFIX}pessoa_value`]];
        }
      });
    }

    return user;
  }, [teamChoosed, dictTag, dictPeople]);

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

      <CalendarDrawer
        open={calendarDrawer.open}
        schedule={calendarDrawer.schedule}
        onClose={handleCloseCalendar}
        onEventHoverIn={onEventHoverIn}
        onEventHoverOut={onEventHoverOut}
        onItemChange={onItemChange}
        onEventClick={onEventClick}
      />

      <ScheduleDayForm
        visible={visible}
        context={context}
        isDraft={
          (scheduleChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            teamTemperature ||
            programTemperature) === EFatherTag.RASCUNHO
        }
        isProgramResponsible={isProgramResponsible}
        isProgramDirector={isProgramDirector}
        isHeadOfService={isHeadOfService}
        schedule={scheduleChoosed}
        program={programChoosed}
        team={teamChoosed}
        setSchedule={setScheduleChoosed}
        teamId={teamChoosed?.[`${PREFIX}turmaid`]}
        programId={teamChoosed?.[`_${PREFIX}programa_value`]}
        handleClose={handleClose}
      />

      <CloneSchedule
        open={openCloneSchedule}
        teamId={teamChoosed?.[`${PREFIX}turmaid`]}
        programId={teamChoosed?.[`_${PREFIX}programa_value`]}
        handleClose={() => setOpenCloneSchedule(false)}
        schedule={scheduleChoosed}
        refetch={refetch}
        refetchSchedule={refetchSchedule}
      />

      <EditActivityForm
        onSave={handleEdit}
        isDraft={
          (activityChoosed?.item?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            scheduleChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            teamTemperature ||
            programTemperature) === EFatherTag.RASCUNHO
        }
        refetch={refetch}
        undoNextActivities={undoNextActivities}
        team={teamChoosed}
        program={programChoosed}
        isProgramDirector={isProgramDirector}
        isProgramResponsible={isProgramResponsible}
        throwToApprove={throwToApprove}
        open={activityChoosed.open}
        activity={activityChoosed.item}
        academicDirector={academicDirector}
        setActivity={handleOpenEditDrawer}
        onClose={handleCloseEditDrawer}
      />

      <AddActivity
        open={addActivity.open}
        schedule={addActivity.schedule}
        date={addActivity.date}
        refetchActivity={refetch}
        teamId={teamChoosed?.[`${PREFIX}turmaid`]}
        programId={teamChoosed?.[`_${PREFIX}programa_value`]}
        onClose={() =>
          setAddActivity({ open: false, date: null, schedule: null })
        }
      />

      <Menu
        anchorEl={anchorScheduleEl}
        keepMounted
        open={Boolean(anchorScheduleEl)}
        onClose={() => {
          handleCloseScheduleAnchor();
          setScheduleChoosed(null);
        }}
      >
        <MenuItem onClick={handleOpenCalendar}>Calendário</MenuItem>
        <MenuItem onClick={handleCloneSchedule}>Clonar</MenuItem>
        <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
        <MenuItem onClick={() => !isLoadingSaveModel && handleToSaveModel()}>
          <Box display='flex' style={{ gap: '10px' }}>
            {isLoadingSaveModel && modelName.isDay ? (
              <CircularProgress size={20} color='primary' />
            ) : null}
            Salvar como modelo de dia
          </Box>
        </MenuItem>
        <MenuItem onClick={() => !isLoadingSaveModel && handleToSaveGrouping()}>
          <Box display='flex' style={{ gap: '10px' }}>
            {isLoadingSaveModel && !modelName.isDay ? (
              <CircularProgress size={20} color='primary' />
            ) : null}
            Salvar como modelo de agrupamento
          </Box>
        </MenuItem>
        <MenuItem onClick={handleDeleteSchedule}>Excluir</MenuItem>
      </Menu>

      <Box display='flex' justifyContent='space-between'>
        <Box
          display='flex'
          marginBottom='1rem'
          alignItems='center'
          width={width ? `${width}px` : '100%'}
          style={{ gap: '1rem' }}
        >
          <IconButton onClick={(e) => setAnchorMoreOptionEl(e.currentTarget)}>
            <FormatListBulleted />
          </IconButton>

          <Title style={{ whiteSpace: 'nowrap' }}>
            {teamChoosed?.[`${PREFIX}nome`]}
          </Title>

          <Menu
            anchorEl={anchorMoreOptionEl}
            keepMounted
            open={Boolean(anchorMoreOptionEl)}
            onClose={() => {
              setAnchorMoreOptionEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                setVisible(true);
                setScheduleChoosed(null);
                setAnchorMoreOptionEl(null);
              }}
            >
              <ListItemIcon>
                <IoCalendarNumberSharp />
              </ListItemIcon>
              <ListItemText primary='Criar dia de aula' />
            </MenuItem>

            {listMode ? (
              <MenuItem
                onClick={() => {
                  handleModeView();
                  setAnchorMoreOptionEl(null);
                }}
              >
                <ListItemIcon>
                  <CalendarTodayRounded fontSize='small' />
                </ListItemIcon>
                <ListItemText primary='Modo Calendário' />
              </MenuItem>
            ) : (
              // <Button
              //   variant='contained'
              //   color='primary'
              //   startIcon={<CalendarTodayRounded />}
              //   onClick={handleModeView}
              // >
              //   Modo Calendário
              // </Button>
              <MenuItem
                onClick={() => {
                  handleModeView();
                  setAnchorMoreOptionEl(null);
                }}
              >
                <ListItemIcon>
                  <List fontSize='small' />
                </ListItemIcon>
                <ListItemText primary='Modo Lista' />
              </MenuItem>
              // <Button
              //   variant='contained'
              //   color='primary'
              //   startIcon={<List />}
              //   onClick={handleModeView}
              // >
              //   Modo Lista
              // </Button>
            )}
          </Menu>

          {loadingActivity && <CircularProgress size={20} />}
        </Box>
        <Box minWidth='10rem' marginBottom='1rem'>
          {!listMode ? (
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
          ) : (
            <Box>
              <IconButton onClick={handleScrollPrev}>
                <ArrowBackIos fontSize='small' />
              </IconButton>
              <IconButton onClick={handleScrollNext}>
                <ArrowForwardIos fontSize='small' />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {listMode ? (
        <ListDays
          schedules={schedules}
          dictTag={dictTag}
          handleDelete={handleDeleteAppointment}
          refetchActivity={refetch}
          activities={schedulerData}
          handleToSaveActivityModel={handleToSaveActivityModel}
          handleActivityDetail={handleOpenEditDrawer}
          teamChoosed={teamChoosed}
          programChoosed={programChoosed}
          handleOptionSchedule={handleOptionSchedule}
        />
      ) : (
        <Eventcalendar
          dragToMove
          dragToResize
          allDayText='Módulo'
          width='100%'
          height='65vh'
          firstDay={0}
          // @ts-ignore
          onSelectedDateChange={(e) => setCurrentDate(e.date.toISOString())}
          selectedDate={currentDate}
          onCellDoubleClick={handleAddActivity}
          locale={localePtBR}
          data={[...(schedulerData || []), ...(modules || [])]}
          view={currentView}
          renderHeader={customWithNavButtons}
          renderDay={(view === 'week' || view === 'day') && renderDay}
          cssClass={listMode && styles.calendar}
          onEventHoverIn={onEventHoverIn}
          onEventHoverOut={onEventHoverOut}
          onEventUpdate={onItemChange}
          onEventClick={onEventClick}
        />
      )}

      <Popup
        display='anchored'
        isOpen={popupHover.open && !popup.open}
        anchor={popupHover.anchor}
        touchUi={false}
        showOverlay={false}
        contentPadding={false}
        closeOnOverlayClick={false}
        width={350}
        closeOnScroll
        onClose={() => setPopupHover({ open: false })}
        cssClass='md-tooltip'
      >
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <Box
            display='flex'
            padding='5px'
            justifyContent='space-between'
            fontWeight='bold'
            fontSize='.8rem'
            style={{ backgroundColor: popupHover?.event?.color }}
          >
            <Box width='70%'>
              <span>{popupHover?.event?.title}</span>
            </Box>

            {!popupHover?.event?.allDay ? (
              <span>
                {popupHover?.event?.[`${PREFIX}inicio`]} -{' '}
                {popupHover?.event?.[`${PREFIX}fim`]}
              </span>
            ) : null}
          </Box>
          {!popupHover?.event?.allDay ? (
            <Box padding='5px'>
              <Box>
                <SectionNamePopup>Tema</SectionNamePopup>:{' '}
                {popupHover?.event?.[`${PREFIX}temaaula`]}{' '}
              </Box>

              <Box>
                <SectionNamePopup>Pessoas Envolvidas</SectionNamePopup>
                <SectionList>
                  {popupHover?.event?.[
                    `${PREFIX}Atividade_PessoasEnvolvidas`
                  ]?.map((envol) => (
                    <li>
                      {
                        dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]]?.[
                          `${PREFIX}nomecompleto`
                        ]
                      }
                    </li>
                  ))}
                </SectionList>
              </Box>

              <Box>
                <SectionNamePopup>Espaço</SectionNamePopup>
                <SectionList>
                  {popupHover?.event?.[`${PREFIX}Atividade_Espaco`]?.map(
                    (spc) => (
                      <li> {spc?.[`${PREFIX}nome`]}</li>
                    )
                  )}
                </SectionList>
              </Box>

              <Box>
                <SectionNamePopup>Documentos</SectionNamePopup>
                <SectionList>
                  {popupHover?.event?.[`${PREFIX}Atividade_Documento`]?.map(
                    (doc) => (
                      <li> {doc?.[`${PREFIX}nome`]}</li>
                    )
                  )}
                </SectionList>
              </Box>
            </Box>
          ) : null}
        </div>
      </Popup>

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
                    {popup?.item?.[`${PREFIX}inicio`]} -{' '}
                    {popup?.item?.[`${PREFIX}fim`]}
                  </Typography>
                </Grid>
              </Grid>
              <TitleResource>Recursos</TitleResource>
            </>
          ) : null}

          <Grid container style={{ maxHeight: '15rem', overflow: 'auto' }}>
            {popup?.item?.[`${PREFIX}recursos_Atividade`]?.map((item) => (
              <>
                <Grid item xs={1}>
                  <Box width='100%' justifyContent='center' alignItems='center'>
                    {item.hasConflict ? (
                      <Error style={{ color: '#a71111' }} />
                    ) : (
                      <CheckCircle style={{ color: '#35bb5a' }} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant='body1'>
                    {item?.person?.[`${PREFIX}nomecompleto`] ||
                      item?.space?.[`${PREFIX}nome`] ||
                      item?.finiteInfiniteResources?.[`${PREFIX}nome`]}
                  </Typography>
                </Grid>
                {item.hasConflict ? (
                  <ul>
                    {item.conflicts.map((conf) => (
                      <li>
                        {moment(conf?.[`${PREFIX}inicio`]).format('HH:mm')} -{' '}
                        {moment(conf?.[`${PREFIX}fim`]).format('HH:mm')} |{' '}
                        {conf?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]} -{' '}
                        {conf?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]} -{' '}
                        {conf?.[`${PREFIX}Programa`]?.[`${PREFIX}titulo`]}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            ))}
          </Grid>
        </Box>

        {!popup?.item?.allDay ? (
          <Box display='flex' padding='1rem' style={{ gap: '10px' }}>
            <Button
              onClick={() => handleOpenEditDrawer(popup?.item)}
              startIcon={<Edit />}
              variant='contained'
              color='primary'
            >
              Editar
            </Button>

            <Button
              onClick={() => {
                handleToSaveActivityModel(popup?.item);
                handleClosePopup();
              }}
              startIcon={<Save />}
              variant='contained'
              color='primary'
            >
              Salvar como Modelo
            </Button>

            <Button
              onClick={() => {
                handleClosePopup();
                handleDeleteAppointment(popup?.item?.id);
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

      <Dialog
        fullWidth
        maxWidth='sm'
        open={modelName.open}
        onClose={handleCloseSaveModel}
      >
        <DialogTitle>Salvar como modelo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!modelName.error}
            helperText={modelName.error}
            onChange={(event) =>
              setModelName({ ...modelName, name: event.target.value })
            }
            margin='dense'
            label='Nome'
            placeholder='Informe o nome do modelo'
            type='text'
          />

          {!modelName.isDay ? (
            <Box marginTop='2rem'>
              <FormControl component='fieldset'>
                <FormLabel component='legend'>Atividades</FormLabel>
                <FormGroup>
                  {activitiesModelChoosed?.map((actv: any, i) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={actv.checked}
                          onChange={(event) => handleChangeCheckbox(i, event)}
                          name={actv.name}
                          color='primary'
                        />
                      }
                      label={`${actv?.start} - ${actv.name}`}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          ) : null}

          {/* <FormControl style={{ marginTop: '1rem' }} component='fieldset'>
            <FormLabel component='legend'>
              Deseja preservar os recursos?
            </FormLabel>

            <FormControlLabel
              control={
                <Checkbox
                  checked={modelName.loadSpaces}
                  onChange={(event) =>
                    setModelName({
                      ...modelName,
                      loadSpaces: event.target.checked,
                    })
                  }
                  name='loadSpaces'
                  color='primary'
                />
              }
              label='Espaços'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={modelName.loadPerson}
                  onChange={(event) =>
                    setModelName({
                      ...modelName,
                      loadPerson: event.target.checked,
                    })
                  }
                  name='loadPerson'
                  color='primary'
                />
              }
              label='Pessoas'
            />
          </FormControl> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveModel}>Cancelar</Button>
          <Button onClick={saveAsModel} variant='contained' color='primary'>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={activityModelName.open}
        onClose={handleCloseSaveActivityModel}
      >
        <DialogTitle>Salvar como modelo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!activityModelName.error}
            helperText={activityModelName.error}
            onChange={(event) =>
              setActivityModelName({
                ...activityModelName,
                name: event.target.value,
              })
            }
            margin='dense'
            label='Nome'
            placeholder='Informe o nome do modelo'
            type='text'
          />
          <FormControl style={{ marginTop: '1rem' }} component='fieldset'>
            <FormLabel component='legend'>
              Deseja preservar os recursos?
            </FormLabel>

            <FormControlLabel
              control={
                <Checkbox
                  checked={activityModelName.loadSpaces}
                  onChange={(event) =>
                    setActivityModelName({
                      ...activityModelName,
                      loadSpaces: event.target.checked,
                    })
                  }
                  name='loadSpaces'
                  color='primary'
                />
              }
              label='Espaços'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={activityModelName.loadPerson}
                  onChange={(event) =>
                    setActivityModelName({
                      ...activityModelName,
                      loadPerson: event.target.checked,
                    })
                  }
                  name='loadPerson'
                  color='primary'
                />
              }
              label='Pessoas'
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveActivityModel}>Cancelar</Button>
          <Button
            variant='contained'
            color='primary'
            onClick={saveActivityAsModel}
          >
            {loadingSaveActivityModel ? (
              <CircularProgress size={20} style={{ color: '#fff' }} />
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailTeam;
