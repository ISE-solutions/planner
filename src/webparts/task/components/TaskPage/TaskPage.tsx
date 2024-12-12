import * as React from 'react';
import { Page, Table, AddTask } from '~/components';
import CreateHeader from '~/components/CreateHeader';
import AddCustomFilter from '~/components/AddCustomFilter';
import { Badge, Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, FilterList, Info } from '@material-ui/icons';
import { useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import * as _ from 'lodash';
import * as moment from 'moment';
import { useFormik } from 'formik';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '~/store';
import { fetchAllTasks } from '~/store/modules/task/actions';
import {
  EFatherTag,
  ETYPE_CUSTOM_FILTER,
  PRIORITY_TASK,
  STATUS_TASK,
} from '~/config/enums';
import { getTeamByIds } from '~/store/modules/team/actions';
import { getProgramByIds } from '~/store/modules/program/actions';
import { TYPE_ACTIVITY } from '~/config/enums';

import Filter from './Filter';
import FastFilter from './FastFilter';
import { fetchAllCustomFilter } from '~/store/modules/customFilter/actions';

interface ITaskProps {
  context: WebPartContext;
}

const TaskPage: React.FC<ITaskProps> = ({ context }) => {
  const dispatch = useDispatch();
  const [form, setForm] = React.useState<any>({ open: false });
  const [taksRender, setTasksRender] = React.useState([]);
  const [openFilter, setOpenFilter] = React.useState(false);
  const [filterSelected, setFilterSelected] = React.useState<any>();
  const [openAddCustomFilter, setOpenAddCustomFilter] = React.useState(false);
  const [filterEdit, setFilterEdit] = React.useState(null);

  const { currentUser } = useLoggedUser();
  const { task, tag } = useSelector((state: AppState) => state);
  const { dictTag } = tag;
  const { tasks } = task;

  React.useEffect(() => {
    if (currentUser) {
      formik.setFieldValue('responsible', [currentUser]);
      formik.handleSubmit();
      refetchFilter();
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (tasks.length) {
      const teamIds = new Set<string>();
      const programIds = new Set<string>();

      tasks.forEach((ta) => {
        const teamId = ta?.[`${PREFIX}Turma`]?.[`${PREFIX}turmaid`];
        const programId = ta?.[`${PREFIX}Programa`]?.[`${PREFIX}programaid`];

        if (teamId && !teamIds.has(teamId)) {
          teamIds.add(teamId);
        }

        if (programId && !programIds.has(programId)) {
          programIds.add(programId);
        }
      });

      Promise.all([
        getTeamByIds(Array.from(teamIds)),
        getProgramByIds(Array.from(programIds)),
      ]).then(([teams, programs]) => {
        const dictTeam = new Map<string, any>(
          teams.map((te) => [te?.[`${PREFIX}turmaid`], te])
        );
        const dictProgram = new Map<string, any>(
          programs.map((pr) => [pr?.[`${PREFIX}programaid`], pr])
        );

        const newTasks = tasks.map((atv) => ({
          ...atv,
          team: dictTeam.get(atv?.[`${PREFIX}Turma`]?.[`${PREFIX}turmaid`]),
          program: dictProgram.get(
            atv?.[`${PREFIX}Programa`]?.[`${PREFIX}programaid`]
          ),
        }));

        setTasksRender(_.cloneDeep(newTasks));
      });
    } else {
      setTasksRender([]);
    }
  }, [tasks]);

  const formik = useFormik({
    initialValues: {
      institute: [],
      company: [],
      typeProgram: [],
      programTemperature: [],
      teamYearConclusion: '',
      teamSigla: '',
      teamName: '',
      teamTemperature: [],
      delivery: '',
      status: [
        {
          value: STATUS_TASK['Em Andamento'],
          label: STATUS_TASK[STATUS_TASK['Em Andamento']],
        },
        {
          value: STATUS_TASK['Não Iniciada'],
          label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
        },
      ],
      responsible: [],
      start: null,
      end: null,
      endForecastConclusion: '',
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    onSubmit: (values) => {
      refetch();
      setOpenFilter(false);
    },
  });

  const columns = [
    {
      name: `${PREFIX}id`,
      label: 'Id',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `createdon`,
      label: 'Data de Criação',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `forecastConclusion`,
      label: 'Previsão de Conclusão',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `concludedDay`,
      label: 'Data de Conclusão',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}nome`,
      label: 'Título',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}Entrega.${PREFIX}titulo`,
      label: 'Entrega',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `status`,
      label: 'Status',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `priority`,
      label: 'Prioridade',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}tipo`,
      label: 'Tipo',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `${PREFIX}Grupo.${PREFIX}nome`,
      label: 'Grupo Responsável',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `people`,
      label: 'Pessoa Responsável',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: `nameProgram`,
      label: 'Programa',
    },
    {
      name: `${PREFIX}Turma.${PREFIX}nome`,
      label: 'Turma',
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

  const formatFilter = () => {
    const ftr = {
      instituteId: formik?.values?.institute?.map((e) => e?.value),
      companyId: formik?.values?.company?.map((e) => e?.value),
      typeProgramId: formik?.values?.typeProgram?.map((e) => e?.value),
      programTemperatureId: formik?.values?.programTemperature?.map(
        (e) => e?.value
      ),
      teamYearConclusion: formik?.values?.teamYearConclusion,
      teamSigla: formik?.values?.teamSigla,
      teamName: formik?.values?.teamName,
      teamTemperatureId: formik?.values?.teamTemperature?.map((e) => e?.value),
      delivery: formik?.values?.delivery,
      status: formik?.values?.status?.map((e) => e?.value),
      responsible: formik?.values?.responsible?.map((e) => e?.value),
      endForecastConclusion: formik?.values?.endForecastConclusion,
      start:
        formik?.values?.start &&
        formik?.values?.start.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end:
        formik?.values?.end &&
        formik?.values?.end.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    };

    return _.omitBy(ftr, _.isNil);
  };

  const refetch = () => {
    dispatch(fetchAllTasks(formatFilter()));
  };

  const refetchFilter = () => {
    dispatch(
      fetchAllCustomFilter({
        active: 'Ativo',
        published: true,
        me: currentUser?.[`${PREFIX}pessoaid`],
      })
    );
  };

  const handleAddFilter = () => {
    setFilterEdit(null);
    setOpenAddCustomFilter(true);
  };

  const handleOverwriteFilter = () => {
    setFilterEdit(filterSelected);
    setOpenAddCustomFilter(true);
  };

  const handleDetail = (item) => {
    setForm({
      open: true,
      item,
    });
  };

  const customToolbar = () => (
    <Tooltip disableFocusListener arrow title='Filtro'>
      <IconButton onClick={() => setOpenFilter(true)}>
        <Badge color='primary'>
          <FilterList />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  const tableOptions = {
    // rowsPerPage: filter.rowsPerPage,
    enableNestedDataAccess: '.',
    tableBodyHeight: 'calc(100vh - 470px)',
    selectableRows: 'none',
    tableLayout: 'auto',
    download: false,
    print: false,
    filter: false,
    customToolbar,
  };

  const data = React.useMemo(() => {
    if (Object.keys(dictTag).length && taksRender.length && currentUser) {
      let tasksFiltered = [];

      if (currentUser?.isPlanning) {
        tasksFiltered = taksRender;
      } else {
        tasksFiltered = taksRender?.filter((ta) => {
          const isPersonResponsible = ta?.[
            `${PREFIX}tarefas_responsaveis_ise_pessoa`
          ]?.some(
            (tape) =>
              tape?.[`${PREFIX}pessoaid`] === currentUser?.[`${PREFIX}pessoaid`]
          );

          const isGroupResponsible =
            ta?.[`${PREFIX}Grupo`] &&
            currentUser?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.some(
              (peti) =>
                peti?.[`${PREFIX}etiquetaid`] ===
                ta?.[`${PREFIX}Grupo`]?.[`${PREFIX}etiquetaid`]
            );

          const isProgramResponsible = ta.program?.[
            `${PREFIX}Programa_PessoasEnvolvidas`
          ].some((pape) => {
            const func = dictTag?.[pape?.[`_${PREFIX}funcao_value`]];
            return (
              pape?.[`_${PREFIX}pessoa_value`] ===
                currentUser?.[`${PREFIX}pessoaid`] &&
              func?.[`${PREFIX}nome`] === EFatherTag.RESPONSAVEL_PELO_PROGRAMA
            );
          });

          if (isProgramResponsible) {
            return true;
          }

          const isProgramDirectorOrCoordinator = ta.team?.[
            `${PREFIX}Turma_PessoasEnvolvidasTurma`
          ].some((pape) => {
            const func = dictTag?.[pape?.[`_${PREFIX}funcao_value`]];

            return (
              pape?.[`_${PREFIX}pessoa_value`] ===
                currentUser?.[`${PREFIX}pessoaid`] &&
              (func?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_PROGRAMA ||
                func?.[`${PREFIX}nome`] === EFatherTag.COORDENACAO_ADMISSOES)
            );
          });

          if (isProgramDirectorOrCoordinator) {
            return true;
          }

          const isAcademicDirectorOrAcademicCoordinator = ta.team?.[
            `${PREFIX}Turma_PessoasEnvolvidasTurma`
          ].some((pape) => {
            const func = dictTag?.[pape?.[`_${PREFIX}funcao_value`]];

            return (
              (pape?.[`_${PREFIX}pessoa_value`] ===
                currentUser?.[`${PREFIX}pessoaid`] &&
                (func?.[`${PREFIX}nome`] === EFatherTag.DIRETOR_ACADEMICO ||
                  func?.[`${PREFIX}nome`] ===
                    EFatherTag.COORDENACAO_ACADEMICA)) ||
              isPersonResponsible ||
              isGroupResponsible
            );
          });

          if (isAcademicDirectorOrAcademicCoordinator) {
            return (
              (ta?.[`${PREFIX}Atividade`] &&
                ta?.[`${PREFIX}Atividade`]?.[`${PREFIX}tipo`] ===
                  TYPE_ACTIVITY.ACADEMICA) ||
              isPersonResponsible ||
              isGroupResponsible
            );
          }

          return isPersonResponsible || isGroupResponsible;
        });
      }

      return tasksFiltered?.map((tsk) => {
        const nameProgram =
          dictTag?.[
            tsk?.[`${PREFIX}Programa`]?.[`_${PREFIX}nomeprograma_value`]
          ]?.[`${PREFIX}nome`];

        return {
          ...tsk,
          nameProgram,
          status: STATUS_TASK?.[tsk.statuscode],
          priority: PRIORITY_TASK?.[tsk?.[`${PREFIX}prioridade`]],
          people: tsk?.[`${PREFIX}tarefas_responsaveis_ise_pessoa`]
            .map((p) => p?.[`${PREFIX}nomecompleto`])
            .join(', '),
          createdon: moment(tsk.createdon).format('DD/MM/YYYY HH:mm'),
          concludedDay: tsk?.[`${PREFIX}dataconclusao`]
            ? moment(tsk?.[`${PREFIX}dataconclusao`]).format('DD/MM/YYYY HH:mm')
            : '-',
          forecastConclusion: tsk?.[`${PREFIX}previsaodeconclusao`]
            ? moment(tsk?.[`${PREFIX}previsaodeconclusao`]).format(
                'DD/MM/YYYY HH:mm'
              )
            : '-',
          actions: (
            <Grid>
              <Tooltip arrow title='Detalhes'>
                <IconButton
                  style={{ padding: '8px' }}
                  onClick={() => handleDetail(tsk)}
                >
                  <Info />
                </IconButton>
              </Tooltip>
            </Grid>
          ),
        };
      });
    }
  }, [taksRender, dictTag, currentUser]);

  return (
    <Page
      blockOverflow={false}
      context={context}
      itemsBreadcrumbs={[{ name: 'Tarefa', page: 'Tarefas' }]}
    >
      <Filter
        open={openFilter}
        filterSelected={filterSelected}
        setFilterSelected={setFilterSelected}
        refetch={refetch}
        onAddCustomFilter={handleAddFilter}
        onOvewriteFilter={handleOverwriteFilter}
        onClose={() => setOpenFilter(false)}
        formik={formik}
      />

      <CreateHeader
        title='Tarefas'
        action={
          <>
            {currentUser?.isPlanning && (
              <Button
                onClick={() => setForm({ open: true })}
                variant='contained'
                color='primary'
                startIcon={<Add />}
              >
                Adicionar Tarefa
              </Button>
            )}
          </>
        }
      />

      <Table
        title={<FastFilter formik={formik} />}
        columns={columns}
        data={data}
        options={tableOptions}
        // components={components}
      />

      <AddTask
        open={form.open}
        task={form.item}
        refetch={refetch}
        handleClose={() => setForm({ open: false })}
      />

      <AddCustomFilter
        open={openAddCustomFilter}
        filter={formik.values}
        filterSaved={filterEdit}
        type={ETYPE_CUSTOM_FILTER.TASK}
        refetch={refetchFilter}
        onClose={() => setOpenAddCustomFilter(false)}
      />
    </Page>
  );
};

export default TaskPage;
