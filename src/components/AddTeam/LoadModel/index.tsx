import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as moment from 'moment';
import * as React from 'react';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser, useTeam } from '~/hooks';
import { getTeams } from '~/store/modules/team/actions';

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
  const [loading, setLoading] = React.useState(false);
  const [showLoadDate, setShowLoadDate] = React.useState(false);
  const [personFilter, setPersonFilter] = React.useState<any>();
  const [teams, setTeams] = React.useState<any[]>([]);
  const [localFilter, setLocalFilter] = React.useState<any>({
    modality: {},
    yearConclusion: '',
    initials: '',
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState<any>({
    model: true,
    filterTeam: true,
    top: TOP_QUANTITY,
    active: 'Ativo' as any,
    published: 'Sim',
    searchQuery: '',
  });

  const { currentUser, tags, persons } = useLoggedUser();

  React.useEffect(() => {
    handleFetchTeams();
  }, [filter]);

  const handleFetchTeams = () => {
    setLoading(true);
    getTeams(filter).then((teamData) => {
      setLoading(false);
      setTeams(teamData);
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

  const handleFilter = () => {
    setFilter({
      ...filter,
      modality: localFilter.modality?.[`${PREFIX}etiquetaid`],
      yearConclusion: localFilter.yearConclusion,
      initials: localFilter.initials,
    });
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePerson = (person) => {
    setPersonFilter(person);
    setFilter({
      ...filter,
      group: '',
      createdBy: person?.[`${PREFIX}pessoaid`],
    });
  };

  const handleChangeModel = (newValue) => {
    const schedule = newValue?.[`${PREFIX}CronogramadeDia_Turma`].find(
      (c) => !c?.[`${PREFIX}excluido`] && c?.[`${PREFIX}ativo`]
    );

    const date = moment.utc(schedule?.[`${PREFIX}data`]);

    if (date.format('YYYY') !== '2006') {
      setShowLoadDate(true);
    } else {
      setShowLoadDate(false);
    }

    setFieldValue('loadDate', false);
    setFieldValue('model', newValue);
  };

  const options = [
    EGroups.PLANEJAMENTO,
    EGroups.ADMISSOES,
    'Meus Modelos',
    'Criado Por',
    'Todos',
  ];

  const open = Boolean(anchorEl);

  const modalityOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_TURMA
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
            <Box padding='10px'>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      modalityOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.modality}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({ ...localFilter, modality: newValue });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Modalidade' />
                    )}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    type='number'
                    onChange={(event) =>
                      setLocalFilter({
                        ...localFilter,
                        yearConclusion: event.target.value,
                      })
                    }
                    value={localFilter.yearConclusion}
                    label='Ano de Conclusão'
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    onChange={(event) =>
                      setLocalFilter({
                        ...localFilter,
                        initials: event.target.value,
                      })
                    }
                    value={localFilter.initials}
                    label='Sigla'
                  />
                </Grid>
              </Grid>
              <Box
                display='flex'
                marginTop='1rem'
                justifyContent='flex-end'
                style={{ gap: '10px' }}
              >
                <Button
                  onClick={() =>
                    setLocalFilter({
                      modality: {},
                      yearConclusion: '',
                      initials: '',
                    })
                  }
                  variant='outlined'
                >
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
        options={teams || []}
        noOptionsText={'Sem opções'}
        value={values.model}
        getOptionLabel={(option) => option?.[`${PREFIX}titulo`] || ''}
        onChange={(event: any, newValue: any[]) => handleChangeModel(newValue)}
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

      {showLoadDate && (
        <FormControlLabel
          control={
            <Checkbox
              checked={values.loadDate}
              onChange={(event) =>
                setFieldValue('loadDate', event.target.checked)
              }
              name='loadDate'
              color='primary'
            />
          }
          label='Manter datas?'
        />
      )}
      {!isModel && (
        <>
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
          <TextField
            fullWidth
            label='Ano de Conclusão*'
            type='number'
            name='yearConclusion'
            error={!!errors.yearConclusion}
            helperText={errors.yearConclusion}
            onChange={(event) =>
              parseInt(event.target.value) < 9999 &&
              setFieldValue('yearConclusion', parseInt(event.target.value))
            }
            value={values.yearConclusion}
          />

          <TextField
            fullWidth
            label='Sigla*'
            type='text'
            name='sigla'
            error={!!errors.sigla}
            helperText={errors.sigla}
            onChange={(event) => setFieldValue('sigla', event.target.value)}
            value={values.sigla}
          />
        </>
      )}

      <Box
        display='flex'
        width='100%'
        marginTop='1rem'
        padding='0 4rem'
        justifyContent='center'
      >
        <Button
          fullWidth
          onClick={handleNext}
          variant='contained'
          color='primary'
        >
          Avançar
        </Button>
      </Box>
    </Box>
  );
};

export default LoadModel;
