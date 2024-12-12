import api from '~/services/api';
import {
  PREFIX,
  PROGRAM,
  PROGRAM_ENVOLVED_PEOPLE,
  PROGRAM_NAME,
  RELATED_TEAM,
  TEAM,
} from '~/config/database';
import {
  buildAdvancedQuery,
  buildItem,
  buildItemFantasyName,
  buildItemPeople,
  buildQuery,
  IFilterProps,
} from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { addOrUpdateTeam } from '../team/actions';
import { AppState } from '~/store';
import { getActivities, getActivityByProgramId } from '../activity/actions';
import {
  ACTION_DELETE,
  BASE_URL_API_NET,
  ENV,
  REFERENCE_DELETE,
  TypeBlockUpdated,
} from '~/config/constants';
import {
  executeEventDeleteOutlook,
  executeEventOutlook,
} from '../eventOutlook/actions';
import { EActivityTypeApplication, EFatherTag } from '~/config/enums';
import {
  addOrUpdateByActivities,
  deleteByActivities,
} from '../resource/actions';

export const fetchAllPrograms =
  (filter: IFilterProps): any =>
  async (dispatch: Dispatch<any>) => {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${PROGRAM}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const fetchAdvancedPrograms = (filter: string): any =>
  new Promise(async (resolve, reject) => {
    try {
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await api.post(
        `${BASE_URL_API_NET}Programa`,
        { queryString: filter || '', ev: ENV },
        axiosConfig
      );

      resolve(data);
    } catch (error) {
      console.error(error);
    }
  });

export const getPrograms = (filter: IFilterProps): any =>
  new Promise(async (resolve, reject) => {
    try {
      const query = buildQuery(filter);
      let headers = {};

      if (filter.rowsPerPage) {
        headers = {
          Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
      }
      const { data } = await api.get(`${PROGRAM}${query}`, {
        headers,
      });

      resolve(data?.value);
    } catch (error) {
      console.error(error);
    }
  });

export const getProgramId = (programId): Promise<any> => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}programaid`, 'eq', programId)
    );

    query.expand(
      `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
    );

    api({
      url: `${PROGRAM}${query.toQuery()}`,
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

export const getProgramByIds = (programIds: string[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!programIds.length) {
      resolve([]);
      return;
    }
    var query = new QueryBuilder().filter((f) => {
      f.or((p) => {
        programIds.forEach((id) =>
          p.filterExpression(`${PREFIX}programaid`, 'eq', id)
        );

        return p;
      });

      return f;
    });

    query.expand(
      `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
    );

    api({
      url: `${PROGRAM}${query.toQuery()}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const addOrUpdateProgram =
  (
    program,
    { onSuccess, onError },
    temperatureChanged?: boolean,
    isUndo?: boolean
  ): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) => {
    try {
      const dataToSave: any = buildItem(program);

      const batch = new BatchMultidata(api);
      let programId = program?.id;

      if (programId) {
        const programRequest = await getProgramId(programId);
        const programSaved = programRequest?.value?.[0];

        const { currentUser } = getState().app;

        if (
          programSaved?.[`_${PREFIX}editanto_value`] &&
          programSaved?.[`_${PREFIX}editanto_value`] !==
            currentUser?.[`${PREFIX}pessoaid`]
        ) {
          const err = {
            data: {
              error: {
                message: `Outra pessoa está editando este programa!`,
              },
            },
          };

          onError?.(err, programSaved);
          return;
        }
      }

      if (programId) {
        batch.patch(PROGRAM, programId, dataToSave);
      } else {
        const response = await api({
          url: program.id ? `${PROGRAM}(${program.id})` : `${PROGRAM}`,
          method: program?.id ? 'PATCH' : 'POST',
          data: dataToSave,
          headers: {
            Prefer: 'return=representation',
          },
        });

        programId = response.data?.[`${PREFIX}programaid`];
      }

      batch.bulkPostRelationship(
        PROGRAM_NAME,
        PROGRAM,
        programId,
        'Programa_NomePrograma',
        program?.names?.map((name) => buildItemFantasyName(name))
      );

      batch.bulkPostRelationship(
        PROGRAM_ENVOLVED_PEOPLE,
        PROGRAM,
        programId,
        'Programa_PessoasEnvolvidas',
        program?.people
          ?.filter((e) => !(!e?.id && e.deleted))
          ?.map((name, idx) => buildItemPeople(name, idx))
      );

      program?.relatedClass?.forEach((elm) => {
        if (elm.id) {
          if (elm.deleted) {
            batch.delete(RELATED_TEAM, elm.id);
            return;
          }

          batch.patch(RELATED_TEAM, elm.id, {
            [`${PREFIX}Programa@odata.bind`]: `/${PROGRAM}(${programId})`,
            [`${PREFIX}Turma@odata.bind`]: elm?.team?.[`${PREFIX}turmaid`]
              ? `/${TEAM}(${elm?.team?.[`${PREFIX}turmaid`]})`
              : null,
            [`${PREFIX}TurmaRelacionada@odata.bind`]: elm?.relatedTeam?.[
              `${PREFIX}turmaid`
            ]
              ? `/${TEAM}(${elm?.relatedTeam?.[`${PREFIX}turmaid`]})`
              : null,
          });
        } else {
          batch.post(RELATED_TEAM, {
            [`${PREFIX}Programa@odata.bind`]: `/${PROGRAM}(${programId})`,
            [`${PREFIX}Turma@odata.bind`]: elm?.team?.[`${PREFIX}turmaid`]
              ? `/${TEAM}(${elm?.team?.[`${PREFIX}turmaid`]})`
              : null,
            [`${PREFIX}TurmaRelacionada@odata.bind`]: elm?.relatedTeam?.[
              `${PREFIX}turmaid`
            ]
              ? `/${TEAM}(${elm?.relatedTeam?.[`${PREFIX}turmaid`]})`
              : null,
          });
        }
      });

      await batch.execute();

      // If the program has Team
      for (let i = 0; i < program?.teams?.length; i++) {
        const team = program?.teams[i];

        await dispatch(
          addOrUpdateTeam(team, programId, {
            onSuccess: () => {},
            onError: () => {},
          })
        );
      }

      if (!program.isLoadModel) {
        const { context } = getState().app;
        await uploadProgramFiles(program, programId, context);
      }

      const newProgram = await getProgramId(programId);
      const { app, tag, environmentReference } = getState();
      const { context } = app;
      const { dictTag } = tag;
      const { references } = environmentReference;

      const activities = await getActivities({
        programId,
        typeApplication: EActivityTypeApplication.APLICACAO,
        active: 'Ativo',
      });

      if (
        program?.temperature?.[`${PREFIX}nome`] !== EFatherTag.CONTRATADO &&
        temperatureChanged
      ) {
        await deleteByActivities(
          activities,
          { references },
          {
            type: TypeBlockUpdated.Programa,
            id: programId,
          }
        );
      } else if (
        program?.temperature?.[`${PREFIX}nome`] === EFatherTag.CONTRATADO
      ) {
        await addOrUpdateByActivities(
          activities,
          { references, dictTag },
          {
            programId,
          },
          {
            type: TypeBlockUpdated.Programa,
            id: programId,
            temperatureId: program?.temperature?.[`${PREFIX}etiquetaid`],
            changeTemperature: temperatureChanged,
            isUndo
          }
        );
      }

      onSuccess?.(newProgram?.value?.[0]);
    } catch (error) {
      console.log(error);
      onError?.(error);
    }
  };

export const deleteProgram =
  (programId: string, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const eventsToDelete = [];
      const batch = new BatchMultidata(api);
      const { environmentReference, space, person, app } = getState();
      const { dictSpace } = space;
      const { dictPeople } = person;

      batch.patch(PROGRAM, programId, {
        [`${PREFIX}ativo`]: false,
        [`${PREFIX}excluido`]: true,
      });

      const activityRequest = await getActivityByProgramId(programId);
      const activities = activityRequest?.value;

      activities?.forEach((elm) => {
        elm?.[`${PREFIX}recursos_Atividade`].forEach((resourceToDelete) => {
          const spaceid = resourceToDelete?.[`_${PREFIX}espaco_value`];
          const personid = resourceToDelete?.[`_${PREFIX}pessoa_value`];

          eventsToDelete.push({
            action: ACTION_DELETE,
            title: elm?.[`${PREFIX}nome`],
            email:
              dictSpace?.[spaceid]?.[`${PREFIX}email`] ||
              dictPeople?.[personid]?.[`${PREFIX}email`],
            activity: elm,
            start: moment(resourceToDelete?.[`${PREFIX}inicio`]).format(),
            end: moment(resourceToDelete?.[`${PREFIX}fim`]).format(),
            resourceId: resourceToDelete?.[`${PREFIX}recursosid`],
            eventId: resourceToDelete?.[`${PREFIX}eventoid`],
          });
        });
      });

      try {
        await batch.execute();
        const { references } = environmentReference;
        const { currentUser } = app;

        const reference = references?.find(
          (e) => e?.[`${PREFIX}nome`] === REFERENCE_DELETE
        );

        const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Origem: 'Programa',
            IDOrigem: programId,
            IDPessoa: currentUser?.[`${PREFIX}pessoaid`],
          }),
        });

        await executeEventDeleteOutlook(
          { id: programId, type: TypeBlockUpdated.Programa },
          { onSuccess: () => null, onError: () => null }
        );
        await fetchResponse.text();

        resolve('Sucesso');
        onSuccess?.();
      } catch (err) {
        console.error(err);
        reject?.(err);
        onError?.(err);
      }
    });

export const updateProgram = (id, toSave, { onSuccess, onError }): any => {
  return new Promise(async (resolve, reject) => {
    const batch = new BatchMultidata(api);

    batch.patch(PROGRAM, id, toSave);

    try {
      await batch.execute();

      const activity: any = await getProgramId(id);
      resolve(activity?.value?.[0]);
      onSuccess?.(activity?.value?.[0]);
    } catch (err) {
      reject?.(err);
      onError?.(err);
    }
  });
};

export const updateEnvolvedPerson =
  (id, programId, toSave, { onSuccess, onError }): any =>
  async (dispatch: Dispatch<any>) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(api);

      batch.patch(PROGRAM_ENVOLVED_PEOPLE, id, toSave);

      try {
        await batch.execute();

        const program: any = await getProgramId(programId);
        resolve(program?.value?.[0]);
        onSuccess?.(program?.value?.[0]);
      } catch (err) {
        reject?.(err);
        onError?.(err);
      }
    });
  };

export const uploadProgramFiles = (program, programId, context) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (program?.anexos?.length) {
        const folder = `Programa/${moment(program?.createdon).format(
          'YYYY'
        )}/${programId}`;

        const attachmentsToDelete = program?.anexos?.filter(
          (file) => file.relativeLink && file.deveExcluir
        );

        const attachmentsToSave = program?.anexos?.filter(
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
      console.log(err);
      reject(err);
    }
  });
};
