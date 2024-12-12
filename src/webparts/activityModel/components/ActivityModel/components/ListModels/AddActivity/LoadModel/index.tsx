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
import * as React from 'react';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, EFatherTag, EGroups } from '~/config/enums';
import { useLoggedUser } from '~/hooks';
import { getActivities } from '~/store/modules/activity/actions';

interface ILoadModel {
  values: any;
  errors: any;
  typeLoad: EActivityTypeApplication;
  setFieldValue: any;
  handleNext: () => void;
}

const LoadModel: React.FC<ILoadModel> = ({
  values,
  typeLoad,
  setFieldValue,
  handleNext,
}) => {
  const [optionChip, setOptionChip] = React.useState('Todos');
  const [personFilter, setPersonFilter] = React.useState<any>();
  const [localFilter, setLocalFilter] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filter, setFilter] = React.useState<any>({
    model: true,
    filterTeam: true,
    published: 'Sim',
    active: 'Ativo' as any,
    typeApplication: typeLoad,
    searchQuery: '',
  });

  const { currentUser, tags, persons } = useLoggedUser();

  React.useEffect(() => {
    setFilter({
      ...filter,
      order: 'asc',
      orderBy:
        (typeLoad === EActivityTypeApplication.PLANEJAMENTO
          ? `${PREFIX}nome`
          : `${PREFIX}titulo`) || `${PREFIX}titulo`,
      published:
        typeLoad === EActivityTypeApplication.PLANEJAMENTO ? 'Todos' : 'Sim',
      typeApplication: typeLoad,
    });
  }, [typeLoad]);

  React.useEffect(() => {
    handleFetchActivities();
  }, [filter]);

  const handleFetchActivities = () => {
    setLoading(true);
    getActivities(filter).then((activityData) => {
      setLoading(false);
      setActivities(activityData);
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
      academicArea: localFilter.academicArea?.[`${PREFIX}etiquetaid`],
      name: localFilter.name,
    });
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = [
    EGroups.PLANEJAMENTO,
    EGroups.ADMISSOES,
    'Meus Modelos',
    'Criado Por',
    'Todos',
  ];

  const open = Boolean(anchorEl);

  const areaOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
    )
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
            <Box padding='10px' minWidth='25rem'>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={6}>
                  <Autocomplete
                    filterSelectedOptions={true}
                    noOptionsText='Sem Opções'
                    options={
                      areaOptions?.filter(
                        (e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`]
                      ) || []
                    }
                    value={localFilter.academicArea}
                    onChange={(event: any, newValue: any) => {
                      setLocalFilter({
                        ...localFilter,
                        academicArea: newValue,
                      });
                    }}
                    getOptionSelected={(option: any, item: any) =>
                      option?.value === item?.value
                    }
                    getOptionLabel={(option: any) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth label='Área Academica' />
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
        options={activities || []}
        noOptionsText={'Sem opções'}
        value={values.model}
        getOptionLabel={(option) =>
          typeLoad === EActivityTypeApplication.PLANEJAMENTO
            ? option?.[`${PREFIX}nome`] || ''
            : option?.[`${PREFIX}titulo`] || ''
        }
        onChange={(event: any, newValue: any[]) =>
          setFieldValue('model', newValue)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={
              typeLoad === EActivityTypeApplication.PLANEJAMENTO
                ? 'Atividade'
                : 'Modelo'
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
          Avançar
        </Button>
      </Box>
    </Box>
  );
};

export default LoadModel;
