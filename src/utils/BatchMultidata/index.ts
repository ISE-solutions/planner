import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions } from 'axios-hooks';
import { v4 } from 'uuid';
import { BASE_URL } from '~/config/constants';
import { PREFIX } from '~/config/database';
import getAsByteArray from '../getAsByteArray';
import * as _ from 'lodash';

export default class BatchMultidata {
  constructor(
    axios: (
      config?: AxiosRequestConfig<any>,
      options?: RefetchOptions
    ) => AxiosPromise<any>
  ) {
    this.batchId = this.makeId(6);
    this.changeset = v4();
    this.requests = [];
    this.axios = axios;
  }

  public batchId: string;
  public changeset: string;
  public requests: RequestMultiData[];
  public axios: (
    config?: AxiosRequestConfig<any>,
    options?: RefetchOptions
  ) => AxiosPromise<any>;

  public patch(tableName: string, itemId: string, item: any): number {
    this.add('PATCH', false, `/${tableName}(${itemId})`, item);

    return this.requests.length;
  }

  public post(tableName: string, item: any): number {
    this.add('POST', false, `/${tableName}`, item);
    return this.requests.length;
  }

  public delete(tableName: string, itemId: any) {
    this.add('DELETE', false, `/${tableName}(${itemId})`, null);
  }

  public putReference(
    reference: number,
    tableRelation: string,
    relationId: string,
    relationName: string
  ) {
    this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
      '@odata.context': `${BASE_URL}/$metadata#$ref`,
      '@odata.id': `${tableRelation}(${relationId})`,
    });
  }

  public bulkPostRelationship(
    tableName: string,
    tableParent: string,
    parentId: string,
    relationName: string,
    items: any[]
  ) {
    items?.forEach((item) => {
      this.postRelationship(
        tableName,
        tableParent,
        parentId,
        relationName,
        item
      );
    });
  }

  public postRelationship(
    tableName: string,
    tableParent: string,
    parentId: string,
    relationName: string,
    item: any
  ): number {
    const itemId = item.id;
    delete item.id;

    if (itemId) {
      if (item.deleted) {
        this.delete(tableName, itemId);
        return;
      }
      this.patch(tableName, itemId, item);
    } else {
      if (!item.deleted) {
        this.post(tableName, item);
      } else {
        return this.requests.length - 1;
      }
    }

    this.add(
      'PUT',
      false,
      `/${tableParent}(${parentId})/${PREFIX}${relationName}/$ref`,
      { '@odata.id': '$' + this.requests.length }
    );

    return this.requests.length - 1;
  }

  public bulkPostRelationshipReference(
    tableName: string,
    reference: number,
    relationName: string,
    items: any[]
  ) {
    items?.forEach((item) => {
      this.postRelationshipReference(tableName, reference, relationName, item);
    });
  }

  public postRelationshipReference(
    tableName: string,
    reference: number,
    relationName: string,
    item: any
  ): number {
    const itemId = item.id;
    delete item.id;

    if (itemId) {
      if (item.deleted) {
        this.delete(tableName, itemId);
        return;
      }
      this.patch(tableName, itemId, item);
    } else {
      delete item.deleted;
      this.post(tableName, item);
    }

    this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
      '@odata.id': '$' + this.requests.length,
    });

    return this.requests.length - 1;
  }

  public bulkPostReferenceRelatioship(
    tableName: string,
    tableParent: string,
    itemId: number,
    relationName: string,
    itemIds: string[]
  ) {
    itemIds?.forEach((elm) => {
      this.add(
        'PUT',
        true,
        `${BASE_URL}/${tableName}(${itemId})/${PREFIX}${relationName}/$ref`,
        {
          '@odata.context': `${BASE_URL}/$metadata#$ref`,
          '@odata.id': `${tableParent}(${elm})`,
        }
      );
    });
  }

  public bulkPostReference(
    tableName: string,
    itemIds: string[],
    reference: number,
    relationName: string
  ) {
    itemIds?.forEach((elm) => {
      this.add(
        'PUT',
        true,
        '$' + `${reference}/${PREFIX}${relationName}/$ref`,
        {
          '@odata.context': `${BASE_URL}/$metadata#$ref`,
          '@odata.id': `${tableName}(${elm})`,
        }
      );
    });
  }

  public bulkDeleteReference(
    tableName: string,
    itemIds: string[],
    parentId: number,
    relationName: string
  ) {
    itemIds?.forEach((elm) => {
      this.deleteReference(tableName, elm, parentId, relationName);
    });
  }

  public bulkDeleteReferenceParent(
    tableName: string,
    itemIds: string[],
    parentId: string,
    relationName: string
  ) {
    itemIds?.forEach((elm) => {
      this.deleteReferenceParent(tableName, elm, parentId, relationName);
    });
  }

  public deleteReferenceParent(
    tableName: string,
    itemId: string,
    parentId: string,
    relationName: string
  ) {
    this.add(
      'DELETE',
      true,
      `${BASE_URL}/${tableName}(${parentId})/${PREFIX}${relationName}(${itemId})/$ref`,
      null
    );
  }

  public deleteReference(
    tableName: string,
    itemId: string,
    referenceId: number,
    relationName: string
  ) {
    this.add(
      'DELETE',
      true,
      `${BASE_URL}/${tableName}(${itemId})/${PREFIX}${relationName}(${referenceId})/$ref`,
      null
    );
  }

  public addReference(
    tableName: string,
    reference: number,
    itemId: string,
    relationName: string
  ) {
    this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
      '@odata.context': `${BASE_URL}/$metadata#$ref`,
      '@odata.id': `${tableName}(${itemId})`,
    });
  }

  public postReference(
    tableName: string,
    itemId: string,
    reference: number,
    relationName: string
  ): number {
    this.add('PUT', true, '$' + `${reference}/${PREFIX}${relationName}/$ref`, {
      '@odata.context': `${BASE_URL}/$metadata#$ref`,
      '@odata.id': `${tableName}(${itemId})`,
    });

    return this.requests.length - 1;
  }

  public add(method: string, isReference: boolean, uri: string, data: any) {
    const req = new RequestMultiData(
      this.changeset,
      this.requests.length + 1,
      method,
      uri,
      isReference,
      data
    );

    this.requests.push(req);
  }

  public async addFile(
    tableName: string,
    fieldName: string,
    tableReference: string,
    fieldReference: string,
    idReference: string,
    file: any
  ) {
    return new Promise(async (resolve, reject) => {
      const requestId = this.post(tableName, {
        [`${PREFIX}${fieldReference}@odata.bind`]: `/${tableReference}(${idReference})`,
      });

      const byteArray = await getAsByteArray(file.file);

      const req = new RequestMultiData(
        this.changeset,
        this.requests.length + 1,
        'PATCH',
        '$' + `${requestId}/${fieldName}?x-ms-file-name=${file.nome}`,
        true,
        byteArray,
        'application/octet-stream'
      );

      this.requests.push(req);
      resolve('Sucesso');
    });
  }

  public toString(): string {
    let bodyString = `--batch_${this.batchId}\n`;
    bodyString += `Content-Type: multipart/mixed; boundary=changeset_${this.changeset}\n\n`;
    bodyString += `${this.requests.map((req) => req.toString()).join('')}\n`;
    bodyString += `--changeset_${this.changeset}--\n`;
    bodyString += `--batch_${this.batchId}--\n`;

    return bodyString;
  }

  private payloadToString(reqs): string {
    let bodyString = `--batch_${this.batchId}\n`;
    bodyString += `Content-Type: multipart/mixed; boundary=changeset_${this.changeset}\n\n`;
    bodyString += `${reqs.map((req) => req.toString()).join('')}\n`;
    bodyString += `--changeset_${this.changeset}--\n`;
    bodyString += `--batch_${this.batchId}--\n`;

    return bodyString;
  }

  private makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public async execute(): Promise<unknown> {
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
  }

  public async executeChuncked(): Promise<unknown> {
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
  }
}

class RequestMultiData {
  constructor(
    public changeset: string,
    public contentId: number,
    public method: string,
    public uri: string,
    public isReference: boolean,
    public data: any,
    public contentType?: string
  ) {}

  public toString(): string {
    let requestBody = `--changeset_${this.changeset}\n`;
    requestBody += `Content-Type: application/http\n`;
    requestBody += `Content-Transfer-Encoding: binary\n`;
    requestBody += `Content-ID: ${this.contentId}\n\n`;
    requestBody += `${this.method} ${this.isReference ? '' : BASE_URL}${
      this.uri
    } HTTP/1.1\n`;
    requestBody += `Content-Type: ${
      this.contentType || 'application/json'
    } \n\n`;
    requestBody += this.contentType
      ? `${this.data}\n`
      : `${JSON.stringify(this.data)}\n\n`;

    return requestBody;
  }
}
