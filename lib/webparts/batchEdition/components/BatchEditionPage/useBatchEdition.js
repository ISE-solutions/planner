import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { v4 } from 'uuid';
import { PREFIX } from '~/config/database';
import { EFatherTag, TYPE_ACTIVITY_LABEL, TYPE_RESOURCE } from '~/config/enums';
const useBatchEdition = ({ tags, finiteInfiniteResources, }) => {
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS));
    }), [tags]);
    const modalityOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_TURMA);
    }), [tags]);
    const modalityDayOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_DIA);
    }), [tags]);
    const moduleOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODULO);
    }), [tags]);
    const areaOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    }), [tags]);
    const courseOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.COURSE);
    }), [tags]);
    const functionOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO);
    }), [tags]);
    const useOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_RELATORIO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const useParticipantsOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_PARTICIPANTE)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const equipmentsOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EQUIPAMENTO_OUTROS);
    }), [tags]);
    const finiteResources = React.useMemo(() => finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO), [finiteInfiniteResources]);
    const infiniteResources = React.useMemo(() => finiteInfiniteResources === null || finiteInfiniteResources === void 0 ? void 0 : finiteInfiniteResources.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO), [finiteInfiniteResources]);
    const buildInitDate = ({ dictTag, setTeam, reset, dictPeople, dictSpace, teamSaved, schedules, activities, requestsAcademic, }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let schls = (_a = schedules === null || schedules === void 0 ? void 0 : schedules.map((scheduleDay) => {
            var _a, _b, _c, _d, _e;
            return {
                id: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}cronogramadediaid`],
                modeloid: scheduleDay.modeloid,
                baseadoemcronogramadiamodelo: scheduleDay.baseadoemcronogramadiamodelo,
                name: (scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}nome`]) || '',
                date: moment.utc(scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}data`]),
                module: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}modulo_value`]],
                modality: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}modalidade_value`]],
                tool: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}ferramenta_value`]],
                isGroupActive: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}agrupamentoatividade`],
                startTime: (scheduleDay[`${PREFIX}inicio`] &&
                    moment(scheduleDay[`${PREFIX}inicio`], 'HH:mm')) ||
                    null,
                endTime: (scheduleDay[`${PREFIX}fim`] &&
                    moment(scheduleDay[`${PREFIX}fim`], 'HH:mm')) ||
                    null,
                duration: (scheduleDay[`${PREFIX}duracao`] &&
                    moment(scheduleDay[`${PREFIX}duracao`], 'HH:mm')) ||
                    null,
                toolBackup: dictTag === null || dictTag === void 0 ? void 0 : dictTag[scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`_${PREFIX}ferramentabackup_value`]],
                link: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}link`],
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_a = scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]]) || null,
                linkBackup: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}linkbackup`],
                observation: scheduleDay === null || scheduleDay === void 0 ? void 0 : scheduleDay[`${PREFIX}observacao`],
                people: ((_b = scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _b === void 0 ? void 0 : _b.length)
                    ? (_c = scheduleDay[`${PREFIX}CronogramadeDia_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return {
                            keyId: v4(),
                            id: e === null || e === void 0 ? void 0 : e[`${PREFIX}pessoasenvolvidascronogramadiaid`],
                            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                            function: func,
                        };
                    })
                    : [{ keyId: v4(), person: null, function: null }],
                locale: ((_d = scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _d === void 0 ? void 0 : _d.length)
                    ? (_e = scheduleDay[`${PREFIX}CronogramadeDia_LocalCronogramaDia`]) === null || _e === void 0 ? void 0 : _e.map((e) => ({
                        keyId: v4(),
                        id: e === null || e === void 0 ? void 0 : e[`${PREFIX}localcronogramadiaid`],
                        space: dictSpace[e === null || e === void 0 ? void 0 : e[`_${PREFIX}espaco_value`]],
                        observation: e === null || e === void 0 ? void 0 : e[`${PREFIX}observacao`],
                    }))
                    : [{ keyId: v4(), person: null, function: null }],
            };
        })) === null || _a === void 0 ? void 0 : _a.sort((left, right) => left === null || left === void 0 ? void 0 : left.date.diff(right === null || right === void 0 ? void 0 : right.date));
        let actvs = (_b = activities === null || activities === void 0 ? void 0 : activities.sort((a, b) => moment(a === null || a === void 0 ? void 0 : a[`${PREFIX}datahorainicio`]).unix() -
            moment(b === null || b === void 0 ? void 0 : b[`${PREFIX}datahorainicio`]).unix())) === null || _b === void 0 ? void 0 : _b.map((activity) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            const st = (activity[`${PREFIX}inicio`] &&
                moment(activity[`${PREFIX}inicio`], 'HH:mm')) ||
                null;
            const et = (activity[`${PREFIX}fim`] &&
                moment(activity[`${PREFIX}fim`], 'HH:mm')) ||
                null;
            const d = (activity[`${PREFIX}duracao`] &&
                moment(activity[`${PREFIX}duracao`], 'HH:mm')) ||
                null;
            const sp = ((_a = activity[`${PREFIX}Atividade_Espaco`]) === null || _a === void 0 ? void 0 : _a.length)
                ? (_b = activity[`${PREFIX}Atividade_Espaco`]) === null || _b === void 0 ? void 0 : _b.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                : [];
            return {
                id: activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`],
                title: activity[`${PREFIX}titulo`] || '',
                name: activity[`${PREFIX}nome`] || '',
                nameObj: {
                    value: activity[`${PREFIX}nome`],
                    [`${PREFIX}tipo`]: activity[`${PREFIX}tipo`],
                },
                startTime: st,
                duration: d,
                endTime: et,
                date: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]).format('DD/MM/YYYY'),
                startTimeString: st.format('HH:mm'),
                durationString: d.format('HH:mm'),
                endTimeString: et.format('HH:mm'),
                spacesString: sp.map((sp) => sp.label).join(' '),
                scheduleId: activity === null || activity === void 0 ? void 0 : activity[`_${PREFIX}cronogramadia_value`],
                startDate: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorainicio`]),
                endDate: moment(activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}datahorafim`]),
                quantity: activity[`${PREFIX}quantidadesessao`] || 0,
                typeApplication: activity[`${PREFIX}tipoaplicacao`],
                type: activity[`${PREFIX}tipo`],
                typeLabel: TYPE_ACTIVITY_LABEL === null || TYPE_ACTIVITY_LABEL === void 0 ? void 0 : TYPE_ACTIVITY_LABEL[activity[`${PREFIX}tipo`]],
                theme: activity[`${PREFIX}temaaula`] || '',
                description: activity[`${PREFIX}descricaoobjetivo`] || '',
                observation: activity[`${PREFIX}observacao`] || '',
                documents: (_c = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Atividade_Documento`]) === null || _c === void 0 ? void 0 : _c.map((document) => {
                    var _a;
                    return ({
                        keyId: v4(),
                        id: document === null || document === void 0 ? void 0 : document[`${PREFIX}documentosatividadeid`],
                        name: document === null || document === void 0 ? void 0 : document[`${PREFIX}nome`],
                        link: document === null || document === void 0 ? void 0 : document[`${PREFIX}link`],
                        font: document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`],
                        fonte: (_a = document === null || document === void 0 ? void 0 : document[`${PREFIX}fonte`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(),
                        delivery: document === null || document === void 0 ? void 0 : document[`${PREFIX}entrega`],
                    });
                }),
                temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_d = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Temperatura`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]]) || null,
                lastTemperature: (_e = activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}Temperatura`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}etiquetaid`],
                academicRequests: (_f = requestsAcademic === null || requestsAcademic === void 0 ? void 0 : requestsAcademic.filter((e) => (e === null || e === void 0 ? void 0 : e[`_${PREFIX}requisicaoacademica_atividade_value`]) ===
                    (activity === null || activity === void 0 ? void 0 : activity[`${PREFIX}atividadeid`]))) === null || _f === void 0 ? void 0 : _f.map((request) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    const peopleRequest = (_a = activity[`${PREFIX}PessoasRequisica_Atividade`]) === null || _a === void 0 ? void 0 : _a.filter((pe) => (pe === null || pe === void 0 ? void 0 : pe[`_${PREFIX}requisicao_pessoasenvolvidas_value`]) ===
                        (request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`]));
                    return {
                        keyId: v4(),
                        equipments: ((_b = request[`${PREFIX}Equipamentos`]) === null || _b === void 0 ? void 0 : _b.length)
                            ? (_c = request[`${PREFIX}Equipamentos`]) === null || _c === void 0 ? void 0 : _c.map((e) => dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]])
                            : [],
                        finiteResource: (_e = (_d = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _d === void 0 ? void 0 : _d.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO)) === null || _e === void 0 ? void 0 : _e.map((e) => (Object.assign(Object.assign({}, e), { label: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`], value: e === null || e === void 0 ? void 0 : e[`${PREFIX}recursofinitoinfinitoid`] }))),
                        infiniteResource: (_g = (_f = request[`${PREFIX}RequisicaoAcademica_Recurso`]) === null || _f === void 0 ? void 0 : _f.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO)) === null || _g === void 0 ? void 0 : _g.map((e) => (Object.assign(Object.assign({}, e), { label: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`], value: e === null || e === void 0 ? void 0 : e[`${PREFIX}recursofinitoinfinitoid`] }))),
                        id: request === null || request === void 0 ? void 0 : request[`${PREFIX}requisicaoacademicaid`],
                        description: request === null || request === void 0 ? void 0 : request[`${PREFIX}descricao`],
                        deadline: request === null || request === void 0 ? void 0 : request[`${PREFIX}prazominimo`],
                        other: request === null || request === void 0 ? void 0 : request[`${PREFIX}outro`],
                        delivery: request === null || request === void 0 ? void 0 : request[`${PREFIX}momentoentrega`],
                        link: request === null || request === void 0 ? void 0 : request[`${PREFIX}link`],
                        nomemoodle: request === null || request === void 0 ? void 0 : request[`${PREFIX}nomemoodle`],
                        deliveryDate: (request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                            ? moment(request === null || request === void 0 ? void 0 : request[`${PREFIX}dataentrega`])
                            : null,
                        people: (peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.length)
                            ? peopleRequest === null || peopleRequest === void 0 ? void 0 : peopleRequest.map((e) => {
                                var _a;
                                let func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                                func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) ===
                                    EFatherTag.NECESSITA_APROVACAO);
                                return {
                                    keyId: v4(),
                                    id: e[`${PREFIX}pessoasenvolvidasrequisicaoacademicaid`],
                                    person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                                    function: func,
                                };
                            })
                            : [
                                {
                                    keyId: v4(),
                                    person: null,
                                    function: null,
                                },
                            ],
                    };
                }),
                area: activity[`${PREFIX}AreaAcademica`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}AreaAcademica`]), { value: (_g = activity[`${PREFIX}AreaAcademica`]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}etiquetaid`], label: (_h = activity[`${PREFIX}AreaAcademica`]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`] }) : null,
                course: activity[`${PREFIX}Curso`]
                    ? Object.assign(Object.assign({}, activity[`${PREFIX}Curso`]), { value: (_j = activity[`${PREFIX}Curso`]) === null || _j === void 0 ? void 0 : _j[`${PREFIX}etiquetaid`], label: (_k = activity[`${PREFIX}Curso`]) === null || _k === void 0 ? void 0 : _k[`${PREFIX}nome`] }) : null,
                spaces: sp,
                pastSpaces: ((_l = activity[`${PREFIX}Atividade_Espaco`]) === null || _l === void 0 ? void 0 : _l.length)
                    ? (_m = activity[`${PREFIX}Atividade_Espaco`]) === null || _m === void 0 ? void 0 : _m.map((e) => dictSpace[e === null || e === void 0 ? void 0 : e[`${PREFIX}espacoid`]])
                    : [],
                names: ((_o = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _o === void 0 ? void 0 : _o.length)
                    ? (_p = activity[`${PREFIX}Atividade_NomeAtividade`]) === null || _p === void 0 ? void 0 : _p.map((e) => ({
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
                    ],
                people: ((_q = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _q === void 0 ? void 0 : _q.length)
                    ? (_r = activity[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _r === void 0 ? void 0 : _r.map((e) => {
                        var _a;
                        const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                        func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                        return {
                            keyId: v4(),
                            id: e[`${PREFIX}pessoasenvolvidasatividadeid`],
                            person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
                            function: func,
                        };
                    })
                    : [
                        {
                            keyId: v4(),
                            person: null,
                            function: null,
                        },
                    ],
            };
        });
        const te = {
            id: teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`${PREFIX}turmaid`],
            title: teamSaved[`${PREFIX}titulo`] || '',
            baseadoemmodeloturma: teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved.baseadoemmodeloturma,
            modeloid: teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved.modeloid,
            sigla: teamSaved[`${PREFIX}sigla`] || '',
            name: teamSaved[`${PREFIX}nome`] || '',
            model: teamSaved[`${PREFIX}modelo`],
            teamCode: teamSaved[`${PREFIX}codigodaturma`] || '',
            teamName: teamSaved[`${PREFIX}nomefinanceiro`] || '',
            mask: teamSaved[`${PREFIX}mascara`] || '',
            maskBackup: teamSaved[`${PREFIX}mascarabackup`] || '',
            yearConclusion: teamSaved[`${PREFIX}anodeconclusao`] || '',
            description: teamSaved[`${PREFIX}observacao`] || '',
            concurrentActivity: teamSaved[`${PREFIX}atividadeconcorrente`],
            modality: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_c = teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`${PREFIX}Modalidade`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}etiquetaid`]]) || null,
            temperature: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[(_d = teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`${PREFIX}Temperatura`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}etiquetaid`]]) || null,
            videoConferenceBackup: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`_${PREFIX}ferramentavideoconferenciabackup_value`]]) || null,
            videoConference: (dictTag === null || dictTag === void 0 ? void 0 : dictTag[teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`_${PREFIX}ferramentavideoconferencia_value`]]) ||
                null,
            anexos: [],
            names: ((_e = teamSaved[`${PREFIX}Turma_NomeTurma`]) === null || _e === void 0 ? void 0 : _e.length)
                ? (_f = teamSaved[`${PREFIX}Turma_NomeTurma`]) === null || _f === void 0 ? void 0 : _f.map((e) => ({
                    keyId: v4(),
                    id: e[`${PREFIX}nometurmaid`],
                    name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                    nameEn: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomeen`],
                    nameEs: e === null || e === void 0 ? void 0 : e[`${PREFIX}nomees`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                }))
                : [
                    {
                        name: '',
                        nameEn: '',
                        nameEs: '',
                        use: '',
                    },
                ],
            participants: ((_g = teamSaved[`${PREFIX}Turma_ParticipantesTurma`]) === null || _g === void 0 ? void 0 : _g.length)
                ? (_h = teamSaved[`${PREFIX}Turma_ParticipantesTurma`]) === null || _h === void 0 ? void 0 : _h.map((e) => ({
                    keyId: v4(),
                    id: e[`${PREFIX}participantesturmaid`],
                    date: (e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]) && moment(e === null || e === void 0 ? void 0 : e[`${PREFIX}data`]),
                    quantity: e === null || e === void 0 ? void 0 : e[`${PREFIX}quantidade`],
                    use: dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}uso_value`]],
                }))
                : [
                    {
                        date: null,
                        quantity: '',
                        use: '',
                    },
                ],
            people: ((_j = teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _j === void 0 ? void 0 : _j.length)
                ? (_k = teamSaved === null || teamSaved === void 0 ? void 0 : teamSaved[`${PREFIX}Turma_PessoasEnvolvidasTurma`]) === null || _k === void 0 ? void 0 : _k.map((e) => {
                    var _a;
                    const func = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]] || {};
                    func.needApprove = (_a = func === null || func === void 0 ? void 0 : func[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NECESSITA_APROVACAO);
                    return Object.assign(Object.assign({}, e), { keyId: v4(), id: e[`${PREFIX}pessoasenvolvidasturmaid`], person: dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]], function: func });
                })
                : [],
        };
        const schelsByPeople = _.cloneDeep([]);
        schls.forEach((sc, i) => {
            sc.people.forEach((pe, j) => {
                schelsByPeople.push(Object.assign(Object.assign({}, sc), { parentIndex: i, idx: j, blocked: j !== 0, peopleRender: pe }));
            });
        });
        setTeam([te]);
        reset({ team: [te], schedules: schelsByPeople, activities: actvs });
    };
    return {
        buildInitDate,
        temperatureOptions,
        modalityOptions,
        modalityDayOptions,
        moduleOptions,
        areaOptions,
        courseOptions,
        functionOptions,
        useOptions,
        useParticipantsOptions,
        equipmentsOptions,
        finiteResources,
        infiniteResources,
    };
};
export default useBatchEdition;
//# sourceMappingURL=useBatchEdition.js.map