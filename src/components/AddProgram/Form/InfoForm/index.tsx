import * as React from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { AccessTime, CheckCircle, PlusOne } from '@material-ui/icons';
import AddTag from '~/components/AddTag';
import { useLoggedUser } from '~/hooks';

interface IInfoForm {
  isDetail: boolean;
  isModel: boolean;
  isDraft: boolean;
  isProgramResponsible: boolean;
  tags: any[];
  program: any;
  errors: any;
  values: any;
  handleChange: any;
  setFieldValue: any;
  loadingApproval: any;
  handleAproval: (nameField: any, dateField: any) => void;
  handleEditApproval: (nameField: any, dateField: any) => void;
}

const InfoForm: React.FC<IInfoForm> = ({
  tags,
  isDetail,
  isModel,
  isDraft,
  isProgramResponsible,
  values,
  program,
  errors,
  loadingApproval,
  handleAproval,
  handleEditApproval,
  handleChange,
  setFieldValue,
}) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });
  const { currentUser } = useLoggedUser();

  const typeProgramOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_PROGRAMA
        )
      ),
    [tags]
  );

  const nameProgramOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.NOME_PROGRAMA
        )
      ),
    [tags]
  );

  const instituteOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.INSTITUTO
        )
      ),
    [tags]
  );

  const companyOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.EMPRESA
        )
      ),
    [tags]
  );

  const temperatureOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
        )
      ),
    [tags]
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const canApprove = React.useMemo(
    () => isProgramResponsible || currentUser?.isPlanning,
    [isProgramResponsible, currentUser]
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
    <Grid container spacing={3}>
      {isModel && (
        <Grid item sm={12} md={6} lg={6}>
          <TextField
            required
            autoFocus
            fullWidth
            label='Título'
            type='text'
            name='title'
            disabled={isDetail}
            inputProps={{ maxLength: 255 }}
            error={!!errors.title}
            helperText={errors.title}
            onChange={handleChange}
            value={values.title}
          />
        </Grid>
      )}

      <Grid item sm={12} md={6} lg={6}>
        <Box display='flex' alignItems='center'>
          <Autocomplete
            fullWidth
            noOptionsText='Sem Opções'
            filterSelectedOptions={true}
            disabled={
              isDetail || !!program?.[`_${PREFIX}aprovacaonomeprograma_value`]
            }
            options={
              nameProgramOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              ) || []
            }
            value={values.nameProgram}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('nameProgram', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label='Nome do Programa'
                error={!!errors.nameProgram}
                helperText={errors.nameProgram}
              />
            )}
          />
          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => handleNewTag(EFatherTag.NOME_PROGRAMA)}
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>
        {program?.[`_${PREFIX}aprovacaonomeprograma_value`] && (
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
              {canApprove && (
                <>
                  {loadingApproval?.AprovacaoNomePrograma ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoNomePrograma',
                          'dataaprovacaonomeprograma'
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
            {!program?.[`_${PREFIX}aprovacaonomeprograma_value`] &&
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
          {canApprove &&
          !program?.[`_${PREFIX}aprovacaonomeprograma_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoNomePrograma ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoNomePrograma',
                      'dataaprovacaonomeprograma'
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
        <TextField
          fullWidth
          label='Sigla'
          type='text'
          name='sigla'
          disabled={isDetail || !!program?.[`_${PREFIX}aprovacaosigla_value`]}
          inputProps={{ maxLength: 50 }}
          error={!!errors.sigla}
          helperText={errors.sigla}
          onChange={handleChange}
          value={values.sigla}
        />

        {program?.[`_${PREFIX}aprovacaosigla_value`] && (
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
                  {loadingApproval?.AprovacaoSigla ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoSigla',
                          'dataaprovacaosigla'
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
            {!program?.[`_${PREFIX}aprovacaosigla_value`] &&
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
          {currentUser?.isPlanning &&
          !program?.[`_${PREFIX}aprovacaosigla_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoSigla ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval('AprovacaoSigla', 'dataaprovacaosigla')
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
              isDetail || !!program?.[`_${PREFIX}aprovacaotipoprograma_value`]
            }
            options={
              typeProgramOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              ) || []
            }
            value={values.typeProgram}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('typeProgram', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Tipo do Programa' />
            )}
          />
          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => handleNewTag(EFatherTag.TIPO_PROGRAMA)}
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>

        {program?.[`_${PREFIX}aprovacaotipoprograma_value`] && (
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
              {canApprove && (
                <>
                  {loadingApproval?.AprovacaoTipoPrograma ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoTipoPrograma',
                          'dataaprovacaotipoprograma'
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
            {!program?.[`_${PREFIX}aprovacaotipoprograma_value`] &&
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
          {canApprove &&
          !program?.[`_${PREFIX}aprovacaotipoprograma_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoTipoPrograma ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoTipoPrograma',
                      'dataaprovacaotipoprograma'
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
            disabled={
              isDetail || !!program?.[`_${PREFIX}aprovacaoinstituto_value`]
            }
            options={
              instituteOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              ) || []
            }
            value={values.institute}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('institute', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Instituto' />
            )}
          />

          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => handleNewTag(EFatherTag.INSTITUTO)}
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>

        {program?.[`_${PREFIX}aprovacaoinstituto_value`] && (
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
              {canApprove && (
                <>
                  {loadingApproval?.AprovacaoInstituto ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoInstituto',
                          'dataaprovacaoinstituto'
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
            {!program?.[`_${PREFIX}aprovacaoinstituto_value`] &&
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
          {canApprove &&
          !program?.[`_${PREFIX}aprovacaoinstituto_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoInstituto ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoInstituto',
                      'dataaprovacaoinstituto'
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
            disabled={
              isDetail || !!program?.[`_${PREFIX}aprovacaoempresa_value`]
            }
            options={
              companyOptions?.filter(
                (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
              ) || []
            }
            value={values.company}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('company', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Empresa' />
            )}
          />

          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => handleNewTag(EFatherTag.EMPRESA)}
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>

        {program?.[`_${PREFIX}aprovacaoempresa_value`] && (
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
              {canApprove && (
                <>
                  {loadingApproval?.AprovacaoEmpresa ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoEmpresa',
                          'dataaprovacaoempresa'
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
            {!program?.[`_${PREFIX}aprovacaoempresa_value`] &&
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
          {canApprove &&
          !program?.[`_${PREFIX}aprovacaoempresa_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoEmpresa ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval('AprovacaoEmpresa', 'dataaprovacaoempresa')
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
          options={
            temperatureOptions?.filter(
              (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
            ) || []
          }
          value={values.temperature}
          disabled={
            isDetail || !!program?.[`_${PREFIX}aprovacaotemperatura_value`]
          }
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

        {program?.[`_${PREFIX}aprovacaotemperatura_value`] && (
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
              {canApprove && (
                <>
                  {loadingApproval?.AprovacaoTemperatura ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoTemperatura',
                          'dataaprovacaotemperatura'
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
            {!program?.[`_${PREFIX}aprovacaotemperatura_value`] &&
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
          {canApprove &&
          !program?.[`_${PREFIX}aprovacaotemperatura_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoTemperatura ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoTemperatura',
                      'dataaprovacaotemperatura'
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
        <FormControlLabel
          control={
            <Checkbox
              checked={values.isReserve}
              disabled={isDetail}
              onChange={(event) =>
                setFieldValue('isReserve', event.target.checked)
              }
              name='isReserve'
              color='primary'
            />
          }
          label='Marcar se for evento interno'
        />
      </Grid>
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
