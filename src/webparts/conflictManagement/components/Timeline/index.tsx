import * as React from 'react';
import * as moment from 'moment';
import {
  CalendarNext,
  CalendarPrev,
  Eventcalendar,
  localePtBR,
  Popup,
  setOptions,
} from '@mobiscroll/react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

import { useActivity, useConfirmation, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { BackdropStyled, SectionList, SectionNamePopup } from './styles';
import getDurationMoment from '~/utils/getDurationMoment';
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
import checkConflictDate from '~/utils/checkConflictDate';
import * as _ from 'lodash';
import { TitleResource } from '~/webparts/program/components/ProgramPage/components/DetailTeam/styles';
import {
  AccessTime,
  ArrowBackIos,
  ArrowForwardIos,
  Error,
} from '@material-ui/icons';
import styles from './Timeline.module.scss';
import { EFatherTag } from '~/config/enums';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  batchUpdateActivityAll,
  changeActivityDate,
  getActivity,
  getActivityByIds,
  getActivityByScheduleId,
} from '~/store/modules/activity/actions';
import formatActivity from '~/utils/formatActivity';
import reorderTimeActivities from '~/utils/reorderTimeActivities';
import minTwoDigits from '~/utils/minTwoDigits';
import { Autocomplete } from '@material-ui/lab';
import { AVAILABILITY } from '../constants';
import { getScheduleByDateAndTeam } from '~/store/modules/schedule/actions';

setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
});

interface IFilterProps {
  startDate: moment.Moment;
  endDate: moment.Moment;
  [propertyName: string]: any;
}

interface ITimelineProps {
  resources: any[];
  groups: any[];
  refetch: any;
  loading: boolean;
  typeResource: string;
  filter: IFilterProps;
  handleActivity: (activityId: any) => void;
  setFieldValue: any;
  handleFilter: any;
}

const Timeline: React.FC<ITimelineProps> = ({
  groups,
  loading: resourceLoading,
  resources,
  refetch,
  typeResource,
  handleActivity,
  filter,
  setFieldValue,
  handleFilter,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(moment().toISOString());
  const [popup, setPopup] = React.useState<any>({ open: false });
  const [schedulerData, setSchedulerData] = React.useState([]);
  const [backupData, setBackupData] = React.useState([]);
  const [cellDuration, setCellDuration] = React.useState(60);
  const [popupHover, setPopupHover] = React.useState<any>({ open: false });
  const [view, setView] = React.useState('day');
  const [resourcesRender, setResourcesRender] = React.useState(groups);
  const [activitiesIds, setActivitiesIds] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [timeView, setTimeView] = React.useState({
    startTime: { value: '08:00', label: '08:00' },
    endTime: { value: '20:00', label: '20:00' },
  });

  const timerRef = React.useRef(null);

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const { tag, person, space } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;
  const { dictSpace } = space;

  const activitiesMap = React.useMemo(() => {
    return activities?.reduce((acc, it) => {
      acc[it?.[`${PREFIX}atividadeid`]] = it;
      return acc;
    }, {});
  }, [activities]);

  React.useEffect(() => {
    setResourcesRender(groups);
  }, [groups]);

  React.useEffect(() => {
    setCurrentDate(filter.startDate.utc().clone().startOf('day').toISOString());
    setTimeout(() => {
      document.getElementsByClassName(
        'mbsc-timeline-grid-scroll'
      )[0].scrollLeft = 0;
    }, 700);
  }, [filter.endDate]);

  React.useEffect(() => {
    getActivityByIds(activitiesIds).then(({ value }) => {
      setActivities(value);
    });
  }, [activitiesIds]);

  React.useEffect(() => {
    loadResources();
  }, [resources, typeResource]);

  const loadResources = () => {
    const activitiesSet = new Set();

    let resourceItems = resources
      ?.filter((res) =>
        typeResource === 'Pessoa'
          ? res?.[`${PREFIX}Pessoa`]
          : res?.[`${PREFIX}Espaco`]
      )
      ?.map((res) => {
        const resourceConflict = checkResourceConflict(res);
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
            res?.[`${PREFIX}Atividade`]?.[
              `_${PREFIX}espaco_aprovador_por_value`
            ]
          ) {
            approved = true;
          }

          if (resConflict?.[`${PREFIX}Pessoa`]) {
            const envolvedPerson = res?.[`${PREFIX}Atividade`]?.[
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
        const hasConflict = visibleConflicts.length > 0;

        const activity = res?.[`${PREFIX}Atividade`] || {};

        activity[`${PREFIX}Temperatura`] =
          dictTag?.[
            res?.[`${PREFIX}Atividade`]?.[`_${PREFIX}temperatura_value`]
          ];
        const programTemp =
          dictTag?.[
            res?.[`${PREFIX}Programa`]?.[`_${PREFIX}temperatura_value`]
          ];
        const teamTemp =
          dictTag?.[res?.[`${PREFIX}Turma`]?.[`_${PREFIX}temperatura_value`]];
        const dayTemp =
          dictTag?.[
            res?.[`${PREFIX}CronogramaDia`]?.[`_${PREFIX}temperatura_value`]
          ];

        if (!activitiesSet.has(activity?.[`${PREFIX}atividadeid`])) {
          activitiesSet.add(activity?.[`${PREFIX}atividadeid`]);
        }

        return {
          ...res,
          hasConflict,
          conflicts: visibleConflicts,
          color: hasConflict
            ? '#a71111'
            : temperatureColor(
                activity,
                programTemp?.[`${PREFIX}nome`] ||
                  teamTemp?.[`${PREFIX}nome`] ||
                  dayTemp?.[`${PREFIX}nome`]
              ).background,
          space: res?.[`${PREFIX}Espaco`]?.[`${PREFIX}nome`],
          id: res?.[`${PREFIX}recursosid`],
          resource:
            typeResource === 'Pessoa'
              ? res?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`]
              : res?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`],
          title:
            dictTag?.[
              res?.[`${PREFIX}Programa`]?.[`_${PREFIX}nomeprograma_value`]
            ]?.[`${PREFIX}nome`],
          start: moment(res?.[`${PREFIX}inicio`]).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(res?.[`${PREFIX}fim`]).format('YYYY-MM-DD HH:mm:ss'),
        };
      });

    let resourcesToShow = _.cloneDeep(groups);

    if (filter.tagsFilter?.length) {
      resourcesToShow = groups?.filter((gp) => {
        if (typeResource === 'Pessoa') {
          return gp?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((tg) =>
            filter.tagsFilter?.some(
              (tF) =>
                tg?.[`${PREFIX}etiquetaid`] === tF?.[`${PREFIX}etiquetaid`]
            )
          );
        }
        if (typeResource === 'Espaço') {
          return gp?.[`${PREFIX}Espaco_Etiqueta_Etiqueta`]?.some((tg) =>
            filter.tagsFilter?.some(
              (tF) =>
                tg?.[`${PREFIX}etiquetaid`] === tF?.[`${PREFIX}etiquetaid`]
            )
          );
        }
      });
    }

    switch (filter.availability) {
      case AVAILABILITY.CONFLITO:
        resourceItems = resourceItems.filter((res) => res.hasConflict);

        resourcesToShow = groups?.filter((gp) =>
          resourceItems?.some((res) => {
            if (typeResource === 'Pessoa') {
              return (
                res?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`] ===
                gp?.[`${PREFIX}pessoaid`]
              );
            }
            if (typeResource === 'Espaço') {
              return (
                res?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`] ===
                gp?.[`${PREFIX}espacoid`]
              );
            }
          })
        );
        break;
      case AVAILABILITY.TOTALMENTE_LIVRE:
        resourcesToShow = groups?.filter(
          (gp) =>
            !resourceItems?.some((res) => {
              if (typeResource === 'Pessoa') {
                return (
                  res?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`] ===
                  gp?.[`${PREFIX}pessoaid`]
                );
              }
              if (typeResource === 'Espaço') {
                return (
                  res?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`] ===
                  gp?.[`${PREFIX}espacoid`]
                );
              }
            })
        );
        break;
      case AVAILABILITY.PARCIALMENTE_LIVRE:
        resourcesToShow = groups?.filter((gp) =>
          resourceItems?.some((res) => {
            if (typeResource === 'Pessoa') {
              return (
                res?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`] ===
                gp?.[`${PREFIX}pessoaid`]
              );
            }
            if (typeResource === 'Espaço') {
              return (
                res?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`] ===
                gp?.[`${PREFIX}espacoid`]
              );
            }
          })
        );
        break;
      default:
        break;
    }
    setActivitiesIds(Array.from(activitiesSet));
    setResourcesRender(resourcesToShow);
    setSchedulerData(resourceItems);
    setBackupData(_.cloneDeep(resourceItems));
  };

  const handleSuccess = () => {
    refetch();
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

  const checkActivityConflict = (activity: any, resource: any) => {
    const dateToMove = moment(activity?.startDate).startOf('day');
    const resourcesOfDay = resources?.filter((resource) =>
      moment(resource?.[`${PREFIX}inicio`]).startOf('day').isSame(dateToMove)
    );
    let resourcesConflicted = [];

    const datesAppointment = [
      moment(activity?.startDate),
      moment(activity?.endDate),
    ] as [moment.Moment, moment.Moment];

    resourcesConflicted = resourcesOfDay.filter((res) => {
      const datesResource = [
        moment(res?.[`${PREFIX}inicio`]),
        moment(res?.[`${PREFIX}fim`]),
      ] as [moment.Moment, moment.Moment];

      const isConflicted =
        checkConflictDate(datesAppointment, datesResource) &&
        res?.[`_${PREFIX}atividade_value`] !==
          resource?.[`_${PREFIX}atividade_value`];

      return (
        isConflicted &&
        (activity?.spaces?.some(
          (act) =>
            act?.[`${PREFIX}espacoid`] === res?.[`_${PREFIX}espaco_value`]
        ) ||
          activity?.people?.some(
            (act) =>
              act?.person?.[`${PREFIX}pessoaid`] ===
              res?.[`_${PREFIX}pessoa_value`]
          ))
      );
    });

    return resourcesConflicted;
  };

  const checkResourceConflict = (resource: any) => {
    let resourcesConflicted = [];

    const datesAppointment = [
      moment(resource?.[`${PREFIX}inicio`]),
      moment(resource?.[`${PREFIX}fim`]),
    ] as [moment.Moment, moment.Moment];

    resourcesConflicted = resources.filter((res) => {
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

  const onItemChange = ({ event, oldEvent }) => {
    setLoading(true);
    const resource = resources?.find(
      (r) => r?.[`${PREFIX}recursosid`] === event.id
    );

    getActivity(resource?.[`_${PREFIX}atividade_value`]).then(
      async ({ value }) => {
        if (!value.length) {
          notification.error({
            title: 'Falha',
            description:
              'Não foi possível encontrar a atividade, entre em contato com o administrador!',
          });
          setLoading(false);
        }

        const activity = value[0];
        const newStartTime = moment(event.start.toString());
        const newEndTime = moment(event.end.toString());

        const startString = newStartTime.clone().format('YYYY-MM-DD');
        if (
          startString !==
          moment(activity?.[`${PREFIX}datahorainicio`]).format('YYYY-MM-DD')
        ) {
          const previousSchedule =
            activity?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
          const newSchedule = await getScheduleByDateAndTeam(
            `${startString}T00:00:00`,
            activity?.[`${PREFIX}Turma`]?.[`${PREFIX}turmaid`]
          );

          if (!newSchedule.value.length) {
            confirmation.openConfirmation({
              title: 'Dia de aula não encontrado',
              description: `O dia ${startString} não está cadastrado`,
              onConfirm: loadResources,
              onCancel: loadResources,
              showCancel: false,
              yesLabel: 'Fechar',
            });

            setLoading(false);
            return;
          }

          dispatch(
            changeActivityDate(
              {
                ...activity,
                id: activity?.[`${PREFIX}atividadeid`],
                [`${PREFIX}atividadeid`]: activity?.[`${PREFIX}atividadeid`],
                startDate: newStartTime.format(),
                endDate: newEndTime.format(),
                startTime: newStartTime,
                endTime: newEndTime,
                duration: getDurationMoment(newStartTime, newEndTime),
                [`${PREFIX}datahorainicio`]: newStartTime.format(),
                [`${PREFIX}datahorafim`]: newEndTime.format(),
              },
              previousSchedule?.[`${PREFIX}cronogramadediaid`],
              newSchedule?.value?.[0]?.[`${PREFIX}cronogramadediaid`],
              {
                onSuccess: handleSuccess,
                onError: handleError,
              }
            )
          );

          return;
        }

        let newGroup = null;
        let newSpaces = activity?.[`${PREFIX}Atividade_Espaco`];
        let spacesToDelete = [];
        let newPeople = activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map(
          (e) => ({
            id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
            person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
            function: dictTag[e?.[`_${PREFIX}funcao_value`]],
          })
        );

        if (event.resource !== oldEvent.resource && typeResource === 'Espaço') {
          newGroup = groups.find((g) => g.id === event.resource);
          newSpaces = [];

          if (
            newGroup.id !== resource?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`]
          ) {
            spacesToDelete = activity?.[`${PREFIX}Atividade_Espaco`]?.filter(
              (e) =>
                e[`${PREFIX}espacoid`] ===
                resource?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`]
            );
            newSpaces =
              activity?.[`${PREFIX}Atividade_Espaco`]?.filter(
                (e) =>
                  e[`${PREFIX}espacoid`] !==
                  resource?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`]
              ) || [];
          }
          newSpaces.push(newGroup);
        }

        if (event.resource !== oldEvent.resource && typeResource === 'Pessoa') {
          newGroup = groups.find((g) => g.id === event.resource);
          const indexPeopleSaved = newPeople?.findIndex(
            (e) =>
              e?.person?.[`${PREFIX}pessoaid`] ===
              resource?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`]
          );
          const envolvedPeopleSaved =
            activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`][
              indexPeopleSaved
            ];

          const newPeopleHasGroup = newGroup?.[
            `${PREFIX}Pessoa_Etiqueta_Etiqueta`
          ]?.some(
            (e) =>
              e?.[`${PREFIX}etiquetaid`] ===
              envolvedPeopleSaved?.[`_${PREFIX}funcao_value`]
          );

          if (!newPeopleHasGroup) {
            setLoading(false);
            setSchedulerData(_.cloneDeep(backupData));
            confirmation.openConfirmation({
              title: (
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  <Error style={{ color: '#a71111' }} /> Pessoa não possui
                  função
                </Box>
              ),
              description: `O(a) ${
                newGroup?.[`${PREFIX}nome`]
              } não possui a função ${
                dictTag[envolvedPeopleSaved?.[`_${PREFIX}funcao_value`]]?.[
                  `${PREFIX}nome`
                ]
              }`,
              showCancel: false,
              yesLabel: 'Fechar',
              onConfirm: () => {},
            });
            return;
          }

          newPeople[indexPeopleSaved].person = {
            ...newGroup,
            value: newGroup?.[`${PREFIX}pessoaid`],
          };
        }

        const activityToUpdate = {
          ...activity,
          spacesToDelete,
          teamId: resource?.[`_${PREFIX}turma_value`],
          programId: resource?.[`_${PREFIX}programa_value`],
          id: activity?.[`${PREFIX}atividadeid`],
          [`${PREFIX}atividadeid`]: activity?.[`${PREFIX}atividadeid`],
          startDate: newStartTime.format(),
          endDate: newEndTime.format(),
          startTime: newStartTime,
          endTime: newEndTime,
          duration: getDurationMoment(newStartTime, newEndTime),
          [`${PREFIX}datahorainicio`]: newStartTime.format(),
          [`${PREFIX}datahorafim`]: newEndTime.format(),
          spaces: newSpaces,
          people: newPeople,
        };

        const conflicts = checkActivityConflict(activityToUpdate, resource);
        const resourcesConflicted = [];

        newSpaces.forEach((spc) => {
          const conflictsRes = conflicts?.filter(
            (c) =>
              c?.[`${PREFIX}Espaco`]?.[`${PREFIX}espacoid`] ===
              spc?.[`${PREFIX}espacoid`]
          );

          resourcesConflicted.push({
            name: spc?.[`${PREFIX}nome`],
            hasConflict: conflictsRes.length,
            conflicts: conflictsRes,
          });
        });

        newPeople.forEach((pe) => {
          const conflictsRes = conflicts?.filter(
            (c) =>
              c?.[`${PREFIX}Pessoa`]?.[`${PREFIX}pessoaid`] ===
              pe?.person?.[`${PREFIX}pessoaid`]
          );

          resourcesConflicted.push({
            name: pe?.person?.[`${PREFIX}nome`],
            hasConflict: conflictsRes.length,
            conflicts: conflictsRes,
          });
        });

        const responseActivities = await getActivityByScheduleId(
          activityToUpdate?.[`_${PREFIX}cronogramadia_value`]
        );
        const activities = responseActivities?.value;

        const activitiesFromDay = activities
          ?.map((e) => formatActivity(e, { dictPeople, dictSpace, dictTag }))
          ?.sort((a, b) => a.startTime.unix() - b.startTime.unix());

        const actvIndex = activitiesFromDay?.findIndex(
          (e) => e?.id === activityToUpdate?.[`${PREFIX}atividadeid`]
        );

        let nextActivities = activitiesFromDay?.slice(
          actvIndex + 1,
          activitiesFromDay?.length
        );

        const lastDateTime = moment(activityToUpdate.endDate);

        let nextChanges = reorderTimeActivities(
          lastDateTime,
          nextActivities
        )?.map((actv) => ({
          [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
          deleted: actv?.deleted,
          ...formatActivity(actv, {
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
          }),
        }));

        const scheduleEdit =
          activityToUpdate?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0];
        const activitiesToEdit = [
          {
            ...activityToUpdate,
            [`${PREFIX}inicio`]: activityToUpdate.startTime.format('HH:mm'),
            [`${PREFIX}fim`]: activityToUpdate.endTime.format('HH:mm'),
            [`${PREFIX}datahorainicio`]: moment
              .utc(activityToUpdate.startDate)
              .format('YYYY-MM-DDTHH:mm:ss'),
            [`${PREFIX}datahorafim`]: moment
              .utc(activityToUpdate.endDate)
              .format('YYYY-MM-DDTHH:mm:ss'),
            startDate: moment
              .utc(activityToUpdate.startDate)
              .format('YYYY-MM-DD HH:mm'),
            endDate: moment
              .utc(activityToUpdate.endDate)
              .format('YYYY-MM-DD HH:mm'),
            teamId: activityToUpdate?.[`_${PREFIX}turma_value`],
            programId: activityToUpdate?.[`_${PREFIX}programa_value`],
            scheduleId:
              activityToUpdate?.[`${PREFIX}CronogramadeDia_Atividade`]?.[0]?.[
                `${PREFIX}cronogramadediaid`
              ],
          },
          ...nextChanges,
        ];

        dispatch(
          batchUpdateActivityAll(
            activitiesToEdit,
            activityToUpdate,
            {
              teamId: activityToUpdate?.[`_${PREFIX}turma_value`],
              programId: activityToUpdate?.[`_${PREFIX}programa_value`],
              scheduleId: scheduleEdit?.[`${PREFIX}cronogramadediaid`],
            },
            {
              onSuccess: handleSuccess,
              onError: handleError,
            }
          )
        );
      }
    );
  };

  const onEventClick = React.useCallback((args) => {
    const event = args.event;
    handleActivity(event?.[`${PREFIX}Atividade`]?.[`${PREFIX}atividadeid`]);
    // setPopup({ open: true, item: event, anchor: args.domEvent.target });
  }, []);

  const onEventHoverIn = React.useCallback(
    (args) => {
      const event = args.event;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setPopupHover({
        open: true,
        anchor: args.domEvent.target,
        event,
        activity:
          activitiesMap?.[
            event?.[`${PREFIX}Atividade`]?.[`${PREFIX}atividadeid`]
          ],
      });
    },
    [activitiesMap]
  );

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

  const renderCustomEvent = React.useCallback((data) => {
    const ev = data.original;
    const style = data.style;

    return (
      <div
        className='mbsc-schedule-event-inner mbsc-ios'
        style={{
          borderRadius: '5px',
          width: '100%',
          backgroundColor: style.background,
        }}
      >
        <Box display='flex'>
          {/* <div className='mbsc-schedule-event-range mbsc-ios'>{data.start}</div> */}
          <div
            style={{ color: style.color }}
            className='mbsc-schedule-event-title mbsc-ios'
          >
            {ev.title}
          </div>
        </Box>
      </div>
    );
  }, []);

  const handleClosePopup = () => {
    setPopup({ open: false, item: null });
  };

  const handleChangeDate = (amount) => {
    const date = moment(currentDate);

    date.add('day', amount);
    setCurrentDate(date.utc().clone().startOf('day').toISOString());
    setFieldValue('startDate', date.utc());
    setFieldValue('endDate', date.utc());
    handleFilter();
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

  const currentView = React.useMemo(() => {
    let calView;

    switch (view) {
      case 'day':
        calView = {
          timeline: {
            type: 'day',
            labels: 1,
            startTime: timeView?.startTime?.value,
            endTime: timeView?.endTime?.value,
            size: filter?.endDate.diff(filter.startDate, 'days') + 1,
            range: filter?.endDate.diff(filter.startDate, 'days') + 1,
            resolution: 'hour',
            timeCellStep: cellDuration,
            timeLabelStep: cellDuration <= 60 ? 60 : 120,
          },
        };
        break;
    }

    return calView;
  }, [cellDuration, view, timeView, filter]);

  const timeOptions = React.useMemo<any[]>(
    () =>
      Array(24)
        .fill(0)
        .map((_, i) => ({
          value: `${minTwoDigits(i)}:00`,
          label: `${minTwoDigits(i)}:00`,
        })),
    []
  );

  return (
    <>
      <BackdropStyled open={loading || resourceLoading}>
        <CircularProgress color='inherit' />
      </BackdropStyled>

      {!filter.onlyConflicts ||
      (filter.onlyConflicts && schedulerData?.length) ? (
        <>
          <Box
            display='flex'
            width='100%'
            justifyContent='space-between'
            paddingBottom='10px'
          >
            <Box display='flex' style={{ gap: '10px' }}>
              <Button
                onClick={() => handleChangeDate(-1)}
                startIcon={<ArrowBackIos />}
              >
                Anterior
              </Button>
              <Button
                onClick={() => handleChangeDate(1)}
                endIcon={<ArrowForwardIos />}
              >
                Proximo
              </Button>
            </Box>

            <Box
              display='flex'
              justifyContent='flex-between'
              style={{ gap: '20px' }}
            >
              <Box
                display='flex'
                justifyContent='flex-between'
                style={{ gap: '10px' }}
              >
                <Autocomplete
                  options={timeOptions}
                  style={{ minWidth: '6rem' }}
                  getOptionLabel={(option) => option.label}
                  onChange={(event: any, newValue: any) => {
                    setTimeView({ ...timeView, startTime: newValue });
                  }}
                  noOptionsText='Sem Opções'
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='Início do dia' />
                  )}
                  value={timeView.startTime}
                />
                <Autocomplete
                  options={timeOptions}
                  style={{ minWidth: '6rem' }}
                  getOptionLabel={(option) => option.label}
                  onChange={(event: any, newValue: any) => {
                    setTimeView({ ...timeView, endTime: newValue });
                  }}
                  noOptionsText='Sem Opções'
                  renderInput={(params) => (
                    <TextField {...params} fullWidth label='Fim do dia' />
                  )}
                  value={timeView.endTime}
                />
              </Box>

              <TextField
                select
                fullWidth
                style={{ maxWidth: '10rem' }}
                value={cellDuration}
                label='Intervalo'
                onChange={(event) => setCellDuration(+event.target.value)}
              >
                <MenuItem value={15}>15 Minutos</MenuItem>
                <MenuItem value={30}>30 Minutos</MenuItem>
                <MenuItem value={60}>60 Minutos</MenuItem>
                <MenuItem value={120}>2 Horas</MenuItem>
                <MenuItem value={180}>3 Horas</MenuItem>
                <MenuItem value={240}>4 Horas</MenuItem>
              </TextField>
            </Box>
          </Box>

          <Eventcalendar
            dragToResize
            dragToMove
            firstDay={0}
            dataTimezone='America/Sao_Paulo'
            cssClass={styles.calendar}
            data={schedulerData}
            renderHeader={() => (
              <Box>
                <CalendarPrev className='cal-header-prev' />
                <CalendarNext className='cal-header-next' />
              </Box>
            )}
            onEventUpdate={onItemChange}
            onEventClick={onEventClick}
            renderScheduleEvent={renderCustomEvent}
            onEventHoverIn={onEventHoverIn}
            onEventHoverOut={onEventHoverOut}
            locale={localePtBR}
            view={currentView}
            resources={resourcesRender}
            width='100%'
            height='70vh'
            selectedDate={currentDate}
            refDate={currentDate}
            defaultSelectedDate={
              new Date(
                filter.startDate
                  .clone()
                  .utc()
                  .startOf('day')
                  .format('YYYY-MM-DD HH:mm:ss')
              )
            }
            min={
              new Date(
                filter.startDate
                  .clone()
                  .utc()
                  .startOf('day')
                  .format('YYYY-MM-DD HH:mm:ss')
              )
            }
            max={
              new Date(
                filter.endDate
                  .clone()
                  .utc()
                  .endOf('day')
                  .format('YYYY-MM-DD HH:mm:ss')
              )
            }
          />
        </>
      ) : (
        <Box textAlign='center' fontWeight='bold'>
          <Typography variant='h5'>
            Não possui conflitos no período informado
          </Typography>
        </Box>
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
              <span>
                {popupHover?.event?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]}
              </span>
            </Box>
            <span>
              {moment(popupHover?.event?.start).format('HH:mm')} -{' '}
              {moment(popupHover?.event?.end).format('HH:mm')}
            </span>
          </Box>
          <Box padding='5px'>
            <Box>
              <SectionNamePopup>Programa</SectionNamePopup>:{' '}
              {popupHover?.event?.title}
            </Box>
            <Box>
              <SectionNamePopup>Turma</SectionNamePopup>:{' '}
              {popupHover?.event?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]}
            </Box>
          </Box>

          {!popupHover?.event?.allDay ? (
            <Box padding='5px'>
              <Box>
                <SectionNamePopup>Tema</SectionNamePopup>:{' '}
                {popupHover?.activity?.[`${PREFIX}temaaula`]}{' '}
              </Box>

              <Box>
                <SectionNamePopup>Pessoas Envolvidas</SectionNamePopup>
                <SectionList>
                  {popupHover?.activity?.[
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
                  {popupHover?.activity?.[`${PREFIX}Atividade_Espaco`]?.map(
                    (spc) => (
                      <li> {spc?.[`${PREFIX}nome`]}</li>
                    )
                  )}
                </SectionList>
              </Box>

              <Box>
                <SectionNamePopup>Documentos</SectionNamePopup>
                <SectionList>
                  {popupHover?.activity?.[`${PREFIX}Atividade_Documento`]?.map(
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
          <Grid container>
            <Grid item xs={1}>
              <Box width='100%' justifyContent='center' alignItems='center'>
                <AccessTime />
              </Box>
            </Grid>
            <Grid item xs={11}>
              <Typography variant='body1'>
                {moment(popup?.item?.start).format('HH:mm')} -{' '}
                {moment(popup?.item?.end).format('HH:mm')} |{' '}
                {popup?.item?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]} -{' '}
                {popup?.item?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]}
              </Typography>
            </Grid>
          </Grid>

          {popup?.item?.hasConflict ? (
            <TitleResource>Conflitos</TitleResource>
          ) : null}

          <Grid container style={{ maxHeight: '15rem', overflow: 'auto' }}>
            {popup?.item?.conflicts?.map((item) => (
              <>
                <Grid item xs={1}>
                  <Box width='100%' justifyContent='center' alignItems='center'>
                    <Error style={{ color: '#a71111' }} />
                  </Box>
                </Grid>
                <Grid item xs={11}>
                  <Typography variant='body1'>
                    {item?.[`${PREFIX}Atividade`]?.[`${PREFIX}nome`]}
                  </Typography>
                </Grid>
                <ul>
                  <li>
                    {moment(item?.[`${PREFIX}inicio`]).format('HH:mm')} -{' '}
                    {moment(item?.[`${PREFIX}fim`]).format('HH:mm')} |{' '}
                    {item?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]} -{' '}
                    {item?.[`${PREFIX}Programa`]?.[`${PREFIX}titulo`]}
                  </li>
                </ul>
              </>
            ))}
          </Grid>
        </Box>
      </Popup>
    </>
  );
};

export default Timeline;
