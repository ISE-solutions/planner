import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, } from '@material-ui/core';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import DetalhesSolicitacao from '~/components/DetalhesSolicitacao';
import { getFiles } from '~/utils/sharepoint';
import { sp } from '@pnp/sp';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
const ModalDetail = ({ open, item, onClose }) => {
    const [anexos, setAnexos] = React.useState([]);
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    React.useEffect(() => {
        if (item) {
            getFiles(sp, `Anexos Interno/Espaco/${moment(item === null || item === void 0 ? void 0 : item.createdon).format('YYYY')}/${item === null || item === void 0 ? void 0 : item[`${PREFIX}espacoid`]}`).then((files) => {
                setAnexos(files);
            });
        }
    }, [item]);
    const dictPeople = React.useMemo(() => {
        var _a;
        return (_a = person === null || person === void 0 ? void 0 : person.persons) === null || _a === void 0 ? void 0 : _a.reduce((acc, person) => {
            acc[person === null || person === void 0 ? void 0 : person[`${PREFIX}pessoaid`]] = person === null || person === void 0 ? void 0 : person[`${PREFIX}nome`];
            return acc;
        }, {});
    }, [person]);
    const dictFunction = React.useMemo(() => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag.tags) === null || _a === void 0 ? void 0 : _a.reduce((acc, func) => {
            acc[func === null || func === void 0 ? void 0 : func[`${PREFIX}etiquetaid`]] = func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`];
            return acc;
        }, {});
    }, [tag]);
    const dataDetail = () => {
        var _a, _b, _c, _d;
        const names = (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}Espaco_NomeEspaco`]) === null || _a === void 0 ? void 0 : _a.map((name) => {
            var _a;
            return (Object.assign(Object.assign({}, name), { use: (_a = dictTag === null || dictTag === void 0 ? void 0 : dictTag[name === null || name === void 0 ? void 0 : name[`_${PREFIX}uso_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`] }));
        });
        const capacities = (_b = item === null || item === void 0 ? void 0 : item[`${PREFIX}Espaco_CapacidadeEspaco`]) === null || _b === void 0 ? void 0 : _b.map((name) => {
            var _a;
            return (Object.assign(Object.assign({}, name), { use: (_a = dictTag === null || dictTag === void 0 ? void 0 : dictTag[name === null || name === void 0 ? void 0 : name[`_${PREFIX}uso_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`] }));
        });
        const people = (_c = item === null || item === void 0 ? void 0 : item[`${PREFIX}Espaco_PessoasEnvolvidas`]) === null || _c === void 0 ? void 0 : _c.map((e) => ({
            person: dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[e === null || e === void 0 ? void 0 : e[`_${PREFIX}pessoa_value`]],
            function: dictFunction === null || dictFunction === void 0 ? void 0 : dictFunction[e === null || e === void 0 ? void 0 : e[`_${PREFIX}funcao_value`]],
        }));
        return {
            anexos: anexos,
            items: [
                {
                    title: 'Dados do Espaço',
                    coluna1: [
                        {
                            title: 'Nome',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
                        },
                        {
                            title: 'E-mail',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}email`],
                        },
                        {
                            title: 'Ativo',
                            value: (item === null || item === void 0 ? void 0 : item[`${PREFIX}ativo`]) ? 'Sim' : 'Não',
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
                            title: 'Criado em',
                            value: moment(item === null || item === void 0 ? void 0 : item.createdon).format('DD/MM/YYYY HH:mm:ss'),
                        },
                    ],
                    linha: [
                        {
                            title: 'Etiquetas',
                            value: item === null || item === void 0 ? void 0 : item[`${PREFIX}Espaco_Etiqueta_Etiqueta`].map((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]).join(', '),
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
                    title: 'Capacidade',
                    table: {
                        columns: [
                            {
                                title: 'Quantidade',
                                key: `${PREFIX}quantidade`,
                            },
                            {
                                title: 'Uso',
                                key: 'use',
                            },
                        ],
                        rows: capacities,
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