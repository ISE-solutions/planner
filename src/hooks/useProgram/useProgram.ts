import { RELATED_TEAM, TEAM } from './../../config/database';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import {
  PROGRAM,
  PREFIX,
  TAG,
  PERSON,
  PROGRAM_NAME,
  PROGRAM_ENVOLVED_PEOPLE,
} from '~/config/database';
import { IExceptionOption } from '../types';
import axios from '../useAxios/useAxios';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import BatchMultidata from '~/utils/BatchMultidata';
import useTeam from '../useTeam/useTeam';
import { useState } from 'react';
import { EGroups } from '~/config/enums';

interface IUseProgram {
  programs: any[];
  count: number;
  loading: boolean;
  postLoading: boolean;
  loadingSave: boolean;
  nextLink: string;
  updateProgram: (
    id: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  addOrUpdateProgram: (program: any, options?: IExceptionOption) => void;
  updateEnvolvedPerson: (
    id: any,
    programId: any,
    toSave: any,
    options?: IExceptionOption
  ) => Promise<any>;
  refetch: any;
  error: any;
}

interface IFilterProps {
  searchQuery?: string;
  active?: 'Todos' | 'Ativo' | 'Inativo';
  order?: 'desc' | 'asc';
  orderBy?: string;
  createdBy?: string;
  group?: EGroups;
  rowsPerPage?: number;
  model?: boolean;
  typeProgram?: string;
  nameProgram?: string;
  institute?: string;
  company?: string;
}

const buildQuery = (filtro: IFilterProps) => {
  var query = new QueryBuilder().filter((f) => {
    f.filterExpression(`${PREFIX}id`, 'ne', '0');

    // tslint:disable-next-line: no-unused-expression
    filtro?.searchQuery &&
      f.or((p) => {
        p.filterPhrase(`contains(${PREFIX}titulo,'${filtro.searchQuery}')`);
        p.filterPhrase(`contains(${PREFIX}sigla,'${filtro.searchQuery}')`);

        p.filterPhrase(
          `contains(${PREFIX}NomePrograma/${PREFIX}nome,'${filtro.searchQuery}')`
        );

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
    filtro.typeProgram &&
      f.filterExpression(
        `${PREFIX}TipoPrograma/${PREFIX}etiquetaid`,
        'eq',
        filtro.typeProgram
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.nameProgram &&
      f.filterExpression(
        `${PREFIX}NomePrograma/${PREFIX}etiquetaid`,
        'eq',
        filtro.nameProgram
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.institute &&
      f.filterExpression(
        `${PREFIX}Instituto/${PREFIX}etiquetaid`,
        'eq',
        filtro.institute
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.company &&
      f.filterExpression(
        `${PREFIX}Empresa/${PREFIX}etiquetaid`,
        'eq',
        filtro.company
      );

    // tslint:disable-next-line: no-unused-expression
    filtro.createdBy &&
      f.filterExpression(
        `${PREFIX}CriadoPor/${PREFIX}pessoaid`,
        'eq',
        filtro.createdBy
      );

    f.filterExpression(`${PREFIX}excluido`, 'eq', false);

    return f;
  });

  if (filtro.orderBy && filtro.order) {
    query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
  } else {
    query.orderBy(`createdon desc`);
  }

  query.expand(
    `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
  );

  query.count();
  return query.toQuery();
};

const useProgram = (
  filter: IFilterProps,
  context?: WebPartContext
): IUseProgram[] => {
  const query = buildQuery(filter);
  // const { context } = useContextWebpart();
  const useAxios = axios({ context: context });

  const [loadingSave, setLoadingSave] = useState(false);

  const [{ addOrUpdateTeam }] = useTeam(
    {},
    {
      manual: true,
    }
  );

  let headers = {};

  if (filter.rowsPerPage) {
    headers = {
      Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
    };
  }

  const [{ data, loading, error }, refetch] = useAxios(
    {
      url: `${PROGRAM}${query}`,
      headers,
    },
    {
      useCache: false,
    }
  );

  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: `${PROGRAM}`,
      method: 'POST',
    },
    { manual: true }
  );

  const buildItem = (program) => {
    const res = {
      [`${PREFIX}titulo`]: program?.title,
      [`${PREFIX}sigla`]: program?.sigla,
      [`${PREFIX}modelo`]: program?.model,
      [`${PREFIX}anexossincronizados`]: program.anexossincronizados,
      [`${PREFIX}modeloid`]: program.modeloid,
      [`${PREFIX}observacao`]: program?.description,
      [`${PREFIX}TipoPrograma@odata.bind`]:
        program?.typeProgram && `/${TAG}(${program?.typeProgram?.value})`,
      [`${PREFIX}NomePrograma@odata.bind`]:
        program?.nameProgram && `/${TAG}(${program?.nameProgram?.value})`,
      [`${PREFIX}Instituto@odata.bind`]:
        program?.institute && `/${TAG}(${program?.institute?.value})`,
      [`${PREFIX}Empresa@odata.bind`]:
        program?.company && `/${TAG}(${program?.company?.value})`,
      [`${PREFIX}ResponsavelpeloPrograma@odata.bind`]:
        program?.responsible && `/${PERSON}(${program?.responsible?.value})`,
      [`${PREFIX}Temperatura@odata.bind`]:
        program?.temperature && `/${TAG}(${program?.temperature?.value})`,
    };

    if (!program?.id) {
      res[`${PREFIX}CriadoPor@odata.bind`] =
        program?.user && `/${PERSON}(${program?.user})`;
      res[`${PREFIX}grupopermissao`] = program?.group;
    }

    return res;
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

  const getProgramId = (programId): Promise<any> => {
    return new Promise((resolve, reject) => {
      var query = new QueryBuilder().filter((f) =>
        f.filterExpression(`${PREFIX}programaid`, 'eq', programId)
      );

      query.expand(
        `${PREFIX}TipoPrograma,${PREFIX}NomePrograma,${PREFIX}Instituto,${PREFIX}Empresa,${PREFIX}Temperatura,${PREFIX}ResponsavelpeloPrograma,${PREFIX}Programa_NomePrograma,${PREFIX}Programa_PessoasEnvolvidas,${PREFIX}Programa_Turma,${PREFIX}ise_turmasrelacionadas_Programa_ise_progr,${PREFIX}Programa_Compartilhamento`
      );

      executePost({
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

  const addOrUpdateProgram = async (program, { onSuccess, onError }) => {
    try {
      setLoadingSave(true);
      const dataToSave: any = buildItem(program);

      const batch = new BatchMultidata(executePost);
      let programId = program?.id;

      if (programId) {
        batch.patch(PROGRAM, programId, dataToSave);
      } else {
        const response = await executePost({
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
          ?.map((name) => buildItemPeople(name))
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

        await addOrUpdateTeam(team, programId, {
          onSuccess: () => {},
          onError: () => {},
        });
      }

      if (!program.isLoadModel) {
        await uploadProgramFiles(program, programId);
      }

      const newProgram = await getProgramId(programId);

      setLoadingSave(false);
      onSuccess?.(newProgram?.value?.[0]);
      refetch();
    } catch (error) {
      console.log(error);
      setLoadingSave(false);
      onError?.(error);
    }
  };

  const updateProgram = (id, toSave, { onSuccess, onError }) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

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

  const updateEnvolvedPerson = (
    id,
    programId,
    toSave,
    { onSuccess, onError }
  ) => {
    return new Promise(async (resolve, reject) => {
      const batch = new BatchMultidata(executePost);

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

  const uploadProgramFiles = async (program, programId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (program?.anexos?.length) {
          const folder = `Programa/${moment(data?.createdon).format(
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
        console.log(error);
        reject(err);
      }
    });
  };

  return [
    {
      programs: data?.value,
      count: data?.['@odata.count'],
      nextLink: data?.['@odata.nextLink'],
      postLoading,
      loadingSave,
      loading,
      error,
      addOrUpdateProgram,
      updateEnvolvedPerson,
      updateProgram,
      refetch,
    },
  ];
};

export default useProgram;
