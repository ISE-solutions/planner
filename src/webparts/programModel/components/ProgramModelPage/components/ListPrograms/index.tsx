import * as React from 'react';
import * as _ from 'lodash';
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
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
  Public,
} from '@material-ui/icons';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from './styles';
import AddProgram from '~/components/AddProgram';
import { AddButton } from '../../styles';
import { useConfirmation, useNotification, useProgram } from '~/hooks';
import { PREFIX, PROGRAM, TAG } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { ShareModel } from '~/components';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { deleteProgram } from '~/store/modules/program/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag, EGroups, ETypeTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';

interface IListPrograms {
  programChoosed: any;
  currentUser: any;
  context: WebPartContext;
  handleProgram: (program: any) => any;
  setProgramChoosed: (program: any) => any;
}

const ListPrograms: React.FC<IListPrograms> = ({
  context,
  currentUser,
  programChoosed,
  handleProgram,
  setProgramChoosed,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [openShareModel, setOpenShareModel] = React.useState(false);
  const [loadingShareModel, setLoadingShareModel] = React.useState(false);
  const [listFiltered, setListFiltered] = React.useState([]);
  const [filter, setFilter] = React.useState<any>({
    active: 'Ativo',
    searchQuery: '',
    model: true,
  });
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const [{ programs, loading, refetch }] = useProgram(filter, context);

  const programList = React.useMemo(
    () =>
      programs?.map((m) => ({
        ...m,
        sigla: m?.[`${PREFIX}sigla`]?.toLocaleUpperCase(),
      })),
    [programs]
  );

  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { persons } = person;

  const typeProgramOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_PROGRAMA
        )
      ),
    [tags]
  );

  const nameProgramOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.NOME_PROGRAMA
        )
      ),
    [tags]
  );

  const instituteOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.INSTITUTO
        )
      ),
    [tags]
  );

  const companyOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.EMPRESA
        )
      ),
    [tags]
  );

  const responsabileOptions = React.useMemo(
    () =>
      persons?.filter((tag) =>
        tag?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
          (tag) => tag?.[`${PREFIX}nome`] == ETypeTag.PROPRIETARIO
        )
      ),
    [persons]
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
        sigla: {
          label: 'Sigla',
          type: 'text',
        },
        [`${PREFIX}NomePrograma`]: {
          label: 'Nome Programa',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: nameProgramOptions,
              },
            },
          },
        },
        [`${PREFIX}TipoPrograma`]: {
          label: 'Tipo Programa',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: typeProgramOptions,
              },
            },
          },
        },
        [`${PREFIX}Instituto`]: {
          label: 'Instituto',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: instituteOptions,
              },
            },
          },
        },
        [`${PREFIX}Empresa`]: {
          label: 'Empresa',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: companyOptions,
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
        [`${PREFIX}Programa_PessoasEnvolvidas`]: {
          label: 'Responsável pelo Programa',
          type: '!group',
          subfields: {
            [`_${PREFIX}pessoa_value`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: responsabileOptions,
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
    [responsabileOptions, companyOptions, instituteOptions, typeProgramOptions]
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
  }, [programList]);

  const handleClose = () => {
    setOpenAddProgram(false);
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
    setOpenAddProgram(true);
    handleCloseAnchor();
  };

  const handleShareClick = () => {
    if (
      currentUser?.isPlanning ||
      currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some((cUser) =>
        itemSelected?.[`${PREFIX}Programa_Compartilhamento`]?.some(
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

  const handleDeleteProgram = () => {
    handleCloseAnchor();
    confirmation.openConfirmation({
      title: 'Confirmação da ação',
      description: `Tem certeza que deseja excluir o Programa ${
        itemSelected?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]
      }?`,
      onConfirm: () => {
        dispatch(
          deleteProgram(itemSelected[`${PREFIX}programaid`], {
            onSuccess: () => {
              refetch();
              setItemSelected(null);
              setProgramChoosed(null);
            },
            onError: () => setItemSelected(null),
          })
        );
      },
    });
  };

  const handleShareModel = (items: any[]) => {
    setLoadingShareModel(true);
    const batch = new BatchMultidata(api);
    const itemsToDelete = itemSelected?.[
      `${PREFIX}Programa_Compartilhamento`
    ]?.filter(
      (e) => !items?.some((sp) => sp.value === e?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkPostReferenceRelatioship(
      PROGRAM,
      TAG,
      itemSelected?.[`${PREFIX}programaid`],
      'Programa_Compartilhamento',
      items?.map((it) => it?.[`${PREFIX}etiquetaid`])
    );

    batch.bulkDeleteReferenceParent(
      PROGRAM,
      itemsToDelete?.map((it) => it?.[`${PREFIX}etiquetaid`]),
      itemSelected?.[`${PREFIX}programaid`],
      'Programa_Compartilhamento'
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
      const filteredData = programList.filter((item) =>
        jsonLogic.apply(logic, item)
      );
      setListFiltered(filteredData);
    } else {
      setListFiltered(programList);
    }
    setFilterDrawer(false);
  };

  const handleSort = (field = sortBy, changeDirection = true) => {
    let direction = sort;

    if (changeDirection) {
      direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
    }

    const newList = programList?.sort((a, b) => {
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

      <AddProgram
        isModel
        context={context}
        program={itemSelected}
        open={openAddProgram}
        setProgram={setItemSelected}
        handleClose={handleClose}
        refetchProgram={refetch}
      />

      <ShareModel
        open={openShareModel}
        loading={loadingShareModel}
        currentValue={itemSelected?.[`${PREFIX}Programa_Compartilhamento`]}
        handleShare={handleShareModel}
        onClose={() => setOpenShareModel(false)}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Title>Modelos</Title>
          <Tooltip arrow title='Novo Programa'>
            <AddButton
              variant='contained'
              color='primary'
              onClick={() => setOpenAddProgram(true)}
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
                sortBy === `${PREFIX}NomePrograma.${PREFIX}nome` ? (
                  sort === 'asc' ? (
                    <ArrowUpward fontSize='small' />
                  ) : (
                    <ArrowDownward fontSize='small' />
                  )
                ) : null
              }
              onClick={() => handleSort(`${PREFIX}NomePrograma.${PREFIX}nome`)}
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
          <MenuItem onClick={handleDeleteProgram}>Excluir</MenuItem>
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
              {listFiltered?.map((program) => (
                <StyledCard
                  key={program?.[`${PREFIX}programaid`]}
                  active={
                    programChoosed?.[`${PREFIX}programaid`] ===
                    program?.[`${PREFIX}programaid`]
                  }
                  elevation={3}
                >
                  <StyledHeaderCard
                    action={
                      <Tooltip arrow title='Ações'>
                        <StyledIconButton
                          aria-label='settings'
                          onClick={(event) => handleOption(event, program)}
                        >
                          <MoreVert />
                        </StyledIconButton>
                      </Tooltip>
                    }
                    title={
                      <Tooltip
                        arrow
                        title={
                          program?.[`${PREFIX}titulo`] || 'Sem informações'
                        }
                      >
                        <Box
                          display='flex'
                          alignItems='center'
                          style={{ gap: '10px' }}
                        >
                          {program?.[`${PREFIX}publicado`] ? (
                            <Public fontSize='small' />
                          ) : null}
                          <TitleCard onClick={() => handleProgram(program)}>
                            {program?.[`${PREFIX}titulo`]}
                          </TitleCard>
                        </Box>
                      </Tooltip>
                    }
                  />
                  <StyledContentCard onClick={() => handleProgram(program)}>
                    <Divider />
                    <Typography variant='body1'>
                      {program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]}
                    </Typography>
                    <Typography variant='body2'>
                      {program?.[`${PREFIX}Empresa`]?.[`${PREFIX}nome`]}
                    </Typography>
                  </StyledContentCard>
                </StyledCard>
              ))}
            </>
          ) : (
            <Typography variant='body1'>Nenhum programa cadastrado</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ListPrograms;
