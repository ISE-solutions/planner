import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, IconButton, DialogActions, Button, CircularProgress, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Close } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { EFatherTag } from '~/config/enums';
import { PREFIX } from '~/config/database';
const ShareModel = ({ open, currentValue, loading, handleShare, onClose, }) => {
    const [functionToShare, setFunctionToShare] = React.useState([]);
    const { tag } = useSelector((state) => state);
    const { tags, dictTag } = tag;
    React.useEffect(() => {
        if (currentValue && (currentValue === null || currentValue === void 0 ? void 0 : currentValue.length)) {
            const defaultValue = currentValue.map((e) => dictTag === null || dictTag === void 0 ? void 0 : dictTag[e === null || e === void 0 ? void 0 : e[`${PREFIX}etiquetaid`]]);
            setFunctionToShare(defaultValue);
        }
    }, [currentValue]);
    const functionOptions = React.useMemo(() => tags.filter((tag) => {
        var _a;
        return !(tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}excluido`]) &&
            (tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}ativo`]) &&
            ((_a = tag === null || tag === void 0 ? void 0 : tag[`${PREFIX}Etiqueta_Pai`]) === null || _a === void 0 ? void 0 : _a.some((e) => (e === null || e === void 0 ? void 0 : e[`${PREFIX}nome`]) === EFatherTag.FUNCAO));
    }), [tags]);
    const handleShareClick = () => {
        handleShare(functionToShare);
    };
    return (React.createElement(Dialog, { fullWidth: true, open: open, onClose: onClose, maxWidth: 'sm', disableBackdropClick: true },
        React.createElement(DialogTitle, null,
            "Compartilhar modelo para edi\u00E7\u00E3o",
            React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                React.createElement(Close, null))),
        React.createElement(DialogContent, null,
            React.createElement(Autocomplete, { multiple: true, noOptionsText: 'Sem Op\u00E7\u00F5es', options: functionOptions, onChange: (event, newValue) => setFunctionToShare(newValue), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Etiqueta' }))), value: functionToShare })),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { variant: 'contained', color: 'primary', onClick: handleShareClick }, loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#fff' } })) : ('Compartilhar')))));
};
export default ShareModel;
//# sourceMappingURL=index.js.map