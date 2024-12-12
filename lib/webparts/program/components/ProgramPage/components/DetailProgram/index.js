var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import * as _ from 'lodash';
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, IconButton, Menu, MenuItem, TextField, Tooltip, Typography, } from '@material-ui/core';
import { StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from '~/components/CustomCard';
import { EFatherTag } from '~/config/enums';
import { Add, ArrowDownward, ArrowUpward, FilterList, MoreVert, Search, } from '@material-ui/icons';
import AddTeam from '~/components/AddTeam';
import { AddButton } from '../../styles';
import { PREFIX } from '~/config/database';
import { useConfirmation, useLoggedUser, useNotification } from '~/hooks';
import { TeamName } from './styles';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTeam, getTeamById } from '~/store/modules/team/actions';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { DeliveryDrawer } from '../DeliveryDrawer/index';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { createModel } from '~/store/modules/model/actions';
import { useDebounce } from 'use-debounce';
import { deleteByTeam } from '~/store/modules/resource/actions';
import FilterDrawer from '~/components/FilterDrawer';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
const DetailProgram = ({ programChoosed, programTemperature, setTeamChoosed, refetchSchedule, refetchResource, isProgramResponsible, isProgramDirector, isFinance, teamChoosed, context, refetch, }) => {
    var _a, _b, _c, _d;
    const [openDeliveryDrawer, setOpenDeliveryDrawer] = React.useState(false);
    const [openAddTeam, setOpenAddTeam] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [sort, setSort] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('');
    const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
    const [modelName, setModelName] = React.useState({
        open: false,
        loadSpaces: true,
        loadPerson: true,
        loadDate: true,
        name: '',
        error: '',
    });
    const [listFiltered, setListFiltered] = React.useState([]);
    const [valueSearch] = useDebounce(search, 300);
    const queryParameters = new URLSearchParams(window.location.search);
    const teamIdParam = queryParameters.get('teamid');
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { currentUser } = useLoggedUser();
    const dispatch = useDispatch();
    const { tag, team } = useSelector((state) => state);
    const { tags } = tag;
    const { loading, teams } = team;
    const teamList = React.useMemo(() => teams === null || teams === void 0 ? void 0 : teams.map((m) => {
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
        } })), [temperatureOptions, modalityOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        setListFiltered(teamList);
    }, [teamList]);
    React.useEffect(() => {
        setListFiltered(teamList === null || teamList === void 0 ? void 0 : teamList.filter((program) => {
            var _a, _b;
            return ((_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}nome`]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(valueSearch.toLowerCase())) ||
                ((_b = program === null || program === void 0 ? void 0 : program[`${PREFIX}sigla`]) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(valueSearch.toLowerCase()));
        }));
    }, [valueSearch]);
    React.useEffect(() => {
        if (teamIdParam && programChoosed) {
            getTeamById(teamIdParam).then(({ value }) => {
                setTeamChoosed(value[0]);
            });
        }
    }, [teamIdParam]);
    const handleClose = () => {
        setOpenAddTeam(false);
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
        setOpenAddTeam(true);
        handleCloseAnchor();
    };
    const handleBatchEdition = () => {
        handleCloseAnchor();
        global.window.open(`${context.pageContext.web.absoluteUrl}/SitePages/Edição%20em%20Massa.aspx?teamid=${itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}turmaid`]}`);
    };
    const handleDelivery = () => {
        setOpenDeliveryDrawer(true);
        handleCloseAnchor();
    };
    const handleCloseDelivery = () => {
        setItemSelected(null);
        setOpenDeliveryDrawer(false);
    };
    const saveAsModel = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!modelName.name) {
            setModelName(Object.assign(Object.assign({}, modelName), { error: 'Campo Obrigatório' }));
            return;
        }
        setIsLoadingSaveModel(true);
        setModelName(Object.assign(Object.assign({}, modelName), { open: false, error: '' }));
        dispatch(createModel({
            Tipo: TYPE_REQUEST_MODEL.CRIACAO,
            Origem: TYPE_ORIGIN_MODEL.TURMA,
            Nome: modelName.name,
            ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
            ManterDatas: modelName.loadDate ? 'Sim' : 'Não',
            IDOrigem: itemSelected[`${PREFIX}turmaid`],
            IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
        }, {
            onSuccess: () => {
                handleCloseAnchor();
                setIsLoadingSaveModel(false);
                confirmation.openConfirmation({
                    title: 'Criação de modelo',
                    yesLabel: 'Fechar',
                    showCancel: false,
                    description: 'Olá, a sua solicitação para criação de um modelo foi iniciada. A mesma poderá demorar alguns minutos. Assim que a criação for concluída você será notificado!',
                    onConfirm: () => null,
                });
            },
            onError: (error) => {
                var _a, _b;
                setIsLoadingSaveModel(false);
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    });
    const handleToSaveModel = () => {
        setModelName(Object.assign(Object.assign({}, modelName), { open: true, name: '', error: '' }));
    };
    const handleCloseSaveModel = () => {
        setModelName(Object.assign(Object.assign({}, modelName), { open: false, name: '', error: '' }));
    };
    const updateAll = () => {
        refetch();
        refetchSchedule();
        refetchResource();
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
                    },
                    onError: () => setItemSelected(null),
                }));
                dispatch(deleteByTeam(itemSelected[`${PREFIX}turmaid`]));
            },
        });
    };
    const clearFilter = () => {
        setQuery(Object.assign(Object.assign({}, query), { tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config) }));
    };
    const applyFilter = () => {
        const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;
        if (logic) {
            const filteredData = teamList.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(teamList);
        }
        setFilterDrawer(false);
    };
    const handleSort = (field = sortBy, changeDirection = true) => {
        let direction = sort;
        if (changeDirection) {
            direction = sortBy === field ? (sort === 'asc' ? 'desc' : 'asc') : 'asc';
        }
        const newList = teamList === null || teamList === void 0 ? void 0 : teamList.sort((a, b) => {
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
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(DeliveryDrawer, { key: 'DeliveryDrawer', onClose: handleCloseDelivery, open: openDeliveryDrawer, team: itemSelected }),
        React.createElement(FilterDrawer, { key: 'FilterDrawer', queryQB: query, configQB: config, setQuery: setQuery, clearFilter: clearFilter, applyFilter: applyFilter, onClose: () => setFilterDrawer(false), open: filterDrawer }),
        React.createElement(AddTeam, { key: 'AddTeam', teams: teams, context: context, isDraft: (((_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ||
                programTemperature) === EFatherTag.RASCUNHO, refetch: updateAll, open: openAddTeam, program: programChoosed, isProgramResponsible: isProgramResponsible, isProgramDirector: isProgramDirector, isFinance: isFinance, team: itemSelected, setTeam: (newTeam) => {
                setTeamChoosed(newTeam);
                setItemSelected(newTeam);
            }, teamLength: teams === null || teams === void 0 ? void 0 : teams.length, company: (_b = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Empresa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`], programId: programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`], handleClose: handleClose }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Tooltip, { arrow: true, title: (_c = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nome`] },
                    React.createElement(Title, null, (_d = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}NomePrograma`]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`])),
                React.createElement(Tooltip, { arrow: true, title: 'Nova Turma' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setOpenAddTeam(true) },
                        React.createElement(Add, null)))),
            React.createElement(Box, null,
                React.createElement(TextField, { fullWidth: true, onChange: handleSearch, placeholder: 'Pesquisar', InputProps: {
                        endAdornment: React.createElement(Search, null),
                    } })),
            React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `${PREFIX}nome` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort(`${PREFIX}nome`) }, "Nome"),
                    React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `createdon` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort('createdon') }, "Data")),
                loading ? React.createElement(CircularProgress, { size: 20, color: 'primary' }) : null,
                React.createElement(IconButton, { onClick: () => setFilterDrawer(true) },
                    React.createElement(FilterList, null))),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: () => {
                    handleCloseAnchor();
                    setItemSelected(null);
                } },
                React.createElement(MenuItem, { onClick: handleDelivery }, "Entregas"),
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: handleBatchEdition }, "Edi\u00E7\u00E3o em massa"),
                React.createElement(MenuItem, { onClick: () => !isLoadingSaveModel && handleToSaveModel() },
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                        isLoadingSaveModel ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null,
                        "Salvar como modelo")),
                React.createElement(MenuItem, { onClick: handleDeleteTeam }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 17rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.length) ? (React.createElement(React.Fragment, null, listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.map((team) => {
                var _a;
                const temperature = temperatureColor(team, (_a = programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]);
                return (React.createElement(StyledCard, { elevation: 3, background: temperature.background, color: temperature.color, active: (team === null || team === void 0 ? void 0 : team[`${PREFIX}turmaid`]) ===
                        (teamChoosed === null || teamChoosed === void 0 ? void 0 : teamChoosed[`${PREFIX}turmaid`]) },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, team) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: team === null || team === void 0 ? void 0 : team[`${PREFIX}sigla`] },
                            React.createElement(TitleCard, { onClick: () => setTeamChoosed(team) }, team === null || team === void 0 ? void 0 : team[`${PREFIX}sigla`])) }),
                    React.createElement(StyledContentCard, { onClick: () => setTeamChoosed(team) },
                        React.createElement(Divider, null),
                        React.createElement(Tooltip, { arrow: true, title: team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`] },
                            React.createElement(TeamName, { variant: 'body1' }, team === null || team === void 0 ? void 0 : team[`${PREFIX}nome`])))));
            }))) : (React.createElement(Typography, { variant: 'body1', color: 'textSecondary', style: { fontWeight: 'bold' } }, "Nenhuma turma cadastrada")))),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: modelName.open, onClose: handleCloseSaveModel },
            React.createElement(DialogTitle, null, "Salvar como modelo"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, fullWidth: true, error: !!modelName.error, helperText: modelName.error, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { name: event.target.value })), margin: 'dense', label: 'Nome', placeholder: 'Informe o nome do modelo', type: 'text' }),
                React.createElement(FormControl, { style: { marginTop: '1rem' }, component: 'fieldset' },
                    React.createElement(FormLabel, { component: 'legend' }, "Deseja preservar os recursos?"),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: modelName.loadSpaces, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { loadSpaces: event.target.checked })), name: 'loadSpaces', color: 'primary' }), label: 'Espa\u00E7os' }),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: modelName.loadPerson, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { loadPerson: event.target.checked })), name: 'loadPerson', color: 'primary' }), label: 'Pessoas' }),
                    React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: modelName.loadDate, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { loadDate: event.target.checked })), name: 'loadDate', color: 'primary' }), label: 'Manter datas' }))),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleCloseSaveModel }, "Cancelar"),
                React.createElement(Button, { onClick: saveAsModel, variant: 'contained', color: 'primary' }, "Salvar")))));
};
export default DetailProgram;
//# sourceMappingURL=index.js.map