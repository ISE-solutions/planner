var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 } from 'uuid';
import { BASE_URL } from '~/config/constants';
import { PREFIX } from '~/config/database';
import getAsByteArray from '../getAsByteArray';
import * as _ from 'lodash';
export default class BatchMultidata {
    constructor(axios) {
        this.batchId = this.makeId(6);
        this.changeset = v4();
        this.requests = [];
        this.axios = axios;
    }
    patch(tableName, itemId, item) {
        this.add('PATCH', false, `/${tableName}(${itemId})`, item);
        return this.requests.length;
    }
    post(tableName, item) {
        this.add('POST', false, `/${tableName}`, item);
        return this.requests.length;
    }
    delete(tableName, itemId) {
        this.add('DELETE', false, `/${tableName}(${itemId})`, null);
    }
    putReference(reference, tableRelation, relationId, relationName) {
        this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
            '@odata.context': `${BASE_URL}/$metadata#$ref`,
            '@odata.id': `${tableRelation}(${relationId})`,
        });
    }
    bulkPostRelationship(tableName, tableParent, parentId, relationName, items) {
        items === null || items === void 0 ? void 0 : items.forEach((item) => {
            this.postRelationship(tableName, tableParent, parentId, relationName, item);
        });
    }
    postRelationship(tableName, tableParent, parentId, relationName, item) {
        const itemId = item.id;
        delete item.id;
        if (itemId) {
            if (item.deleted) {
                this.delete(tableName, itemId);
                return;
            }
            this.patch(tableName, itemId, item);
        }
        else {
            if (!item.deleted) {
                this.post(tableName, item);
            }
            else {
                return this.requests.length - 1;
            }
        }
        this.add('PUT', false, `/${tableParent}(${parentId})/${PREFIX}${relationName}/$ref`, { '@odata.id': '$' + this.requests.length });
        return this.requests.length - 1;
    }
    bulkPostRelationshipReference(tableName, reference, relationName, items) {
        items === null || items === void 0 ? void 0 : items.forEach((item) => {
            this.postRelationshipReference(tableName, reference, relationName, item);
        });
    }
    postRelationshipReference(tableName, reference, relationName, item) {
        const itemId = item.id;
        delete item.id;
        if (itemId) {
            if (item.deleted) {
                this.delete(tableName, itemId);
                return;
            }
            this.patch(tableName, itemId, item);
        }
        else {
            delete item.deleted;
            this.post(tableName, item);
        }
        this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
            '@odata.id': '$' + this.requests.length,
        });
        return this.requests.length - 1;
    }
    bulkPostReferenceRelatioship(tableName, tableParent, itemId, relationName, itemIds) {
        itemIds === null || itemIds === void 0 ? void 0 : itemIds.forEach((elm) => {
            this.add('PUT', true, `${BASE_URL}/${tableName}(${itemId})/${PREFIX}${relationName}/$ref`, {
                '@odata.context': `${BASE_URL}/$metadata#$ref`,
                '@odata.id': `${tableParent}(${elm})`,
            });
        });
    }
    bulkPostReference(tableName, itemIds, reference, relationName) {
        itemIds === null || itemIds === void 0 ? void 0 : itemIds.forEach((elm) => {
            this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
                '@odata.context': `${BASE_URL}/$metadata#$ref`,
                '@odata.id': `${tableName}(${elm})`,
            });
        });
    }
    bulkDeleteReference(tableName, itemIds, parentId, relationName) {
        itemIds === null || itemIds === void 0 ? void 0 : itemIds.forEach((elm) => {
            this.deleteReference(tableName, elm, parentId, relationName);
        });
    }
    bulkDeleteReferenceParent(tableName, itemIds, parentId, relationName) {
        itemIds === null || itemIds === void 0 ? void 0 : itemIds.forEach((elm) => {
            this.deleteReferenceParent(tableName, elm, parentId, relationName);
        });
    }
    deleteReferenceParent(tableName, itemId, parentId, relationName) {
        this.add('DELETE', true, `${BASE_URL}/${tableName}(${parentId})/${PREFIX}${relationName}(${itemId})/$ref`, null);
    }
    deleteReference(tableName, itemId, referenceId, relationName) {
        this.add('DELETE', true, `${BASE_URL}/${tableName}(${itemId})/${PREFIX}${relationName}(${referenceId})/$ref`, null);
    }
    addReference(tableName, reference, itemId, relationName) {
        this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
            '@odata.context': `${BASE_URL}/$metadata#$ref`,
            '@odata.id': `${tableName}(${itemId})`,
        });
    }
    postReference(tableName, itemId, reference, relationName) {
        this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
            '@odata.context': `${BASE_URL}/$metadata#$ref`,
            '@odata.id': `${tableName}(${itemId})`,
        });
        return this.requests.length - 1;
    }
    add(method, isReference, uri, data) {
        const req = new RequestMultiData(this.changeset, this.requests.length + 1, method, uri, isReference, data);
        this.requests.push(req);
    }
    addFile(tableName, fieldName, tableReference, fieldReference, idReference, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const requestId = this.post(tableName, {
                    [`${PREFIX}${fieldReference}@odata.bind`]: `/${tableReference}(${idReference})`,
                });
                const byteArray = yield getAsByteArray(file.file);
                const req = new RequestMultiData(this.changeset, this.requests.length + 1, 'PATCH', '$' + `${requestId}/${fieldName}?x-ms-file-name=${file.nome}`, true, byteArray, 'application/octet-stream');
                this.requests.push(req);
                resolve('Sucesso');
            }));
        });
    }
    toString() {
        let bodyString = `--batch_${this.batchId}\n`;
        bodyString += `Content-Type: multipart/mixed; boundary=changeset_${this.changeset}\n\n`;
        bodyString += `${this.requests.map((req) => req.toString()).join('')}\n`;
        bodyString += `--changeset_${this.changeset}--\n`;
        bodyString += `--batch_${this.batchId}--\n`;
        return bodyString;
    }
    payloadToString(reqs) {
        let bodyString = `--batch_${this.batchId}\n`;
        bodyString += `Content-Type: multipart/mixed; boundary=changeset_${this.changeset}\n\n`;
        bodyString += `${reqs.map((req) => req.toString()).join('')}\n`;
        bodyString += `--changeset_${this.changeset}--\n`;
        bodyString += `--batch_${this.batchId}--\n`;
        return bodyString;
    }
    makeId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.axios({
                    url: `${BASE_URL}/$batch`,
                    method: 'PATCH',
                    headers: {
                        'Content-Type': `multipart/mixed;boundary=batch_${this.batchId}`,
                        Prefer: 'return=representation',
                        Accept: 'application/json',
                    },
                    data: this.toString(),
                })
                    .then((res) => {
                    resolve(res);
                })
                    .catch((err) => {
                    console.error(err);
                    reject(err);
                });
            });
        });
    }
    executeChuncked() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const requestsChunked = _.chunk(this.requests, 950);
                const axiosRequest = [];
                requestsChunked.forEach((payload) => {
                    const req = this.axios({
                        url: `${BASE_URL}/$batch`,
                        method: 'PATCH',
                        headers: {
                            'Content-Type': `multipart/mixed;boundary=batch_${this.batchId}`,
                            Prefer: 'return=representation',
                            Accept: 'application/json',
                        },
                        data: this.payloadToString(payload),
                    });
                    axiosRequest.push(req);
                });
                Promise.all(axiosRequest)
                    .then((res) => {
                    resolve(res);
                })
                    .catch((err) => {
                    reject(err);
                });
            });
        });
    }
}
class RequestMultiData {
    constructor(changeset, contentId, method, uri, isReference, data, contentType) {
        this.changeset = changeset;
        this.contentId = contentId;
        this.method = method;
        this.uri = uri;
        this.isReference = isReference;
        this.data = data;
        this.contentType = contentType;
    }
    toString() {
        let requestBody = `--changeset_${this.changeset}\n`;
        requestBody += `Content-Type: application/http\n`;
        requestBody += `Content-Transfer-Encoding: binary\n`;
        requestBody += `Content-ID: ${this.contentId}\n\n`;
        requestBody += `${this.method} ${this.isReference ? '' : BASE_URL}${this.uri} HTTP/1.1\n`;
        requestBody += `Content-Type: ${this.contentType || 'application/json'} \n\n`;
        requestBody += this.contentType
            ? `${this.data}\n`
            : `${JSON.stringify(this.data)}\n\n`;
        return requestBody;
    }
}
//# sourceMappingURL=index.js.map