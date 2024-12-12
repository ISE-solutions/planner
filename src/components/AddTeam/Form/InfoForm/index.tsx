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
import AddTag from '~/components/AddTag';
import { AccessTime, CheckCircle, Edit, PlusOne } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';

interface IInfoForm {
  isDetail?: boolean;
  isModel: boolean;
  isDraft: boolean;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isFinance: boolean;
  tags: any[];
  errors: any;
  values: any;
  team: any;
  handleChange: any;
  setFieldValue: any;
  loadingApproval: any;
  handleAproval: (nameField: any, dateField: any) => void;
  handleEditApproval: (nameField: any, dateField: any) => void;
}

const InfoForm: React.FC<IInfoForm> = ({
  tags,
  isModel,
  isDraft,
  isDetail,
  values,
  errors,
  team,
  handleChange,
  setFieldValue,
  loadingApproval,
  isProgramResponsible,
  isProgramDirector,
  isFinance,
  handleAproval,
  handleEditApproval,
}) => {
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });
  const [editName, setEditName] = React.useState(true);

  const { currentUser } = useLoggedUser();

  const temperatureOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TEMPERATURA_STATUS
        )
      ),
    [tags]
  );

  const modalityOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_TURMA
        )
      ),
    [tags]
  );

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const toolVideoConferenceOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`] &&
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) =>
              e?.[`${PREFIX}nome`] === EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA
          )
      ),
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
    <Grid container spacing={3}>
      {isModel ? (
        <Grid item sm={12} md={6} lg={6}>
          <TextField
            autoFocus
            fullWidth
            required
            label='Título'
            type='text'
            name='title'
            disabled={isDetail || !!team?.[`_${PREFIX}aprovacaotitulo_value`]}
            inputProps={{ maxLength: 255 }}
            error={!!errors.title}
            helperText={errors.title}
            onChange={handleChange}
            value={values.title}
          />

          {team?.[`_${PREFIX}aprovacaotitulo_value`] && (
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
                    {loadingApproval?.AprovacaoTitulo ? (
                      <CircularProgress size={15} />
                    ) : !isDetail && !isDraft ? (
                      <Link
                        variant='body2'
                        onClick={() =>
                          handleEditApproval(
                            'AprovacaoTitulo',
                            'dataaprovacaotitulo'
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
              {!team?.[`_${PREFIX}aprovacaotitulo_value`] &&
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
            !team?.[`_${PREFIX}aprovacaotitulo_value`] ? (
              <Box display='flex' justifyContent='flex-end'>
                {loadingApproval?.AprovacaoTitulo ? (
                  <CircularProgress size={15} />
                ) : !isDetail && !isDraft ? (
                  <Link
                    variant='body2'
                    onClick={() =>
                      handleAproval('AprovacaoTitulo', 'dataaprovacaotitulo')
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
      ) : null}

      <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          label={isModel ? 'Sigla' : 'Sigla*'}
          type='text'
          name='sigla'
          disabled={isDetail || !!team?.[`_${PREFIX}aprovacaosigla_value`]}
          inputProps={{ maxLength: 50 }}
          error={!!errors.sigla}
          helperText={errors.sigla}
          onChange={handleChange}
          value={values.sigla}
        />

        {team?.[`_${PREFIX}aprovacaosigla_value`] && (
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
            {!team?.[`_${PREFIX}aprovacaosigla_value`] &&
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
          !team?.[`_${PREFIX}aprovacaosigla_value`] ? (
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
          <TextField
            fullWidth
            label='Nome'
            type='text'
            name='name'
            disabled={isDetail || editName}
            inputProps={{ maxLength: 50 }}
            error={!!errors.name}
            helperText={errors.name}
            onChange={handleChange}
            value={values.name}
          />
          <Tooltip title='Editar'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => {
                setEditName(false);
                setFieldValue('nameEdited', true);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          label='Código da turma (Financeiro)'
          type='text'
          name='teamCode'
          disabled={
            isDetail || !!team?.[`_${PREFIX}aprovacaocodigoturma_value`]
          }
          inputProps={{ maxLength: 50 }}
          error={!!errors.teamCode}
          helperText={errors.teamCode}
          onChange={handleChange}
          value={values.teamCode}
        />

        {team?.[`_${PREFIX}aprovacaocodigoturma_value`] && (
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
              {isFinance && (
                <>
                  {loadingApproval?.AprovacaoCodigoTurma ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoCodigoTurma',
                          'dataaprovacaocodigoturma'
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
            {!team?.[`_${PREFIX}aprovacaocodigoturma_value`] &&
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
          {isFinance && !team?.[`_${PREFIX}aprovacaocodigoturma_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoCodigoTurma ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoCodigoTurma',
                      'dataaprovacaocodigoturma'
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
          label='Nome da turma (Financeiro)'
          type='text'
          name='teamName'
          disabled={
            isDetail || !!team?.[`_${PREFIX}aprovacaonomefinanceiro_value`]
          }
          inputProps={{ maxLength: 50 }}
          error={!!errors.teamName}
          helperText={errors.teamName}
          onChange={handleChange}
          value={values.teamName}
        />

        {team?.[`_${PREFIX}aprovacaonomefinanceiro_value`] && (
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
              {isFinance && (
                <>
                  {loadingApproval?.AprovacaoNomeFinanceiro ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoNomeFinanceiro',
                          'dataaprovacaonomefinanceiro'
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
            {!team?.[`_${PREFIX}aprovacaonomefinanceiro_value`] &&
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
          {isFinance && !team?.[`_${PREFIX}aprovacaonomefinanceiro_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoNomeFinanceiro ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoNomeFinanceiro',
                      'dataaprovacaonomefinanceiro'
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
          label='Máscara do Link'
          type='text'
          name='mask'
          disabled={isDetail || !!team?.[`_${PREFIX}aprovacaolink_value`]}
          inputProps={{ maxLength: 50 }}
          error={!!errors.mask}
          helperText={errors.mask}
          onChange={handleChange}
          value={values.mask}
        />

        {team?.[`_${PREFIX}aprovacaolink_value`] && (
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
                  {loadingApproval?.AprovacaoLink ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval('AprovacaoLink', 'dataaprovacaolink')
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
            {!team?.[`_${PREFIX}aprovacaolink_value`] &&
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
          !team?.[`_${PREFIX}aprovacaolink_value`] ? (
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
        <Box display='flex' alignItems='center'>
          <Autocomplete
            fullWidth
            noOptionsText='Sem Opções'
            filterSelectedOptions={true}
            disabled={isDetail}
            options={toolVideoConferenceOptions}
            value={values.videoConference}
            onChange={(event: any, newValue: any[]) =>
              setFieldValue('videoConference', newValue)
            }
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label='Ferramenta de videoconferência'
              />
            )}
          />
          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() =>
                handleNewTag(EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA)
              }
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      <Grid item sm={12} md={6} lg={6}>
        <Box display='flex' alignItems='center'>
          <Autocomplete
            fullWidth
            noOptionsText='Sem Opções'
            filterSelectedOptions={true}
            disabled={isDetail}
            options={toolVideoConferenceOptions}
            value={values.videoConferenceBackup}
            onChange={(event: any, newValue: any[]) =>
              setFieldValue('videoConferenceBackup', newValue)
            }
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label='Ferramenta de videoconferência (Backup)'
              />
            )}
          />
          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() =>
                handleNewTag(EFatherTag.FERRAMENTA_VIDEO_CONFERENCIA)
              }
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      {/* <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          label='Link backup'
          type='text'
          name='maskBackup'
          disabled={isDetail || !!team?.[`_${PREFIX}aprovacaolinkbackup_value`]}
          inputProps={{ maxLength: 50 }}
          error={!!errors.maskBackup}
          helperText={errors.maskBackup}
          onChange={handleChange}
          value={values.maskBackup}
        />
        {team?.[`_${PREFIX}aprovacaolinkbackup_value`] && (
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
                  {loadingApproval?.AprovacaoLinkBackup ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoLinkBackup',
                          'dataaprovacaolinkbackup'
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
            {!team?.[`_${PREFIX}aprovacaolinkbackup_value`] &&
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
          !team?.[`_${PREFIX}aprovacaolinkbackup_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoLinkBackup ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoLinkBackup',
                      'dataaprovacaolinkbackup'
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
      </Grid> */}

      <Grid item sm={12} md={6} lg={6}>
        <TextField
          fullWidth
          label={isModel ? 'Ano de Conclusão' : 'Ano de Conclusão*'}
          type='number'
          name='yearConclusion'
          disabled={
            isDetail || !!team?.[`_${PREFIX}aprovacaoanoconclusao_value`]
          }
          error={!!errors.yearConclusion}
          helperText={errors.yearConclusion}
          onChange={(event) =>
            parseInt(event.target.value) < 9999 &&
            setFieldValue('yearConclusion', event.target.value)
          }
          value={values.yearConclusion}
        />

        {team?.[`_${PREFIX}aprovacaoanoconclusao_value`] && (
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
                  {loadingApproval?.AprovacaoAnoConclusao ? (
                    <CircularProgress size={15} />
                  ) : !isDetail && !isDraft ? (
                    <Link
                      variant='body2'
                      onClick={() =>
                        handleEditApproval(
                          'AprovacaoAnoConclusao',
                          'dataaprovacaoanoconclusao'
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
            {!team?.[`_${PREFIX}aprovacaoanoconclusao_value`] &&
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
          !team?.[`_${PREFIX}aprovacaoanoconclusao_value`] ? (
            <Box display='flex' justifyContent='flex-end'>
              {loadingApproval?.AprovacaoAnoConclusao ? (
                <CircularProgress size={15} />
              ) : !isDetail && !isDraft ? (
                <Link
                  variant='body2'
                  onClick={() =>
                    handleAproval(
                      'AprovacaoAnoConclusao',
                      'dataaprovacaoanoconclusao'
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
        <Autocomplete
          fullWidth
          noOptionsText='Sem Opções'
          filterSelectedOptions={true}
          options={temperatureOptions?.filter((e) => e[`${PREFIX}ativo`]) || []}
          value={values.temperature}
          disabled={
            isDetail || !!team?.[`_${PREFIX}aprovacaotemperatura_value`]
          }
          onChange={(event: any, newValue: any[]) => {
            setFieldValue('temperature', newValue);
          }}
          getOptionSelected={(option: any, item: any) =>
            option?.value === item?.value
          }
          getOptionLabel={(option: any) => option?.label || ''}
          renderInput={(params) => (
            <TextField
              {...params}
              required={!isModel}
              fullWidth // @ts-ignore
              error={!!errors?.temperature}
              // @ts-ignore
              helperText={errors?.temperature as string}
              label='Temperatura/Status'
            />
          )}
        />

        {team?.[`_${PREFIX}aprovacaotemperatura_value`] && (
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
            {!team?.[`_${PREFIX}aprovacaotemperatura_value`] &&
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
          !team?.[`_${PREFIX}aprovacaotemperatura_value`] ? (
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
        <Box display='flex' alignItems='center'>
          <Autocomplete
            fullWidth
            noOptionsText='Sem Opções'
            filterSelectedOptions={true}
            options={modalityOptions?.filter((e) => e[`${PREFIX}ativo`]) || []}
            value={values.modality}
            disabled={isDetail}
            onChange={(event: any, newValue: any[]) => {
              setFieldValue('modality', newValue);
            }}
            getOptionSelected={(option: any, item: any) =>
              option?.value === item?.value
            }
            getOptionLabel={(option: any) => option?.label || ''}
            renderInput={(params) => (
              <TextField
                {...params}
                required={!isModel}
                fullWidth
                error={!!errors?.modality}
                // @ts-ignore
                helperText={errors?.modality as string}
                label='Modalidade'
              />
            )}
          />
          <Tooltip title='Adicionar Etiqueta'>
            <IconButton
              disabled={isDetail || !currentUser?.isPlanning}
              onClick={() => handleNewTag(EFatherTag.MODALIDADE_TURMA)}
            >
              <PlusOne />
            </IconButton>
          </Tooltip>
        </Box>

        {team?.[`_${PREFIX}aprovacaomodalidade_value`] && (
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
            {!team?.[`_${PREFIX}aprovacaomodalidade_value`] &&
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
          !team?.[`_${PREFIX}aprovacaomodalidade_value`] ? (
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

      {!isModel && (
        <Grid item sm={12} md={6} lg={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.concurrentActivity}
                disabled={isDetail}
                onChange={(event) =>
                  setFieldValue('concurrentActivity', event.target.checked)
                }
                name='concurrentActivity'
                color='primary'
              />
            }
            label='Permitir atividades concorrentes'
          />
        </Grid>
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
