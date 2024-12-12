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
import { FINITE_INFINITE_RESOURCES, PREFIX, TAG } from '~/config/database';
import { buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import { QueryBuilder } from 'odata-query-builder';
import { TYPE_RESOURCE } from '~/config/enums';
import * as moment from 'moment';
import { BUSINESS_UNITY } from '~/config/constants';
import BatchMultidata from '~/utils/BatchMultidata';
export const fetchAllFiniteInfiniteResources = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${FINITE_INFINITE_RESOURCES}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, {
            items: data === null || data === void 0 ? void 0 : data.value,
            isActive: (filter === null || filter === void 0 ? void 0 : filter.active) !== 'Inativo',
        }));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const getFiniteInfiniteResources = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = buildQuery(filter);
            let headers = {};
            if (filter.rowsPerPage) {
                headers = {
                    Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
                };
            }
            const { data } = yield api.get(`${FINITE_INFINITE_RESOURCES}${query}`, {
                headers,
            });
            resolve(data.value);
        }
        catch (error) {
            console.error(error);
            // handle your error
        }
    }));
});
const getResourceByName = (name, type) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield api({
            url: `${FINITE_INFINITE_RESOURCES}${query.toQuery()}`,
            headers: {
                Prefer: `odata.maxpagesize=${10}`,
            },
        })
            .then(({ data }) => {
            resolve(data);
        })
            .catch((err) => {
            reject(err);
        });
    }));
};
export const addOrUpdateFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
    try {
        yield api({
            url: finiteResource.id
                ? `${FINITE_INFINITE_RESOURCES}(${finiteResource.id})`
                : `${FINITE_INFINITE_RESOURCES}`,
            method: (finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource.id) ? 'PATCH' : 'POST',
            headers: {
                Prefer: 'return=representation',
            },
            data: data,
        });
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('Salvo');
        resolve('Salvo');
    }
    catch (error) {
        console.log(error);
        onError === null || onError === void 0 ? void 0 : onError(error);
        reject(error);
    }
}));
export const desactiveFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => {
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
    api({
        url: `${FINITE_INFINITE_RESOURCES}(${(_a = finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}recursofinitoinfinitoid`]})`,
        method: 'PATCH',
        data,
    })
        .then(({ data }) => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
};
export const activeFiniteInfiniteResource = (finiteResource, { onSuccess, onError }) => {
    api({
        url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})`,
        method: 'PATCH',
        data: {
            [`${PREFIX}ativo`]: true,
        },
    })
        .then(({ data }) => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
};
export const updateResource = (id, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(FINITE_INFINITE_RESOURCES, id, toSave);
        try {
            yield batch.execute();
            resolve('sucesso');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
});
export const bulkUpdateFiniteInfiniteResource = (toUpdate, { onSuccess, onError }) => __awaiter(void 0, void 0, void 0, function* () {
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
                    yield api({
                        url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
                        method: 'PATCH',
                        data: {
                            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.0/$metadata#$ref`,
                            '@odata.id': `${TAG}(${rel.value})`,
                        },
                    });
                }
            }
            yield api({
                url: `${FINITE_INFINITE_RESOURCES}(${finiteResource === null || finiteResource === void 0 ? void 0 : finiteResource[`${PREFIX}recursofinitoinfinitoid`]})`,
                method: 'PATCH',
                data,
            });
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }
    catch (e) {
        onError === null || onError === void 0 ? void 0 : onError(e);
    }
});
export const deleteResource = (item, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${FINITE_INFINITE_RESOURCES}(${item === null || item === void 0 ? void 0 : item.id})`,
        method: 'PATCH',
        data: {
            [`${PREFIX}excluido`]: true,
            [`${PREFIX}ativo`]: false,
        },
    })
        .then(() => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
});
//# sourceMappingURL=actions.js.map