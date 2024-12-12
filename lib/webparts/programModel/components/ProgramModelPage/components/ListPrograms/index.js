import * as React from 'react';
import * as _ from 'lodash';
import { Box, Button, CircularProgress, Divider, IconButton, Menu, MenuItem, Tooltip, Typography, } from '@material-ui/core';
import { Add, ArrowDownward, ArrowUpward, FilterList, MoreVert, Public, } from '@material-ui/icons';
import { StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from './styles';
import AddProgram from '~/components/AddProgram';
import { AddButton } from '../../styles';
import { useConfirmation, useNotification, useProgram } from '~/hooks';
import { PREFIX, PROGRAM, TAG } from '~/config/database';
import { useDispatch, useSelector } from 'react-redux';
import { ShareModel } from '~/components';
import BatchMultidata from '~/utils/BatchMultidata';
import api from '~/services/api';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { deleteProgram } from '~/store/modules/program/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag, EGroups, ETypeTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';
const ListPrograms = ({ context, currentUser, programChoosed, handleProgram, setProgramChoosed, }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [openAddProgram, setOpenAddProgram] = React.useState(false);
    const [openShareModel, setOpenShareModel] = React.useState(false);
    const [loadingShareModel, setLoadingShareModel] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const [filter, setFilter] = React.useState({
        active: 'Ativo',
        searchQuery: '',
        model: true,
    });
    const [sort, setSort] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('');
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const [{ programs, loading, refetch }] = useProgram(filter, context);
    const programList = React.useMemo(() => programs === null || programs === void 0 ? void 0 : programs.map((m) => {
        var _a;
        return (Object.assign(Object.assign({}, m), { sigla: (_a = m === null || m === void 0 ? void 0 : m[`${PREFIX}sigla`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase() }));
    }), [programs]);
    const { tag, person } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const typeProgramOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_PROGRAMA);
    }), [tags]);
    const nameProgramOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.NOME_PROGRAMA);
    }), [tags]);
    const instituteOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.INSTITUTO);
    }), [tags]);
    const companyOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EMPRESA);
    }), [tags]);
    const responsabileOptions = React.useMemo(() => persons === null || persons === void 0 ? void 0 : persons.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tag) => (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) == ETypeTag.PROPRIETARIO);
    }), [persons]);
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
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
            sigla: {
                label: 'Sigla',
                type: 'text',
            },
            [`${PREFIX}NomePrograma`]: {
                label: 'Nome Programa',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: nameProgramOptions,
                        },
                    },
                },
            },
            [`${PREFIX}TipoPrograma`]: {
                label: 'Tipo Programa',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: typeProgramOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Instituto`]: {
                label: 'Instituto',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: instituteOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Empresa`]: {
                label: 'Empresa',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: companyOptions,
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
            [`${PREFIX}Programa_PessoasEnvolvidas`]: {
                label: 'Responsável pelo Programa',
                type: '!group',
                subfields: {
                    [`_${PREFIX}pessoa_value`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: responsabileOptions,
                        },
                    },
                },
            },
            [`${PREFIX}publicado`]: {
                label: 'Publicado',
                type: 'boolean',
            },
        } })), [responsabileOptions, companyOptions, instituteOptions, typeProgramOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        handleSort(sortBy, false);
    }, [programList]);
    const handleClose = () => {
        setOpenAddProgram(false);
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
        setOpenAddProgram(true);
        handleCloseAnchor();
    };
    const handleShareClick = () => {
        var _a;
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) ||
            ((_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((cUser) => {
                var _a;
                return (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Programa_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.some((comp) => (comp === null || comp === void 0 ? void 0 : comp[`${PREFIX}etiquetaid`]) === (cUser === null || cUser === void 0 ? void 0 : cUser[`${PREFIX}etiquetaid`]));
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
    const handleDeleteProgram = () => {
        var _a;
        handleCloseAnchor();
        confirmation.openConfirmation({
            title: 'Confirmação da ação',
            description: `Tem certeza que deseja excluir o Programa ${(_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]}?`,
            onConfirm: () => {
                dispatch(deleteProgram(itemSelected[`${PREFIX}programaid`], {
                    onSuccess: () => {
                        refetch();
                        setItemSelected(null);
                        setProgramChoosed(null);
                    },
                    onError: () => setItemSelected(null),
                }));
            },
        });
    };
    const handleShareModel = (items) => {
        var _a;
        setLoadingShareModel(true);
        const batch = new BatchMultidata(api);
        const itemsToDelete = (_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Programa_Compartilhamento`]) === null || _a === void 0 ? void 0 : _a.filter((e) => !(items === null || items === void 0 ? void 0 : items.some((sp) => sp.value === (e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]))));
        batch.bulkPostReferenceRelatioship(PROGRAM, TAG, itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}programaid`], 'Programa_Compartilhamento', items === null || items === void 0 ? void 0 : items.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]));
        batch.bulkDeleteReferenceParent(PROGRAM, itemsToDelete === null || itemsToDelete === void 0 ? void 0 : itemsToDelete.map((it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}etiquetaid`]), itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}programaid`], 'Programa_Compartilhamento');
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
    const clearFilter = () => {
        setQuery(Object.assign(Object.assign({}, query), { tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config) }));
    };
    const applyFilter = () => {
        const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;
        if (logic) {
            const filteredData = programList.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(programList);
        }
        setFilterDrawer(false);
    };
    const handleSort = (field = sortBy, changeDirection = true) => {
        let direction = sort;
        if (changeDirection) {
            direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
        }
        const newList = programList === null || programList === void 0 ? void 0 : programList.sort((a, b) => {
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
        React.createElement(AddProgram, { isModel: true, context: context, program: itemSelected, open: openAddProgram, setProgram: setItemSelected, handleClose: handleClose, refetchProgram: refetch }),
        React.createElement(ShareModel, { open: openShareModel, loading: loadingShareModel, currentValue: itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Programa_Compartilhamento`], handleShare: handleShareModel, onClose: () => setOpenShareModel(false) }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Title, null, "Modelos"),
                React.createElement(Tooltip, { arrow: true, title: 'Novo Programa' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setOpenAddProgram(true) },
                        React.createElement(Add, null)))),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `${PREFIX}NomePrograma.${PREFIX}nome` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort(`${PREFIX}NomePrograma.${PREFIX}nome`) }, "Nome"),
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `createdon` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort('createdon') }, "Data")),
                React.createElement(Box, { display: 'flex' },
                    loading ? React.createElement(CircularProgress, { size: 20, color: 'primary' }) : null,
                    React.createElement(IconButton, { onClick: () => setFilterDrawer(true) },
                        React.createElement(FilterList, null)))),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: handleCloseAnchor },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: handleShareClick }, "Compartilhar"),
                React.createElement(MenuItem, { onClick: handleDeleteProgram }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.length) ? (React.createElement(React.Fragment, null, listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.map((program) => {
                var _a, _b;
                return (React.createElement(StyledCard, { key: program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`], active: (programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`]) ===
                        (program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`]), elevation: 3 },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, program) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: (program === null || program === void 0 ? void 0 : program[`${PREFIX}titulo`]) || 'Sem informações' },
                            React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                                (program === null || program === void 0 ? void 0 : program[`${PREFIX}publicado`]) ? (React.createElement(Public, { fontSize: 'small' })) : null,
                                React.createElement(TitleCard, { onClick: () => handleProgram(program) }, program === null || program === void 0 ? void 0 : program[`${PREFIX}titulo`]))) }),
                    React.createElement(StyledContentCard, { onClick: () => handleProgram(program) },
                        React.createElement(Divider, null),
                        React.createElement(Typography, { variant: 'body1' }, (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]),
                        React.createElement(Typography, { variant: 'body2' }, (_b = program === null || program === void 0 ? void 0 : program[`${PREFIX}Empresa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]))));
            }))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum programa cadastrado"))))));
};
export default ListPrograms;
//# sourceMappingURL=index.js.map