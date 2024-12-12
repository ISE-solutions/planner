import * as React from 'react';
import * as Moment from 'moment';
import {
  Box,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { extendMoment } from 'moment-range';
import checkConflictDate from '~/utils/checkConflictDate';
import {
  CalendarNav,
  CalendarNext,
  CalendarPrev,
  CalendarToday,
  Eventcalendar,
  localePtBR,
  Popup,
  SegmentedGroup,
  SegmentedItem,
  setOptions,
} from '@mobiscroll/react';
import { AccessTime, Error } from '@material-ui/icons';
import styles from './Calendar.module.scss';
import { TitleResource } from './styles';
import { EFatherTag } from '~/config/enums';
import temperatureColor from '~/utils/temperatureColor';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

const locale = 'pt-BR';
const moment = extendMoment(Moment);

moment.locale(locale);

setOptions({
  locale: localePtBR,
  theme: 'ios',
  themeVariant: 'light',
});

interface ICalendar {
  resources: any[];
  filter: any;
}

const Calendar: React.FC<ICalendar> = ({ resources, filter }) => {
  const [schedulerData, setSchedulerData] = React.useState([]);
  const [currentDate, setCurrentDate] = React.useState(moment().toISOString());
  const [cellDuration, setCellDuration] = React.useState(60);
  const [popup, setPopup] = React.useState<any>({ open: false });
  const [view, setView] = React.useState('week');

  const { tag, person, space } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;
  const { dictSpace } = space;

  const checkConflict = (resource) => {
    let resourcesConflicted = [];

    const datesAppointment = [
      moment(resource?.[`${PREFIX}inicio`]),
      moment(resource?.[`${PREFIX}fim`]),
    ] as [Moment.Moment, Moment.Moment];

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
    setCurrentDate(filter.startDate.clone().startOf('day').toISOString());
  }, [filter.startDate]);

  React.useEffect(() => {
    if (dictTag && Object.keys(dictTag).length) {
      let newSchedulerData = resources?.map((res) => {
        const resourceConflict = checkConflict(res);
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

        const activity = res?.[`${PREFIX}Atividade`];
        activity[`${PREFIX}Temperatura`] =
          dictTag[res?.[`${PREFIX}Atividade`]?.[`_${PREFIX}temperatura_value`]];
        const programTemp =
          dictTag[res?.[`${PREFIX}Programa`]?.[`_${PREFIX}temperatura_value`]];
        const teamTemp =
          dictTag[res?.[`${PREFIX}Turma`]?.[`_${PREFIX}temperatura_value`]];
        const dayTemp =
          dictTag[
            res?.[`${PREFIX}CronogramaDia`]?.[`_${PREFIX}temperatura_value`]
          ];

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
          id: res?.[`${PREFIX}recursosid`],
          title:
            res?.[`${PREFIX}Espaco`]?.[`${PREFIX}nome`] ||
            res?.[`${PREFIX}Pessoa`]?.[`${PREFIX}nome`] ||
            res?.[`${PREFIX}Recurso_RecursoFinitoeInfinito`]?.[`${PREFIX}nome`],
          start: res?.[`${PREFIX}inicio`],
          end: res?.[`${PREFIX}fim`],
        };
      });

      if (filter.tagsFilter) {
        newSchedulerData = newSchedulerData?.filter((res) => {
          const spaceRes = dictSpace?.[res?.[`_${PREFIX}espaco_value`]];
          const personRes = dictPeople?.[res?.[`_${PREFIX}pessoa_value`]];

          if (spaceRes) {
            return spaceRes?.[`${PREFIX}Espaco_Etiqueta_Etiqueta`].some(
              (tg) =>
                tg?.[`${PREFIX}etiquetaid`] ===
                filter.tagsFilter?.[`${PREFIX}etiquetaid`]
            );
          }
          if (personRes) {
            return personRes?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`].some(
              (tg) =>
                tg?.[`${PREFIX}etiquetaid`] ===
                filter.tagsFilter?.[`${PREFIX}etiquetaid`]
            );
          }
        });
      }

      if (filter.onlyConflicts) {
        newSchedulerData = newSchedulerData.filter((res) => res.hasConflict);
      }

      setSchedulerData(newSchedulerData);
    }
  }, [resources, dictTag]);

  const onEventClick = React.useCallback((args) => {
    const event = args.event;
    setPopup({ open: true, item: event, anchor: args.domEvent.target });
  }, []);

  const handleClosePopup = () => {
    setPopup({ open: false, item: null });
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

  const customWithNavButtons = () => {
    return (
      <>
        <CalendarNav className='cal-header-nav' />
        <div className={styles.headerPicker}>
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
        </div>
        <CalendarPrev className='cal-header-prev' />
        <CalendarToday className='cal-header-today' />
        <CalendarNext className='cal-header-next' />
      </>
    );
  };

  const currentView = React.useMemo(() => {
    let calView;

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
      case 'agenda':
        calView = {
          calendar: { type: 'week' },
          agenda: { type: 'week' },
        };
        break;
    }

    return calView;
  }, [cellDuration, view]);

  return (
    <>
      <Box display='flex' justifyContent='flex-end'>
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
        allDayText='Módulo'
        width='100%'
        height='34rem'
        locale={localePtBR}
        firstDay={0}
        data={[...(schedulerData || [])]}
        view={currentView}
        // @ts-ignore
        onSelectedDateChange={(e) => setCurrentDate(e.date.toISOString())}
        renderHeader={customWithNavButtons}
        onEventClick={onEventClick}
        selectedDate={currentDate}
        min={filter.startDate.clone().startOf('day').toISOString()}
        max={filter.endDate.clone().startOf('day').toISOString()}
      />

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
                {moment.utc(popup?.item?.start).format('HH:mm')} -{' '}
                {moment.utc(popup?.item?.end).format('HH:mm')} |{' '}
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
                    {moment.utc(item?.[`${PREFIX}inicio`]).format('HH:mm')} -{' '}
                    {moment.utc(item?.[`${PREFIX}fim`]).format('HH:mm')} |{' '}
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

export default Calendar;
