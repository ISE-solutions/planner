import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Grid, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
const RelatedClassForm = ({ values, errors, program, isDetail, setValues, teams, handleChange, setFieldValue, }) => {
    var _a;
    const handleAddTeam = () => {
        let relatedClass = values.relatedClass || [];
        relatedClass.push({
            keyId: v4(),
            team: null,
            relatedTeam: null,
        });
        setValues(Object.assign(Object.assign({}, values), { relatedClass }));
    };
    const handleRemoveTeam = (keyId) => {
        let relatedClass = values.relatedClass || [];
        relatedClass = relatedClass === null || relatedClass === void 0 ? void 0 : relatedClass.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setValues(Object.assign(Object.assign({}, values), { relatedClass }));
    };
    const listTeam = (_a = values === null || values === void 0 ? void 0 : values.relatedClass) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted);
    const ownTeams = program === null || program === void 0 ? void 0 : program[`${PREFIX}Programa_Turma`];
    return (React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (values.relatedClass || []).map((item, index) => {
        if (item.deleted)
            return;
        return (React.createElement(Grid, { container: true, spacing: 3, key: item.keyId, style: { margin: 0, width: '100%' } },
            React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                React.createElement(Autocomplete, { options: ownTeams || [], disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => {
                        setFieldValue(`relatedClass[${index}].team`, newValue);
                    }, defaultValue: item === null || item === void 0 ? void 0 : item.team, value: item === null || item === void 0 ? void 0 : item.team, renderInput: (params) => {
                        var _a, _b, _c, _d;
                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Turma', 
                            // @ts-ignore
                            error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.relatedClass) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.team), 
                            // @ts-ignore
                            helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.relatedClass) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.team })));
                    } })),
            React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                React.createElement(Autocomplete, { options: teams || [], disabled: isDetail, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) === (value === null || value === void 0 ? void 0 : value[`${PREFIX}nome`]), onChange: (event, newValue) => {
                        setFieldValue(`relatedClass[${index}].relatedTeam`, newValue);
                    }, value: item === null || item === void 0 ? void 0 : item.relatedTeam, defaultValue: item === null || item === void 0 ? void 0 : item.team, renderInput: (params) => {
                        var _a, _b, _c, _d;
                        return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Turma Relacionada', 
                            // @ts-ignore
                            error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.relatedClass) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.relatedTeam), 
                            // @ts-ignore
                            helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.relatedClass) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.relatedTeam })));
                    } })),
            React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 25,
                }, justify: 'center' },
                (listTeam === null || listTeam === void 0 ? void 0 : listTeam.length) &&
                    item.keyId === listTeam[0].keyId &&
                    !isDetail && (React.createElement(Add, { onClick: handleAddTeam, style: { color: '#333', cursor: 'pointer' } })),
                (((listTeam === null || listTeam === void 0 ? void 0 : listTeam.length) &&
                    item.keyId !== listTeam[0].keyId &&
                    !isDetail) ||
                    (listTeam === null || listTeam === void 0 ? void 0 : listTeam.length) > 1) &&
                    !isDetail && (React.createElement(Remove, { onClick: () => handleRemoveTeam(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
    })));
};
export default RelatedClassForm;
//# sourceMappingURL=index.js.map