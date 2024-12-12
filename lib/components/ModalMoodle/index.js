import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography, } from '@material-ui/core';
import { useFormik } from 'formik';
import { AddCircle, Close, ExpandMore, Link } from '@material-ui/icons';
import axios from 'axios';
import { MOODLE_URL } from '~/config/constants';
import Table from '../Table';
import { Autocomplete } from '@material-ui/lab';
import formatUrl from '~/utils/formatUrl';
import { EDeliveryType } from '~/config/enums';
const ModalMoodle = ({ open, onClose, onAdd }) => {
    const [allData, setAllData] = React.useState([]);
    const [fieldsFilter, setFieldsFilter] = React.useState([]);
    const [filter, setFilter] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [deliveryTime, setDeliveryTime] = React.useState();
    const [addDocument, setAddDocument] = React.useState({
        open: false,
        item: null,
    });
    const initialValues = { name: '' };
    React.useEffect(() => {
        axios.get(MOODLE_URL).then(({ data }) => {
            if (!data.exception) {
                setAllData(data);
            }
            setLoading(false);
        });
    }, []);
    React.useEffect(() => {
        if (allData === null || allData === void 0 ? void 0 : allData.length) {
            const typeMap = new Map();
            const areaMap = new Map();
            const teacherMap = new Map();
            const authorMap = new Map();
            const collectionMap = new Map();
            const institutionMap = new Map();
            const caseMap = new Map();
            const businessMap = new Map();
            const sizeMap = new Map();
            const areaActMap = new Map();
            const originMap = new Map();
            const sectorMap = new Map();
            allData === null || allData === void 0 ? void 0 : allData.forEach((item) => {
                if (item.doctype && !typeMap.has(item.doctype)) {
                    typeMap.set(item.doctype, item.doctype);
                }
                if (item.area && !areaMap.has(item.area)) {
                    areaMap.set(item.area, item.area);
                }
                if (item.professor && !teacherMap.has(item.professor)) {
                    teacherMap.set(item.professor, item.professor);
                }
                if (item.authors && !authorMap.has(item.authors)) {
                    authorMap.set(item.authors, item.authors);
                }
                if (item.collection && !collectionMap.has(item.collection)) {
                    collectionMap.set(item.collection, item.collection);
                }
                if (item.institution && !institutionMap.has(item.institution)) {
                    institutionMap.set(item.institution, item.institution);
                }
                if (item.casetype && !caseMap.has(item.casetype)) {
                    caseMap.set(item.casetype, item.casetype);
                }
                if (item.business && !businessMap.has(item.business)) {
                    businessMap.set(item.business, item.business);
                }
                if (item.businesssize && !sizeMap.has(item.businesssize)) {
                    sizeMap.set(item.businesssize, item.businesssize);
                }
                if (item.occupationarea && !areaActMap.has(item.occupationarea)) {
                    areaActMap.set(item.occupationarea, item.occupationarea);
                }
                if (item.businessorigin && !originMap.has(item.businessorigin)) {
                    originMap.set(item.businessorigin, item.businessorigin);
                }
                if (item.department && !sectorMap.has(item.department)) {
                    sectorMap.set(item.department, item.department);
                }
            });
            setFieldsFilter([
                {
                    name: 'type',
                    label: 'Tipo de Material',
                    options: Array.from(typeMap.values()),
                },
                {
                    name: 'academicArea',
                    label: 'Área Acadêmica',
                    options: Array.from(areaMap.values()),
                },
                {
                    name: 'teacher',
                    label: 'Professor',
                    options: Array.from(teacherMap.values()),
                },
                {
                    name: 'author',
                    label: 'Autor',
                    options: Array.from(authorMap.values()),
                },
                {
                    name: 'collection',
                    label: 'Coleção',
                    options: Array.from(collectionMap.values()),
                },
                {
                    name: 'institution',
                    label: 'Escola/Instituição',
                    options: Array.from(institutionMap.values()),
                },
                {
                    name: 'institution',
                    label: 'Escola/Instituição',
                    options: Array.from(institutionMap.values()),
                },
                {
                    name: 'case',
                    label: 'Tipo de Caso',
                    options: Array.from(caseMap.values()),
                },
                {
                    name: 'business',
                    label: 'Negócio',
                    options: Array.from(businessMap.values()),
                },
                {
                    name: 'size',
                    label: 'Tamanho',
                    options: Array.from(sizeMap.values()),
                },
                {
                    name: 'actArea',
                    label: 'Área de Atuação',
                    options: Array.from(areaActMap.values()),
                },
                {
                    name: 'origin',
                    label: 'Origem do negócio',
                    options: Array.from(originMap.values()),
                },
                {
                    name: 'sector',
                    label: 'Setor',
                    options: Array.from(sectorMap.values()),
                },
            ]);
        }
    }, [allData]);
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnBlur: false,
        validateOnMount: false,
        validateOnChange: false,
        onSubmit: (values) => {
            setFilter(values);
        },
    });
    const handleReset = () => {
        setFilter({});
        formik.resetForm();
    };
    const handleAdd = (item) => {
        setAddDocument({ open: true, item });
    };
    const handleCloseAdd = () => {
        setAddDocument({ open: false });
    };
    const handleAddDocument = () => {
        onAdd(Object.assign(Object.assign({}, addDocument.item), { delivery: deliveryTime }));
        setAddDocument({ open: false });
    };
    const tableOptions = {
        rowsPerPage: 10,
        enableNestedDataAccess: '.',
        tableBodyHeight: 'calc(100vh - 470px)',
        selectableRows: 'none',
        download: false,
        print: false,
        filter: false,
    };
    const columns = [
        {
            name: `action`,
            label: 'Ações',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: `url`,
            label: 'Link',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: `code`,
            label: 'Código',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `content_name`,
            label: 'Título',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `nickname`,
            label: 'Apelido do Material',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `mainPath`,
            label: 'Pasta Principal',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `subPath`,
            label: 'Subpasta',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `doctype`,
            label: 'Tipo de Material',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `area`,
            label: 'Área Acadêmica',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `professor`,
            label: 'Professor responsável',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `language`,
            label: 'Idioma',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `collection`,
            label: 'Coleção',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `institution`,
            label: 'Escola/Instituição',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `officialcodes`,
            label: 'Códigos Oficiais',
            options: {
                filter: false,
                sort: true,
            },
        },
        {
            name: `officialname`,
            label: 'Nome Oficial',
            options: {
                filter: false,
                sort: true,
            },
        },
    ];
    const rows = React.useMemo(() => {
        let result = allData === null || allData === void 0 ? void 0 : allData.map((item) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, item), { action: (React.createElement(Tooltip, { title: 'Adicionar' },
                    React.createElement(IconButton, { onClick: () => handleAdd(item) },
                        React.createElement(AddCircle, null)))), url: (React.createElement(Tooltip, { title: 'Acessar' },
                    React.createElement("a", { href: formatUrl(item.contenturl), target: '_blank' },
                        React.createElement(Link, null),
                        ' '))), mainPath: (_a = item === null || item === void 0 ? void 0 : item.path) === null || _a === void 0 ? void 0 : _a.split('/')[1], subPath: (_b = item === null || item === void 0 ? void 0 : item.path) === null || _b === void 0 ? void 0 : _b.split('/')[2] }));
        });
        if (Object.keys(filter).length) {
            if (filter === null || filter === void 0 ? void 0 : filter.type) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.doctype) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.type)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.academicArea) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.area) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.academicArea)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.teacher) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.professor) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.teacher)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.author) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.authors) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.author)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.collection) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.collection) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.collection)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.institution) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.institution) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.institution)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.case) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.casetype) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.case)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.business) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.business) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.business)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.size) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.businesssize) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.size)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.actArea) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.occupationarea) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.actArea)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.origin) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.businessorigin) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.origin)) > -1; });
            }
            if (filter === null || filter === void 0 ? void 0 : filter.sector) {
                result = result.filter((item) => { var _a; return ((_a = item === null || item === void 0 ? void 0 : item.department) === null || _a === void 0 ? void 0 : _a.indexOf(filter === null || filter === void 0 ? void 0 : filter.sector)) > -1; });
            }
        }
        return result;
    }, [allData, filter]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'lg' },
            React.createElement(DialogTitle, null,
                "Busca documentos Moodle",
                React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null))),
            React.createElement(DialogContent, null, loading ? (React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                React.createElement(CircularProgress, { color: 'primary' }))) : (React.createElement(React.Fragment, null,
                React.createElement(Box, null,
                    React.createElement(Accordion, { elevation: 3 },
                        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Filtro")),
                        React.createElement(AccordionDetails, null,
                            React.createElement(Box, { display: 'flex', flexDirection: 'column' },
                                React.createElement(Grid, { container: true, spacing: 3 }, fieldsFilter.map((field) => (React.createElement(Grid, { item: true, lg: 3, md: 4, sm: 6, xs: 12 },
                                    React.createElement(Autocomplete, { filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (field === null || field === void 0 ? void 0 : field.options) || [], value: formik.values[field === null || field === void 0 ? void 0 : field.name], onChange: (event, newValue) => {
                                            formik.setFieldValue(field === null || field === void 0 ? void 0 : field.name, newValue);
                                        }, getOptionSelected: (option, item) => option === item, getOptionLabel: (option) => option || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: field.label }))) }))))),
                                React.createElement(Box, { marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end', style: { gap: '10px' } },
                                    React.createElement(Button, { onClick: handleReset, variant: 'outlined' }, "Limpar"),
                                    React.createElement(Button, { onClick: () => formik.handleSubmit(), variant: 'contained', color: 'primary' }, "Pesquisar")))))),
                React.createElement(Table, { columns: columns, data: rows, options: tableOptions }))))),
        React.createElement(Dialog, { open: addDocument.open, fullWidth: true, maxWidth: 'sm' },
            React.createElement(DialogTitle, null, "Adicionar Documento"),
            React.createElement(DialogContent, null,
                React.createElement(Autocomplete, { options: Object.keys(EDeliveryType), noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => EDeliveryType[option], onChange: (event, newValue) => {
                        setDeliveryTime(newValue);
                    }, renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Momento Entrega' }))), value: deliveryTime })),
            React.createElement(DialogActions, null,
                React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', style: { gap: '10px' } },
                    React.createElement(Button, { color: 'primary', onClick: handleCloseAdd }, "Cancelar"),
                    React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleAddDocument }, "Adicionar"))))));
};
export default ModalMoodle;
//# sourceMappingURL=index.js.map