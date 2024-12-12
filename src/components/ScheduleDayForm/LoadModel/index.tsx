import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
import * as React from 'react';
import { TOP_QUANTITY } from '~/config/constants';
import { PREFIX } from '~/config/database';
import { EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser, useScheduleDay } from '~/hooks';

interface ILoadModel {
  isGroup?: boolean;
  isModel?: boolean;
  values: any;
  errors: any;
  setFieldValue: any;
  handleNext: () => void;
}

const LoadModel: React.FC<ILoadModel> = ({
  isModel,
  isGroup,
  values,
  errors,
  setFieldValue,
  handleNext,
}) => {
  const [optionChip, setOptionChip] = React.useState('Todos');
  const [personFilter, setPersonFilter] = React.useState<any>();
  const [localFilter, setLocalFilter] = React.useState<any>({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState<any>({
    model: true,
    filterTeam: true,
    top: TOP_QUANTITY,
    active: 'Ativo' as any,
    searchQuery: '',
    published: 'Sim',
    group: isGroup ? 'Sim' : 'Não',
  });

  const [{ schedule: scheduleOptions, loading }] = useScheduleDay(filter);
  const { currentUser, tags, persons } = useLoggedUser();

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
      module: localFilter.module?.[`${PREFIX}etiquetaid`],
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
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_DIA
        )
      ),
    [tags]
  );

  const moduleOptions = React.useMemo(
    () =>
      tags
        ?.filter((tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODULO
          )
        )
        .map((tag) => ({
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
                    options={
                      modalityOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    noOptionsText='Sem Opções'
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
                  <Autocomplete
                    filterSelectedOptions={true}
                    options={
                      moduleOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    noOptionsText='Sem Opções'
                    value={localFilter.module}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({ ...localFilter, module: newValue });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Módulo' />
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
          {options.map((opt) => (
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
        options={scheduleOptions || []}
        noOptionsText={'Sem opções'}
        value={values.model}
        getOptionLabel={(option) => option?.[`${PREFIX}nome`] || ''}
        onChange={(event: any, newValue: any[]) =>
          setFieldValue('model', newValue)
        }
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
