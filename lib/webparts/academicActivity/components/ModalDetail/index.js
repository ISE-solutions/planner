import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { EDeliveryType, EFatherTag, TYPE_RESOURCE } from '~/config/enums';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
const ModalDetail = ({ open, item, onClose }) => {
    const { tag, person } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { dictPeople } = person;
    const dictFunction = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO);
        })) === null || _a === void 0 ? void 0 : _a.reduce((acc, func) => {
            acc[func === null || func === void 0 ? void 0 : func[`${PREFIX}etiquetaid`]] = func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`];
            return acc;
        }, {});
    }, [tags]);
    const dataDetail = () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const people = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.map((e) => {
            var _a, _b;
            return ({
                person: (_a = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                function: (_b = dictFunction[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`],
            });
        });
        const documents = (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Documento`]) === null || _b === void 0 ? void 0 : _b.map((e) => {
            var _a;
            return ({
                name: e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`],
                link: e === null || e === void 0 ? void 0 : e[`${PREFIX}link`],
                fonte: (_a = e === null || e === void 0 ? void 0 : e[`${PREFIX}fonte`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(),
                entrega: EDeliveryType[e === null || e === void 0 ? void 0 : e[`${PREFIX}entrega`]],
            });
        });
        const names = (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_NomeAtividade`]) === null || _c === void 0 ? void 0 : _c.map((name) => {
            var _a;
            return (Object.assign(Object.assign({}, name), { use: (_a = dictTag === null || dictTag === void 0 ? void 0 : dictTag[name === null || name === void 0 ? void 0 : name[`_${PREFIX}uso_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`] }));
        });
        return {
            items: [
                {
                    title: 'Dados da Atividade Acadêmica',
                    coluna1: [
                        {
                            title: 'Nome',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
                        },
                        {
                            title: 'Início',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}inicio`],
                        },
                        {
                            title: 'Duração',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}duracao`],
                        },
                        {
                            title: 'Fim',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}fim`],
                        },
                        {
                            title: 'Tipo Desativação',
                            value: (_d = item === null || item === void 0 ? void 0 : item[`${PREFIX}tipodesativacao`]) === null || _d === void 0 ? void 0 : _d.toLocaleUpperCase(),
                            hide: item === null || item === void 0 ? void 0 : item[`${PREFIX}ativo`],
                        },
                        {
                            title: 'Início Desativação',
                            value: (item === null || item === void 0 ? void 0 : item[`${PREFIX}iniciodesativacao`]) &&
                                moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}iniciodesativacao`]).format('DD/MM/YYYY HH:mm:ss'),
                            hide: (item === null || item === void 0 ? void 0 : item[`${PREFIX}ativo`]) ||
                                (item === null || item === void 0 ? void 0 : item[`${PREFIX}tipodesativacao`]) === 'definitivo',
                        },
                        {
                            title: 'Fim Desativação',
                            value: (item === null || item === void 0 ? void 0 : item[`${PREFIX}fimdesativacao`]) &&
                                moment(item === null || item === void 0 ? void 0 : item[`${PREFIX}fimdesativacao`]).format('DD/MM/YYYY HH:mm:ss'),
                            hide: (item === null || item === void 0 ? void 0 : item[`${PREFIX}ativo`]) ||
                                (item === null || item === void 0 ? void 0 : item[`${PREFIX}tipodesativacao`]) === 'definitivo',
                        },
                    ],
                    coluna2: [
                        {
                            title: 'Quantidade de sessões',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}quantidadesessao`],
                        },
                        {
                            title: 'Ativo',
                            value: (item === null || item === void 0 ? void 0 : item[`${PREFIX}ativo`]) ? 'Sim' : 'Não',
                        },
                        {
                            title: 'Criado em',
                            value: moment(item === null || item === void 0 ? void 0 : item.createdon).format('DD/MM/YYYY HH:mm:ss'),
                        },
                    ],
                    linha: [
                        {
                            title: 'Área Acadêmica',
                            value: (_e = item === null || item === void 0 ? void 0 : item[`${PREFIX}AreaAcademica`]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nome`],
                        },
                        {
                            title: 'Espaços',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`].map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]).join(', '),
                        },
                        {
                            title: 'Equipamentos/Outros',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Equipamentos`].map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]).join(', '),
                        },
                        {
                            title: 'Recurso Finito',
                            value: (_f = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _f === void 0 ? void 0 : _f.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.FINITO).map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]).join(', '),
                        },
                        {
                            title: 'Recurso Infinito',
                            value: (_g = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_RecursoFinitoInfinito`]) === null || _g === void 0 ? void 0 : _g.filter((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}tiporecurso`]) === TYPE_RESOURCE.INFINITO).map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]).join(', '),
                        },
                        {
                            title: 'Tema',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}temaaula`],
                        },
                        {
                            title: 'Descrição/Objetivo',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}descricaoobjetivo`],
                        },
                    ],
                },
                {
                    title: 'Nome Fantasia',
                    table: {
                        columns: [
                            {
                                title: 'Nome (PT)',
                                key: `${PREFIX}nome`,
                            },
                            {
                                title: 'Nome (EN)',
                                key: `${PREFIX}nomeen`,
                            },
                            {
                                title: 'Nome (ES)',
                                key: `${PREFIX}nomees`,
                            },
                            {
                                title: 'Uso',
                                key: 'use',
                            },
                        ],
                        rows: names,
                    },
                },
                {
                    title: 'Pessoas Envolvidas',
                    table: {
                        columns: [
                            {
                                title: 'Pessoa',
                                key: `person`,
                            },
                            {
                                title: 'Função',
                                key: 'function',
                            },
                        ],
                        rows: people,
                    },
                },
                {
                    title: 'Documentos',
                    table: {
                        columns: [
                            {
                                title: 'Nome',
                                key: `name`,
                            },
                            {
                                title: 'Fonte',
                                key: 'fonte',
                            },
                            {
                                title: 'Entrega',
                                key: 'entrega',
                            },
                            {
                                title: 'Link',
                                key: 'link',
                            },
                        ],
                        rows: documents,
                    },
                },
                {
                    title: 'Observação',
                    coluna1: [],
                    coluna2: [],
                    custom: () => {
                        return (React.createElement("div", { style: { wordBreak: 'break-all' }, dangerouslySetInnerHTML: {
                                __html: item === null || item === void 0 ? void 0 : item[`${PREFIX}observacao`],
                            } }));
                    },
                },
            ],
        };
    };
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'lg', onClose: onClose },
        React.createElement(DialogTitle, null,
            React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(DetalhesSolicitacao, { solicitacao: dataDetail() })),
        React.createElement(DialogActions, null)));
};
export default ModalDetail;
//# sourceMappingURL=index.js.map