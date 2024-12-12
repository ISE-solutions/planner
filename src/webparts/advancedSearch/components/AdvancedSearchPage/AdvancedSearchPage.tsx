import * as React from 'react';
import Page from '~/components/Page';
import * as yup from 'yup';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useFormik } from 'formik';
import Filter from './Filter';
import { IconButton, Tooltip, CircularProgress } from '@material-ui/core';
import { Utils as QbUtils, Config } from '@react-awesome-query-builder/ui';

import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { fetchAllSpace } from '~/store/modules/space/actions';
import { fetchAdvancedTeams } from '~/store/modules/team/actions';
import { fetchAdvancedPrograms } from '~/store/modules/program/actions';
import * as _ from 'lodash';
import { Backdrop, Table } from '~/components';
import { fetchAdvancedSchedules } from '~/store/modules/schedule/actions';
import { GROUP_FILTER } from './constants';
import {
  COLUMNS_GROUP,
  formatActivityRows,
  formatProgramRows,
  formatScheduleRows,
  formatTeamRows,
} from './utils';
import ShowColumns from './ShowColumns';
import { FilterList, ViewColumn } from '@material-ui/icons';
import useFilter from './Filter/useFilter';
import { fetchAdvancedActivities } from '~/store/modules/activity/actions';
import { FILTER_CONFIG_ADVANCED_SEARCH_DEFAULT } from '~/webparts/constants';

interface IAdvancedSearchProps {
  context: WebPartContext;
}

const AdvancedSearchPage: React.FC<IAdvancedSearchProps> = ({ context }) => {
  const [group, setGroup] = React.useState<GROUP_FILTER>(
    GROUP_FILTER.ATIVIDADE
  );

  const [activitiesRender, setActivitiesRender] = React.useState([]);
  const [schedulesRender, setSchedulesRender] = React.useState([]);
  const [teamsRender, setTeamsRender] = React.useState([]);
  const [programsRender, setProgramsRender] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  const [openDrawerColumn, setOpenDrawerColumn] =
    React.useState<boolean>(false);

  const [rowsSelectedToExport, setRowsSelectedToExport] = React.useState<
    number[]
  >([]);

  const dispatch = useDispatch();

  const { tag, person, space } = useSelector((state: AppState) => state);
  const { tags, dictTag } = tag;
  const { persons, dictPeople } = person;
  const { spaces, dictSpace } = space;

  const { fieldsFilter } = useFilter({ tags, spaces, persons });

  const config: Config = React.useMemo(
    () => ({
      ...FILTER_CONFIG_ADVANCED_SEARCH_DEFAULT,
      fields: fieldsFilter[group] as any,
    }),
    [group, tags, spaces, persons]
  );

  const [query, setQuery] = React.useState({
    // @ts-ignore
    tree: QbUtils.checkTree(
      QbUtils.loadTree({ id: QbUtils.uuid(), type: 'group' }),
      config
    ),
    config: config,
  });

  React.useEffect(() => {
    dispatch(fetchAllSpace({}));
  }, []);

  React.useEffect(() => {
    setColumns(
      COLUMNS_GROUP({ rowsSelectedToExport, rowData, setRowsSelectedToExport })[
        group
      ]
    );
  }, [rowsSelectedToExport]);

  React.useEffect(() => {
    setActivitiesRender([]);
    setSchedulesRender([]);
    setTeamsRender([]);
    setProgramsRender([]);
    formik.handleReset({});
    setColumns(
      COLUMNS_GROUP({ rowsSelectedToExport, rowData, setRowsSelectedToExport })[
        group
      ]
    );
  }, [group]);

  const formik = useFormik({
    initialValues: {
      filters: [
        {
          field: null,
          criterion: null,
          value: null,
          isLocal: false,
        },
      ],
    },
    validationSchema: yup.object({
      filters: yup.array().of(
        yup.object({
          criterion: yup.mixed().test({
            exclusive: true,
            name: 'ValidateCriterion',
            message: 'Campo Obrigatório',
            test: (value, { parent }) => {
              return parent.field ? !!value : true;
            },
          }),
          value: yup.mixed().test({
            exclusive: true,
            name: 'ValidateValue',
            message: 'Campo Obrigatório',
            test: (value, { parent }) => {
              return parent.field ? !!value : true;
            },
          }),
        })
      ),
    }),
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      handleCloseFilter();
      const sqlFilter = QbUtils.sqlFormat(query.tree, config);

      setLoading(true);
      switch (group) {
        case GROUP_FILTER.ATIVIDADE:
          fetchAdvancedActivities(sqlFilter).then((data) => {
            setActivitiesRender(data);
          });
          break;
        case GROUP_FILTER.DIA:
          fetchAdvancedSchedules(sqlFilter).then((data) => {
            setSchedulesRender(data);
          });
          break;
        case GROUP_FILTER.TURMA:
          fetchAdvancedTeams(sqlFilter).then((data) => {
            setTeamsRender(data);
          });
          break;
        case GROUP_FILTER.PROGRAM:
          fetchAdvancedPrograms(sqlFilter).then((data) => {
            setProgramsRender(data);
          });
          break;
      }
    },
  });

  const refTable = React.useRef();

  const rowData = React.useMemo(() => {
    let rows = [];
    switch (group) {
      default:
      case GROUP_FILTER.ATIVIDADE:
        rows = formatActivityRows({
          dictTag,
          dictPeople,
          dictSpace,
          rowsSelectedToExport,
          setRowsSelectedToExport: setRowsSelectedToExport,
          activities: activitiesRender,
        });
        break;
      case GROUP_FILTER.DIA:
        rows = formatScheduleRows({
          dictTag,
          dictPeople,
          rowsSelectedToExport,
          setRowsSelectedToExport: setRowsSelectedToExport,
          schedules: schedulesRender,
        });
        break;
      case GROUP_FILTER.TURMA:
        rows = formatTeamRows({
          dictTag,
          dictPeople,
          rowsSelectedToExport,
          setRowsSelectedToExport: setRowsSelectedToExport,
          teams: teamsRender,
        });
        break;
      case GROUP_FILTER.PROGRAM:
        rows = formatProgramRows({
          dictTag,
          dictPeople,
          rowsSelectedToExport,
          setRowsSelectedToExport: setRowsSelectedToExport,
          programs: programsRender,
        });
        break;
    }

    setLoading(false);
    return rows;
  }, [
    activitiesRender,
    rowsSelectedToExport,
    schedulesRender,
    teamsRender,
    programsRender,
    group,
  ]);

  const [columns, setColumns] = React.useState<any>(
    COLUMNS_GROUP({ rowsSelectedToExport, rowData, setRowsSelectedToExport })[
      group
    ]
  );

  const clearFilter = () => {
    setQuery({
      ...query,
      tree: QbUtils.checkTree(
        QbUtils.loadTree({ id: QbUtils.uuid(), type: 'group' }),
        config
      ),
    });
  };

  const customToolbar = () => (
    <>
      <Tooltip disableFocusListener arrow title='Colunas'>
        <IconButton onClick={() => setOpenDrawerColumn(true)}>
          <ViewColumn />
        </IconButton>
      </Tooltip>
      <IconButton onClick={() => setOpenFilter(true)}>
        <FilterList />
      </IconButton>
    </>
  );

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const tableOptions = {
    enableNestedDataAccess: '.',
    // responsive: 'scrollMaxHeight',
    responsive: 'vertical',
    selectableRows: 'none',
    selectToolbarPlacement: 'none',
    selectableRowsOnClick: true,
    download: true,
    print: false,
    filter: false,
    search: false,
    viewColumns: false,
    draggableColumns: {
      enabled: true,
      transitiondatetime: 300,
    },
    downloadOptions: {
      separator: ';',
      filename: 'Consulta Avançada.csv',
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true,
      },
    },
    customToolbar,
    onRowSelectionChange: (
      currentRowsSelected,
      allRowsSelected,
      rowsSelected
    ) => {
      setRowsSelectedToExport(rowsSelected);
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const bodyToExport = data.filter((d, index) =>
        rowsSelectedToExport.includes(index)
      );

      return '\uFEFF' + buildHead(columns) + buildBody(bodyToExport);
    },
    setTableProps: () => {
      return {
        size: 'small',
      };
    },
  };

  return (
    <Page
      context={context}
      blockOverflow={false}
      itemsBreadcrumbs={[
        { name: 'Consulta Avançada', page: 'Consulta avançada' },
      ]}
    >
      <Backdrop open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <ShowColumns
        open={openDrawerColumn}
        columns={columns}
        setColumns={setColumns}
        onClose={() => setOpenDrawerColumn(false)}
      />

      <Filter
        formik={formik}
        loading={loading}
        queryQB={query}
        clearFilter={clearFilter}
        open={openFilter}
        configQB={config}
        setQuery={setQuery}
        onClose={handleCloseFilter}
        group={group}
        setGroup={setGroup}
      />

      <Table
        refTable={refTable}
        columns={columns}
        data={rowData}
        options={tableOptions}
      />
    </Page>
  );
};

export default AdvancedSearchPage;
