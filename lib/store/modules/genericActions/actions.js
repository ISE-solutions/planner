var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { buildItem } from './utils';
import { REFERENCE_TEMPERATURE } from '~/config/constants';
import * as _ from 'lodash';
import { PREFIX } from '~/config/database';
export const executeChangeTemperature = (payload, { onSuccess, onError }) => (dispatch, getState) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const { environmentReference } = getState();
        const { references } = environmentReference;
        const dataToSave = _.omitBy(buildItem(payload), _.isNil);
        try {
            const reference = references === null || references === void 0 ? void 0 : references.find((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === REFERENCE_TEMPERATURE);
            const fetchResponse = yield fetch(reference === null || reference === void 0 ? void 0 : reference[`${PREFIX}referencia`], {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSave),
            });
            const data = yield fetchResponse.text();
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(data);
            resolve(data);
        }
        catch (err) {
            console.error(err);
            onError === null || onError === void 0 ? void 0 : onError(err);
            reject(err);
        }
    }));
});
//# sourceMappingURL=actions.js.map