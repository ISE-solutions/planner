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
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ACTIVITY, PREFIX, TAG } from '~/config/database';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
  Public,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import AddActivity from './AddActivity';
import { ShareModel } from '~/components';
import { useConfirmation, useNotification } from '~/hooks';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import {
  deleteActivity,
  getActivityPermitions,
  updateActivity,
} from '~/store/modules/activity/actions';
import { EFatherTag, EGroups } from '~/config/enums';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';

interface IListModels {
  modelChoosed: any;
  refetch: any;
  currentUser: any;
  loading: boolean;
  models: any[];
  filter: any;
  setFilter: React.Dispatch<any>;
  setSearch: any;
  handleSaveActivity: (item: any, onSuccess: any) => void;
  handleActivity: (actv: any) => any;
}

const ListModels: React.FC<IListModels> = ({
  loading,
  currentUser,
  models,
  refetch,
  modelChoosed,
  setSearch,
  handleSaveActivity,
  handleActivity,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [openShareModel, setOpenShareModel] = React.useState(false);
  const [loadingShareModel, setLoadingShareModel] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [tagsShared, setTagsShared] = React.useState([]);
  const [listFiltered, setListFiltered] = React.useState([]);
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { persons } = person;

  const areaOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.AREA_ACADEMICA
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
          label: 'Nome da Atividade',
          type: 'text',
        },
        subject: {
          label: 'Tema',
          type: 'text',
        },
        [`${PREFIX}quantidadesessao`]: {
          label: 'Quantidade de Sessões',
          type: 'number',
        },
        [`${PREFIX}AreaAcademica`]: {
          label: 'Área Acadêmica',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: areaOptions,
              },
            },
          },
        },
        [`${PREFIX}Atividade_Documento`]: {
          label: 'Documentos',
          type: '!group',
          subfields: {
            [`${PREFIX}nome`]: {
              label: 'Nome',
              type: 'text',
            },
          },
        },
        [`${PREFIX}RequisicaoAcademica_Atividade`]: {
          label: 'Requisição Acadêmica',
          type: '!group',
          subfields: {
            [`${PREFIX}descricao`]: {
              label: 'Descrição',
              type: 'text',
            },
          },
        },
        [`${PREFIX}publicado`]: {
          label: 'Publicado',
          type: 'boolean',
        },
      },
    }),
    [areaOptions, persons]
  );

  const activitiesList = React.useMemo(
    () =>
      models?.map((m) => ({
        ...m,
        title: m?.[`${PREFIX}titulo`]?.toLocaleUpperCase(),
        name: m?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
        subject: m?.[`${PREFIX}temaaula`]?.toLocaleUpperCase(),
      })),
    [models]
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
  }, [activitiesList]);

  const handleClose = () => {
    setVisible(false);
    refetch?.();
  };

  const handleOption = (event, item) => {
    if (itemSelected) {
      updateActivity(
        itemSelected?.[`${PREFIX}atividadeid`],
        {
          [`${PREFIX}Editanto@odata.bind`]: null,
          [`${PREFIX}datahoraeditanto`]: null,
        },
        {
          onSuccess: () => {},
          onError: () => null,
        }
      );
    }
    setItemSelected(item);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleShareClick = () => {
    getActivityPermitions(itemSelected?.[`${PREFIX}atividadeid`]).then(
      ({ value }) => {
        const actv = value[0];
        setTagsShared(actv?.[`${PREFIX}Atividade_Compartilhamento`]);
        if (
          currentUser?.isPlanning ||
          currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
            actv?.[`${PREFIX}Atividade_Compartilhamento`]?.some(
              (comp) =>
                comp?.[`${PREFIX}etiquetaid`] === cUser?.[`${PREFIX}etiquetaid`]
            )
          ) ||
          currentUser?.[`${PREFIX}pessoaid`] ===
            actv?.[`_${PREFIX}criadopor_value`]
        ) {
          setOpenShareModel(true);
        } else {
          notification.error({
            title: 'Ação Inválida',
            description:
              'Você não possui permissão para compartilhar esse modelo',
          });
        }
      }
    );

    handleCloseAnchor();
  };

  const handleShareModel = (items: any[]) => {
    setLoadingShareModel(true);
    const batch = new BatchMultidata(api);
    const itemsToDelete = itemSelected?.[
      `${PREFIX}Atividade_Compartilhamento`
    ]?.filter(
      (e) => !items?.some((sp) => sp.value === e?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkPostReferenceRelatioship(
      ACTIVITY,
      TAG,
      itemSelected?.[`${PREFIX}atividadeid`],
      'Atividade_Compartilhamento',
      items?.map((it) => it?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkDeleteReferenceParent(
      ACTIVITY,
      itemsToDelete?.map((it) => it?.[`${PREFIX}etiquetaid`]),
      itemSelected?.[`${PREFIX}atividadeid`],
      'Atividade_Compartilhamento'
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

  const handleDeleteActivity = () => {
    handleCloseAnchor();
    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir a Atividade ${
        itemSelected?.[`${PREFIX}nome`]
      }?`,
      onConfirm: () => {
        dispatch(
          deleteActivity(
            { id: itemSelected[`${PREFIX}atividadeid`] },
            {
              onSuccess: () => {
                refetch();
                setItemSelected(null);
              },
              onError: () => setItemSelected(null),
            }
          )
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
      const filteredData = activitiesList.filter((item) =>
        jsonLogic.apply(logic, item)
      );
      setListFiltered(filteredData);
    } else {
      setListFiltered(activitiesList);
    }
    setFilterDrawer(false);
  };

  const handleSort = (field = sortBy, changeDirection = true) => {
    let direction = sort;

    if (changeDirection) {
      direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
    }

    const newList = activitiesList?.sort((a, b) => {
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
      <AddActivity
        open={visible}
        handleClose={handleClose}
        handleSaveActivity={handleSaveActivity}
      />

      <FilterDrawer
        queryQB={query}
        configQB={config}
        setQuery={setQuery}
        clearFilter={clearFilter}
        applyFilter={applyFilter}
        onClose={() => setFilterDrawer(false)}
        open={filterDrawer}
      />

      <ShareModel
        open={openShareModel}
        loading={loadingShareModel}
        currentValue={tagsShared}
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
          <MenuItem onClick={handleShareClick}>Compartilhar</MenuItem>
          <MenuItem onClick={handleDeleteActivity}>Excluir</MenuItem>
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
                  key={item?.[`${PREFIX}atividadeid`]}
                  active={
                    modelChoosed?.[`${PREFIX}atividadeid`] ===
                    item?.[`${PREFIX}atividadeid`]
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
                          <TitleCard onClick={() => handleActivity(item)}>
                            {item?.[`${PREFIX}titulo`]}
                          </TitleCard>
                        </Box>
                      </Tooltip>
                    }
                  />
                  <StyledContentCard onClick={() => handleActivity(item)}>
                    <Divider />
                    <Typography variant='body1'>
                      {item?.[`${PREFIX}nome`]}
                    </Typography>
                    <Typography variant='body2'>
                      {item?.[`${PREFIX}CriadoPor`]?.[`${PREFIX}nomecompleto`]}
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
