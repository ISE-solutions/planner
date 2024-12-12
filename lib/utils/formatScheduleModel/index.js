import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { v4 } from 'uuid';
export default (item, { dictTag, dictPeople, dictSpace }) => {
    var _a, _b, _c;
    return {
        name: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
        date: (item === null || item === void 0 ? void 0 : item[`${PREFIX}data`]) ? moment.utc(item === null || item === void 0 ? void 0 : item[`${PREFIX}data`]) : null,
        module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[item === null || item === void 0 ? void 0 : item[`_${PREFIX}modulo_value`]],
        modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[item === null || item === void 0 ? void 0 : item[`_${PREFIX}modalidade_value`]],
        tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[item === null || item === void 0 ? void 0 : item[`_${PREFIX}ferramenta_value`]],
        toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[item === null || item === void 0 ? void 0 : item[`_${PREFIX}ferramentabackup_value`]],
        place: dictTag === null || dictTag === void 0 ? void 0 : dictTag[item === null || item === void 0 ? void 0 : item[`_${PREFIX}local_value`]],
        link: item === null || item === void 0 ? void 0 : item[`${PREFIX}link`],
        linkBackup: item === null || item === void 0 ? void 0 : item[`${PREFIX}linkbackup`],
        temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) ||
            null,
        observation: item === null || item === void 0 ? void 0 : item[`${PREFIX}observacao`],
        activities: item.activities,
        activitiesToDelete: [],
        people: item[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]
            .map((e) => ({
            keyId: v4(),
            id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
            function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
        }))
            .filter((e) => e),
        locale: ((_b = item[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _b === void 0 ? void 0 : _b.length)
            ? (_c = item[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _c === void 0 ? void 0 : _c.map((e) => ({
                keyId: v4(),
                id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
            }))
            : [{ keyId: v4(), person: null, function: null }],
    };
};
//# sourceMappingURL=index.js.map