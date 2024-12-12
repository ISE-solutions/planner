import { v4 } from 'uuid';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { EActivityTypeApplication, TYPE_RESOURCE } from '~/config/enums';
import momentToMinutes from '~/utils/momentToMinutes';
import getDurationMoment from '../getDurationMoment';
import * as _ from 'lodash';
export default (item, date, { isModel, dictTag, dictSpace, dictPeople, temp = null }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const getDates = (item) => {
        const dateRef = date === null || date === void 0 ? void 0 : date.clone().format('YYYY-MM-DD');
        let startTime = moment().format('HH:mm');
        if (item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`]) {
            startTime = item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`];
        }
        const startDate = moment(`${dateRef} ${startTime}`);
        const momentDuration = moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}duracao`], 'HH:mm');
        const minutes = momentToMinutes(momentDuration);
        return {
            startDate: startDate.format(),
            endDate: startDate.clone().add(minutes, 'minutes').format(),
        };
    };
    const { startDate, endDate } = getDates(item);
    return Object.assign(Object.assign({}, getDates(item)), { teamId: item === null || item === void 0 ? void 0 : item.teamId, programId: item === null || item === void 0 ? void 0 : item.programId, name: (item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`]) || '', type: (item === null || item === void 0 ? void 0 : item[`${PREFIX}tipo`]) || '', typeApplication: isModel
            ? EActivityTypeApplication.MODELO
            : EActivityTypeApplication.APLICACAO, theme: (item === null || item === void 0 ? void 0 : item[`${PREFIX}temaaula`]) || '', startTime: ((item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`]) &&
            moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`], 'HH:mm')) ||
            moment(startDate), endTime: ((item === null || item === void 0 ? void 0 : item[`${PREFIX}fim`]) && moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}fim`], 'HH:mm')) ||
            moment(endDate), description: (item === null || item === void 0 ? void 0 : item[`${PREFIX}descricaoobjetivo`]) || '', observation: (item === null || item === void 0 ? void 0 : item[`${PREFIX}observacao`]) || '', duration: ((item === null || item === void 0 ? void 0 : item[`${PREFIX}duracao`]) &&
            moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}duracao`], 'HH:mm')) ||
            getDurationMoment(moment(startDate), moment(endDate)), quantity: (item === null || item === void 0 ? void 0 : item[`${PREFIX}quantidadesessao`]) || 0, area: (item === null || item === void 0 ? void 0 : item[`${PREFIX}AreaAcademica`])
            ? Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item[`${PREFIX}AreaAcademica`]), { value: (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}AreaAcademica`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`], label: (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}AreaAcademica`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`] }) : null, course: item[`${PREFIX}Curso`]
            ? Object.assign(Object.assign({}, item[`${PREFIX}Curso`]), { value: (_c = item[`${PREFIX}Curso`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`], label: (_d = item[`${PREFIX}Curso`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`] }) : null, spaces: _.has(item, 'spaces')
            ? item === null || item === void 0 ? void 0 : item.spaces
            : ((_e = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`]) === null || _e === void 0 ? void 0 : _e.length)
                ? item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`].map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]]).filter((e) => e)
                : [], spacesToDelete: (item === null || item === void 0 ? void 0 : item.spacesToDelete) || [], names: (_f = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_NomeAtividade`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
            name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
            nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
            nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
            use: e === null || e === void 0 ? void 0 : e[`${PREFIX}uso`],
        })), academicRequests: (_g = item === null || item === void 0 ? void 0 : item[`${PREFIX}RequisicaoAcademica_Atividade`]) === null || _g === void 0 ? void 0 : _g.map((request) => {
            var _a;
            const peopleRequest = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}PessoasRequisica_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((pe) => (pe === null || pe === void 0 ? void 0 : pe[`_${PREFIX}requisicao_pessoasenvolvidas_value`]) ===
                (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
            return {
                keyId: v4(),
                id: request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`],
                description: request === null || request === void 0 ? void 0 : request[`${PREFIX}descricao`],
                deadline: request === null || request === void 0 ? void 0 : request[`${PREFIX}prazominimo`],
                delivery: request === null || request === void 0 ? void 0 : request[`${PREFIX}momentoentrega`],
                deliveryDate: (request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                    ? moment(request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                    : null,
                people: (peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.length)
                    ? peopleRequest.map((e) => ({
                        keyId: v4(),
                        id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                        person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                        function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
                    }))
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ],
            };
        }), documents: (_h = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Documento`]) === null || _h === void 0 ? void 0 : _h.map((e) => ({
            name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
            link: e === null || e === void 0 ? void 0 : e[`${PREFIX}link`],
            font: e === null || e === void 0 ? void 0 : e[`${PREFIX}fonte`],
            delivery: e === null || e === void 0 ? void 0 : e[`${PREFIX}entrega`],
        })), resources: item === null || item === void 0 ? void 0 : item[`${PREFIX}recursos_Atividade`], equipments: item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Equipamentos`], finiteResource: (_j = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _j === void 0 ? void 0 : _j.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO), temperature: (item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`])
            ? Object.assign(Object.assign({}, item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]), { value: (_k = item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]) === null || _k === void 0 ? void 0 : _k[`${PREFIX}etiquetaid`], label: (_l = item === null || item === void 0 ? void 0 : item[`${PREFIX}Temperatura`]) === null || _l === void 0 ? void 0 : _l[`${PREFIX}nome`] }) : temp, infiniteResource: (_m = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _m === void 0 ? void 0 : _m.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO), people: (item === null || item === void 0 ? void 0 : item.people)
            ? item === null || item === void 0 ? void 0 : item.people
            : (_p = (_o = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _o === void 0 ? void 0 : _o.map((e) => ({
                person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                function: dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
            }))) === null || _p === void 0 ? void 0 : _p.filter((e) => e) });
};
//# sourceMappingURL=index.js.map