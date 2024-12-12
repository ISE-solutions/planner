import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { Close } from '@material-ui/icons';
const ModalDetail = ({ open, item, onClose }) => {
    const dataDetail = () => {
        var _a, _b, _c, _d, _e, _f;
        return {
            items: [
                {
                    title: 'Dados da Pessoa',
                    coluna1: [
                        {
                            title: 'Nome',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
                        },
                        {
                            title: 'Sobrenome',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}sobrenome`],
                        },
                        {
                            title: 'Nome Preferido',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}nomepreferido`],
                        },
                        {
                            title: 'Título',
                            value: (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Titulo`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`],
                        },
                        {
                            title: 'E-mail',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}email`],
                        },
                        {
                            title: 'Chefe de Departamento',
                            value: (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _b === void 0 ? void 0 : _b.map((are) => are === null || are === void 0 ? void 0 : are[`${PREFIX}nome`]).join(', '),
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
                            title: 'E-mail Secundário',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}emailsecundario`],
                        },
                        {
                            title: 'Celular',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}celular`],
                        },
                        {
                            title: 'Escola de Origem',
                            value: (_d = item === null || item === void 0 ? void 0 : item[`${PREFIX}EscolaOrigem`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`],
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
                            title: 'Etiqueta(s)',
                            value: (_f = (_e = item === null || item === void 0 ? void 0 : item[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _e === void 0 ? void 0 : _e.map((e) => e[`${PREFIX}nome`])) === null || _f === void 0 ? void 0 : _f.join(', '),
                        },
                    ],
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