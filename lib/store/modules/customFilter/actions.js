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
import { PREFIX, CUSTOM_FILTER } from '~/config/database';
import { buildItem, buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';
export const fetchAllCustomFilter = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${CUSTOM_FILTER}${query}`, {
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
const getCustomFilterById = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}filtroid`, 'eq', id));
        query.count();
        api({
            url: `${CUSTOM_FILTER}${query.toQuery()}`,
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
export const addOrUpdateCustomFilter = (customFilter, { onSuccess, onError }) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        let customFilterId = customFilter.id;
        const dataToSave = buildItem(customFilter);
        const batch = new BatchMultidata(api);
        if (customFilterId) {
            batch.patch(CUSTOM_FILTER, customFilterId, dataToSave);
        }
        else {
            const response = yield api({
                url: CUSTOM_FILTER,
                method: 'POST',
                headers: {
                    Prefer: 'return=representation',
                },
                data: dataToSave,
            });
            customFilterId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[`${PREFIX}filtroid`];
        }
        try {
            yield batch.execute();
            const newTag = yield getCustomFilterById(customFilterId);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _b === void 0 ? void 0 : _b[0]);
            resolve((_c = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _c === void 0 ? void 0 : _c[0]);
        }
        catch (error) {
            console.log(error);
            onError === null || onError === void 0 ? void 0 : onError(error);
            reject(error);
        }
    }));
});
export const updateCustomFilter = (id, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const batch = new BatchMultidata(api);
        batch.patch(CUSTOM_FILTER, id, toSave);
        try {
            yield batch.execute();
            const item = yield getCustomFilterById(id);
            resolve((_a = item === null || item === void 0 ? void 0 : item.value) === null || _a === void 0 ? void 0 : _a[0]);
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_b = item === null || item === void 0 ? void 0 : item.value) === null || _b === void 0 ? void 0 : _b[0]);
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
//# sourceMappingURL=actions.js.map