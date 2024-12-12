import * as React from 'react';
import { Box, Button, Grid, IconButton, Paper, TextField, } from '@material-ui/core';
import { v4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { Add, Delete } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
const FantasyName = ({ formik }) => {
    var _a, _b, _c;
    const { tag } = useSelector((state) => state);
    const { tags } = tag;
    const handleAddName = () => {
        let names = formik.values.names || [];
        names.push({
            keyId: v4(),
            name: '',
            nameEn: '',
            nameEs: '',
            use: '',
        });
        formik.setFieldValue('names', names);
    };
    const handleRemoveName = (keyId) => {
        let names = formik.values.names || [];
        names = names === null || names === void 0 ? void 0 : names.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        formik.setFieldValue('names', names);
    };
    const useOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_RELATORIO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const listName = (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.names) === null || _b === void 0 ? void 0 : _b.filter((e) => !e.deleted);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', style: { gap: '10px' }, padding: '.5rem', maxHeight: '25rem', flexGrow: 1 },
            React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleAddName, startIcon: React.createElement(Add, null) }, "Adicionar"), (_c = (formik.values.names || [])) === null || _c === void 0 ? void 0 :
            _c.map((item, index) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                if (item.deleted)
                    return;
                return (React.createElement(Paper, { style: { width: '100%', position: 'relative' }, elevation: 3 },
                    React.createElement(Box, null, listName.length > 1 && (React.createElement(Box, { position: 'absolute', right: '10px' },
                        React.createElement(IconButton, { onClick: () => handleRemoveName(item.keyId) },
                            React.createElement(Delete, null))))),
                    React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, paddingTop: '20px', width: '100%' } },
                        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                            React.createElement(TextField, { autoFocus: true, fullWidth: true, label: 'Nome (PT)', type: 'text', name: `names[${index}].name`, inputProps: { maxLength: 255 }, 
                                // @ts-ignore
                                error: !!((_c = (_b = (_a = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _a === void 0 ? void 0 : _a.names) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.name), 
                                // @ts-ignore
                                helperText: (_f = (_e = (_d = formik === null || formik === void 0 ? void 0 : formik.errors) === null || _d === void 0 ? void 0 : _d.names) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.name, onChange: formik.handleChange, value: (_h = (_g = formik.values.names) === null || _g === void 0 ? void 0 : _g[index]) === null || _h === void 0 ? void 0 : _h.name })),
                        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                            React.createElement(TextField, { fullWidth: true, label: 'Nome (EN)', type: 'text', inputProps: { maxLength: 255 }, name: `names[${index}].nameEn`, onChange: formik.handleChange, value: (_j = formik.values.names[index]) === null || _j === void 0 ? void 0 : _j.nameEn })),
                        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                            React.createElement(TextField, { fullWidth: true, label: 'Nome (ES)', type: 'text', inputProps: { maxLength: 255 }, name: `names[${index}].nameEs`, onChange: formik.handleChange, value: (_l = (_k = formik.values.names) === null || _k === void 0 ? void 0 : _k[index]) === null || _l === void 0 ? void 0 : _l.nameEs })),
                        React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                            React.createElement(Autocomplete, { options: useOptions, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                                    formik.setFieldValue(`names[${index}].use`, newValue);
                                }, renderInput: (params) => {
                                    var _a, _b, _c, _d, _e, _f;
                                    return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Uso', 
                                        // @ts-ignore
                                        error: !!((_c = (_b = (_a = formik.errors) === null || _a === void 0 ? void 0 : _a.names) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.use), 
                                        // @ts-ignore
                                        helperText: (_f = (_e = (_d = formik.errors) === null || _d === void 0 ? void 0 : _d.names) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.use })));
                                }, value: (_p = (_o = (_m = formik.values) === null || _m === void 0 ? void 0 : _m.names) === null || _o === void 0 ? void 0 : _o[index]) === null || _p === void 0 ? void 0 : _p.use })))));
            }))));
};
export default FantasyName;
//# sourceMappingURL=index.js.map