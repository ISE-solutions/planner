import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import * as React from 'react';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { PREFIX } from '~/config/database';
import { EDeliveryType } from '~/config/enums';
import formatUrl from '~/utils/formatUrl';
import { IconClose } from './styles';
const RequestDetail = ({ open, item, handleClose, }) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const dataDetail = {
        items: [
            {
                title: 'Informações',
                coluna1: [
                    {
                        title: 'Momento Entrega',
                        value: EDeliveryType[item === null || item === void 0 ? void 0 : item.delivery],
                    },
                    {
                        title: 'Data de Entrega',
                        value: (item === null || item === void 0 ? void 0 : item.deliveryDate) &&
                            ((_a = item === null || item === void 0 ? void 0 : item.deliveryDate) === null || _a === void 0 ? void 0 : _a.format('DD/MM/YYYY HH:mm')),
                    },
                ],
                coluna2: [
                    {
                        title: 'Prazo Entrega',
                        value: item === null || item === void 0 ? void 0 : item.deadline,
                    },
                    {
                        title: 'Link',
                        value: (React.createElement("a", { href: formatUrl(item === null || item === void 0 ? void 0 : item.link), target: '_blank' }, "Acesse")),
                    },
                    {
                        title: 'Nome (Moodle)',
                        value: item === null || item === void 0 ? void 0 : item.nomemoodle,
                    },
                ],
                linha: [
                    {
                        title: 'Descrição',
                        value: item === null || item === void 0 ? void 0 : item.description,
                    },
                    {
                        title: 'Observação',
                        value: item === null || item === void 0 ? void 0 : item.observation,
                    },
                    {
                        title: 'Equipamentos',
                        value: (_c = (_b = item === null || item === void 0 ? void 0 : item.equipments) === null || _b === void 0 ? void 0 : _b.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _c === void 0 ? void 0 : _c.join(', '),
                    },
                    {
                        title: 'Recursos Finitos',
                        value: (_e = (_d = item === null || item === void 0 ? void 0 : item.finiteResource) === null || _d === void 0 ? void 0 : _d.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _e === void 0 ? void 0 : _e.join(', '),
                    },
                    {
                        title: 'Recursos Infinitos',
                        value: (_g = (_f = item === null || item === void 0 ? void 0 : item.infiniteResource) === null || _f === void 0 ? void 0 : _f.map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`])) === null || _g === void 0 ? void 0 : _g.join(', '),
                    },
                    {
                        title: 'Outro',
                        value: item === null || item === void 0 ? void 0 : item.other,
                    },
                ],
            },
            {
                title: 'Pessoas Envolvidas',
                table: {
                    columns: [
                        {
                            title: 'Pessoa',
                            key: `person.${PREFIX}nome`,
                        },
                        {
                            title: 'Função',
                            key: `function.${PREFIX}nome`,
                        },
                    ],
                    rows: (item === null || item === void 0 ? void 0 : item.people) || [],
                },
            },
        ],
    };
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Requisi\u00E7\u00E3o Acad\u00EAmica",
            React.createElement(IconClose, { onClick: handleClose },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(DetalhesSolicitacao, { solicitacao: dataDetail }))));
};
export default RequestDetail;
//# sourceMappingURL=Detail.js.map