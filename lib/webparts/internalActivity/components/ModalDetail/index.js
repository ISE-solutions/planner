import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { EUso } from '~/config/enums';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
const ModalDetail = ({ open, item, onClose }) => {
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { dictPeople } = person;
    const dataDetail = () => {
        var _a, _b, _c, _d, _e;
        const people = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_PessoasEnvolvidas`]) === null || _a === void 0 ? void 0 : _a.map((e) => {
            var _a, _b;
            return ({
                person: (_a = dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                function: (_b = dictTag[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`],
            });
        });
        const names = (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_NomeAtividade`]) === null || _b === void 0 ? void 0 : _b.map((name) => (Object.assign(Object.assign({}, name), { use: EUso[name === null || name === void 0 ? void 0 : name[`${PREFIX}uso`]] })));
        return {
            items: [
                {
                    title: 'Dados da Atividade Interna',
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
                            value: (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}tipodesativacao`]) === null || _c === void 0 ? void 0 : _c.toLocaleUpperCase(),
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
                            title: 'Tema',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}temaaula`],
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
                            title: 'Espaços',
                            value: (_e = (_d = item === null || item === void 0 ? void 0 : item[`${PREFIX}Atividade_Espaco`]) === null || _d === void 0 ? void 0 : _d.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _e === void 0 ? void 0 : _e.join(', '),
                        },
                        {
                            title: 'Tema',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}temaaula`],
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