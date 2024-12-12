import * as React from 'react';
import { QueryBuilder } from 'odata-query-builder';
import {
  TEAM,
  PREFIX,
  PROGRAM,
  TEAM_NAME,
  PERSON,
  TAG,
  TEAM_ENVOLVED_PEOPLE,
  TEAM_PARTICIPANTS,
  SCHEDULE_DAY_ENVOLVED_PEOPLE,
  SCHEDULE_DAY,
  ACTIVITY,
  ACTIVITY_ENVOLVED_PEOPLE,
  SPACE,
  ACTIVITY_NAME,
  ACTIVITY_DOCUMENTS,
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  FINITE_INFINITE_RESOURCES,
} from '~/config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import BatchMultidata from '~/utils/BatchMultidata';
import useContextWebpart from '../useContextWebpart';
import { EGroups } from '~/config/enums';

interface IUseTeam {
  teams: any[];
  count: number;
  loading: boolean;
  loadingSave: boolean;
  postLoading: boolean;
  nextLink: string;
  addOrUpdateTeam: (
    team: any,
    programId: string,
    options?: IExceptionOption
  ) => void;
  updateTeam: (
    id: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  updateEnvolvedPerson: (
    id: any,
    teamId: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  getTeamByProgramId: (programId: any) => Promise<any>;
  getTeamById: (teamId: any) => Promise<any>;
  refetch: any;
  error: any;
}

interface IFilterProps {
  searchQuery?: string;
  programId?: string;
  filterProgram?: boolean;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  published?: 'Todos' | 'Sim' | 'Não';
  group?: EGroups;
  createdBy?: string;
  orderBy?: string;
  model?: boolean;
  rowsPerPage?: number;
  modality?: string;
  yearConclusion?: string;
  initials?: string;
}

interface IOptions {
  manual?: boolean;
}

const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);

        return p;
      });

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    // tslint:disable-next-line: no-unused-expression
    filtro.model !== undefined &&
      f.filterExpression(`${PREFIX}modelo`, 'eq', filtro.model);

    // tslint:disable-next-line: no-unused-expression
    filtro.group &&
      f.filterExpression(`${PREFIX}grupopermissao`, 'eq', filtro.group);

    // tslint:disable-next-line: no-unused-expression
    filtro.published &&
      filtro.published !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}publicado`,
        'eq',
        filtro.published === 'Sim'
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.modality &&
      f.filterExpression(
        `${PREFIX}Modalidade/${PREFIX}etiquetaid`,
        'eq',
        filtro.modality
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.yearConclusion &&
      f.filterExpression(
        `${PREFIX}anodeconclusao`,
        'eq',
        +filtro.yearConclusion
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.initials &&
      f.filterPhrase(`contains(${PREFIX}sigla,'${filtro.initials}')`);

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    // tslint:disable-next-line: no-unused-expression
    (filtro?.programId || filtro.filterProgram) &&
      f.filterExpression(
        `${PREFIX}Programa/${PREFIX}programaid`,
        'eq',
        filtro?.programId
      );

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  // query.select(
  //   `${PREFIX}id,${PREFIX}nome,${PREFIX}sobrenome,${PREFIX}nomepreferido,${PREFIX}email,${PREFIX}emailsecundario,${PREFIX}celular,${PREFIX}escolaorigem,${PREFIX}ativo`
  // );
  query.expand(
    `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

const useTeam = (filter: IFilterProps, options?: IOptions): IUseTeam[] => {
  const query = buildQuery(filter);
  const { context } = useContextWebpart();
  const useAxios = axios({ context: context });

  const [loadingSave, setLoadingSave] = React.useState(false);

  let headers = {};

  if (filter.rowsPerPage) {
    headers = {
      Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
    };
  }

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${TEAM}${query}`,
      headers,
    },
    {
      useCache: false,
      manual: !!options?.manual,
    }
  );

  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: `${TEAM}`,
      method: 'POST',
    },
    { manual: true }
  );

  const getTeamById = (teamId): Promise<any> => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) =>
        f.filterExpression(`${PREFIX}turmaid`, 'eq', teamId)
      );

      query.expand(
        `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
      );

      refetch({
        url: `${TEAM}${query.toQuery()}`,
        method: 'GET',
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const getTeamByProgramId = (programId) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) =>
        f.filterExpression(
          `${PREFIX}Programa/${PREFIX}programaid`,
          'eq',
          programId
        )
      );

      query.expand(
        `${PREFIX}Programa,${PREFIX}Turma_NomeTurma,${PREFIX}Temperatura,${PREFIX}Modalidade,${PREFIX}Turma_PessoasEnvolvidasTurma,${PREFIX}Turma_NomeTurma,${PREFIX}Turma_ParticipantesTurma,${PREFIX}CronogramadeDia_Turma,${PREFIX}ise_atividade_Turma_ise_turma,${PREFIX}Turma_Compartilhamento`
      );

      refetch({
        url: `${TEAM}${query.toQuery()}`,
        method: 'GET',
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const buildItem = (team) => {
    const res = {
      [`${PREFIX}titulo`]: team?.title,
      [`${PREFIX}sigla`]: team?.sigla,
      [`${PREFIX}nome`]: team?.name,
      [`${PREFIX}modeloid`]: team?.modeloid,
      [`${PREFIX}baseadoemmodeloturma`]: team?.baseadoemmodeloturma,
      [`${PREFIX}anexossincronizados`]: team.anexossincronizados,
      [`${PREFIX}nomefinanceiro`]: team?.teamName,
      [`${PREFIX}codigodaturma`]: team?.teamCode,
      [`${PREFIX}mascara`]: team?.mask,
      [`${PREFIX}mascarabackup`]: team?.maskBackup,
      [`${PREFIX}anodeconclusao`]: +team?.yearConclusion,
      [`${PREFIX}observacao`]: team?.description,
      [`${PREFIX}modelo`]: team?.model,
      [`${PREFIX}Modalidade@odata.bind`]:
        team?.modality && `/${TAG}(${team?.modality?.value})`,
      [`${PREFIX}Temperatura@odata.bind`]:
        team?.temperature && `/${TAG}(${team?.temperature?.value})`,
    };

    if (!team?.id) {
      res[`${PREFIX}CriadoPor@odata.bind`] =
        team?.user && `/${PERSON}(${team?.user})`;
      res[`${PREFIX}grupopermissao`] = team?.group;
    }

    return res;
  };

  const buildItemSchedule = (schedule) => {
    return {
      [`${PREFIX}nome`]: schedule.name,
      [`${PREFIX}modelo`]: schedule.model,
      [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
      [`${PREFIX}modeloid`]: schedule.modeloid,
      [`${PREFIX}observacao`]:
        schedule.observation || schedule?.[`${PREFIX}observacao`],
      [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
      [`${PREFIX}Modulo@odata.bind`]:
        schedule?.module &&
        `/${TAG}(${schedule?.module?.[`${PREFIX}etiquetaid`]})`,
      [`${PREFIX}Modalidade@odata.bind`]:
        schedule?.modality &&
        `/${TAG}(${schedule?.modality?.[`${PREFIX}etiquetaid`]})`,
      [`${PREFIX}Ferramenta@odata.bind`]:
        schedule?.tool && `/${TAG}(${schedule?.tool?.[`${PREFIX}etiquetaid`]})`,
      [`${PREFIX}FerramentaBackup@odata.bind`]:
        schedule?.toolBackup &&
        `/${TAG}(${schedule?.toolBackup?.[`${PREFIX}etiquetaid`]})`,
      [`${PREFIX}link`]: schedule.link,
      [`${PREFIX}linkbackup`]: schedule.linkBackup,
    };
  };

  const buildItemActivity = (activity) => {
    return {
      [`${PREFIX}nome`]: activity.name || activity?.[`${PREFIX}nome`],
      [`${PREFIX}tipo`]: activity.type || activity?.[`${PREFIX}tipo`],
      [`${PREFIX}temaaula`]: activity.theme || activity?.[`${PREFIX}temaaula`],
      [`${PREFIX}observacao`]:
        activity.observation || activity?.[`${PREFIX}observacao`],
      [`${PREFIX}descricaoobjetivo`]:
        activity.description || activity?.[`${PREFIX}descricaoobjetivo`],
      [`${PREFIX}quantidadesessao`]:
        activity.quantity || activity?.[`${PREFIX}quantidadesessao`] || 0,
      [`${PREFIX}duracao`]:
        activity.duration?.format('HH:mm') || activity?.[`${PREFIX}duracao`],
      [`${PREFIX}inicio`]:
        activity.startTime?.format('HH:mm') || activity?.[`${PREFIX}inicio`],
      [`${PREFIX}fim`]:
        activity.endTime?.format('HH:mm') || activity?.[`${PREFIX}fim`],
      [`${PREFIX}tipoaplicacao`]: activity.typeApplication,
      [`${PREFIX}datahorainicio`]:
        activity.startDate && moment(activity.startDate).format(),
      [`${PREFIX}datahorafim`]:
        activity.endDate && moment(activity.endDate).format(),
      [`${PREFIX}Turma@odata.bind`]:
        activity?.teamId && `/${PERSON}(${activity?.teamId})`,
      [`${PREFIX}AreaAcademica@odata.bind`]:
        activity?.area && `/${TAG}(${activity?.area?.[`${PREFIX}etiquetaid`]})`,
    };
  };

  const buildItemFantasyName = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}nome`]: item.name,
      [`${PREFIX}nomeen`]: item.nameEn,
      [`${PREFIX}nomees`]: item.nameEs,
      [`${PREFIX}uso`]: item.use,
    };
  };

  const buildItemParticipant = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}data`]: item?.date ? item?.date?.format() : null,
      [`${PREFIX}quantidade`]: item?.quantity || 0,
      [`${PREFIX}uso`]: item.use,
    };
  };

  const buildItemPeople = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}Pessoa@odata.bind`]:
        item?.person || item?.[`_${PREFIX}pessoa_value`]
          ? `/${PERSON}(${
              item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
            })`
          : null,
      [`${PREFIX}Funcao@odata.bind`]:
        item?.function?.value || item?.[`_${PREFIX}funcao_value`]
          ? `/${TAG}(${
              item?.function?.value || item?.[`_${PREFIX}funcao_value`]
            })`
          : null,
    };
  };

  const buildItemDocument = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}fonte`]: item.font,
      [`${PREFIX}link`]: item.link,
      [`${PREFIX}entrega`]: item.delivery,
      [`${PREFIX}nome`]: item.name,
    };
  };

  const buildItemAcademicRequest = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}descricao`]: item.description,
      [`${PREFIX}prazominimo`]: item.deadline,
      [`${PREFIX}momentoentrega`]: item.delivery,
      [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
    };
  };

  const buildItemPeopleAcademicRequest = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}Pessoa@odata.bind`]:
        item?.person || item?.[`_${PREFIX}pessoa_value`]
          ? `/${PERSON}(${
              item?.person?.value || item?.[`_${PREFIX}pessoa_value`]
            })`
          : null,
      [`${PREFIX}Funcao@odata.bind`]:
        item?.function || item?.[`_${PREFIX}funcao_value`]
          ? `/${TAG}(${
              item?.function?.value || item?.[`_${PREFIX}funcao_value`]
            })`
          : null,
      [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
    };
  };

  const addOrUpdateTeam = async (team, programId, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      setLoadingSave(true);
      const dataToSave: any = buildItem(team);

      try {
        const batch = new BatchMultidata(executePost);
        let teamId = team?.id;

        if (teamId) {
          batch.patch(TEAM, teamId, dataToSave);
        } else {
          const response = await executePost({
            url: TEAM,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          teamId = response.data?.[`${PREFIX}turmaid`];

          if (programId) {
            await executePost({
              url: `${TEAM}(${teamId})/${PREFIX}Programa/$ref`,
              method: 'PUT',
              data: {
                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                '@odata.id': `${PROGRAM}(${programId})`,
              },
            });
          }
        }

        batch.bulkPostRelationship(
          TEAM_NAME,
          TEAM,
          teamId,
          'Turma_NomeTurma',
          team?.names?.map((name) => buildItemFantasyName(name))
        );

        batch.bulkPostRelationship(
          TEAM_ENVOLVED_PEOPLE,
          TEAM,
          teamId,
          'Turma_PessoasEnvolvidasTurma',
          team?.people
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((name) => buildItemPeople(name))
        );

        batch.bulkPostRelationship(
          TEAM_PARTICIPANTS,
          TEAM,
          teamId,
          'Turma_ParticipantesTurma',
          team?.participants?.map((name) => buildItemParticipant(name))
        );

        // If there are schedules.
        if (team?.schedules?.length) {
          team.schedules.forEach((schedule) => {
            const requestId = batch.post(
              SCHEDULE_DAY,
              buildItemSchedule(schedule)
            );

            batch.putReference(requestId, TEAM, teamId, 'Turma');

            batch.bulkPostRelationshipReference(
              SCHEDULE_DAY_ENVOLVED_PEOPLE,
              requestId,
              'CronogramadeDia_PessoasEnvolvidas',
              schedule?.people
                ?.filter((e) => !(!e?.id && e.deleted))
                ?.map((pe) => buildItemPeople(pe))
            );

            schedule.activities.forEach((activity) => {
              const requestActivityId = batch.postRelationshipReference(
                ACTIVITY,
                requestId,
                'CronogramadeDia_Atividade',
                buildItemActivity({ ...activity, teamId: teamId })
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_ENVOLVED_PEOPLE,
                requestActivityId,
                'Atividade_PessoasEnvolvidas',
                activity?.people
                  ?.filter((e) => !!e.person && !(!e.id && e.deleted))
                  ?.map((pe) => buildItemPeople(pe))
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_DOCUMENTS,
                requestActivityId,
                'Atividade_Documento',
                activity?.documents
                  ?.filter((e) => !e.id && !e.deleted)
                  ?.map((pe) => buildItemDocument(pe))
              );

              batch.bulkPostReference(
                SPACE,
                activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
                requestActivityId,
                'Atividade_Espaco'
              );

              batch.bulkPostReference(
                TAG,
                activity?.equipments?.map(
                  (spc) => spc?.[`${PREFIX}etiquetaid`]
                ),
                requestActivityId,
                'Atividade_Equipamentos'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                activity?.id,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestActivityId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_NAME,
                requestActivityId,
                'Atividade_NomeAtividade',
                activity?.names?.map((name) => buildItemFantasyName(name))
              );

              activity?.academicRequests?.forEach((academicRequest) => {
                const academicRequestToSave =
                  buildItemAcademicRequest(academicRequest);

                const academicRequestRefId = batch.postRelationshipReference(
                  ACADEMIC_REQUESTS,
                  requestId,
                  'RequisicaoAcademica_Atividade',
                  academicRequestToSave
                );

                if (!academicRequest.deleted) {
                  batch.bulkPostRelationshipReference(
                    ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
                    academicRequestRefId,
                    'Requisicao_PessoasEnvolvidas',
                    academicRequest?.people
                      ?.filter((e) => !(!e?.id && e.deleted))
                      ?.map((pe) =>
                        buildItemPeopleAcademicRequest({
                          ...pe,
                          activityId: requestId,
                        })
                      )
                  );
                }
              });
            });
          });
        }

        await batch.execute();

        if (!team?.isLoadModel) {
          await uploadTeamFiles(team, teamId);
        }

        const newTeam = await getTeamById(teamId);

        resolve('Salvo com sucesso!');
        setLoadingSave(false);
        onSuccess?.(newTeam?.value?.[0]);
        refetch();
      } catch ({ response }) {
        console.error(response);
        reject(response);
        onError?.(response);
        setLoadingSave(false);
      }
    });
  };

  const updateEnvolvedPerson = (id, teamId, toSave, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      batch.patch(TEAM_ENVOLVED_PEOPLE, id, toSave);

      try {
        await batch.execute();

        const schedule: any = await getTeamById(teamId);
        resolve(schedule?.value?.[0]);
        onSuccess?.(schedule?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const updateTeam = (id, toSave, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      batch.patch(TEAM, id, toSave);

      try {
        await batch.execute();

        const activity: any = await getTeamById(id);
        resolve(activity?.value?.[0]);
        onSuccess?.(activity?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const uploadTeamFiles = async (team, teamId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (team?.anexos?.length) {
          const folder = `Turma/${moment(data?.createdon).format(
            'YYYY'
          )}/${teamId}`;

          const attachmentsToDelete = team?.anexos?.filter(
            (file) => file.relativeLink && file.deveExcluir
          );

          const attachmentsToSave = team?.anexos?.filter(
            (file) => !file.relativeLink && !file.deveExcluir
          );

          await deleteFiles(sp, attachmentsToDelete);
          await createFolder(sp, folder, 'Anexos Interno');
          await uploadFiles(
            sp,
            `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`,
            attachmentsToSave
          );
        }

        resolve('Sucesso');
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  };

  return [
    {
      teams: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      postLoading,
      loadingSave,
      loading,
      error,
      addOrUpdateTeam,
      updateTeam,
      updateEnvolvedPerson,
      getTeamByProgramId,
      getTeamById,
      refetch,
    },
  ];
};

export default useTeam;
