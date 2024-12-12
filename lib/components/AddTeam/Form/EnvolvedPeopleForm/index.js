import * as React from 'react';
import { v4 } from 'uuid';
import { Box, CircularProgress, Grid, IconButton, Link, TextField, Tooltip, Typography, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { AccessTime, Add, CheckCircle, PlusOne, Remove, } from '@material-ui/icons';
import { EFatherTag } from '~/config/enums';
import { PERSON, PREFIX } from '~/config/database';
import { useConfirmation, useNotification } from '~/hooks';
import * as moment from 'moment';
import AddPerson from '~/components/AddPerson';
import { useDispatch, useSelector } from 'react-redux';
import { updateEnvolvedPerson } from '~/store/modules/team/actions';
const EnvolvedPeopleForm = ({ tags = [], values, isDetail, isDraft, persons = [], errors, teamId, setValues, setFieldValue, currentUser, setTeam, }) => {
    var _a, _b;
    const [functionOptions, setFunctionOptions] = React.useState({});
    const [peopleOptions, setPeopleOptions] = React.useState({});
    const [valueSetted, setValueSetted] = React.useState(false);
    const [loading, setLoading] = React.useState({});
    const [newPerson, setNewPerson] = React.useState({
        open: false,
    });
    const { tag } = useSelector((state) => state);
    const { dictTag } = tag;
    const { notification } = useNotification();
    const { confirmation } = useConfirmation();
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (!valueSetted) {
            let newOptionsFunction = {};
            let newOptionsPeople = {};
            values === null || values === void 0 ? void 0 : values.people.map((item, index) => {
                var _a, _b;
                if (item.person || item.function) {
                    // setValueSetted(true);
                }
                const functions = [];
                if (item === null || item === void 0 ? void 0 : item.isRequired) {
                    const peoples = persons.filter((pers) => {
                        var _a;
                        return !(pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}excluido`]) &&
                            (pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}ativo`]) &&
                            ((_a = pers === null || pers === void 0 ? void 0 : pers[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((ta) => {
                                var _a;
                                return (ta === null || ta === void 0 ? void 0 : ta[`${PREFIX}etiquetaid`]) ===
                                    ((_a = item === null || item === void 0 ? void 0 : item.function) === null || _a === void 0 ? void 0 : _a[`${PREFIX}etiquetaid`]);
                            }));
                    });
                    newOptionsPeople[index] = peoples;
                }
                else {
                    (_b = (_a = item === null || item === void 0 ? void 0 : item.person) === null || _a === void 0 ? void 0 : _a[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.forEach((tag) => {
                        var _a;
                        const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                        if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                            functions.push(fullTag);
                        }
                    });
                }
                newOptionsFunction[index] = functions;
            });
            setFunctionOptions(newOptionsFunction);
            setPeopleOptions(newOptionsPeople);
        }
    }, [values === null || values === void 0 ? void 0 : values.people, persons, tags]);
    const handleAddPeople = () => {
        let people = values.people || [];
        people.push({
            keyId: v4(),
            person: null,
            function: null,
        });
        setValues(Object.assign(Object.assign({}, values), { people }));
    };
    const handleRemovePeople = (keyId) => {
        let people = values.people || [];
        people = people === null || people === void 0 ? void 0 : people.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
        setValues(Object.assign(Object.assign({}, values), { people }));
    };
    const approvePerson = (item, index) => {
        setLoading(Object.assign(Object.assign({}, loading), { [index]: true }));
        dispatch(updateEnvolvedPerson(item === null || item === void 0 ? void 0 : item.id, teamId, {
            [`${PREFIX}AprovadoPor@odata.bind`]: `/${PERSON}(${currentUser === null || currentUser === void 0 ? void 0 : currentUser[`${PREFIX}pessoaid`]})`,
            [`${PREFIX}datahoraaprovacao`]: moment().format(),
        }, {
            onSuccess: (sch) => {
                setLoading(Object.assign(Object.assign({}, loading), { [index]: false }));
                setTeam(sch);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setLoading(Object.assign(Object.assign({}, loading), { [index]: false }));
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const editPerson = (item, index) => {
        setLoading(Object.assign(Object.assign({}, loading), { [index]: true }));
        dispatch(updateEnvolvedPerson(item === null || item === void 0 ? void 0 : item.id, teamId, {
            [`${PREFIX}AprovadoPor@odata.bind`]: null,
            [`${PREFIX}datahoraaprovacao`]: null,
        }, {
            onSuccess: (sch) => {
                setLoading(Object.assign(Object.assign({}, loading), { [index]: false }));
                setTeam(sch);
                notification.success({
                    title: 'Sucesso',
                    description: 'Atualização realizada com sucesso',
                });
            },
            onError: (err) => {
                var _a, _b;
                setLoading(Object.assign(Object.assign({}, loading), { [index]: false }));
                notification.error({
                    title: 'Falha',
                    description: (_b = (_a = err === null || err === void 0 ? void 0 : err.data) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.message,
                });
            },
        }));
    };
    const handleEditPerson = (item, index) => {
        confirmation.openConfirmation({
            onConfirm: () => editPerson(item, index),
            title: 'Confirmação',
            description: 'Ao confirmar a pessoa irá precisar de uma nova aprovação, tem certeza de realizar essa ação',
        });
    };
    const canApprove = (envolvedPerson) => {
        var _a, _b, _c, _d, _e;
        // IS TEACHER AND IS AREA CHIEF
        if ((((_a = envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson.function) === null || _a === void 0 ? void 0 : _a.needApprove) &&
            ((_b = envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson.function) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`]) === EFatherTag.PROFESSOR) ||
            ((_d = (_c = envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson.function) === null || _c === void 0 ? void 0 : _c[`${PREFIX}Etiqueta_Pai`]) === null || _d === void 0 ? void 0 : _d.some((fatherTag) => (fatherTag === null || fatherTag === void 0 ? void 0 : fatherTag[`${PREFIX}nome`]) === EFatherTag.PROFESSOR))) {
            return currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAreaChief;
        }
        // NEED APPROVE AND CURRENT USER IS FROM PLANNING
        if ((_e = envolvedPerson === null || envolvedPerson === void 0 ? void 0 : envolvedPerson.function) === null || _e === void 0 ? void 0 : _e.needApprove) {
            return currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning;
        }
    };
    const handleChangePerson = (idx, person) => {
        var _a, _b;
        const functions = [];
        setFieldValue(`people[${idx}].person`, person);
        if (!((_a = values === null || values === void 0 ? void 0 : values.people) === null || _a === void 0 ? void 0 : _a[idx].isRequired)) {
            (_b = person === null || person === void 0 ? void 0 : person[`${PREFIX}Pessoa_Etiqueta_Etiqueta`]) === null || _b === void 0 ? void 0 : _b.forEach((tag) => {
                var _a;
                const fullTag = dictTag[tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}etiquetaid`]];
                if ((_a = fullTag === null || fullTag === void 0 ? void 0 : fullTag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO)) {
                    functions.push(fullTag);
                }
            });
            setFieldValue(`people[${idx}].function`, {});
            const newOptions = Object.assign({}, functionOptions);
            newOptions[idx] = functions;
            setFunctionOptions(newOptions);
        }
    };
    const listPeople = (_a = values === null || values === void 0 ? void 0 : values.people) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted);
    return (React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', flexGrow: 1 }, (_b = values === null || values === void 0 ? void 0 : values.people) === null || _b === void 0 ? void 0 :
        _b.map((item, index) => {
            var _a, _b;
            if (item.deleted)
                return;
            return (React.createElement(Grid, { container: true, spacing: 3, style: { margin: 0, width: '100%' } },
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Box, { display: 'flex', alignItems: 'center' },
                        React.createElement(Autocomplete, { fullWidth: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: (peopleOptions === null || peopleOptions === void 0 ? void 0 : peopleOptions[index]) || persons, disabled: isDetail || !!(item === null || item === void 0 ? void 0 : item[`_${PREFIX}aprovadopor_value`]), filterSelectedOptions: true, value: item.person, getOptionLabel: (option) => option === null || option === void 0 ? void 0 : option.label, onChange: (event, newValue) => {
                                handleChangePerson(index, newValue);
                            }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                                var _a, _b, _c, _d;
                                return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Pessoa', 
                                    // @ts-ignore
                                    error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.people) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.person), 
                                    // @ts-ignore
                                    helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.people) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.person })));
                            } }),
                        React.createElement(Tooltip, { title: 'Adicionar Pessoa' },
                            React.createElement(IconButton, { onClick: () => setNewPerson({ open: true }), disabled: isDetail || !(currentUser === null || currentUser === void 0 ? void 0 : currentUser.isPlanning) },
                                React.createElement(PlusOne, null)))),
                    ((_a = item === null || item === void 0 ? void 0 : item.function) === null || _a === void 0 ? void 0 : _a.needApprove) &&
                        (item === null || item === void 0 ? void 0 : item[`_${PREFIX}aprovadopor_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } },
                            React.createElement(CheckCircle, { fontSize: 'small', style: { color: '#35bb5a' } }),
                            React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Aprovado")),
                        React.createElement(Box, { display: 'flex', justifyContent: 'space-between' }, canApprove(item) && (React.createElement(React.Fragment, null, loading[index] ? (React.createElement(CircularProgress, { size: 15 })) : !isDraft ? (React.createElement(Link, { variant: 'body2', onClick: () => handleEditPerson(item, index), style: {
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            } }, "Editar")) : null))))),
                    React.createElement(Box, { display: 'flex', justifyContent: 'space-between' },
                        React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '10px' } }, ((_b = item === null || item === void 0 ? void 0 : item.function) === null || _b === void 0 ? void 0 : _b.needApprove) &&
                            !(item === null || item === void 0 ? void 0 : item[`_${PREFIX}aprovadopor_value`]) &&
                            !isDraft && (React.createElement(React.Fragment, null,
                            React.createElement(AccessTime, { fontSize: 'small' }),
                            React.createElement(Typography, { variant: 'body2', style: { fontWeight: 'bold' } }, "Pendente Aprova\u00E7\u00E3o")))),
                        canApprove(item) &&
                            !(item === null || item === void 0 ? void 0 : item[`_${PREFIX}aprovadopor_value`]) &&
                            (item === null || item === void 0 ? void 0 : item[`_${PREFIX}pessoa_value`]) && (React.createElement(Box, { display: 'flex', justifyContent: 'flex-end' }, loading[index] ? (React.createElement(CircularProgress, { size: 15 })) : !isDraft && !isDetail ? (React.createElement(Link, { variant: 'body2', onClick: () => approvePerson(item, index), style: { fontWeight: 'bold', cursor: 'pointer' } }, "Aprovar")) : null)))),
                React.createElement(Grid, { item: true, sm: 12, md: 5, lg: 5 },
                    React.createElement(Autocomplete, { options: (functionOptions === null || functionOptions === void 0 ? void 0 : functionOptions[index]) || [], noOptionsText: 'Sem Op\u00E7\u00F5es', filterSelectedOptions: true, disabled: (item === null || item === void 0 ? void 0 : item.isRequired) ||
                            !functionOptions[index] ||
                            isDetail ||
                            !!(item === null || item === void 0 ? void 0 : item[`_${PREFIX}aprovadopor_value`]), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', value: item.function, onChange: (event, newValue) => {
                            setFieldValue(`people[${index}].function`, newValue);
                        }, getOptionSelected: (option, value) => (option === null || option === void 0 ? void 0 : option.value) === (value === null || value === void 0 ? void 0 : value.value), renderInput: (params) => {
                            var _a, _b, _c, _d;
                            return (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Fun\u00E7\u00E3o', 
                                // @ts-ignore
                                error: !!((_b = (_a = errors === null || errors === void 0 ? void 0 : errors.people) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.function), 
                                // @ts-ignore
                                helperText: (_d = (_c = errors === null || errors === void 0 ? void 0 : errors.people) === null || _c === void 0 ? void 0 : _c[index]) === null || _d === void 0 ? void 0 : _d.function })));
                        } })),
                React.createElement(Grid, { item: true, lg: 1, md: 1, sm: 1, xs: 1, style: {
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 25,
                    }, justify: 'center' },
                    listPeople.length &&
                        item.keyId === listPeople[listPeople.length - 1].keyId &&
                        !isDetail && (React.createElement(Add, { onClick: handleAddPeople, style: { color: '#333', cursor: 'pointer' } })),
                    ((listPeople.length &&
                        item.keyId !== listPeople[0].keyId &&
                        !isDetail) ||
                        listPeople.length > 1) &&
                        !isDetail &&
                        !(item === null || item === void 0 ? void 0 : item.isRequired) && (React.createElement(Remove, { onClick: () => handleRemovePeople(item.keyId), style: { color: '#333', cursor: 'pointer' } })))));
        }),
        React.createElement(AddPerson, { open: newPerson.open, handleClose: () => setNewPerson({ open: false }) })));
};
export default EnvolvedPeopleForm;
//# sourceMappingURL=index.js.map