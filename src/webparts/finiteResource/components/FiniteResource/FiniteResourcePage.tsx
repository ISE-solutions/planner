import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import AddFiniteInfiniteResource from '../../../../components/AddFiniteInfiniteResource/index';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import {
  Add,
  Delete,
  Edit,
  FilterList,
  Info,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import {
  activeFiniteInfiniteResource,
  deleteResource,
  fetchAllFiniteInfiniteResources,
} from '~/store/modules/finiteInfiniteResource/actions';
import { AppState } from '~/store';
import FilterDrawer from '~/components/FilterDrawer';

interface IFiniteInfiniteResourceProps {
  context: WebPartContext;
}

const FiniteResourcePage: React.FC<IFiniteInfiniteResourceProps> = ({
  context,
}) => {
  const [showActive, setShowActive] = React.useState('Ativo');
  const [form, setForm] = React.useState<any>({ open: false });
  const [detail, setDetail] = React.useState<any>({ open: false });
  const [bulkEdit, setBulkEdit] = React.useState<any>({ open: false });
  const [desactive, setDesactive] = React.useState<any>({ open: false });
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<any[]>([]);

  const dispatch = useDispatch();
  const { currentUser } = useLoggedUser();
  const { tag, finiteInfiniteResource } = useSelector(
    (state: AppState) => state
  );
  const { allFiniteInfiniteResources } = finiteInfiniteResource;
  const { tagsActive: tags } = tag;

  const refTable = React.useRef<any>();

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const tagOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.RECURSO_FINITOS
        )
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
        [`${PREFIX}limitacao`]: {
          label: 'Limitação',
          type: 'number',
        },
        [`${PREFIX}quantidade`]: {
          label: 'Quantidade',
          type: 'number',
        },
        [`${PREFIX}Tipo`]: {
          label: 'Tipo',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: tagOptions,
              },
            },
          },
        },
        [`${PREFIX}ativo`]: {
          label: 'Ativo',
          type: 'boolean',
        },
      },
    }),
    [tagOptions]
  );

  const [query, setQuery] = React.useState({
    // @ts-ignore
    tree: QbUtils.loadFromJsonLogic(
      { and: [{ '==': [{ var: 'ise_ativo' }, true] }] },
      config
    ),
    config: config,
  });

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
      name: `${PREFIX}limitacao`,
      label: 'Limitação',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}quantidade`,
      label: 'Quantidade',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}Tipo.${PREFIX}nome`,
      label: 'Tipo',
      options: {
        filter: true,
        sort: true,
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
    const newFiniteResource = allFiniteInfiniteResources?.map((resource) => ({
      ...resource,
      name: resource?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
      actions: (
        <Grid>
          <Tooltip arrow title='Detalhes'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDetail(resource)}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title='Editar'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleEdit(resource)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          {resource?.[`${PREFIX}ativo`] ? (
            <Tooltip arrow title='Desativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleDesactive(resource)}
              >
                <VisibilityOff />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title='Ativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleActive(resource)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title='Excluir'>
            <IconButton onClick={() => handleDelete(resource)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));

    setListFiltered(
      newFiniteResource?.filter((e) => {
        return (
          e?.[`${PREFIX}ativo`] &&
          e?.[`${PREFIX}tiporecurso`] === TYPE_RESOURCE.FINITO
        );
      })
    );
    return newFiniteResource;
  }, [allFiniteInfiniteResources, showActive]);

  React.useEffect(() => {
    refetch();
  }, []);

  const refetch = () => {
    dispatch(
      fetchAllFiniteInfiniteResources({
        searchQuery: '',
        typeResource: TYPE_RESOURCE.FINITO,
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

  const handleDelete = (item) => {
    confirmation.openConfirmation({
      title: 'Deseja relmente excluir o Recurso Finito?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () =>
        dispatch(
          deleteResource(
            { id: item?.[`${PREFIX}recursofinitoinfinitoid`] },
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

  const handleActive = (item) => {
    activeFiniteInfiniteResource(item, {
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };

  const handleDetail = (item) => {
    setDetail({
      open: true,
      item,
    });
  };

  const setRowProps = (row) => {
    if (!row[4]) {
      return {
        style: { background: '#f09b95' },
      };
    }
  };

  const customToolbar = () => (
    <Tooltip disableFocusListener arrow title='Filtro'>
      <IconButton onClick={() => setOpenFilter(true)}>
        <FilterList />
      </IconButton>
    </Tooltip>
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
  };

  if (!currentUser?.isPlanning) {
    return (
      <Page
        context={context}
        itemsBreadcrumbs={[
          { name: 'Planejamento', page: 'Pessoa' },
          { name: 'Recurso Infinito', page: 'Recurso Infinito' },
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
        { name: 'Recurso Finito', page: 'Recurso Finito' },
      ]}
    >
      <CreateHeader
        title='Recurso Finito'
        action={
          <Button
            onClick={() => setForm({ open: true })}
            variant='contained'
            color='primary'
            startIcon={<Add />}
          >
            Adicionar Recurso Finito
          </Button>
        }
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

      <Table
        refTable={refTable}
        columns={columns}
        data={listFiltered}
        options={tableOptions}
      />

      <ModalDetail
        open={detail.open}
        item={detail.item}
        onClose={() => setDetail({ open: false })}
      />

      <ModalBulkEdit
        open={bulkEdit.open}
        persons={bulkEdit.items}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <ModalDesactive
        open={desactive.open}
        resource={desactive.item}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <AddFiniteInfiniteResource
        typeResource={TYPE_RESOURCE.FINITO}
        open={form.open}
        resource={form.item}
        refetch={refetch}
        handleClose={() => setForm({ open: false })}
      />
    </Page>
  );
};

export default FiniteResourcePage;
