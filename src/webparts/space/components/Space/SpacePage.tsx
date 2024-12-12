import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip, Badge } from '@material-ui/core';
import {
  Add,
  Delete,
  Edit,
  FilterList,
  Info,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useNotification, useLoggedUser, useConfirmation } from '~/hooks';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PREFIX } from '~/config/database';
import { AddSpace, DontHasPermition } from '~/components';
import { AppState } from '~/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  activeSpace,
  deleteSpace,
  fetchAllSpace,
} from '~/store/modules/space/actions';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag, ETypeTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';

const SpacePage: React.FC<{ context: WebPartContext }> = ({ context }) => {
  const { currentUser } = useLoggedUser();
  const dispatch = useDispatch();

  const [form, setForm] = React.useState<any>({ open: false });
  const [detail, setDetail] = React.useState<any>({ open: false });
  const [bulkEdit, setBulkEdit] = React.useState<any>({ open: false });
  const [desactive, setDesactive] = React.useState<any>({ open: false });
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<any[]>([]);
  const { tag, person } = useSelector((state: AppState) => state);
  const { tags } = tag;
  const { personsActive } = person;

  const ownerOptions = React.useMemo(
    () =>
      personsActive?.filter((tag) =>
        tag?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
          (tag) => tag?.[`${PREFIX}nome`] == ETypeTag.PROPRIETARIO
        )
      ),
    [personsActive]
  );

  const typeSpaceOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.TIPO_ESPACO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const config: Config = React.useMemo(
    () => ({
      ...FILTER_CONFIG_DEFAULT,
      fields: {
        name: {
          label: 'Nome',
          type: 'text',
        },
        [`${PREFIX}Proprietario`]: {
          label: 'Proprietário',
          type: '!struct',
          subfields: {
            [`${PREFIX}pessoaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: ownerOptions,
              },
            },
          },
        },
        [`${PREFIX}Espaco_Etiqueta_Etiqueta`]: {
          label: 'Etiqueta (s)',
          type: '!group',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: typeSpaceOptions,
              },
            },
          },
        },
        [`${PREFIX}Espaco_CapacidadeEspaco`]: {
          label: 'Capacidade',
          type: '!group',
          subfields: {
            [`${PREFIX}quantidade`]: {
              label: 'Quantidade',
              type: 'number',
            },
          },
        },
        [`${PREFIX}ativo`]: {
          label: 'Ativo',
          type: 'boolean',
        },
      },
    }),
    [ownerOptions, typeSpaceOptions]
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
    refetch();
  }, []);

  const { spaces } = useSelector((state: AppState) => state.space);

  const refTable = React.useRef<any>();
  const { confirmation } = useConfirmation();
  const { notification } = useNotification();

  const columns = [
    {
      name: `${PREFIX}nome`,
      label: 'Nome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}email`,
      label: 'E-mail',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { minWidth: '9rem' } }),
      },
    },
    {
      name: `${PREFIX}Proprietario.${PREFIX}nomecompleto`,
      label: 'Proprietário',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { minWidth: '9rem' } }),
      },
    },
    {
      name: 'tags',
      label: 'Etiqueta(s)',
      options: {
        filter: true,
        sort: true,
        setCellProps: () => ({ style: { minWidth: '9rem' } }),
      },
    },
    {
      name: `${PREFIX}ativo`,
      label: 'Status',
      options: {
        filter: false,
        display: false,
        viewColumns: false,
      },
    },
    {
      name: 'actions',
      label: 'Ações',
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => ({ align: 'center' }),
        setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
      },
    },
  ];

  const data = React.useMemo(() => {
    const newSpaces = spaces?.map((space) => ({
      ...space,
      name: space?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
      tags: space?.[`${PREFIX}Espaco_Etiqueta_Etiqueta`]
        ?.map((e) => e?.[`${PREFIX}nome`])
        ?.join(', '),
      actions: (
        <Grid>
          <Tooltip arrow title='Detalhes'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDetail(space)}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title='Editar'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleEdit(space)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          {space?.[`${PREFIX}ativo`] ? (
            <Tooltip arrow title='Desativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleDesactive(space)}
              >
                <VisibilityOff />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title='Ativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleActive(space)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title='Excluir'>
            <IconButton onClick={() => handleDelete(space)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));

    setListFiltered(
      newSpaces?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
    );

    return newSpaces;
  }, [spaces]);

  const refetch = () => {
    dispatch(
      fetchAllSpace({
        searchQuery: '',
      })
    );
  };

  const handleSuccess = () => {
    refetch();
    notification.success({
      title: 'Sucesso',
      description: 'Ativado com sucesso',
    });
  };

  const handleError = (error) => {
    notification.error({
      title: 'Falha',
      description: error?.data?.error?.message,
    });
  };

  const handleEdit = (item) => {
    setForm({
      open: true,
      item,
    });
  };

  const handleDesactive = (item) => {
    setDesactive({
      open: true,
      item,
    });
  };

  const handleActive = (item) => {
    dispatch(
      activeSpace(item, { onSuccess: handleSuccess, onError: handleError })
    );
  };

  const handleDelete = (item) => {
    confirmation.openConfirmation({
      title: 'Deseja relmente excluir o espaço?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () =>
        dispatch(
          deleteSpace(
            { id: item?.[`${PREFIX}espacoid`] },
            {
              onSuccess: () => {
                refetch();
                notification.success({
                  title: 'Sucesso',
                  description: 'Excluído com sucesso',
                });
              },
              onError: handleError,
            }
          )
        ),
    });
  };

  const handleDetail = (item) => {
    setDetail({
      open: true,
      item,
    });
  };

  const customToolbarSelect = (selectedRows) => {
    const itemsSelected = [];

    selectedRows.data.forEach((row) => {
      itemsSelected.push(spaces[row.index]);
    });

    return (
      <div>
        <Tooltip arrow title='Editar Selectionado(s)'>
          <IconButton
            onClick={() => setBulkEdit({ open: true, items: itemsSelected })}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const setRowProps = (row) => {
    if (!row[4]) {
      return {
        style: { background: '#f09b95' },
      };
    }
  };

  const customToolbar = () => (
    <>
      <Tooltip disableFocusListener arrow title='Filtro'>
        <IconButton onClick={() => setOpenFilter(true)}>
          <FilterList />
        </IconButton>
      </Tooltip>
    </>
  );

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
      const filteredData = data.filter((item) => jsonLogic.apply(logic, item));
      setListFiltered(filteredData);
    } else {
      setListFiltered(data);
    }
    setOpenFilter(false);
  };

  const tableOptions = {
    enableNestedDataAccess: '.',
    tableBodyHeight: 'calc(100vh - 470px)',
    selectableRows: 'none',
    download: false,
    print: false,
    filter: false,
    setRowProps,
    customToolbar,
    customToolbarSelect,
  };

  if (!currentUser?.isPlanning) {
    return (
      <Page
        context={context}
        itemsBreadcrumbs={[
          { name: 'Planejamento', page: 'Pessoa' },
          { name: 'Espaço', page: 'Espaco' },
        ]}
      >
        <DontHasPermition />
      </Page>
    );
  }

  return (
    <Page
      context={context}
      itemsBreadcrumbs={[
        { name: 'Planejamento', page: 'Pessoa' },
        { name: 'Espaço', page: 'Espaco' },
      ]}
    >
      <CreateHeader
        title='Espaço'
        action={
          <Button
            onClick={() => setForm({ open: true })}
            variant='contained'
            color='primary'
            startIcon={<Add />}
          >
            Adicionar Espaço
          </Button>
        }
      />
      <Table
        refTable={refTable}
        columns={columns}
        data={listFiltered}
        options={tableOptions}
      />

      <FilterDrawer
        open={openFilter}
        queryQB={query}
        clearFilter={clearFilter}
        configQB={config}
        setQuery={setQuery}
        applyFilter={applyFilter}
        onClose={() => setOpenFilter(false)}
      />

      <ModalDetail
        open={detail.open}
        item={detail.item}
        onClose={() => setDetail({ open: false })}
      />

      <ModalBulkEdit
        open={bulkEdit.open}
        spaces={bulkEdit.items}
        notification={notification}
        handleClose={() => setBulkEdit({ open: false })}
      />

      <ModalDesactive
        open={desactive.open}
        space={desactive.item}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <AddSpace
        open={form.open}
        space={form.item}
        handleEdit={handleEdit}
        handleClose={() => setForm({ open: false })}
      />
    </Page>
  );
};

export default SpacePage;
