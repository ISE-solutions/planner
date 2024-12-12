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
import { DELIVERY, PREFIX, SCHEDULE_DAY, TASK, TEAM } from '~/config/database';
import { buildQuery } from './utils';
import { EActionType } from './types';
import { setValue } from '../common';
import BatchMultidata from '~/utils/BatchMultidata';
import { QueryBuilder } from 'odata-query-builder';
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
export const getDeliveryById = (id) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => f.filterExpression(`${PREFIX}entregaid`, 'eq', id));
        query.expand(`${PREFIX}Turma,${PREFIX}Entrega_CronogramadeDia`);
        query.count();
        api({
            url: `${DELIVERY}${query.toQuery()}`,
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
export const getDeliveryByTeamId = (teamId) => {
    return new Promise((resolve, reject) => {
        var query = new QueryBuilder().filter((f) => {
            f.filterExpression(`${PREFIX}Turma/${PREFIX}turmaid`, 'eq', teamId);
            f.filterExpression(`${PREFIX}ativo`, 'eq', true);
            return f;
        });
        query.expand(`${PREFIX}Turma,${PREFIX}Entrega_CronogramadeDia`);
        query.count();
        api({
            url: `${DELIVERY}${query.toQuery()}`,
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
export const addOrUpdateDelivery = (delivery, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    // tslint:disable-next-line: no-shadowed-variable
    const dataToSave = {
        [`${PREFIX}titulo`]: delivery.title,
        [`${PREFIX}gradefinal`]: (_a = delivery.finalGrid) === null || _a === void 0 ? void 0 : _a.format(),
        [`${PREFIX}outlines`]: (_b = delivery.outlines) === null || _b === void 0 ? void 0 : _b.format(),
        [`${PREFIX}horarios`]: (_c = delivery.times) === null || _c === void 0 ? void 0 : _c.format(),
        [`${PREFIX}aprovacao`]: (_d = delivery.approval) === null || _d === void 0 ? void 0 : _d.format(),
        [`${PREFIX}moodlepasta`]: (_e = delivery.moodleFolder) === null || _e === void 0 ? void 0 : _e.format(),
        [`${PREFIX}conferirmoodle`]: (_f = delivery.checkMoodle) === null || _f === void 0 ? void 0 : _f.format(),
        [`${PREFIX}Turma@odata.bind`]: delivery.teamId && `/${TEAM}(${delivery.teamId})`,
    };
    const batch = new BatchMultidata(api);
    let deliveryId = delivery.id;
    if (deliveryId) {
        batch.patch(DELIVERY, deliveryId, dataToSave);
    }
    else {
        const response = yield api({
            url: DELIVERY,
            method: 'POST',
            headers: {
                Prefer: 'return=representation',
            },
            data: dataToSave,
        });
        deliveryId = (_g = response.data) === null || _g === void 0 ? void 0 : _g[`${PREFIX}entregaid`];
    }
    batch.bulkPostReferenceRelatioship(DELIVERY, SCHEDULE_DAY, deliveryId, 'Entrega_CronogramadeDia', (_h = delivery === null || delivery === void 0 ? void 0 : delivery.days) === null || _h === void 0 ? void 0 : _h.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}cronogramadediaid`]));
    batch.bulkDeleteReferenceParent(DELIVERY, (_j = delivery === null || delivery === void 0 ? void 0 : delivery.daysToDelete) === null || _j === void 0 ? void 0 : _j.map((spc) => spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}cronogramadediaid`]), deliveryId, 'Entrega_CronogramadeDia');
    try {
        yield batch.execute();
        const newTag = yield getDeliveryById(deliveryId);
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess((_k = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _k === void 0 ? void 0 : _k[0]);
        resolve((_l = newTag === null || newTag === void 0 ? void 0 : newTag.value) === null || _l === void 0 ? void 0 : _l[0]);
    }
    catch (error) {
        console.log(error);
        onError === null || onError === void 0 ? void 0 : onError(error);
        reject(error);
    }
}));
export const updateDelivery = (id, toSave, { onSuccess, onError }) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const batch = new BatchMultidata(api);
        batch.patch(DELIVERY, id, toSave);
        try {
            yield batch.execute();
            resolve('Sucesso');
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('Sucesso');
        }
        catch (err) {
            reject === null || reject === void 0 ? void 0 : reject(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
        }
    }));
};
//# sourceMappingURL=actions.js.map