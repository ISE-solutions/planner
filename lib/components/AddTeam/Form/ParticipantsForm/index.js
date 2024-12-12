import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { EFatherTag } from '~/config/enums';
import { useSelector } from 'react-redux';
import { PREFIX } from '~/config/database';
const ParticipantsForm = ({ values, isDetail, errors, setValues, handleChange, setFieldValue, }) => {
    var _a, _b;
    const { tag } = useSelector((state) => state);
    const { tags } = tag;
    const handleAddParticipant = () => {
        let participants = values.participants || [];
        participants.push({
            keyId: v4(),
            date: null,
            quantity: 0,
            use: '',
        });
        setValues(Object.assign(Object.assign({}, values), { participants }));
    };
    const handleRemoveParticipant = (keyId) => {
        let participants = values.participants || [];
        participants = participants === null || participants === void 0 ? void 0 : participants.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setValues(Object.assign(Object.assign({}, values), { participants }));
    };
    const useOptions = React.useMemo(() => tags === null || tags === void 0 ? void 0 : tags.filter((tag) => {
        var _a;
        return ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.USO_PARTICIPANTE)) &&
            !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]);
    }), [tags]);
    const listParticipant = (_a = values === null || values === void 0 ? void 0 : values.participants) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted);
    return (React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (_b = values === null || values === void 0 ? void 0 : values.participants) === null || _b === void 0 ? void 0 : _b.map((item, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        if (item.deleted)
            return;
        return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                React.createElement(KeyboardDatePicker, { clearable: true, autoOk: true, fullWidth: true, variant: 'inline', format: 'DD/MM/YYYY', disabled: isDetail, InputLabelProps: {
                        style: {
                            fontSize: '15px',
                        },
                    }, label: 'Data Limite de Preenchimento', 
                    // @ts-ignore
                    error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.date), 
                    // @ts-ignore
                    helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.date, value: item.date, onChange: (value) => setFieldValue(`participants[${index}].date`, value) })),
            React.createElement(Grid, { item: true, sm: 12, md: 4, lg: 4 },
                React.createElement(TextField, { fullWidth: true, disabled: isDetail, label: 'Quantidade Prevista', type: 'number', name: `participants[${index}].quantity`, onChange: handleChange, value: item.quantity || '', 
                    // @ts-ignore
                    error: !!((_f = (_e = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.quantity), 
                    // @ts-ignore
                    helperText: (_h = (_g = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _g === void 0 ? void 0 : _g[index]) === null || _h === void 0 ? void 0 : _h.quantity })),
            React.createElement(Grid, { item: true, sm: 12, md: 3, lg: 3 },
                React.createElement(Autocomplete, { options: useOptions, disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option.label, onChange: (event, newValue) => {
                        setFieldValue(`participants[${index}].use`, newValue);
                    }, renderInput: (params) => {
                        var _a, _b, _c, _d;
                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Uso', 
                            // @ts-ignore
                            error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.use), 
                            // @ts-ignore
                            helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.participants) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.use })));
                    }, value: (_k = (_j = values === null || values === void 0 ? void 0 : values.participants) === null || _j === void 0 ? void 0 : _j[index]) === null || _k === void 0 ? void 0 : _k.use })),
            React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 25,
                }, justify: 'center' },
                listParticipant.length &&
                    item.keyId === listParticipant[0].keyId &&
                    !isDetail && (React.createElement(Add, { onClick: handleAddParticipant, style: { color: '#333', cursor: 'pointer' } })),
                ((listParticipant.length &&
                    item.keyId !== listParticipant[0].keyId) ||
                    listParticipant.length > 1) &&
                    !isDetail && (React.createElement(Remove, { onClick: () => handleRemoveParticipant(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
    })));
};
export default ParticipantsForm;
//# sourceMappingURL=index.js.map