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
import { PREFIX, TAG, SPACE, SPACE_ENVOLVED_PEOPLE, SPACE_CAPACITY, SPACE_FANTASY_NAME, } from '~/config/database';
import { buildItem, buildItemCapacity, buildItemFantasyName, buildItemPeople, buildQuery, } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import * as moment from 'moment';
import { createFolder, deleteFiles, uploadFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import replaceSpecialCharacters from '~/utils/replaceSpecialCharacters';
import BatchMultidata from '~/utils/BatchMultidata';
export const fetchAllSpace = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${SPACE}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const getSpaces = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = buildQuery(filter);
            let headers = {};
            if (filter.rowsPerPage) {
                headers = {
                    Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
                };
            }
            const { data } = yield api.get(`${SPACE}${query}`, {
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
export const getSpace = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}espacoid`, 'eq', id));
        query.expand(`${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas`);
        query.count();
        api({
            url: `${SPACE}${query.toQuery()}`,
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
export const getSpaceByName = (name) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}nome`, 'eq', `${replaceSpecialCharacters(name)}`);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            f.filterExpression(`${PREFIX}excluido`, 'eq', false);
            return f;
        });
        query.count();
        api({
            url: `${SPACE}${query.toQuery()}`,
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
export const getSpaceByEmail = (email) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}email`, 'eq', email));
        query.expand(`${PREFIX}Espaco_Etiqueta_Etiqueta,${PREFIX}Espaco_PessoasEnvolvidas,${PREFIX}Espaco_NomeEspaco,${PREFIX}Espaco_CapacidadeEspaco,${PREFIX}Espaco_PessoasEnvolvidas`);
        query.count();
        api({
            url: `${SPACE}${query.toQuery()}`,
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
export const addOrUpdateSpace = (space, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const dataToSave = buildItem(space);
        let spaceSaved = Object.assign({}, space);
        const spacesSavedByName = yield getSpaceByName(space.name);
        if ((_a = spacesSavedByName === null || spacesSavedByName === void 0 ? void 0 : spacesSavedByName.value) === null || _a === void 0 ? void 0 : _a.length) {
            const err = {
                data: {
                    error: {
                        message: 'Espaço já cadastrado!',
                    },
                },
            };
            if (space.id) {
                const othersSpaceSabedByName = (_b = spacesSavedByName === null || spacesSavedByName === void 0 ? void 0 : spacesSavedByName.value) === null || _b === void 0 ? void 0 : _b.filter((tg) => (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}espacoid`]) !== space.id);
                if (othersSpaceSabedByName.length) {
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
        try {
            const batch = new BatchMultidata(api);
            let spaceId = space === null || space === void 0 ? void 0 : space.id;
            if (spaceId) {
                batch.patch(SPACE, spaceId, dataToSave);
            }
            else {
                const response = yield api({
                    url: SPACE,
                    method: 'POST',
                    headers: {
                        Prefer: 'return=representation',
                    },
                    data: dataToSave,
                });
                spaceId = (_c = response.data) === null || _c === void 0 ? void 0 : _c[`${PREFIX}espacoid`];
                spaceSaved = response.data;
            }
            batch.bulkPostReferenceRelatioship(SPACE, TAG, spaceId, 'Espaco_Etiqueta_Etiqueta', (_d = space === null || space === void 0 ? void 0 : space.tags) === null || _d === void 0 ? void 0 : _d.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]));
            batch.bulkDeleteReferenceParent(SPACE, (_e = space === null || space === void 0 ? void 0 : space.tagsToDelete) === null || _e === void 0 ? void 0 : _e.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}etiquetaid`]), spaceId, 'Espaco_Etiqueta_Etiqueta');
            batch.bulkPostRelationship(SPACE_FANTASY_NAME, SPACE, spaceId, 'Espaco_NomeEspaco', (_f = space === null || space === void 0 ? void 0 : space.names) === null || _f === void 0 ? void 0 : _f.map((e) => buildItemFantasyName(e)));
            batch.bulkPostRelationship(SPACE_CAPACITY, SPACE, spaceId, 'Espaco_CapacidadeEspaco', (_g = space === null || space === void 0 ? void 0 : space.capacities) === null || _g === void 0 ? void 0 : _g.map((e) => buildItemCapacity(e)));
            batch.bulkPostRelationship(SPACE_ENVOLVED_PEOPLE, SPACE, spaceId, 'Espaco_PessoasEnvolvidas', (_j = (_h = space === null || space === void 0 ? void 0 : space.people) === null || _h === void 0 ? void 0 : _h.filter((e) => !(!(e === null || e === void 0 ? void 0 : e.id) && e.deleted))) === null || _j === void 0 ? void 0 : _j.map((e, i) => buildItemPeople(e)));
            if ((_k = space === null || space === void 0 ? void 0 : space.anexos) === null || _k === void 0 ? void 0 : _k.length) {
                const folder = `Espaco/${moment(spaceSaved === null || spaceSaved === void 0 ? void 0 : spaceSaved.createdon).format('YYYY')}/${spaceId}`;
                const attachmentsToDelete = (_l = space === null || space === void 0 ? void 0 : space.anexos) === null || _l === void 0 ? void 0 : _l.filter((file) => file.relativeLink && file.deveExcluir);
                const attachmentsToSave = (_m = space === null || space === void 0 ? void 0 : space.anexos) === null || _m === void 0 ? void 0 : _m.filter((file) => !file.relativeLink && !file.deveExcluir);
                yield deleteFiles(sp, attachmentsToDelete);
                yield createFolder(sp, folder, 'Anexos Interno');
                const { context } = getState().app;
                yield uploadFiles(sp, `${context.pageContext.web.serverRelativeUrl}/Anexos Interno/${folder}`, attachmentsToSave);
            }
            yield batch.execute();
            const newSpace = yield getSpace(spaceId);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_o = newSpace === null || newSpace === void 0 ? void 0 : newSpace.value) === null || _o === void 0 ? void 0 : _o[0]);
            resolve(newSpace);
        }
        catch (err) {
            console.error(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
            reject(err);
        }
    }));
});
export const desactiveSpace = (space, { onSuccess, onError }) => () => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    let data = {
        [`${PREFIX}tipodesativacao`]: space.type,
    };
    if (space.type === 'definitivo') {
        data[`${PREFIX}ativo`] = false;
    }
    if (space.type === 'temporario') {
        if (moment()
            .startOf('day')
            .isSame(moment(space.start.toISOString()).startOf('day'))) {
            data[`${PREFIX}ativo`] = false;
        }
        data[`${PREFIX}iniciodesativacao`] = space.start
            .startOf('day')
            .toISOString();
        data[`${PREFIX}fimdesativacao`] = space.end.startOf('day').toISOString();
    }
    api({
        url: `${SPACE}(${(_p = space === null || space === void 0 ? void 0 : space.data) === null || _p === void 0 ? void 0 : _p[`${PREFIX}espacoid`]})`,
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
export const activeSpace = (space, { onSuccess, onError }) => () => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${SPACE}(${space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]})`,
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
export const deleteSpace = (item, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${SPACE}(${item === null || item === void 0 ? void 0 : item.id})`,
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
export const updateSpace = (id, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(SPACE, id, toSave);
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
export const bulkUpdateSpace = (toUpdate, { onSuccess, onError }) => () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < toUpdate.data.length; i++) {
            const space = toUpdate.data[i];
            yield api({
                url: `${SPACE}(${space === null || space === void 0 ? void 0 : space[`${PREFIX}espacoid`]})`,
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