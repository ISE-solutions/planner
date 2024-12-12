import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { v4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Autocomplete } from '@material-ui/lab';
import { IconHelpTooltip } from '~/components';
import { useActivity, useScheduleDay } from '~/hooks';
import {
  EActivityTypeApplication,
  EFatherTag,
  TYPE_ACTIVITY,
} from '~/config/enums';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import {
  Add,
  Delete,
  DragIndicator,
  ExpandMore,
  FileCopy,
} from '@material-ui/icons';
import { KeyboardTimePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import momentToMinutes from '~/utils/momentToMinutes';
import { BoxActivityName } from './styles';
import * as _ from 'lodash';
import InfoForm from './InfoForm';
import EnvolvedPeopleForm from './EnvolvedPeopleForm';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';

interface IActivitiesForm {
  values: any;
  isDetail?: boolean;
  errors: any;
  setFieldValue: Function;
  tagsOptions: any[];
  spaceOptions: any[];
}

const getListStyle = () => ({
  background: '#fff',
  padding: 8,
});

const ActivitiesForm: React.FC<IActivitiesForm> = ({
  values,
  isDetail,
  errors,
  setFieldValue,
  tagsOptions,
  spaceOptions,
}) => {
  const [filter, setFilter] = React.useState({
    typeActivity: TYPE_ACTIVITY.ACADEMICA,
    typeApplication: EActivityTypeApplication.PLANEJAMENTO,
    top: TOP_QUANTITY,
    active: 'Ativo' as any,
    search: '',
  });
  const [activity, setActivity] = React.useState<any>({});
  const [expand, setExpand] = React.useState<any>({});

  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { dictPeople } = person;

  const [{ loading, activities, getActivityByScheduleId }] =
    useActivity(filter);
  const [{ loading: loadingSchedule, schedule }] = useScheduleDay({
    active: 'Ativo',
    searchQuery: filter.search,
    published: 'Sim',
    group: 'Sim',
    model: true,
  });

  const handleActivityType = (event) => {
    setFilter({ ...filter, typeActivity: event.target.value });
  };

  const handleAddActivity = () => {
    if (!Object.keys(activity).length) return;

    if ((filter.typeActivity as any) === 'agrupamento') {
      getActivityByScheduleId(activity?.[`${PREFIX}cronogramadediaid`]).then(
        (activities) => {
          let newActivities = [...values.activities];
          const activitiesToSave = activities?.value?.map((actv) => {
            delete actv[`${PREFIX}atividadeid`];

            actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
              delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
            });

            actv?.[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
              delete elm[`${PREFIX}nomeatividadeid`];
            });

            actv?.[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
              delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
            });

            actv?.[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
              delete elm[`${PREFIX}requisicaoacademicaid`];
            });

            actv.people = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
              ? actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
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
                ];

            return {
              ...actv,
              startTime:
                (actv[`${PREFIX}inicio`] &&
                  moment(actv[`${PREFIX}inicio`], 'HH:mm')) ||
                null,
              duration:
                (actv[`${PREFIX}duracao`] &&
                  moment(actv[`${PREFIX}duracao`], 'HH:mm')) ||
                null,
              endTime:
                (actv[`${PREFIX}fim`] &&
                  moment(actv[`${PREFIX}fim`], 'HH:mm')) ||
                null,
              keyId: v4(),
            };
          });

          newActivities = newActivities.concat(activitiesToSave);
          setFieldValue(
            'activities',
            reorderTime(newActivities, newActivities)
          );
          setActivity({});
        }
      );
    } else {
      const newActivities = [...values.activities];
      delete activity[`${PREFIX}atividadeid`];
      const startTime = moment('08:00', 'HH:mm');
      const duration = momentToMinutes(
        moment(activity[`${PREFIX}duracao`], 'HH:mm')
      );
      const endTime = startTime.clone().add(duration, 'minutes');

      const actv = {
        ...activity,
        startTime,
        endTime,
        duration:
          (activity[`${PREFIX}duracao`] &&
            moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
          null,
        startDate: startTime.format(),
        endDate: endTime.format(),
        [`${PREFIX}inicio`]: startTime.format('HH:mm'),
        [`${PREFIX}fim`]: endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: startTime.format(),
        [`${PREFIX}datahorafim`]: endTime.format(),
        keyId: v4(),
      };

      actv?.[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
        delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
      });

      actv?.[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
        delete elm[`${PREFIX}nomeatividadeid`];
      });

      actv?.[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
        delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
      });

      actv?.[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
        delete elm[`${PREFIX}requisicaoacademicaid`];
      });

      actv.people = actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length
        ? actv[`${PREFIX}Atividade_PessoasEnvolvidas`]?.map((e) => {
            const func = dictTag[e?.[`_${PREFIX}funcao_value`]] || {};
            func.needApprove = func?.[`${PREFIX}Etiqueta_Pai`]?.some(
              (e) => e?.[`${PREFIX}nome`] === EFatherTag.NECESSITA_APROVACAO
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
          ];

      newActivities.push(actv);

      let newItems = newActivities;
      if (newActivities.length > 1) {
        newItems = reorderTime(newItems, newItems);
      }

      setActivity({});
      setFieldValue('activities', newItems);
    }
  };

  const handleRemoveActivity = (index) => {
    let newActivities = [...values.activities];
    let newActivitiesToDelete = [...values.activitiesToDelete];

    const actvToDelete = newActivities[index];
    actvToDelete.deleted = true;

    if (actvToDelete?.[`${PREFIX}atividadeid`]) {
      newActivitiesToDelete.push(actvToDelete);
      setFieldValue('activitiesToDelete', newActivitiesToDelete);
    }
    newActivities.splice(index, 1);

    setFieldValue('activities', newActivities);
  };

  const handleCopyActivity = (index) => {
    let newActivities = [...values.activities];
    let actvToCopy = _.cloneDeep(newActivities[index]);
    delete actvToCopy[`${PREFIX}atividadeid`];
    delete actvToCopy.id;

    actvToCopy?.[`${PREFIX}Atividade_PessoasEnvolvidas`].forEach((elm) => {
      delete elm[`${PREFIX}pessoasenvolvidasatividadeid`];
    });

    actvToCopy?.[`${PREFIX}Atividade_NomeAtividade`].forEach((elm) => {
      delete elm[`${PREFIX}nomeatividadeid`];
    });

    actvToCopy?.[`${PREFIX}PessoasRequisica_Atividade`].forEach((elm) => {
      delete elm[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`];
    });

    actvToCopy?.[`${PREFIX}RequisicaoAcademica_Atividade`].forEach((elm) => {
      delete elm[`${PREFIX}requisicaoacademicaid`];
    });

    actvToCopy.keyId = v4();
    newActivities.splice(index, 0, actvToCopy);
    setFieldValue('activities', reorderTime(newActivities, newActivities));
  };

  const handleChangeStart = (index, value) => {
    if (!value || !value.isValid()) {
      return;
    }
    let actv = { ...values.activities[index] };
    const start = value;

    const momentDuration = moment(actv?.[`${PREFIX}duracao`], 'HH:mm');
    const minutes = momentToMinutes(momentDuration);
    const end = value.clone().add(minutes, 'minutes');

    actv = {
      ...actv,
      startDate: start.format(),
      endDate: end.format(),
      startTime: start,
      endTime: end,
      [`${PREFIX}inicio`]: start.format('HH:mm'),
      [`${PREFIX}fim`]: end.format('HH:mm'),
      [`${PREFIX}datahorainicio`]: start.format(),
      [`${PREFIX}datahorafim`]: end.format(),
    };

    let newItems = _.cloneDeep(values.activities);
    newItems[index] = actv;

    if (index != 0) {
      newItems = newItems.sort(
        (a, b) => a.startTime.unix() - b.startTime.unix()
      );
    }
    newItems = reorderTime(newItems, newItems);

    setFieldValue(`activities`, newItems);
  };

  const handleChangeDuration = (index, value) => {
    if (!value || !value.isValid()) {
      return;
    }

    let actv = { ...values.activities[index] };

    const duration = value?.hour() * 60 + value?.minute();
    const start = actv.startTime;
    const end = start.clone().add(duration, 'minutes');

    actv = {
      ...actv,
      startDate: start.format(),
      endDate: end.format(),
      startTime: start,
      endTime: end,
      duration: value,
      [`${PREFIX}duracao`]: value.format('HH:mm'),
      [`${PREFIX}inicio`]: start.format('HH:mm'),
      [`${PREFIX}fim`]: end.format('HH:mm'),
      [`${PREFIX}datahorainicio`]: start.format(),
      [`${PREFIX}datahorafim`]: end.format(),
    };
    let newItems = _.cloneDeep(values.activities);
    newItems[index] = actv;
    newItems = reorderTime(newItems, newItems);

    setFieldValue(`activities`, newItems);
  };

  const reorderTime = (list, newList) => {
    let lastTime = list[0]?.startTime;

    return newList?.map((actv) => {
      const duration = momentToMinutes(actv.duration);
      const endTime = lastTime.clone().add(duration, 'm');
      const result = {
        ...actv,
        endTime,
        startTime: lastTime,
        startDate: lastTime.format(),
        endDate: endTime.format(),
        [`${PREFIX}inicio`]: lastTime.format('HH:mm'),
        [`${PREFIX}fim`]: endTime.format('HH:mm'),
        [`${PREFIX}datahorainicio`]: lastTime.format(),
        [`${PREFIX}datahorafim`]: endTime.format(),
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

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    borderRadius: '10px',
    marginBottom: '10px',
    width: '100%',
    background: isDragging ? '#d5effd' : '#fff',

    ...draggableStyle,
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      values.activities,
      result.source.index,
      result.destination.index
    );

    const newItems = reorderTime(values.activities, items);
    setFieldValue('activities', newItems);
  };

  const toggleAcordion = (index) => {
    setExpand({ ...expand, [index]: !expand[index] });
  };

  const setValuePerson = (index, actv) => {};

  const activitiesOptions = React.useMemo(
    () =>
      activities?.sort((a, b) => {
        if (a?.[`${PREFIX}nome`] < b?.[`${PREFIX}nome`]) {
          return -1;
        }
        if (a?.[`${PREFIX}nome`] > b?.[`${PREFIX}nome`]) {
          return 1;
        }
        return 0;
      }),
    [activities]
  );

  const scheduleOptions = React.useMemo(
    () =>
      schedule?.sort((a, b) => {
        if (a?.[`${PREFIX}nome`] < b?.[`${PREFIX}nome`]) {
          return -1;
        }
        if (a?.[`${PREFIX}nome`] > b?.[`${PREFIX}nome`]) {
          return 1;
        }
        return 0;
      }),
    [schedule]
  );

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item lg={12} md={12} xs={12}>
        <FormControl
          disabled={isDetail}
          component='fieldset'
          onChange={handleActivityType}
        >
          <FormLabel component='legend'>Tipo de Atividade</FormLabel>
          <RadioGroup
            aria-label='position'
            name='position'
            style={{ flexDirection: 'row' }}
            value={filter.typeActivity}
            defaultValue={filter.typeActivity}
          >
            <FormControlLabel
              value={TYPE_ACTIVITY.ACADEMICA}
              control={<Radio color='primary' />}
              label='Atividade Acadêmica'
            />
            <FormControlLabel
              value={TYPE_ACTIVITY.NON_ACADEMICA}
              control={<Radio color='primary' />}
              label='Atividade Não Acadêmica'
            />
            <FormControlLabel
              value={TYPE_ACTIVITY.INTERNAL}
              control={<Radio color='primary' />}
              label='Atividade Interna'
            />
            <FormControlLabel
              value='agrupamento'
              control={<Radio color='primary' />}
              label='Agrupamento de atividades'
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item lg={12} md={12} xs={12}>
        <Box display='flex' alignItems='end' style={{ gap: '1rem' }}>
          <Autocomplete
            fullWidth
            disabled={isDetail}
            noOptionsText='Sem Opções'
            options={
              (filter.typeActivity as any) === 'agrupamento'
                ? scheduleOptions || []
                : activitiesOptions || []
            }
            value={activity}
            getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
            onChange={(event: any, newValue: any | null) =>
              setActivity(newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!errors.activity}
                // @ts-ignore
                helperText={errors.activity}
                label={
                  <Box
                    display='flex'
                    alignItems='center'
                    style={{ gap: '5px' }}
                  >
                    Atividade
                    <IconHelpTooltip title='Digite pelo menos 3 caracteres para realizar a busca.' />
                  </Box>
                }
                onChange={(event) =>
                  setFilter({ ...filter, search: event.target.value })
                }
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color='inherit' size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />

          <Button
            variant='contained'
            color='primary'
            disabled={isDetail || !activity}
            startIcon={<Add />}
            onClick={() => handleAddActivity()}
          >
            Adicionar
          </Button>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable isDropDisabled={!!isDetail} droppableId='droppable'>
            {(provided, snapshot) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle()}
              >
                {values.activities?.map((act, index: number) => (
                  <Draggable
                    key={act.keyId}
                    draggableId={act.keyId}
                    isEnabled={isDetail}
                    disableInteractiveElementBlocking={isDetail}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        onClickCapture={(e: any) => {
                          if (
                            e.defaultPrevented ||
                            e.target.nodeName === 'LI' ||
                            e.target?.id === 'checkSpace'
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
                        <Accordion
                          onChange={() => null}
                          expanded={!!expand[index]}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                            IconButtonProps={{
                              onClick: () => toggleAcordion(index),
                            }}
                            aria-label='Expand'
                            aria-controls='additional-actions1-content'
                            id='additional-actions1-header'
                          >
                            <ListItem
                              ContainerProps={{ style: { width: '100%' } }}
                              style={{ paddingLeft: 0 }}
                            >
                              <DragIndicator style={{ marginRight: '10px' }} />
                              <ListItemText
                                primary={
                                  <BoxActivityName>
                                    {act?.name || act?.[`${PREFIX}nome`]}
                                  </BoxActivityName>
                                }
                                secondary={`${act?.[`${PREFIX}inicio`]} - ${
                                  act?.[`${PREFIX}fim`]
                                }`}
                              />

                              <ListItemSecondaryAction>
                                <Box display='flex' maxWidth='20rem'>
                                  <KeyboardTimePicker
                                    ampm={false}
                                    cancelLabel='Cancelar'
                                    disabled={isDetail || !activity}
                                    invalidDateMessage='Formato inválido'
                                    label='Início'
                                    style={{ marginRight: '10px' }}
                                    value={act?.startTime}
                                    error={!!errors.startTime}
                                    helperText={errors.startTime as any}
                                    onChange={(value) =>
                                      handleChangeStart(index, value)
                                    }
                                  />
                                  <KeyboardTimePicker
                                    ampm={false}
                                    cancelLabel='Cancelar'
                                    disabled={isDetail || !activity}
                                    invalidDateMessage='Formato inválido'
                                    label='Duração'
                                    value={act?.duration}
                                    error={!!errors.duration}
                                    helperText={errors.duration as any}
                                    onChange={(value) =>
                                      handleChangeDuration(index, value)
                                    }
                                  />

                                  <Divider orientation='vertical' />
                                  <Tooltip title='Remover'>
                                    <IconButton
                                      edge='end'
                                      disabled={isDetail}
                                      onClick={() =>
                                        handleRemoveActivity(index)
                                      }
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title='Duplicar'>
                                    <IconButton
                                      edge='end'
                                      disabled={isDetail}
                                      onClick={() => handleCopyActivity(index)}
                                    >
                                      <FileCopy />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                          </AccordionSummary>
                          <AccordionDetails style={{ flexDirection: 'column' }}>
                            <InfoForm
                              index={index}
                              disabled={isDetail || !activity}
                              tagsOptions={tagsOptions}
                              spaceOptions={spaceOptions}
                              values={act}
                              errors={errors}
                              setFieldValue={setFieldValue}
                            />

                            <Box width='100%'>
                              <EnvolvedPeopleForm
                                isDetail={isDetail}
                                values={values}
                                errors={errors}
                                index={index}
                                setFieldValue={setFieldValue}
                              />
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
    </Grid>
  );
};

export default ActivitiesForm;
