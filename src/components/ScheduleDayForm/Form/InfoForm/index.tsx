import * as React from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import AddTag from '~/components/AddTag';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';

interface IInfoForm {
  values: any;
  isDetail?: boolean;
  titleRequired?: boolean;
  errors: any;
  teamId: string;
  isDraft: boolean;
  isGroup: boolean;
  isModel?: boolean;
  isScheduleModel?: boolean;
  isProgramResponsible?: boolean;
  isProgramDirector: boolean;
  isHeadOfService: boolean;
  tagsOptions: any[];
  setFieldValue: any;
  schedule: any;
  setDateReference: React.Dispatch<any>;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  loadingApproval: any;
  handleAproval: (nameField: any, dateField: any) => void;
  handleEditApproval: (nameField: any, dateField: any) => void;
}

const InfoForm: React.FC<IInfoForm> = ({
  values,
  teamId,
  titleRequired,
  isGroup,
  isDetail,
  isModel,
  isDraft,
  isScheduleModel,
  errors,
  schedule,
  tagsOptions,
  setFieldValue,
  isProgramResponsible,
  isProgramDirector,
  isHeadOfService,
  setDateReference,
  handleChange,
  loadingApproval,
  handleAproval,
  handleEditApproval,
}) => {
  const [day, setDay] = React.useState(0);
  const [month, setMonth] = React.useState(0);
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });

  const { currentUser } = useLoggedUser();

  const temperatureOptions = React.useMemo(
    () =>
      tagsOptions?.filter(
        (tag) =>
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
          )
      ),
    [tagsOptions]
  );

  const modalidadeOptions = React.useMemo(
    () =>
      tagsOptions?.filter(
        (tag) =>
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_DIA
          )
      ),
    [tagsOptions]
  );

  const moduleOptions = React.useMemo(
    () =>
      tagsOptions?.filter(
        (tag) =>
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODULO
          )
      ),
    [tagsOptions]
  );

  const placeOptions = React.useMemo(
    () =>
      tagsOptions?.filter(
        (tag) =>
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.CLASS_LOCALE
          )
      ),
    [tagsOptions]
  );

  const fatherTags = React.useMemo(
    () =>
      tagsOptions?.filter(
        (e) => e?.[`${PREFIX}ativo`] && e?.[`${PREFIX}ehpai`]
      ),
    [tagsOptions]
  );

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

  function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  const handleDayMonth = (d, m) => {
    const date = moment(`2006-${minTwoDigits(m)}-${minTwoDigits(d)}`);
    setFieldValue('date', date);
    setDateReference(date);
  };

  const handleIsGroupChange = (e) => {
    handleChange(e);

    setFieldValue(
      'duration',
      e.target.checked ? moment('00:05', 'HH:mm') : null
    );
  };

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      {!isModel && (
        <Grid item sm={12} md={6} lg={6}>
          <KeyboardDatePicker
            autoOk
            clearable
            autoFocus
            fullWidth
            required
            disabled={isDetail || !!schedule?.[`_${PREFIX}aprovacaodata_value`]}
            variant='inline'
            format={'DD/MM/YYYY'}
            label='Data'
            error={!!errors.date}
            // @ts-ignore
            helperText={errors.date}
            value={values.date}
            onChange={(value) => {
              setFieldValue('date', value);
              setDateReference(value);
            }}
          />
          {schedule?.[`_${PREFIX}aprovacaodata_value`] && (
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
                {(isProgramDirector || isProgramResponsible) && (
                  <>
                    {loadingApproval?.AprovacaoData ? (
                      <CircularProgress size={15} />
                    ) : !isDetail && !isDraft ? (
                      <Link
                        variant='body2'
                        onClick={() =>
                          handleEditApproval(
                            'AprovacaoData',
                            'dataaprovacaodata'
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
              {!schedule?.[`_${PREFIX}aprovacaodata_value`] &&
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
            {(isProgramDirector || isProgramResponsible) &&
            !schedule?.[`_${PREFIX}aprovacaodata_value`] ? (
              <Box display='flex' justifyContent='flex-end'>
                {loadingApproval?.AprovacaoData ? (
                  <CircularProgress size={15} />
                ) : !isDetail && !isDraft ? (
                  <Link
                    variant='body2'
                    onClick={() =>
                      handleAproval('AprovacaoData', 'dataaprovacaodata')
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

      {isModel && teamId && (
        <Grid item sm={12} md={6} lg={6}>
          <Box display='flex' width='100%' style={{ gap: '1rem' }}>
            <FormControl disabled={isDetail} fullWidth error={!!errors.date}>
              <InputLabel>Dia</InputLabel>
              <Select
                fullWidth
                value={day}
                required
                onChange={(event) => {
                  setDay(+event.target.value);
                  handleDayMonth(+event.target.value, month);
                }}
                label='Dia'
              >
                {Array(31)
                  .fill(1)
                  .map((e, index) => (
                    <MenuItem value={index}>{index}</MenuItem>
                  ))}
              </Select>
              {errors.date ? (
                <FormHelperText>Informe um dia</FormHelperText>
              ) : null}
            </FormControl>
            <FormControl disabled={isDetail} fullWidth error={!!errors.date}>
              <InputLabel>Mês</InputLabel>
              <Select
                fullWidth
                required
                value={month}
                onChange={(event) => {
                  setMonth(+event.target.value);
                  handleDayMonth(day, +event.target.value);
                }}
                label='Mês'
              >
                {Array(13)
                  .fill(1)
                  .map((e, index) => (
                    <MenuItem value={index}>{index}</MenuItem>
                  ))}
              </Select>
              {errors.date ? (
                <FormHelperText>Informe um mês</FormHelperText>
              ) : null}
            </FormControl>
          </Box>
        </Grid>
      )}

      {isModel && titleRequired && (
        <Grid item sm={12} md={6} lg={6}>
          <TextField
            required
            fullWidth
            label='Título'
            type='text'
            name='name'
            disabled={isDetail}
            inputProps={{ maxLength: 255 }}
            error={!!errors.name}
            helperText={errors.name}
            onChange={handleChange}
            value={values.name}
          />
        </Grid>
      )}

      {!isGroup && (
        <>
          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                disabled={
                  isDetail || !!schedule?.[`_${PREFIX}aprovacaomodulo_value`]
                }
                options={moduleOptions}
                value={values.module}
                onChange={(event: any, newValue: any[]) =>
                  setFieldValue('module', newValue)
                }
                getOptionSelected={(option: any, item: any) =>
                  option?.value === item?.value
                }
                getOptionLabel={(option: any) => option?.label || ''}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label='Módulo' />
                )}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={isDetail || !currentUser?.isPlanning}
                  onClick={() => handleNewTag(EFatherTag.MODULO)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>

            {schedule?.[`_${PREFIX}aprovacaomodulo_value`] && (
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
                  {(isProgramDirector || isProgramResponsible) && (
                    <>
                      {loadingApproval?.AprovacaoModulo ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoModulo',
                              'dataaprovacaomodulo'
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
                {!schedule?.[`_${PREFIX}aprovacaomodulo_value`] &&
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
              {(isProgramDirector || isProgramResponsible) &&
              !schedule?.[`_${PREFIX}aprovacaomodulo_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoModulo ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval('AprovacaoModulo', 'dataaprovacaomodulo')
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
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                disabled={
                  isDetail ||
                  !!schedule?.[`_${PREFIX}aprovacaomodalidade_value`]
                }
                options={modalidadeOptions}
                value={values.modality}
                onChange={(event: any, newValue: any[]) =>
                  setFieldValue('modality', newValue)
                }
                getOptionSelected={(option: any, item: any) =>
                  option?.value === item?.value
                }
                getOptionLabel={(option: any) => option?.label || ''}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label='Modalidade' />
                )}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={isDetail || !currentUser?.isPlanning}
                  onClick={() => handleNewTag(EFatherTag.MODALIDADE_DIA)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>

            {schedule?.[`_${PREFIX}aprovacaomodalidade_value`] && (
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
                  {(isProgramDirector || isProgramResponsible) && (
                    <>
                      {loadingApproval?.AprovacaoModalidade ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoModalidade',
                              'dataaprovacaomodalidade'
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
                {!schedule?.[`_${PREFIX}aprovacaomodalidade_value`] &&
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
              {(isProgramDirector || isProgramResponsible) &&
              !schedule?.[`_${PREFIX}aprovacaomodalidade_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoModalidade ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval(
                          'AprovacaoModalidade',
                          'dataaprovacaomodalidade'
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

          <Grid item sm={12} md={6} lg={6}>
            <Box display='flex' alignItems='center'>
              <Autocomplete
                fullWidth
                noOptionsText='Sem Opções'
                filterSelectedOptions={true}
                disabled={isDetail}
                options={placeOptions}
                value={values.place}
                onChange={(event: any, newValue: any[]) =>
                  setFieldValue('place', newValue)
                }
                getOptionSelected={(option: any, item: any) =>
                  option?.value === item?.value
                }
                getOptionLabel={(option: any) => option?.label || ''}
                renderInput={(params) => (
                  <TextField {...params} fullWidth label='Local' />
                )}
              />
              <Tooltip title='Adicionar Etiqueta'>
                <IconButton
                  disabled={isDetail || !currentUser?.isPlanning}
                  onClick={() => handleNewTag(EFatherTag.CLASS_LOCALE)}
                >
                  <PlusOne />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>

          <Grid item sm={12} md={6} lg={6}>
            <TextField
              fullWidth
              label='Link aberto'
              type='text'
              name='link'
              disabled={
                isDetail || !!schedule?.[`_${PREFIX}aprovacaolink_value`]
              }
              inputProps={{ maxLength: 50 }}
              error={!!errors.link}
              helperText={errors.link}
              onChange={handleChange}
              value={values.link}
            />

            {schedule?.[`_${PREFIX}aprovacaolink_value`] && (
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
                  {(isHeadOfService || isProgramResponsible) && (
                    <>
                      {loadingApproval?.AprovacaoLink ? (
                        <CircularProgress size={15} />
                      ) : !isDetail && !isDraft ? (
                        <Link
                          variant='body2'
                          onClick={() =>
                            handleEditApproval(
                              'AprovacaoLink',
                              'dataaprovacaolink'
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
                {!schedule?.[`_${PREFIX}aprovacaolink_value`] &&
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
              {(isHeadOfService || isProgramResponsible) &&
              !schedule?.[`_${PREFIX}aprovacaolink_value`] ? (
                <Box display='flex' justifyContent='flex-end'>
                  {loadingApproval?.AprovacaoLink ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleAproval('AprovacaoLink', 'dataaprovacaolink')
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
            <Autocomplete
              fullWidth
              noOptionsText='Sem Opções'
              filterSelectedOptions={true}
              options={temperatureOptions || []}
              value={values.temperature}
              disabled={isDetail}
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
        </>
      )}

      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />
    </Grid>
  );
};

export default InfoForm;
