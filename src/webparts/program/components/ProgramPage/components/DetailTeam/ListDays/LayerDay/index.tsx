import {
  Box,
  CircularProgress,
  Divider,
  List,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { DragIndicator, ErrorOutline, MoreVert } from '@material-ui/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as moment from 'moment';
import * as React from 'react';
import {
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  TitleCard,
} from '~/components/CustomCard';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import temperatureColor from '~/utils/temperatureColor';
import { WrapperTitle } from './styles';
import momentToMinutes from '~/utils/momentToMinutes';
import { EFatherTag, EGroups } from '~/config/enums';
import { addUpdateSchedule } from '~/store/modules/schedule/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { AppState } from '~/store';
import formatActivityModel from '~/utils/formatActivityModel';
import { useLoggedUser, useNotification } from '~/hooks';
import { Backdrop } from '~/components';

const getListStyle = () => ({
  background: '#fff',
  padding: 8,
  height: 'calc(100vh - 17rem)',
  overflow: 'auto',
});

interface LayerDayProps {
  schedule: any;
  teamChoosed: any;
  programChoosed: any;
  teamId: string;
  programId: string;
  refetchActivity: any;
  handleDetailActivity: (act?: any) => void;
  handleSchedule: (event: any, item: any) => void;
  handleOptionActivity: (event: any, item: any) => void;
}

const LayerDay: React.FC<LayerDayProps> = ({
  schedule,
  teamChoosed,
  programChoosed,
  teamId,
  programId,
  refetchActivity,
  handleSchedule,
  handleDetailActivity,
  handleOptionActivity,
}) => {
  const DEFAULT_VALUES = {
    name: '',
    date: null,
    module: null,
    startTime: null,
    duration: null,
    endTime: null,
    modality: null,
    tool: null,
    toolBackup: null,
    temperature: null,
    place: null,
    link: '',
    linkBackup: '',
    activities: [],
    activitiesToDelete: [],
    observation: '',
    isGroupActive: false,
    anexos: [],
    people: [{ keyId: v4(), person: null, function: null }],
    locale: [{ keyId: v4(), space: null, observation: '' }],
  };

  const [loading, setLoading] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState(DEFAULT_VALUES);
  const dispatch = useDispatch();

  const { currentUser } = useLoggedUser();
  const { notification } = useNotification();
  const { tag, person, space } = useSelector((state: AppState) => state);

  const { dictTag } = tag;
  const { dictPeople } = person;
  const { dictSpace } = space;

  React.useEffect(() => {
    if (schedule) {
      const iniVal = {
        id: schedule?.[`${PREFIX}cronogramadediaid`],
        modeloid: schedule.modeloid,
        baseadoemcronogramadiamodelo: schedule.baseadoemcronogramadiamodelo,
        name: schedule?.[`${PREFIX}nome`] || '',
        date: moment.utc(schedule?.[`${PREFIX}data`]),
        module: dictTag?.[schedule?.[`_${PREFIX}modulo_value`]],
        modality: dictTag?.[schedule?.[`_${PREFIX}modalidade_value`]],
        tool: dictTag?.[schedule?.[`_${PREFIX}ferramenta_value`]],
        isGroupActive: schedule?.[`${PREFIX}agrupamentoatividade`],
        startTime:
          (schedule[`${PREFIX}inicio`] &&
            moment(schedule[`${PREFIX}inicio`], 'HH:mm')) ||
          null,
        endTime:
          (schedule[`${PREFIX}fim`] &&
            moment(schedule[`${PREFIX}fim`], 'HH:mm')) ||
          null,
        duration:
          (schedule[`${PREFIX}duracao`] &&
            moment(schedule[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        toolBackup: dictTag?.[schedule?.[`_${PREFIX}ferramentabackup_value`]],
        place: dictTag?.[schedule?.[`_${PREFIX}local_value`]],
        link: schedule?.[`${PREFIX}link`],
        temperature:
          dictTag?.[
            schedule?.[`${PREFIX}Temperatura`]?.[`${PREFIX}etiquetaid`]
          ] || null,
        linkBackup: schedule?.[`${PREFIX}linkbackup`],
        observation: schedule?.[`${PREFIX}observacao`],
        anexos: [],
        activities: schedule?.activities?.map((act) => {
          let activity = {
            ...act,
            id: act[`${PREFIX}atividadeid`],
            name: act[`${PREFIX}nome`] || '',
            quantity: act[`${PREFIX}quantidadesessao`] || 0,
            theme: act[`${PREFIX}temaaula`] || '',
            area: act[`${PREFIX}AreaAcademica`]
              ? {
                  ...act[`${PREFIX}AreaAcademica`],
                  value: act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}etiquetaid`],
                  label: act[`${PREFIX}AreaAcademica`]?.[`${PREFIX}nome`],
                }
              : null,
            course: act[`${PREFIX}Curso`]
              ? {
                  ...act[`${PREFIX}Curso`],
                  value: act[`${PREFIX}Curso`]?.[`${PREFIX}etiquetaid`],
                  label: act[`${PREFIX}Curso`]?.[`${PREFIX}nome`],
                }
              : null,
            spaces: act[`${PREFIX}Atividade_Espaco`]?.length
              ? act[`${PREFIX}Atividade_Espaco`].map(
                  (e) => dictSpace[e?.[`${PREFIX}espacoid`]]
                )
              : [],
            people: act[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
              ? act[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
                  const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
                  func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                    (e) =>
                      e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
                  );
                  const pe = dictPeople[e?.[`_${PREFIX}pessoa_value`]];

                  return {
                    ...e,
                    keyId: v4(),
                    id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                    person: pe,
                    function: func,
                  };
                })
              : [
                  {
                    keyId: v4(),
                    person: null,
                    function: null,
                  },
                ],
            startTime:
              (act[`${PREFIX}inicio`] &&
                moment(act[`${PREFIX}inicio`], 'HH:mm')) ||
              null,
            duration:
              (act[`${PREFIX}duracao`] &&
                moment(act[`${PREFIX}duracao`], 'HH:mm')) ||
              null,
            endTime:
              (act[`${PREFIX}fim`] && moment(act[`${PREFIX}fim`], 'HH:mm')) ||
              null,
            keyId: v4(),
          };

          return activity;
        }),
        activitiesToDelete: [],
        people: schedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.length
          ? schedule[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]?.map((e) => {
              const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
              func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
                (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
              );

              return {
                keyId: v4(),
                id: e?.[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                person: dictPeople[e?.[`_${PREFIX}pessoa_value`]],
                function: func,
              };
            })
          : [{ keyId: v4(), person: null, function: null }],
        locale: schedule[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.length
          ? schedule[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]?.map(
              (e) => ({
                keyId: v4(),
                id: e?.[`${PREFIX}localcronogramadiaid`],
                space: dictSpace[e?.[`_${PREFIX}espaco_value`]],
                observation: e?.[`${PREFIX}observacao`],
              })
            )
          : [{ keyId: v4(), person: null, function: null }],
      };

      setInitialValues(iniVal);
      formik.setValues(iniVal);
    }
  }, [schedule.activities]);

  const myGroup = () => {
    if (currentUser?.isPlanning) {
      return EGroups.PLANEJAMENTO;
    }

    if (currentUser?.isAdmission) {
      return EGroups.ADMISSOES;
    }

    return '';
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      const newActivities = values.activities.concat(values.activitiesToDelete);

      setLoading(true);

      const body = {
        ...values,
        group: myGroup(),
        user: currentUser?.[`${PREFIX}pessoaid`],
        activities: newActivities?.map((actv) => ({
          [`${PREFIX}atividadeid`]: actv?.[`${PREFIX}atividadeid`],
          deleted: actv?.deleted,
          ...formatActivityModel(actv, values.date, {
            isModel: false,
            dictPeople: dictPeople,
            dictSpace: dictSpace,
            dictTag: dictTag,
          }),
        })),
      };
      dispatch(
        addUpdateSchedule(
          {
            ...body,
            group: myGroup(),
            user: currentUser?.[`${PREFIX}pessoaid`],
          },
          teamId,
          programId,
          {
            onSuccess: () => {
              refetchActivity?.();
              setLoading(false);
              notification.success({
                title: 'Sucesso',
                description: 'Atualização realizada com sucesso',
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
    },
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    borderRadius: '10px',
    marginBottom: '10px',
    width: '100%',
    background: isDragging ? '#d5effd' : '#fff',

    ...draggableStyle,
  });

  const reorderTime = (list, newList) => {
    let lastTime = list[0]?.startTime;

    return newList?.map((actv) => {
      const duration = momentToMinutes(actv.duration);
      const endTime = lastTime.clone().add(duration, 'm');
      const result = {
        ...actv,
        endTime,
        startTime: lastTime,
        startDate: lastTime.format('YYYY-MM-DD HH:mm:ss'),
        endDate: endTime.format('YYYY-MM-DD HH:mm:ss'),
        [`${PREFIX}inicio`]: lastTime.format('HH:mm'),
        [`${PREFIX}fim`]: endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: lastTime.format('YYYY-MM-DDTHH:mm:ss'),
        [`${PREFIX}datahorafim`]: endTime.format('YYYY-MM-DDTHH:mm:ss'),
      };

      lastTime = endTime;

      return result;
    });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      formik.values.activities,
      result.source.index,
      result.destination.index
    );

    const newItems = reorderTime(formik.values.activities, items);

    formik.setFieldValue('activities', newItems);
    formik.handleSubmit();
  };

  const temperature = temperatureColor(
    schedule,
    teamChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
      programChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`]
  );

  return (
    <Box minWidth='15rem' className='LayerDay' maxWidth='20rem'>
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <WrapperTitle
        background={temperature.background}
        color={temperature.color}
      >
        <Box display='flex' alignItems='center' justifyContent='center'>
          {schedule.hasConflict ? (
            <Tooltip title='Dia de aula possui conflitos'>
              <ErrorOutline />
            </Tooltip>
          ) : null}

          <h5>
            {moment.utc(schedule?.[`${PREFIX}data`]).format('DD/MM/YYYY')}
          </h5>
        </Box>
        <Tooltip arrow title='Ações'>
          <StyledIconButton
            aria-label='settings'
            onClick={(event) => handleSchedule(event, schedule)}
          >
            <MoreVert />
          </StyledIconButton>
        </Tooltip>
      </WrapperTitle>

      <Divider style={{ marginBottom: '1rem' }} />
      <Box
        width='100%'
        display='flex'
        flexDirection='column'
        style={{ gap: '10px' }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle()}
              >
                {formik.values?.activities?.map((actv, index) => {
                  const actTemp = temperatureColor(
                    actv,
                    teamChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
                      programChoosed?.[`${PREFIX}Temperatura`]?.[
                        `${PREFIX}nome`
                      ]
                  );
                  return (
                    <Draggable
                      key={actv?.[`${PREFIX}atividadeid`]}
                      draggableId={actv?.[`${PREFIX}atividadeid`]}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          onClickCapture={(e: any) => {
                            if (
                              e.defaultPrevented ||
                              e.target.nodeName === 'LI'
                            ) {
                              return;
                            }
                            if (
                              e.currentTarget !== e.target &&
                              e.target.tabIndex >= 0
                            ) {
                              e.target.focus();
                            } else {
                              e.currentTarget.focus();
                            }
                          }}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <StyledCard
                            key={actv?.[`${PREFIX}atividadeid`]}
                            background={actTemp.background}
                            color={actTemp.color}
                            elevation={3}
                          >
                            <StyledHeaderCard
                              action={
                                <Tooltip arrow title='Ações'>
                                  <StyledIconButton
                                    onClick={(event) =>
                                      handleOptionActivity(event, actv)
                                    }
                                    aria-label='settings'
                                  >
                                    <MoreVert />
                                  </StyledIconButton>
                                </Tooltip>
                              }
                              title={
                                <Tooltip arrow title={actv?.[`${PREFIX}nome`]}>
                                  <TitleCard
                                    onClick={() => handleDetailActivity(actv)}
                                  >
                                    {actv?.[`${PREFIX}nome`]}
                                  </TitleCard>
                                </Tooltip>
                              }
                            />
                            <StyledContentCard
                              onClick={() => handleDetailActivity(actv)}
                            >
                              <Divider />
                              <Box display='flex'>
                                <DragIndicator
                                  style={{ marginRight: '10px' }}
                                />
                                <Box display='flex' flexDirection='column'>
                                  <Typography variant='body1'>
                                    {actv?.[`${PREFIX}inicio`]} -{' '}
                                    {actv?.[`${PREFIX}fim`]}
                                  </Typography>
                                  <Typography variant='body2'>
                                    {
                                      dictTag?.[
                                        actv?.[`_${PREFIX}areaacademica_value`]
                                      ]?.[`${PREFIX}nome`]
                                    }
                                  </Typography>
                                </Box>
                              </Box>
                            </StyledContentCard>
                          </StyledCard>
                        </Box>
                      )}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default LayerDay;
