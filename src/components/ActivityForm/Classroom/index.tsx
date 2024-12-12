import * as React from 'react';
import * as _ from 'lodash';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { PREFIX } from '~/config/database';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { AppState } from '~/store';
import { EFatherTag, TYPE_ACTIVITY } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import AddTag from '~/components/AddTag';

interface IClassroomProps {
  canEdit: boolean;
  isDetail: boolean;
  errors: any;
  values: any;
  isModel: boolean;
  isDraft: boolean;
  detailApproved: boolean;
  isProgramDirector: boolean;
  isProgramResponsible: boolean;
  handleChange: any;
  setFieldValue: any;
  activity: any;
  currentUser: any;
  loadingApproval: any;
  handleAproval: (nameField: any, dateField: any) => void;
  handleEditApproval: (nameField: any, dateField: any) => void;
}

const Classroom: React.FC<IClassroomProps> = ({
  canEdit,
  isDetail,
  values,
  errors,
  isModel,
  isDraft,
  isProgramDirector,
  isProgramResponsible,
  detailApproved,
  handleChange,
  setFieldValue,
  activity,
  currentUser,
  loadingApproval,
  handleAproval,
  handleEditApproval,
}) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { tag, person } = useSelector((state: AppState) => state);
  const { dictTag, tags } = tag;
  const { dictPeople } = person;

  const isTeacher = React.useMemo(() => {
    if (!activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.length)
      return false;

    return activity?.[`${PREFIX}Atividade_PessoasEnvolvidas`]?.some((act) => {
      const per = dictPeople[act?.[`_${PREFIX}pessoa_value`]];
      const func = dictTag[act?.[`_${PREFIX}funcao_value`]];

      return (
        per?.[`${PREFIX}pessoaid`] === currentUser?.[`${PREFIX}pessoaid`] &&
        func?.[`${PREFIX}nome`] === EFatherTag.PROFESSOR
      );
    });
  }, [activity, currentUser, dictPeople, dictTag]);

  const courseOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.COURSE
    )
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const handleNewTag = React.useCallback(
    (type) => {
      const tag = tags.find((e) => e?.[`${PREFIX}nome`] === type);

      setNewTagModal({ open: true, fatherTag: tag });
    },
    [tags]
  );

  const handleCloseNewTag = React.useCallback(
    () => setNewTagModal({ open: false, fatherTag: null }),
    []
  );

  return (
    <>
      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />

      <Box
        overflow='hidden auto'
        maxHeight='25rem'
        minHeight='19rem'
        flexGrow={1}
      >
        <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              autoFocus
              fullWidth
              minRows={2}
              label='Tema'
              type='text'
              name='theme'
              disabled={
                detailApproved ||
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
                  {(((isTeacher || currentUser?.isAreaChief) &&
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
                      ) : !isModel && !isDraft && !isDetail ? (
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
              {(((isTeacher || currentUser?.isAreaChief) &&
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
                  ) : !isModel && !isDraft && !isDetail ? (
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

          <Grid item sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              disabled={
                detailApproved ||
                !canEdit ||
                isDetail ||
                !!activity?.[`_${PREFIX}aprovacaodescricao_value`]
              }
              inputProps={{ maxLength: 2000 }}
              label='Descrição/Objetivo da sessão'
              type='text'
              name='description'
              onChange={handleChange}
              value={values.description}
            />
            {activity?.[`_${PREFIX}aprovacaodescricao_value`] && (
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
                  {(((isTeacher || currentUser?.isAreaChief) &&
                    activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                    ((isProgramDirector || isProgramResponsible) &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.NON_ACADEMICA) ||
                    (currentUser?.isPlanning &&
                      activity?.[`${PREFIX}tipo`] ===
                        TYPE_ACTIVITY.INTERNAL)) && (
                    <>
                      {loadingApproval?.AprovacaoDescricao ? (
                        <CircularProgress size={15} />
                      ) : !isModel && !isDraft && !isDetail ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoDescricao',
                              'dataaprovacaodescricao'
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
                {!activity?.[`_${PREFIX}aprovacaodescricao_value`] &&
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
              {(((isTeacher || currentUser?.isAreaChief) &&
                activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.ACADEMICA) ||
                ((isProgramDirector || isProgramResponsible) &&
                  activity?.[`${PREFIX}tipo`] ===
                    TYPE_ACTIVITY.NON_ACADEMICA) ||
                (currentUser?.isPlanning &&
                  activity?.[`${PREFIX}tipo`] === TYPE_ACTIVITY.INTERNAL)) &&
              !activity?.[`_${PREFIX}aprovacaodescricao_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoDescricao ? (
                    <CircularProgress size={15} />
                  ) : !isModel && !isDraft && !isDetail ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval(
                          'AprovacaoDescricao',
                          'dataaprovacaodescricao'
                        )
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

          <Grid item sm={12} md={12} lg={12}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                options={courseOptions}
                onChange={(event: any, newValue: any[]) => {
                  setFieldValue('course', newValue);
                }}
                disabled={detailApproved || !canEdit || isDetail}
                getOptionSelected={(option, value) =>
                  option?.value === value?.value
                }
                getOptionLabel={(option) => option?.label || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.spaces}
                    helperText={errors.spaces as string}
                    label='Curso'
                  />
                )}
                value={values.course}
              />
              <Tooltip title='Adicionar Curso'>
                <IconButton
                  disabled={detailApproved || !canEdit || isDetail}
                  onClick={() => handleNewTag(EFatherTag.COURSE)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Classroom;
