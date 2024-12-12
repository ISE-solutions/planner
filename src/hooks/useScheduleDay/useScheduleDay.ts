import { useActivity, useContextWebpart } from '~/hooks';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import {
  TAG,
  PERSON,
  PREFIX,
  ACTIVITY,
  ACTIVITY_NAME,
  ACTIVITY_ENVOLVED_PEOPLE,
  SCHEDULE_DAY,
  SCHEDULE_DAY_ENVOLVED_PEOPLE,
  TEAM,
  SPACE,
  ACTIVITY_DOCUMENTS,
  SCHEDULE_DAY_LOCALE,
  RESOURCES,
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  FINITE_INFINITE_RESOURCES,
  PROGRAM,
} from '~/config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import { EGroups, TYPE_ACTIVITY } from '~/config/enums';
import BatchMultidata from '~/utils/BatchMultidata';
import { useState } from 'react';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import useResource from '../useResource/useResource';

interface IUseActivity {
  schedule: any[];
  count: number;
  loading: boolean;
  nextLink: string;
  addUpdateSchedule: (
    schedule: any,
    teamId: string,
    programId: string,
    options?: IExceptionOption,
    hasRefetch?: boolean
  ) => void;
  desactiveSchedule: (
    id: string,
    activities: any[],
    options?: IExceptionOption
  ) => void;
  updateEnvolvedPerson: (
    id: any,
    scheduleId: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  updateSchedule: (
    id: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  getScheduleByTeamId: (teamId: string) => Promise<any>;
  getSchedule: (filter: IFilterProps) => Promise<any>;
  refetch: any;
  error: any;
}

interface IFilterProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  typeActivity?:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
  type?: string;
  date?: string;
  teamId?: string;
  createdBy?: string;
  filterTeam?: boolean;
  groupPermition?: EGroups;
  model?: boolean;
  group?: 'Todos' | 'Sim' | 'Não';
  published?: 'Todos' | 'Sim' | 'Não';
  orderBy?: string;
  modality?: string;
  module?: string;
  rowsPerPage?: number;
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
        p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);

        return p;
      });

    if (filtro.date) {
      f.filterPhrase(
        `${PREFIX}data gt '${filtro.date}' and ${PREFIX}data lt '${moment(
          filtro.date,
          'YYYY-MM-DD'
        )
          .add(1, 'd')
          .format('YYYY-MM-DD')}'`
      );
    }

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    // tslint:disable-next-line: no-unused-expression
    f.filterExpression(`${PREFIX}modelo`, 'eq', !!filtro.model);

    // tslint:disable-next-line: no-unused-expression
    filtro.groupPermition &&
      f.filterExpression(
        `${PREFIX}grupopermissao`,
        'eq',
        filtro.groupPermition
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.group &&
      filtro.group !== 'Todos' &&
      f.filterExpression(
        `${PREFIX}agrupamentoatividade`,
        'eq',
        filtro.group === 'Sim'
      );

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
    filtro.module &&
      f.filterExpression(
        `${PREFIX}Modulo/${PREFIX}etiquetaid`,
        'eq',
        filtro.module
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    if (filtro.typeActivity) {
      f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
    }

    // tslint:disable-next-line: no-unused-expression
    (filtro?.teamId || filtro?.filterTeam) &&
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro?.teamId || null
      );

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`${PREFIX}data asc`);
  }

  query.expand(
    `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Temperatura,${PREFIX}Local,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

const useScheduleDay = (
  filter: IFilterProps,
  options?: IOptions
): IUseActivity[] => {
  const query = buildQuery(filter);
  const { context } = useContextWebpart();
  const useAxios = axios({ context: context });

  const [loading, setLoading] = useState(false);
  const [{ addOrUpdateByActivities }] = useResource({}, { manual: true });
  const [{ getActivityByScheduleId }] = useActivity({}, { manual: true });

  let headers = {};

  if (filter.rowsPerPage) {
    headers = {
      Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
    };
  }

  const [{ data, error }, refetch] = useAxios(
    {
      url: `${SCHEDULE_DAY}${query}`,
      headers,
    },
    {
      useCache: false,
      manual: !!options?.manual,
    }
  );

  const [{}, executeRequest] = useAxios(
    {
      url: `${SCHEDULE_DAY}${query}`,
      headers,
    },
    {
      useCache: false,
      manual: true,
    }
  );

  const getScheduleId = (scheduleId): Promise<any> => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) =>
        f.filterExpression(`${PREFIX}cronogramadediaid`, 'eq', scheduleId)
      );

      query.expand(
        `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
      );

      executeRequest({
        url: `${SCHEDULE_DAY}${query.toQuery()}`,
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

  const getSchedule = (filter: IFilterProps) => {
    return new Promise((resolve, reject) => {
      const getQuery = buildQuery(filter);

      executeRequest({
        url: `${SCHEDULE_DAY}${getQuery}`,
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

  const getScheduleByTeamId = (teamId) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);
        return f;
      });

      query.expand(
        `${PREFIX}CronogramadeDia_Atividade,${PREFIX}CronogramadeDia_PessoasEnvolvidas,${PREFIX}Turma,${PREFIX}Modulo,${PREFIX}Modalidade,${PREFIX}Local,${PREFIX}Temperatura,${PREFIX}CronogramadeDia_LocalCronogramaDia,${PREFIX}Compartilhamento`
      );

      query.orderBy(`${PREFIX}data asc`);

      refetch({
        url: `${SCHEDULE_DAY}${query.toQuery()}`,
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

  const buildItem = (schedule) => {
    const res = {
      [`${PREFIX}nome`]: schedule.name,
      [`${PREFIX}modelo`]: schedule.model,
      [`${PREFIX}anexossincronizados`]: schedule.anexossincronizados,
      [`${PREFIX}modeloid`]: schedule.modeloid,
      [`${PREFIX}baseadoemcronogramadiamodelo`]:
        schedule.baseadoemcronogramadiamodelo,
      [`${PREFIX}agrupamentoatividade`]: schedule.isGroupActive,
      [`${PREFIX}duracao`]: schedule.duration
        ? schedule.duration?.format('HH:mm')
        : null,
      [`${PREFIX}inicio`]: schedule.startTime
        ? schedule.startTime?.format('HH:mm')
        : null,
      [`${PREFIX}fim`]: schedule.endTime
        ? schedule.endTime?.format('HH:mm')
        : null,
      [`${PREFIX}observacao`]:
        schedule.observation || schedule?.[`${PREFIX}observacao`],
      [`${PREFIX}data`]: schedule.date && moment.utc(schedule.date).format(),
      [`${PREFIX}Modulo@odata.bind`]: schedule?.module
        ? `/${TAG}(${schedule?.module?.[`${PREFIX}etiquetaid`]})`
        : null,
      [`${PREFIX}Modalidade@odata.bind`]: schedule?.modality
        ? `/${TAG}(${schedule?.modality?.[`${PREFIX}etiquetaid`]})`
        : null,
      [`${PREFIX}Ferramenta@odata.bind`]: schedule?.tool
        ? `/${TAG}(${schedule?.tool?.[`${PREFIX}etiquetaid`]})`
        : null,
      [`${PREFIX}FerramentaBackup@odata.bind`]: schedule?.toolBackup
        ? `/${TAG}(${schedule?.toolBackup?.[`${PREFIX}etiquetaid`]})`
        : null,
      [`${PREFIX}Local@odata.bind`]: schedule?.place?.[`${PREFIX}etiquetaid`]
        ? `/${TAG}(${schedule?.place?.[`${PREFIX}etiquetaid`]})`
        : null,
      [`${PREFIX}Turma@odata.bind`]:
        schedule?.teamId && `/${TEAM}(${schedule?.teamId})`,
      [`${PREFIX}Programa@odata.bind`]:
        schedule?.programId && `/${PROGRAM}(${schedule?.programId})`,
      [`${PREFIX}Temperatura@odata.bind`]:
        schedule?.temperature && `/${TAG}(${schedule?.temperature?.value})`,
      [`${PREFIX}link`]: schedule.link,
      [`${PREFIX}linkbackup`]: schedule.linkBackup,
    };

    if (!schedule?.id) {
      res[`${PREFIX}CriadoPor@odata.bind`] =
        schedule?.user && `/${PERSON}(${schedule?.user})`;
      res[`${PREFIX}grupopermissao`] = schedule?.group;
    }

    return res;
  };

  const buildItemActivity = (activity) => {
    let res = {
      deleted: activity.deleted,
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
      [`${PREFIX}AreaAcademica@odata.bind`]:
        activity?.area && `/${TAG}(${activity?.area?.[`${PREFIX}etiquetaid`]})`,
      [`${PREFIX}Temperatura@odata.bind`]:
        activity?.temperature && `/${TAG}(${activity?.temperature?.value})`,
    };

    if (activity?.teamId) {
      res[`${PREFIX}Turma@odata.bind`] = `/${TEAM}(${activity?.teamId})`;
    }

    if (activity?.programId) {
      res[
        `${PREFIX}Programa@odata.bind`
      ] = `/${PROGRAM}(${activity?.programId})`;
    }

    if (activity?.scheduleId) {
      res[
        `${PREFIX}CronogramaDia@odata.bind`
      ] = `/${SCHEDULE_DAY}(${activity?.scheduleId})`;
    }

    return res;
  };

  const buildItemFantasyName = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}nome`]: item.name || item?.[`${PREFIX}nome`],
      [`${PREFIX}nomeen`]: item.nameEn || item?.[`${PREFIX}nomeen`],
      [`${PREFIX}nomees`]: item.nameEs || item?.[`${PREFIX}nomees`],
      [`${PREFIX}uso`]: item.use || item?.[`${PREFIX}uso`],
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

  const buildItemLocale = (item) => {
    return {
      id: item.id,
      deleted: item.deleted,
      [`${PREFIX}Espaco@odata.bind`]:
        item?.space || item?.[`_${PREFIX}espaco_value`]
          ? `/${SPACE}(${
              item?.space?.value || item?.[`_${PREFIX}espaco_value`]
            })`
          : null,
      [`${PREFIX}observacao`]: item?.observation,
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

  const addUpdateSchedule = async (
    schedule: any,
    teamId: string,
    programId: string,
    { onSuccess, onError },
    hasRefetch: boolean = true
  ) =>
    new Promise(async (resolve, reject) => {
      setLoading(true);

      const batch = new BatchMultidata(executeRequest);

      try {
        let dataToSave = buildItem({
          ...schedule,
          teamId: teamId,
          programId: programId,
        });
        let scheduleId = schedule?.id;

        if (scheduleId) {
          batch.patch(SCHEDULE_DAY, scheduleId, dataToSave);
        } else {
          const response = await executeRequest({
            url: SCHEDULE_DAY,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          scheduleId = response.data?.[`${PREFIX}cronogramadediaid`];

          if (teamId) {
            await executeRequest({
              url: `${SCHEDULE_DAY}(${scheduleId})/${PREFIX}Turma/$ref`,
              method: 'PUT',
              data: {
                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                '@odata.id': `${TEAM}(${teamId})`,
              },
            });
          }
        }

        schedule.activities
          .filter((e) => !(!e?.[`${PREFIX}atividadeid`] && e.deleted))
          .forEach((activity) => {
            if (!activity?.[`${PREFIX}atividadeid`]) {
              const requestId = batch.postRelationship(
                ACTIVITY,
                SCHEDULE_DAY,
                scheduleId,
                'CronogramadeDia_Atividade',
                buildItemActivity({
                  ...activity,
                  teamId: teamId,
                  scheduleId: scheduleId,
                  programId: programId,
                })
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_ENVOLVED_PEOPLE,
                requestId,
                'Atividade_PessoasEnvolvidas',
                activity?.people
                  ?.filter((e) => !(!e.id && e.deleted))
                  ?.map((pe) => buildItemPeople(pe))
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_DOCUMENTS,
                requestId,
                'Atividade_Documento',
                activity?.documents
                  ?.filter((e) => !e.id && !e.deleted)
                  ?.map((pe) => buildItemDocument(pe))
              );

              batch.bulkPostReference(
                SPACE,
                activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
                requestId,
                'Atividade_Espaco'
              );

              batch.bulkPostReference(
                TAG,
                activity?.equipments?.map(
                  (spc) => spc?.[`${PREFIX}etiquetaid`]
                ),
                requestId,
                'Atividade_Equipamentos'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.finiteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResource?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                requestId,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkDeleteReference(
                FINITE_INFINITE_RESOURCES,
                activity?.infiniteResourceToDelete?.map(
                  (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
                ),
                activity?.id,
                'Atividade_RecursoFinitoInfinito'
              );

              batch.bulkPostRelationshipReference(
                ACTIVITY_NAME,
                requestId,
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
                    academicRequest?.people?.map((pe) =>
                      buildItemPeopleAcademicRequest({
                        ...pe,
                        activityId: requestId,
                      })
                    )
                  );
                }
              });
            } else if (!activity.deleted) {
              batch.patch(
                ACTIVITY,
                activity?.[`${PREFIX}atividadeid`],
                buildItemActivity({
                  ...activity,
                  teamId: teamId,
                  scheduleId: scheduleId,
                  programId: programId,
                })
              );
            }

            if (activity?.[`${PREFIX}atividadeid`] && activity.deleted) {
              batch.patch(ACTIVITY, activity?.[`${PREFIX}atividadeid`], {
                [`${PREFIX}ativo`]: false,
              });

              activity?.resources?.forEach((res) => {
                batch.patch(RESOURCES, res?.[`${PREFIX}recursosid`], {
                  [`${PREFIX}excluido`]: true,
                });
              });
            }
          });

        batch.bulkPostRelationship(
          SCHEDULE_DAY_ENVOLVED_PEOPLE,
          SCHEDULE_DAY,
          scheduleId,
          'CronogramadeDia_PessoasEnvolvidas',
          schedule?.people
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((pe) => buildItemPeople(pe))
        );

        batch.bulkPostRelationship(
          SCHEDULE_DAY_LOCALE,
          SCHEDULE_DAY,
          scheduleId,
          'CronogramadeDia_LocalCronogramaDia',
          schedule?.locale
            ?.filter((e) => !(!e?.id && e.deleted))
            ?.map((pe) => buildItemLocale(pe))
        );

        await batch.execute();
        if (!schedule?.isLoadModel) {
          await uploadScheduleFiles(schedule, scheduleId);
        }

        if (!schedule.model) {
          const responseActivities = await getActivityByScheduleId(scheduleId);
          const activities = responseActivities?.value?.map((e) => ({
            ...e,
            teamId,
            programId,
            scheduleId,
          }));

          await addOrUpdateByActivities(activities);
        }

        const newSchedule = await getScheduleId(scheduleId);

        setLoading(false);
        onSuccess?.(newSchedule?.value?.[0]);
        resolve(data);

        if (hasRefetch) {
          refetch();
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        onError?.(error);
        reject();
      }
    });

  const updateSchedule = (id, toSave, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executeRequest);

      batch.patch(SCHEDULE_DAY, id, toSave);

      try {
        await batch.execute();

        const activity: any = await getScheduleId(id);
        resolve(activity?.value?.[0]);
        onSuccess?.(activity?.value?.[0]);
      } catch (err) {
        console.error(err);
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const updateEnvolvedPerson = (
    id,
    scheduleId,
    toSave,
    { onSuccess, onError }
  ) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executeRequest);

      batch.patch(SCHEDULE_DAY_ENVOLVED_PEOPLE, id, toSave);

      try {
        await batch.execute();

        const schedule: any = await getScheduleId(scheduleId);
        resolve(schedule?.value?.[0]);
        onSuccess?.(schedule?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const uploadScheduleFiles = async (schedule, scheduleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (schedule?.anexos?.length) {
          const folder = `Cronograma Dia/${moment(data?.createdon).format(
            'YYYY'
          )}/${scheduleId}`;

          const attachmentsToDelete = schedule?.anexos?.filter(
            (file) => file.relativeLink && file.deveExcluir
          );

          const attachmentsToSave = schedule?.anexos?.filter(
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

  const desactiveSchedule = async (id, activities, { onSuccess, onError }) => {
    try {
      const batch = new BatchMultidata(executeRequest);

      batch.patch(SCHEDULE_DAY, id, {
        [`${PREFIX}ativo`]: false,
      });

      activities.forEach((actId) => {
        batch.patch(ACTIVITY, actId, {
          [`${PREFIX}ativo`]: false,
        });
      });

      await batch.execute();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      onError?.(error);
    }
  };

  return [
    {
      schedule: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      loading: loading,
      error,
      getSchedule,
      getScheduleByTeamId,
      addUpdateSchedule,
      updateSchedule,
      desactiveSchedule,
      updateEnvolvedPerson,
      refetch,
    },
  ];
};

export default useScheduleDay;
