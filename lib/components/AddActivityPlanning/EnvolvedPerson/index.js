import * as React from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { v4 } from 'uuid';
import { Autocomplete } from '@material-ui/lab';
import { EFatherTag } from '~/config/enums';
import { Add, Remove } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
const EnvolvedPerson = ({ formik }) => {
    var _a, _b, _c, _d;
    const [functionOptions, setFunctionOptions] = React.useState({});
    const [valueSetted, setValueSetted] = React.useState(false);
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { persons } = person;
    React.useEffect(() => {
        var _a;
        if (!valueSetted) {
            let newOptions = {};
            (_a = formik.values) === null || _a === void 0 ? void 0 : _a.people.map((item, index) => {
                var _a, _b;
                if (item.person || item.function) {
                    setValueSetted(true);
                }
                const functions = [];
                if (item.function) {
                    (_b = (_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.forEach((tag) => {
                        var _a;
                        const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                        if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                            functions.push(fullTag);
                        }
                    });
                }
                newOptions[index] = functions;
            });
            setFunctionOptions(newOptions);
        }
    }, [(_a = formik.values) === null || _a === void 0 ? void 0 : _a.people]);
    const handleAddPerson = () => {
        let people = formik.values.people || [];
        people.push({
            keyId: v4(),
            person: null,
            function: null,
        });
        formik.setFieldValue('people', people);
    };
    const handleRemovePerson = (keyId) => {
        let people = formik.values.people || [];
        people = people === null || people === void 0 ? void 0 : people.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        formik.setFieldValue('people', people);
    };
    const handleChangePerson = (idx, person) => {
        var _a, _b, _c;
        const functions = [];
        formik.setFieldValue(`people[${idx}].person`, person);
        if (!((_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[idx].isRequired)) {
            (_c = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _c === void 0 ? void 0 : _c.forEach((tag) => {
                var _a;
                const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                    functions.push(fullTag);
                }
            });
            formik.setFieldValue(`people[${idx}].function`, {});
            const newOptions = Object.assign({}, functionOptions);
            newOptions[idx] = functions;
            setFunctionOptions(newOptions);
        }
    };
    const listPeople = (_c = (_b = formik.values) === null || _b === void 0 ? void 0 : _b.people) === null || _c === void 0 ? void 0 : _c.filter((e) => !e.deleted);
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 }, (_d = (formik.values.people || [])) === null || _d === void 0 ? void 0 : _d.map((item, index) => {
            var _a, _b, _c, _d, _e, _f;
            if (item.deleted)
                return;
            return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Autocomplete, { options: persons || [], noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                            handleChangePerson(index, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                            var _a, _b, _c, _d, _e, _f;
                            return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa', 
                                // @ts-ignore
                                error: !!((_c = (_b = (_a = formik.errors) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.person), 
                                // @ts-ignore
                                helperText: (_f = (_e = (_d = formik.errors) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.person })));
                        }, value: (_c = (_b = (_a = formik.values) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.person })),
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Autocomplete, { options: (functionOptions === null || functionOptions === void 0 ? void 0 : functionOptions[index]) || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                            formik.setFieldValue(`people[${index}].function`, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                            var _a, _b, _c, _d, _e, _f;
                            return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Fun\u00E7\u00E3o', 
                                // @ts-ignore
                                error: !!((_c = (_b = (_a = formik.errors) === null || _a === void 0 ? void 0 : _a.people) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.function), 
                                // @ts-ignore
                                helperText: (_f = (_e = (_d = formik.errors) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.function })));
                        }, value: (_f = (_e = (_d = formik.values) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e[index]) === null || _f === void 0 ? void 0 : _f.function })),
                React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 25,
                    }, justify: 'center' },
                    listPeople.length &&
                        item.keyId === listPeople[listPeople.length - 1].keyId && (React.createElement(Add, { onClick: handleAddPerson, style: { color: '#333', cursor: 'pointer' } })),
                    ((listPeople.length && item.keyId !== listPeople[0].keyId) ||
                        listPeople.length > 1) && (React.createElement(Remove, { onClick: () => handleRemovePerson(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
        }))));
};
export default EnvolvedPerson;
//# sourceMappingURL=index.js.map