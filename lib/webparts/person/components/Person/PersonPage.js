import * as React from 'react';
import Page from '~/components/Page';
import Table from '~/components/Table';
import CreateHeader from '~/components/CreateHeader';
import ModalDetail from './../ModalDetail';
import ModalBulkEdit from './../ModalBulkEdit';
import ModalDesactive from './../ModalDesactive';
import { Button, Grid, IconButton, Tooltip } from '@material-ui/core';
import { Add, Edit, Info, Delete, Visibility, VisibilityOff, FilterList, } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification, useConfirmation, useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import { AddPerson, DontHasPermition } from '~/components';
import { Utils as QbUtils } from '@react-awesome-query-builder/ui';
import jsonLogic from 'json-logic-js';
import { activePerson, deletePerson, fetchAllPerson, } from '~/store/modules/person/actions';
import { FILTER_CONFIG_DEFAULT } from '~/webparts/constants';
import { EFatherTag } from '~/config/enums';
import FilterDrawer from '~/components/FilterDrawer';
const PersonPage = ({ context }) => {
    const [form, setForm] = React.useState({ open: false });
    const [detail, setDetail] = React.useState({ open: false });
    const [bulkEdit, setBulkEdit] = React.useState({ open: false });
    const [desactive, setDesactive] = React.useState({ open: false });
    const [openFilter, setOpenFilter] = React.useState(false);
    const [listFiltered, setListFiltered] = React.useState([]);
    const dispatch = useDispatch();
    const { persons } = useSelector((state) => state.person);
    const refTable = React.useRef();
    const { currentUser, tags } = useLoggedUser();
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const schoolOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.ESCOLA_ORIGEM);
    }), [tags]);
    const functionOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const titleOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TITULO);
    }), [tags]);
    const areaOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return (_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.AREA_ACADEMICA);
    }), [tags]);
    const config = React.useMemo(() => (Object.assign(Object.assign({}, FILTER_CONFIG_DEFAULT), { fields: {
            fullname: {
                label: 'Nome',
                type: 'text',
            },
            email: {
                label: 'E-mail',
                type: 'text',
            },
            [`${PREFIX}Titulo`]: {
                label: 'Título',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: titleOptions,
                        },
                    },
                },
            },
            [`${PREFIX}EscolaOrigem`]: {
                label: 'Escola de Origem',
                type: '!struct',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: schoolOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Pessoa_Etiqueta_Etiqueta`]: {
                label: 'Etiqueta (s)',
                type: '!group',
                subfields: {
                    [`${PREFIX}etiquetaid`]: {
                        label: 'Nome',
                        type: 'select',
                        valueSources: ['value'],
                        fieldSettings: {
                            showSearch: true,
                            listValues: functionOptions,
                        },
                    },
                },
            },
            [`${PREFIX}Pessoa_AreaResponsavel`]: {
                label: 'Chefe de Departamento',
                type: '!group',
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
            [`${PREFIX}ativo`]: {
                label: 'Ativo',
                type: 'boolean',
            },
        } })), [areaOptions, schoolOptions, titleOptions, functionOptions]);
    const [query, setQuery] = React.useState({
        // @ts-ignore
        tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config),
        config: config,
    });
    React.useEffect(() => {
        refetch();
    }, []);
    const data = React.useMemo(() => {
        const newPerson = persons === null || persons === void 0 ? void 0 : persons.map((person) => {
            var _a, _b, _c, _d, _e;
            return (Object.assign(Object.assign({}, person), { fullname: (_a = person === null || person === void 0 ? void 0 : person[`${PREFIX}nomecompleto`]) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase(), email: (_b = person === null || person === void 0 ? void 0 : person[`${PREFIX}email`]) === null || _b === void 0 ? void 0 : _b.toLocaleUpperCase(), tags: (_d = (_c = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _c === void 0 ? void 0 : _c.map((t) => t === null || t === void 0 ? void 0 : t[`${PREFIX}nome`])) === null || _d === void 0 ? void 0 : _d.join(', '), areaChief: (_e = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_AreaResponsavel`]) === null || _e === void 0 ? void 0 : _e.map((are) => are === null || are === void 0 ? void 0 : are[`${PREFIX}nome`]).join(', '), actions: (React.createElement(Grid, null,
                    React.createElement(Tooltip, { arrow: true, title: 'Detalhes' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDetail(person) },
                            React.createElement(Info, null))),
                    React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleEdit(person) },
                            React.createElement(Edit, null))),
                    (person === null || person === void 0 ? void 0 : person[`${PREFIX}ativo`]) ? (React.createElement(Tooltip, { arrow: true, title: 'Desativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDesactive(person) },
                            React.createElement(VisibilityOff, null)))) : (React.createElement(Tooltip, { arrow: true, title: 'Ativar' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleActive(person) },
                            React.createElement(Visibility, null)))),
                    React.createElement(Tooltip, { arrow: true, title: 'Excluir' },
                        React.createElement(IconButton, { style: { padding: '8px' }, onClick: () => handleDelete(person) },
                            React.createElement(Delete, null))))) }));
        });
        setListFiltered(newPerson === null || newPerson === void 0 ? void 0 : newPerson.filter((e) => !(e === null || e === void 0 ? void 0 : e[`${PREFIX}excluido`]) && e[`${PREFIX}ativo`]));
        return newPerson;
    }, [persons]);
    const columns = [
        {
            name: `${PREFIX}nome`,
            label: 'Nome',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}sobrenome`,
            label: 'Sobrenome',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}nomepreferido`,
            label: 'Nome Preferido',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}email`,
            label: 'E-mail',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}emailsecundario`,
            label: 'E-mail Secundário',
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: `${PREFIX}celular`,
            label: 'Celular',
            options: {
                filter: true,
            },
        },
        {
            name: `${PREFIX}Titulo.${PREFIX}nome`,
            label: 'Título',
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: `${PREFIX}EscolaOrigem.${PREFIX}nome`,
            label: 'Escola de origem',
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: `areaChief`,
            label: 'Chefe de Departamento',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: `tags`,
            label: 'Etiquetas',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: `${PREFIX}ativo`,
            label: 'Status',
            options: {
                filter: false,
                display: false,
            },
        },
        {
            name: 'actions',
            label: 'Ações',
            options: {
                filter: false,
                sort: false,
                setCellHeaderProps: () => ({ align: 'center' }),
                setCellProps: () => ({ align: 'center', style: { minWidth: '13rem' } }),
            },
        },
    ];
    const refetch = () => {
        dispatch(fetchAllPerson({
            searchQuery: '',
        }));
    };
    const handleSuccess = () => {
        refetch();
        notification.success({
            title: 'Sucesso',
            description: 'Ativado com sucesso',
        });
    };
    const handleError = (error) => {
        var _a, _b;
        notification.error({
            title: 'Falha',
            description: (_b = (_a = error === null || error === void 0 ? void 0 : error.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
        });
    };
    const handleEdit = (item) => {
        setForm({
            open: true,
            item,
        });
    };
    const handleDesactive = (item) => {
        setDesactive({
            open: true,
            item,
        });
    };
    const handleSuccessDelete = () => {
        refetch();
        notification.success({
            title: 'Sucesso',
            description: 'Excluído com sucesso',
        });
    };
    const handleDelete = (item) => {
        confirmation.openConfirmation({
            title: 'Deseja relmente excluir a pessoa?',
            description: item === null || item === void 0 ? void 0 : item[`${PREFIX}nome`],
            onConfirm: () => dispatch(deletePerson({ id: item === null || item === void 0 ? void 0 : item[`${PREFIX}pessoaid`] }, { onSuccess: handleSuccessDelete, onError: handleError })),
        });
    };
    const handleActive = (item) => {
        dispatch(activePerson(item, { onSuccess: handleSuccess, onError: handleError }));
    };
    const handleDetail = (item) => {
        setDetail({
            open: true,
            item,
        });
    };
    const customToolbarSelect = (selectedRows) => {
        const itemsSelected = [];
        selectedRows.data.forEach((row) => {
            itemsSelected.push(persons[row.index]);
        });
        return (React.createElement("div", null,
            React.createElement(Tooltip, { arrow: true, title: 'Editar Selectionado(s)' },
                React.createElement(IconButton, { onClick: () => setBulkEdit({ open: true, items: itemsSelected }) },
                    React.createElement(Edit, null)))));
    };
    const setRowProps = (row) => {
        if (!row[10]) {
            return {
                style: { background: '#f09b95' },
            };
        }
    };
    const customToolbar = () => (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { disableFocusListener: true, arrow: true, title: 'Filtro' },
            React.createElement(IconButton, { onClick: () => setOpenFilter(true) },
                React.createElement(FilterList, null)))));
    const clearFilter = () => {
        setQuery(Object.assign(Object.assign({}, query), { tree: QbUtils.loadFromJsonLogic({ and: [{ '==': [{ var: 'ise_ativo' }, true] }] }, config) }));
    };
    const applyFilter = () => {
        const logic = QbUtils.jsonLogicFormat(query.tree, config).logic;
        if (logic) {
            const filteredData = data.filter((item) => jsonLogic.apply(logic, item));
            setListFiltered(filteredData);
        }
        else {
            setListFiltered(data);
        }
        setOpenFilter(false);
    };
    const tableOptions = {
        enableNestedDataAccess: '.',
        tableBodyHeight: 'calc(100vh - 470px)',
        selectableRows: 'none',
        download: false,
        print: false,
        filter: false,
        setRowProps,
        customToolbar,
        customToolbarSelect,
    };
    if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning)) {
        return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
                { name: 'Planejamento', page: 'Pessoa' },
                { name: 'Pessoa', page: 'Pessoa' },
            ] },
            React.createElement(DontHasPermition, null)));
    }
    return (React.createElement(Page, { context: context, itemsBreadcrumbs: [
            { name: 'Planejamento', page: 'Pessoa' },
            { name: 'Pessoa', page: 'Pessoa' },
        ] },
        React.createElement(CreateHeader, { title: 'Pessoa', action: React.createElement(Button, { onClick: () => setForm({ open: true }), variant: 'contained', color: 'primary', startIcon: React.createElement(Add, null) }, "Adicionar Pessoa") }),
        React.createElement(Table, { refTable: refTable, columns: columns, data: listFiltered, options: tableOptions }),
        React.createElement(FilterDrawer, { open: openFilter, queryQB: query, clearFilter: clearFilter, configQB: config, setQuery: setQuery, applyFilter: applyFilter, onClose: () => setOpenFilter(false) }),
        React.createElement(ModalDetail, { open: detail.open, item: detail.item, onClose: () => setDetail({ open: false }) }),
        React.createElement(ModalBulkEdit, { open: bulkEdit.open, tags: tags, persons: bulkEdit.items, notification: notification, handleClose: () => setBulkEdit({ open: false }) }),
        React.createElement(ModalDesactive, { open: desactive.open, person: desactive.item, notification: notification, handleClose: () => {
                refetch();
                setDesactive({ open: false });
            } }),
        React.createElement(AddPerson, { open: form.open, person: form.item, refetch: refetch, handleClose: () => setForm({ open: false }) })));
};
export default PersonPage;
//# sourceMappingURL=PersonPage.js.map