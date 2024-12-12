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
import { useNotification, useConfirmation, useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AddTag, DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import {
  activeTag,
  deleteTag,
  fetchAllTags,
} from '~/store/modules/tag/actions';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';

interface ITagProps {
  context: WebPartContext;
}

const TagPage: React.FC<ITagProps> = ({ context }) => {
  const [form, setForm] = React.useState<any>({ open: false });
  const [detail, setDetail] = React.useState<any>({ open: false });
  const [bulkEdit, setBulkEdit] = React.useState<any>({ open: false });
  const [desactive, setDesactive] = React.useState<any>({ open: false });
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);

  const [listFiltered, setListFiltered] = React.useState<any[]>([]);

  const dispatch = useDispatch();
  const { tags } = useSelector((state: AppState) => state.tag);

  const refTable = React.useRef<any>();
  const { currentUser } = useLoggedUser();

  const fatherTags = React.useMemo(
    () => tags?.filter((e) => e?.[`${PREFIX}ehpai`]),
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
        description: {
          label: 'Descrição',
          type: 'text',
        },
        [`${PREFIX}Etiqueta_Pai`]: {
          label: 'Etiqueta(s) Pai',
          type: '!group',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: fatherTags,
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
    [fatherTags]
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

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const columns = [
    {
      name: `${PREFIX}nome`,
      label: 'Nome (PT)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomeen`,
      label: 'Nome (EN)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomees`,
      label: 'Nome (ES)',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}descricao`,
      label: 'Descrição',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `fatherTags`,
      label: 'Etiqueta(s) Pai',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: `${PREFIX}ehpai`,
      label: 'É Etiqueta pai',
      options: {
        filter: false,
        sort: false,
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
    const newTags = tags?.map((tag) => ({
      ...tag,
      name: tag?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
      description: tag?.[`${PREFIX}descricao`]?.toLocaleUpperCase(),
      [`${PREFIX}ehpai`]: tag?.[`${PREFIX}ehpai`] ? 'Sim' : 'Não',
      fatherTags: tag?.[`${PREFIX}Etiqueta_Pai`]
        .map((tag) => tag?.[`${PREFIX}nome`])
        .join(', '),
      actions: (
        <Grid>
          <Tooltip arrow title='Detalhes'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDetail(tag)}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title='Editar'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleEdit(tag)}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          {tag?.[`${PREFIX}ativo`] && !tag?.[`${PREFIX}ehpai`] ? (
            <Tooltip arrow title='Desativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleDesactive(tag)}
              >
                <VisibilityOff />
              </IconButton>
            </Tooltip>
          ) : !tag?.[`${PREFIX}ehpai`] ? (
            <Tooltip arrow title='Ativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleActive(tag)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          ) : null}
          {!tag?.[`${PREFIX}ehpai`] && (
            <Tooltip arrow title='Excluir'>
              <IconButton onClick={() => handleDelete(tag)}>
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Grid>
      ),
    }));

    setListFiltered(
      newTags?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
    );

    return newTags;
  }, [tags]);

  const refetch = () => {
    dispatch(
      fetchAllTags({
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

  const handleSuccessDelete = () => {
    refetch();
    notification.success({
      title: 'Sucesso',
      description: 'Excluído com sucesso',
    });
  };

  const handleError = (error) => {
    refetch();
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
      title: 'Deseja relmente excluir a tag?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () =>
        dispatch(
          deleteTag(
            { id: item?.[`${PREFIX}etiquetaid`] },
            { onSuccess: handleSuccessDelete, onError: handleError }
          )
        ),
    });
  };

  const handleActive = (item) => {
    dispatch(
      activeTag(item, { onSuccess: handleSuccess, onError: handleError })
    );
  };

  const handleDetail = (item) => {
    setDetail({
      open: true,
      item,
    });
  };

  const setRowProps = (row) => {
    if (!row[6]) {
      return {
        style: { background: '#f09b95' },
      };
    }
    if (row[5] === 'Sim') {
      return {
        style: { background: '#ededed' },
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

    console.log(logic);
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
          { name: 'Etiqueta', page: 'Etiqueta' },
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
        { name: 'Etiqueta', page: 'Etiqueta' },
      ]}
    >
      <CreateHeader
        title='Etiqueta'
        action={
          <Button
            onClick={() => setForm({ open: true })}
            variant='contained'
            color='primary'
            startIcon={<Add />}
          >
            Adicionar Etiqueta
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
        tags={bulkEdit.items}
        notification={notification}
        handleClose={() => setBulkEdit({ open: false })}
      />

      <ModalDesactive
        open={desactive.open}
        tag={desactive.item}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <AddTag
        open={form.open}
        tag={form.item}
        fatherTags={fatherTags}
        handleEdit={handleEdit}
        handleClose={() => setForm({ open: false })}
      />
    </Page>
  );
};

export default TagPage;
