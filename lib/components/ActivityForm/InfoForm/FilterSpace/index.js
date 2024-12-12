import * as React from 'react';
import { Box, Button, Checkbox, Chip, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography, } from '@material-ui/core';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Close, } from '@material-ui/icons';
import { PREFIX } from '~/config/database';
import { EFatherTag } from '~/config/enums';
import { Autocomplete } from '@material-ui/lab';
import { useSelector } from 'react-redux';
const FilterSpace = ({ open, currentSpaces, onClose, onFilterSpace, }) => {
    const [tagFilter, setTagFilter] = React.useState();
    const [itemsSelected, setItemsSelected] = React.useState([]);
    const { space, tag } = useSelector((state) => state);
    const { tags } = tag;
    const { spaces } = space;
    const handleClose = () => {
        setTagFilter(null);
        setItemsSelected([]);
        onClose();
    };
    const handleNext = () => {
        onFilterSpace(itemsSelected);
        handleClose();
    };
    const spaceFilterOptions = React.useMemo(() => tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.TIPO_ESPACO));
    }), []);
    const spaceOptions = React.useMemo(() => {
        if (tagFilter) {
            return spaces === null || spaces === void 0 ? void 0 : spaces.filter((spc) => {
                var _a;
                return (_a = spc === null || spc === void 0 ? void 0 : spc[`${PREFIX}Espaco_Etiqueta_Etiqueta`]) === null || _a === void 0 ? void 0 : _a.some((tg) => 
                // @ts-ignore
                (tg === null || tg === void 0 ? void 0 : tg[`${PREFIX}etiquetaid`]) === (tagFilter === null || tagFilter === void 0 ? void 0 : tagFilter[`${PREFIX}etiquetaid`]));
            });
        }
        return spaces;
    }, [tagFilter]);
    return (React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'md' },
        React.createElement(DialogTitle, null,
            "Filtrar e adicionar espa\u00E7o",
            React.createElement(IconButton, { "aria-label": 'close', onClick: handleClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', flexDirection: 'column', style: { gap: '1rem' } },
                React.createElement(Box, { display: 'flex', flexDirection: 'column', borderRadius: '10px', border: '1px solid #0063a5', padding: '10px', style: { gap: '1rem' } },
                    React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '1rem' } },
                        React.createElement(Typography, { variant: 'body2', color: 'primary', style: { fontWeight: 'bold' } }, "Filtro")),
                    React.createElement(Autocomplete, { fullWidth: true, options: spaceFilterOptions, noOptionsText: 'Sem opções', value: tagFilter, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setTagFilter(newValue), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Etiqueta' }))) })),
                React.createElement(Box, null,
                    React.createElement(Typography, { color: 'primary', style: { fontWeight: 'bold' } }, "Espa\u00E7os adicionados"),
                    React.createElement(Box, { display: 'flex', style: { gap: '10px' } }, currentSpaces.map((spc) => (React.createElement(Chip, { label: spc === null || spc === void 0 ? void 0 : spc.label }))))),
                React.createElement(Autocomplete, { fullWidth: true, multiple: true, disableCloseOnSelect: true, blurOnSelect: false, options: spaceOptions || [], noOptionsText: 'Sem opções', value: itemsSelected, getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option[`${PREFIX}nome`]) || '', onChange: (event, newValue) => setItemsSelected(newValue), renderOption: (option, { selected }) => (React.createElement(React.Fragment, null,
                        React.createElement(Checkbox, { icon: React.createElement(CheckBoxOutlineBlankIcon, { fontSize: 'small' }), checkedIcon: React.createElement(CheckBoxIcon, { color: 'secondary', fontSize: 'small' }), style: { marginRight: 8 }, checked: selected }),
                        option.label)), renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Espa\u00E7os' }))) }),
                React.createElement(Box, { display: 'flex', width: '100%', marginTop: '2rem', padding: '0 4rem', justifyContent: 'center' },
                    React.createElement(Button, { fullWidth: true, onClick: handleNext, variant: 'contained', color: 'primary' }, "Adicionar"))))));
};
export default FilterSpace;
//# sourceMappingURL=index.js.map