import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Add, Close, PlusOne, Remove } from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
import { useConfirmation, useNotification, useLoggedUser } from '~/hooks';
import AddPerson from '~/components/AddPerson';
import { useSelector } from 'react-redux';
const EnvolvedPeopleForm = ({ isDetail, index, values, errors, setFieldValue, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [functionOptions, setFunctionOptions] = React.useState({});
    const [valueSetted, setValueSetted] = React.useState(false);
    const [loading, setLoading] = React.useState({});
    const [dialogConflict, setDialogConflict] = React.useState({
        open: false,
        msg: null,
    });
    const [newPerson, setNewPerson] = React.useState({
        open: false,
    });
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const { currentUser } = useLoggedUser();
    const { tag, person } = useSelector((state) => state);
    const { dictTag } = tag;
    const { persons } = person;
    React.useEffect(() => {
        var _a, _b;
        if (!valueSetted) {
            let newOptions = {};
            (_b = (_a = values === null || values === void 0 ? void 0 : values.activities) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.people.map((item, index) => {
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
    }, [(_b = (_a = values === null || values === void 0 ? void 0 : values.activities) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.people]);
    const handleAddPeople = () => {
        var _a;
        let people = ((_a = values === null || values === void 0 ? void 0 : values.activities) === null || _a === void 0 ? void 0 : _a[index].people) || [];
        people.push({
            keyId: v4(),
            person: {},
            function: {},
        });
        setFieldValue(`activities[${index}].people`, people);
    };
    const handleRemovePeople = (keyId) => {
        var _a;
        let people = ((_a = values === null || values === void 0 ? void 0 : values.activities) === null || _a === void 0 ? void 0 : _a[index].people) || [];
        people = people === null || people === void 0 ? void 0 : people.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setFieldValue(`activities[${index}].people`, people);
    };
    const handleChangePerson = (idx, person) => {
        var _a, _b;
        const functions = [];
        if (!person) {
            setFieldValue(`activities[${index}].people[${idx}].person`, {});
            return;
        }
        if ((_a = values === null || values === void 0 ? void 0 : values.activities) === null || _a === void 0 ? void 0 : _a[index].people.some((p) => { var _a; return ((_a = p === null || p === void 0 ? void 0 : p.person) === null || _a === void 0 ? void 0 : _a.value) === person.value && !(p === null || p === void 0 ? void 0 : p.deleted); })) {
            notification.error({
                title: 'Duplicação',
                description: 'A pessoa informada já se encontra cadastrada, verifique!',
            });
            setFieldValue(`activities[${index}].people[${idx}].person`, {});
            return;
        }
        (_b = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.forEach((tag) => {
            var _a;
            const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
            if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                functions.push(fullTag);
            }
        });
        setFieldValue(`activities[${index}].people[${idx}].person`, person);
        setFieldValue(`activities[${index}].people[${idx}].function`, {});
        const newOptions = Object.assign({}, functionOptions);
        newOptions[idx] = functions;
        setFunctionOptions(newOptions);
    };
    const listPeople = (_e = (_d = (_c = values === null || values === void 0 ? void 0 : values.activities) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.people) === null || _e === void 0 ? void 0 : _e.filter((e) => !e.deleted);
    return (React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (_h = (_g = (_f = values === null || values === void 0 ? void 0 : values.activities) === null || _f === void 0 ? void 0 : _f[index]) === null || _g === void 0 ? void 0 : _g.people) === null || _h === void 0 ? void 0 :
        _h.map((item, i) => {
            if (item.deleted)
                return;
            return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: persons, disabled: isDetail, filterSelectedOptions: true, value: item.person || {}, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                                handleChangePerson(i, newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                                var _a, _b, _c, _d;
                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa', 
                                    // @ts-ignore
                                    error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.people) === null || _a === void 0 ? void 0 : _a[i]) === null || _b === void 0 ? void 0 : _b.person), 
                                    // @ts-ignore
                                    helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.people) === null || _c === void 0 ? void 0 : _c[i]) === null || _d === void 0 ? void 0 : _d.person })));
                            } }),
                        React.createElement(Tooltip, { title: 'Adicionar Pessoa' },
                            React.createElement(IconButton, { onClick: () => setNewPerson({ open: true }), disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) },
                                React.createElement(PlusOne, null))))),
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Autocomplete, { options: (functionOptions === null || functionOptions === void 0 ? void 0 : functionOptions[i]) || [], filterSelectedOptions: true, noOptionsText: 'Sem Op\u00E7\u00F5es', getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, value: item.function, disabled: !(functionOptions === null || functionOptions === void 0 ? void 0 : functionOptions[i]) || isDetail, onChange: (event, newValue) => {
                            setFieldValue(`activities[${index}].people[${i}].function`, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                            var _a, _b, _c, _d;
                            return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Fun\u00E7\u00E3o', 
                                // @ts-ignore
                                error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.people) === null || _a === void 0 ? void 0 : _a[i]) === null || _b === void 0 ? void 0 : _b.function), 
                                // @ts-ignore
                                helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.people) === null || _c === void 0 ? void 0 : _c[i]) === null || _d === void 0 ? void 0 : _d.function })));
                        } })),
                React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 25,
                    }, justify: 'center' },
                    (listPeople === null || listPeople === void 0 ? void 0 : listPeople.length) &&
                        item.keyId === listPeople[(listPeople === null || listPeople === void 0 ? void 0 : listPeople.length) - 1].keyId &&
                        !isDetail && (React.createElement(Add, { onClick: handleAddPeople, style: { color: '#333', cursor: 'pointer' } })),
                    (((listPeople === null || listPeople === void 0 ? void 0 : listPeople.length) && item.keyId !== listPeople[0].keyId) ||
                        (listPeople === null || listPeople === void 0 ? void 0 : listPeople.length) > 1) &&
                        !isDetail && (React.createElement(Remove, { onClick: () => handleRemovePeople(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
        }),
        React.createElement(AddPerson, { open: newPerson.open, handleClose: () => setNewPerson({ open: false }) }),
        React.createElement(Dialog, { open: dialogConflict.open },
            React.createElement(DialogTitle, null,
                React.createElement(Typography, { variant: 'subtitle1', color: 'secondary', style: { maxWidth: '25rem', fontWeight: 'bold' } },
                    "Resursos com conflito",
                    React.createElement(IconButton, { "aria-label": 'close', onClick: () => setDialogConflict({
                            open: false,
                            msg: null,
                        }), style: { position: 'absolute', right: 8, top: 8 } },
                        React.createElement(Close, null)))),
            React.createElement(DialogContent, null, dialogConflict.msg))));
};
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.js.map