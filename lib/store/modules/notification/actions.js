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
import { NOTIFICATIONS, PREFIX } from '~/config/database';
import { buildItem, buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
export const fetchAllNotification = (filter) => (dispatch) => __awaiter(void 0, void 0, void 0, function* () {
    dispatch(setValue(EActionType.FETCH_ALL_REQUEST, null));
    try {
        const query = buildQuery(filter);
        let headers = {};
        if (filter.rowsPerPage) {
            headers = {
                Prefer: `odata.maxpagesize=${filter.rowsPerPage}`,
            };
        }
        const { data } = yield api.get(`${NOTIFICATIONS}${query}`, {
            headers,
        });
        dispatch(setValue(EActionType.FETCH_ALL_SUCCESS, data === null || data === void 0 ? void 0 : data.value));
    }
    catch (error) {
        console.error(error);
        // handle your error
    }
});
export const addOrUpdateNotification = (notification, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataToSave = buildItem(notification);
        yield api({
            url: NOTIFICATIONS,
            method: 'POST',
            headers: {
                Prefer: 'return=representation',
            },
            data: dataToSave,
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
export const batchAddNotification = (notifications, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const batch = new BatchMultidata(api);
        notifications.forEach((not) => {
            batch.post(NOTIFICATIONS, buildItem(not));
        });
        yield batch.execute();
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('Salvo');
        resolve('Salvo');
    }
    catch (error) {
        console.log(error);
        onError === null || onError === void 0 ? void 0 : onError(error);
        reject(error);
    }
}));
export const readAllNotification = (ids, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        ids.forEach((id) => {
            batch.patch(NOTIFICATIONS, id, {
                [`${PREFIX}lido`]: true,
            });
        });
        try {
            yield batch.execute();
            resolve({});
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
export const readNotification = (id, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(NOTIFICATIONS, id, {
            [`${PREFIX}lido`]: true,
        });
        try {
            yield batch.execute();
            resolve({});
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
//# sourceMappingURL=actions.js.map