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
import { PREFIX, TAG, PERSON } from '~/config/database';
import { buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import { QueryBuilder } from 'odata-query-builder';
import { BUSINESS_UNITY } from '~/config/constants';
import * as moment from 'moment';
import BatchMultidata from '~/utils/BatchMultidata';
export const fetchAllPerson = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${PERSON}${query}`, {
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
export const getPeople = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = buildQuery(filter);
            let headers = {};
            if (filter.rowsPerPage) {
                headers = {
                    Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
                };
            }
            const { data } = yield api.get(`${PERSON}${query}`, {
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
export const getPerson = (email, emailType) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(emailType == 'main' ? `${PREFIX}email` : `${PREFIX}emailsecundario`, 'eq', email);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            f.filterExpression(`${PREFIX}excluido`, 'eq', false);
            return f;
        });
        api({
            url: `${PERSON}${query.toQuery()}`,
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
export const addOrUpdatePerson = (person, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const batch = new BatchMultidata(api);
    // tslint:disable-next-line: no-shadowed-variable
    const data = {
        [`${PREFIX}nome`]: person.name,
        [`${PREFIX}sobrenome`]: person.lastName,
        [`${PREFIX}nomecompleto`]: `${person.name} ${person.lastName}`,
        [`${PREFIX}nomepreferido`]: person.favoriteName,
        [`${PREFIX}email`]: person.email,
        [`${PREFIX}emailsecundario`]: person.emailSecondary,
        [`${PREFIX}celular`]: person.phone,
        [`${PREFIX}EscolaOrigem@odata.bind`]: person.school && `/${TAG}(${(_a = person.school) === null || _a === void 0 ? void 0 : _a.value})`,
        // [`${PREFIX}AreaResponsavel@odata.bind`]:
        //   person.areaChief && `/${TAG}(${person.areaChief?.value})`,
    };
    if ((_b = person.title) === null || _b === void 0 ? void 0 : _b.value) {
        data[`${PREFIX}Titulo@odata.bind`] = `/${TAG}(${(_c = person.title) === null || _c === void 0 ? void 0 : _c.value})`;
    }
    if (person.id) {
        const newTags = (_d = person.tags) === null || _d === void 0 ? void 0 : _d.map((tag) => tag.value);
        for (let j = 0; j < person.previousTag.length; j++) {
            const rel = person.previousTag[j];
            if (!(newTags === null || newTags === void 0 ? void 0 : newTags.includes(rel[`${PREFIX}etiquetaid`]))) {
                yield api({
                    url: `${TAG}(${rel[`${PREFIX}etiquetaid`]})/${PREFIX}Pessoa_Etiqueta_Etiqueta(${person.id})/$ref`,
                    method: 'DELETE',
                });
            }
        }
    }
    api({
        url: person.id
            ? `${PERSON}(${person.id})?$select=${PREFIX}id,${PREFIX}nome,`
            : `${PERSON}?$select=${PREFIX}id,${PREFIX}nome,`,
        method: (person === null || person === void 0 ? void 0 : person.id) ? 'PATCH' : 'POST',
        data,
        headers: {
            Prefer: 'return=representation',
        },
    })
        .then(({ data }) => __awaiter(void 0, void 0, void 0, function* () {
        var _e, _f, _g;
        if ((_e = person === null || person === void 0 ? void 0 : person.tag) === null || _e === void 0 ? void 0 : _e.length) {
            for (let j = 0; j < person.tag.length; j++) {
                const rel = person.tag[j];
                yield api({
                    url: `${PERSON}(${data === null || data === void 0 ? void 0 : data[`${PREFIX}pessoaid`]})/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
                    method: 'PUT',
                    data: {
                        '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.1/$metadata#$ref`,
                        '@odata.id': `${TAG}(${rel.value})`,
                    },
                });
            }
        }
        batch.bulkPostReferenceRelatioship(PERSON, TAG, data === null || data === void 0 ? void 0 : data[`${PREFIX}pessoaid`], 'Pessoa_AreaResponsavel', (_f = person === null || person === void 0 ? void 0 : person.areaChief) === null || _f === void 0 ? void 0 : _f.map((tg) => tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]));
        batch.bulkDeleteReferenceParent(PERSON, (_g = person === null || person === void 0 ? void 0 : person.areaChiefToDelete) === null || _g === void 0 ? void 0 : _g.map((tg) => tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]), data === null || data === void 0 ? void 0 : data[`${PREFIX}pessoaid`], 'Pessoa_AreaResponsavel');
        yield batch.execute();
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }))
        .catch(({ response }) => {
        console.error(response);
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
});
export const desactivePerson = (person, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
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
    api({
        url: `${PERSON}(${(_h = person === null || person === void 0 ? void 0 : person.data) === null || _h === void 0 ? void 0 : _h[`${PREFIX}pessoaid`]})`,
        method: 'PATCH',
        data,
    })
        .then(() => {
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    })
        .catch(({ response }) => {
        onError === null || onError === void 0 ? void 0 : onError(response);
    });
});
export const updatePerson = (id, toSave, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(PERSON, id, toSave);
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
export const deletePerson = (person, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${PERSON}(${person === null || person === void 0 ? void 0 : person.id})`,
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
export const activePerson = (person, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    api({
        url: `${PERSON}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})`,
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
export const bulkUpdatePerson = (toUpdate, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k, _l;
    try {
        for (let i = 0; i < toUpdate.data.length; i++) {
            const person = toUpdate.data[i];
            const data = {};
            if (toUpdate.school) {
                data[`${PREFIX}escolaorigem`] = toUpdate.school;
            }
            if ((_j = toUpdate.title) === null || _j === void 0 ? void 0 : _j.value) {
                data[`${PREFIX}Titulo@odata.bind`] = `/${TAG}(${(_k = toUpdate.title) === null || _k === void 0 ? void 0 : _k.value})`;
            }
            if ((_l = toUpdate === null || toUpdate === void 0 ? void 0 : toUpdate.tag) === null || _l === void 0 ? void 0 : _l.length) {
                for (let j = 0; j < toUpdate.tag.length; j++) {
                    const rel = toUpdate.tag[j];
                    yield api({
                        url: `${PERSON}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})/ise_Pessoa_Etiqueta_Etiqueta/$ref`,
                        method: 'PATCH',
                        data: {
                            '@odata.context': `https://${BUSINESS_UNITY}.crm2.dynamics.com/api/data/v9.0/$metadata#$ref`,
                            '@odata.id': `${TAG}(${rel.value})`,
                        },
                    });
                }
            }
            yield api({
                url: `${PERSON}(${person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]})`,
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
//# sourceMappingURL=actions.js.map