import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close, FilterList } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, EFatherTag, EGroups } from '~/config/enums';
import { getActivities } from '~/store/modules/activity/actions';
import { useLoggedUser } from '~/hooks';
import { Autocomplete } from '@material-ui/lab';

interface ILoadModel {
  open: boolean;
  onLoadModel: (model: any) => void;
  onClose: () => void;
}

const LoadModel: React.FC<ILoadModel> = ({ open, onClose, onLoadModel }) => {
  const [optionChip, setOptionChip] = React.useState('Todos');
  const [personFilter, setPersonFilter] = React.useState<any>();
  const [localFilter, setLocalFilter] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [models, setModels] = React.useState<any[]>([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modelSelected, setModelSelected] = React.useState({});
  const [filter, setFilter] = React.useState<any>({
    model: true,
    filterTeam: true,
    active: 'Ativo' as any,
    published: 'Sim',
    typeApplication: EActivityTypeApplication.MODELO_REFERENCIA,
    searchQuery: '',
  });

  const { currentUser, tags, persons } = useLoggedUser();

  React.useEffect(() => {
    handleFetchActivities();
  }, [filter]);

  const handleFetchActivities = () => {
    setLoading(true);
    getActivities(filter).then((activityData) => {
      setLoading(false);
      setModels(activityData);
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
    handleClosePopover();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setModelSelected({});
    onClose();
  };

  const handleNext = () => {
    onLoadModel(modelSelected);
    handleClose();
  };

  const options = [
    EGroups.PLANEJAMENTO,
    EGroups.ADMISSOES,
    'Meus Modelos',
    'Criado Por',
    'Todos',
  ];

  const areaOptions = tags?.filter((tag) =>
    tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
      (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
    )
  );

  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <DialogTitle>
        Busca modelo de atividade
        <IconButton
          aria-label='close'
          onClick={handleClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
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
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
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
                        options={
                          areaOptions?.filter((e) => e[`${PREFIX}ativo`]) || []
                        }
                        noOptionsText='Sem Opções'
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
                          <TextField
                            {...params}
                            fullWidth
                            label='Área Academica'
                          />
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
                    <Button
                      onClick={() => setLocalFilter({})}
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
            options={models || []}
            noOptionsText={'Sem opções'}
            value={modelSelected}
            getOptionLabel={(option) => option?.[`${PREFIX}titulo`] || ''}
            onChange={(event: any, newValue: any) => setModelSelected(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={'Modelo'}
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
      </DialogContent>
    </Dialog>
  );
};

export default LoadModel;
