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
import { PREFIX, TAG, TAG_NAME } from '~/config/database';
import { buildItemFantasyName, buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import BatchMultidata from '~/utils/BatchMultidata';
import * as moment from 'moment';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
export const fetchAllTags = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${TAG}${query}`, {
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
export const getTags = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = buildQuery(filter);
            let headers = {};
            if (filter.rowsPerPage) {
                headers = {
                    Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
                };
            }
            const { data } = yield api.get(`${TAG}${query}`, {
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
const getTag = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}etiquetaid`, 'eq', id));
        query.expand(`${PREFIX}Etiqueta_Pai,${PREFIX}Etiqueta_NomeEtiqueta`);
        query.count();
        api({
            url: `${TAG}${query.toQuery()}`,
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
export const getTagByName = (name) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            // f.filterPhrase(
            //   `startswith(${PREFIX}nome,'${replaceSpecialCharacters(name)}')`
            // );
            f.filterExpression(`${PREFIX}nome`, 'eq', `${replaceSpecialCharacters(name)}`);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            f.filterExpression(`${PREFIX}excluido`, 'eq', false);
            return f;
        });
        query.expand(`${PREFIX}Etiqueta_Pai,${PREFIX}Etiqueta_NomeEtiqueta`);
        query.count();
        api
            .get(`${TAG}${query.toQuery()}`)
            .then(({ data }) => {
            resolve(data);
        })
            .catch((err) => {
            reject(err);
        });
    });
};
export const addOrUpdateTag = (tag, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let tagId = tag.id;
        const tagsSavedByName = yield getTagByName(tag.name);
        if ((_a = tagsSavedByName === null || tagsSavedByName === void 0 ? void 0 : tagsSavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
            const err = {
                data: {
                    error: {
                        message: 'Etiqueta já cadastrada!',
                    },
                },
            };
            if (tagId) {
                const othersTagsSabedByName = (_b = tagsSavedByName === null || tagsSavedByName === void 0 ? void 0 : tagsSavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) !== tagId);
                if (othersTagsSabedByName.length) {
                    reject(err);
                    onError === null || onError === void 0 ? void 0 : onError(err);
                    return;
                }
            }
            else {
                reject(err);
                onError === null || onError === void 0 ? void 0 : onError(err);
                return;
            }
        }
        const dataToSave = {
            [`${PREFIX}descricao`]: tag.description,
            [`${PREFIX}ordem`]: tag.order,
            [`${PREFIX}nome`]: tag.name,
            [`${PREFIX}nomeen`]: tag.nameEn,
            [`${PREFIX}nomees`]: tag.nameEs,
        };
        const batch = new BatchMultidata(api);
        if (tagId) {
            batch.patch(TAG, tagId, dataToSave);
        }
        else {
            const response = yield api({
                url: TAG,
                method: 'POST',
                headers: {
                    Prefer: 'return=representation',
                },
                data: dataToSave,
            });
            tagId = (_c = response.data) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`];
        }
        batch.bulkPostReferenceRelatioship(TAG, TAG, tagId, 'Etiqueta_Pai', (_d = tag === null || tag === void 0 ? void 0 : tag.fatherTag) === null || _d === void 0 ? void 0 : _d.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]));
        batch.bulkDeleteReferenceParent(TAG, (_e = tag === null || tag === void 0 ? void 0 : tag.fatherTagToDelete) === null || _e === void 0 ? void 0 : _e.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), tagId, 'Etiqueta_Pai');
        batch.bulkPostRelationship(TAG_NAME, TAG, tagId, 'Etiqueta_NomeEtiqueta', (_f = tag === null || tag === void 0 ? void 0 : tag.names) === null || _f === void 0 ? void 0 : _f.map((name) => buildItemFantasyName(name)));
        try {
            yield batch.execute();
            const newTag = yield getTag(tagId);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_g = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _g === void 0 ? void 0 : _g[0]);
            resolve((_h = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _h === void 0 ? void 0 : _h[0]);
        }
        catch (error) {
            console.log(error);
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject(error);
        }
    }));
});
export const updateTag = (id, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(TAG, id, toSave);
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
export const desactiveTag = (tag, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    let data = {
        [`${PREFIX}tipodesativacao`]: tag.type,
    };
    if (tag.type === 'definitivo') {
        data[`${PREFIX}ativo`] = false;
    }
    if (tag.type === 'temporario') {
        if (moment()
            .startOf('day')
            .isSame(moment(tag.start.toISOString()).startOf('day'))) {
            data[`${PREFIX}ativo`] = false;
        }
        data[`${PREFIX}iniciodesativacao`] = tag.start
            .startOf('day')
            .toISOString();
        data[`${PREFIX}fimdesativacao`] = tag.end.startOf('day').toISOString();
    }
    api({
        url: `${TAG}(${(_j = tag === null || tag === void 0 ? void 0 : tag.data) === null || _j === void 0 ? void 0 : _j[`${PREFIX}etiquetaid`]})`,
        method: 'PATCH',
        data,
    })
        .then(({ data }) => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
});
export const activeTag = (tag, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${TAG}(${tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]})`,
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
});
export const deleteTag = (tag, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${TAG}(${tag === null || tag === void 0 ? void 0 : tag.id})`,
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
export const bulkUpdateTag = (toUpdate, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < toUpdate.data.length; i++) {
            const tag = toUpdate.data[i];
            yield api({
                url: `${TAG}(${tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]})`,
                method: 'PATCH',
                data: {
                    [`${PREFIX}escolaorigem`]: toUpdate.school,
                },
            });
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }
    catch (e) {
        onError === null || onError === void 0 ? void 0 : onError(e);
    }
});
//# sourceMappingURL=actions.js.map