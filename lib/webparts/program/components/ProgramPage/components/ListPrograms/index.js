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
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Add, ArrowDownward, ArrowUpward, FilterList, MoreVert, Search, } from '@material-ui/icons';
import AddProgram from '~/components/AddProgram';
import { useDebounce } from 'use-debounce';
import { AddButton } from '../../styles';
import { useConfirmation, useNotification } from '~/hooks';
import { StyledCard, StyledContentCard, StyledHeaderCard, StyledIconButton, Title, TitleCard, } from '~/components/CustomCard';
import { EFatherTag, ETypeTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import temperatureColor from '~/utils/temperatureColor';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProgram, fetchAllPrograms, } from '~/store/modules/program/actions';
import { TYPE_PROGRAM_FILTER } from '~/store/modules/program/utils';
import { ToggleButtonGroup } from '@material-ui/lab';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { StyledToggleButton } from './styles';
import { createModel } from '~/store/modules/model/actions';
import { TYPE_ORIGIN_MODEL, TYPE_REQUEST_MODEL } from '~/config/constants';
import { deleteByProgram } from '~/store/modules/resource/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import FilterDrawer from '~/components/FilterDrawer';
const ListPrograms = ({ context, refetch, filter, setFilter, currentUser, programChoosed, handleProgram, }) => {
    var _a;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [itemSelected, setItemSelected] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const [sort, setSort] = React.useState('asc');
    const [sortBy, setSortBy] = React.useState('');
    const [valueSearch] = useDebounce(search, 300);
    const [filterDrawer, setFilterDrawer] = React.useState(false);
    const [modelName, setModelName] = React.useState({
        open: false,
        loadSpaces: true,
        loadPerson: true,
        name: '',
        error: '',
    });
    const [openAddProgram, setOpenAddProgram] = React.useState(false);
    const [isLoadingSaveModel, setIsLoadingSaveModel] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    const { tag, person, program } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    const { dictPeople, personsActive } = person;
    const { programs, loading } = program;
    const programList = React.useMemo(() => programs === null || programs === void 0 ? void 0 : programs.map((m) => {
        var _a;
        return (Object.assign(Object.assign({}, m), { sigla: (_a = m === null || m === void 0 ? void 0 : m[`${PREFIX}sigla`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase() }));
    }), [programs]);
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
    const responsabileOptions = React.useMemo(() => personsActive === null || personsActive === void 0 ? void 0 : personsActive.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tag) => (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}nome`]) == ETypeTag.PROPRIETARIO);
    }), [personsActive]);
    const temperatureOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS);
    }), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
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
        } })), [responsabileOptions, companyOptions, instituteOptions, typeProgramOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        handleSort(sortBy, false);
    }, [programList]);
    React.useEffect(() => {
        setListFiltered(programList === null || programList === void 0 ? void 0 : programList.filter((program) => {
            var _a, _b, _c;
            return ((_b = (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(valueSearch.toLowerCase())) ||
                ((_c = program === null || program === void 0 ? void 0 : program[`${PREFIX}sigla`]) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(valueSearch.toLowerCase()));
        }));
    }, [valueSearch]);
    React.useEffect(() => {
        refetch();
    }, []);
    const handleClose = () => {
        setOpenAddProgram(false);
        setItemSelected(null);
        dispatch(fetchAllPrograms(filter));
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
    const saveAsModel = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!modelName.name) {
            setModelName(Object.assign(Object.assign({}, modelName), { error: 'Campo Obrigatório' }));
            return;
        }
        setIsLoadingSaveModel(true);
        setModelName(Object.assign(Object.assign({}, modelName), { open: false, error: '' }));
        dispatch(createModel({
            Tipo: TYPE_REQUEST_MODEL.CRIACAO,
            Origem: TYPE_ORIGIN_MODEL.PROGRAMA,
            Nome: modelName.name,
            ManterEspacos: modelName.loadSpaces ? 'Sim' : 'Não',
            ManterPessoas: modelName.loadPerson ? 'Sim' : 'Não',
            IDOrigem: itemSelected[`${PREFIX}programaid`],
            IDPessoa: currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`],
        }, {
            onSuccess: () => {
                handleCloseAnchor();
                setIsLoadingSaveModel(false);
                setItemSelected(null);
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
                    },
                    onError: () => setItemSelected(null),
                }));
                dispatch(deleteByProgram(itemSelected[`${PREFIX}programaid`]));
            },
        });
    };
    const handleToggle = (event, nextType) => {
        const newFilter = Object.assign(Object.assign({}, filter), { type: nextType });
        setFilter(newFilter);
        refetch(newFilter);
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
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };
    const isProgramResponsible = React.useMemo(() => {
        if (dictPeople && dictTag) {
            return itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Programa_PessoasEnvolvidas`].some((envol) => {
                const func = dictTag === null || dictTag === void 0 ? void 0 : dictTag[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}funcao_value`]];
                const envolPerson = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[envol === null || envol === void 0 ? void 0 : envol[`_${PREFIX}pessoa_value`]];
                if ((func === null || func === void 0 ? void 0 : func[`${PREFIX}nome`]) === EFatherTag.RESPONSAVEL_PELO_PROGRAMA) {
                    return ((currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]) ===
                        (envolPerson === null || envolPerson === void 0 ? void 0 : envolPerson[`${PREFIX}pessoaid`]));
                }
                return false;
            });
        }
    }, [currentUser, itemSelected, dictPeople]);
    return (React.createElement(React.Fragment, null,
        React.createElement(FilterDrawer, { queryQB: query, configQB: config, setQuery: setQuery, clearFilter: clearFilter, applyFilter: applyFilter, onClose: () => setFilterDrawer(false), open: filterDrawer }),
        React.createElement(AddProgram, { context: context, isDraft: ((_a = itemSelected === null || itemSelected === void 0 ? void 0 : itemSelected[`${PREFIX}Temperatura`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                EFatherTag.RASCUNHO, isProgramResponsible: isProgramResponsible, program: itemSelected, open: openAddProgram, refetchProgram: refetch, setProgram: setItemSelected, handleClose: handleClose }),
        React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
            React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
                React.createElement(Title, null, "Programas"),
                React.createElement(Tooltip, { arrow: true, title: 'Novo Programa' },
                    React.createElement(AddButton, { variant: 'contained', color: 'primary', onClick: () => setOpenAddProgram(true) },
                        React.createElement(Add, null)))),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '10px' } },
                React.createElement(Box, null,
                    React.createElement(TextField, { fullWidth: true, onChange: handleSearch, placeholder: 'Pesquisar', InputProps: {
                            endAdornment: React.createElement(Search, null),
                        } })),
                React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                        React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `${PREFIX}NomePrograma.${PREFIX}nome` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort(`${PREFIX}NomePrograma.${PREFIX}nome`) }, "Nome"),
                        React.createElement(Button, { variant: 'outlined', size: 'small', endIcon: sortBy === `createdon` ? (sort === 'asc' ? (React.createElement(ArrowUpward, { fontSize: 'small' })) : (React.createElement(ArrowDownward, { fontSize: 'small' }))) : null, onClick: () => handleSort('createdon') }, "Data")),
                    React.createElement(Box, { display: 'flex' },
                        loading ? React.createElement(CircularProgress, { size: 20, color: 'primary' }) : null,
                        React.createElement(IconButton, { onClick: () => setFilterDrawer(true) },
                            React.createElement(FilterList, null)))),
                React.createElement(Box, null,
                    React.createElement(ToggleButtonGroup, { orientation: 'horizontal', exclusive: true, value: filter.type, onChange: handleToggle },
                        React.createElement(StyledToggleButton, { value: TYPE_PROGRAM_FILTER.PROGRAMA }, "Programa"),
                        React.createElement(StyledToggleButton, { value: TYPE_PROGRAM_FILTER.RESERVA }, "Evento Interno"))),
                React.createElement(Divider, null)),
            React.createElement(Menu, { anchorEl: anchorEl, keepMounted: true, open: Boolean(anchorEl), onClose: () => {
                    handleCloseAnchor();
                    setItemSelected(null);
                } },
                React.createElement(MenuItem, { onClick: handleDetail }, "Detalhar"),
                React.createElement(MenuItem, { onClick: () => !isLoadingSaveModel && handleToSaveModel() },
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                        isLoadingSaveModel ? (React.createElement(CircularProgress, { size: 20, color: 'primary' })) : null,
                        "Salvar como modelo")),
                React.createElement(MenuItem, { onClick: handleDeleteProgram }, "Excluir")),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', overflow: 'auto', maxHeight: 'calc(100vh - 20rem)', paddingBottom: '10px', margin: '0 -5px', style: { gap: '1rem' } }, (listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.length) ? (React.createElement(React.Fragment, null, listFiltered === null || listFiltered === void 0 ? void 0 : listFiltered.map((program) => {
                var _a, _b;
                const temperature = temperatureColor(program);
                return (React.createElement(StyledCard, { key: program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`], background: temperature.background, color: temperature.color, active: (programChoosed === null || programChoosed === void 0 ? void 0 : programChoosed[`${PREFIX}programaid`]) ===
                        (program === null || program === void 0 ? void 0 : program[`${PREFIX}programaid`]), elevation: 3 },
                    React.createElement(StyledHeaderCard, { action: React.createElement(Tooltip, { arrow: true, title: 'A\u00E7\u00F5es' },
                            React.createElement(StyledIconButton, { "aria-label": 'settings', onClick: (event) => handleOption(event, program) },
                                React.createElement(MoreVert, null))), title: React.createElement(Tooltip, { arrow: true, title: program === null || program === void 0 ? void 0 : program[`${PREFIX}sigla`] },
                            React.createElement(TitleCard, { onClick: () => handleProgram(program) }, program === null || program === void 0 ? void 0 : program[`${PREFIX}sigla`])) }),
                    React.createElement(StyledContentCard, { onClick: () => handleProgram(program) },
                        React.createElement(Divider, null),
                        React.createElement(Typography, { variant: 'body1' }, (_a = program === null || program === void 0 ? void 0 : program[`${PREFIX}NomePrograma`]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]),
                        React.createElement(Typography, { variant: 'body2' }, (_b = program === null || program === void 0 ? void 0 : program[`${PREFIX}Empresa`]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]))));
            }))) : (React.createElement(Typography, { variant: 'body1' }, "Nenhum programa cadastrado")))),
        React.createElement(Dialog, { fullWidth: true, maxWidth: 'sm', open: modelName.open, onClose: handleCloseSaveModel },
            React.createElement(DialogTitle, null, "Salvar como modelo"),
            React.createElement(DialogContent, null,
                React.createElement(TextField, { autoFocus: true, fullWidth: true, error: !!modelName.error, helperText: modelName.error, onChange: (event) => setModelName(Object.assign(Object.assign({}, modelName), { name: event.target.value })), margin: 'dense', label: 'Nome', placeholder: 'Informe o nome do modelo', type: 'text' })),
            React.createElement(DialogActions, null,
                React.createElement(Button, { color: 'primary', onClick: handleCloseSaveModel }, "Cancelar"),
                React.createElement(Button, { onClick: saveAsModel, variant: 'contained', color: 'primary' }, "Salvar")))));
};
export default ListPrograms;
//# sourceMappingURL=index.js.map