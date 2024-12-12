import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
const Capacity = ({ formik }) => {
    var _a, _b, _c;
    const { tag } = useSelector((state) => state);
    const { tags } = tag;
    const handleAddCapacity = () => {
        let capacities = formik.values.capacities || [];
        capacities.push({
            keyId: v4(),
            quantity: 0,
            use: '',
        });
        formik.setFieldValue('capacities', capacities);
    };
    const handleRemoveCapacity = (keyId) => {
        let capacities = formik.values.capacities || [];
        capacities = capacities === null || capacities === void 0 ? void 0 : capacities.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        formik.setFieldValue('capacities', capacities);
    };
    const useOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_RELATORIO)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const listCapacities = (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.capacities) === null || _b === void 0 ? void 0 : _b.filter((e) => !e.deleted);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 }, (_c = (formik.values.capacities || [])) === null || _c === void 0 ? void 0 : _c.map((item, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (item.deleted)
                return;
            return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(TextField, { fullWidth: true, label: 'Quantidade', type: 'number', name: `capacities[${index}].quantity`, onChange: formik.handleChange, 
                        // @ts-ignore
                        error: !!((_c = (_b = (_a = formik.errors) === null || _a === void 0 ? void 0 : _a.capacities) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.quantity), 
                        // @ts-ignore
                        helperText: (_f = (_e = (_d = formik.errors) === null || _d === void 0 ? void 0 : _d.capacities) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.quantity, value: (_h = (_g = formik.values.capacities) === null || _g === void 0 ? void 0 : _g[index]) === null || _h === void 0 ? void 0 : _h.quantity })),
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Autocomplete, { options: useOptions, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                            formik.setFieldValue(`capacities[${index}].use`, newValue);
                        }, renderInput: (params) => {
                            var _a, _b, _c, _d, _e, _f;
                            return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Uso', 
                                // @ts-ignore
                                error: !!((_c = (_b = (_a = formik.errors) === null || _a === void 0 ? void 0 : _a.capacities) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.use), 
                                // @ts-ignore
                                helperText: (_f = (_e = (_d = formik.errors) === null || _d === void 0 ? void 0 : _d.capacities) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.use })));
                        }, value: (_l = (_k = (_j = formik.values) === null || _j === void 0 ? void 0 : _j.capacities) === null || _k === void 0 ? void 0 : _k[index]) === null || _l === void 0 ? void 0 : _l.use })),
                React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 25,
                    }, justify: 'center' },
                    (listCapacities === null || listCapacities === void 0 ? void 0 : listCapacities.length) &&
                        item.keyId ===
                            listCapacities[(listCapacities === null || listCapacities === void 0 ? void 0 : listCapacities.length) - 1].keyId && (React.createElement(Add, { onClick: handleAddCapacity, style: { color: '#333', cursor: 'pointer' } })),
                    (listCapacities === null || listCapacities === void 0 ? void 0 : listCapacities.length) &&
                        item.keyId !== listCapacities[0].keyId && (React.createElement(Remove, { onClick: () => handleRemoveCapacity(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
        }))));
};
export default Capacity;
//# sourceMappingURL=index.js.map