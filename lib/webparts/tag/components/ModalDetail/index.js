import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { EUso } from '~/config/enums';
import { Close } from '@material-ui/icons';
const ModalDetail = ({ open, item, onClose }) => {
    const dataDetail = () => {
        var _a, _b;
        const names = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Etiqueta_NomeEtiqueta`]) === null || _a === void 0 ? void 0 : _a.map((name) => (Object.assign(Object.assign({}, name), { use: EUso[name === null || name === void 0 ? void 0 : name[`${PREFIX}uso`]] })));
        return {
            items: [
                {
                    title: 'Dados da Etiqueta',
                    coluna1: [
                        {
                            title: 'Nome',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
                        },
                        {
                            title: 'Ordem',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}ordem`],
                        },
                        {
                            title: 'Tipo Desativação',
                            value: (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}tipodesativacao`]) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase(),
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
                            title: 'Descrição',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}descricao`],
                        },
                    ],
                },
                {
                    title: 'Nomes',
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