import * as React from 'react';
import * as _ from 'lodash';
import { AddButton, StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from './styles';
import { Box, Button, CircularProgress, Divider, IconButton, Menu, MenuItem, Tooltip, Typography, } from '@material-ui/core';
import { ACTIVITY, PREFIX, TAG } from '~/config/database';
import { Add, ArrowDownward, ArrowUpward, FilterList, MoreVert, Public, } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import AddActivity from './AddActivity';
import { ShareModel } from '~/components';
import { useConfirmation, useNotification } from '~/hooks';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { deleteActivity, getActivityPermitions, updateActivity, } from '~/store/modules/activity/actions';
import { EFatherTag, EGroups } from '~/config/enums';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';
const ListModels = ({ loading, currentUser, models, refetch, modelChoosed, setSearch, handleSaveActivity, handleActivity, }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [openShareModel, setOpenShareModel] = React.useState(false);
    const [loadingShareModel, setLoadingShareModel] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [tagsShared, setTagsShared] = React.useState([]);
    const [listFiltered, setListFiltered] = React.useState([]);
    const [sort, setSort] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('');
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const { tag, person } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const areaOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
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
                label: 'Nome da Atividade',
                type: 'text',
            },
            subject: {
                label: 'Tema',
                type: 'text',
            },
            [`${PREFIX}quantidadesessao`]: {
                label: 'Quantidade de Sessões',
                type: 'number',
            },
            [`${PREFIX}AreaAcademica`]: {
                label: 'Área Acadêmica',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: areaOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Atividade_Documento`]: {
                label: 'Documentos',
                type: '!group',
                subfields: {
                    [`${PREFIX}nome`]: {
                        label: 'Nome',
                        type: 'text',
                    },
                },
            },
            [`${PREFIX}RequisicaoAcademica_Atividade`]: {
                label: 'Requisição Acadêmica',
                type: '!group',
                subfields: {
                    [`${PREFIX}descricao`]: {
                        label: 'Descrição',
                        type: 'text',
                    },
                },
            },
            [`${PREFIX}publicado`]: {
                label: 'Publicado',
                type: 'boolean',
            },
        } })), [areaOptions, persons]);
    const activitiesList = React.useMemo(() => models === null || models === void 0 ? void 0 : models.map((m) => {
        var _a, _b, _c;
        return (Object.assign(Object.assign({}, m), { title: (_a = m === null || m === void 0 ? void 0 : m[`${PREFIX}titulo`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), name: (_b = m === null || m === void 0 ? void 0 : m[`${PREFIX}nome`]) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase(), subject: (_c = m === null || m === void 0 ? void 0 : m[`${PREFIX}temaaula`]) === null || _c === void 0 ? void 0 : _c.toLocaleUpperCase() }));
    }), [models]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        handleSort(sortBy, false);
    }, [activitiesList]);
    const handleClose = () => {
        setVisible(false);
        refetch === null || refetch === void 0 ? void 0 : refetch();
    };
    const handleOption = (event, item) => {
        if (itemSelected) {
            updateActivity(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}atividadeid`], {
                [`${PREFIX}Editanto@odata.bind`]: null,
                [`${PREFIX}datahoraeditanto`]: null,
            }, {
                onSuccess: () => { },
                onError: () => null,
            });
        }
        setItemSelected(item);
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAnchor = () => {
        setAnchorEl(null);
    };
    const handleShareClick = () => {
        getActivityPermitions(itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}atividadeid`]).then(({ value }) => {
            var _a;
            const actv = value[0];
            setTagsShared(actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Compartilhamento`]);
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
                ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((cUser) => {
                    var _a;
                    return (_a = actv === null || actv === void 0 ? void 0 : actv[`${PREFIX}Atividade_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
                })) ||
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                    (actv === null || actv === void 0 ? void 0 : actv[`_${PREFIX}criadopor_value`])) {
                setOpenShareModel(true);
            }
            else {
                notification.error({
                    title: 'Ação Inválida',
                    description: 'Você não possui permissão para compartilhar esse modelo',
                });
            }
        });
        handleCloseAnchor();
    };
    const handleShareModel = (items) => {
        var _a;
        setLoadingShareModel(true);
        const batch = new BatchMultidata(api);
        const itemsToDelete = (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Atividade_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(items === null || items === void 0 ? void 0 : items.some((sp) => sp.value === (e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]))));
        batch.bulkPostReferenceRelatioship(ACTIVITY, TAG, itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}atividadeid`], 'Atividade_Compartilhamento', items === null || items === void 0 ? void 0 : items.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]));
        batch.bulkDeleteReferenceParent(ACTIVITY, itemsToDelete === null || itemsToDelete === void 0 ? void 0 : itemsToDelete.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]), itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}atividadeid`], 'Atividade_Compartilhamento');
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
    const handleDeleteActivity = () => {
        handleCloseAnchor();
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir a Atividade ${itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}nome`]}?`,
            onConfirm: () => {
                dispatch(deleteActivity({ id: itemSelected[`${PREFIX}atividadeid`] }, {
                    onSuccess: () => {
                        refetch();
                        setItemSelected(null);
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
            const filteredData = activitiesList.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(activitiesList);
        }
        setFilterDrawer(false);
    };
    const handleSort = (field = sortBy, changeDirection = true) => {
        let direction = sort;
        if (changeDirection) {
            direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
        }
        const newList = activitiesList === null || activitiesList === void 0 ? void 0 : activitiesList.sort((a, b) => {
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
        React.createElement(AddActivity, { open: visible, handleClose: handleClose, handleSaveActivity: handleSaveActivity }),
        React.createElement(FilterDrawer, { queryQB: query, configQB: config, setQuery: setQuery, clearFilter: clearFilter, applyFilter: applyFilter, onClose: () => setFilterDrawer(false), open: filterDrawer }),
        React.createElement(ShareModel, { open: openShareModel, loading: loadingShareModel, currentValue: tagsShared, handleShare: handleShareModel, onClose: () => setOpenShareModel(false) }),
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
                React.createElement(MenuItem, { onClick: handleShareClick }, "Compartilhar"),
                React.createElement(MenuItem, { onClick: handleDeleteActivity }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.length) ? (React.createElement(React.Fragment, null, listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.map((item) => {
                var _a;
                return (React.createElement(StyledCard, { key: item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`], active: (modelChoosed === null || modelChoosed === void 0 ? void 0 : modelChoosed[`${PREFIX}atividadeid`]) ===
                        (item === null || item === void 0 ? void 0 : item[`${PREFIX}atividadeid`]), elevation: 3 },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, item) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: (item === null || item === void 0 ? void 0 : item[`${PREFIX}titulo`]) || 'Sem informações' },
                            React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                (item === null || item === void 0 ? void 0 : item[`${PREFIX}publicado`]) ? (React.createElement(Public, { fontSize: 'small' })) : null,
                                React.createElement(TitleCard, { onClick: () => handleActivity(item) }, item === null || item === void 0 ? void 0 : item[`${PREFIX}titulo`]))) }),
                    React.createElement(StyledContentCard, { onClick: () => handleActivity(item) },
                        React.createElement(Divider, null),
                        React.createElement(Typography, { variant: 'body1' }, item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`]),
                        React.createElement(Typography, { variant: 'body2' }, (_a = item === null || item === void 0 ? void 0 : item[`${PREFIX}CriadoPor`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`]))));
            }))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum modelo cadastrado"))))));
};
export default ListModels;
//# sourceMappingURL=index.js.map