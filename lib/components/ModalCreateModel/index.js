import * as React from 'react';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, } from '@material-ui/core';
import { Close } from '@material-ui/icons';
const ModalCreateModel = ({ open, onClose, onSave, values, setFieldValue, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Dialog, { open: open, fullWidth: true, maxWidth: 'sm' },
            React.createElement(DialogTitle, null,
                "Deseja preservar os recursos?",
                React.createElement(IconButton, { "aria-label": 'close', onClick: onClose, style: { position: 'absolute', right: 8, top: 8 } },
                    React.createElement(Close, null))),
            React.createElement(DialogContent, null,
                React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.loadSpaces, onChange: (event) => setFieldValue('loadSpaces', event.target.checked), name: 'loadSpaces', color: 'primary' }), label: 'Espa\u00E7os' }),
                React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: values.loadPerson, onChange: (event) => setFieldValue('loadPerson', event.target.checked), name: 'loadPerson', color: 'primary' }), label: 'Pessoas' })),
            React.createElement(DialogActions, null,
                React.createElement(Box, { display: 'flex', justifyContent: 'flex-end', style: { gap: '10px' } },
                    React.createElement(Button, { color: 'primary', onClick: onClose }, "Cancelar"),
                    React.createElement(Button, { variant: 'contained', color: 'primary', onClick: () => onSave() }, "Criar"))))));
};
export default ModalCreateModel;
//# sourceMappingURL=index.js.map