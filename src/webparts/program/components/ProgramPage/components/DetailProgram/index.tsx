import * as React from 'react';
import * as _ from 'lodash';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from '~/components/CustomCard';
import { EFatherTag } from '~/config/enums';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
  Search,
} from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { AddButton } from '../../styles';
import { PREFIX } from '~/config/database';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { TeamName } from './styles';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { deleteTeam, getTeamById } from '~/store/modules/team/actions';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { DeliveryDrawer } from '../DeliveryDrawer/index';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { createModel } from '~/store/modules/model/actions';
import { useDebounce } from 'use-debounce';
import { deleteByTeam } from '~/store/modules/resource/actions';
import FilterDrawer from '~/components/FilterDrawer';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';

interface IDetailProgram {
  programChoosed: any;
  teamChoosed: any;
  programTemperature: string;
  isProgramResponsible: boolean;
  isProgramDirector: boolean;
  isFinance: boolean;
  refetchSchedule: any;
  refetchResource: any;
  refetch: any;
  context: WebPartContext;
  setTeamChoosed: React.Dispatch<any>;
}

const DetailProgram: React.FC<IDetailProgram> = ({
  programChoosed,
  programTemperature,
  setTeamChoosed,
  refetchSchedule,
  refetchResource,
  isProgramResponsible,
  isProgramDirector,
  isFinance,
  teamChoosed,
  context,
  refetch,
}) => {
  const [openDeliveryDrawer, setOpenDeliveryDrawer] = React.useState(false);
  const [openAddTeam, setOpenAddTeam] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');
  const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
  const [modelName, setModelName] = React.useState({
    open: false,
    loadSpaces: true,
    loadPerson: true,
    loadDate: true,
    name: '',
    error: '',
  });
  const [listFiltered, setListFiltered] = React.useState([]);

  const [valueSearch] = useDebounce<string>(search, 300);

  const queryParameters = new URLSearchParams(window.location.search);
  const teamIdParam = queryParameters.get('teamid');

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  const { tag, team } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { loading, teams } = team;

  const teamList = React.useMemo(
    () =>
      teams?.map((m) => ({
        ...m,
        title: m?.[`${PREFIX}titulo`]?.toLocaleUpperCase(),
        name: m?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
        sigla: m?.[`${PREFIX}sigla`]?.toLocaleUpperCase(),
      })),
    [teams]
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

  const modalityOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_TURMA
        )
      ),
    [tags]
  );

  const config: Config = React.useMemo(
    () => ({
      ...FILTER_CONFIG_DEFAULT,
      fields: {
        title: {
          label: 'Título',
          type: 'text',
        },
        name: {
          label: 'Nome',
          type: 'text',
        },
        sigla: {
          label: 'Sigla',
          type: 'text',
        },
        [`${PREFIX}anodeconclusao`]: {
          label: 'Ano de Conclusão',
          type: 'number',
        },
        [`${PREFIX}Modalidade`]: {
          label: 'Modalidade',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: modalityOptions,
              },
            },
          },
        },
        [`${PREFIX}Temperatura`]: {
          label: 'Temperatura',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: temperatureOptions,
              },
            },
          },
        },
      },
    }),
    [temperatureOptions, modalityOptions]
  );

  const [query, setQuery] = React.useState({
    // @ts-ignore
    tree: QbUtils.loadFromJsonLogic(
      { and: [{ '==': [{ var: 'ise_ativo' }, true] }] },
      config
    ),
    config: config,
  });

  React.useEffect(() => {
    setListFiltered(teamList);
  }, [teamList]);

  React.useEffect(() => {
    setListFiltered(
      teamList?.filter(
        (program) =>
          program?.[`${PREFIX}nome`]
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase()) ||
          program?.[`${PREFIX}sigla`]
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase())
      )
    );
  }, [valueSearch]);

  React.useEffect(() => {
    if (teamIdParam && programChoosed) {
      getTeamById(teamIdParam).then(({ value }) => {
        setTeamChoosed(value[0]);
      });
    }
  }, [teamIdParam]);

  const handleClose = () => {
    setOpenAddTeam(false);
    setItemSelected(null);
    refetch();
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleOption = (event, item) => {
    setItemSelected(item);
    setAnchorEl(event.currentTarget);
  };

  const handleDetail = () => {
    setOpenAddTeam(true);
    handleCloseAnchor();
  };

  const handleBatchEdition = () => {
    handleCloseAnchor();
    global.window.open(
      `${
        context.pageContext.web.absoluteUrl
      }/SitePages/Edição%20em%20Massa.aspx?teamid=${
        itemSelected?.[`${PREFIX}turmaid`]
      }`
    );
  };

  const handleDelivery = () => {
    setOpenDeliveryDrawer(true);
    handleCloseAnchor();
  };

  const handleCloseDelivery = () => {
    setItemSelected(null);
    setOpenDeliveryDrawer(false);
  };

  const saveAsModel = async () => {
    if (!modelName.name) {
      setModelName({ ...modelName, error: 'Campo Obrigatório' });
      return;
    }
    setIsLoadingSaveModel(true);
    setModelName({ ...modelName, open: false, error: '' });

    dispatch(
      createModel(
        {
          Tipo: TYPE_REQUEST_MODEL.CRIACAO,
          Origem: TYPE_ORIGIN_MODEL.TURMA,
          Nome: modelName.name,
          ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
          ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
          ManterDatas: modelName.loadDate ? 'Sim' : 'Não',
          IDOrigem: itemSelected[`${PREFIX}turmaid`],
          IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
        },
        {
          onSuccess: () => {
            handleCloseAnchor();
            setIsLoadingSaveModel(false);
            confirmation.openConfirmation({
              title: 'Criação de modelo',
              yesLabel: 'Fechar',
              showCancel: false,
              description:
                'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!',
              onConfirm: () => null,
            });
          },
          onError: (error) => {
            setIsLoadingSaveModel(false);
            notification.error({
              title: 'Falha',
              description: error?.data?.error?.message,
            });
          },
        }
      )
    );
  };

  const handleToSaveModel = () => {
    setModelName({ ...modelName, open: true, name: '', error: '' });
  };

  const handleCloseSaveModel = () => {
    setModelName({ ...modelName, open: false, name: '', error: '' });
  };

  const updateAll = () => {
    refetch();
    refetchSchedule();
    refetchResource();
  };

  const handleDeleteTeam = () => {
    handleCloseAnchor();
    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir a Turma ${
        itemSelected?.[`${PREFIX}nome`] || itemSelected?.[`${PREFIX}titulo`]
      }?`,
      onConfirm: () => {
        dispatch(
          deleteTeam(itemSelected[`${PREFIX}turmaid`], {
            onSuccess: () => {
              refetch();
              setItemSelected(null);
            },
            onError: () => setItemSelected(null),
          })
        );
        dispatch(deleteByTeam(itemSelected[`${PREFIX}turmaid`]));
      },
    });
  };

  const clearFilter = () => {
    setQuery({
      ...query,
      tree: QbUtils.loadFromJsonLogic(
        { and: [{ '==': [{ var: 'ise_ativo' }, true] }] },
        config
      ),
    });
  };

  const applyFilter = () => {
    const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;

    if (logic) {
      const filteredData = teamList.filter((item) =>
        jsonLogic.apply(logic, item)
      );
      setListFiltered(filteredData);
    } else {
      setListFiltered(teamList);
    }
    setFilterDrawer(false);
  };

  const handleSort = (field = sortBy, changeDirection = true) => {
    let direction = sort;

    if (changeDirection) {
      direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
    }

    const newList = teamList?.sort((a, b) => {
      let valueA =
        field === 'createdon' ? new Date(_.get(a, field)) : _.get(a, field);
      let valueB =
        field === 'createdon' ? new Date(_.get(b, field)) : _.get(b, field);

      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else if (direction === 'desc') {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      } else {
        return 0;
      }
    });

    setListFiltered(newList);
    setSort(direction);
    setSortBy(field);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <DeliveryDrawer
        key='DeliveryDrawer'
        onClose={handleCloseDelivery}
        open={openDeliveryDrawer}
        team={itemSelected}
      />

      <FilterDrawer
        key='FilterDrawer'
        queryQB={query}
        configQB={config}
        setQuery={setQuery}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
        onClose={() => setFilterDrawer(false)}
        open={filterDrawer}
      />

      <AddTeam
        key='AddTeam'
        teams={teams}
        context={context}
        isDraft={
          (itemSelected?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ||
            programTemperature) === EFatherTag.RASCUNHO
        }
        refetch={updateAll}
        open={openAddTeam}
        program={programChoosed}
        isProgramResponsible={isProgramResponsible}
        isProgramDirector={isProgramDirector}
        isFinance={isFinance}
        team={itemSelected}
        setTeam={(newTeam) => {
          setTeamChoosed(newTeam);
          setItemSelected(newTeam);
        }}
        teamLength={teams?.length}
        company={programChoosed?.[`${PREFIX}Empresa`]?.[`${PREFIX}nome`]}
        programId={programChoosed?.[`${PREFIX}programaid`]}
        handleClose={handleClose}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Tooltip
            arrow
            title={programChoosed?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]}
          >
            <Title>
              {programChoosed?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]}
            </Title>
          </Tooltip>
          <Tooltip arrow title='Nova Turma'>
            <AddButton
              variant='contained'
              color='primary'
              onClick={() => setOpenAddTeam(true)}
            >
              <Add />
            </AddButton>
          </Tooltip>
        </Box>
        <Box>
          <TextField
            fullWidth
            onChange={handleSearch}
            placeholder='Pesquisar'
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Box>
        <Box display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Button
              variant='outlined'
              size='small'
              endIcon={
                sortBy === `${PREFIX}nome` ? (
                  sort === 'asc' ? (
                    <ArrowUpward fontSize='small' />
                  ) : (
                    <ArrowDownward fontSize='small' />
                  )
                ) : null
              }
              onClick={() => handleSort(`${PREFIX}nome`)}
            >
              Nome
            </Button>
            <Button
              variant='outlined'
              size='small'
              endIcon={
                sortBy === `createdon` ? (
                  sort === 'asc' ? (
                    <ArrowUpward fontSize='small' />
                  ) : (
                    <ArrowDownward fontSize='small' />
                  )
                ) : null
              }
              onClick={() => handleSort('createdon')}
            >
              Data
            </Button>
          </Box>
          {loading ? <CircularProgress size={20} color='primary' /> : null}
          <IconButton onClick={() => setFilterDrawer(true)}>
            <FilterList />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => {
            handleCloseAnchor();
            setItemSelected(null);
          }}
        >
          <MenuItem onClick={handleDelivery}>Entregas</MenuItem>
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem onClick={handleBatchEdition}>Edição em massa</MenuItem>
          <MenuItem onClick={() => !isLoadingSaveModel && handleToSaveModel()}>
            <Box display='flex' style={{ gap: '10px' }}>
              {isLoadingSaveModel ? (
                <CircularProgress size={20} color='primary' />
              ) : null}
              Salvar como modelo
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDeleteTeam}>Excluir</MenuItem>
        </Menu>

        <Box
          display='flex'
          flexDirection='column'
          overflow='auto'
          maxHeight='calc(100vh - 17rem)'
          paddingBottom='10px'
          margin='0 -5px'
          style={{ gap: '1rem' }}
        >
          {listFiltered?.length ? (
            <>
              {listFiltered?.map((team) => {
                const temperature = temperatureColor(
                  team,
                  programChoosed?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`]
                );
                return (
                  <StyledCard
                    elevation={3}
                    background={temperature.background}
                    color={temperature.color}
                    active={
                      team?.[`${PREFIX}turmaid`] ===
                      teamChoosed?.[`${PREFIX}turmaid`]
                    }
                  >
                    <StyledHeaderCard
                      action={
                        <Tooltip arrow title='Ações'>
                          <StyledIconButton
                            aria-label='settings'
                            onClick={(event) => handleOption(event, team)}
                          >
                            <MoreVert />
                          </StyledIconButton>
                        </Tooltip>
                      }
                      title={
                        <Tooltip arrow title={team?.[`${PREFIX}sigla`]}>
                          <TitleCard onClick={() => setTeamChoosed(team)}>
                            {team?.[`${PREFIX}sigla`]}
                          </TitleCard>
                        </Tooltip>
                      }
                    />
                    <StyledContentCard onClick={() => setTeamChoosed(team)}>
                      <Divider />
                      <Tooltip arrow title={team?.[`${PREFIX}nome`]}>
                        <TeamName variant='body1'>
                          {team?.[`${PREFIX}nome`]}
                        </TeamName>
                      </Tooltip>
                    </StyledContentCard>
                  </StyledCard>
                );
              })}
            </>
          ) : (
            <Typography
              variant='body1'
              color='textSecondary'
              style={{ fontWeight: 'bold' }}
            >
              Nenhuma turma cadastrada
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog
        fullWidth
        maxWidth='sm'
        open={modelName.open}
        onClose={handleCloseSaveModel}
      >
        <DialogTitle>Salvar como modelo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!!modelName.error}
            helperText={modelName.error}
            onChange={(event) =>
              setModelName({ ...modelName, name: event.target.value })
            }
            margin='dense'
            label='Nome'
            placeholder='Informe o nome do modelo'
            type='text'
          />
          <FormControl style={{ marginTop: '1rem' }} component='fieldset'>
            <FormLabel component='legend'>
              Deseja preservar os recursos?
            </FormLabel>

            <FormControlLabel
              control={
                <Checkbox
                  checked={modelName.loadSpaces}
                  onChange={(event) =>
                    setModelName({
                      ...modelName,
                      loadSpaces: event.target.checked,
                    })
                  }
                  name='loadSpaces'
                  color='primary'
                />
              }
              label='Espaços'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={modelName.loadPerson}
                  onChange={(event) =>
                    setModelName({
                      ...modelName,
                      loadPerson: event.target.checked,
                    })
                  }
                  name='loadPerson'
                  color='primary'
                />
              }
              label='Pessoas'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={modelName.loadDate}
                  onChange={(event) =>
                    setModelName({
                      ...modelName,
                      loadDate: event.target.checked,
                    })
                  }
                  name='loadDate'
                  color='primary'
                />
              }
              label='Manter datas'
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveModel}>Cancelar</Button>
          <Button onClick={saveAsModel} variant='contained' color='primary'>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailProgram;
