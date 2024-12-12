var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import api from '~/services/api';
import { PERSON, PREFIX, TASK } from '~/config/database';
import { buildItem, buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';
import { batchAddNotification } from '../notification/actions';
import { TYPE_TASK } from '~/config/enums';
export const fetchAllTasks = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${TASK}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const filterTask = (filter) => {
    return new Promise((resolve, reject) => {
        const query = buildQuery(filter);
        api({
            url: `${TASK}${query}`,
            method: 'GET',
        })
            .then(({ data }) => {
            resolve(data === null || data === void 0 ? void 0 : data.value);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
export const getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}tarefaid`, 'eq', id));
        query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`);
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
export const addOrUpdateTask = (task, { onSuccess, onError }) => (_d, getState) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _e, _f, _g, _h, _j;
    const dataToSave = buildItem(task);
    let taskSaved = Object.assign({}, task);
    try {
        const batch = new BatchMultidata(api);
        let taskId = task === null || task === void 0 ? void 0 : task.id;
        if (taskId) {
            batch.patch(TASK, taskId, dataToSave);
        }
        else {
            const response = yield api({
                url: TASK,
                method: 'POST',
                headers: {
                    Prefer: 'return=representation',
                },
                data: dataToSave,
            });
            taskId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}tarefaid`];
            taskSaved = response.data;
        }
        batch.bulkPostReferenceRelatioship(TASK, PERSON, taskId, 'tarefas_responsaveis_ise_pessoa', (_b = task === null || task === void 0 ? void 0 : task.responsible) === null || _b === void 0 ? void 0 : _b.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}pessoaid`]));
        batch.bulkDeleteReferenceParent(TASK, (_c = task === null || task === void 0 ? void 0 : task.peopleToDelete) === null || _c === void 0 ? void 0 : _c.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}pessoaid`]), taskId, 'tarefas_responsaveis_ise_pessoa');
        yield batch.execute();
        const { app, person, tag } = getState();
        const { context } = app;
        const { dictTag } = tag;
        if (!(task === null || task === void 0 ? void 0 : task.id)) {
            let message = '';
            if ((task === null || task === void 0 ? void 0 : task.type) === TYPE_TASK.PLANEJAMENTO) {
                message = `Olá, foi atribuído à ti uma tarefa ${taskSaved.title || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}nome`])}, com ID ${taskSaved.id || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}id`])} do tipo Planejamento. Para acessar a mesma favor clicar aqui.`;
            }
            if ((task === null || task === void 0 ? void 0 : task.type) === TYPE_TASK.REQUISICAO_ACADEMICA) {
                message = `Olá, foi atribuído à ti uma tarefa ${taskSaved.title || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}nome`])}, com ID ${taskSaved.id || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}id`])} do tipo Requisição acadêmica. Para acessar a mesma favor clicar aqui.`;
            }
            if ((task === null || task === void 0 ? void 0 : task.type) === TYPE_TASK.CONSTRUCAO_BLOCO) {
                message = `Olá, foi atribuído à ti uma nova tarefa ${taskSaved.title || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}nome`])}, com ID ${taskSaved.id || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}id`])} do tipo 8 Gatilhos. Para acessar a mesma favor clicar aqui.`;
            }
            const notifiers = (_e = task === null || task === void 0 ? void 0 : task.responsible) === null || _e === void 0 ? void 0 : _e.map((e) => ({
                title: 'Nova Tarefa',
                link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
                description: message,
                pessoaId: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoaid`],
            }));
            if (task.group) {
                person === null || person === void 0 ? void 0 : person.persons.forEach((p) => {
                    var _a;
                    (_a = p === null || p === void 0 ? void 0 : p[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.forEach((tag) => {
                        var _a;
                        const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                        if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => {
                            var _a;
                            return (e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]) ===
                                ((_a = task.group) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                        })) {
                            notifiers.push({
                                title: 'Nova Tarefa',
                                link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
                                description: message,
                                pessoaId: p === null || p === void 0 ? void 0 : p[`${PREFIX}pessoaid`],
                            });
                        }
                    });
                });
            }
            yield batchAddNotification(notifiers, {
                onSuccess: () => null,
                onError: () => null,
            });
        }
        if ((task === null || task === void 0 ? void 0 : task.id) && ((_f = task === null || task === void 0 ? void 0 : task.peopleToNotify) === null || _f === void 0 ? void 0 : _f.length)) {
            yield batchAddNotification((_g = task === null || task === void 0 ? void 0 : task.peopleToNotify) === null || _g === void 0 ? void 0 : _g.map((e) => ({
                title: 'Nova Tarefa',
                link: `${context.pageContext.web.absoluteUrl}/SitePages/Tarefas.aspx?tarefaid=${taskId}`,
                description: `Olá, foi atribuído à ti uma nova tarefa ${taskSaved.title || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}nome`])}, com ID ${taskSaved.id || (taskSaved === null || taskSaved === void 0 ? void 0 : taskSaved[`${PREFIX}id`])} do tipo ${task.type === TYPE_TASK.PLANEJAMENTO
                    ? TYPE_TASK.PLANEJAMENTO
                    : task.type === TYPE_TASK.REQUISICAO_ACADEMICA
                        ? TYPE_TASK.REQUISICAO_ACADEMICA
                        : '8 Gatilhos'}. Para acessar a mesma favor clicar aqui.`,
                pessoaId: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoaid`],
            })), {
                onSuccess: () => null,
                onError: () => null,
            });
        }
        const newTask = yield getTaskById(taskId);
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_h = newTask === null || newTask === void 0 ? void 0 : newTask.value) === null || _h === void 0 ? void 0 : _h[0]);
        resolve((_j = newTask === null || newTask === void 0 ? void 0 : newTask.value) === null || _j === void 0 ? void 0 : _j[0]);
    }
    catch (err) {
        console.error(err);
        onError === null || onError === void 0 ? void 0 : onError(err);
        reject(err);
    }
}));
//# sourceMappingURL=actions.js.map