import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { FilterList, PlusOne } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import AddTag from '~/components/AddTag';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser } from '~/hooks';
import { getPrograms } from '~/store/modules/program/actions';

interface ILoadModel {
  context: WebPartContext;
  isModel?: boolean;
  values: any;
  errors: any;
  setFieldValue: any;
  handleNext: () => void;
}

const LoadModel: React.FC<ILoadModel> = ({
  context,
  isModel,
  values,
  errors,
  setFieldValue,
  handleNext,
}) => {
  const [optionChip, setOptionChip] = React.useState('Todos');
  const [personFilter, setPersonFilter] = React.useState<any>();
  const [localFilter, setLocalFilter] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [programs, setPrograms] = React.useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newTagModal, setNewTagModal] = React.useState({
    open: false,
    fatherTag: null,
  });
  const [filter, setFilter] = React.useState<any>({
    model: true,
    filterTeam: true,
    top: TOP_QUANTITY,
    published: 'Sim',
    active: 'Ativo' as any,
    searchQuery: '',
  });

  const { currentUser, tags, persons } = useLoggedUser();

  React.useEffect(() => {
    handleFetchPrograms();
  }, [filter]);

  const handleFetchPrograms = () => {
    setLoading(true);
    getPrograms(filter).then((programData) => {
      setLoading(false);
      setPrograms(programData);
    });
  };

  const handleOption = (opt) => {
    setOptionChip(opt);

    switch (opt) {
      case EGroups.PLANEJAMENTO:
      case EGroups.ADMISSOES:
        setFilter({
          ...filter,
          group: opt,
          createdBy: '',
        });
        break;
      case 'Meus Modelos':
        setFilter({
          ...filter,
          group: '',
          createdBy: currentUser?.[`${PREFIX}pessoaid`],
        });
        break;
      default:
      case 'Todos':
        setFilter({
          ...filter,
          group: '',
          createdBy: '',
        });
        break;
    }
  };

  const handleChangePerson = (person) => {
    setPersonFilter(person);
    setFilter({
      ...filter,
      group: '',
      createdBy: person?.[`${PREFIX}pessoaid`],
    });
  };

  const handleFilter = () => {
    setFilter({
      ...filter,
      typeProgram: localFilter.typeProgram?.[`${PREFIX}etiquetaid`],
      nameProgram: localFilter.nameProgram?.[`${PREFIX}etiquetaid`],
      institute: localFilter.institute?.[`${PREFIX}etiquetaid`],
      company: localFilter.company?.[`${PREFIX}etiquetaid`],
    });
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = () => {};

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

  const options = [
    EGroups.PLANEJAMENTO,
    EGroups.ADMISSOES,
    'Meus Modelos',
    'Criado Por',
    'Todos',
  ];

  const open = Boolean(anchorEl);

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
    [tags]
  );

  const typeProgramOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_PROGRAMA
          )
        )
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}etiquetaid`],
          label: tag?.[`${PREFIX}nome`] || '',
        })),
    [tags]
  );

  const nameProgramOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.NOME_PROGRAMA
          )
        )
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}etiquetaid`],
          label: tag?.[`${PREFIX}nome`] || '',
        })),
    [tags]
  );

  const instituteOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.INSTITUTO
          )
        )
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}etiquetaid`],
          label: tag?.[`${PREFIX}nome`] || '',
        })),
    [tags]
  );

  const companyOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.EMPRESA
          )
        )
        ?.map((tag) => ({
          ...tag,
          value: tag?.[`${PREFIX}etiquetaid`],
          label: tag?.[`${PREFIX}nome`] || '',
        })),
    [tags]
  );

  return (
    <Box
      display='flex'
      flexDirection='column'
      padding='2rem'
      style={{ gap: '1rem' }}
    >
      <AddTag
        open={newTagModal.open}
        fatherTags={fatherTags}
        fatherSelected={newTagModal.fatherTag}
        handleClose={handleCloseNewTag}
      />
      <Box
        display='flex'
        flexDirection='column'
        borderRadius='10px'
        border='1px solid #0063a5'
        padding='10px'
        style={{ gap: '1rem' }}
      >
        <Box display='flex' alignItems='center' style={{ gap: '1rem' }}>
          <Typography
            variant='body2'
            color='primary'
            style={{ fontWeight: 'bold' }}
          >
            Filtro
          </Typography>
          <IconButton onClick={handleClick}>
            <FilterList />
          </IconButton>

          <Popover
            id={open ? 'filter-popover' : undefined}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box padding='10px' minWidth='25rem'>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      typeProgramOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.typeProgram}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({ ...localFilter, typeProgram: newValue });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label='Tipo do Programa'
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      nameProgramOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.nameProgram}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({ ...localFilter, nameProgram: newValue });
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
                      />
                    )}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      instituteOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.institute}
                    onChange={(event: any, newValue: any[]) => {
                      setLocalFilter({ ...localFilter, institute: newValue });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Instituto' />
                    )}
                  />
                </Grid>

                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      companyOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.company}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({ ...localFilter, company: newValue });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Empresa' />
                    )}
                  />
                </Grid>
              </Grid>
              <Box
                display='flex'
                marginTop='1rem'
                justifyContent='flex-end'
                style={{ gap: '10px' }}
              >
                <Button onClick={() => setLocalFilter({})} variant='outlined'>
                  Limpar
                </Button>
                <Button
                  onClick={handleFilter}
                  variant='contained'
                  color='primary'
                >
                  Aplicar
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>

        <Box display='flex' style={{ gap: '10px' }}>
          {options?.map((opt) => (
            <Chip
              color={opt === optionChip ? 'primary' : 'default'}
              onClick={() => handleOption(opt)}
              label={opt}
            />
          ))}
        </Box>
        {optionChip === 'Criado Por' && (
          <Autocomplete
            fullWidth
            options={persons || []}
            noOptionsText={'Sem opções'}
            value={personFilter}
            getOptionLabel={(option) => option?.label || ''}
            onChange={(event: any, newValue: any) =>
              handleChangePerson(newValue)
            }
            renderInput={(params) => (
              <TextField {...params} fullWidth label='Pessoa' />
            )}
          />
        )}
      </Box>

      <Autocomplete
        fullWidth
        options={programs || []}
        noOptionsText={'Sem opções'}
        value={values.model}
        getOptionLabel={(option) => option?.[`${PREFIX}titulo`] || ''}
        onChange={(event: any, newValue: any) => {
          setFieldValue('model', newValue);
          setFieldValue(
            'items',
            newValue?.[`${PREFIX}Programa_Turma`]
              ?.filter((e) => e?.[`${PREFIX}ativo`])
              ?.map((te) => ({
                id: te?.[`${PREFIX}turmaid`],
                label: te?.[`${PREFIX}nome`],
                sigla: '',
                yearConclusion: '',
              }))
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label='Modelo'
            // onChange={(event) =>
            //   setFilter({ ...filter, searchQuery: event.target.value })
            // }
            error={!!errors.model}
            // @ts-ignore
            helperText={errors.model}
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

      {!isModel && (
        <>
          <Box display='flex' alignItems='center'>
            <Autocomplete
              fullWidth
              noOptionsText='Sem Opções'
              filterSelectedOptions={true}
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
                onClick={() => handleNewTag(EFatherTag.NOME_PROGRAMA)}
              >
                <PlusOne />
              </IconButton>
            </Tooltip>
          </Box>

          <KeyboardDatePicker
            autoOk
            clearable
            autoFocus
            fullWidth
            variant='inline'
            format={'DD/MM/YYYY'}
            label='Data de Início'
            error={!!errors.startDate}
            // @ts-ignore
            helperText={errors.startDate}
            value={values.startDate}
            onChange={(value) => {
              setFieldValue('startDate', value);
            }}
          />
        </>
      )}
      {!isModel && (
        <Box
          display='flex'
          flexDirection='column'
          borderRadius='10px'
          border='1px solid #0063a5'
          padding='10px'
          overflow='hidden auto'
          style={{ gap: '1rem' }}
          height='calc(100vh - 30rem)'
        >
          {values?.items?.map((te, i) => (
            <Box>
              <Box display='flex' flexDirection='column'>
                <Typography>{te?.label}</Typography>
                <Grid container spacing={3}>
                  <Grid item sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label={'Sigla*'}
                      type='text'
                      name={`items[${i}].sigla`}
                      inputProps={{ maxLength: 50 }}
                      error={!!errors?.items?.[i].sigla}
                      helperText={errors?.items?.[i].sigla}
                      onChange={(e) =>
                        setFieldValue(`items[${i}].sigla`, e.target.value)
                      }
                      value={values?.items?.[i]?.sigla}
                    />
                  </Grid>
                  <Grid item sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label={'Ano de Conclusão*'}
                      type='number'
                      name={`items[${i}].yearConclusion`}
                      error={!!errors?.items?.[i].yearConclusion}
                      helperText={errors?.items?.[i].yearConclusion}
                      onChange={(event) =>
                        parseInt(event.target.value) < 9999 &&
                        setFieldValue(
                          `items[${i}].yearConclusion`,
                          event.target.value
                        )
                      }
                      value={values?.items?.[i]?.yearConclusion}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Box
        display='flex'
        width='100%'
        marginTop='2rem'
        padding='0 4rem'
        justifyContent='center'
      >
        <Button
          fullWidth
          onClick={handleNext}
          variant='contained'
          color='primary'
        >
          Criar
        </Button>
      </Box>
    </Box>
  );
};

export default LoadModel;
