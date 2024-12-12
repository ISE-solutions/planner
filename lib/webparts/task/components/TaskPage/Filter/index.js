import * as React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Grid, IconButton, SwipeableDrawer, TextField, Typography, } from '@material-ui/core';
import { Close, ExpandMore, FilterList, Save, SwapHoriz, Visibility, VisibilityOff, } from '@material-ui/icons';
import { EFatherTag, STATUS_TASK } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { updateCustomFilter } from '~/store/modules/customFilter/actions';
import { useConfirmation } from '~/hooks';
const Filter = ({ open, formik, refetch, filterSelected, setFilterSelected, onAddCustomFilter, onOvewriteFilter, onClose, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    const [publishLoading, setPublishLoading] = React.useState(false);
    const { confirmation } = useConfirmation();
    const { tag, person, customFilter } = useSelector((state) => state);
    const { tags } = tag;
    const { persons } = person;
    const { customFilters } = customFilter;
    const peopleOptions = React.useMemo(() => {
        var _a;
        return (_a = persons === null || persons === void 0 ? void 0 : persons.filter((e) => e === null || e === void 0 ? void 0 : e[`${PREFIX}ativo`])) === null || _a === void 0 ? void 0 : _a.map((e) => ({ value: e.value, label: e.label }));
    }, [persons]);
    const typeProgramOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
                ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_PROGRAMA));
        })) === null || _a === void 0 ? void 0 : _a.map((e) => ({ value: e.value, label: e.label }));
    }, [tags]);
    const instituteOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
                ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.INSTITUTO));
        })) === null || _a === void 0 ? void 0 : _a.map((e) => ({ value: e.value, label: e.label }));
    }, [tags]);
    const companyOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
                ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.EMPRESA));
        })) === null || _a === void 0 ? void 0 : _a.map((e) => ({ value: e.value, label: e.label }));
    }, [tags]);
    const temperatureOptions = React.useMemo(() => {
        var _a;
        return (_a = tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
            var _a;
            return (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
                ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TEMPERATURA_STATUS));
        })) === null || _a === void 0 ? void 0 : _a.map((e) => ({ value: e.value, label: e.label }));
    }, [tags]);
    const statusOptions = React.useMemo(() => Object.values(STATUS_TASK)
        .filter((e) => typeof e === 'string')
        .map((key) => ({
        value: STATUS_TASK[key],
        label: key,
    })), []);
    const handleApplyFilter = () => {
        formik.setValues(JSON.parse(filterSelected === null || filterSelected === void 0 ? void 0 : filterSelected[`${PREFIX}valor`]));
    };
    const handleDelete = () => {
        confirmation.openConfirmation({
            title: 'Deseja relmente excluir o filtro?',
            description: filterSelected === null || filterSelected === void 0 ? void 0 : filterSelected[`${PREFIX}nome`],
            onConfirm: () => { },
            onCancel: () => { },
        });
    };
    const handlePublish = () => {
        setPublishLoading(true);
        updateCustomFilter(filterSelected[`${PREFIX}filtroid`], {
            [`${PREFIX}publicado`]: !(filterSelected === null || filterSelected === void 0 ? void 0 : filterSelected[`${PREFIX}publicado`]),
        }, {
            onSuccess: (it) => {
                refetch === null || refetch === void 0 ? void 0 : refetch();
                setFilterSelected(it);
                setPublishLoading(false);
            },
            onError: () => {
                setPublishLoading(false);
            },
        });
    };
    return (React.createElement(SwipeableDrawer, { anchor: 'right', open: open, onClose: onClose, onOpen: () => null, disableBackdropClick: true },
        React.createElement(Box, { margin: '1rem 2rem 0' },
            React.createElement(Typography, { variant: 'h6', color: 'textPrimary', style: { fontWeight: 'bold' } }, "Filtro")),
        React.createElement(Box, { position: 'absolute', right: '10px', top: '10px' },
            React.createElement(IconButton, { onClick: onClose },
                React.createElement(Close, null))),
        React.createElement(Box, { display: 'flex', height: '100%', flexDirection: 'column', width: '40rem', padding: '1rem' },
            React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', style: { gap: '10px' }, padding: '1rem', margin: '10px' },
                React.createElement(Autocomplete, { filterSelectedOptions: true, options: customFilters || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: filterSelected, onChange: (event, newValue) => setFilterSelected(newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Filtro(s) salvos' }))) }),
                React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'space-between' },
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                        React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: handlePublish, disabled: !filterSelected, startIcon: (filterSelected === null || filterSelected === void 0 ? void 0 : filterSelected[`${PREFIX}publicado`]) ? (React.createElement(VisibilityOff, null)) : (React.createElement(Visibility, null)) }, publishLoading ? (React.createElement(CircularProgress, { size: 25, style: { color: '#fff' } })) : (filterSelected === null || filterSelected === void 0 ? void 0 : filterSelected[`${PREFIX}publicado`]) ? ('Despublicar') : ('Publicar')),
                        React.createElement(Button, { disabled: !filterSelected, onClick: handleDelete, color: 'secondary' }, "Excluir")),
                    React.createElement(Button, { disabled: !filterSelected, color: 'primary', onClick: handleApplyFilter }, "Selecionar"))),
            React.createElement(Box, { display: 'flex', flexDirection: 'column', flex: '1 0 auto', maxHeight: 'calc(100vh - 12rem)', overflow: 'auto' },
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            ((_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.institute) === null || _b === void 0 ? void 0 : _b.length) ||
                                ((_d = (_c = formik.values) === null || _c === void 0 ? void 0 : _c.company) === null || _d === void 0 ? void 0 : _d.length) ||
                                ((_f = (_e = formik.values) === null || _e === void 0 ? void 0 : _e.typeProgram) === null || _f === void 0 ? void 0 : _f.length) ||
                                ((_h = (_g = formik.values) === null || _g === void 0 ? void 0 : _g.programTemperature) === null || _h === void 0 ? void 0 : _h.length) ? (React.createElement(FilterList, { fontSize: 'small', color: 'primary' })) : null,
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Programa"))),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Grid, { container: true, spacing: 2, style: { width: '100%' } },
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, options: instituteOptions || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: formik.values.institute, onChange: (event, newValue) => {
                                        formik.setFieldValue('institute', newValue);
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Instituto' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, options: typeProgramOptions || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: formik.values.typeProgram, onChange: (event, newValue) => {
                                        formik.setFieldValue('typeProgram', newValue);
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Tipo de Programa' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, options: companyOptions || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: formik.values.company, onChange: (event, newValue) => {
                                        formik.setFieldValue('company', newValue);
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Empresa' }))) })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, options: temperatureOptions || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: formik.values.programTemperature, onChange: (event, newValue) => {
                                        formik.setFieldValue('programTemperature', newValue);
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Temperatura' }))) }))))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            ((_j = formik.values) === null || _j === void 0 ? void 0 : _j.teamYearConclusion) ||
                                ((_k = formik.values) === null || _k === void 0 ? void 0 : _k.teamSigla) ||
                                ((_l = formik.values) === null || _l === void 0 ? void 0 : _l.teamName) ||
                                ((_o = (_m = formik.values) === null || _m === void 0 ? void 0 : _m.teamTemperature) === null || _o === void 0 ? void 0 : _o.length) ? (React.createElement(FilterList, { fontSize: 'small', color: 'primary' })) : null,
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Turma"))),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Grid, { container: true, spacing: 2, style: { width: '100%' } },
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, label: 'Nome', type: 'text', name: 'teamName', value: formik.values.teamName, inputProps: { maxLength: 255 }, onChange: formik.handleChange })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, label: 'Sigla', type: 'text', name: 'teamSigla', value: formik.values.teamSigla, inputProps: { maxLength: 50 }, onChange: formik.handleChange })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, label: 'Ano de Conclus\u00E3o', type: 'number', name: 'teamYearConclusion', value: formik.values.teamYearConclusion, onChange: formik.handleChange })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, filterSelectedOptions: true, options: temperatureOptions || [], noOptionsText: 'Sem Op\u00E7\u00F5es', value: formik.values.teamTemperature, onChange: (event, newValue) => {
                                        formik.setFieldValue('teamTemperature', newValue);
                                    }, getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Temperatura' }))) }))))),
                React.createElement(Accordion, { elevation: 3, style: { margin: '.5rem' } },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            ((_p = formik.values) === null || _p === void 0 ? void 0 : _p.delivery) ||
                                ((_r = (_q = formik.values) === null || _q === void 0 ? void 0 : _q.status) === null || _r === void 0 ? void 0 : _r.length) ||
                                ((_t = (_s = formik.values) === null || _s === void 0 ? void 0 : _s.responsible) === null || _t === void 0 ? void 0 : _t.length) ||
                                ((_u = formik.values) === null || _u === void 0 ? void 0 : _u.start) ||
                                ((_v = formik.values) === null || _v === void 0 ? void 0 : _v.end) ||
                                ((_w = formik.values) === null || _w === void 0 ? void 0 : _w.endForecastConclusion) ? (React.createElement(FilterList, { fontSize: 'small', color: 'primary' })) : null,
                            React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Tarefa"))),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Grid, { container: true, spacing: 2, style: { width: '100%' } },
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(TextField, { fullWidth: true, label: 'Entrega', type: 'text', name: 'delivery', value: formik.values.delivery, inputProps: { maxLength: 255 }, onChange: formik.handleChange })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, options: statusOptions || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', onChange: (event, newValue) => {
                                        formik.setFieldValue('status', newValue);
                                    }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Status' }))), value: (_x = formik.values) === null || _x === void 0 ? void 0 : _x.status })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(Autocomplete, { multiple: true, options: peopleOptions || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                                        formik.setFieldValue(`responsible`, newValue);
                                    }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa Respons\u00E1vel' }))), value: (_y = formik.values) === null || _y === void 0 ? void 0 : _y.responsible })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY HH:mm', label: 'In\u00EDcio', value: formik.values.start || null, onChange: (newValue) => {
                                        formik.setFieldValue(`start`, newValue);
                                    } })),
                            React.createElement(Grid, { item: true, sm: 12, md: 6, lg: 6 },
                                React.createElement(KeyboardDatePicker, { autoOk: true, clearable: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY HH:mm', label: 'Fim', value: formik.values.end || null, onChange: (newValue) => {
                                        formik.setFieldValue(`end`, newValue);
                                    } })))))),
            React.createElement(Box, { width: '100%', marginTop: '1rem', display: 'flex', padding: '1rem', justifyContent: 'space-between' },
                React.createElement(Box, { display: 'flex', style: { gap: '10px' } },
                    filterSelected ? (React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: onOvewriteFilter, startIcon: React.createElement(SwapHoriz, null) }, "Sobrescrever")) : null,
                    React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: onAddCustomFilter, startIcon: React.createElement(Save, null) }, "Salvar Filtro")),
                React.createElement(Box, { display: 'flex', style: { gap: '1rem' } },
                    React.createElement(Button, { color: 'primary', onClick: () => formik.handleReset() }, "Limpar"),
                    React.createElement(Button, { onClick: () => formik.handleSubmit(), variant: 'contained', color: 'primary' }, "Aplicar"))))));
};
export default Filter;
//# sourceMappingURL=index.js.map