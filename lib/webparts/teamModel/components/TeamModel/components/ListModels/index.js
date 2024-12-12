import * as React from 'react';
import * as _ from 'lodash';
import { AddButton, StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from './styles';
import { Box, Button, CircularProgress, Divider, IconButton, Menu, MenuItem, Tooltip, Typography, } from '@material-ui/core';
import { PREFIX, TAG, TEAM } from '~/config/database';
import { Add, ArrowDownward, ArrowUpward, FilterList, MoreVert, Public, } from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { useDispatch, useSelector } from 'react-redux';
import { ShareModel } from '~/components';
import { useConfirmation, useNotification } from '~/hooks';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { deleteTeam } from '~/store/modules/team/actions';
import FilterDrawer from '~/components/FilterDrawer';
import { EFatherTag, EGroups } from '~/config/enums';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
const ListModels = ({ context, loading, currentUser, teams, refetch, refetchSchedule, teamChoosed, handleSchedule, setTeamChoosed, }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [openShareModel, setOpenShareModel] = React.useState(false);
    const [loadingShareModel, setLoadingShareModel] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const [sort, setSort] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('');
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const { tag, person } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const teamsList = React.useMemo(() => teams === null || teams === void 0 ? void 0 : teams.map((m) => {
        var _a, _b, _c;
        return (Object.assign(Object.assign({}, m), { title: (_a = m === null || m === void 0 ? void 0 : m[`${PREFIX}titulo`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), name: (_b = m === null || m === void 0 ? void 0 : m[`${PREFIX}nome`]) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase(), sigla: (_c = m === null || m === void 0 ? void 0 : m[`${PREFIX}sigla`]) === null || _c === void 0 ? void 0 : _c.toLocaleUpperCase() }));
    }), [teams]);
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
    }), [tags]);
    const modalityOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.MODALIDADE_TURMA);
    }), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            [`${PREFIX}grupopermissao`]: {
                label: 'Grupo Permissão',
                type: 'select',
                valueSources: ['value'],
                fieldSettings: {
                    showSearch: true,
                    listValues: [
                        {
                            value: EGroups.PLANEJAMENTO,
                            title: EGroups.PLANEJAMENTO,
                        },
                        {
                            value: EGroups.ADMISSOES,
                            title: EGroups.ADMISSOES,
                        },
                    ],
                },
            },
            [`_${PREFIX}criadopor_value`]: {
                label: 'Criado Por',
                type: 'select',
                valueSources: ['value'],
                fieldSettings: {
                    showSearch: true,
                    listValues: persons,
                },
            },
            title: {
                label: 'Título',
                type: 'text',
            },
            name: {
                label: 'Nome',
                type: 'text',
            },
            sigla: {
                label: 'Sigla',
                type: 'text',
            },
            [`${PREFIX}anodeconclusao`]: {
                label: 'Ano de Conclusão',
                type: 'number',
            },
            [`${PREFIX}Modalidade`]: {
                label: 'Modalidade',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: modalityOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Temperatura`]: {
                label: 'Temperatura',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: temperatureOptions,
                        },
                    },
                },
            },
            [`${PREFIX}publicado`]: {
                label: 'Publicado',
                type: 'boolean',
            },
        } })), [temperatureOptions, modalityOptions, persons]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        handleSort(sortBy, false);
    }, [teamsList]);
    const handleClose = () => {
        setVisible(false);
        setItemSelected(null);
        refetch();
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleOption = (event, item) => {
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
    };
    const handleDetail = () => {
        setVisible(true);
        handleCloseAnchor();
    };
    const updateAll = () => {
        refetchSchedule === null || refetchSchedule === void 0 ? void 0 : refetchSchedule();
        refetch === null || refetch === void 0 ? void 0 : refetch();
    };
    const handleShareClick = () => {
        var _a;
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((cUser) => {
                var _a;
                return (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Turma_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
            })) ||
            (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                (itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`_${PREFIX}criadopor_value`])) {
            setOpenShareModel(true);
        }
        else {
            notification.error({
                title: 'Ação Inválida',
                description: 'Você não possui permissão para compartilhar esse modelo',
            });
        }
        handleCloseAnchor();
    };
    const handleShareModel = (items) => {
        var _a;
        setLoadingShareModel(true);
        const batch = new BatchMultidata(api);
        const itemsToDelete = (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Turma_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(items === null || items === void 0 ? void 0 : items.some((sp) => sp.value === (e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]))));
        batch.bulkPostReferenceRelatioship(TEAM, TAG, itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}turmaid`], 'Turma_Compartilhamento', items === null || items === void 0 ? void 0 : items.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]));
        batch.bulkDeleteReferenceParent(TEAM, itemsToDelete === null || itemsToDelete === void 0 ? void 0 : itemsToDelete.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]), itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}turmaid`], 'Turma_Compartilhamento');
        batch
            .execute()
            .then(() => {
            refetch();
            setLoadingShareModel(false);
            setOpenShareModel(false);
            notification.success({
                title: 'Sucesso',
                description: 'Compartilhamento realizado com sucesso!',
            });
        })
            .catch((err) => {
            setLoadingShareModel(false);
            notification.error({
                title: 'Falha',
                description: 'Ocorreu um erro, Tente novamente mais tarde',
            });
        });
    };
    const handleDeleteTeam = () => {
        handleCloseAnchor();
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir a Turma ${(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}nome`]) || (itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}titulo`])}?`,
            onConfirm: () => {
                dispatch(deleteTeam(itemSelected[`${PREFIX}turmaid`], {
                    onSuccess: () => {
                        refetch();
                        setItemSelected(null);
                        setTeamChoosed(null);
                    },
                    onError: () => setItemSelected(null),
                }));
            },
        });
    };
    const clearFilter = () => {
        setQuery(Object.assign(Object.assign({}, query), { tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config) }));
    };
    const applyFilter = () => {
        const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;
        if (logic) {
            const filteredData = teamsList.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(teamsList);
        }
        setFilterDrawer(false);
    };
    const handleSort = (field = sortBy, changeDirection = true) => {
        let direction = sort;
        if (changeDirection) {
            direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
        }
        const newList = teamsList === null || teamsList === void 0 ? void 0 : teamsList.sort((a, b) => {
            let valueA = field === 'createdon' ? new Date(_.get(a, field)) : _.get(a, field);
            let valueB = field === 'createdon' ? new Date(_.get(b, field)) : _.get(b, field);
            if (direction === 'asc') {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            }
            else if (direction === 'desc') {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
            else {
                return 0;
            }
        });
        setListFiltered(newList);
        setSort(direction);
        setSortBy(field);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(FilterDrawer, { queryQB: query, configQB: config, setQuery: setQuery, clearFilter: clearFilter, applyFilter: applyFilter, onClose: () => setFilterDrawer(false), open: filterDrawer }),
        React.createElement(AddTeam, { isModel: true, refetch: updateAll, context: context, open: visible, team: itemSelected, setTeam: (it) => setItemSelected(it), teamLength: teams === null || teams === void 0 ? void 0 : teams.length, handleClose: handleClose }),
        React.createElement(ShareModel, { open: openShareModel, loading: loadingShareModel, currentValue: itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Turma_Compartilhamento`], handleShare: handleShareModel, onClose: () => setOpenShareModel(false) }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Title, null, "Modelos"),
                React.createElement(Tooltip, { arrow: true, title: 'Novo Modelo' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setVisible(true) },
                        React.createElement(Add, null)))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `${PREFIX}titulo` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort(`${PREFIX}titulo`) }, "Nome"),
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `createdon` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort('createdon') }, "Data")),
                React.createElement(Box, { display: 'flex' },
                    loading ? React.createElement(CircularProgress, { size: 20, color: 'primary' }) : null,
                    React.createElement(IconButton, { onClick: () => setFilterDrawer(true) },
                        React.createElement(FilterList, null)))),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: handleShareClick }, "Compartilhar"),
                React.createElement(MenuItem, { onClick: handleDeleteTeam }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.length) ? (React.createElement(React.Fragment, null, listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.map((item) => (React.createElement(StyledCard, { key: item === null || item === void 0 ? void 0 : item[`${PREFIX}turmaid`], active: (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]) ===
                    (item === null || item === void 0 ? void 0 : item[`${PREFIX}turmaid`]), elevation: 3 },
                React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                        React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, item) },
                            React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: (item === null || item === void 0 ? void 0 : item[`${PREFIX}titulo`]) || 'Sem informações' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            (item === null || item === void 0 ? void 0 : item[`${PREFIX}publicado`]) ? (React.createElement(Public, { fontSize: 'small' })) : null,
                            React.createElement(TitleCard, { onClick: () => handleSchedule(item) }, item === null || item === void 0 ? void 0 : item[`${PREFIX}titulo`]))) }),
                React.createElement(StyledContentCard, { onClick: () => handleSchedule(item) },
                    React.createElement(Divider, null),
                    React.createElement(Typography, { variant: 'body1' }, item === null || item === void 0 ? void 0 : item[`${PREFIX}sigla`]))))))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum modelo cadastrado"))))));
};
export default ListModels;
//# sourceMappingURL=index.js.map