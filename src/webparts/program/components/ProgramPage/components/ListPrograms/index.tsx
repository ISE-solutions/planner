import * as React from 'react';
import * as _ from 'lodash';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  FilterList,
  MoreVert,
  Search,
} from '@material-ui/icons';
import AddProgram from '~/components/AddProgram';
import { useDebounce } from 'use-debounce';
import { AddButton } from '../../styles';
import { useConfirmation, useNotification } from '~/hooks';
import {
  StyledCard,
  StyledContentCard,
  StyledHeaderCard,
  StyledIconButton,
  Title,
  TitleCard,
} from '~/components/CustomCard';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  deleteProgram,
  fetchAllPrograms,
} from '~/store/modules/program/actions';
import { TYPE_PROGRAM_FILTER } from '~/store/modules/program/utils';
import { ToggleButtonGroup } from '@material-ui/lab';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { StyledToggleButton } from './styles';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { deleteByProgram } from '~/store/modules/resource/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';

interface IListPrograms {
  programChoosed: any;
  currentUser: any;
  context: WebPartContext;
  setFilter: any;
  filter: any;
  refetch: (ftr?: any) => void;
  handleProgram: (program: any) => any;
}

const ListPrograms: React.FC<IListPrograms> = ({
  context,
  refetch,
  filter,
  setFilter,
  currentUser,
  programChoosed,
  handleProgram,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [itemSelected, setItemSelected] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState('asc');
  const [sortBy, setSortBy] = React.useState('');

  const [valueSearch] = useDebounce<string>(search, 300);

  const [filterDrawer, setFilterDrawer] = React.useState(false);
  const [modelName, setModelName] = React.useState({
    open: false,
    loadSpaces: true,
    loadPerson: true,
    name: '',
    error: '',
  });

  const [openAddProgram, setOpenAddProgram] = React.useState(false);
  const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
  const [listFiltered, setListFiltered] = React.useState([]);

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();
  const dispatch = useDispatch();

  const { tag, person, program } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { dictPeople, personsActive } = person;
  const { programs, loading } = program;

  const programList = React.useMemo(
    () =>
      programs?.map((m) => ({
        ...m,
        sigla: m?.[`${PREFIX}sigla`]?.toLocaleUpperCase(),
      })),
    [programs]
  );

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
      personsActive?.filter((tag) =>
        tag?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
          (tag) => tag?.[`${PREFIX}nome`] == ETypeTag.PROPRIETARIO
        )
      ),
    [personsActive]
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

  React.useEffect(() => {
    setListFiltered(
      programList?.filter(
        (program) =>
          program?.[`${PREFIX}NomePrograma`]?.[`${PREFIX}nome`]
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase()) ||
          program?.[`${PREFIX}sigla`]
            ?.toLowerCase()
            .includes(valueSearch.toLowerCase())
      )
    );
  }, [valueSearch]);

  React.useEffect(() => {
    refetch();
  }, []);

  const handleClose = () => {
    setOpenAddProgram(false);
    setItemSelected(null);

    dispatch(fetchAllPrograms(filter));
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
          Origem: TYPE_ORIGIN_MODEL.PROGRAMA,
          Nome: modelName.name,
          ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
          ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
          IDOrigem: itemSelected[`${PREFIX}programaid`],
          IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
        },
        {
          onSuccess: () => {
            handleCloseAnchor();
            setIsLoadingSaveModel(false);
            setItemSelected(null);
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
            },
            onError: () => setItemSelected(null),
          })
        );
        dispatch(deleteByProgram(itemSelected[`${PREFIX}programaid`]));
      },
    });
  };

  const handleToggle = (event, nextType) => {
    const newFilter = { ...filter, type: nextType };

    setFilter(newFilter);
    refetch(newFilter);
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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const isProgramResponsible = React.useMemo(() => {
    if (dictPeople && dictTag) {
      return itemSelected?.[`${PREFIX}Programa_PessoasEnvolvidas`].some(
        (envol) => {
          const func = dictTag?.[envol?.[`_${PREFIX}funcao_value`]];
          const envolPerson = dictPeople?.[envol?.[`_${PREFIX}pessoa_value`]];

          if (
            func?.[`${PREFIX}nome`] === EFatherTag.RESPONSAVEL_PELO_PROGRAMA
          ) {
            return (
              currentUser?.[`${PREFIX}pessoaid`] ===
              envolPerson?.[`${PREFIX}pessoaid`]
            );
          }

          return false;
        }
      );
    }
  }, [currentUser, itemSelected, dictPeople]);

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
        context={context}
        isDraft={
          itemSelected?.[`${PREFIX}Temperatura`]?.[`${PREFIX}nome`] ===
          EFatherTag.RASCUNHO
        }
        isProgramResponsible={isProgramResponsible}
        program={itemSelected}
        open={openAddProgram}
        refetchProgram={refetch}
        setProgram={setItemSelected}
        handleClose={handleClose}
      />

      <Box display='flex' flexDirection='column' style={{ gap: '1rem' }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Title>Programas</Title>
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

        <Box display='flex' flexDirection='column' style={{ gap: '10px' }}>
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
                  sortBy === `${PREFIX}NomePrograma.${PREFIX}nome` ? (
                    sort === 'asc' ? (
                      <ArrowUpward fontSize='small' />
                    ) : (
                      <ArrowDownward fontSize='small' />
                    )
                  ) : null
                }
                onClick={() =>
                  handleSort(`${PREFIX}NomePrograma.${PREFIX}nome`)
                }
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

          <Box>
            <ToggleButtonGroup
              orientation='horizontal'
              exclusive
              value={filter.type}
              onChange={handleToggle}
            >
              <StyledToggleButton value={TYPE_PROGRAM_FILTER.PROGRAMA}>
                Programa
              </StyledToggleButton>
              <StyledToggleButton value={TYPE_PROGRAM_FILTER.RESERVA}>
                Evento Interno
              </StyledToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />
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
          <MenuItem onClick={handleDetail}>Detalhar</MenuItem>
          <MenuItem onClick={() => !isLoadingSaveModel && handleToSaveModel()}>
            <Box display='flex' style={{ gap: '10px' }}>
              {isLoadingSaveModel ? (
                <CircularProgress size={20} color='primary' />
              ) : null}
              Salvar como modelo
            </Box>
          </MenuItem>
          <MenuItem onClick={handleDeleteProgram}>Excluir</MenuItem>
        </Menu>

        <Box
          display='flex'
          flexDirection='column'
          overflow='auto'
          maxHeight='calc(100vh - 20rem)'
          paddingBottom='10px'
          margin='0 -5px'
          style={{ gap: '1rem' }}
        >
          {listFiltered?.length ? (
            <>
              {listFiltered?.map((program) => {
                const temperature = temperatureColor(program);
                return (
                  <StyledCard
                    key={program?.[`${PREFIX}programaid`]}
                    background={temperature.background}
                    color={temperature.color}
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
                        <Tooltip arrow title={program?.[`${PREFIX}sigla`]}>
                          <TitleCard onClick={() => handleProgram(program)}>
                            {program?.[`${PREFIX}sigla`]}
                          </TitleCard>
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
                );
              })}
            </>
          ) : (
            <Typography variant='body1'>Nenhum programa cadastrado</Typography>
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
          {/* <FormControl style={{ marginTop: '1rem' }} component='fieldset'>
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
          </FormControl> */}
        </DialogContent>
        <DialogActions>
          <Button color='primary' onClick={handleCloseSaveModel}>
            Cancelar
          </Button>
          <Button onClick={saveAsModel} variant='contained' color='primary'>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListPrograms;
