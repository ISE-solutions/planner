import * as _ from 'lodash';
import * as React from 'react';
import { CircularProgress, Grid, Paper, Table as TableMaterial, TableBody, TableCell, TableHead, TableRow, } from '@material-ui/core';
import fileSize from '../../utils/fileSize';
import ItemValue from './ItemValue';
import { SaveAltRounded } from '@material-ui/icons';
import downloadFile from '../../utils/downloadFile';
const DetalhesSolicitacao = ({ children, solicitacao, hideHistory, print, }) => {
    const { items, anexos, assinatura } = solicitacao;
    const downloadAnexo = (item, index) => {
        downloadFile(item.relativeLink, item.nome);
    };
    return (React.createElement(Paper, { elevation: 0 },
        (items || []).map((item, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            return (!item.hide && (React.createElement("div", { key: index, style: { marginTop: '1em' } },
                React.createElement("span", { style: {
                        color: '#2A2A2A',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        padding: '1rem',
                        textTransform: 'uppercase',
                    } }, item.title),
                React.createElement(Grid, { style: {
                        border: '1px solid #0063a5',
                        padding: '1em',
                        marginTop: '.8rem',
                    }, container: true, justify: 'space-between' },
                    Array.isArray(item === null || item === void 0 ? void 0 : item.coluna1) ? (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: print ? 6 : 12, sm: print ? 6 : 12, md: 6, lg: 6 }, (_a = item === null || item === void 0 ? void 0 : item.coluna1) === null || _a === void 0 ? void 0 : _a.map((col, indexCol) => {
                            return (!col.hide && (React.createElement(ItemValue, { key: indexCol, title: col === null || col === void 0 ? void 0 : col.title, value: col === null || col === void 0 ? void 0 : col.value })));
                        })),
                        React.createElement(Grid, { item: true, xs: print ? 6 : 12, sm: print ? 6 : 12, md: 6, lg: 6 }, (_b = item === null || item === void 0 ? void 0 : item.coluna2) === null || _b === void 0 ? void 0 : _b.map((col, indexCol) => {
                            return (!col.hide && (React.createElement(ItemValue, { key: indexCol, title: col === null || col === void 0 ? void 0 : col.title, value: col === null || col === void 0 ? void 0 : col.value })));
                        })),
                        React.createElement(Grid, { item: true, xs: 12, sm: 12, md: 12, lg: 12, style: { marginTop: '6px' } }, ((item === null || item === void 0 ? void 0 : item.linha) || []).map((col, indexCol) => {
                            return (!col.hide && (React.createElement(ItemValue, { line: true, style: { marginTop: '1em' }, key: indexCol, column: true, title: col === null || col === void 0 ? void 0 : col.title, value: col === null || col === void 0 ? void 0 : col.value })));
                        })))) : ((_c = item === null || item === void 0 ? void 0 : item.coluna1) === null || _c === void 0 ? void 0 : _c.items) ? (React.createElement(React.Fragment, null,
                        React.createElement(Grid, { item: true, xs: print ? 6 : 12, sm: print ? 6 : 12, md: 6, lg: 6 },
                            React.createElement(Grid, { item: true, style: {
                                    color: '#A2A2A2',
                                    fontWeight: 'bold',
                                } }, (item === null || item === void 0 ? void 0 : item.coluna1) && ((_d = item === null || item === void 0 ? void 0 : item.coluna1) === null || _d === void 0 ? void 0 : _d.title)), (_e = item === null || item === void 0 ? void 0 : item.coluna1) === null || _e === void 0 ? void 0 :
                            _e.items.map((col, indexCol) => {
                                return (!col.hide && (React.createElement(ItemValue, { key: indexCol, value: col === null || col === void 0 ? void 0 : col.value })));
                            })),
                        React.createElement(Grid, { item: true, xs: print ? 6 : 12, sm: print ? 6 : 12, md: 6, lg: 6 },
                            React.createElement(Grid, { item: true, style: {
                                    color: '#A2A2A2',
                                    fontWeight: 'bold',
                                } }, item.coluna2 && item.coluna2.title),
                            (item === null || item === void 0 ? void 0 : item.coluna2) &&
                                ((_f = item === null || item === void 0 ? void 0 : item.coluna2) === null || _f === void 0 ? void 0 : _f.items.map((col, indexCol) => {
                                    return (!col.hide && (React.createElement(ItemValue, { key: indexCol, value: col === null || col === void 0 ? void 0 : col.value })));
                                }))))) : (React.createElement(Grid, { item: true, style: {
                            wordWrap: 'break-word',
                            color: '#A2A2A2',
                            textAlign: 'justify',
                            display: 'block',
                            width: '100%',
                            marginTop: '1em',
                        } }, (_g = item === null || item === void 0 ? void 0 : item.coluna1) === null || _g === void 0 ? void 0 : _g.value)),
                    (item === null || item === void 0 ? void 0 : item.custom) ? (React.createElement(React.Fragment, null, print && item.hidePrint ? null : item.custom())) : null,
                    (item === null || item === void 0 ? void 0 : item.cards) ? (React.createElement(Grid, { container: true, spacing: 2, justify: 'space-between' }, item.cards.map((card) => (React.createElement(Grid, { item: true, style: {
                            width: '15em',
                            marginBottom: '2em',
                            border: `${card.color} solid 1px`,
                            padding: '1em',
                            color: card.fontColor || '#A2A2A2',
                            background: card.background,
                            boxShadow: '3px 10px 25px -16px rgba(0,0,0,0.75)',
                        } },
                        React.createElement("span", { style: {
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                            } }, card.value),
                        React.createElement("p", null, card.label)))))) : null,
                    item.table ? (React.createElement(Grid, { item: true, style: {
                            color: '#A2A2A2',
                            display: 'block',
                            width: '100%',
                            overflow: 'auto',
                        } },
                        React.createElement(React.Fragment, null,
                            React.createElement(TableMaterial, { size: item.table.size || 'small' },
                                React.createElement(TableHead, null,
                                    React.createElement(TableRow, null, (_h = item === null || item === void 0 ? void 0 : item.table) === null || _h === void 0 ? void 0 : _h.columns.map((e) => (React.createElement(TableCell, { key: e.key, style: item.table.border && {
                                            border: '1px solid #6D6D6D',
                                        } }, e.title))))),
                                React.createElement(TableBody, null, (_k = (_j = item === null || item === void 0 ? void 0 : item.table) === null || _j === void 0 ? void 0 : _j.rows) === null || _k === void 0 ? void 0 : _k.map((row) => (React.createElement(TableRow, { key: index }, item.table.columns.map(({ key, type }) => (React.createElement(TableCell, { style: item.table.border && {
                                        border: '1px solid #6D6D6D',
                                    } }, _.get(row, key))))))))),
                            item.table.footer ? (React.createElement("div", { style: {
                                    justifyContent: item.table.footer.align || 'center',
                                    padding: '1em',
                                    display: 'flex',
                                } }, item.table.footer.value)) : null))) : null))));
        }),
        React.createElement(Grid, { container: true }, children),
        assinatura && print ? (React.createElement("div", { style: { marginTop: '1em' } },
            React.createElement("span", { style: {
                    color: '#0063a5',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                } }, assinatura && assinatura.title),
            React.createElement(Grid, { style: { border: '1px solid #0063a5', padding: '1em', margin: 0 }, container: true, justify: 'space-between' }, assinatura.items.map((e) => (React.createElement(Grid, { item: true, style: {
                    width: `${100 / assinatura.items.length}%`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    paddingBottom: 0,
                    marginTop: '2em',
                    paddingRight: '1em',
                } },
                React.createElement("div", { style: { borderBottom: '2px solid #0063a5', width: '100%' } }),
                React.createElement("span", { style: { color: '#A2A2A2', fontWeight: 'bold' } }, e.title))))))) : null,
        !print && anexos && (anexos === null || anexos === void 0 ? void 0 : anexos.length) ? (React.createElement("div", { style: { marginTop: '1em', textAlign: 'center' } },
            React.createElement("span", { style: {
                    color: '#0063a5',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                } }, "Anexos"),
            React.createElement(TableMaterial, { size: 'small' },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, "Nome"),
                        React.createElement(TableCell, null, "Tamanho"),
                        React.createElement(TableCell, null, "A\u00E7\u00F5es"))),
                React.createElement(TableBody, null, anexos.map((item, index) => (React.createElement(TableRow, { style: item.deveExcluir && { backgroundColor: '#e0e0e0' }, key: index },
                    React.createElement(TableCell, { style: item.deveExcluir && { color: '#6C6C6C' } }, item.nome),
                    React.createElement(TableCell, { style: item.deveExcluir && { color: '#6C6C6C' } }, fileSize(item.tamanho)),
                    React.createElement(TableCell, null,
                        React.createElement(Grid, { container: true, spacing: 1, style: { flexWrap: 'nowrap' }, justify: 'flex-start' }, item.relativeLink && (React.createElement(Grid, { item: true }, item.loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#0063a5' } })) : (React.createElement(SaveAltRounded, { onClick: () => downloadAnexo(item, index), style: { color: '#0063a5', cursor: 'pointer' } }))))))))))))) : null));
};
export default DetalhesSolicitacao;
//# sourceMappingURL=index.js.map