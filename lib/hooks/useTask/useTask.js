var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { BUSINESS_UNITY } from '../../config/constants';
import { TASK, PREFIX, TAG } from '../../config/database';
import axios from '../useAxios/useAxios';
import useContextWebpart from '../useContextWebpart';
import BatchMultidata from '~/utils/BatchMultidata';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}descricao,'${filtro.searchQuery}')`);
                //p.filterPhrase(
                //  `contains(${PREFIX}nomepreferido,'${filtro.searchQuery}')`
                //);
                //p.filterPhrase(`contains(${PREFIX}email,'${filtro.searchQuery}')`);
                //p.filterPhrase(
                //  `contains(${PREFIX}emailsecundario,'${filtro.searchQuery}')`
                //);
                //p.filterPhrase(`contains(${PREFIX}celular,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}Programa/${PREFIX}titulo,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}Turma/${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}Atividade/${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}Pessoa/${PREFIX}nome,'${filtro.searchQuery}')`);
                return p;
            });
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    query.expand(`${PREFIX}Programa,${PREFIX}Turma,${PREFIX}Grupo,${PREFIX}Atividade,${PREFIX}tarefas_responsaveis_ise_pessoa`);
    query.count();
    return query.toQuery();
};
const useTask = (filter, options) => {
    const query = buildQuery(filter);
    const { context } = useContextWebpart();
    const useAxios = axios({ context: context });
    let headers = {};
    if (filter.rowsPerPage) {
        headers = {
            Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
        };
    }
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${TASK}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${TASK}`,
        method: 'POST',
    }, { manual: true });
    const bulkAddTaks = (tasks, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const batch = new BatchMultidata(executePost);
            tasks.forEach((elm) => {
                batch.post(TASK, elm);
            });
            try {
                yield batch.execute();
                resolve('Success');
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            }
            catch (err) {
                onError === null || onError === void 0 ? void 0 : onError(err);
                reject(err);
            }
        }));
    });
    const desactivePerson = (person, { onSuccess, onError }) => {
        var _a;
        let data = {
            [`${PREFIX}tipodesativacao`]: person.type,
        };
        if (person.type === 'definitivo') {
            data[`${PREFIX}ativo`] = false;
        }
        if (person.type === 'temporario') {
            if (moment()
                .startOf('day')
                .isSame(moment(person.start.toISOString()).startOf('day'))) {
                data[`${PREFIX}ativo`] = false;
            }
            data[`${PREFIX}iniciodesativacao`] = person.start
                .startOf('day')
                .toISOString();
            data[`${PREFIX}fimdesativacao`] = person.end.startOf('day').toISOString();
        }
        executePost({
            url: `${TASK}(${(_a = person === null || person === void 0 ? void 0 : person.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}pessoaid`]})`,
            method: 'PATCH',
            data,
        })
            .then(() => {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        })
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    };
    const deletePerson = (person, { onSuccess, onError }) => {
        executePost({
            url: `${TASK}(${person === null || person === void 0 ? void 0 : person.id})`,
            method: 'PATCH',
            data: {
                [`${PREFIX}excluido`]: true,
            },
        })
            .then(() => {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        })
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    };
    const activePerson = (person, { onSuccess, onError }) => {
        executePost({
            url: `${TASK}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})`,
            method: 'PATCH',
            data: {
                [`${PREFIX}ativo`]: true,
            },
        })
            .then(({ data }) => {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        })
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    };
    const bulkUpdatePerson = (toUpdate, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            for (let i = 0; i < toUpdate.data.length; i++) {
                const person = toUpdate.data[i];
                const data = {};
                if (toUpdate.school) {
                    data[`${PREFIX}escolaorigem`] = toUpdate.school;
                }
                if ((_a = toUpdate.title) === null || _a === void 0 ? void 0 : _a.value) {
                    data[`${PREFIX}Titulo@odata.bind`] = `/${TAG}(${(_b = toUpdate.title) === null || _b === void 0 ? void 0 : _b.value})`;
                }
                if ((_c = toUpdate === null || toUpdate === void 0 ? void 0 : toUpdate.tag) === null || _c === void 0 ? void 0 : _c.length) {
                    for (let j = 0; j < toUpdate.tag.length; j++) {
                        const rel = toUpdate.tag[j];
                        yield executePost({
                            url: `${TASK}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
                            method: 'PATCH',
                            data: {
                                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.0/$metadata#$ref`,
                                '@odata.id': `${TAG}(${rel.value})`,
                            },
                        });
                    }
                }
                yield executePost({
                    url: `${TASK}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})`,
                    method: 'PATCH',
                    data,
                });
            }
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        }
        catch (e) {
            onError === null || onError === void 0 ? void 0 : onError(e);
        }
    });
    return [
        {
            tasks: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loading,
            error,
            bulkAddTaks,
            bulkUpdatePerson,
            desactivePerson,
            activePerson,
            deletePerson,
            refetch,
        },
    ];
};
export default useTask;
//# sourceMappingURL=useTask.js.map