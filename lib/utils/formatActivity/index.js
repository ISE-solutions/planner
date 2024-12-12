import * as moment from 'moment';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
export default (activity, { dictTag, dictSpace, dictPeople }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return Object.assign(Object.assign({}, activity), { id: activity[`${PREFIX}atividadeid`], title: activity[`${PREFIX}titulo`] || '', name: activity[`${PREFIX}nome`] || '', startDate: moment(activity[`${PREFIX}datahorainicio`]).format(), endDate: moment(activity[`${PREFIX}datahorafim`]).format(), startTime: (activity[`${PREFIX}inicio`] &&
            moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
            null, duration: (activity[`${PREFIX}duracao`] &&
            moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
            null, endTime: (activity[`${PREFIX}fim`] && moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
            null, quantity: activity[`${PREFIX}quantidadesessao`] || 0, typeApplication: activity[`${PREFIX}tipoaplicacao`], type: activity[`${PREFIX}tipo`], theme: activity[`${PREFIX}temaaula`] || '', description: activity[`${PREFIX}descricaoobjetivo`] || '', observation: activity[`${PREFIX}observacao`] || '', documents: (_a = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Documento`]) === null || _a === void 0 ? void 0 : _a.map((document) => ({
            keyId: v4(),
            id: document === null || document === void 0 ? void 0 : document[`${PREFIX}documentosatividadeid`],
            name: document === null || document === void 0 ? void 0 : document[`${PREFIX}nome`],
            link: document === null || document === void 0 ? void 0 : document[`${PREFIX}link`],
            font: document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`],
            delivery: document === null || document === void 0 ? void 0 : document[`${PREFIX}entrega`],
        })), temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_b = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Temperatura`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}etiquetaid`]]) ||
            null, academicRequests: [], area: activity[`${PREFIX}AreaAcademica`]
            ? Object.assign(Object.assign({}, activity[`${PREFIX}AreaAcademica`]), { value: (_c = activity[`${PREFIX}AreaAcademica`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], label: (_d = activity[`${PREFIX}AreaAcademica`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`] }) : null, course: activity[`${PREFIX}Curso`]
            ? Object.assign(Object.assign({}, activity[`${PREFIX}Curso`]), { value: (_e = activity[`${PREFIX}Curso`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`], label: (_f = activity[`${PREFIX}Curso`]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`] }) : null, spaces: ((_g = activity[`${PREFIX}Atividade_Espaco`]) === null || _g === void 0 ? void 0 : _g.length)
            ? (_h = activity[`${PREFIX}Atividade_Espaco`]) === null || _h === void 0 ? void 0 : _h.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
            : [], names: ((_j = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _j === void 0 ? void 0 : _j.length)
            ? (_k = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _k === void 0 ? void 0 : _k.map((e) => ({
                keyId: v4(),
                id: e[`${PREFIX}nomeatividadeid`],
                name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
            }))
            : [
                {
                    keyId: v4(),
                    name: '',
                    nameEn: '',
                    nameEs: '',
                    use: '',
                },
            ], people: ((_l = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _l === void 0 ? void 0 : _l.length)
            ? (_m = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _m === void 0 ? void 0 : _m.map((e) => {
                var _a;
                const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasatividadeid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func });
            })
            : [
                {
                    keyId: v4(),
                    person: null,
                    function: null,
                },
            ] });
};
//# sourceMappingURL=index.js.map