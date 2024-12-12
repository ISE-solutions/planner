import { v4 } from 'uuid';
import * as moment from 'moment';
import { PREFIX } from './../../config/database';
export default (item, { dictTag, dictPeople }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        title: item[`${PREFIX}titulo`] || '',
        sigla: item[`${PREFIX}sigla`] || '',
        name: item[`${PREFIX}nome`] || '',
        model: item[`${PREFIX}modelo`],
        teamCode: item[`${PREFIX}codigodaturma`] || '',
        teamName: item[`${PREFIX}nomefinanceiro`] || '',
        mask: item[`${PREFIX}mascara`] || '',
        maskBackup: item[`${PREFIX}mascarabackup`] || '',
        yearConclusion: item[`${PREFIX}anodeconclusao`] || '',
        description: item[`${PREFIX}observacao`] || '',
        modality: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Modalidade`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) || null,
        temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) ||
            null,
        anexos: [],
        schedules: item.schedules || [],
        names: ((_c = item[`${PREFIX}Turma_NomeTurma`]) === null || _c === void 0 ? void 0 : _c.length)
            ? (_d = item[`${PREFIX}Turma_NomeTurma`]) === null || _d === void 0 ? void 0 : _d.map((e) => ({
                keyId: v4(),
                id: e[`${PREFIX}nometurmaid`],
                name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                use: e === null || e === void 0 ? void 0 : e[`${PREFIX}uso`],
            }))
            : [
                {
                    name: '',
                    nameEn: '',
                    nameEs: '',
                    use: '',
                },
            ],
        participants: ((_e = item[`${PREFIX}Turma_ParticipantesTurma`]) === null || _e === void 0 ? void 0 : _e.length)
            ? (_f = item[`${PREFIX}Turma_ParticipantesTurma`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                keyId: v4(),
                id: e[`${PREFIX}participantesturmaid`],
                date: (e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]) && moment.utc(e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]),
                quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                use: e === null || e === void 0 ? void 0 : e[`${PREFIX}uso`],
            }))
            : [
                {
                    date: null,
                    quantity: '',
                    use: '',
                },
            ],
        people: ((_g = item[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _g === void 0 ? void 0 : _g.length)
            ? (_h = item[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _h === void 0 ? void 0 : _h.map((e, index) => ({
                keyId: v4(),
                id: e[`${PREFIX}pessoasenvolvidasturmaid`],
                person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
            }))
            : [
                {
                    person: null,
                    function: null,
                },
            ],
    };
};
//# sourceMappingURL=index.js.map