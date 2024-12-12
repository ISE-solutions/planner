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
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PREFIX, SCHEDULE_DAY, TAG } from '~/config/database';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  ExpandMore,
  FilterList,
  MoreVert,
  Public,
} from '@material-ui/icons';
import ScheduleDayForm from '~/components/ScheduleDayForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { ShareModel } from '~/components';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { useConfirmation, useNotification } from '~/hooks';
import { deleteSchedule } from '~/store/modules/schedule/actions';
import * as moment from 'moment';
import { EFatherTag, EGroups } from '~/config/enums';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';

interface IListModels {
  scheduleChoosed: any;
  currentUser: any;
  schedule: any[];
  loading: boolean;
  canEdit: boolean;
  filter: any;
  setFilter: React.Dispatch<any>;
  context: WebPartContext;
  refetch: any;
  handleSchedule: (schedule: any) => any;
}

const ListModels: React.FC<IListModels> = ({
  context,
  canEdit,
  currentUser,
  schedule,
  loading,
  scheduleChoosed,
  refetch,
  filter,
  setFilter,
  handleSchedule,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [openShareModel, setOpenShareModel] = React.useState(false);
  const [loadingShareModel, setLoadingShareModel] = React.useState(false);
  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [listFiltered, setListFiltered] = React.useState([]);
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { persons } = person;

  const scheduleList = React.useMemo(
    () =>
      schedule?.map((m) => ({
        ...m,
        title: m?.[`${PREFIX}titulo`]?.toLocaleUpperCase(),
        name: m?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
      })),
    [schedule]
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
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.MODALIDADE_DIA
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
        names: {
          label: 'Nome',
          type: 'text',
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
    handleSort(sortBy, false);
  }, [scheduleList]);

  React.useEffect(() => {
    refetch();
  }, []);

  const handleClose = () => {
    setVisible(false);
    refetch();
    setItemSelected(null);
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

  const handleSearch = (e) => {
    setFilter({
      ...filter,
      searchQuery: e.target.value,
    });
  };

  const handleShareClick = () => {
    if (
      currentUser?.isPlanning ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
        itemSelected?.[`${PREFIX}Compartilhamento`]?.some(
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
    const itemsToDelete = itemSelected?.[`${PREFIX}Compartilhamento`]?.filter(
      (e) => !items?.some((sp) => sp.value === e?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkPostReferenceRelatioship(
      SCHEDULE_DAY,
      TAG,
      itemSelected?.[`${PREFIX}cronogramadediaid`],
      'Compartilhamento',
      items?.map((it) => it?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkDeleteReferenceParent(
      SCHEDULE_DAY,
      itemsToDelete?.map((it) => it?.[`${PREFIX}etiquetaid`]),
      itemSelected?.[`${PREFIX}cronogramadediaid`],
      'Compartilhamento'
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

  const handleDeleteSchedule = () => {
    handleCloseAnchor();

    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir o dia ${moment(
        itemSelected?.[`${PREFIX}data`]
      ).format('DD/MM')}?`,
      onConfirm: () => {
        dispatch(
          deleteSchedule(itemSelected[`${PREFIX}cronogramadediaid`], [], {
            onSuccess: refetch,
            onError: () => null,
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
      const filteredData = scheduleList.filter((item) =>
        jsonLogic.apply(logic, item)
      );
      setListFiltered(filteredData);
    } else {
      setListFiltered(scheduleList);
    }
    setFilterDrawer(false);
  };

  const handleSort = (field = sortBy, changeDirection = true) => {
    let direction = sort;

    if (changeDirection) {
      direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
    }

    const newList = scheduleList?.sort((a, b) => {
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

      <ScheduleDayForm
        isModel
        isScheduleModel
        isGroup
        visible={visible}
        schedule={itemSelected}
        setSchedule={(sch) => setItemSelected(sch)}
        context={context}
        handleClose={handleClose}
      />

      <ShareModel
        open={openShareModel}
        loading={loadingShareModel}
        currentValue={itemSelected?.[`${PREFIX}Compartilhamento`]}
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
          <MenuItem onClick={handleDeleteSchedule}>Excluir</MenuItem>
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
              {listFiltered
                ?.map((schedule) => (
                  <StyledCard
                    key={schedule?.[`${PREFIX}cronogramadediaid`]}
                    active={
                      scheduleChoosed?.[`${PREFIX}cronogramadediaid`] ===
                      schedule?.[`${PREFIX}cronogramadediaid`]
                    }
                    elevation={3}
                  >
                    <StyledHeaderCard
                      action={
                        <Tooltip arrow title='Ações'>
                          <StyledIconButton
                            aria-label='settings'
                            onClick={(event) => handleOption(event, schedule)}
                          >
                            <MoreVert />
                          </StyledIconButton>
                        </Tooltip>
                      }
                      title={
                        <Tooltip
                          arrow
                          title={
                            schedule?.[`${PREFIX}nome`] || 'Sem informações'
                          }
                        >
                          <Box
                            display='flex'
                            alignItems='center'
                            style={{ gap: '10px' }}
                          >
                            {schedule?.[`${PREFIX}publicado`] ? (
                              <Public fontSize='small' />
                            ) : null}
                            <TitleCard onClick={() => handleSchedule(schedule)}>
                              {schedule?.[`${PREFIX}nome`]}
                            </TitleCard>
                          </Box>
                        </Tooltip>
                      }
                    />
                    <StyledContentCard onClick={() => handleSchedule(schedule)}>
                      <Divider />
                      <Typography variant='body1'>
                        {schedule?.[`${PREFIX}Modulo`]?.[`${PREFIX}nome`]}
                      </Typography>
                      <Typography variant='body2'>
                        {schedule?.[`${PREFIX}Modalidade`]?.[`${PREFIX}nome`]}
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
