import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Button, Grid, IconButton, Paper, TextField, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Delete } from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
const FantasyNameForm = ({ values, isDetail, errors, setValues, handleChange, setFieldValue, }) => {
    var _a, _b;
    const { tag } = useSelector((state) => state);
    const { tags } = tag;
    const handleAddName = () => {
        let names = values.names || [];
        names.push({
            keyId: v4(),
            name: '',
            nameEn: '',
            nameEs: '',
            use: '',
        });
        setValues(Object.assign(Object.assign({}, values), { names }));
    };
    const useOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_RELATORIO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const handleRemoveName = (keyId) => {
        let names = values.names || [];
        names = names === null || names === void 0 ? void 0 : names.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setValues(Object.assign(Object.assign({}, values), { names }));
    };
    const listName = (_a = values === null || values === void 0 ? void 0 : values.names) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted);
    return (React.createElement(Box, { overflow: 'hidden auto', display: 'flex', alignItems: 'flex-start', flexDirection: 'column', style: { gap: '10px' }, padding: '.5rem', maxHeight: '25rem', flexGrow: 1 },
        listName.length && !isDetail && (React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleAddName, startIcon: React.createElement(Add, null) }, "Adicionar")), (_b = values === null || values === void 0 ? void 0 : values.names) === null || _b === void 0 ? void 0 :
        _b.map((item, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (item.deleted)
                return;
            return (React.createElement(Paper, { style: { width: '100%', position: 'relative' }, elevation: 3 },
                React.createElement(Box, null, ((listName.length && item.keyId !== listName[0].keyId) ||
                    listName.length > 1) &&
                    !isDetail && (React.createElement(Box, { position: 'absolute', right: '10px' },
                    React.createElement(IconButton, { onClick: () => handleRemoveName(item.keyId) },
                        React.createElement(Delete, null))))),
                React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, paddingTop: '20px', width: '100%' } },
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { autoFocus: true, fullWidth: true, label: 'Nome (PT)', type: 'text', disabled: isDetail, name: `names[${index}].name`, inputProps: { maxLength: 255 }, 
                            // @ts-ignore
                            error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.names) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.name), 
                            // @ts-ignore
                            helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.names) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.name, onChange: handleChange, value: (_f = (_e = values.names) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.name })),
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { fullWidth: true, label: 'Nome (EN)', type: 'text', disabled: isDetail, inputProps: { maxLength: 255 }, name: `names[${index}].nameEn`, onChange: handleChange, value: (_g = values.names[index]) === null || _g === void 0 ? void 0 : _g.nameEn })),
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(TextField, { fullWidth: true, label: 'Nome (ES)', type: 'text', disabled: isDetail, inputProps: { maxLength: 255 }, name: `names[${index}].nameEs`, onChange: handleChange, value: (_j = (_h = values.names) === null || _h === void 0 ? void 0 : _h[index]) === null || _j === void 0 ? void 0 : _j.nameEs })),
                    React.createElement(Grid, { item: true, sm: 12, md: 12, lg: 12 },
                        React.createElement(Autocomplete, { options: useOptions, disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                                setFieldValue(`names[${index}].use`, newValue);
                            }, renderInput: (params) => {
                                var _a, _b, _c, _d;
                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Uso', 
                                    // @ts-ignore
                                    error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.names) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.use), 
                                    // @ts-ignore
                                    helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.names) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.use })));
                            }, value: (_l = (_k = values === null || values === void 0 ? void 0 : values.names) === null || _k === void 0 ? void 0 : _k[index]) === null || _l === void 0 ? void 0 : _l.use })))));
        })));
};
export default FantasyNameForm;
//# sourceMappingURL=index.js.map