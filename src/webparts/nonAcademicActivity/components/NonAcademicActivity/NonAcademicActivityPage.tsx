import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
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
import { useNotification, useLoggedUser, useConfirmation } from '~/hooks';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AddActivityPlanning, DontHasPermition } from '~/components';
import { useDispatch, useSelector } from 'react-redux';
import {
  activeActivity,
  deleteActivity,
  fetchAllActivities,
} from '~/store/modules/activity/actions';
import { AppState } from '~/store';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { fetchAllFiniteInfiniteResources } from '~/store/modules/finiteInfiniteResource/actions';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';

interface INonAcademicActivityProps {
  context: WebPartContext;
}

const NonAcademicActivityPage: React.FC<INonAcademicActivityProps> = ({
  context,
}) => {
  const { currentUser } = useLoggedUser();
  const [form, setForm] = React.useState<any>({ open: false });
  const [detail, setDetail] = React.useState<any>({ open: false });
  const [bulkEdit, setBulkEdit] = React.useState<any>({ open: false });
  const [activitySelected, setActivitySelected] = React.useState(null);
  const [desactive, setDesactive] = React.useState<any>({ open: false });
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<any[]>([]);

  const { activity } = useSelector((state: AppState) => state);
  const { activities } = activity;

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const refTable = React.useRef<any>();
  const dispatch = useDispatch();

  const config: Config = React.useMemo(
    () => ({
      ...FILTER_CONFIG_DEFAULT,
      fields: {
        name: {
          label: 'Nome da Atividade',
          type: 'text',
        },
        [`${PREFIX}quantidadesessao`]: {
          label: 'Quantidade de Sessões',
          type: 'number',
        },
        [`${PREFIX}ativo`]: {
          label: 'Ativo',
          type: 'boolean',
        },
      },
    }),
    []
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
    dispatch(fetchAllSpace({}));
    dispatch(fetchAllFiniteInfiniteResources({}));
    refetch();
  }, []);

  const columns = [
    {
      name: `${PREFIX}nome`,
      label: 'Nome da Atividade',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}temaaula`,
      label: 'Tema',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}duracao`,
      label: 'Duração',
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
    const newActivities = activities?.map((academicActivity) => ({
      ...academicActivity,
      name: academicActivity?.[`${PREFIX}nome`]?.toLocaleUpperCase(),
      actions: (
        <Grid>
          <Tooltip arrow title='Detalhes'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDetail(academicActivity)}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title='Editar'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleEdit(academicActivity)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          {academicActivity?.[`${PREFIX}ativo`] ? (
            <Tooltip arrow title='Desativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleDesactive(academicActivity)}
              >
                <VisibilityOff />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title='Ativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleActive(academicActivity)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title='Excluir'>
            <IconButton onClick={() => handleDelete(academicActivity)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));

    setListFiltered(newActivities?.filter((e) => e?.[`${PREFIX}ativo`]));

    return newActivities;
  }, [activities]);

  const refetch = () => {
    dispatch(
      fetchAllActivities({
        searchQuery: '',
        typeActivity: TYPE_ACTIVITY.NON_ACADEMICA,
        typeApplication: EActivityTypeApplication.PLANEJAMENTO,
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
    setActivitySelected(item);
    setForm({
      open: true,
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
      title: 'Deseja relmente excluir a Atividade?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () =>
        dispatch(
          deleteActivity(
            { id: item?.[`${PREFIX}atividadeid`] },
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
    activeActivity(item, {
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
    if (!row[3]) {
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
        { name: 'Atividade não acadêmica', page: 'Atividade não academica' },
      ]}
    >
      <CreateHeader
        title='Atividade não acadêmica'
        action={
          <Button
            onClick={() => setForm({ open: true })}
            variant='contained'
            color='primary'
            startIcon={<Add />}
          >
            Adicionar Atividade não acadêmica
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
        academicActivities={bulkEdit.items}
        notification={notification}
        handleClose={() => setBulkEdit({ open: false })}
      />

      <ModalDesactive
        open={desactive.open}
        academicActivity={desactive.item}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <AddActivityPlanning
        open={form.open}
        activityType={TYPE_ACTIVITY.NON_ACADEMICA}
        activity={activitySelected}
        handleEdit={(it) => setActivitySelected(it)}
        refetch={refetch}
        handleClose={() => {
          setForm({ open: false });
          setActivitySelected(null);
        }}
      />
    </Page>
  );
};

export default NonAcademicActivityPage;
