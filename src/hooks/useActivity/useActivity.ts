import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import {
  TAG,
  SPACE,
  PERSON,
  PREFIX,
  ACTIVITY,
  ACTIVITY_NAME,
  ACTIVITY_DOCUMENTS,
  ACTIVITY_ENVOLVED_PEOPLE,
  SCHEDULE_DAY,
  ACADEMIC_REQUESTS,
  ACADEMIC_REQUESTS_ENVOLVED_PEOPLE,
  FINITE_INFINITE_RESOURCES,
} from '~/config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import { BUSINESS_UNITY } from '~/config/constants';
import { EActivityTypeApplication, TYPE_ACTIVITY } from '~/config/enums';
import removeEmptyPropertyFromObject from '~/utils/removeEmptyPropertyFromObject';
import BatchMultidata from '~/utils/BatchMultidata';
import { useState } from 'react';
import useResource from '../useResource/useResource';
import useContextWebpart from '../useContextWebpart';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';

interface IUseActivity {
  activities: any[];
  count: number;
  loading: boolean;
  postLoading: boolean;
  loadingSave: boolean;
  nextLink: string;
  addOrUpdateActivity: (
    activity: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  updateActivityAll: (
    activity: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  bulkUpdateActivity: (toUpdate: any, options?: IExceptionOption) => void;
  desactiveActivity: (toUpdate: any, options?: IExceptionOption) => void;
  addOrUpdateClassroom: (
    toUpdate: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  addOrUpdateDocuments: (
    toUpdate: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  addOrUpdatePerson: (
    toUpdate: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  addOrUpdateObservation: (
    toUpdate: any,
    options?: IExceptionOption
  ) => Promise<unknown>;
  activeActivity: (toUpdate: any, options?: IExceptionOption) => void;
  bulkAddUpdateActivity: (
    activities: any[],
    activitiesToDelete: any[],
    teamId: string,
    typeApplication:
      | EActivityTypeApplication.APLICACAO
      | EActivityTypeApplication.MODELO,
    options?: IExceptionOption
  ) => void;
  addOrUpdateFantasyName: (toUpdate: any, options?: IExceptionOption) => void;
  updateActivity: (
    id: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  updateEnvolvedPerson: (
    id: any,
    activityId: any,
    toSave: any,
    {
      onSuccess,
      onError,
    }: {
      onSuccess: any;
      onError: any;
    }
  ) => Promise<any>;
  getActivity: (id) => Promise<any>;
  changeActivityDate: (
    activity: any,
    previousSchedule: any,
    newSchedule: any,
    options?: IExceptionOption
  ) => Promise<any>;
  getActivityByTeamId: (teamId: string) => Promise<any>;
  getActivityByScheduleId: (scheduleId: string) => Promise<any>;
  refetch: any;
  error: any;
}

interface IFilterProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  typeApplication?:
    | EActivityTypeApplication.PLANEJAMENTO
    | EActivityTypeApplication.AGRUPAMENTO
    | EActivityTypeApplication.MODELO
    | EActivityTypeApplication.MODELO_REFERENCIA
    | EActivityTypeApplication.APLICACAO;
  typeActivity?:
    | TYPE_ACTIVITY.ACADEMICA
    | TYPE_ACTIVITY.NON_ACADEMICA
    | TYPE_ACTIVITY.INTERNAL;
  type?: string;
  teamId?: string;
  orderBy?: string;
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
        p.filterPhrase(`contains(${PREFIX}duracao,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}temaaula,'${filtro.searchQuery}')`);

        return p;
      });

    // tslint:disable-next-line: no-unused-expression
    filtro.active &&
      filtro.active !== 'Todos' &&
      f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');

    if (filtro.typeActivity) {
      f.filterExpression(`${PREFIX}tipo`, 'eq', filtro.typeActivity);
    }

    f.filterExpression(`${PREFIX}tipoaplicacao`, 'eq', filtro.typeApplication);

    // tslint:disable-next-line: no-unused-expression
    filtro?.teamId &&
      f.filterExpression(
        `${PREFIX}Turma/${PREFIX}turmaid`,
        'eq',
        filtro?.teamId
      );
    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  }

  query.expand(
    `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
  );

  query.count();
  return query.toQuery();
};

const useActivity = (
  filter: IFilterProps,
  options?: IOptions
): IUseActivity[] => {
  const { context } = useContextWebpart();
  const useAxios = axios({ context: context });

  const query = buildQuery(filter);
  const [loadingSave, setLoadingSave] = useState(false);
  const [{ addOrUpdateByActivity, deleteByActivity }] = useResource(
    {},
    { manual: true }
  );

  let headers = {};

  if (filter.rowsPerPage) {
    headers = {
      Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
    };
  }

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${ACTIVITY}${query}`,
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
      url: `${ACTIVITY}`,
      method: 'POST',
    },
    { manual: true }
  );

  const getActivity = (id) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) =>
        f.filterExpression(`${PREFIX}atividadeid`, 'eq', id)
      );

      query.expand(
        `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
      );

      query.count();
      executePost({
        url: `${ACTIVITY}${query.toQuery()}`,
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

  const getActivityByScheduleId = (scheduleId: string) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) => {
        f.filterPhrase(
          `${PREFIX}CronogramadeDia_Atividade/any(c: c/${PREFIX}cronogramadediaid eq '${scheduleId}')`
        );

        f.filterExpression(`${PREFIX}ativo`, 'eq', true);

        return f;
      });

      query.expand(
        `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
      );

      query.count();
      executePost({
        url: `${ACTIVITY}${query.toQuery()}`,
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

  const getActivityByTeamId = (teamId: string) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
        f.filterExpression(`${PREFIX}ativo`, 'eq', true);

        return f;
      });

      query.expand(
        `${PREFIX}Atividade_NomeAtividade,${PREFIX}Atividade_Espaco,${PREFIX}Atividade_Equipamentos,${PREFIX}Temperatura,${PREFIX}Atividade_Documento,${PREFIX}Atividade_PessoasEnvolvidas,${PREFIX}AreaAcademica,${PREFIX}Curso,${PREFIX}CronogramadeDia_Atividade,${PREFIX}recursos_Atividade,${PREFIX}CronogramadeDia_Atividade,${PREFIX}RequisicaoAcademica_Atividade,${PREFIX}PessoasRequisica_Atividade,${PREFIX}Atividade_RecursoFinitoInfinito,${PREFIX}AreaAcademicaAprovadaPor,${PREFIX}Espaco_Aprovador_Por`
      );

      query.count();
      executePost({
        url: `${ACTIVITY}${query.toQuery()}`,
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

  const getActivityByName = (name, type) => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) => {
        f.filterPhrase(
          `contains(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`
        );

        f.filterExpression(`${PREFIX}tipo`, 'eq', type);

        f.filterExpression(
          `${PREFIX}tipoaplicacao`,
          'eq',
          EActivityTypeApplication.PLANEJAMENTO
        );

        return f;
      });

      query.count();
      executePost({
        url: `${ACTIVITY}${query.toQuery()}`,
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

  const buildItem = (activity) => {
    return {
      [`${PREFIX}nome`]: activity.name,
      [`${PREFIX}tipo`]: activity.type || activity?.[`${PREFIX}tipo`],
      [`${PREFIX}temaaula`]: activity.theme,
      [`${PREFIX}observacao`]: activity.observation,
      [`${PREFIX}descricaoobjetivo`]: activity.description,
      [`${PREFIX}quantidadesessao`]: activity.quantity || 0,
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
      [`${PREFIX}Temperatura@odata.bind`]:
        activity?.temperature && `/${TAG}(${activity?.temperature?.value})`,
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
        item?.function?.value || item?.[`_${PREFIX}funcao_value`]
          ? `/${TAG}(${
              item?.function?.value || item?.[`_${PREFIX}funcao_value`]
            })`
          : null,
      [`${PREFIX}Atividade@odata.bind`]: '$' + item.activityId,
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
      [`${PREFIX}link`]: item.link,
      [`${PREFIX}nomemoodle`]: item.nomemoodle,
      [`${PREFIX}momentoentrega`]: item.delivery,
      [`${PREFIX}dataentrega`]: item.deliveryDate && item.deliveryDate.format(),
    };
  };

  const addOrUpdateActivity = async (activity, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const activitySavedByName: any = await getActivityByName(
        activity.name,
        activity.type
      );

      if (activitySavedByName?.value?.length) {
        const err = {
          data: {
            error: {
              message: `${
                activity.type === TYPE_ACTIVITY.ACADEMICA
                  ? 'Atividade acadêmica'
                  : activity.type === TYPE_ACTIVITY.NON_ACADEMICA
                  ? 'Atividade não acadêmica'
                  : 'Atividade interna'
              } já cadastrada!`,
            },
          },
        };

        if (activity.id) {
          const othersActivitySavedByName = activitySavedByName?.value?.filter(
            (tg) => tg?.[`${PREFIX}recursofinitoinfinitoid`] !== activity.id
          );

          if (othersActivitySavedByName.length) {
            onError?.(err);
          }
          return;
        } else {
          onError?.(err);
          return;
        }
      }

      let dataToSave = buildItem(activity);
      dataToSave = removeEmptyPropertyFromObject(dataToSave);

      if (activity.id) {
        const newSpaces = activity.spaces?.map((tag) => tag.value);
        for (let j = 0; j < activity.previousSpace.length; j++) {
          const rel = activity.previousSpace[j];

          if (!newSpaces?.includes(rel[`${PREFIX}espacoid`])) {
            await executePost({
              url: `${SPACE}(${
                rel[`${PREFIX}espacoid`]
              })/${PREFIX}Atividade_Espaco(${activity.id})/$ref`,
              method: 'DELETE',
            });
          }
        }
      }

      executePost({
        url: activity.id ? `${ACTIVITY}(${activity.id})` : `${ACTIVITY}`,
        method: activity?.id ? 'PATCH' : 'POST',
        headers: {
          Prefer: 'return=representation',
        },
        data: dataToSave,
      })
        .then(async ({ data }) => {
          if (activity?.spaces?.length) {
            for (let j = 0; j < activity.spaces.length; j++) {
              const rel = activity.spaces[j];

              await executePost({
                url: `${ACTIVITY}(${
                  data?.[`${PREFIX}atividadeid`]
                })/${PREFIX}Atividade_Espaco/$ref`,
                method: 'PUT',
                data: {
                  '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                  '@odata.id': `${SPACE}(${rel.value})`,
                },
              });
            }
          }

          const newActv: any = await getActivity(
            data?.[`${PREFIX}atividadeid`]
          );

          onSuccess?.(newActv?.value?.[0]);
          resolve(data);
        })
        .catch(({ response }) => {
          onError?.(response);
          reject(response);
        });
    });
  };

  const updateActivityAll = async (activity, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      setLoadingSave(true);

      try {
        let dataToSave = buildItem(activity);
        dataToSave = removeEmptyPropertyFromObject(dataToSave);
        const batch = new BatchMultidata(executePost);

        const requestId = batch.patch(
          ACTIVITY,
          activity?.[`${PREFIX}atividadeid`],
          dataToSave
        );

        batch.bulkPostRelationshipReference(
          ACTIVITY_ENVOLVED_PEOPLE,
          requestId,
          'Atividade_PessoasEnvolvidas',
          activity?.people?.map((pe) => buildItemPeople(pe))
        );

        batch.bulkPostReference(
          SPACE,
          activity?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`]),
          requestId,
          'Atividade_Espaco'
        );

        batch.bulkPostReference(
          TAG,
          activity?.equipments?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
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
          activity?.[`${PREFIX}atividadeid`],
          'Atividade_RecursoFinitoInfinito'
        );

        batch.bulkDeleteReferenceParent(
          ACTIVITY,
          activity?.spacesToDelete?.map((spc) => spc?.[`${PREFIX}espacoid`]),
          activity?.[`${PREFIX}atividadeid`],
          'Atividade_Espaco'
        );

        batch.bulkDeleteReferenceParent(
          ACTIVITY,
          activity?.finiteInfiniteResourceToDelete?.map(
            (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
          ),
          activity?.[`${PREFIX}atividadeid`],
          'Atividade_RecursoFinitoInfinito'
        );

        batch.bulkDeleteReference(
          TAG,
          activity?.equipmentsToDelete?.map(
            (spc) => spc?.[`${PREFIX}etiquetaid`]
          ),
          activity?.[`${PREFIX}atividadeid`],
          'Atividade_Equipamentos'
        );

        batch.bulkPostRelationshipReference(
          ACTIVITY_NAME,
          requestId,
          'Atividade_NomeAtividade',
          activity?.names?.map((name) => buildItemFantasyName(name))
        );

        batch.bulkPostRelationshipReference(
          ACTIVITY_DOCUMENTS,
          requestId,
          'Atividade_Documento',
          activity?.documents
            ?.filter((e) => !(!e.id && e.deleted))
            ?.map((pe) => buildItemDocument(pe))
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
                ?.filter((e) => !(!e.id && e.deleted))
                ?.map((pe) =>
                  buildItemPeopleAcademicRequest({
                    ...pe,
                    activityId: requestId,
                  })
                )
            );
          }
        });

        await batch.execute();

        if (
          activity?.[`${PREFIX}tipoaplicacao`] ===
          EActivityTypeApplication.APLICACAO
        ) {
          await addOrUpdateByActivity(activity);
        }

        const actv: any = await getActivity(activity?.[`${PREFIX}atividadeid`]);

        resolve('Success');
        onSuccess?.(actv?.value?.[0]);
        setLoadingSave(false);
      } catch (err) {
        onError?.(err);
        reject(err);
        setLoadingSave(false);
      }
    });
  };

  const updateActivity = (id, toSave, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      batch.patch(ACTIVITY, id, toSave);

      try {
        await batch.execute();

        const activity: any = await getActivity(id);
        resolve(activity?.value?.[0]);
        onSuccess?.(activity?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const updateEnvolvedPerson = (
    id,
    activityId,
    toSave,
    { onSuccess, onError }
  ) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

      batch.patch(ACTIVITY_ENVOLVED_PEOPLE, id, toSave);

      try {
        await batch.execute();

        const activity: any = await getActivity(activityId);
        resolve(activity?.value?.[0]);
        onSuccess?.(activity?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

  const changeActivityDate = async (
    activity,
    previousSchedule,
    newSchedule,
    { onSuccess, onError }
  ) => {
    return new Promise(async (resolve, reject) => {
      setLoadingSave(true);

      try {
        let dataToSave = buildItem(activity);
        dataToSave = removeEmptyPropertyFromObject(dataToSave);
        const batch = new BatchMultidata(executePost);

        const requestId = batch.patch(
          ACTIVITY,
          activity?.[`${PREFIX}atividadeid`],
          dataToSave
        );

        batch.deleteReference(
          ACTIVITY,
          activity?.[`${PREFIX}atividadeid`],
          previousSchedule,
          'CronogramadeDia_Atividade'
        );

        batch.addReference(
          SCHEDULE_DAY,
          requestId,
          newSchedule,
          'CronogramadeDia_Atividade'
        );

        await batch.execute();

        resolve('Success');
        onSuccess?.();
        setLoadingSave(false);
      } catch (err) {
        onError?.(err);
        reject(err);
        setLoadingSave(false);
      }
    });
  };

  const bulkAddUpdateActivity = async (
    activities: any[],
    activitiesToDelete: any[],
    teamId: string,
    typeApplication:
      | EActivityTypeApplication.APLICACAO
      | EActivityTypeApplication.MODELO,
    { onSuccess, onError }
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        const batch = new BatchMultidata(executePost);

        for (let i = 0; i < activities.length; i++) {
          const event = activities[i];

          let dataToSave = buildItem({
            ...event,
            teamId: teamId,
            typeApplication: typeApplication,
          });
          dataToSave = removeEmptyPropertyFromObject(dataToSave);
          let activityId = event?.[`${PREFIX}atividadeid`];

          if (activityId) {
            batch.patch(ACTIVITY, event?.[`${PREFIX}atividadeid`], dataToSave);
          } else {
            const response = await executePost({
              url: `${ACTIVITY}`,
              method: 'POST',
              headers: {
                Prefer: 'return=representation',
              },
              data: dataToSave,
            });

            activityId = response.data?.[`${PREFIX}atividadeid`];
          }

          batch.bulkPostRelationship(
            ACTIVITY_NAME,
            ACTIVITY,
            activityId,
            'Atividade_NomeAtividade',
            event?.names?.map((name) => buildItemFantasyName(name))
          );

          batch.bulkPostRelationship(
            ACTIVITY_ENVOLVED_PEOPLE,
            ACTIVITY,
            activityId,
            'Atividade_PessoasEnvolvidas',
            event?.people?.map((name) => buildItemPeople(name))
          );

          batch.bulkPostRelationship(
            ACTIVITY_DOCUMENTS,
            ACTIVITY,
            activityId,
            'Atividade_Documento',
            event?.documents
              ?.filter((e) => !(!e.id && e.deleted))
              ?.map((pe) => buildItemDocument(pe))
          );

          batch.bulkPostRelationship(
            SPACE,
            ACTIVITY,
            activityId,
            'Atividade_Espaco',
            event?.spaces?.map((spc) => spc?.[`${PREFIX}espacoid`])
          );

          batch.bulkPostRelationship(
            TAG,
            ACTIVITY,
            activityId,
            'Atividade_Equipamentos',
            event?.equipments?.map((spc) => spc?.[`${PREFIX}espacoid`])
          );
        }

        await batch.execute();

        onSuccess?.();
        resolve(data);
        refetch();
      } catch (error) {
        console.error(error);
        onError?.(error);
        reject();
      }
    });

  const addOrUpdateClassroom = async (
    activity,
    { onSuccess, onError },
    returnNewValue: boolean = true
  ) => {
    return new Promise(async (resolve, reject) => {
      const dataToUpdate = {
        [`${PREFIX}temaaula`]: activity.theme,
        [`${PREFIX}descricaoobjetivo`]: activity.description,
      };

      const batch = new BatchMultidata(executePost);
      const requestId = batch.patch(ACTIVITY, activity?.id, dataToUpdate);

      batch.bulkPostReference(
        TAG,
        activity?.equipments?.map((spc) => spc?.[`${PREFIX}etiquetaid`]),
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

      batch.bulkPostReference(
        FINITE_INFINITE_RESOURCES,
        activity?.infiniteResource?.map(
          (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
        ),
        requestId,
        'Atividade_RecursoFinitoInfinito'
      );

      batch.bulkDeleteReference(
        TAG,
        activity?.equipmentsToDelete?.map(
          (spc) => spc?.[`${PREFIX}etiquetaid`]
        ),
        activity?.id,
        'Atividade_Equipamentos'
      );

      batch.bulkDeleteReferenceParent(
        ACTIVITY,
        activity?.finiteInfiniteResourceToDelete?.map(
          (spc) => spc?.[`${PREFIX}recursofinitoinfinitoid`]
        ),
        activity?.id,
        'Atividade_RecursoFinitoInfinito'
      );

      await batch.execute();

      if (returnNewValue) {
        const newActv: any = await getActivity(activity.id);

        onSuccess?.(newActv?.value?.[0]);
      }

      resolve('Success');
    });
  };

  const addOrUpdateDocuments = async (
    activity,
    { onSuccess, onError },
    returnNewValue: boolean = true
  ) => {
    return new Promise(async (resolve, reject) => {
      const tagNames = [];

      try {
        if (activity?.documents?.length) {
          for (let i = 0; i < activity.documents.length; i++) {
            const tagName = activity.documents[i];

            const { data } = await executePost({
              url: tagName?.id
                ? `${ACTIVITY_DOCUMENTS}(${tagName?.id})?$select=${PREFIX}documentosatividadeid`
                : `${ACTIVITY_DOCUMENTS}?$select=${PREFIX}documentosatividadeid`,
              method: tagName?.id ? 'PATCH' : 'POST',
              headers: {
                Prefer: 'return=representation',
              },
              data: {
                [`${PREFIX}fonte`]: tagName.font,
                [`${PREFIX}link`]: tagName.link,
                [`${PREFIX}entrega`]: tagName.delivery,
                [`${PREFIX}nome`]: tagName.name,
              },
            });

            if (!tagName?.id) {
              tagNames.push(
                `${ACTIVITY_DOCUMENTS}(${
                  data?.[`${PREFIX}documentosatividadeid`]
                })`
              );
            }
          }
        }

        if (activity.id) {
          for (let j = 0; j < activity.previousDocuments?.length; j++) {
            const rel = activity.previousDocuments[j];
            const newNames = activity.documents
              ?.map((e) => e.id)
              ?.filter((e) => e);

            if (!newNames?.includes(rel[`${PREFIX}documentosatividadeid`])) {
              await executePost({
                url: `${ACTIVITY_DOCUMENTS}(${
                  rel[`${PREFIX}documentosatividadeid`]
                })`,
                method: 'DELETE',
              });
            }
          }
        }

        for (let j = 0; j < tagNames?.length; j++) {
          const rel = tagNames[j];

          await executePost({
            url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_Documento/$ref`,
            method: 'PUT',
            data: {
              '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
              '@odata.id': rel,
            },
          });
        }

        if (returnNewValue) {
          const newActv: any = await getActivity(activity.id);

          onSuccess?.(newActv?.value?.[0]);
        }

        resolve('Success');
      } catch (error) {
        onError?.(error);
        reject(error);
      }
    });
  };

  const addOrUpdatePerson = async (
    activity,
    { onSuccess, onError },
    returnNewValue: boolean = true
  ) => {
    return new Promise(async (resolve, reject) => {
      const tagNames = [];

      try {
        if (activity?.people?.length) {
          for (let i = 0; i < activity.people.length; i++) {
            const tagName = activity.people[i];

            const { data } = await executePost({
              url: tagName?.id
                ? `${ACTIVITY_ENVOLVED_PEOPLE}(${tagName?.id})?$select=${PREFIX}pessoasenvolvidasatividadeid`
                : `${ACTIVITY_ENVOLVED_PEOPLE}?$select=${PREFIX}pessoasenvolvidasatividadeid`,
              method: tagName?.id ? 'PATCH' : 'POST',
              headers: {
                Prefer: 'return=representation',
              },
              data: {
                [`${PREFIX}Pessoa@odata.bind`]: `/${PERSON}(${
                  tagName?.person?.value || tagName?.[`_${PREFIX}pessoa_value`]
                })`,
                [`${PREFIX}Funcao@odata.bind`]: `/${TAG}(${
                  tagName?.function?.value ||
                  tagName?.[`_${PREFIX}funcao_value`]
                })`,
              },
            });

            if (!tagName?.id) {
              tagNames.push(
                `${ACTIVITY_ENVOLVED_PEOPLE}(${
                  data?.[`${PREFIX}pessoasenvolvidasatividadeid`]
                })`
              );
            }
          }
        }

        if (activity.id) {
          for (let j = 0; j < activity.previousPeople?.length; j++) {
            const rel = activity.previousPeople[j];
            const newNames = activity.people
              ?.map((e) => e.id)
              ?.filter((e) => e);

            if (
              !newNames?.includes(rel[`${PREFIX}pessoasenvolvidasatividadeid`])
            ) {
              await executePost({
                url: `${ACTIVITY_ENVOLVED_PEOPLE}(${
                  rel[`${PREFIX}pessoasenvolvidasatividadeid`]
                })`,
                method: 'DELETE',
              });
            }
          }
        }

        for (let j = 0; j < tagNames.length; j++) {
          const rel = tagNames[j];

          await executePost({
            url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_PessoasEnvolvidas/$ref`,
            method: 'PUT',
            data: {
              '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
              '@odata.id': rel,
            },
          });
        }

        if (returnNewValue) {
          const newActv: any = await getActivity(activity.id);
          onSuccess?.(newActv?.value?.[0]);
        }

        resolve('Success');
      } catch (error) {
        onError?.(error);
        reject(error);
      }
    });
  };

  const addOrUpdateObservation = (activity, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      executePost({
        url: `${ACTIVITY}(${activity.id})`,
        method: 'PATCH',
        headers: {
          Prefer: 'return=representation',
        },
        data: {
          [`${PREFIX}observacao`]: activity.description,
        },
      })
        .then(async () => {
          const newActv: any = await getActivity(activity.id);

          onSuccess?.(newActv?.value?.[0]);
          resolve('Success');
        })
        .catch(({ response }) => {
          onError?.(response);
        });
    });
  };

  const addOrUpdateFantasyName = async (
    activity,
    { onSuccess, onError },
    returnNewValue: boolean = true
  ) => {
    return new Promise(async (resolve, reject) => {
      const tagNames = [];

      try {
        if (activity?.names?.length) {
          for (let i = 0; i < activity.names.length; i++) {
            const tagName = activity.names[i];

            const { data } = await executePost({
              url: tagName?.id
                ? `${ACTIVITY_NAME}(${tagName?.id})`
                : `${ACTIVITY_NAME}`,
              method: tagName?.id ? 'PATCH' : 'POST',
              headers: {
                Prefer: 'return=representation',
              },
              data: {
                [`${PREFIX}nome`]: tagName.name,
                [`${PREFIX}nomeen`]: tagName.nameEn,
                [`${PREFIX}nomees`]: tagName.nameEs,
                [`${PREFIX}uso`]: tagName.use,
              },
            });

            if (!tagName?.id) {
              tagNames.push(
                `${ACTIVITY_NAME}(${data?.[`${PREFIX}nomeatividadeid`]})`
              );
            }
          }
        }

        if (activity.id) {
          for (let j = 0; j < activity.previousNames?.length; j++) {
            const rel = activity.previousNames[j];
            const newNames = activity.names?.map((e) => e.id).filter((e) => e);

            if (!newNames?.includes(rel[`${PREFIX}nomeatividadeid`])) {
              await executePost({
                url: `${ACTIVITY_NAME}(${rel[`${PREFIX}nomeatividadeid`]})`,
                method: 'DELETE',
              });
            }
          }
        }

        for (let j = 0; j < tagNames?.length; j++) {
          const rel = tagNames[j];

          await executePost({
            url: `${ACTIVITY}(${activity?.id})/${PREFIX}Atividade_NomeAtividade/$ref`,
            method: 'PUT',
            data: {
              '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
              '@odata.id': rel,
            },
          });
        }

        if (returnNewValue) {
          const newActv: any = await getActivity(activity.id);

          onSuccess?.(newActv?.value?.[0]);
        }
        resolve('Success');
      } catch (error) {
        onError?.(error);
        reject(error);
      }
    });
  };

  const desactiveActivity = (
    activity,
    { onSuccess, onError },
    returnNewValue: boolean = true
  ) =>
    new Promise(async (resolve, reject) => {
      try {
        let data = {
          [`${PREFIX}tipodesativacao`]: activity.type,
        };

        if (activity.type === 'definitivo') {
          data[`${PREFIX}ativo`] = false;
        }

        if (activity.type === 'temporario') {
          if (
            moment()
              .startOf('day')
              .isSame(moment(activity.start.toISOString()).startOf('day'))
          ) {
            data[`${PREFIX}ativo`] = false;
          }

          data[`${PREFIX}iniciodesativacao`] = activity.start
            .startOf('day')
            .toISOString();
          data[`${PREFIX}fimdesativacao`] = activity.end
            .startOf('day')
            .toISOString();
        }

        executePost({
          url: `${ACTIVITY}(${activity?.data?.[`${PREFIX}atividadeid`]})`,
          method: 'PATCH',
          data,
        })
          .then(({ data }) => {
            onSuccess?.();
            deleteByActivity(activity.data);
            resolve(data);
            if (returnNewValue) {
              refetch();
            }
          })
          .catch(({ response }) => {
            onError?.(response);
            reject(response);
          });
      } catch (error) {
        reject(error);
      }
    });

  const activeActivity = (activity, { onSuccess, onError }) => {
    executePost({
      url: `${ACTIVITY}(${activity?.[`${PREFIX}atividadeid`]})`,
      method: 'PATCH',
      data: {
        [`${PREFIX}ativo`]: true,
      },
    })
      .then(({ data }) => {
        onSuccess?.();
        refetch();
      })
      .catch(({ response }) => {
        onError?.(response);
      });
  };

  const bulkUpdateActivity = async (toUpdate, { onSuccess, onError }) => {
    try {
      for (let i = 0; i < toUpdate.data.length; i++) {
        const activity = toUpdate.data[i];
        await executePost({
          url: `${ACTIVITY}(${activity?.[`${PREFIX}atividadeid`]})`,
          method: 'PATCH',
          data: {
            [`${PREFIX}escolaorigem`]: toUpdate.school,
          },
        });
      }
      onSuccess?.();
      refetch();
    } catch (e) {
      onError?.(e);
    }
  };

  return [
    {
      activities: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      postLoading,
      loading,
      loadingSave: loadingSave,
      error,
      getActivity,
      getActivityByTeamId,
      getActivityByScheduleId,
      addOrUpdateActivity,
      changeActivityDate,
      updateActivityAll,
      addOrUpdatePerson,
      updateEnvolvedPerson,
      addOrUpdateClassroom,
      addOrUpdateDocuments,
      addOrUpdateObservation,
      bulkUpdateActivity,
      updateActivity,
      desactiveActivity,
      activeActivity,
      addOrUpdateFantasyName,
      bulkAddUpdateActivity,
      refetch,
    },
  ];
};

export default useActivity;
