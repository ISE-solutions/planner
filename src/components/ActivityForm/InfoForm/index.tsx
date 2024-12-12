import * as React from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import {
  EActivityTypeApplication,
  EFatherTag,
  TYPE_ACTIVITY,
} from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { KeyboardTimePicker } from '@material-ui/pickers';
import * as moment from 'moment';
import { useConfirmation, useNotification } from '~/hooks';
import {
  AccessTime,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckCircle,
  Close,
  FilterList,
  PlusOne,
  SyncAlt,
} from '@material-ui/icons';
import checkConflictDate from '~/utils/checkConflictDate';
import AddTag from '~/components/AddTag';
import AddSpace from '~/components/AddSpace';
import { getResources } from '~/store/modules/resource/actions';
import { updateActivity } from '~/store/modules/activity/actions';
import LoadActivity from './LoadActivity';
import FilterSpace from './FilterSpace';
import * as _ from 'lodash';

interface IInfoForm {
  canEdit: boolean;
  isModel: boolean;
  isDetail?: boolean;
  isModelReference: boolean;
  isDraft: boolean;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isAcademicDirector: boolean;
  tagsOptions: any[];
  spaceOptions: any[];
  errors: any;
  values: any;
  currentUser: any;
  activityType: string;
  handleChange: any;
  setFieldValue: any;
  activity: any;
  detailApproved: boolean;
  setActivity?: (item) => void;
  loadingApproval: any;
  handleAproval: (nameField: any, dateField: any) => void;
  handleEditApproval: (nameField: any, dateField: any) => void;
}

const InfoForm: React.FC<IInfoForm> = ({
  canEdit,
  isModel,
  isDetail,
  isModelReference,
  isDraft,
  isProgramResponsible,
  isProgramDirector,
  isAcademicDirector,
  tagsOptions,
  activityType,
  spaceOptions,
  values,
  errors,
  detailApproved,
  currentUser,
  handleChange,
  setFieldValue,
  setActivity,
  activity,
  loadingApproval,
  handleAproval,
  handleEditApproval,
}) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });
  const [newSpace, setNewSpace] = React.useState({
    open: false,
  });
  const [areaLoading, setAreaLoading] = React.useState(false);
  const [spaceLoading, setSpaceLoading] = React.useState(false);
  const [openLoadActivity, setOpenLoadActivity] = React.useState(false);
  const [openFilterSpace, setOpenFilterSpace] = React.useState(false);
  const [dialogConflict, setDialogConflict] = React.useState({
    open: false,
    msg: null,
  });

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const areaOptions = tagsOptions
    ?.filter((tag) =>
      tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
        (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
      )
    )
    ?.sort((a, b) => a?.[`${PREFIX}ordem`] - b?.[`${PREFIX}ordem`]);

  const temperatureOptions = React.useMemo(
    () =>
      tagsOptions?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
        )
      ),
    [tagsOptions]
  );

  const fatherTags = React.useMemo(
    () => tagsOptions?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tagsOptions]
  );

  const checkSpaceConflicts = (resources: any[]) => {
    const datesAppointment = [
      moment(activity?.[`${PREFIX}datahorainicio`]),
      moment(activity?.[`${PREFIX}datahorafim`]),
    ] as [moment.Moment, moment.Moment];

    return resources.filter((res) => {
      const datesResource = [
        moment(res?.[`${PREFIX}inicio`]),
        moment(res?.[`${PREFIX}fim`]),
      ] as [moment.Moment, moment.Moment];

      return (
        checkConflictDate(datesAppointment, datesResource) &&
        res?.[`${PREFIX}Atividade`]?.[`_${PREFIX}espaco_aprovador_por_value`]
      );
    });
  };

  const approveSpace = async () => {
    setSpaceLoading(true);

    const filterQuery = {
      dayDate: moment(activity[`${PREFIX}datahorainicio`]),
      spaces: activity[`${PREFIX}Atividade_Espaco`]?.map((e) => ({
        value: e?.[`${PREFIX}espacoid`],
      })),
    };

    const resConflictRequest = await getResources(filterQuery);
    const conflicts = checkSpaceConflicts(resConflictRequest?.value);

    if (conflicts?.length) {
      setSpaceLoading(false);

      setDialogConflict({
        open: true,
        msg: (
          <div>
            <Typography>Os seguintes espaços possui conflitos:</Typography>
            <ul>
              {conflicts?.map((conflict) => (
                <li key={conflict?.[`${PREFIX}Espaco`]?.[`${PREFIX}nome`]}>
                  <Box display='flex' style={{ gap: '10px' }}>
                    <strong>
                      {conflict?.[`${PREFIX}Espaco`]?.[`${PREFIX}nome`]}
                    </strong>
                    <span>
                      {conflict?.[`${PREFIX}Programa`]?.[`${PREFIX}titulo`]}
                      {' - '}
                      {conflict?.[`${PREFIX}Turma`]?.[`${PREFIX}nome`]}
                    </span>
                  </Box>
                </li>
              ))}
            </ul>
          </div>
        ),
      });
      return;
    }

    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}Espaco_Aprovador_Por@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}espacodatahoraaprovacao`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setSpaceLoading(false);
          setActivity(act);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setSpaceLoading(false);
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const editSpace = () => {
    setSpaceLoading(true);
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}Espaco_Aprovador_Por@odata.bind`]: null,
        [`${PREFIX}espacodatahoraaprovacao`]: null,
      },
      {
        onSuccess: (act) => {
          setSpaceLoading(false);
          setActivity(act);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setSpaceLoading(false);
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const handleEditSpace = () => {
    confirmation.openConfirmation({
      onConfirm: editSpace,
      title: 'Confirmação',
      description:
        'Ao confirmar todos os espaços precisaram de uma nova aprovação, tem certeza de realizar essa ação',
    });
  };

  const approveArea = () => {
    setAreaLoading(true);
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}AreaAcademicaAprovadaPor@odata.bind`]: `/${PERSON}(${
          currentUser?.[`${PREFIX}pessoaid`]
        })`,
        [`${PREFIX}areaacademicadatahoraaprovacao`]: moment().format(),
      },
      {
        onSuccess: (act) => {
          setAreaLoading(false);
          setActivity(act);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setAreaLoading(false);
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const editArea = () => {
    setAreaLoading(true);
    updateActivity(
      activity[`${PREFIX}atividadeid`],
      {
        [`${PREFIX}AreaAcademicaAprovadaPor@odata.bind`]: null,
        [`${PREFIX}areaacademicadatahoraaprovacao`]: null,
      },
      {
        onSuccess: (act) => {
          setAreaLoading(false);
          setActivity(act);
          notification.success({
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
          });
        },
        onError: (err) => {
          setAreaLoading(false);
          notification.error({
            title: 'Falha',
            description: err?.data?.error?.message,
          });
        },
      }
    );
  };

  const handleEditArea = () => {
    confirmation.openConfirmation({
      onConfirm: editArea,
      title: 'Confirmação',
      description:
        'Ao confirmar a área irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
    });
  };

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tagsOptions.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tagsOptions]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  const handleChangeActivity = (newActivity) => {
    setFieldValue('name', newActivity?.[`${PREFIX}nome`]);

    if (
      activity?.[`${PREFIX}tipo`] !== newActivity?.[`${PREFIX}tipo`] &&
      newActivity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA
    ) {
      setFieldValue('theme', '');
      setFieldValue('type', newActivity?.[`${PREFIX}tipo`]);
    }

    if (
      activity?.[`${PREFIX}tipo`] !== newActivity?.[`${PREFIX}tipo`] &&
      (newActivity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.NON_ACADEMICA ||
        newActivity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)
    ) {
      setFieldValue('theme', '');
      setFieldValue('description', '');
      setFieldValue('type', newActivity?.[`${PREFIX}tipo`]);
      setFieldValue(
        'documents',
        activity?.[`${PREFIX}Atividade_Documento`]?.map((document) => ({
          ...document,
          deleted: true,
        }))
      );
    }
  };

  const handleAddSpaceByFilter = (newSpaces) => {
    let spc = _.cloneDeep(values.spaces);
    spc = spc.concat(newSpaces);
    spc = _.uniqBy(spc, 'value');

    setFieldValue('spaces', spc);
  };

  return (
    <>
      <LoadActivity
        currentActivity={activity}
        open={openLoadActivity}
        onLoadActivity={handleChangeActivity}
        onClose={() => setOpenLoadActivity(false)}
      />

      <FilterSpace
        open={openFilterSpace}
        currentSpaces={values.spaces}
        onFilterSpace={handleAddSpaceByFilter}
        onClose={() => setOpenFilterSpace(false)}
      />

      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        {isModelReference ? (
          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Título'
              type='text'
              name='title'
              disabled={isDetail}
              inputProps={{ maxLength: 255 }}
              error={!!errors.title}
              helperText={errors.title as string}
              onChange={handleChange}
              value={values.title}
            />
          </Grid>
        ) : null}

        <Grid item sm={12} md={6} lg={6}>
          <Box display='flex' alignItems='center'>
            <TextField
              fullWidth
              disabled
              label='Nome da Atividade'
              type='text'
              name='name'
              inputProps={{ maxLength: 255 }}
              error={!!errors.name}
              helperText={errors.name as string}
              onChange={handleChange}
              value={values.name}
            />
            <Tooltip title='Alterar Atividade'>
              <IconButton
                disabled={detailApproved || isDetail || !canEdit}
                onClick={() => setOpenLoadActivity(true)}
              >
                <SyncAlt />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid item sm={12} md={6} lg={6}>
          <KeyboardTimePicker
            ampm={false}
            fullWidth
            variant='dialog'
            cancelLabel='Cancelar'
            disabled={
              detailApproved ||
              isDetail ||
              !canEdit ||
              !!activity?.[`_${PREFIX}aprovacaoinicio_value`]
            }
            invalidDateMessage='Formato inválido'
            label='Início da Atividade'
            value={values.startTime}
            error={!!errors.startTime}
            helperText={errors.startTime as any}
            onChange={(value) => {
              setFieldValue('startTime', value);

              if (values.duration) {
                const duration =
                  values?.duration.hour() * 60 + values?.duration.minute();

                setFieldValue(
                  'endTime',
                  value?.clone()?.add(duration, 'minutes')
                );
              }
            }}
          />

          {activity?.[`_${PREFIX}aprovacaoinicio_value`] && (
            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  Aprovado
                </Typography>
              </Box>
              <Box>
                {((isAcademicDirector &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                  ((isProgramDirector || isProgramResponsible) &&
                    activity?.[`${PREFIX}tipo`] ===
                      TYPE_ACTIVITY.NON_ACADEMICA) ||
                  (currentUser?.isPlanning &&
                    activity?.[`${PREFIX}tipo`] ===
                      TYPE_ACTIVITY.INTERNAL)) && (
                  <>
                    {loadingApproval?.AprovacaoInicio ? (
                      <CircularProgress size={15} />
                    ) : !isDetail && !isModel && !isDraft && canEdit ? (
                      <Link
                        variant='body2'
                        onClick={() =>
                          handleEditApproval(
                            'AprovacaoInicio',
                            'dataaprovacaoinicio'
                          )
                        }
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Editar
                      </Link>
                    ) : null}
                  </>
                )}
              </Box>
            </Box>
          )}

          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
              {!activity?.[`_${PREFIX}aprovacaoinicio_value`] &&
                !isModel &&
                !isDraft && (
                  <>
                    <AccessTime fontSize='small' />
                    <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                      Pendente Aprovação
                    </Typography>
                  </>
                )}
            </Box>
            {((isAcademicDirector &&
              activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
              ((isProgramDirector || isProgramResponsible) &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.NON_ACADEMICA) ||
              (currentUser?.isPlanning &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
            !activity?.[`_${PREFIX}aprovacaoinicio_value`] ? (
              <Box display='flex' justifyContent='flex-end'>
                {loadingApproval?.AprovacaoInicio ? (
                  <CircularProgress size={15} />
                ) : !isDetail && !isModel && !isDraft && canEdit ? (
                  <Link
                    variant='body2'
                    onClick={() =>
                      handleAproval('AprovacaoInicio', 'dataaprovacaoinicio')
                    }
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Aprovar
                  </Link>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Grid>

        <Grid item sm={12} md={6} lg={6}>
          <KeyboardTimePicker
            ampm={false}
            fullWidth
            cancelLabel='Cancelar'
            disabled={
              detailApproved ||
              isDetail ||
              !canEdit ||
              !!activity?.[`_${PREFIX}aprovacaoduracao_value`]
            }
            invalidDateMessage='Formato inválido'
            label='Duração da Atividade'
            value={values.duration}
            error={!!errors.duration}
            helperText={errors.duration as any}
            onChange={(value) => {
              setFieldValue('duration', value);

              if (values.startTime) {
                const duration = value?.hour() * 60 + value?.minute();
                setFieldValue(
                  'endTime',
                  values.startTime.clone().add(duration, 'minutes')
                );
              }
            }}
          />

          {activity?.[`_${PREFIX}aprovacaoduracao_value`] && (
            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  Aprovado
                </Typography>
              </Box>
              <Box>
                {((isAcademicDirector &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                  ((isProgramDirector || isProgramResponsible) &&
                    activity?.[`${PREFIX}tipo`] ===
                      TYPE_ACTIVITY.NON_ACADEMICA) ||
                  (currentUser?.isPlanning &&
                    activity?.[`${PREFIX}tipo`] ===
                      TYPE_ACTIVITY.INTERNAL)) && (
                  <>
                    {loadingApproval?.AprovacaoDuracao ? (
                      <CircularProgress size={15} />
                    ) : !isDetail && !isModel && !isDraft && canEdit ? (
                      <Link
                        variant='body2'
                        onClick={() =>
                          handleEditApproval(
                            'AprovacaoDuracao',
                            'dataaprovacaoduracao'
                          )
                        }
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Editar
                      </Link>
                    ) : null}
                  </>
                )}
              </Box>
            </Box>
          )}

          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
              {!activity?.[`_${PREFIX}aprovacaoduracao_value`] &&
                !isModel &&
                !isDraft && (
                  <>
                    <AccessTime fontSize='small' />
                    <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                      Pendente Aprovação
                    </Typography>
                  </>
                )}
            </Box>
            {((isAcademicDirector &&
              activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
              ((isProgramDirector || isProgramResponsible) &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.NON_ACADEMICA) ||
              (currentUser?.isPlanning &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
            !activity?.[`_${PREFIX}aprovacaoduracao_value`] ? (
              <Box display='flex' justifyContent='flex-end'>
                {loadingApproval?.AprovacaoDuracao ? (
                  <CircularProgress size={15} />
                ) : !isDetail && !isModel && !isDraft && canEdit ? (
                  <Link
                    variant='body2'
                    onClick={() =>
                      handleAproval('AprovacaoDuracao', 'dataaprovacaoduracao')
                    }
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Aprovar
                  </Link>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Grid>

        <Grid item sm={12} md={6} lg={6}>
          <KeyboardTimePicker
            disabled
            ampm={false}
            fullWidth
            cancelLabel='Cancelar'
            label='Fim da Atividade'
            invalidDateMessage='Formato inválido'
            value={values.endTime}
            onChange={handleChange}
          />
        </Grid>

        {(activityType === TYPE_ACTIVITY.ACADEMICA ||
          activityType === TYPE_ACTIVITY.NON_ACADEMICA) && (
          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Quantidade de Sessões'
              type='number'
              name='quantity'
              disabled={
                detailApproved ||
                isDetail ||
                !canEdit ||
                !!activity?.[`_${PREFIX}aprovacaosessao_value`]
              }
              inputProps={{ maxLength: 255 }}
              error={!!errors.quantity}
              helperText={errors.quantity as string}
              onChange={handleChange}
              value={values.quantity}
            />

            {activity?.[`_${PREFIX}aprovacaosessao_value`] && (
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                  <Typography
                    variant='body2'
                    color='primary'
                    style={{ fontWeight: 'bold' }}
                  >
                    Aprovado
                  </Typography>
                </Box>
                <Box>
                  {((isAcademicDirector &&
                    activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                    ((isProgramDirector || isProgramResponsible) &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.NON_ACADEMICA) ||
                    (currentUser?.isPlanning &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.INTERNAL)) && (
                    <>
                      {loadingApproval?.AprovacaoSessao ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isModel && !isDraft && canEdit ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoSessao',
                              'dataaprovacaosessao'
                            )
                          }
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Editar
                        </Link>
                      ) : null}
                    </>
                  )}
                </Box>
              </Box>
            )}

            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {!activity?.[`_${PREFIX}aprovacaosessao_value`] &&
                  !isModel &&
                  !isDraft && (
                    <>
                      <AccessTime fontSize='small' />
                      <Typography
                        variant='body2'
                        style={{ fontWeight: 'bold' }}
                      >
                        Pendente Aprovação
                      </Typography>
                    </>
                  )}
              </Box>
              {((isAcademicDirector &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                ((isProgramDirector || isProgramResponsible) &&
                  activity?.[`${PREFIX}tipo`] ===
                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                (currentUser?.isPlanning &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
              !activity?.[`_${PREFIX}aprovacaosessao_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoSessao ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isModel && !isDraft && canEdit ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval('AprovacaoSessao', 'dataaprovacaosessao')
                      }
                      style={{ fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Aprovar
                    </Link>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          </Grid>
        )}

        {activityType === TYPE_ACTIVITY.ACADEMICA && (
          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                options={areaOptions?.filter(
                  (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                )}
                onChange={(event: any, newValue: any[]) => {
                  setFieldValue('area', newValue);
                }}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                disabled={
                  isDetail ||
                  !!activity?.[`${PREFIX}AreaAcademicaAprovadaPor`] ||
                  !canEdit
                }
                getOptionLabel={(option) => option?.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.area}
                    helperText={errors.area as string}
                    label='Área Acadêmica'
                  />
                )}
                value={values.area}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={
                    isDetail ||
                    !!activity?.[`${PREFIX}AreaAcademicaAprovadaPor`] ||
                    !canEdit ||
                    !currentUser?.isPlanning
                  }
                  onClick={() => handleNewTag(EFatherTag.AREA_ACADEMICA)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>

            {activity?.[`${PREFIX}AreaAcademicaAprovadaPor`] && (
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                  <Typography
                    variant='body2'
                    color='primary'
                    style={{ fontWeight: 'bold' }}
                  >
                    Aprovado
                  </Typography>
                </Box>
                <Box>
                  {((isAcademicDirector &&
                    activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                    ((isProgramDirector || isProgramResponsible) &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.NON_ACADEMICA) ||
                    (currentUser?.isPlanning &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.INTERNAL)) && (
                    <>
                      {areaLoading ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isModel && !isDraft && canEdit ? (
                        <Link
                          variant='body2'
                          onClick={handleEditArea}
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Editar
                        </Link>
                      ) : null}
                    </>
                  )}
                </Box>
              </Box>
            )}
            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {!activity?.[`${PREFIX}AreaAcademicaAprovadaPor`] &&
                  !isModel &&
                  !isDraft && (
                    <>
                      <AccessTime fontSize='small' />
                      <Typography
                        variant='body2'
                        style={{ fontWeight: 'bold' }}
                      >
                        Pendente Aprovação
                      </Typography>
                    </>
                  )}
              </Box>
              {((isAcademicDirector &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                ((isProgramDirector || isProgramResponsible) &&
                  activity?.[`${PREFIX}tipo`] ===
                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                (currentUser?.isPlanning &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
              !activity?.[`${PREFIX}AreaAcademicaAprovadaPor`] &&
              activity?.[`${PREFIX}AreaAcademica`] &&
              activity?.[`${PREFIX}tipoaplicacao`] ===
                EActivityTypeApplication.APLICACAO ? (
                <Box display='flex' justifyContent='flex-end'>
                  {areaLoading ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isModel && !isDraft && canEdit ? (
                    <Link
                      variant='body2'
                      onClick={approveArea}
                      style={{ fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Aprovar
                    </Link>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          </Grid>
        )}

        <Grid item sm={12} md={6} lg={6}>
          <Box display='flex' alignItems='center'>
            <Autocomplete
              multiple
              fullWidth
              disableCloseOnSelect
              noOptionsText='Sem Opções'
              options={spaceOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              )}
              onChange={(event: any, newValue: any[]) => {
                setFieldValue('spaces', newValue);
              }}
              disabled={
                isDetail ||
                !!activity?.[`${PREFIX}Espaco_Aprovador_Por`] ||
                !canEdit
              }
              getOptionSelected={(option, value) =>
                option?.value === value?.value
              }
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
                    checkedIcon={
                      <CheckBoxIcon color='secondary' fontSize='small' />
                    }
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              getOptionLabel={(option) => option?.label || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.spaces}
                  helperText={errors.spaces as string}
                  label='Espaço'
                />
              )}
              value={values.spaces}
            />
            <Tooltip title='Adicionar Espaço'>
              <IconButton
                disabled={
                  detailApproved ||
                  isDetail ||
                  !canEdit ||
                  !currentUser?.isPlanning
                }
                onClick={() => setNewSpace({ open: true })}
              >
                <PlusOne />
              </IconButton>
            </Tooltip>
            <Tooltip title='Filtrar Espaço'>
              <IconButton
                disabled={detailApproved || isDetail || !canEdit}
                onClick={() => setOpenFilterSpace(true)}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>

          {activity?.[`${PREFIX}Espaco_Aprovador_Por`] && (
            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                <Typography
                  variant='body2'
                  color='primary'
                  style={{ fontWeight: 'bold' }}
                >
                  Aprovado
                </Typography>
              </Box>
              <Box>
                {currentUser?.isPlanning && (
                  <>
                    {spaceLoading ? (
                      <CircularProgress size={15} />
                    ) : !isDetail && !isModel && !isDraft && canEdit ? (
                      <Link
                        variant='body2'
                        onClick={handleEditSpace}
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        Editar
                      </Link>
                    ) : null}
                  </>
                )}
              </Box>
            </Box>
          )}

          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
              {!activity?.[`${PREFIX}Espaco_Aprovador_Por`] &&
                !isModel &&
                !isDraft && (
                  <>
                    <AccessTime fontSize='small' />
                    <Typography variant='body2' style={{ fontWeight: 'bold' }}>
                      Pendente Aprovação
                    </Typography>
                  </>
                )}
            </Box>

            {!activity?.[`${PREFIX}Espaco_Aprovador_Por`] &&
            activity?.[`${PREFIX}Atividade_Espaco`]?.length &&
            activity?.[`${PREFIX}tipoaplicacao`] ===
              EActivityTypeApplication.APLICACAO &&
            currentUser?.isPlanning ? (
              <Box display='flex' justifyContent='flex-end'>
                {spaceLoading ? (
                  <CircularProgress size={15} />
                ) : !isDetail && !isModel && !isDraft && canEdit ? (
                  <Link
                    variant='body2'
                    onClick={approveSpace}
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Aprovar
                  </Link>
                ) : null}
              </Box>
            ) : null}
          </Box>
        </Grid>

        <Grid item sm={12} md={6} lg={6}>
          <Autocomplete
            fullWidth
            filterSelectedOptions={true}
            options={
              temperatureOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              ) || []
            }
            noOptionsText='Sem Opções'
            value={values.temperature}
            disabled={!canEdit || isDetail}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('temperature', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Temperatura/Status' />
            )}
          />
        </Grid>

        {activityType !== TYPE_ACTIVITY.ACADEMICA && (
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              minRows={2}
              label='Tema'
              type='text'
              name='theme'
              disabled={
                !canEdit ||
                isDetail ||
                !!activity?.[`_${PREFIX}aprovacaotema_value`]
              }
              inputProps={{ maxLength: 255 }}
              // @ts-ignore
              error={!!errors?.theme}
              // @ts-ignore
              helperText={errors?.theme as string}
              onChange={handleChange}
              value={values.theme}
            />

            {activity?.[`_${PREFIX}aprovacaotema_value`] && (
              <Box display='flex' justifyContent='space-between'>
                <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                  <CheckCircle fontSize='small' style={{ color: '#35bb5a' }} />
                  <Typography
                    variant='body2'
                    color='primary'
                    style={{ fontWeight: 'bold' }}
                  >
                    Aprovado
                  </Typography>
                </Box>
                <Box>
                  {((isAcademicDirector &&
                    activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                    ((isProgramDirector || isProgramResponsible) &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.NON_ACADEMICA) ||
                    (currentUser?.isPlanning &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.INTERNAL)) && (
                    <>
                      {loadingApproval?.AprovacaoTema ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isModel && !isDraft && canEdit ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoTema',
                              'dataaprovacaotema'
                            )
                          }
                          style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Editar
                        </Link>
                      ) : null}
                    </>
                  )}
                </Box>
              </Box>
            )}

            <Box display='flex' justifyContent='space-between'>
              <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
                {!activity?.[`_${PREFIX}aprovacaotema_value`] &&
                  !isModel &&
                  !isDraft && (
                    <>
                      <AccessTime fontSize='small' />
                      <Typography
                        variant='body2'
                        style={{ fontWeight: 'bold' }}
                      >
                        Pendente Aprovação
                      </Typography>
                    </>
                  )}
              </Box>
              {((isAcademicDirector &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                ((isProgramDirector || isProgramResponsible) &&
                  activity?.[`${PREFIX}tipo`] ===
                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                (currentUser?.isPlanning &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
              !activity?.[`_${PREFIX}aprovacaotema_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoTema ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isModel && !isDraft && canEdit ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval('AprovacaoTema', 'dataaprovacaotema')
                      }
                      style={{ fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Aprovar
                    </Link>
                  ) : null}
                </Box>
              ) : null}
            </Box>
          </Grid>
        )}
      </Grid>

      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />

      <AddSpace
        open={newSpace.open}
        handleClose={() => setNewSpace({ open: false })}
      />

      <Dialog open={dialogConflict.open}>
        <DialogTitle>
          <Typography
            variant='subtitle1'
            color='secondary'
            style={{ maxWidth: '25rem', fontWeight: 'bold' }}
          >
            Resursos com conflito
            <IconButton
              aria-label='close'
              onClick={() =>
                setDialogConflict({
                  open: false,
                  msg: null,
                })
              }
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </Typography>
        </DialogTitle>
        <DialogContent>{dialogConflict.msg}</DialogContent>
      </Dialog>
    </>
  );
};

export default InfoForm;
