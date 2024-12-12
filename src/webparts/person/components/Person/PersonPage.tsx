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
  Edit,
  Info,
  Delete,
  Visibility,
  VisibilityOff,
  FilterList,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification, useConfirmation, useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { AddPerson, DontHasPermition } from '~/components';
import { AppState } from '~/store';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import {
  activePerson,
  deletePerson,
  fetchAllPerson,
} from '~/store/modules/person/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';

interface IPersonProps {
  context: WebPartContext;
}

const PersonPage: React.FC<IPersonProps> = ({ context }) => {
  const [form, setForm] = React.useState<any>({ open: false });
  const [detail, setDetail] = React.useState<any>({ open: false });
  const [bulkEdit, setBulkEdit] = React.useState<any>({ open: false });
  const [desactive, setDesactive] = React.useState<any>({ open: false });
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [listFiltered, setListFiltered] = React.useState<any[]>([]);

  const dispatch = useDispatch();
  const { persons } = useSelector((state: AppState) => state.person);

  const refTable = React.useRef<any>();
  const { currentUser, tags } = useLoggedUser();

  const { notification } = useNotification();
  const { confirmation } = useConfirmation();

  const schoolOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.ESCOLA_ORIGEM
        )
      ),
    [tags]
  );

  const functionOptions = React.useMemo(
    () =>
      tags?.filter(
        (tag) =>
          tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
            (e) => e?.[`${PREFIX}nome`] === EFatherTag.FUNCAO
          ) &&
          !tag?.[`${PREFIX}excluido`] &&
          tag?.[`${PREFIX}ativo`]
      ),
    [tags]
  );

  const titleOptions = React.useMemo(
    () =>
      tags?.filter((tag) =>
        tag?.[`${PREFIX}Etiqueta_Pai`]?.some(
          (e) => e?.[`${PREFIX}nome`] === EFatherTag.TITULO
        )
      ),
    [tags]
  );

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
        fullname: {
          label: 'Nome',
          type: 'text',
        },
        email: {
          label: 'E-mail',
          type: 'text',
        },
        [`${PREFIX}Titulo`]: {
          label: 'Título',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: titleOptions,
              },
            },
          },
        },
        [`${PREFIX}EscolaOrigem`]: {
          label: 'Escola de Origem',
          type: '!struct',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: schoolOptions,
              },
            },
          },
        },
        [`${PREFIX}Pessoa_Etiqueta_Etiqueta`]: {
          label: 'Etiqueta (s)',
          type: '!group',
          subfields: {
            [`${PREFIX}etiquetaid`]: {
              label: 'Nome',
              type: 'select',
              valueSources: ['value'],
              fieldSettings: {
                showSearch: true,
                listValues: functionOptions,
              },
            },
          },
        },
        [`${PREFIX}Pessoa_AreaResponsavel`]: {
          label: 'Chefe de Departamento',
          type: '!group',
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
        [`${PREFIX}ativo`]: {
          label: 'Ativo',
          type: 'boolean',
        },
      },
    }),
    [areaOptions, schoolOptions, titleOptions, functionOptions]
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

  const data = React.useMemo<any[]>(() => {
    const newPerson = persons?.map((person) => ({
      ...person,
      fullname: person?.[`${PREFIX}nomecompleto`]?.toLocaleUpperCase(),
      email: person?.[`${PREFIX}email`]?.toLocaleUpperCase(),
      tags: person?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]
        ?.map((t) => t?.[`${PREFIX}nome`])
        ?.join(', '),
      areaChief: person?.[`${PREFIX}Pessoa_AreaResponsavel`]
        ?.map((are) => are?.[`${PREFIX}nome`])
        .join(', '),
      actions: (
        <Grid>
          <Tooltip arrow title='Detalhes'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDetail(person)}
            >
              <Info />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title='Editar'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleEdit(person)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          {person?.[`${PREFIX}ativo`] ? (
            <Tooltip arrow title='Desativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleDesactive(person)}
              >
                <VisibilityOff />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip arrow title='Ativar'>
              <IconButton
                style={{ padding: '8px' }}
                onClick={() => handleActive(person)}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title='Excluir'>
            <IconButton
              style={{ padding: '8px' }}
              onClick={() => handleDelete(person)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Grid>
      ),
    }));
    setListFiltered(
      newPerson?.filter((e) => !e?.[`${PREFIX}excluido`] && e[`${PREFIX}ativo`])
    );
    return newPerson;
  }, [persons]);

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
      name: `${PREFIX}sobrenome`,
      label: 'Sobrenome',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nomepreferido`,
      label: 'Nome Preferido',
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
      },
    },
    {
      name: `${PREFIX}emailsecundario`,
      label: 'E-mail Secundário',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}celular`,
      label: 'Celular',
      options: {
        filter: true,
      },
    },
    {
      name: `${PREFIX}Titulo.${PREFIX}nome`,
      label: 'Título',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: `${PREFIX}EscolaOrigem.${PREFIX}nome`,
      label: 'Escola de origem',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: `areaChief`,
      label: 'Chefe de Departamento',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: `tags`,
      label: 'Etiquetas',
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

  const refetch = () => {
    dispatch(
      fetchAllPerson({
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

  const handleSuccessDelete = () => {
    refetch();
    notification.success({
      title: 'Sucesso',
      description: 'Excluído com sucesso',
    });
  };

  const handleDelete = (item) => {
    confirmation.openConfirmation({
      title: 'Deseja relmente excluir a pessoa?',
      description: item?.[`${PREFIX}nome`],
      onConfirm: () =>
        dispatch(
          deletePerson(
            { id: item?.[`${PREFIX}pessoaid`] },
            { onSuccess: handleSuccessDelete, onError: handleError }
          )
        ),
    });
  };

  const handleActive = (item) => {
    dispatch(
      activePerson(item, { onSuccess: handleSuccess, onError: handleError })
    );
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
      itemsSelected.push(persons[row.index]);
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
    if (!row[10]) {
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
          { name: 'Pessoa', page: 'Pessoa' },
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
        { name: 'Pessoa', page: 'Pessoa' },
      ]}
    >
      <CreateHeader
        title='Pessoa'
        action={
          <Button
            onClick={() => setForm({ open: true })}
            variant='contained'
            color='primary'
            startIcon={<Add />}
          >
            Adicionar Pessoa
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
        tags={tags}
        persons={bulkEdit.items}
        notification={notification}
        handleClose={() => setBulkEdit({ open: false })}
      />

      <ModalDesactive
        open={desactive.open}
        person={desactive.item}
        notification={notification}
        handleClose={() => {
          refetch();
          setDesactive({ open: false });
        }}
      />

      <AddPerson
        open={form.open}
        person={form.item}
        refetch={refetch}
        handleClose={() => setForm({ open: false })}
      />
    </Page>
  );
};

export default PersonPage;
