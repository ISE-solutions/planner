import api from '~/services/api';
import { PERSON, PREFIX, TASK } from '~/config/database';
import { buildItem, buildQuery, IFilterProps } from './utils';
import { Dispatch } from 'redux';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';
import { batchAddNotification } from '../notification/actions';
import { AppState } from '~/store';
import { TYPE_TASK } from '~/config/enums';

export const fetchAllTasks =
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
      const { data } = await api.get(`${TASK}${query}`, {
        headers,
      });

      dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data?.value));
    } catch (error) {
      console.error(error);
      // handle your error
    }
  };

export const filterTask = (filter: IFilterProps) => {
  return new Promise<any[]>((resolve, reject) => {
    const query = buildQuery(filter);

    api({
      url: `${TASK}${query}`,
      method: 'GET',
    })
      .then(({ data }) => {
        resolve(data?.value);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getTaskById = (id) => {
  return new Promise((resolve, reject) => {
    var query = new QueryBuilder().filter((f) =>
      f.filterExpression(`${PREFIX}tarefaid`, 'eq', id)
    );

    query.expand(
      `${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`
    );

    query.count();
    api({
      url: `${TASK}${query.toQuery()}`,
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

export const addOrUpdateTask =
  (task, { onSuccess, onError }): any =>
  (_d: Dispatch<any>, getState: () => AppState) =>
    new Promise(async (resolve, reject) => {
      const dataToSave: any = buildItem(task);
      let taskSaved = { ...task };

      try {
        const batch = new BatchMultidata(api);
        let taskId = task?.id;

        if (taskId) {
          batch.patch(TASK, taskId, dataToSave);
        } else {
          const response = await api({
            url: TASK,
            method: 'POST',
            headers: {
              Prefer: 'return=representation',
            },
            data: dataToSave,
          });

          taskId = response.data?.[`${PREFIX}tarefaid`];
          taskSaved = response.data;
        }

        batch.bulkPostReferenceRelatioship(
          TASK,
          PERSON,
          taskId,
          'tarefas_responsaveis_ise_pessoa',
          task?.responsible?.map((spc) => spc?.[`${PREFIX}pessoaid`])
        );

        batch.bulkDeleteReferenceParent(
          TASK,
          task?.peopleToDelete?.map((spc) => spc?.[`${PREFIX}pessoaid`]),
          taskId,
          'tarefas_responsaveis_ise_pessoa'
        );

        await batch.execute();

        const { app, person, tag } = getState();
        const { context } = app;
        const { dictTag } = tag;

        if (!task?.id) {
          let message = '';

          if (task?.type === TYPE_TASK.PLANEJAMENTO) {
            message = `Olá, foi atribuído à ti uma tarefa ${
              taskSaved.title || taskSaved?.[`${PREFIX}nome`]
            }, com ID ${
              taskSaved.id || taskSaved?.[`${PREFIX}id`]
            } do tipo Planejamento. Para acessar a mesma favor clicar aqui.`;
          }

          if (task?.type === TYPE_TASK.REQUISICAO_ACADEMICA) {
            message = `Olá, foi atribuído à ti uma tarefa ${
              taskSaved.title || taskSaved?.[`${PREFIX}nome`]
            }, com ID ${
              taskSaved.id || taskSaved?.[`${PREFIX}id`]
            } do tipo Requisição acadêmica. Para acessar a mesma favor clicar aqui.`;
          }

          if (task?.type === TYPE_TASK.CONSTRUCAO_BLOCO) {
            message = `Olá, foi atribuído à ti uma nova tarefa ${
              taskSaved.title || taskSaved?.[`${PREFIX}nome`]
            }, com ID ${
              taskSaved.id || taskSaved?.[`${PREFIX}id`]
            } do tipo 8 Gatilhos. Para acessar a mesma favor clicar aqui.`;
          }

          const notifiers = task?.responsible?.map((e) => ({
            title: 'Nova Tarefa',
            link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
            description: message,
            pessoaId: e?.[`${PREFIX}pessoaid`],
          }));

          if (task.group) {
            person?.persons.forEach((p) => {
              p?.[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]?.forEach((tag) => {
                const fullTag = dictTag[tag?.[`${PREFIX}etiquetaid`]];

                if (
                  fullTag?.[`${PREFIX}Etiqueta_Pai`]?.some(
                    (e) =>
                      e?.[`${PREFIX}etiquetaid`] ===
                      task.group?.[`${PREFIX}etiquetaid`]
                  )
                ) {
                  notifiers.push({
                    title: 'Nova Tarefa',
                    link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
                    description: message,
                    pessoaId: p?.[`${PREFIX}pessoaid`],
                  });
                }
              });
            });
          }

          await batchAddNotification(notifiers, {
            onSuccess: () => null,
            onError: () => null,
          });
        }

        if (task?.id && task?.peopleToNotify?.length) {
          await batchAddNotification(
            task?.peopleToNotify?.map((e) => ({
              title: 'Nova Tarefa',
              link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
              description: `Olá, foi atribuído à ti uma nova tarefa ${
                taskSaved.title || taskSaved?.[`${PREFIX}nome`]
              }, com ID ${taskSaved.id || taskSaved?.[`${PREFIX}id`]} do tipo ${
                task.type === TYPE_TASK.PLANEJAMENTO
                  ? TYPE_TASK.PLANEJAMENTO
                  : task.type === TYPE_TASK.REQUISICAO_ACADEMICA
                  ? TYPE_TASK.REQUISICAO_ACADEMICA
                  : '8 Gatilhos'
              }. Para acessar a mesma favor clicar aqui.`,
              pessoaId: e?.[`${PREFIX}pessoaid`],
            })),
            {
              onSuccess: () => null,
              onError: () => null,
            }
          );
        }

        const newTask: any = await getTaskById(taskId);

        onSuccess?.(newTask?.value?.[0]);
        resolve(newTask?.value?.[0]);
      } catch (err) {
        console.error(err);
        onError?.(err);
        reject(err);
      }
    });
