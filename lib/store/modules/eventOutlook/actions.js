var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ACTION_DELETE, BASE_URL_API_NET, } from '~/config/constants';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import api from '~/services/api';
export const executeEventOutlook = (blockUpdated, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Calendario`, blockUpdated, axiosConfig);
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('');
        resolve('');
    }
    catch (err) {
        console.error(err);
        onError === null || onError === void 0 ? void 0 : onError(err);
        reject(err);
    }
}));
export const executeEventDeleteOutlook = (blockUpdated, { onSuccess, onError }) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const { data } = yield api.post(`${BASE_URL_API_NET}Calendario`, blockUpdated, axiosConfig);
    try {
        // const reference = references?.find(
        //   (e) => e?.[`${PREFIX}nome`] === REFERENCE_EVENT
        // );
        // const fetchResponse = await fetch(reference?.[`${PREFIX}referencia`], {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ Agendamento: dataToSave }),
        // });
        // const data = await fetchResponse.text();
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess('');
        resolve('');
    }
    catch (err) {
        console.error(err);
        onError === null || onError === void 0 ? void 0 : onError(err);
        reject(err);
    }
}));
export const addOrUpdateEventsByResources = (blockUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = yield api.post(`${BASE_URL_API_NET}Calendario`, blockUpdated, axiosConfig);
        resolve('Salvo');
    }));
});
export const deleteEventsByResources = (resources, { references, dictPeople, dictSpace }, blockUpdated) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const eventsToDelete = [];
        resources === null || resources === void 0 ? void 0 : resources.forEach((res) => {
            var _a, _b;
            eventsToDelete.push({
                action: ACTION_DELETE,
                title: 'Exclusão',
                email: ((_a = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[res === null || res === void 0 ? void 0 : res[`_${PREFIX}espaco_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}email`]) ||
                    ((_b = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[res === null || res === void 0 ? void 0 : res[`_${PREFIX}pessoa_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}email`]) ||
                    'teste@ise.org.br',
                activity: res === null || res === void 0 ? void 0 : res[`${PREFIX}Atividade`],
                activityId: res === null || res === void 0 ? void 0 : res[`_${PREFIX}atividade_value`],
                start: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}inicio`]).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(res === null || res === void 0 ? void 0 : res[`${PREFIX}fim`]).format('YYYY-MM-DD HH:mm:ss'),
                resourceId: res === null || res === void 0 ? void 0 : res[`${PREFIX}recursosid`],
                eventId: res === null || res === void 0 ? void 0 : res[`${PREFIX}eventoid`],
            });
        });
        yield executeEventDeleteOutlook(blockUpdated, {
            onSuccess: () => null,
            onError: () => null,
        });
        resolve('Salvo');
    }));
});
//# sourceMappingURL=actions.js.map