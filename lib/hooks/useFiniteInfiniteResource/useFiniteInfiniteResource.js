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
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { BUSINESS_UNITY } from '../../config/constants';
import { FINITE_INFINITE_RESOURCES, PREFIX, TAG } from '../../config/database';
import axios from '../useAxios/useAxios';
import { TYPE_RESOURCE } from '~/config/enums';
import useContextWebpart from '../useContextWebpart';
const buildQuery = (filtro) => {
    var query = new QueryBuilder().filter((f) => {
        f.filterExpression(`${PREFIX}id`, 'ne', '0');
        // tslint:disable-next-line: no-unused-expression
        (filtro === null || filtro === void 0 ? void 0 : filtro.searchQuery) &&
            f.or((p) => {
                p.filterPhrase(`contains(${PREFIX}nome,'${filtro.searchQuery}')`);
                p.filterPhrase(`contains(${PREFIX}Tipo/${PREFIX}nome,'${filtro.searchQuery}')`);
                if (parseInt(filtro.searchQuery)) {
                    p.filterExpression(`${PREFIX}limitacao`, 'eq', parseInt(filtro.searchQuery));
                    p.filterExpression(`${PREFIX}quantidade`, 'eq', parseInt(filtro.searchQuery));
                }
                return p;
            });
        if (filtro.typeResource) {
            f.filterExpression(`${PREFIX}tiporecurso`, 'eq', filtro.typeResource);
        }
        // tslint:disable-next-line: no-unused-expression
        filtro.active &&
            filtro.active !== 'Todos' &&
            f.filterExpression(`${PREFIX}ativo`, 'eq', filtro.active === 'Ativo');
        f.filterExpression(`${PREFIX}excluido`, 'eq', false);
        return f;
    });
    if (filtro.orderBy && filtro.order) {
        query.orderBy(`${filtro.orderBy.replace('.', '/')} ${filtro.order}`);
    }
    else {
        query.orderBy(`${PREFIX}nome asc`);
    }
    if (filtro.top) {
        query.top(filtro.top);
    }
    query.expand(`${PREFIX}Tipo`);
    query.count();
    return query.toQuery();
};
const useFiniteInfiniteResource = (filter, options) => {
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
        url: `${FINITE_INFINITE_RESOURCES}${query}`,
        headers,
    }, {
        useCache: false,
        manual: !!(options === null || options === void 0 ? void 0 : options.manual),
    });
    const [{ data: postData, loading: postLoading, error: postError }, executePost,] = useAxios({
        url: `${FINITE_INFINITE_RESOURCES}`,
        method: 'POST',
    }, { manual: true });
    const getResourceByName = (name, type) => {
        return new Promise((resolve, reject) => {
            var query = new QueryBuilder().filter((f) => {
                // f.filterPhrase(
                //   `startswith(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`
                // );
                f.filterExpression(`${PREFIX}nome`, 'eq', `${replaceSpecialCharacters(name)}`);
                f.filterExpression(`${PREFIX}tiporecurso`, 'eq', type);
                f.filterExpression(`${PREFIX}ativo`, 'eq', true);
                f.filterExpression(`${PREFIX}excluido`, 'eq', false);
                return f;
            });
            query.count();
            executePost({
                url: `${FINITE_INFINITE_RESOURCES}${query.toQuery()}`,
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
    const addOrUpdateFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const finiteSavedByName = yield getResourceByName(finiteResource.name, finiteResource.typeResource);
        if ((_a = finiteSavedByName === null || finiteSavedByName === void 0 ? void 0 : finiteSavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
            const err = {
                data: {
                    error: {
                        message: `${finiteResource.typeResource === TYPE_RESOURCE.FINITO
                            ? 'Recurso Finito'
                            : 'Recurso Infinito'} já cadastrado!`,
                    },
                },
            };
            if (finiteResource.id) {
                const othersFiniteSabedByName = (_b = finiteSavedByName === null || finiteSavedByName === void 0 ? void 0 : finiteSavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}recursofinitoinfinitoid`]) !== finiteResource.id);
                if (othersFiniteSabedByName.length) {
                    onError === null || onError === void 0 ? void 0 : onError(err);
                    return;
                }
            }
            else {
                onError === null || onError === void 0 ? void 0 : onError(err);
                return;
            }
        }
        const data = {
            [`${PREFIX}nome`]: finiteResource.name,
            [`${PREFIX}limitacao`]: finiteResource.limit,
            [`${PREFIX}quantidade`]: finiteResource.quantity,
            [`${PREFIX}tiporecurso`]: finiteResource.typeResource,
        };
        if ((_c = finiteResource.type) === null || _c === void 0 ? void 0 : _c.value) {
            data[`${PREFIX}Tipo@odata.bind`] = `/${TAG}(${(_d = finiteResource.type) === null || _d === void 0 ? void 0 : _d.value})`;
        }
        executePost({
            url: finiteResource.id
                ? `${FINITE_INFINITE_RESOURCES}(${finiteResource.id})`
                : `${FINITE_INFINITE_RESOURCES}`,
            method: (finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource.id) ? 'PATCH' : 'POST',
            data,
        })
            .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(data);
            refetch();
        }))
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    });
    const desactiveFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => {
        var _a;
        let data = {
            [`${PREFIX}tipodesativacao`]: finiteResource.type,
        };
        if (finiteResource.type === 'definitivo') {
            data[`${PREFIX}ativo`] = false;
        }
        if (finiteResource.type === 'temporario') {
            if (moment()
                .startOf('day')
                .isSame(moment(finiteResource.start.toISOString()).startOf('day'))) {
                data[`${PREFIX}ativo`] = false;
            }
            data[`${PREFIX}iniciodesativacao`] = finiteResource.start
                .startOf('day')
                .toISOString();
            data[`${PREFIX}fimdesativacao`] = finiteResource.end
                .startOf('day')
                .toISOString();
        }
        executePost({
            url: `${FINITE_INFINITE_RESOURCES}(${(_a = finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}recursofinitoinfinitoid`]})`,
            method: 'PATCH',
            data,
        })
            .then(({ data }) => {
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            refetch();
        })
            .catch(({ response }) => {
            onError === null || onError === void 0 ? void 0 : onError(response);
        });
    };
    const activeFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => {
        executePost({
            url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})`,
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
    const bulkUpdateFiniteInfiniteResource = (toUpdate, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g;
        try {
            for (let i = 0; i < toUpdate.data.length; i++) {
                const finiteResource = toUpdate.data[i];
                const data = {};
                if (toUpdate.school) {
                    data[`${PREFIX}escolaorigem`] = toUpdate.school;
                }
                if ((_e = toUpdate.title) === null || _e === void 0 ? void 0 : _e.value) {
                    data[`${PREFIX}Titulo@odata.bind`] = `/${TAG}(${(_f = toUpdate.title) === null || _f === void 0 ? void 0 : _f.value})`;
                }
                if ((_g = toUpdate === null || toUpdate === void 0 ? void 0 : toUpdate.tag) === null || _g === void 0 ? void 0 : _g.length) {
                    for (let j = 0; j < toUpdate.tag.length; j++) {
                        const rel = toUpdate.tag[j];
                        yield executePost({
                            url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
                            method: 'PATCH',
                            data: {
                                '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.0/$metadata#$ref`,
                                '@odata.id': `${TAG}(${rel.value})`,
                            },
                        });
                    }
                }
                yield executePost({
                    url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})`,
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
    const deleteResource = (res, { onSuccess, onError }) => {
        executePost({
            url: `${FINITE_INFINITE_RESOURCES}(${res === null || res === void 0 ? void 0 : res.id})`,
            method: 'PATCH',
            data: {
                [`${PREFIX}excluido`]: true,
                [`${PREFIX}ativo`]: false,
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
    return [
        {
            resources: data === null || data === void 0 ? void 0 : data.value,
            count: data === null || data === void 0 ? void 0 : data['@odata.count'],
            nextLink: data === null || data === void 0 ? void 0 : data['@odata.nextLink'],
            postLoading,
            loading,
            error,
            addOrUpdateFiniteInfiniteResource,
            bulkUpdateFiniteInfiniteResource,
            desactiveFiniteInfiniteResource,
            activeFiniteInfiniteResource,
            deleteResource,
            refetch,
        },
    ];
};
export default useFiniteInfiniteResource;
//# sourceMappingURL=useFiniteInfiniteResource.js.map