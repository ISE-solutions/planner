import * as React from 'react';
import * as _ from 'lodash';
import {
  AddButton,
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from './styles';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PREFIX, TAG, TEAM } from '~/config/database';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
  Public,
} from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { ShareModel } from '~/components';
import { useConfirmation, useNotification } from '~/hooks';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { deleteTeam } from '~/store/modules/team/actions';
import FilterDrawer from '~/components/FilterDrawer';
import { EFatherTag, EGroups } from '~/config/enums';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';

interface IListModels {
  teamChoosed: any;
  refetch: any;
  currentUser: any;
  loading: boolean;
  loadingSave: boolean;
  teams: any[];
  refetchSchedule: any;
  filter: any;
  setFilter: React.Dispatch<any>;
  context: WebPartContext;
  handleSchedule: (schedule: any) => any;
  setTeamChoosed: (schedule: any) => any;
}

const ListModels: React.FC<IListModels> = ({
  context,
  loading,
  currentUser,
  teams,
  refetch,
  refetchSchedule,
  teamChoosed,
  handleSchedule,
  setTeamChoosed,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [openShareModel, setOpenShareModel] = React.useState(false);
  const [loadingShareModel, setLoadingShareModel] = React.useState(false);
  const [listFiltered, setListFiltered] = React.useState([]);
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { persons } = person;

  const teamsList = React.useMemo(
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
        [`${PREFIX}grupopermissao`]: {
          label: 'Grupo Permissão',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            showSearch: true,
            listValues: [
              {
                value: EGroups.PLANEJAMENTO,
                title: EGroups.PLANEJAMENTO,
              },
              {
                value: EGroups.ADMISSOES,
                title: EGroups.ADMISSOES,
              },
            ],
          },
        },
        [`_${PREFIX}criadopor_value`]: {
          label: 'Criado Por',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            showSearch: true,
            listValues: persons,
          },
        },
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
        [`${PREFIX}publicado`]: {
          label: 'Publicado',
          type: 'boolean',
        },
      },
    }),
    [temperatureOptions, modalityOptions, persons]
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
    handleSort(sortBy, false);
  }, [teamsList]);

  const handleClose = () => {
    setVisible(false);
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
    setVisible(true);
    handleCloseAnchor();
  };

  const updateAll = () => {
    refetchSchedule?.();
    refetch?.();
  };

  const handleShareClick = () => {
    if (
      currentUser?.isPlanning ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
        itemSelected?.[`${PREFIX}Turma_Compartilhamento`]?.some(
          (comp) =>
            comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
        )
      ) ||
      currentUser?.[`${PREFIX}pessoaid`] ===
        itemSelected?.[`_${PREFIX}criadopor_value`]
    ) {
      setOpenShareModel(true);
    } else {
      notification.error({
        title: 'Ação Inválida',
        description: 'Você não possui permissão para compartilhar esse modelo',
      });
    }
    handleCloseAnchor();
  };

  const handleShareModel = (items: any[]) => {
    setLoadingShareModel(true);
    const batch = new BatchMultidata(api);
    const itemsToDelete = itemSelected?.[
      `${PREFIX}Turma_Compartilhamento`
    ]?.filter(
      (e) => !items?.some((sp) => sp.value === e?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkPostReferenceRelatioship(
      TEAM,
      TAG,
      itemSelected?.[`${PREFIX}turmaid`],
      'Turma_Compartilhamento',
      items?.map((it) => it?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkDeleteReferenceParent(
      TEAM,
      itemsToDelete?.map((it) => it?.[`${PREFIX}etiquetaid`]),
      itemSelected?.[`${PREFIX}turmaid`],
      'Turma_Compartilhamento'
    );

    batch
      .execute()
      .then(() => {
        refetch();
        setLoadingShareModel(false);
        setOpenShareModel(false);
        notification.success({
          title: 'Sucesso',
          description: 'Compartilhamento realizado com sucesso!',
        });
      })
      .catch((err) => {
        setLoadingShareModel(false);
        notification.error({
          title: 'Falha',
          description: 'Ocorreu um erro, Tente novamente mais tarde',
        });
      });
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
              setTeamChoosed(null);
            },
            onError: () => setItemSelected(null),
          })
        );
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
      const filteredData = teamsList.filter((item) => jsonLogic.apply(logic, item));
      setListFiltered(filteredData);
    } else {
      setListFiltered(teamsList);
    }
    setFilterDrawer(false);
  };

  const handleSort = (field = sortBy, changeDirection = true) => {
    let direction = sort;

    if (changeDirection) {
      direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
    }

    const newList = teamsList?.sort((a, b) => {
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

  return (
    <>
      <FilterDrawer
        queryQB={query}
        configQB={config}
        setQuery={setQuery}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
        onClose={() => setFilterDrawer(false)}
        open={filterDrawer}
      />

      <AddTeam
        isModel
        refetch={updateAll}
        context={context}
        open={visible}
        team={itemSelected}
        setTeam={(it) => setItemSelected(it)}
        teamLength={teams?.length}
        handleClose={handleClose}
      />

      <ShareModel
        open={openShareModel}
        loading={loadingShareModel}
        currentValue={itemSelected?.[`${PREFIX}Turma_Compartilhamento`]}
        handleShare={handleShareModel}
        onClose={() => setOpenShareModel(false)}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Title>Modelos</Title>
          <Tooltip arrow title='Novo Modelo'>
            <AddButton
              variant='contained'
              color='primary'
              onClick={() => setVisible(true)}
            >
              <Add />
            </AddButton>
          </Tooltip>
        </Box>

        <Box display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center' style={{ gap: '10px' }}>
            <Button
              variant='outlined'
              size='small'
              endIcon={
                sortBy === `${PREFIX}titulo` ? (
                  sort === 'asc' ? (
                    <ArrowUpward fontSize='small' />
                  ) : (
                    <ArrowDownward fontSize='small' />
                  )
                ) : null
              }
              onClick={() => handleSort(`${PREFIX}titulo`)}
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
          <Box display='flex'>
            {loading ? <CircularProgress size={20} color='primary' /> : null}
            <IconButton onClick={() => setFilterDrawer(true)}>
              <FilterList />
            </IconButton>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}
        >
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem onClick={handleShareClick}>Compartilhar</MenuItem>
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
              {listFiltered?.map((item) => (
                <StyledCard
                  key={item?.[`${PREFIX}turmaid`]}
                  active={
                    teamChoosed?.[`${PREFIX}turmaid`] ===
                    item?.[`${PREFIX}turmaid`]
                  }
                  elevation={3}
                >
                  <StyledHeaderCard
                    action={
                      <Tooltip arrow title='Ações'>
                        <StyledIconButton
                          aria-label='settings'
                          onClick={(event) => handleOption(event, item)}
                        >
                          <MoreVert />
                        </StyledIconButton>
                      </Tooltip>
                    }
                    title={
                      <Tooltip
                        arrow
                        title={item?.[`${PREFIX}titulo`] || 'Sem informações'}
                      >
                        <Box
                          display='flex'
                          alignItems='center'
                          style={{ gap: '10px' }}
                        >
                          {item?.[`${PREFIX}publicado`] ? (
                            <Public fontSize='small' />
                          ) : null}
                          <TitleCard onClick={() => handleSchedule(item)}>
                            {item?.[`${PREFIX}titulo`]}
                          </TitleCard>
                        </Box>
                      </Tooltip>
                    }
                  />
                  <StyledContentCard onClick={() => handleSchedule(item)}>
                    <Divider />
                    <Typography variant='body1'>
                      {item?.[`${PREFIX}sigla`]}
                    </Typography>
                  </StyledContentCard>
                </StyledCard>
              ))}
            </>
          ) : (
            <Typography variant='body1'>Nenhum modelo cadastrado</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListModels;
